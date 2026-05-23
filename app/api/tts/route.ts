/**
 * Cloud TTS endpoint.
 *
 * Returns a binary audio stream (MP3) for the supplied text using whichever
 * neural-voice provider has an API key configured:
 *
 *   1. ElevenLabs   — set ELEVENLABS_API_KEY (and optional ELEVENLABS_VOICE_ID)
 *   2. Azure Speech — set AZURE_SPEECH_KEY and AZURE_SPEECH_REGION
 *
 * When neither key is configured the endpoint returns 503 with a JSON body
 * so the client can transparently fall back to the browser's built-in
 * SpeechSynthesis API.
 *
 * GET / POST both accepted so a teacher can audition by pasting
 *   /api/tts?text=hello%20world
 * into the address bar.
 */

import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

type TTSProvider = 'elevenlabs' | 'azure';

type Body = {
  text?: string;
  voice?: string;
  /** Override automatic selection — useful for A/B comparison. */
  provider?: TTSProvider;
};

const ELEVENLABS_DEFAULT_VOICE = '21m00Tcm4TlvDq8ikWAM'; // "Rachel" — the most natural free-tier voice
const AZURE_DEFAULT_VOICE = 'en-US-AriaNeural';

function pickProvider(override?: TTSProvider): TTSProvider | null {
  if (override === 'elevenlabs' && process.env.ELEVENLABS_API_KEY) return 'elevenlabs';
  if (override === 'azure' && process.env.AZURE_SPEECH_KEY && process.env.AZURE_SPEECH_REGION) return 'azure';
  if (process.env.ELEVENLABS_API_KEY) return 'elevenlabs';
  if (process.env.AZURE_SPEECH_KEY && process.env.AZURE_SPEECH_REGION) return 'azure';
  return null;
}

async function speakElevenLabs(text: string, voice?: string): Promise<Response> {
  const voiceId = voice || process.env.ELEVENLABS_VOICE_ID || ELEVENLABS_DEFAULT_VOICE;
  const r = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
    method: 'POST',
    headers: {
      'xi-api-key': process.env.ELEVENLABS_API_KEY!,
      'Content-Type': 'application/json',
      Accept: 'audio/mpeg',
    },
    body: JSON.stringify({
      text,
      // eleven_turbo_v2_5 is fast + good quality. Override at the env layer
      // if a different model is preferred (eleven_multilingual_v2 etc.).
      model_id: process.env.ELEVENLABS_MODEL_ID || 'eleven_turbo_v2_5',
      voice_settings: { stability: 0.5, similarity_boost: 0.75 },
    }),
  });
  if (!r.ok) {
    const detail = await r.text().catch(() => '');
    return NextResponse.json(
      { error: 'elevenlabs_failed', status: r.status, detail: detail.slice(0, 300) },
      { status: 502 },
    );
  }
  return new Response(r.body, {
    headers: {
      'Content-Type': 'audio/mpeg',
      'Cache-Control': 'public, max-age=3600',
      'X-TTS-Provider': 'elevenlabs',
    },
  });
}

async function speakAzure(text: string, voice?: string): Promise<Response> {
  const v = voice || AZURE_DEFAULT_VOICE;
  // Escape XML-special characters so the SSML stays valid.
  const safe = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

  const ssml = `<speak version="1.0" xml:lang="en-US">
    <voice name="${v}">${safe}</voice>
  </speak>`;

  const region = process.env.AZURE_SPEECH_REGION!;
  const r = await fetch(`https://${region}.tts.speech.microsoft.com/cognitiveservices/v1`, {
    method: 'POST',
    headers: {
      'Ocp-Apim-Subscription-Key': process.env.AZURE_SPEECH_KEY!,
      'Content-Type': 'application/ssml+xml',
      'X-Microsoft-OutputFormat': 'audio-24khz-48kbitrate-mono-mp3',
      'User-Agent': 'eis-learning-studio',
    },
    body: ssml,
  });
  if (!r.ok) {
    const detail = await r.text().catch(() => '');
    return NextResponse.json(
      { error: 'azure_failed', status: r.status, detail: detail.slice(0, 300) },
      { status: 502 },
    );
  }
  return new Response(r.body, {
    headers: {
      'Content-Type': 'audio/mpeg',
      'Cache-Control': 'public, max-age=3600',
      'X-TTS-Provider': 'azure',
    },
  });
}

async function handle(text: string, voice: string | undefined, provider: TTSProvider | undefined) {
  if (!text || text.trim().length === 0) {
    return NextResponse.json({ error: 'missing_text' }, { status: 400 });
  }
  if (text.length > 4000) {
    return NextResponse.json({ error: 'text_too_long', max: 4000 }, { status: 413 });
  }
  const picked = pickProvider(provider);
  if (!picked) {
    return NextResponse.json(
      {
        error: 'no_provider',
        message:
          'No cloud TTS provider is configured. Set ELEVENLABS_API_KEY or AZURE_SPEECH_KEY+AZURE_SPEECH_REGION in env to enable.',
      },
      { status: 503 },
    );
  }
  if (picked === 'elevenlabs') return speakElevenLabs(text, voice);
  return speakAzure(text, voice);
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  return handle(
    searchParams.get('text') || '',
    searchParams.get('voice') || undefined,
    (searchParams.get('provider') as TTSProvider) || undefined,
  );
}

export async function POST(req: NextRequest) {
  let body: Body = {};
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 });
  }
  return handle(body.text || '', body.voice, body.provider);
}
