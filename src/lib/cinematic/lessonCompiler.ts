import type { CinematicLessonSpec, CinematicSceneType, SubjectId } from './types';
import { sceneTypeForSubject, validateCinematicLessonSpec } from './sceneSchema';
import { createTemplateForSceneType } from './templates';

export type CinematicCompileInput = {
  subject: SubjectId;
  topic: string;
  curriculumText?: string;
  desiredSceneType?: CinematicSceneType;
  teacherNotes?: string;
};

export function compileCinematicLesson(input: CinematicCompileInput, raw?: unknown): CinematicLessonSpec {
  const parsed = validateCinematicLessonSpec(raw);
  if (parsed) return parsed;

  const sceneType = input.desiredSceneType ?? sceneTypeForSubject(input.subject);
  const template = createTemplateForSceneType(sceneType, input.subject, input.topic);
  const context = [input.curriculumText, input.teacherNotes].filter(Boolean).join('\n\n').trim();
  if (!context) return template;

  return {
    ...template,
    storyboard: template.storyboard.map((step, index) =>
      index === 0
        ? {
            ...step,
            narration: `${step.narration} Teacher context: ${context.slice(0, 220)}`,
          }
        : step,
    ),
  };
}
