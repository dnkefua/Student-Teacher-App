// Server-only model client for the structured AI flows.
//
// All Gemma 4 requests go via the raw Gemini REST endpoint because Genkit's
// chat envelope (systemInstruction + safetySettings + generationConfig)
// breaks Gemma. The bypass mirrors what app/api/ai/generate/route.ts already
// does for the open-ended chat flow.

import { DEFAULT_AI_MODEL } from '@/lib/genkit';
import { SYSTEM_PROMPT } from './prompts';
import type { AIFlowResponse } from './types';

const GEMINI_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models';

type CallOptions<T> = {
  /** The user-facing prompt (the per-flow builder output). */
  userPrompt: string;
  /** Override the default model (e.g. `gemini-2.5-flash`) if the caller needs a non-Gemma path. */
  model?: string;
  /** Returned verbatim when GEMINI_API_KEY is missing or the model errors. */
  mock: T;
  /** Validates / narrows the parsed JSON. Return null to fall back to the mock. */
  parse: (raw: unknown) => T | null;
};

function getApiKey(): string | null {
  return process.env.GEMINI_API_KEY || process.env.GOOGLE_GENAI_API_KEY || null;
}

/** Pull a JSON object out of a model response. Gemma sometimes wraps it in
 *  prose or fenced code; we look for the first balanced { ... } block. */
function extractJson(raw: string): unknown | null {
  if (!raw) return null;
  // Strip fenced blocks first.
  const fenceMatch = raw.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = fenceMatch ? fenceMatch[1] : raw;
  // Find the first balanced object.
  const start = candidate.indexOf('{');
  if (start === -1) return null;
  let depth = 0;
  for (let i = start; i < candidate.length; i++) {
    const c = candidate[i];
    if (c === '{') depth++;
    else if (c === '}') {
      depth--;
      if (depth === 0) {
        const slice = candidate.slice(start, i + 1);
        try {
          return JSON.parse(slice);
        } catch {
          return null;
        }
      }
    }
  }
  return null;
}

async function callGemmaRest(model: string, apiKey: string, prompt: string): Promise<string> {
  const url = `${GEMINI_ENDPOINT}/${model}:generateContent?key=${apiKey}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            // Embed the system prompt up-front since Gemma rejects
            // separate systemInstruction.
            { text: `${SYSTEM_PROMPT}\n\n${prompt}` },
          ],
        },
      ],
      generationConfig: {
        responseMimeType: 'application/json',
      },
    }),
  });
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`Gemma REST failed (${res.status}): ${body.slice(0, 240)}`);
  }
  const json = (await res.json()) as {
    candidates?: Array<{ content?: { parts?: Array<{ text?: string; thought?: boolean }> } }>;
  };
  const parts = json.candidates?.[0]?.content?.parts ?? [];
  // Drop the "thought" parts — they contain reasoning that we don't want.
  const visible = parts
    .filter((p) => !p.thought && typeof p.text === 'string')
    .map((p) => p.text as string)
    .join('');
  return visible;
}

async function callGeminiRest(model: string, apiKey: string, prompt: string): Promise<string> {
  // For non-Gemma models. Same shape but Gemini accepts systemInstruction.
  const url = `${GEMINI_ENDPOINT}/${model}:generateContent?key=${apiKey}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: 'application/json',
      },
    }),
  });
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`Gemini REST failed (${res.status}): ${body.slice(0, 240)}`);
  }
  const json = (await res.json()) as {
    candidates?: Array<{ content?: { parts?: Array<{ text?: string; thought?: boolean }> } }>;
  };
  const parts = json.candidates?.[0]?.content?.parts ?? [];
  return parts
    .filter((p) => !p.thought && typeof p.text === 'string')
    .map((p) => p.text as string)
    .join('');
}

export async function callStructured<T>(opts: CallOptions<T>): Promise<AIFlowResponse<T>> {
  const apiKey = getApiKey();
  const model = opts.model ?? DEFAULT_AI_MODEL;

  if (!apiKey) {
    return { data: opts.mock, source: 'mock' };
  }

  try {
    const raw = model.startsWith('gemma')
      ? await callGemmaRest(model, apiKey, opts.userPrompt)
      : await callGeminiRest(model, apiKey, opts.userPrompt);
    const json = extractJson(raw);
    if (!json) {
      console.warn('[ai] Could not extract JSON from model output, returning mock.');
      return { data: opts.mock, source: 'mock', modelId: model };
    }
    const parsed = opts.parse(json);
    if (!parsed) {
      console.warn('[ai] Parsed JSON failed validation, returning mock.');
      return { data: opts.mock, source: 'mock', modelId: model };
    }
    return { data: parsed, source: 'ai', modelId: model };
  } catch (err) {
    console.warn('[ai] Upstream model call failed; returning mock.', err);
    return { data: opts.mock, source: 'mock', modelId: model };
  }
}
