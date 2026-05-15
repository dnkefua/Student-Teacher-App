import { NextResponse } from 'next/server';
import { callStructured } from '@/lib/ai/modelClient';
import { scenePrompt } from '@/lib/ai/prompts';
import type { Generate3DSceneInput, Generated3DScene } from '@/lib/ai/types';
import type { ThreeDType } from '@/lib/grade8Curriculum';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

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

// Lightweight heuristic so the mock is responsive to the actual topic.
function pickThreeDFromTopic(topic: string): ThreeDType {
  const t = topic.toLowerCase();
  if (t.includes('pythag')) return 'pythagoras_3d';
  if (t.includes('equation') || t.includes('linear') || t.includes('solve')) {
    if (t.includes('graph') || t.includes('gradient') || t.includes('intercept')) return 'linear_graph_3d';
    return 'equation_balance_3d';
  }
  if (t.includes('circle') || t.includes('circumference') || t.includes('radius')) return 'circle_lab_3d';
  if (t.includes('ratio') || t.includes('proportion') || t.includes('fraction')) return 'ratio_mixer_3d';
  if (t.includes('volume') || t.includes('cuboid') || t.includes('cylinder') || t.includes('3d shape')) return 'solid_geometry_3d';
  if (t.includes('angle') || t.includes('triangle') || t.includes('parallel')) return 'angle_lab_3d';
  if (t.includes('probability') || t.includes('chance') || t.includes('dice') || t.includes('coin')) return 'probability_spinner_3d';
  if (t.includes('percent') || t.includes('decimal')) return 'percentage_bar_3d';
  if (t.includes('mean') || t.includes('median') || t.includes('data') || t.includes('chart') || t.includes('scatter')) return 'data_visualisation_3d';
  return 'equation_balance_3d';
}

function parseScene(raw: unknown): Generated3DScene | null {
  if (typeof raw !== 'object' || raw === null) return null;
  const r = raw as Record<string, unknown>;
  const threeDType = r.threeDType as ThreeDType;
  if (!THREE_D_TYPES.has(threeDType)) return null;
  if (typeof r.rationale !== 'string') return null;
  if (!Array.isArray(r.animatedSteps) || !r.animatedSteps.every((s) => typeof s === 'string')) return null;
  return {
    threeDType,
    rationale: r.rationale,
    animatedSteps: r.animatedSteps as string[],
  };
}

function sceneMock(input: Generate3DSceneInput): Generated3DScene {
  const threeDType = pickThreeDFromTopic(input.topic);
  return {
    threeDType,
    rationale: `For "${input.topic}", a ${threeDType.replace(/_/g, ' ')} scene makes the underlying structure tangible. Students see the moving parts that the formula captures.`,
    animatedSteps: [
      `Introduce the inquiry behind ${input.topic}.`,
      'Show the 3D scene from a neutral angle, label the key parts.',
      'Run a short animation that performs the core operation.',
      'Pause on the result and ask a student checkpoint question.',
      'Replay slowed-down for any students who missed the beat.',
    ],
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

  const result = await callStructured<Generated3DScene>({
    userPrompt: scenePrompt(body),
    mock: sceneMock(body),
    parse: parseScene,
  });

  return NextResponse.json(result);
}
