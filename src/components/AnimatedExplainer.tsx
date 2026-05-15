'use client';

import React, { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle2, Sparkles, Volume2 } from 'lucide-react';
import type { ExplainerStep } from '@/lib/grade8Curriculum';

export type AnimatedExplainerProps = {
  steps: ExplainerStep[];
  /** Called with the index of the step the user just moved to. */
  onStepChange?: (stepIndex: number) => void;
  /** Called when the student clicks "Mark complete" on the final step. */
  onComplete?: () => void;
  /** Optional label shown above the step counter (e.g. lesson title). */
  caption?: string;
};

export function AnimatedExplainer({
  steps,
  onStepChange,
  onComplete,
  caption,
}: AnimatedExplainerProps) {
  const [index, setIndex] = useState(0);
  const [completed, setCompleted] = useState(false);

  const total = steps.length;
  const step = steps[Math.min(index, total - 1)];
  const isFinal = index === total - 1;

  useEffect(() => {
    onStepChange?.(index);
  }, [index, onStepChange]);

  if (total === 0) {
    return (
      <div className="rounded-lg border border-white/10 bg-[#061126] p-6 text-slate-300">
        No explainer steps available for this lesson yet.
      </div>
    );
  }

  const go = (next: number) => {
    if (next < 0 || next >= total) return;
    setIndex(next);
  };

  const markComplete = () => {
    setCompleted(true);
    onComplete?.();
  };

  return (
    <section className="relative overflow-hidden rounded-lg border border-white/10 bg-gradient-to-br from-[#0a1736] via-[#061126] to-[#050711] p-6 text-white">
      <div className="pointer-events-none absolute -left-12 -top-12 h-44 w-44 rounded-full bg-[#49c8ff]/15 blur-3xl" />
      <div className="pointer-events-none absolute -right-12 -bottom-12 h-44 w-44 rounded-full bg-[#ffc43b]/15 blur-3xl" />

      <div className="relative flex items-center justify-between gap-3">
        <div>
          {caption ? (
            <p className="text-[10px] font-black uppercase tracking-wide text-slate-500">{caption}</p>
          ) : null}
          <p className="text-xs font-black uppercase tracking-wide text-[#8ddfff]">
            Animated explainer · Step {Math.min(index + 1, total)} of {total}
          </p>
        </div>
        <div className="flex items-center gap-1">
          {Array.from({ length: total }).map((_, i) => (
            <span
              key={i}
              className={`h-1.5 w-6 rounded-full transition ${
                i < index ? 'bg-[#49c8ff]' : i === index ? 'bg-[#ffc43b]' : 'bg-white/15'
              }`}
            />
          ))}
        </div>
      </div>

      <div key={index} className="relative mt-6 animate-eis-fade">
        <h3 className="text-2xl font-black text-white">{step.title}</h3>
        <p className="mt-3 max-w-2xl text-base leading-7 text-slate-200">{step.body}</p>

        {step.formula ? (
          <div className="mt-5 inline-flex items-center gap-3 rounded-md border border-[#ffc43b]/30 bg-[#ffc43b]/10 px-4 py-3">
            <Sparkles className="h-4 w-4 text-[#ffc43b]" />
            <span className="font-mono text-lg font-black tracking-wide text-[#ffe08a]">{step.formula}</span>
          </div>
        ) : null}

        {step.narration ? (
          <div className="mt-5 flex items-start gap-3 rounded-md border border-white/10 bg-white/[0.03] p-4">
            <Volume2 className="mt-0.5 h-4 w-4 shrink-0 text-[#49c8ff]" />
            <p className="text-sm italic leading-6 text-slate-300">{step.narration}</p>
          </div>
        ) : null}

        {step.checkpoint ? (
          <div className="mt-5 rounded-md border border-emerald-400/30 bg-emerald-400/10 p-4">
            <p className="text-xs font-black uppercase tracking-wide text-emerald-200">Student checkpoint</p>
            <p className="mt-2 text-sm leading-6 text-emerald-50">{step.checkpoint}</p>
          </div>
        ) : null}
      </div>

      <div className="relative mt-7 flex flex-wrap items-center gap-3">
        <button
          onClick={() => go(index - 1)}
          disabled={index === 0}
          className="inline-flex items-center gap-2 rounded-md border border-white/15 px-4 py-2.5 text-sm font-black text-white transition hover:border-white/35 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>

        {isFinal ? (
          <button
            onClick={markComplete}
            disabled={completed}
            className={`inline-flex items-center gap-2 rounded-md px-5 py-2.5 text-sm font-black transition ${
              completed
                ? 'bg-emerald-400 text-[#061126] shadow-[0_0_24px_rgba(74,222,128,.55)]'
                : 'animate-eis-pulse bg-[#49c8ff] text-[#061126] shadow-[0_0_22px_rgba(73,200,255,.35)] hover:bg-[#8ddfff]'
            }`}
          >
            <CheckCircle2 className="h-4 w-4" />
            {completed ? 'Lesson complete' : 'Mark complete'}
          </button>
        ) : (
          <button
            onClick={() => go(index + 1)}
            className="animate-eis-pulse inline-flex items-center gap-2 rounded-md bg-[#ffc43b] px-5 py-2.5 text-sm font-black text-[#061126] shadow-[0_0_22px_rgba(255,196,59,.35)] transition hover:bg-[#ffe08a]"
          >
            Next step
            <ArrowRight className="h-4 w-4" />
          </button>
        )}
      </div>
    </section>
  );
}
