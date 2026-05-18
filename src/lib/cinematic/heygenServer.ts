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

export function isHeyGenConfigured(): boolean {
  return Boolean(process.env.HEYGEN_API_KEY);
}

export function validateHeyGenEnv(): {
  ok: boolean;
  source: 'heygen' | 'mock';
  message: string;
} {
  const apiKey = process.env.HEYGEN_API_KEY;
  const avatarId = process.env.HEYGEN_DEFAULT_AVATAR_ID;
  const voiceId = process.env.HEYGEN_DEFAULT_VOICE_ID;

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
  void input;

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

  return {
    videoId: `mock-heygen-interface-ready-${Date.now()}`,
    status: 'demo',
    videoUrl: null,
    thumbnailUrl: null,
    message:
      'HeyGen environment variables are present, but production endpoint mapping is not enabled in this build. The interface is ready for final HeyGen account-specific setup.',
    source: 'mock',
  };
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

  return {
    videoId,
    status: 'demo',
    videoUrl: null,
    thumbnailUrl: null,
    message:
      'HeyGen environment variables are present, but production status endpoint mapping is not enabled in this build. The interface is ready for final HeyGen account-specific setup.',
    source: 'mock',
  };
}
