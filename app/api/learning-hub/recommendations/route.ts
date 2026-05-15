// Learning Hub recommendations endpoint.
//
// Today the deterministic recommendation engine runs entirely client-side
// (see src/lib/learningHub/aiInsights.ts). This route is the seam for
// server-side AI augmentation — once a Gemma 4 prompt is approved, we'll
// proxy through callStructured() and return the same envelope shape.

import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST() {
  return NextResponse.json(
    {
      source: 'stub',
      reason:
        'Server-side recommendation augmentation is not yet wired. The client computes deterministic recommendations from local LearningEvents until this route is enabled.',
    },
    { status: 200 },
  );
}
