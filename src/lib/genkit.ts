// Server-only Genkit configuration.
// This file imports Node-only APIs (via @genkit-ai/googleai). Do not import it
// from any 'use client' file — only from API routes or server actions.

import { googleAI } from '@genkit-ai/googleai';
import { genkit } from 'genkit';

// Preferred: 'gemma-4-26b-a4b-it' (lightweight MoE). Google's generateContent
// for Gemma 4 was returning 500 Internal Server Error during the demo
// preparation window, so we default to gemini-2.5-flash. Swap back to the
// Gemma model once the upstream endpoint stabilises.
export const DEFAULT_AI_MODEL = 'gemini-2.5-flash';
export const TTS_MODEL = 'gemini-2.5-flash-preview-tts';

// The googleAI plugin reads GEMINI_API_KEY or GOOGLE_GENAI_API_KEY from
// process.env at first use. Set the key in .env.local for dev and as a Cloud
// Run / Functions runtime env var for prod. It is never sent to the client.
export const ai = genkit({
  plugins: [googleAI()],
  model: googleAI.model(DEFAULT_AI_MODEL),
});
