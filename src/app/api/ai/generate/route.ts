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
    const prompt = toGenkitParts(extractParts(body.contents));
    const generationConfig: Record<string, unknown> = {};
    if (body.config?.responseModalities) generationConfig.responseModalities = body.config.responseModalities;
    if (body.config?.speechConfig) generationConfig.speechConfig = body.config.speechConfig;

    const result = await ai.generate({
      model: googleAI.model(body.model),
      prompt,
      system: body.config?.systemInstruction,
      ...(Object.keys(generationConfig).length > 0 ? { config: generationConfig } : {}),
    });

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
