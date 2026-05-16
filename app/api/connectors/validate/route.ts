// POST /api/connectors/validate
// Body: { connectionId }
// Wraps repository.validateConnector — returns { ok, message }.

import { NextResponse } from 'next/server';
import { validateConnector } from '@/lib/connectors/repository';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  let body: { connectionId: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }
  if (!body.connectionId) {
    return NextResponse.json({ error: 'connectionId is required.' }, { status: 400 });
  }
  const result = await validateConnector(body.connectionId);
  return NextResponse.json(result);
}
