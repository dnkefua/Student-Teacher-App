import { NextResponse } from 'next/server';
import { callStructured } from '@/lib/ai/modelClient';
import { scenePrompt } from '@/lib/ai/prompts';
import type { Generate3DSceneInput, Generated3DScene } from '@/lib/ai/types';
import type { ThreeDType } from '@/lib/grade8Curriculum';
import type { SubjectId } from '@/lib/subjects/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

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

function pickMathsThreeD(topic: string): ThreeDType {
  const t = topic.toLowerCase();
  if (t.includes('pythag')) return 'pythagoras_3d';
  if (t.includes('equation') || t.includes('linear') || t.includes('solve')) {
    if (t.includes('graph') || t.includes('gradient') || t.includes('intercept')) return 'linear_graph_3d';
    return 'equation_balance_3d';
  }
  if (t.includes('circle') || t.includes('circumference') || t.includes('radius')) return 'circle_lab_3d';
  if (t.includes('ratio') || t.includes('proportion') || t.includes('fraction')) return 'ratio_mixer_3d';
  if (t.includes('volume') || t.includes('cuboid') || t.includes('cylinder')) return 'solid_geometry_3d';
  if (t.includes('angle') || t.includes('triangle') || t.includes('parallel')) return 'angle_lab_3d';
  if (t.includes('probability') || t.includes('chance') || t.includes('dice') || t.includes('coin')) return 'probability_spinner_3d';
  if (t.includes('percent') || t.includes('decimal')) return 'percentage_bar_3d';
  if (t.includes('mean') || t.includes('median') || t.includes('data') || t.includes('chart') || t.includes('scatter')) return 'data_visualisation_3d';
  return 'equation_balance_3d';
}

function pickEnglishInteractive(topic: string): string {
  const t = topic.toLowerCase();
  if (t.includes('poetry') || t.includes('poem')) return 'poetry_device_highlighter';
  if (t.includes('essay') || t.includes('petal') || t.includes('persuasive')) return 'essay_planner';
  if (t.includes('grammar') || t.includes('punctuation') || t.includes('sentence')) return 'grammar_sentence_builder';
  if (t.includes('character')) return 'character_analysis_board';
  if (t.includes('revision') || t.includes('draft')) return 'writing_revision_studio';
  if (t.includes('story') || t.includes('plot') || t.includes('narrative')) return 'story_structure_map';
  return 'text_annotation_lab';
}

function pickScienceInteractive(topic: string): string {
  const t = topic.toLowerCase();
  if (t.includes('cell') || t.includes('organelle') || t.includes('nucleus')) return 'cell_3d';
  if (t.includes('particle') || t.includes('state') || t.includes('matter')) return 'particle_model_3d';
  if (t.includes('force') || t.includes('motion') || t.includes('friction')) return 'forces_motion_sim';
  if (t.includes('circuit') || t.includes('current') || t.includes('voltage')) return 'electric_circuit_builder';
  if (t.includes('acid') || t.includes('alkali') || t.includes('reaction')) return 'chemical_reaction_lab';
  if (t.includes('ecosystem') || t.includes('food chain') || t.includes('habitat')) return 'ecosystem_simulation';
  if (t.includes('energy') || t.includes('renewable')) return 'energy_transfer_sim';
  return 'particle_model_3d';
}

function parserFor(subject: SubjectId) {
  return (raw: unknown): Generated3DScene | null => {
    if (typeof raw !== 'object' || raw === null) return null;
    const r = raw as Record<string, unknown>;
    if (typeof r.rationale !== 'string') return null;
    if (!Array.isArray(r.animatedSteps) || !r.animatedSteps.every((s) => typeof s === 'string')) return null;
    if (subject === 'mathematics') {
      const threeDType = r.threeDType as ThreeDType;
      if (!THREE_D_TYPES.has(threeDType)) return null;
      return { subject, threeDType, rationale: r.rationale, animatedSteps: r.animatedSteps as string[] };
    }
    const allowed = subject === 'english' ? ENGLISH_INTERACTIVES : SCIENCE_INTERACTIVES;
    const subjectInteractiveType = r.subjectInteractiveType;
    if (typeof subjectInteractiveType !== 'string' || !allowed.has(subjectInteractiveType)) return null;
    return { subject, subjectInteractiveType, rationale: r.rationale, animatedSteps: r.animatedSteps as string[] };
  };
}

function mockFor(input: Generate3DSceneInput): Generated3DScene {
  const subject: SubjectId = input.subject === 'english' || input.subject === 'science' ? input.subject : 'mathematics';
  const baseSteps = [
    `Introduce the inquiry behind ${input.topic}.`,
    'Reveal the interactive and label its key parts.',
    'Run a short demonstration that performs the core operation.',
    'Pause on the result and ask a student checkpoint.',
    'Replay slowed-down for any students who missed the beat.',
  ];
  if (subject === 'english') {
    const id = pickEnglishInteractive(input.topic);
    return {
      subject,
      subjectInteractiveType: id,
      rationale: `For "${input.topic}", the ${id.replace(/_/g, ' ')} workshop makes the craft choices visible.`,
      animatedSteps: baseSteps,
    };
  }
  if (subject === 'science') {
    const id = pickScienceInteractive(input.topic);
    return {
      subject,
      subjectInteractiveType: id,
      rationale: `For "${input.topic}", the ${id.replace(/_/g, ' ')} simulation lets students manipulate the variables themselves.`,
      animatedSteps: baseSteps,
    };
  }
  const threeDType = pickMathsThreeD(input.topic);
  return {
    subject,
    threeDType,
    rationale: `For "${input.topic}", a ${threeDType.replace(/_/g, ' ')} scene makes the underlying structure tangible.`,
    animatedSteps: baseSteps,
  };
}

export async function POST(request: Request) {
  let body: Generate3DSceneInput;
  try {
    body = (await request.json()) as Generate3DSceneInput;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }
  if (!body?.topic || typeof body.topic !== 'string') {
    return NextResponse.json({ error: 'Request must include a topic string.' }, { status: 400 });
  }

  const subject: SubjectId = body.subject === 'english' || body.subject === 'science' ? body.subject : 'mathematics';

  const result = await callStructured<Generated3DScene>({
    userPrompt: scenePrompt({ ...body, subject }),
    subject,
    mock: mockFor({ ...body, subject }),
    parse: parserFor(subject),
  });

  return NextResponse.json(result);
}
