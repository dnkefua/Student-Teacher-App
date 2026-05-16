// POST /api/connectors/secrets
// Body: { platform, schoolId, credentialLabel }
//
// PRODUCTION FLOW (not yet wired end-to-end):
//   1. Admin enters a token / OAuth client secret in the Connector Setup
//      modal. The real value SHOULD be POSTed here (over HTTPS) only when
//      this route is configured to forward to Google Secret Manager.
//   2. This route writes the secret to Secret Manager and returns the
//      Secret Manager resource name as `secretRef`.
//   3. The client persists ONLY the secretRef in Firestore.
//
// TODAY (prototype): we never accept or persist the raw secret. The route
// returns a deterministic demo secretRef so the rest of the pipeline can
// run without any real credentials.

import { NextResponse } from 'next/server';
import { buildDemoSecretRef } from '@/lib/connectors/security';
import type { ConnectorPlatform } from '@/lib/connectors/types';
import { DEMO_SCHOOL_ID } from '@/lib/learningHub/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  let body: { platform: ConnectorPlatform; schoolId?: string; credentialLabel?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }
  if (!body.platform) {
    return NextResponse.json({ error: 'platform is required.' }, { status: 400 });
  }
  const schoolId = body.schoolId ?? DEMO_SCHOOL_ID;

  // TODO production: write the raw secret (request.json().secret) to
  // Secret Manager using @google-cloud/secret-manager and return the
  // resource name. Until then we return a demo marker.
  const secretRef = buildDemoSecretRef(schoolId, body.platform);

  return NextResponse.json({
    secretRef,
    storedIn: 'demo',
    notice:
      'This is a prototype demo endpoint. In production this route writes the secret to Google Secret Manager and returns the resource name.',
  });
}
