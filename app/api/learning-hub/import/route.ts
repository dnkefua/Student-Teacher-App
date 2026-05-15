// Server-side import endpoint (placeholder).
//
// Today CSV/XLSX parsing runs in the browser via papaparse + xlsx, which
// keeps student data inside the teacher's session until the teacher hits
// Save. This route is the seam for moving parsing onto the server once the
// school wants centralised audit logs and chunked uploads. The contract is:
// POST a multipart file → returns ImportParseResult JSON.

import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST() {
  return NextResponse.json(
    {
      source: 'stub',
      reason: 'Server-side import parsing is not yet enabled. Use the in-browser Upload Reports flow.',
    },
    { status: 200 },
  );
}
