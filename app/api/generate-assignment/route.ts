import { NextResponse } from 'next/server';
import { callStructured } from '@/lib/ai/modelClient';
import { assignmentPrompt } from '@/lib/ai/prompts';
import type {
  GenerateAssignmentInput,
  GenerateAssignmentOutput,
  GeneratedAssignmentQuestion,
} from '@/lib/ai/types';
import type { Difficulty, ThreeDType } from '@/lib/grade8Curriculum';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const DIFFICULTIES = new Set<Difficulty>(['core', 'support', 'extension']);
const THREE_D_TYPES = new Set<ThreeDType>([
  'pythagoras_3d',
  'equation_balance_3d',
  'linear_graph_3d',
  'circle_lab_3d',
  'ratio_mixer_3d',
  'solid_geometry_3d',
  'angle_lab_3d',
  'probability_spinner_3d',
  'percentage_bar_3d',
  'data_visualisation_3d',
]);

function asAssignmentQuestions(v: unknown): GeneratedAssignmentQuestion[] | null {
  if (!Array.isArray(v)) return null;
  const out: GeneratedAssignmentQuestion[] = [];
  for (const item of v) {
    if (typeof item !== 'object' || item === null) return null;
    const r = item as Record<string, unknown>;
    if (
      typeof r.question !== 'string' ||
      typeof r.expectedAnswer !== 'string' ||
      typeof r.rubric !== 'string'
    ) {
      return null;
    }
    if (!Array.isArray(r.acceptedKeywords) || !r.acceptedKeywords.every((x) => typeof x === 'string')) {
      return null;
    }
    out.push({
      question: r.question,
      expectedAnswer: r.expectedAnswer,
      acceptedKeywords: r.acceptedKeywords as string[],
      rubric: r.rubric,
    });
  }
  return out;
}

function parseAssignment(raw: unknown): GenerateAssignmentOutput | null {
  if (typeof raw !== 'object' || raw === null) return null;
  const r = raw as Record<string, unknown>;
  if (typeof r.topic !== 'string') return null;
  const difficulty = r.difficulty as Difficulty;
  if (!DIFFICULTIES.has(difficulty)) return null;
  const threeDType = r.threeDType as ThreeDType;
  if (!THREE_D_TYPES.has(threeDType)) return null;
  const questions = asAssignmentQuestions(r.questions);
  if (!questions || questions.length === 0) return null;
  return { topic: r.topic, difficulty, threeDType, questions };
}

function assignmentMock(input: GenerateAssignmentInput): GenerateAssignmentOutput {
  const count = Math.min(Math.max(input.count ?? 3, 1), 6);
  return {
    topic: input.topic,
    difficulty: input.difficulty ?? 'core',
    threeDType: 'equation_balance_3d',
    questions: Array.from({ length: count }).map((_, i) => ({
      question: `Demo question ${i + 1} on ${input.topic}.`,
      expectedAnswer: 'expected answer',
      acceptedKeywords: ['expected', 'answer'],
      rubric: 'Full marks for correct working AND final value. Half marks for correct method only.',
    })),
  };
}

export async function POST(request: Request) {
  let body: GenerateAssignmentInput;
  try {
    body = (await request.json()) as GenerateAssignmentInput;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }
  if (!body?.topic || typeof body.topic !== 'string') {
    return NextResponse.json({ error: 'Request must include a topic string.' }, { status: 400 });
  }

  const result = await callStructured<GenerateAssignmentOutput>({
    userPrompt: assignmentPrompt(body),
    mock: assignmentMock(body),
    parse: parseAssignment,
  });

  return NextResponse.json(result);
}
