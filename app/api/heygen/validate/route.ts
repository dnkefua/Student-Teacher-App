import { NextResponse } from 'next/server';
import { validateHeyGenConfiguration } from '@/lib/cinematic/heygen';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const result = await validateHeyGenConfiguration();
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json(
      {
        ok: false,
        source: 'heygen',
        checks: [],
        message: err instanceof Error ? err.message : 'HeyGen validation failed.',
      },
      { status: 502 },
    );
  }
}
