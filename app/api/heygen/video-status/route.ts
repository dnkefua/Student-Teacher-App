import { NextResponse } from 'next/server';
import { getHeyGenVideoStatus } from '@/lib/cinematic/heygen';

export const runtime = 'nodejs';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const videoId = url.searchParams.get('videoId');
  if (!videoId) return NextResponse.json({ message: 'videoId is required.' }, { status: 400 });

  try {
    return NextResponse.json(await getHeyGenVideoStatus(videoId));
  } catch (err) {
    return NextResponse.json(
      {
        videoId,
        status: 'failed',
        source: 'mock',
        videoUrl: null,
        message: err instanceof Error ? err.message : 'HeyGen status check failed.',
      },
      { status: 502 },
    );
  }
}
