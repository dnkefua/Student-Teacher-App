import { NextResponse } from 'next/server';
import { getHeyGenVideoStatus } from '@/lib/cinematic/heygenServer';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const videoId = url.searchParams.get('videoId');
  if (!videoId) return NextResponse.json({ message: 'videoId is required.' }, { status: 400 });

  try {
    return NextResponse.json(await getHeyGenVideoStatus(videoId));
  } catch {
    return NextResponse.json({ message: 'Could not check HeyGen video status.' }, { status: 500 });
  }
}
