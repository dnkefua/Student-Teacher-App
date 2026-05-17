'use client';

import React from 'react';
import { Mic2, Wand2 } from 'lucide-react';
import type { CinematicStoryboardStep } from '@/lib/cinematic/types';

export function CinematicNarrationPanel({
  step,
  masteryConcept,
  teacherMode,
  onGenerateHeyGen,
}: {
  step?: CinematicStoryboardStep;
  masteryConcept: string;
  teacherMode: boolean;
  onGenerateHeyGen?: () => void;
}) {
  return (
    <div className="rounded-lg border border-white/10 bg-[#061126] p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-black uppercase tracking-wide text-[#8ddfff]">Teacher narration</p>
        <span className="rounded-md border border-white/10 bg-white/[0.04] px-2 py-1 text-[10px] font-black uppercase tracking-wide text-slate-300">
          Play narration
        </span>
      </div>
      <h3 className="mt-3 text-lg font-black text-white">{step?.title ?? 'Lesson step'}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-200">{step?.narration ?? 'Select a storyboard step to preview the narration.'}</p>
      <p className="mt-3 rounded-md border border-[#ffc43b]/25 bg-[#ffc43b]/5 px-3 py-2 text-xs leading-5 text-[#ffe08a]">
        Key concept: <span className="font-black text-white">{masteryConcept}</span>
      </p>
      {step?.studentPrompt ? (
        <p className="mt-3 rounded-md border border-[#49c8ff]/25 bg-[#49c8ff]/5 px-3 py-2 text-xs leading-5 text-[#8ddfff]">
          Student prompt: {step.studentPrompt}
        </p>
      ) : null}
      {teacherMode ? (
        <button
          type="button"
          onClick={onGenerateHeyGen}
          className="mt-4 inline-flex items-center gap-2 rounded-md bg-[#ffc43b] px-3 py-2 text-xs font-black text-[#061126] transition hover:bg-[#ffe08a]"
        >
          <Wand2 className="h-3.5 w-3.5" />
          Generate HeyGen explainer
        </button>
      ) : (
        <div className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-slate-400">
          <Mic2 className="h-3.5 w-3.5" />
          Narration text is available without video.
        </div>
      )}
    </div>
  );
}
