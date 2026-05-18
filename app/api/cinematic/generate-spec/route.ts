import { NextResponse } from 'next/server';
import { generateCinematicSpec, type GenerateCinematicSpecInput } from '@/lib/cinematic/generateSpecServer';
import type { CinematicSceneType, SubjectId } from '@/lib/cinematic/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function parseInput(raw: unknown): GenerateCinematicSpecInput | { message: string } {
  if (!raw || typeof raw !== 'object') return { message: 'Topic is required.' };
  const value = raw as Record<string, unknown>;
  if (typeof value.topic !== 'string' || value.topic.trim().length < 3) return { message: 'Topic is required.' };
  if (!['mathematics', 'science', 'english'].includes(String(value.subject))) {
    return { message: 'Valid subject is required.' };
  }

  return {
    subject: value.subject as SubjectId,
    grade: 'Grade 8',
    topic: value.topic.trim(),
    curriculumText: typeof value.curriculumText === 'string' ? value.curriculumText : undefined,
    desiredSceneType: typeof value.desiredSceneType === 'string' ? (value.desiredSceneType as CinematicSceneType) : undefined,
    teacherNotes: typeof value.teacherNotes === 'string' ? value.teacherNotes : undefined,
  };
}

export async function POST(request: Request) {
  const input = parseInput(await request.json().catch(() => null));
  if ('message' in input) return NextResponse.json({ message: input.message }, { status: 400 });

  try {
    return NextResponse.json(await generateCinematicSpec(input));
  } catch {
    return NextResponse.json({ message: 'Could not generate cinematic lesson.' }, { status: 500 });
  }
}
