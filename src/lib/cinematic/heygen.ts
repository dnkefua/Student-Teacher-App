import type { HeyGenLessonVideoSpec } from './types';

const HEYGEN_GENERATE_URL = 'https://api.heygen.com/v2/video/generate';
const HEYGEN_STATUS_URL = 'https://api.heygen.com/v1/video_status.get';
const HEYGEN_AVATARS_URL = 'https://api.heygen.com/v2/avatars';
const HEYGEN_VOICES_URL = 'https://api.heygen.com/v2/voices';

export type CreateHeyGenVideoInput = {
  lessonId: string;
  title: string;
  script: string;
  avatarStyle: string;
  voiceStyle: string;
  aspectRatio: '16:9' | '9:16';
  includeCaptions: boolean;
  videoPurpose?: HeyGenLessonVideoSpec['videoPurpose'];
};

export type CreateHeyGenVideoResult = {
  videoId: string;
  status: 'queued' | 'processing' | 'generated' | 'failed' | 'demo';
  estimatedPurpose: HeyGenLessonVideoSpec['videoPurpose'];
  source: 'heygen' | 'mock';
  videoUrl?: string | null;
  message?: string;
  retryable?: boolean;
};

export type HeyGenStatusResult = {
  videoId: string;
  status: 'queued' | 'processing' | 'generated' | 'failed' | 'demo';
  videoUrl?: string | null;
  thumbnailUrl?: string | null;
  source: 'heygen' | 'mock';
  message?: string;
  retryable?: boolean;
};

export type HeyGenValidationCheck = {
  name: 'api_key' | 'avatar_id' | 'voice_id';
  ok: boolean;
  message: string;
  status?: 'configured' | 'verified' | 'missing' | 'unverified' | 'failed';
};

export type HeyGenValidationResult = {
  ok: boolean;
  source: 'heygen' | 'mock';
  checks: HeyGenValidationCheck[];
  message: string;
  retryable?: boolean;
};

export class HeyGenServiceError extends Error {
  statusCode: number;
  retryable: boolean;

  constructor(message: string, options: { statusCode?: number; retryable?: boolean } = {}) {
    super(message);
    this.name = 'HeyGenServiceError';
    this.statusCode = options.statusCode ?? 502;
    this.retryable = Boolean(options.retryable);
  }
}

function env(key: string): string | null {
  const value = process.env[key];
  return value && value.trim().length > 0 ? value.trim() : null;
}

function isTimeoutLike(err: unknown): boolean {
  if (!err || typeof err !== 'object') return false;
  const value = err as { name?: string; message?: string };
  return value.name === 'AbortError' || value.name === 'TimeoutError' || /timeout|aborted/i.test(value.message ?? '');
}

function normaliseFetchError(err: unknown, label: string): HeyGenServiceError {
  if (err instanceof HeyGenServiceError) return err;
  if (isTimeoutLike(err)) {
    return new HeyGenServiceError(`${label} timed out. Check local network access to api.heygen.com and try again.`, {
      statusCode: 504,
      retryable: true,
    });
  }
  return new HeyGenServiceError(`${label} could not reach HeyGen.`, { statusCode: 502, retryable: true });
}

export function validateHeyGenCreateInput(raw: unknown): CreateHeyGenVideoInput | null {
  if (!raw || typeof raw !== 'object') return null;
  const value = raw as Partial<CreateHeyGenVideoInput>;
  if (typeof value.lessonId !== 'string' || value.lessonId.length < 2) return null;
  if (typeof value.title !== 'string' || value.title.length < 2) return null;
  if (typeof value.script !== 'string' || value.script.length < 20) return null;
  const aspectRatio = value.aspectRatio === '16:9' || value.aspectRatio === '9:16' ? value.aspectRatio : null;
  if (!aspectRatio) return null;
  return {
    lessonId: value.lessonId,
    title: value.title,
    script: value.script.slice(0, 1800),
    avatarStyle: String(value.avatarStyle ?? 'professional_teacher'),
    voiceStyle: String(value.voiceStyle ?? 'warm_confident'),
    aspectRatio,
    includeCaptions: Boolean(value.includeCaptions),
    videoPurpose: value.videoPurpose ?? 'lesson_intro',
  };
}

export function heygenDemoResponse(input: CreateHeyGenVideoInput): CreateHeyGenVideoResult {
  return {
    videoId: 'mock-heygen-video',
    status: 'demo',
    videoUrl: null,
    estimatedPurpose: input.videoPurpose ?? 'lesson_intro',
    source: 'mock',
    message: 'HeyGen demo mode: configure HEYGEN_API_KEY to generate real avatar videos.',
  };
}

