import { NextResponse } from 'next/server';
import { callStructured } from '@/lib/ai/modelClient';
import { gradePrompt } from '@/lib/ai/prompts';
import type { GradeAnswerInput, GradedAnswer } from '@/lib/ai/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function parseGrade(raw: unknown): GradedAnswer | null {
  if (typeof raw !== 'object' || raw === null) return null;
  const r = raw as Record<string, unknown>;
  if (typeof r.score !== 'number' || typeof r.feedback !== 'string' || typeof r.nextStep !== 'string') {
    return null;
  }
  if (!Array.isArray(r.strengths) || !r.strengths.every((s) => typeof s === 'string')) return null;
  if (!Array.isArray(r.misconceptions) || !r.misconceptions.every((s) => typeof s === 'string')) return null;
  const clampedScore = Math.max(0, Math.min(100, Math.round(r.score)));
  return {
    score: clampedScore,
    feedback: r.feedback,
    strengths: r.strengths as string[],
    misconceptions: r.misconceptions as string[],
    nextStep: r.nextStep,
  };
}

function gradeMock(input: GradeAnswerInput): GradedAnswer {
  // Quick keyword check so the demo mock at least reacts to the answer text.
  const normalized = input.studentAnswer.toLowerCase().replace(/\s+/g, '');
  const matched = (input.acceptedKeywords ?? []).some((k) =>
    normalized.includes(k.toLowerCase().replace(/\s+/g, '')),
  );
  if (matched) {
    return {
      score: 100,
      feedback: 'Strong answer — you matched the expected reasoning.',
      strengths: ['Reached the correct final value.', 'Showed the key working step.'],
      misconceptions: [],
      nextStep: 'Try a slightly harder version (extension) next.',
    };
  }
  return {
    score: 60,
    feedback: 'Good start. Re-read the prompt and make sure you arrive at the expected value.',
    strengths: ['Attempted the question.'],
    misconceptions: ['The final answer differs from the expected one — check the working step.'],
    nextStep: 'Walk through the worked example, then retry this question.',
  };
}

export async function POST(request: Request) {
  let body: GradeAnswerInput;
  try {
    body = (await request.json()) as GradeAnswerInput;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }
  if (
    !body?.question ||
    typeof body.question !== 'string' ||
    !body?.expectedAnswer ||
    typeof body.expectedAnswer !== 'string' ||
    !body?.studentAnswer ||
    typeof body.studentAnswer !== 'string'
  ) {
    return NextResponse.json(
      { error: 'Request must include question, expectedAnswer, and studentAnswer strings.' },
      { status: 400 },
    );
  }

  const result = await callStructured<GradedAnswer>({
    userPrompt: gradePrompt(body),
    mock: gradeMock(body),
    parse: parseGrade,
  });

  return NextResponse.json(result);
}
