'use client';

import React, { useState } from 'react';
import { ClipboardList, FlaskConical, RotateCcw } from 'lucide-react';
import type { SubjectLesson } from '@/lib/subjects/types';

type Step = {
  id: 'question' | 'hypothesis' | 'independent' | 'dependent' | 'control' | 'method' | 'conclusion';
  label: string;
  prompt: string;
};

const STEPS: Step[] = [
  { id: 'question', label: 'Research question', prompt: 'What are you investigating? Write as a question.' },
  { id: 'hypothesis', label: 'Hypothesis', prompt: 'Predict the outcome — "If… then… because…" form.' },
  { id: 'independent', label: 'Independent variable', prompt: 'The variable you change. State the range you will test.' },
  { id: 'dependent', label: 'Dependent variable', prompt: 'The variable you measure. State the units and instrument.' },
  { id: 'control', label: 'Control variables', prompt: 'List the variables you keep the same to make it a fair test.' },
  { id: 'method', label: 'Method', prompt: 'Numbered steps so someone else could repeat your experiment exactly.' },
  { id: 'conclusion', label: 'Expected conclusion', prompt: 'What pattern in the data would support your hypothesis? What would refute it?' },
];

export function ScientificMethodLab({ lesson }: { lesson: SubjectLesson }) {
  const [notes, setNotes] = useState<Record<Step['id'], string>>(() => ({
    question: lesson.inquiryQuestion,
    hypothesis: '',
    independent: '',
    dependent: '',
    control: '',
    method: '',
    conclusion: '',
  }));

  const filled = STEPS.filter((s) => (notes[s.id] ?? '').trim().length > 0).length;
  const ready = filled === STEPS.length;

  const update = (id: Step['id'], value: string) => setNotes((prev) => ({ ...prev, [id]: value }));

  const reset = () =>
    setNotes({
      question: lesson.inquiryQuestion,
      hypothesis: '',
      independent: '',
      dependent: '',
      control: '',
      method: '',
      conclusion: '',
    });

  return (
    <div className="flex h-full min-h-[460px] flex-col rounded-lg border border-white/10 bg-gradient-to-br from-[#062019] via-[#06121e] to-[#050711] p-5">
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-md border border-[#34d399]/40 bg-[#34d399]/10 px-2 py-1 text-[10px] font-black uppercase tracking-wide text-[#34d399]">
            <FlaskConical className="h-3 w-3" />
            Scientific Method Lab
          </div>
          <p className="mt-2 text-sm font-black text-white">Plan a fair-test experiment</p>
          <p className="text-[11px] text-slate-400">Fill each section. A complete plan can be copied straight into your lab book.</p>
        </div>
        <button
          onClick={reset}
          className="inline-flex items-center gap-1 rounded-md border border-white/15 px-2 py-1 text-[10px] font-black uppercase tracking-wide text-slate-300 transition hover:border-white/40 hover:text-white"
        >
          <RotateCcw className="h-3 w-3" />
          Reset
        </button>
      </div>

      <div className="mt-3 flex-1 space-y-2 overflow-auto">
        {STEPS.map((s, i) => (
          <div key={s.id} className="rounded-md border border-white/10 bg-white/[.02] p-3">
            <div className="flex items-center gap-1.5">
              <span className="grid h-5 w-5 place-items-center rounded-full bg-[#34d399]/20 text-[10px] font-black text-[#34d399]">
                {i + 1}
              </span>
              <span className="text-[11px] font-black uppercase tracking-wide text-[#34d399]">{s.label}</span>
            </div>
            <p className="mt-1 text-[11px] italic text-slate-400">{s.prompt}</p>
            <textarea
              value={notes[s.id]}
              onChange={(e) => update(s.id, e.target.value)}
              rows={s.id === 'method' ? 4 : 2}
              placeholder="..."
              className="mt-1.5 w-full rounded-md border border-white/10 bg-[#0a1a14] p-2 text-sm text-white placeholder:text-slate-500 focus:border-white/30 focus:outline-none"
            />
          </div>
        ))}
      </div>

      <div
        className="mt-3 inline-flex items-center justify-between gap-2 rounded-md border px-3 py-2 text-[11px] font-bold"
        style={{
          borderColor: ready ? 'rgba(52,211,153,.45)' : 'rgba(255,255,255,.15)',
          background: ready ? 'rgba(52,211,153,.08)' : 'rgba(255,255,255,.02)',
          color: ready ? '#34d399' : '#cbd5e1',
        }}
      >
        <span className="inline-flex items-center gap-1.5">
          <ClipboardList className="h-3 w-3" />
          {filled}/{STEPS.length} sections complete
        </span>
        <span>{ready ? 'Ready to run experiment' : 'Keep going'}</span>
      </div>
    </div>
  );
}