function findByKnownId(list: unknown, key: string, idValue: string): boolean | null {
  if (!Array.isArray(list)) return null;
  return list.some((item) => {
    if (!item || typeof item !== 'object') return false;
    const record = item as Record<string, unknown>;
    return record[key] === idValue || record.id === idValue;
  });
}

function pickList(json: unknown, keys: string[]): unknown {
  if (!json || typeof json !== 'object') return null;
  const root = json as Record<string, unknown>;
  for (const key of keys) {
    const direct = root[key];
    if (Array.isArray(direct)) return direct;
    const data = root.data;
    if (data && typeof data === 'object') {
      const nested = (data as Record<string, unknown>)[key];
      if (Array.isArray(nested)) return nested;
    }
  }
  return null;
}

async function heygenGet(url: string, apiKey: string): Promise<unknown> {
  let res: Response;
  try {
    res = await fetch(url, {
      signal: AbortSignal.timeout(12000),
      headers: {
        Accept: 'application/json',
        'X-Api-Key': apiKey,
      },
    });
  } catch (err) {
    throw normaliseFetchError(err, 'HeyGen validation');
  }
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new HeyGenServiceError(`HeyGen validation failed (${res.status}): ${body.slice(0, 240)}`, {
      statusCode: res.status,
      retryable: res.status === 429 || res.status >= 500,
    });
  }
  return res.json();
}

export async function validateHeyGenConfiguration(): Promise<HeyGenValidationResult> {
  const apiKey = env('HEYGEN_API_KEY');
  const avatarId = env('HEYGEN_DEFAULT_AVATAR_ID');
  const voiceId = env('HEYGEN_DEFAULT_VOICE_ID');
  const checks: HeyGenValidationCheck[] = [
    { name: 'api_key', ok: Boolean(apiKey), status: apiKey ? 'configured' : 'missing', message: apiKey ? 'API key is configured server-side.' : 'HEYGEN_API_KEY is missing.' },
    { name: 'avatar_id', ok: Boolean(avatarId), status: avatarId ? 'configured' : 'missing', message: avatarId ? 'Default avatar id is configured.' : 'HEYGEN_DEFAULT_AVATAR_ID is missing.' },
    { name: 'voice_id', ok: Boolean(voiceId), status: voiceId ? 'configured' : 'missing', message: voiceId ? 'Default voice id is configured.' : 'HEYGEN_DEFAULT_VOICE_ID is missing.' },
  ];

  if (!apiKey || !avatarId || !voiceId) {
    return {
      ok: false,
      source: 'mock',
      checks,
      message: 'HeyGen demo mode is active. Add HEYGEN_API_KEY, HEYGEN_DEFAULT_AVATAR_ID, and HEYGEN_DEFAULT_VOICE_ID to enable real validation.',
    };
  }

  const [avatarResult, voiceResult] = await Promise.allSettled([heygenGet(HEYGEN_AVATARS_URL, apiKey), heygenGet(HEYGEN_VOICES_URL, apiKey)]);
  const avatarError = avatarResult.status === 'rejected' ? normaliseFetchError(avatarResult.reason, 'HeyGen avatar validation') : null;
  const voiceError = voiceResult.status === 'rejected' ? normaliseFetchError(voiceResult.reason, 'HeyGen voice validation') : null;
  const avatars = avatarResult.status === 'fulfilled' ? pickList(avatarResult.value, ['avatars', 'avatar_list']) : null;
  const voices = voiceResult.status === 'fulfilled' ? pickList(voiceResult.value, ['voices', 'voice_list']) : null;
  const avatarFound = findByKnownId(avatars, 'avatar_id', avatarId);
  const voiceFound = findByKnownId(voices, 'voice_id', voiceId);

  checks[1] = {
    name: 'avatar_id',
    ok: avatarFound !== false && !avatarError,
    status: avatarError ? 'failed' : avatarFound === false ? 'unverified' : 'verified',
    message: avatarError?.message ?? (avatarFound === false ? 'Default avatar id was not found in the HeyGen account.' : 'Default avatar id is accepted by HeyGen.'),
  };
  checks[2] = {
    name: 'voice_id',
    ok: voiceFound !== false && !voiceError,
    status: voiceError ? 'failed' : voiceFound === false ? 'unverified' : 'verified',
    message: voiceError?.message ?? (voiceFound === false ? 'Default voice id was not found in the HeyGen account.' : 'Default voice id is accepted by HeyGen.'),
  };

  const ok = checks.every((check) => check.ok);
  const retryable = Boolean(avatarError?.retryable || voiceError?.retryable);
  return {
    ok,
    source: 'heygen',
    checks,
    retryable,
    message: ok
      ? 'HeyGen API key, default avatar, and default voice validated successfully.'
      : retryable
        ? 'HeyGen configuration is present, but validation could not complete because the service or network timed out.'
        : 'HeyGen is reachable, but one or more configured ids could not be verified.',
  };
}

