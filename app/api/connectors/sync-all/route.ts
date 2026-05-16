// POST /api/connectors/sync-all
// Intended for Cloud Scheduler. Requires `x-cron-secret` header when
// CONNECTOR_CRON_SECRET is configured on the server. Without that env,
// the route runs unauthenticated for local dev — guard at the network
// edge for production deployments.

import { NextResponse } from 'next/server';
import { runAllEnabledSyncs } from '@/lib/connectors/syncRunner';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const expected = process.env.CONNECTOR_CRON_SECRET;
  if (expected) {
    const got = request.headers.get('x-cron-secret');
    if (got !== expected) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }
  }
  const results = await runAllEnabledSyncs();
  return NextResponse.json({
    runs: results.length,
    results: results.map((r) => ({
      job: r.job,
      eventsCreated: r.eventsCreated,
      importsCreated: r.importsCreated,
      warnings: r.warnings,
    })),
  });
}
