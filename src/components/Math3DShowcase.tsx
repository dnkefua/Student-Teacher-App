'use client';

// Single-viewport 3D lesson library. One WebGL context at a time — pick a
// scene with the chip row, the viewport swaps. Replaces the old four
// stacked panels that rendered 4 simultaneous Canvas contexts on the
// dashboard (cluttered + heavy on the GPU).

import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { ExplainerByType } from '@/components/Math3DExplainers';
import { threeDLabels, type ThreeDType } from '@/lib/grade8Curriculum';

type SceneGroup = {
  label: string;
  scenes: ThreeDType[];
};

const SCENE_GROUPS: SceneGroup[] = [
  { label: 'Algebra', scenes: ['equation_balance_3d', 'linear_graph_3d'] },
  { label: 'Geometry', scenes: ['pythagoras_3d', 'circle_lab_3d', 'angle_lab_3d', 'solid_geometry_3d'] },
  { label: 'Number', scenes: ['ratio_mixer_3d', 'percentage_bar_3d'] },
  { label: 'Data', scenes: ['probability_spinner_3d', 'data_visualisation_3d'] },
];

const SCENE_CAPTIONS: Record<ThreeDType, string> = {
  pythagoras_3d: 'See how a² + b² = c² on a rotating right-angled triangle.',
  equation_balance_3d: 'Drag weights across a 3D balance to solve linear equations.',
  linear_graph_3d: 'Plot y = mx + c and watch the line tilt as you change the slope.',
  circle_lab_3d: 'Explore radius, diameter, circumference and π in one viewport.',
  ratio_mixer_3d: 'Pour two coloured liquids in different ratios and see the proportion live.',
  solid_geometry_3d: 'Inspect volume and surface area of prisms, pyramids and cylinders.',
  angle_lab_3d: 'Manipulate angle pairs and watch the relationships update on the fly.',
  probability_spinner_3d: 'Spin a wheel split into sectors to compare theoretical and observed odds.',
  percentage_bar_3d: 'Convert between fractions, decimals and percentages on a sliding bar.',
  data_visualisation_3d: 'Compare bar, pie and scatter charts on the same dataset.',
};

interface Math3DShowcaseProps {
  initial?: ThreeDType;
}

export function Math3DShowcase({ initial = 'equation_balance_3d' }: Math3DShowcaseProps) {
  const [active, setActive] = useState<ThreeDType>(initial);

  return (
    <section className="relative overflow-hidden rounded-lg border border-white/10 bg-gradient-to-br from-[#0a1736] via-[#061126] to-[#050711] p-5 text-white">
      <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-[#49c8ff]/15 blur-3xl" />

      <header className="relative flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-md border border-[#49c8ff]/30 bg-[#49c8ff]/10 px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-[#8ddfff]">
            <Sparkles className="h-3 w-3" />
            3D Lesson Library
          </div>
          <h2 className="mt-2 text-lg font-black tracking-tight text-white">{threeDLabels[active]}</h2>
          <p className="mt-1 max-w-2xl text-xs leading-5 text-slate-300">{SCENE_CAPTIONS[active]}</p>
        </div>
        <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">
          Pick a scene below — one viewport, ten worlds
        </p>
      </header>

      {/* Chip selector grouped by topic */}
      <div className="relative mt-4 space-y-2">
        {SCENE_GROUPS.map((group) => (
          <div key={group.label} className="flex flex-wrap items-center gap-1.5">
            <span className="mr-1 text-[9px] font-black uppercase tracking-widest text-slate-500">
              {group.label}
            </span>
            {group.scenes.map((scene) => {
              const isActive = active === scene;
              return (
                <button
                  key={scene}
                  onClick={() => setActive(scene)}
                  className={`rounded-full px-2.5 py-1 text-[11px] font-bold transition ${
                    isActive
                      ? 'bg-[#ffc43b] text-[#061126] shadow-[0_0_14px_rgba(255,196,59,.4)]'
                      : 'border border-white/10 bg-white/5 text-slate-300 hover:border-white/30 hover:text-white'
                  }`}
                >
                  {threeDLabels[scene].replace(' 3D', '')}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Viewport */}
      <div className="relative mt-4 overflow-hidden rounded-md border border-white/10 bg-[#050711]">
        <ExplainerByType type={active} />
      </div>
    </section>
  );
}
