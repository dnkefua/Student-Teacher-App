import { NextResponse } from 'next/server';
import { googleAI } from '@genkit-ai/googleai';
import { ai } from '@/lib/genkit';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type GeminiPart =
  | { text: string }
  | { inlineData: { data: string; mimeType: string } };

type GeminiContents =
  | string
  | { parts: GeminiPart[] }
  | Array<{ parts: GeminiPart[] }>;

type GenerateRequestBody = {
  model: string;
  contents: GeminiContents;
  config?: {
    systemInstruction?: string;
    tools?: unknown[];
    responseModalities?: unknown[];
    speechConfig?: unknown;
  };
};

type GenkitPart = { text: string } | { media: { url: string; contentType?: string } };

function extractParts(contents: GeminiContents): GeminiPart[] {
  if (typeof contents === 'string') return [{ text: contents }];
  if (Array.isArray(contents)) {
    const merged: GeminiPart[] = [];
    for (const c of contents) if (c?.parts) merged.push(...c.parts);
    return merged;
  }
  if (contents?.parts) return contents.parts;
  return [];
}

function toGenkitParts(parts: GeminiPart[]): GenkitPart[] {
  const out: GenkitPart[] = [];
  for (const p of parts) {
    if ('text' in p && typeof p.text === 'string') {
      out.push({ text: p.text });
    } else if ('inlineData' in p && p.inlineData?.data) {
      out.push({
        media: {
          url: `data:${p.inlineData.mimeType};base64,${p.inlineData.data}`,
          contentType: p.inlineData.mimeType,
        },
      });
    }
  }
  return out;
}

export async function POST(request: Request) {
  if (!process.env.GEMINI_API_KEY && !process.env.GOOGLE_GENAI_API_KEY) {
    return NextResponse.json(
      { error: 'Server is not configured: set GEMINI_API_KEY in .env.local (dev) or as a runtime env var (prod).' },
      { status: 500 },
    );
  }

  let body: GenerateRequestBody;
  try {
    body = (await request.json()) as GenerateRequestBody;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  if (!body?.model || body.contents === undefined) {
    return NextResponse.json({ error: 'Request must include model and contents.' }, { status: 400 });
  }

  try {
    // Gemma models reject Genkit's chat-style request envelope (systemInstruction
    // + generationConfig + safetySettings) with a 500 from Google. Bypass Genkit
    // and POST the raw Gemini REST shape, which the direct API accepts.
    if (body.model.startsWith('gemma')) {
      const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_GENAI_API_KEY;
      const parts = extractParts(body.contents);
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${body.model}:generateContent?key=${apiKey}`;
      const upstream = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts }] }),
      });
      const json = await upstream.json();
      if (!upstream.ok) {
        const message = json?.error?.message || `Gemma request failed (${upstream.status})`;
        return NextResponse.json({ error: message }, { status: 502 });
      }
      const candidates = json.candidates ?? [];
      const visibleParts: Array<{ text?: string; thought?: boolean }> = candidates[0]?.content?.parts ?? [];
      const text = visibleParts
        .filter((p) => !p.thought && typeof p.text === 'string')
        .map((p) => p.text)
        .join('');
      return NextResponse.json({
        text: text || null,
        candidates,
        usageMetadata: json.usageMetadata ?? null,
      });
    }

    const prompt = toGenkitParts(extractParts(body.contents));
    const generationConfig: Record<string, unknown> = {};
    if (body.config?.responseModalities) generationConfig.responseModalities = body.config.responseModalities;
    if (body.config?.speechConfig) generationConfig.speechConfig = body.config.speechConfig;

    const generateArgs: Parameters<typeof ai.generate>[0] = {
      model: googleAI.model(body.model),
      prompt,
    };
    if (body.config?.systemInstruction) generateArgs.system = body.config.systemInstruction;
    if (Object.keys(generationConfig).length > 0) generateArgs.config = generationConfig;

    const result = await ai.generate(generateArgs);

    return NextResponse.json({
      text: result.text ?? null,
      candidates: (result as { candidates?: unknown[] }).candidates ?? null,
      usageMetadata: (result as { usage?: unknown }).usage ?? null,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'AI request failed.';
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
