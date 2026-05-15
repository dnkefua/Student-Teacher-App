// Connector sync endpoint (placeholder).
//
// When the school approves credentials for ManageBac / OneRoster / LTI /
// Caliper / xAPI, the matching connector in src/lib/learningHub/connectors/
// runs from this route. Today every connector throws a "not yet enabled"
// error — that's the audit signal that no real student data leaves the
// approved offline path.

import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST() {
  return NextResponse.json(
    {
      source: 'stub',
      reason: 'Connector sync is not enabled. CSV/XLSX import remains the production path.',
    },
    { status: 200 },
  );
}
