// POST /api/connectors/sync
// Body: { schoolId?, platform, connectionId }
// Runs runSyncForPlatform — returns the finished SyncJob.

import { NextResponse } from 'next/server';
import { runConnectorSync } from '@/lib/connectors/repository';
import type { ConnectorPlatform } from '@/lib/connectors/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  let body: { schoolId?: string; platform: ConnectorPlatform; connectionId: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }
  if (!body.platform || !body.connectionId) {
    return NextResponse.json({ error: 'platform and connectionId are required.' }, { status: 400 });
  }
  try {
    const job = await runConnectorSync(body);
    return NextResponse.json({ job });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Sync failed.' },
      { status: 502 },
    );
  }
}
