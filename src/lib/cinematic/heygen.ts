import type { HeyGenLessonVideoSpec } from './types';

const HEYGEN_GENERATE_URL = 'https://api.heygen.com/v2/video/generate';
const HEYGEN_STATUS_URL = 'https://api.heygen.com/v1/video_status.get';

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
};

export type HeyGenStatusResult = {
  videoId: string;
  status: 'queued' | 'processing' | 'generated' | 'failed' | 'demo';
  videoUrl?: string | null;
  thumbnailUrl?: string | null;
  source: 'heygen' | 'mock';
  message?: string;
};

function env(key: string): string | null {
  const value = process.env[key];
  return value && value.trim().length > 0 ? value.trim() : null;
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

function dimensions(aspectRatio: '16:9' | '9:16'): { width: number; height: number } {
  return aspectRatio === '9:16' ? { width: 720, height: 1280 } : { width: 1280, height: 720 };
}

export async function createHeyGenLessonVideo(input: CreateHeyGenVideoInput): Promise<CreateHeyGenVideoResult> {
  const apiKey = env('HEYGEN_API_KEY');
  const avatarId = env('HEYGEN_DEFAULT_AVATAR_ID');
  const voiceId = env('HEYGEN_DEFAULT_VOICE_ID');
  if (!apiKey || !avatarId || !voiceId) return heygenDemoResponse(input);

  const callbackUrl = env('HEYGEN_CALLBACK_URL');
  const res = await fetch(HEYGEN_GENERATE_URL, {
    method: 'POST',
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

  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`HeyGen create failed (${res.status}): ${body.slice(0, 240)}`);
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

  const res = await fetch(`${HEYGEN_STATUS_URL}?video_id=${encodeURIComponent(videoId)}`, {
    headers: { 'X-Api-Key': apiKey },
  });
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`HeyGen status failed (${res.status}): ${body.slice(0, 240)}`);
  }
  const json = (await res.json()) as {
    data?: {
      status?: string;
      video_url?: string;
      thumbnail_url?: string;
    };
  };
  const status = json.data?.status;
  const mapped =
    status === 'completed' || status === 'generated'
      ? 'generated'
      : status === 'failed'
        ? 'failed'
        : status === 'processing'
          ? 'processing'
          : 'queued';
  return {
    videoId,
    status: mapped,
    videoUrl: json.data?.video_url ?? null,
    thumbnailUrl: json.data?.thumbnail_url ?? null,
    source: 'heygen',
  };
}
