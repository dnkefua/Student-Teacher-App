import { NextResponse } from 'next/server';
import { createHeyGenLessonVideo, type HeyGenCreateLessonVideoInput } from '@/lib/cinematic/heygenServer';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function parseInput(raw: unknown): HeyGenCreateLessonVideoInput | { message: string } {
  if (!raw || typeof raw !== 'object') return { message: 'Invalid HeyGen lesson video input.' };

  const value = raw as Record<string, unknown>;
  if (typeof value.lessonId !== 'string' || value.lessonId.trim().length === 0) {
    return { message: 'lessonId is required.' };
  }
  if (typeof value.title !== 'string' || value.title.trim().length === 0) {
    return { message: 'title is required.' };
  }
  if (typeof value.script !== 'string' || value.script.trim().length === 0) {
    return { message: 'script is required.' };
  }
  if (value.script.length > 5000) {
    return { message: 'script must be 5000 characters or fewer.' };
  }

  const aspectRatio = value.aspectRatio === '9:16' || value.aspectRatio === '16:9' ? value.aspectRatio : '16:9';

  return {
    lessonId: value.lessonId.trim(),
    title: value.title.trim(),
    script: value.script,
    avatarStyle: typeof value.avatarStyle === 'string' ? value.avatarStyle : undefined,
    voiceStyle: typeof value.voiceStyle === 'string' ? value.voiceStyle : undefined,
    aspectRatio,
    includeCaptions: Boolean(value.includeCaptions),
    videoPurpose: typeof value.videoPurpose === 'string' ? value.videoPurpose : undefined,
  };
}

export async function POST(request: Request) {
  const input = parseInput(await request.json().catch(() => null));
  if ('message' in input) return NextResponse.json({ message: input.message }, { status: 400 });

  try {
    return NextResponse.json(await createHeyGenLessonVideo(input));
  } catch {
    return NextResponse.json({ message: 'Could not create HeyGen lesson video.' }, { status: 500 });
  }
}
