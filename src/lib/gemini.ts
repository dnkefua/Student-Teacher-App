// Client-side AI helper. Posts to /api/ai/generate, which runs Genkit on the
// server. The provider API key lives only in the server's environment and is
// never bundled into the client.

export const DEFAULT_AI_MODEL = 'gemini-2.5-flash';
export const TTS_MODEL = 'gemini-2.5-flash-preview-tts';

export type GenerateContentRequest = {
  model: string;
  contents: unknown;
  config?: {
    systemInstruction?: string;
    tools?: unknown[];
    responseModalities?: unknown[];
    speechConfig?: unknown;
  };
};

export type GenerateContentResponse = {
  text: string | null;
  candidates: unknown[] | null;
  usageMetadata: unknown | null;
};

export async function generateContent(request: GenerateContentRequest): Promise<GenerateContentResponse> {
  const res = await fetch('/api/ai/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });

  if (!res.ok) {
    let message = `AI request failed (${res.status})`;
    try {
      const err = await res.json();
      if (err?.error) message = err.error;
    } catch {}
    throw new Error(message);
  }

  return (await res.json()) as GenerateContentResponse;
}
