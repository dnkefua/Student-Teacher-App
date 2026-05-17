'use client';

import React from 'react';
import type { CinematicLessonSpec } from '@/lib/cinematic/types';

export function SceneStoryboard({ spec }: { spec: CinematicLessonSpec }) {
  return (
    <div className="rounded-lg border border-white/10 bg-[#061126] p-4">
      <p className="text-xs font-black uppercase tracking-wide text-[#ffc43b]">Scene storyboard</p>
      <div className="mt-3 grid gap-3 md:grid-cols-3">
        {spec.storyboard.map((step, index) => (
          <article key={step.id} className="rounded-md border border-white/10 bg-white/[0.03] p-3">
            <p className="text-[10px] font-black uppercase tracking-wide text-[#8ddfff]">Scene {index + 1}</p>
            <h3 className="mt-1 text-sm font-black text-white">{step.title}</h3>
            <p className="mt-2 text-xs leading-5 text-slate-300">{step.visualAction}</p>
            {step.cameraAction ? <p className="mt-2 text-[10px] uppercase tracking-wide text-slate-500">{step.cameraAction.replace(/_/g, ' ')}</p> : null}
          </article>
        ))}
      </div>
    </div>
  );
}
