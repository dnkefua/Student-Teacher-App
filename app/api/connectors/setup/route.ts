// POST /api/connectors/setup
// Body: { schoolId?, platform, method, displayName, secretRef?, notes? }
// Creates a PlatformCredential. secretRef is opaque — the actual secret
// lives in Google Secret Manager (production) or is the demo marker.

import { NextResponse } from 'next/server';
import { setupConnector } from '@/lib/connectors/repository';
import { assertNoRawSecret } from '@/lib/connectors/security';
import type { ConnectorPlatform, ConnectorMethod } from '@/lib/connectors/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  let body: {
    schoolId?: string;
    platform: ConnectorPlatform;
    method: ConnectorMethod;
    displayName: string;
    secretRef?: string;
    notes?: string;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }
  if (!body.platform || !body.method || !body.displayName) {
    return NextResponse.json({ error: 'platform, method and displayName are required.' }, { status: 400 });
  }
  try {
    assertNoRawSecret(body.secretRef, 'secretRef');
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Security guard rejected payload.' }, { status: 400 });
  }
  const credential = await setupConnector(body);
  return NextResponse.json({ credential });
}