function dimensions(aspectRatio: '16:9' | '9:16'): { width: number; height: number } {
  return aspectRatio === '9:16' ? { width: 720, height: 1280 } : { width: 1280, height: 720 };
}

export async function createHeyGenLessonVideo(input: CreateHeyGenVideoInput): Promise<CreateHeyGenVideoResult> {
  const apiKey = env('HEYGEN_API_KEY');
  const avatarId = env('HEYGEN_DEFAULT_AVATAR_ID');
  const voiceId = env('HEYGEN_DEFAULT_VOICE_ID');
  if (!apiKey || !avatarId || !voiceId) return heygenDemoResponse(input);

  const callbackUrl = env('HEYGEN_CALLBACK_URL');
  let res: Response;
  try {
    res = await fetch(HEYGEN_GENERATE_URL, {
      method: 'POST',
      signal: AbortSignal.timeout(20000),
      headers: {
        'Content-Type': 'application/json',
        'X-Api-Key': apiKey,
      },
      body: JSON.stringify({
        title: input.title,
        caption: input.includeCaptions,
        callback_id: input.lessonId,
        callback_url: callbackUrl ?? undefined,
        dimension: dimensions(input.aspectRatio),
        video_inputs: [
          {
            character: {
              type: 'avatar',
              avatar_id: avatarId,
              avatar_style: 'normal',
            },
            voice: {
              type: 'text',
              input_text: input.script,
              voice_id: voiceId,
            },
          },
        ],
      }),
    });
  } catch (err) {
    throw normaliseFetchError(err, 'HeyGen video creation');
  }

  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new HeyGenServiceError(`HeyGen create failed (${res.status}): ${body.slice(0, 240)}`, {
      statusCode: res.status,
      retryable: res.status === 429 || res.status >= 500,
    });
  }

  const json = (await res.json()) as { data?: { video_id?: string }; video_id?: string };
  const videoId = json.data?.video_id ?? json.video_id;
  if (!videoId) throw new Error('HeyGen did not return a video id.');

  return {
    videoId,
    status: 'queued',
    estimatedPurpose: input.videoPurpose ?? 'lesson_intro',
    source: 'heygen',
    videoUrl: null,
  };
}

export async function getHeyGenVideoStatus(videoId: string): Promise<HeyGenStatusResult> {
  const apiKey = env('HEYGEN_API_KEY');
  if (!apiKey) {
    return {
      videoId,
      status: 'demo',
      videoUrl: null,
      source: 'mock',
      message: 'HeyGen demo mode: configure HEYGEN_API_KEY to check real video status.',
    };
  }

  let res: Response;
  try {
    res = await fetch(`${HEYGEN_STATUS_URL}?video_id=${encodeURIComponent(videoId)}`, {
      signal: AbortSignal.timeout(12000),
      headers: { 'X-Api-Key': apiKey },
    });
  } catch (err) {
    throw normaliseFetchError(err, 'HeyGen status check');
  }
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new HeyGenServiceError(`HeyGen status failed (${res.status}): ${body.slice(0, 240)}`, {
      statusCode: res.status,
      retryable: res.status === 429 || res.status >= 500,
    });
  }
  const json = (await res.json()) as {
    data?: {
      status?: string;
      video_url?: string;
      thumbnail_url?: string;
    };
    status?: string;
    video_url?: string;
    thumbnail_url?: string;
  };
  const status = json.data?.status ?? json.status;
  const mapped =
    status === 'completed' || status === 'generated' || status === 'ready'
      ? 'generated'
      : status === 'failed'
        ? 'failed'
        : status === 'processing' || status === 'waiting'
          ? 'processing'
          : 'queued';
  return {
    videoId,
    status: mapped,
    videoUrl: json.data?.video_url ?? json.video_url ?? null,
    thumbnailUrl: json.data?.thumbnail_url ?? json.thumbnail_url ?? null,
    source: 'heygen',
  };
}
