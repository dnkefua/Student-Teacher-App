import { NextResponse } from 'next/server';
import { createHeyGenLessonVideo, HeyGenServiceError, validateHeyGenCreateInput } from '@/lib/cinematic/heygen';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const input = validateHeyGenCreateInput(await request.json().catch(() => null));
  if (!input) {
    return NextResponse.json({ message: 'Invalid HeyGen lesson video input.' }, { status: 400 });
  }

  try {
    const result = await createHeyGenLessonVideo(input);
    return NextResponse.json(result);
  } catch (err) {
    const statusCode = err instanceof HeyGenServiceError ? err.statusCode : 502;
    return NextResponse.json(
      {
        videoId: 'mock-heygen-video',
        status: 'failed',
        source: 'heygen',
        estimatedPurpose: input.videoPurpose ?? 'lesson_intro',
        videoUrl: null,
        message: err instanceof Error ? err.message : 'HeyGen video generation failed.',
        retryable: err instanceof HeyGenServiceError ? err.retryable : true,
      },
      { status: statusCode },
    );
  }
}
