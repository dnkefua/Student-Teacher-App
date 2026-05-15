'use client';

import { getAI, getGenerativeModel, GoogleAIBackend, type AI, type Tool } from 'firebase/ai';
import { getFirebaseApp } from './firebase';

export const DEFAULT_AI_MODEL = 'gemma-3n-e4b-it';
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

let cachedAI: AI | null = null;

function getAIClient(): AI {
  if (cachedAI) return cachedAI;
  cachedAI = getAI(getFirebaseApp(), { backend: new GoogleAIBackend() });
  return cachedAI;
}

export async function generateContent(request: GenerateContentRequest): Promise<GenerateContentResponse> {
  const ai = getAIClient();

  const generationConfig: Record<string, unknown> = {};
  if (request.config?.responseModalities) {
    generationConfig.responseModalities = request.config.responseModalities;
  }
  if (request.config?.speechConfig) {
    generationConfig.speechConfig = request.config.speechConfig;
  }

  const model = getGenerativeModel(ai, {
    model: request.model,
    systemInstruction: request.config?.systemInstruction,
    tools: request.config?.tools as Tool[] | undefined,
    generationConfig: Object.keys(generationConfig).length > 0 ? generationConfig : undefined,
  });

  const result = await model.generateContent(request.contents as never);
  const response = result.response;

  return {
    text: typeof response.text === 'function' ? response.text() : null,
    candidates: response.candidates ?? null,
    usageMetadata: response.usageMetadata ?? null,
  };
}
