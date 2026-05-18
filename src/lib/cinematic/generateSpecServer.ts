import 'server-only';

import type { CinematicLessonSpec, CinematicSceneType, SubjectId } from './types';
import { cinematicSceneTypes } from './sceneSchema';
import { createTemplateForSceneType } from './templates';

export type GenerateCinematicSpecInput = {
  subject: SubjectId;
  grade?: 'Grade 8';
  topic: string;
  desiredSceneType?: CinematicSceneType;
  teacherNotes?: string;
  curriculumText?: string;
};

export type GenerateCinematicSpecResult = {
  data: CinematicLessonSpec;
  source: 'ai' | 'mock';
  message?: string;
};

const defaultSceneTypeBySubject: Record<SubjectId, CinematicSceneType> = {
  mathematics: 'math_ratio_mixer',
  science: 'science_particle_model',
  english: 'english_essay_planner',
};

const scenePrefixBySubject: Record<SubjectId, string> = {
  mathematics: 'math_',
  science: 'science_',
  english: 'english_',
};

export function getDefaultSceneTypeForSubject(subject: SubjectId): CinematicSceneType {
  return defaultSceneTypeBySubject[subject];
}

export function validateSceneTypeForSubject(sceneType: unknown, subject: SubjectId): CinematicSceneType {
  if (
    typeof sceneType === 'string' &&
    (cinematicSceneTypes as readonly string[]).includes(sceneType) &&
    sceneType.startsWith(scenePrefixBySubject[subject])
  ) {
    return sceneType as CinematicSceneType;
  }

  return getDefaultSceneTypeForSubject(subject);
}

export async function generateCinematicSpec(input: GenerateCinematicSpecInput): Promise<GenerateCinematicSpecResult> {
  if (!['mathematics', 'science', 'english'].includes(input.subject)) {
    throw new Error('Invalid subject.');
  }

  const topic = input.topic.trim();
  if (topic.length < 3) {
    throw new Error('Topic is required.');
  }

  const sceneType = validateSceneTypeForSubject(input.desiredSceneType, input.subject);
  const template = createTemplateForSceneType(sceneType, input.subject, topic);

  return {
    data: template,
    source: 'mock',
    message: 'Generated from cinematic template. Connect Gemini/Genkit later for live AI spec generation.',
  };
}
