// Learning Hub recommendations endpoint.
//
// POST input: { mode: 'class' | 'student', events, studentProfile?, classProfile? }
// Output: { recommendations: AIRecommendation[], source: 'ai' | 'deterministic' }
//
// Strategy:
//   - if Gemma 4 API key is present, prompt the model to enrich the
//     deterministic recommendations with warmer language and any extra
//     evidence chips it can extract from the event sample;
//   - if the call fails or no key is set, fall back to the deterministic
//     engine. The client never sees a 500.
// The deterministic engine is the source of truth — AI output is post-merge.

import { NextResponse } from 'next/server';
import { callStructured } from '@/lib/ai/modelClient';
import {
  generateRecommendationsForClass,
  generateRecommendationsForStudent,
} from '@/lib/learningHub/aiInsights';
import type {
  AIRecommendation,
  ClassMasteryProfile,
  LearningEvent,
  StudentMasteryProfile,
} from '@/lib/learningHub/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type RequestBody = {
  mode: 'class' | 'student';
  events: LearningEvent[];
  studentProfile?: StudentMasteryProfile;
  classProfile?: ClassMasteryProfile;
};

function deterministic(body: RequestBody): AIRecommendation[] {
  if (body.mode === 'student' && body.studentProfile) {
    return generateRecommendationsForStudent(body.studentProfile, body.events ?? []);
  }
  if (body.mode === 'class' && body.classProfile) {
    return generateRecommendationsForClass(body.classProfile, body.events ?? []);
  }
  return [];
}

export async function POST(request: Request) {
  let body: RequestBody;
  try {
    body = (await request.json()) as RequestBody;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  const baseRecs = deterministic(body);

  // No API key → straight deterministic.
  if (!process.env.GEMINI_API_KEY && !process.env.GOOGLE_GENAI_API_KEY) {
    return NextResponse.json({ recommendations: baseRecs, source: 'deterministic' });
  }

  if (baseRecs.length === 0) {
    return NextResponse.json({ recommendations: baseRecs, source: 'deterministic' });
  }

  const prompt = `You are an IB MYP mathematics learning analyst. You analyse normalised learning events from Kahoot, Blooket, Dr Frost, MyiMaths, ManageBac, NeuroQuest and EIS Maths Studio. The deterministic engine has produced the following ${baseRecs.length} recommendations:

${JSON.stringify(baseRecs, null, 2)}

For each recommendation, you may:
- rewrite "explanation" in 1-2 sentences using warm, concrete language
- add at most 2 evidence chips drawn from the event sample below
- keep "title", "type", "suggestedAction", "suggestedThreeDType", "priority", "status", "id", "schoolId", "classId" and "studentId" exactly as supplied

Return JSON: { "recommendations": [...same shape as input...] }

Event sample (first 20 events): ${JSON.stringify((body.events ?? []).slice(0, 20))}`;

  type Wrapper = { recommendations: AIRecommendation[] };
  const result = await callStructured<Wrapper>({
    userPrompt: prompt,
    mock: { recommendations: baseRecs },
    parse: (raw): Wrapper | null => {
      if (typeof raw !== 'object' || raw === null) return null;
      const r = raw as { recommendations?: unknown };
      if (!Array.isArray(r.recommendations)) return null;
      // Trust the deterministic shape; just clamp to AIRecommendation[] by
      // sanity-checking each entry has the required keys.
      const cleaned: AIRecommendation[] = [];
      for (const item of r.recommendations) {
        if (typeof item !== 'object' || item === null) continue;
        const o = item as Record<string, unknown>;
        if (typeof o.id !== 'string' || typeof o.title !== 'string') continue;
        cleaned.push(item as AIRecommendation);
      }
      if (cleaned.length === 0) return null;
      return { recommendations: cleaned };
    },
  });

  return NextResponse.json({
    recommendations: result.data.recommendations,
    source: result.source === 'ai' ? 'ai' : 'deterministic',
  });
}
