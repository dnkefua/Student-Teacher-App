import { NextResponse } from 'next/server';
import { callStructured } from '@/lib/ai/modelClient';
import { assignmentPrompt } from '@/lib/ai/prompts';
import type {
  GenerateAssignmentInput,
  GenerateAssignmentOutput,
  GeneratedAssignmentQuestion,
} from '@/lib/ai/types';
import type { Difficulty, ThreeDType } from '@/lib/grade8Curriculum';
import type { SubjectId } from '@/lib/subjects/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const DIFFICULTIES = new Set<Difficulty>(['core', 'support', 'extension']);
const THREE_D_TYPES = new Set<ThreeDType>([
  'pythagoras_3d', 'equation_balance_3d', 'linear_graph_3d', 'circle_lab_3d',
  'ratio_mixer_3d', 'solid_geometry_3d', 'angle_lab_3d', 'probability_spinner_3d',
  'percentage_bar_3d', 'data_visualisation_3d',
]);
const ENGLISH_INTERACTIVES = new Set<string>([
  'text_annotation_lab', 'essay_planner', 'poetry_device_highlighter',
  'grammar_sentence_builder', 'writing_revision_studio', 'character_analysis_board',
  'story_structure_map', 'vocabulary_practice', 'debate_simulator', 'speaking_feedback',
]);
const SCIENCE_INTERACTIVES = new Set<string>([
  'cell_3d', 'particle_model_3d', 'forces_motion_sim', 'electric_circuit_builder',
  'chemical_reaction_lab', 'ecosystem_simulation', 'energy_transfer_sim',
  'body_system_3d', 'earth_space_orbit', 'scientific_method_lab',
]);

function asAssignmentQuestions(v: unknown): GeneratedAssignmentQuestion[] | null {
  if (!Array.isArray(v)) return null;
  const out: GeneratedAssignmentQuestion[] = [];
  for (const item of v) {
    if (typeof item !== 'object' || item === null) return null;
    const r = item as Record<string, unknown>;
    if (typeof r.question !== 'string' || typeof r.expectedAnswer !== 'string' || typeof r.rubric !== 'string') {
      return null;
    }
    const acceptedKeywords = Array.isArray(r.acceptedKeywords) && r.acceptedKeywords.every((x) => typeof x === 'string')
      ? (r.acceptedKeywords as string[])
      : [];
    out.push({
      question: r.question,
      expectedAnswer: r.expectedAnswer,
      acceptedKeywords,
      rubric: r.rubric,
    });
  }
  return out;
}

function parserFor(subject: SubjectId) {
  return (raw: unknown): GenerateAssignmentOutput | null => {
    if (typeof raw !== 'object' || raw === null) return null;
    const r = raw as Record<string, unknown>;
    if (typeof r.topic !== 'string') return null;
    const difficulty = r.difficulty as Difficulty;
    if (!DIFFICULTIES.has(difficulty)) return null;
    const questions = asAssignmentQuestions(r.questions);
    if (!questions || questions.length === 0) return null;

    if (subject === 'mathematics') {
      const threeDType = r.threeDType as ThreeDType;
      if (!THREE_D_TYPES.has(threeDType)) return null;
      return { topic: r.topic, subject, difficulty, threeDType, questions };
    }
    const allowed = subject === 'english' ? ENGLISH_INTERACTIVES : SCIENCE_INTERACTIVES;
    const subjectInteractiveType = r.subjectInteractiveType;
    if (typeof subjectInteractiveType !== 'string' || !allowed.has(subjectInteractiveType)) return null;
    return { topic: r.topic, subject, difficulty, subjectInteractiveType, questions };
  };
}

function mockFor(input: GenerateAssignmentInput): GenerateAssignmentOutput {
  const subject: SubjectId = input.subject === 'english' || input.subject === 'science' ? input.subject : 'mathematics';
  const count = Math.min(Math.max(input.count ?? 3, 1), 6);
  const questions: GeneratedAssignmentQuestion[] = Array.from({ length: count }).map((_, i) => ({
    question: `Demo question ${i + 1} on ${input.topic}.`,
    expectedAnswer: 'expected answer',
    acceptedKeywords: ['expected', 'answer'],
    rubric: 'Full marks for accurate response with subject vocabulary; half marks for partial.',
  }));
  if (subject === 'english') {
    return { topic: input.topic, subject, difficulty: input.difficulty ?? 'core', subjectInteractiveType: 'text_annotation_lab', questions };
  }
  if (subject === 'science') {
    return { topic: input.topic, subject, difficulty: input.difficulty ?? 'core', subjectInteractiveType: 'particle_model_3d', questions };
  }
  return { topic: input.topic, subject, difficulty: input.difficulty ?? 'core', threeDType: 'equation_balance_3d', questions };
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

  const subject: SubjectId = body.subject === 'english' || body.subject === 'science' ? body.subject : 'mathematics';

  const result = await callStructured<GenerateAssignmentOutput>({
    userPrompt: assignmentPrompt({ ...body, subject }),
    subject,
    mock: mockFor({ ...body, subject }),
    parse: parserFor(subject),
  });

  return NextResponse.json(result);
}
