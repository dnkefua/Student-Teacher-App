// Server-only Genkit configuration.
// This file imports Node-only APIs (via @genkit-ai/googleai). Do not import it
// from any 'use client' file — only from API routes or server actions.

import { googleAI } from '@genkit-ai/googleai';
import { genkit } from 'genkit';

// Gemma 4 MoE: 26B params total, ~4B activated per token. Lightweight by
// inference cost while keeping a large knowledge base. The route handler
// bypasses Genkit's chat envelope for Gemma models (Gemma rejects
// systemInstruction + safetySettings) and POSTs the raw Gemini REST shape.
export const DEFAULT_AI_MODEL = 'gemma-4-26b-a4b-it';
export const TTS_MODEL = 'gemini-2.5-flash-preview-tts';

// The googleAI plugin reads GEMINI_API_KEY or GOOGLE_GENAI_API_KEY from
// process.env at first use. Set the key in .env.local for dev and as a Cloud
// Run / Functions runtime env var for prod. It is never sent to the client.
export const ai = genkit({
  plugins: [googleAI()],
  model: googleAI.model(DEFAULT_AI_MODEL),
});
