import { NextResponse } from 'next/server';
import { createHeyGenLessonVideo, validateHeyGenCreateInput } from '@/lib/cinematic/heygen';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  const input = validateHeyGenCreateInput(await request.json().catch(() => null));
  if (!input) {
    return NextResponse.json({ message: 'Invalid HeyGen lesson video input.' }, { status: 400 });
  }

  try {
    const result = await createHeyGenLessonVideo(input);
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json(
      {
        videoId: 'mock-heygen-video',
        status: 'failed',
        source: 'mock',
        estimatedPurpose: input.videoPurpose ?? 'lesson_intro',
        videoUrl: null,
        message: err instanceof Error ? err.message : 'HeyGen video generation failed.',
      },
      { status: 502 },
    );
  }
}
