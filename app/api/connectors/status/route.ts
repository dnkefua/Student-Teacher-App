// GET /api/connectors/status?schoolId=…
// Returns the connector snapshot for dashboards / scheduled health checks.

import { NextResponse } from 'next/server';
import { loadConnectorSnapshot } from '@/lib/connectors/repository';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const schoolId = url.searchParams.get('schoolId') ?? undefined;
  const snapshot = await loadConnectorSnapshot(schoolId);
  return NextResponse.json(snapshot);
}
