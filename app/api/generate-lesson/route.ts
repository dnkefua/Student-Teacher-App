import { NextResponse } from 'next/server';
import { callStructured } from '@/lib/ai/modelClient';
import { lessonPrompt } from '@/lib/ai/prompts';
import type {
  GenerateLessonInput,
  GeneratedLesson,
  GeneratedAssignmentQuestion,
  GeneratedPracticeQuestion,
  GeneratedWorkedExample,
} from '@/lib/ai/types';
import type { CurriculumUnit, ThreeDType } from '@/lib/grade8Curriculum';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const UNITS = new Set<CurriculumUnit>(['numerical', 'abstract', 'spatial', 'data']);
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

function asStringArray(v: unknown): string[] | null {
  if (!Array.isArray(v)) return null;
  if (!v.every((x) => typeof x === 'string')) return null;
  return v as string[];
}

function asWorkedExamples(v: unknown): GeneratedWorkedExample[] | null {
  if (!Array.isArray(v)) return null;
  const out: GeneratedWorkedExample[] = [];
  for (const item of v) {
    if (typeof item !== 'object' || item === null) return null;
    const r = item as Record<string, unknown>;
    if (typeof r.prompt !== 'string' || typeof r.answer !== 'string') return null;
    const steps = asStringArray(r.steps);
    if (!steps) return null;
    out.push({ prompt: r.prompt, steps, answer: r.answer });
  }
  return out;
}

function asPracticeQuestions(v: unknown): GeneratedPracticeQuestion[] | null {
  if (!Array.isArray(v)) return null;
  const out: GeneratedPracticeQuestion[] = [];
  for (const item of v) {
    if (typeof item !== 'object' || item === null) return null;
    const r = item as Record<string, unknown>;
    if (
      typeof r.question !== 'string' ||
      typeof r.answer !== 'string' ||
      typeof r.explanation !== 'string'
    ) {
      return null;
    }
    out.push({ question: r.question, answer: r.answer, explanation: r.explanation });
  }
  return out;
}

function asAssignmentQuestions(v: unknown): GeneratedAssignmentQuestion[] | null {
  if (!Array.isArray(v)) return null;
  const out: GeneratedAssignmentQuestion[] = [];
  for (const item of v) {
    if (typeof item !== 'object' || item === null) return null;
    const r = item as Record<string, unknown>;
    if (typeof r.question !== 'string' || typeof r.expectedAnswer !== 'string' || typeof r.rubric !== 'string') {
      return null;
    }
    const acceptedKeywords = asStringArray(r.acceptedKeywords);
    if (!acceptedKeywords) return null;
    out.push({
      question: r.question,
      expectedAnswer: r.expectedAnswer,
      acceptedKeywords,
      rubric: r.rubric,
    });
  }
  return out;
}

function parseLesson(raw: unknown): GeneratedLesson | null {
  if (typeof raw !== 'object' || raw === null) return null;
  const r = raw as Record<string, unknown>;
  if (
    typeof r.title !== 'string' ||
    typeof r.strand !== 'string' ||
    typeof r.topic !== 'string' ||
    typeof r.inquiryQuestion !== 'string' ||
    typeof r.studentExplanation !== 'string' ||
    typeof r.teacherNotes !== 'string' ||
    typeof r.extensionChallenge !== 'string'
  ) {
    return null;
  }
  const unit = r.unit as CurriculumUnit;
  if (!UNITS.has(unit)) return null;
  const threeDType = r.threeDType as ThreeDType;
  if (!THREE_D_TYPES.has(threeDType)) return null;

  const objectives = asStringArray(r.objectives);
  const animatedSteps = asStringArray(r.animatedSteps);
  if (!objectives || !animatedSteps) return null;
  const workedExamples = asWorkedExamples(r.workedExamples);
  const practiceQuestions = asPracticeQuestions(r.practiceQuestions);
  const assignmentQuestions = asAssignmentQuestions(r.assignmentQuestions);
  if (!workedExamples || !practiceQuestions || !assignmentQuestions) return null;

  return {
    title: r.title,
    unit,
    strand: r.strand,
    topic: r.topic,
    inquiryQuestion: r.inquiryQuestion,
    objectives,
    studentExplanation: r.studentExplanation,
    teacherNotes: r.teacherNotes,
    animatedSteps,
    threeDType,
    workedExamples,
    practiceQuestions,
    assignmentQuestions,
    extensionChallenge: r.extensionChallenge,
  };
}

function lessonMock(topic: string): GeneratedLesson {
  return {
    title: `Demo lesson · ${topic}`,
    unit: 'abstract',
    strand: 'Algebra',
    topic,
    inquiryQuestion: `What is the most efficient way to reason about ${topic.toLowerCase()}?`,
    objectives: [
      `Define the key terms used in ${topic.toLowerCase()}.`,
      'Apply the technique to at least three different problems.',
      'Verify each answer using a substitution or check step.',
    ],
    studentExplanation:
      'In this lesson we will see the idea step by step, watch a 3D model that makes it visual, and then solve a few practice questions together before you try one on your own.',
    teacherNotes:
      'Anchor the lesson with the matching 3D explainer scene. Pause at the checkpoint to elicit student predictions before revealing each next step.',
    animatedSteps: [
      'Introduce the inquiry question and connect it to the 3D scene.',
      'Walk through the core method one step at a time.',
      'Highlight the key formula and why each piece matters.',
      'Demonstrate a worked example end to end.',
      'Pause for a student checkpoint before the practice round.',
    ],
    threeDType: 'equation_balance_3d',
    workedExamples: [
      {
        prompt: 'Example problem typical for this topic.',
        steps: ['Identify the structure.', 'Apply the technique.', 'Check by substitution.'],
        answer: 'The worked answer goes here.',
      },
    ],
    practiceQuestions: [
      {
        question: 'A short no-stakes practice item.',
        answer: 'Example answer.',
        explanation: 'Why the answer is right, in plain language.',
      },
    ],
    assignmentQuestions: [
      {
        question: 'A grade-able question matching the lesson.',
        expectedAnswer: 'expected answer',
        acceptedKeywords: ['expected', 'answer'],
        rubric: 'Award full marks for correct working AND correct final value. Half marks for correct method only.',
      },
    ],
    extensionChallenge: 'A stretch problem for students who finish early.',
  };
}

export async function POST(request: Request) {
  let body: GenerateLessonInput;
  try {
    body = (await request.json()) as GenerateLessonInput;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }
  if (!body?.topic || typeof body.topic !== 'string') {
    return NextResponse.json({ error: 'Request must include a topic string.' }, { status: 400 });
  }

  const result = await callStructured<GeneratedLesson>({
    userPrompt: lessonPrompt(body),
    mock: lessonMock(body.topic),
    parse: parseLesson,
  });

  return NextResponse.json(result);
}
