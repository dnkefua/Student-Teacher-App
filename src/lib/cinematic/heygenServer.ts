import 'server-only';

export type HeyGenCreateLessonVideoInput = {
  lessonId: string;
  title: string;
  script: string;
  avatarStyle?: string;
  voiceStyle?: string;
  aspectRatio: '16:9' | '9:16';
  includeCaptions?: boolean;
  videoPurpose?: string;
};

export type HeyGenCreateLessonVideoResult = {
  videoId: string;
  status: 'queued' | 'processing' | 'generated' | 'failed' | 'demo';
  videoUrl?: string | null;
  thumbnailUrl?: string | null;
  message?: string;
  source: 'heygen' | 'mock';
};

function hasValue(value: string | undefined): boolean {
  return Boolean(value && value.trim().length > 0);
}

function mapHeyGenStatus(status: unknown): HeyGenCreateLessonVideoResult['status'] {
  const value = typeof status === 'string' ? status.toLowerCase() : '';
  if (['completed', 'complete', 'done', 'success', 'generated'].includes(value)) return 'generated';
  if (['failed', 'error'].includes(value)) return 'failed';
  if (['waiting', 'pending', 'queued'].includes(value)) return 'queued';
  return 'processing';
}

function stringFrom(value: unknown): string | null {
  return typeof value === 'string' && value.trim().length > 0 ? value : null;
}

function heyGenErrorMessage(raw: unknown): string {
  if (typeof raw !== 'object' || raw === null) {
    return 'HeyGen rejected the video request. Check avatar, voice, plan access, and API credits in HeyGen.';
  }
  const record = raw as Record<string, unknown>;
  const data = typeof record.data === 'object' && record.data !== null ? (record.data as Record<string, unknown>) : {};
  const message =
    stringFrom(record.message) ??
    stringFrom(record.error) ??
    stringFrom(data.message) ??
    stringFrom(data.error);
  return message
    ? `HeyGen rejected the video request: ${message}`
    : 'HeyGen rejected the video request. Check avatar, voice, plan access, and API credits in HeyGen.';
}

function readHeyGenCreateVideoId(raw: unknown): string | null {
  if (typeof raw !== 'object' || raw === null) return null;
  const record = raw as Record<string, unknown>;
  const data = typeof record.data === 'object' && record.data !== null ? (record.data as Record<string, unknown>) : null;
  return (
    stringFrom(record.video_id) ??
    stringFrom(record.id) ??
    stringFrom(data?.video_id) ??
    stringFrom(data?.id)
  );
}

function readHeyGenStatusResult(videoId: string, raw: unknown): HeyGenCreateLessonVideoResult {
  const record = typeof raw === 'object' && raw !== null ? (raw as Record<string, unknown>) : {};
  const data = typeof record.data === 'object' && record.data !== null ? (record.data as Record<string, unknown>) : record;
  const status = mapHeyGenStatus(data.status ?? record.status);
  return {
    videoId,
    status,
    videoUrl: stringFrom(data.video_url) ?? stringFrom(data.videoUrl) ?? stringFrom(data.url),
    thumbnailUrl: stringFrom(data.thumbnail_url) ?? stringFrom(data.thumbnailUrl),
    message: status === 'generated'
      ? 'HeyGen video is ready.'
      : status === 'failed'
        ? 'HeyGen video generation failed. Check your HeyGen dashboard for details.'
        : 'HeyGen video is still rendering. Check status again shortly.',
    source: 'heygen',
  };
}

export function isHeyGenConfigured(): boolean {
  return Boolean(process.env.HEYGEN_API_KEY);
}

export function validateHeyGenEnv(): {
  ok: boolean;
  source: 'heygen' | 'mock';
  message: string;
} {
  const apiKey = process.env.HEYGEN_API_KEY?.trim();
  const avatarId = process.env.HEYGEN_DEFAULT_AVATAR_ID?.trim();
  const voiceId = process.env.HEYGEN_DEFAULT_VOICE_ID?.trim();

  if (!hasValue(apiKey)) {
    return {
      ok: false,
      source: 'mock',
      message:
        'HeyGen is in demo mode. Add HEYGEN_API_KEY, HEYGEN_DEFAULT_AVATAR_ID, and HEYGEN_DEFAULT_VOICE_ID to enable real avatar video generation.',
    };
  }

  if (!hasValue(avatarId) || !hasValue(voiceId)) {
    return {
      ok: true,
      source: 'heygen',
      message:
        'HEYGEN_API_KEY is present, but HEYGEN_DEFAULT_AVATAR_ID or HEYGEN_DEFAULT_VOICE_ID is missing. Add defaults or extend the UI to select avatar and voice.',
    };
  }

  return {
    ok: true,
    source: 'heygen',
    message: 'HeyGen environment variables are present. Run a short test video before production use.',
  };
}

