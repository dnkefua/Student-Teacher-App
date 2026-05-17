import { NextResponse } from 'next/server';
import { getHeyGenVideoStatus, HeyGenServiceError } from '@/lib/cinematic/heygen';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const videoId = url.searchParams.get('videoId');
  if (!videoId) return NextResponse.json({ message: 'videoId is required.' }, { status: 400 });

  try {
    return NextResponse.json(await getHeyGenVideoStatus(videoId));
  } catch (err) {
    const statusCode = err instanceof HeyGenServiceError ? err.statusCode : 502;
    return NextResponse.json(
      {
        videoId,
        status: 'failed',
        source: 'heygen',
        videoUrl: null,
        message: err instanceof Error ? err.message : 'HeyGen status check failed.',
        retryable: err instanceof HeyGenServiceError ? err.retryable : true,
      },
      { status: statusCode },
    );
  }
}
