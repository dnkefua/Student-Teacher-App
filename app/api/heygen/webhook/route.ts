import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  const secret = process.env.HEYGEN_WEBHOOK_SECRET;
  if (secret) {
    const provided = request.headers.get('x-heygen-signature') ?? request.headers.get('x-webhook-secret');
    if (provided !== secret) return NextResponse.json({ message: 'Invalid webhook signature.' }, { status: 401 });
  }

  const payload = await request.json().catch(() => null);
  // Firestore update wiring can be added here once the HeyGen account webhook
  // payload is confirmed for the school account. The client can poll
  // /api/heygen/video-status today.
  return NextResponse.json({ ok: true, received: Boolean(payload) });
}