export async function createHeyGenLessonVideo(
  input: HeyGenCreateLessonVideoInput,
): Promise<HeyGenCreateLessonVideoResult> {
  if (!isHeyGenConfigured()) {
    return {
      videoId: `mock-heygen-video-${Date.now()}`,
      status: 'demo',
      videoUrl: null,
      thumbnailUrl: null,
      message: 'HeyGen demo mode: configure HEYGEN_API_KEY to generate real avatar videos.',
      source: 'mock',
    };
  }

  const apiKey = process.env.HEYGEN_API_KEY?.trim();
  const avatarId = process.env.HEYGEN_DEFAULT_AVATAR_ID?.trim();
  const voiceId = process.env.HEYGEN_DEFAULT_VOICE_ID?.trim();

  if (!apiKey || !avatarId || !voiceId) {
    return {
      videoId: `mock-heygen-missing-defaults-${Date.now()}`,
      status: 'demo',
      videoUrl: null,
      thumbnailUrl: null,
      message:
        'HeyGen API key is present, but HEYGEN_DEFAULT_AVATAR_ID or HEYGEN_DEFAULT_VOICE_ID is missing. Add both defaults to generate real HD avatar videos.',
      source: 'mock',
    };
  }

  try {
    const isPortrait = input.aspectRatio === '9:16';
    const width = Number(process.env.HEYGEN_VIDEO_WIDTH) || (isPortrait ? 720 : 1280);
    const height = Number(process.env.HEYGEN_VIDEO_HEIGHT) || (isPortrait ? 1280 : 720);

    const response = await fetch('https://api.heygen.com/v2/video/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Api-Key': apiKey,
      },
      body: JSON.stringify({
        title: input.title,
        caption: Boolean(input.includeCaptions),
        dimension: { width, height },
        video_inputs: [
          {
            character: {
              type: 'avatar',
              avatar_id: avatarId,
              avatar_style: 'normal',
            },
            voice: {
              type: 'text',
              input_text: input.script.slice(0, 5000),
              voice_id: voiceId,
              speed: 1,
            },
            background: {
              type: 'color',
              value: '#050711',
            },
          },
        ],
        ...(process.env.HEYGEN_CALLBACK_URL ? { callback_url: process.env.HEYGEN_CALLBACK_URL } : {}),
      }),
    });

    const raw = (await response.json().catch(() => null)) as unknown;
    if (!response.ok) {
      return {
        videoId: `mock-heygen-error-${Date.now()}`,
        status: 'failed',
        videoUrl: null,
        thumbnailUrl: null,
        message: heyGenErrorMessage(raw),
        source: 'heygen',
      };
    }

    const videoId = readHeyGenCreateVideoId(raw);
    if (!videoId) {
      return {
        videoId: `mock-heygen-unreadable-${Date.now()}`,
        status: 'failed',
        videoUrl: null,
        thumbnailUrl: null,
        message: 'HeyGen responded, but the video id could not be read from the response.',
        source: 'heygen',
      };
    }

    return {
      videoId,
      status: 'queued',
      videoUrl: null,
      thumbnailUrl: null,
      message: 'HeyGen HD video generation queued. Use Check Status until the video URL is ready.',
      source: 'heygen',
    };
  } catch {
    return {
      videoId: `mock-heygen-network-${Date.now()}`,
      status: 'failed',
      videoUrl: null,
      thumbnailUrl: null,
      message: 'Could not reach HeyGen from the server. Check network access and HeyGen API availability.',
      source: 'heygen',
    };
  }
}

export async function getHeyGenVideoStatus(videoId: string): Promise<HeyGenCreateLessonVideoResult> {
  if (!isHeyGenConfigured() || videoId.startsWith('mock')) {
    return {
      videoId,
      status: 'demo',
      videoUrl: null,
      thumbnailUrl: null,
      message: 'HeyGen demo mode: configure HEYGEN_API_KEY to check real avatar video status.',
      source: 'mock',
    };
  }

  const apiKey = process.env.HEYGEN_API_KEY?.trim();
  if (!apiKey) {
    return {
      videoId,
      status: 'demo',
      videoUrl: null,
      thumbnailUrl: null,
      message: 'HeyGen demo mode: configure HEYGEN_API_KEY to check real avatar video status.',
      source: 'mock',
    };
  }

  try {
    const url = new URL('https://api.heygen.com/v1/video_status.get');
    url.searchParams.set('video_id', videoId);
    const response = await fetch(url, {
      headers: { 'X-Api-Key': apiKey },
    });
    const raw = (await response.json().catch(() => null)) as unknown;
    if (!response.ok) {
      return {
        videoId,
        status: 'failed',
        videoUrl: null,
        thumbnailUrl: null,
        message: 'Could not retrieve HeyGen status. Confirm the video id belongs to this API account.',
        source: 'heygen',
      };
    }
    return readHeyGenStatusResult(videoId, raw);
  } catch {
    return {
      videoId,
      status: 'failed',
      videoUrl: null,
      thumbnailUrl: null,
      message: 'Could not reach HeyGen status endpoint from the server.',
      source: 'heygen',
    };
  }
}
