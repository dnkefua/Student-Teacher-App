'use client';

import React from 'react';
import { Sparkles } from 'lucide-react';
import type { SubjectLesson } from '@/lib/subjects/types';

const labels: Record<string, string> = {
  story_structure_map: 'Story Structure Map',
  character_analysis_board: 'Character Analysis Board',
  vocabulary_practice: 'Vocabulary Practice',
  debate_simulator: 'Debate Simulator',
  speaking_feedback: 'Speaking Feedback',
};

export function EnglishPlaceholderInteractive({ lesson }: { lesson: SubjectLesson }) {
  const label = labels[lesson.interactiveType as string] ?? 'Interactive Workshop';
  return (
    <div className="flex h-full min-h-[380px] flex-col rounded-lg border border-white/10 bg-gradient-to-br from-[#1a0a36] via-[#0a0f1e] to-[#050711] p-5">
      <div className="inline-flex w-fit items-center gap-1.5 rounded-md border border-[#c084fc]/40 bg-[#c084fc]/10 px-2 py-1 text-[10px] font-black uppercase tracking-wide text-[#c084fc]">
        <Sparkles className="h-3 w-3" />
        Interactive · {label}
      </div>
      <h3 className="mt-3 text-xl font-black text-white">{lesson.title}</h3>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">{lesson.studentExplanation}</p>

      <div className="mt-4 grid flex-1 place-items-center rounded-md border border-dashed border-white/15 bg-white/[.02] p-6 text-center">
        <div>
          <p className="text-xs font-black uppercase tracking-wide text-slate-400">Coming soon</p>
          <p className="mt-2 max-w-md text-sm text-slate-300">
            This workshop will be live in the next release. Use the Practice and Assignment tabs to work through this
            lesson today — your responses still flow into Mastery Analytics.
          </p>
        </div>
      </div>
    </div>
  );
}
