import { NextResponse } from 'next/server';
import { callStructured } from '@/lib/ai/modelClient';
import { buildCinematicSpecPrompt, type GenerateCinematicSpecInput } from '@/lib/cinematic/generationPrompt';
import { compileCinematicLesson } from '@/lib/cinematic/lessonCompiler';
import { isCinematicSceneType, sceneTypeForSubject, validateCinematicLessonSpec } from '@/lib/cinematic/sceneSchema';
import type { SubjectId } from '@/lib/cinematic/types';

export const runtime = 'nodejs';

function parseInput(raw: unknown): GenerateCinematicSpecInput | null {
  if (!raw || typeof raw !== 'object') return null;
  const value = raw as Partial<GenerateCinematicSpecInput>;
  if (!['mathematics', 'science', 'english'].includes(String(value.subject))) return null;
  if (typeof value.topic !== 'string' || value.topic.trim().length < 3) return null;
  const subject = value.subject as SubjectId;
  const desiredSceneType = isCinematicSceneType(value.desiredSceneType) ? value.desiredSceneType : sceneTypeForSubject(subject);
  return {
    subject,
    grade: 'Grade 8',
    topic: value.topic.trim(),
    curriculumText: typeof value.curriculumText === 'string' ? value.curriculumText : undefined,
    desiredSceneType,
    teacherNotes: typeof value.teacherNotes === 'string' ? value.teacherNotes : undefined,
  };
}

export async function POST(request: Request) {
  const input = parseInput(await request.json().catch(() => null));
  if (!input) {
    return NextResponse.json({ message: 'Invalid cinematic generation input.' }, { status: 400 });
  }

  const mock = compileCinematicLesson(input);
  const response = await callStructured({
    subject: input.subject,
    userPrompt: buildCinematicSpecPrompt(input),
    mock,
    parse: validateCinematicLessonSpec,
  });

  return NextResponse.json(response);
}
