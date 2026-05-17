'use client';

import React from 'react';
import { Check, Play } from 'lucide-react';
import type { CinematicStoryboardStep } from '@/lib/cinematic/types';

export function CinematicTimeline({
  steps,
  currentStepId,
  completedStepIds,
  onSelectStep,
}: {
  steps: CinematicStoryboardStep[];
  currentStepId?: string;
  completedStepIds?: string[];
  onSelectStep: (stepId: string) => void;
}) {
  const completed = new Set(completedStepIds ?? []);
  return (
    <div className="rounded-lg border border-white/10 bg-[#061126] p-4">
      <p className="text-xs font-black uppercase tracking-wide text-[#ffc43b]">Storyboard timeline</p>
      <div className="mt-3 space-y-2">
        {steps.map((step, index) => {
          const active = step.id === currentStepId;
          const done = completed.has(step.id);
          return (
            <button
              key={step.id}
              type="button"
              onClick={() => onSelectStep(step.id)}
              className={`flex w-full items-start gap-3 rounded-md border px-3 py-3 text-left transition ${
                active ? 'border-[#49c8ff] bg-[#49c8ff]/10' : 'border-white/10 bg-white/[0.03] hover:border-white/25'
              }`}
            >
              <span
                className={`mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full text-[10px] font-black ${
                  done ? 'bg-emerald-300 text-[#061126]' : active ? 'bg-[#49c8ff] text-[#061126]' : 'bg-white/10 text-slate-300'
                }`}
              >
                {done ? <Check className="h-3 w-3" /> : active ? <Play className="h-3 w-3" /> : index + 1}
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-black text-white">{step.title}</span>
                <span className="mt-1 line-clamp-2 block text-xs leading-5 text-slate-400">{step.visualAction}</span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
