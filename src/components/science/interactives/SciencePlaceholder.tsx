'use client';

import React from 'react';
import { Beaker } from 'lucide-react';
import type { SubjectLesson } from '@/lib/subjects/types';

const LABELS: Record<string, string> = {
  chemical_reaction_lab: 'Chemical Reaction Lab',
  energy_transfer_sim: 'Energy Transfer Simulator',
  ecosystem_simulation: 'Ecosystem Simulation',
  body_system_3d: 'Body Systems 3D',
  earth_space_orbit: 'Earth & Space Orbit',
  scientific_method_lab: 'Scientific Method Lab',
};

export function SciencePlaceholder({ lesson }: { lesson: SubjectLesson }) {
  const label = LABELS[lesson.interactiveType as string] ?? 'Science Workshop';
  return (
    <div className="flex h-full min-h-[380px] flex-col rounded-lg border border-white/10 bg-gradient-to-br from-[#062019] via-[#06121e] to-[#050711] p-5">
      <div className="inline-flex w-fit items-center gap-1.5 rounded-md border border-[#34d399]/40 bg-[#34d399]/10 px-2 py-1 text-[10px] font-black uppercase tracking-wide text-[#34d399]">
        <Beaker className="h-3 w-3" />
        Interactive · {label}
      </div>
      <h3 className="mt-3 text-xl font-black text-white">{lesson.title}</h3>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">{lesson.studentExplanation}</p>

      <div className="mt-4 grid flex-1 place-items-center rounded-md border border-dashed border-white/15 bg-white/[.02] p-6 text-center">
        <div>
          <p className="text-xs font-black uppercase tracking-wide text-slate-400">Coming soon</p>
          <p className="mt-2 max-w-md text-sm text-slate-300">
            This simulation will be live in the next release. Use the Practice and Assignment tabs to work through this
            lesson today — responses still flow into Mastery Analytics.
          </p>
        </div>
      </div>
    </div>
  );
}
