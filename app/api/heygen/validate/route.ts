import { NextResponse } from 'next/server';
import { validateHeyGenEnv } from '@/lib/cinematic/heygenServer';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json(validateHeyGenEnv());
}
