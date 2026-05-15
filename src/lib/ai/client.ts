// Thin client-side wrappers around the Phase 6 AI routes. Components
// import these instead of writing fetch boilerplate. Each wrapper returns
// the route's `{ data, source, modelId }` envelope so callers can show
// an "AI demo mode" badge when source === 'mock'.

import type {
  AIFlowResponse,
  Generate3DSceneInput,
  Generated3DScene,
  GenerateAssignmentInput,
  GenerateAssignmentOutput,
  GenerateLessonInput,
  GeneratedLesson,
  GradeAnswerInput,
  GradedAnswer,
} from './types';

async function post<TOut>(path: string, body: unknown): Promise<AIFlowResponse<TOut>> {
  const res = await fetch(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    let message = `${path} failed (${res.status})`;
    try {
      const j = await res.json();
      if (j?.error) message = j.error;
    } catch {}
    throw new Error(message);
  }
  return (await res.json()) as AIFlowResponse<TOut>;
}

export const aiGenerateLesson = (input: GenerateLessonInput) =>
  post<GeneratedLesson>('/api/generate-lesson', input);

export const aiGenerateAssignment = (input: GenerateAssignmentInput) =>
  post<GenerateAssignmentOutput>('/api/generate-assignment', input);

export const aiGradeAnswer = (input: GradeAnswerInput) =>
  post<GradedAnswer>('/api/grade-answer', input);

export const aiGenerate3DScene = (input: Generate3DSceneInput) =>
  post<Generated3DScene>('/api/generate-3d-scene', input);
