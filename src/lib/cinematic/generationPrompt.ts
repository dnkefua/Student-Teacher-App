import type { CinematicSceneType, SubjectId } from './types';
import { cinematicSceneTypes, sceneTypeForSubject } from './sceneSchema';

export type GenerateCinematicSpecInput = {
  subject: SubjectId;
  grade?: 'Grade 8';
  topic: string;
  curriculumText?: string;
  desiredSceneType?: CinematicSceneType;
  teacherNotes?: string;
};

export function buildCinematicSpecPrompt(input: GenerateCinematicSpecInput): string {
  const sceneType = input.desiredSceneType ?? sceneTypeForSubject(input.subject);
  return `You are an expert IB MYP Year 8 teacher, cinematic learning designer, 3D scene director, and interactive simulation planner. Convert the provided subject, topic, and curriculum material into a safe CinematicLessonSpec JSON. Use predefined sceneType values only. Do not invent unsupported component names. Every lesson must include storyboard steps, narration, interactive scene objects, student checkpoints, assignment questions, HeyGen video script, and analytics metadata.

Subject: ${input.subject}
Grade: ${input.grade ?? 'Grade 8'}
Topic: ${input.topic}
Desired sceneType: ${sceneType}
Allowed sceneType values: ${cinematicSceneTypes.join(', ')}
Curriculum material:
${input.curriculumText || 'Use a strong Year 8 EIS/IB MYP treatment with clear vocabulary and age-appropriate examples.'}

Teacher notes:
${input.teacherNotes || 'No additional notes.'}

Return one JSON object only. Keep HeyGen scripts short: 30 to 120 seconds. HeyGen is only for avatar video assets; the interactive scene is rendered by the app.`;
}
