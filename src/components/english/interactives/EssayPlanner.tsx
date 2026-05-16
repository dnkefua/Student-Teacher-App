'use client';

import React, { useMemo, useState } from 'react';
import { ClipboardCopy, PenLine, RotateCcw, Sparkles } from 'lucide-react';
import type { SubjectLesson } from '@/lib/subjects/types';

type PetalSlot = {
  key: 'point' | 'evidence' | 'technique' | 'analysis' | 'link';
  label: string;
  prompt: string;
  example: string;
};

const PETAL: PetalSlot[] = [
  {
    key: 'point',
    label: 'P · Point',
    prompt: 'State a clear claim that answers the question.',
    example: 'The writer presents Charlie as resilient despite his poverty.',
  },
  {
    key: 'evidence',
    label: 'E · Evidence',
    prompt: 'Quote a precise short phrase from the text.',
    example: '"the smell from the chocolate factory… reminded him each day of his hunger."',
  },
  {
    key: 'technique',
    label: 'T · Technique',
    prompt: 'Name the writer\'s technique (e.g. sensory imagery, juxtaposition).',
    example: 'Sensory imagery and juxtaposition.',
  },
  {
    key: 'analysis',
    label: 'A · Analysis',
    prompt: 'Explain HOW the technique shapes meaning and effect on reader.',
    example: 'Dahl pairs the inviting smell with hunger to underline Charlie\'s deprivation while keeping him hopeful.',
  },
  {
    key: 'link',
    label: 'L · Link',
    prompt: 'Link back to the question or thesis.',
    example: 'This shows how Dahl builds sympathy for Charlie that pays off in the golden-ticket scene.',
  },
];

export function EssayPlanner({ lesson }: { lesson: SubjectLesson }) {
  const thesisPrompt = useMemo(() => lesson.assignmentQuestions[0]?.question ?? lesson.inquiryQuestion, [lesson]);

  const [thesis, setThesis] = useState('');
  const [paragraphs, setParagraphs] = useState([
    Object.fromEntries(PETAL.map((p) => [p.key, ''])) as Record<PetalSlot['key'], string>,
    Object.fromEntries(PETAL.map((p) => [p.key, ''])) as Record<PetalSlot['key'], string>,
  ]);
  const [active, setActive] = useState(0);
  const [showExample, setShowExample] = useState<Record<PetalSlot['key'], boolean>>({
    point: false, evidence: false, technique: false, analysis: false, link: false,
  });

  const filled = paragraphs[active] ? PETAL.filter((p) => paragraphs[active][p.key].trim().length > 0).length : 0;

  const update = (key: PetalSlot['key'], value: string) => {
    setParagraphs((prev) => {
      const next = prev.map((p, i) => (i === active ? { ...p, [key]: value } : p));
      return next;
    });
  };

  const addParagraph = () => {
    setParagraphs((prev) => [
      ...prev,
      Object.fromEntries(PETAL.map((p) => [p.key, ''])) as Record<PetalSlot['key'], string>,
    ]);
    setActive(paragraphs.length);
  };

  const reset = () => {
    setThesis('');
    setParagraphs([
      Object.fromEntries(PETAL.map((p) => [p.key, ''])) as Record<PetalSlot['key'], string>,
      Object.fromEntries(PETAL.map((p) => [p.key, ''])) as Record<PetalSlot['key'], string>,
    ]);
    setActive(0);
  };

  const compiled = useMemo(() => {
    const intro = thesis.trim();
    const body = paragraphs
      .map((p, i) => {
        const parts = PETAL.map((slot) => p[slot.key].trim()).filter(Boolean);
        if (parts.length === 0) return '';
        return `Paragraph ${i + 1}:\n${parts.join(' ')}`;
      })
      .filter(Boolean)
      .join('\n\n');
    return [intro && `Thesis: ${intro}`, body].filter(Boolean).join('\n\n');
  }, [thesis, paragraphs]);

  const copy = async () => {
    if (typeof navigator === 'undefined' || !navigator.clipboard) return;
    await navigator.clipboard.writeText(compiled);
  };

  return (
    <div className="flex h-full min-h-[460px] flex-col rounded-lg border border-white/10 bg-gradient-to-br from-[#1a0a36] via-[#0a0f1e] to-[#050711] p-5">
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-md border border-[#c084fc]/40 bg-[#c084fc]/10 px-2 py-1 text-[10px] font-black uppercase tracking-wide text-[#c084fc]">
            <PenLine className="h-3 w-3" />
            PETAL Essay Planner
          </div>
          <p className="mt-2 text-[10px] font-black uppercase tracking-wide text-slate-400">Task</p>
          <p className="line-clamp-2 text-sm text-slate-200">{thesisPrompt}</p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <button
            onClick={copy}
            className="inline-flex items-center gap-1 rounded-md border border-white/15 px-2 py-1 text-[10px] font-black uppercase tracking-wide text-slate-300 transition hover:border-white/40 hover:text-white"
          >
            <ClipboardCopy className="h-3 w-3" />
            Copy draft
          </button>
          <button
            onClick={reset}
            className="inline-flex items-center gap-1 rounded-md border border-white/15 px-2 py-1 text-[10px] font-black uppercase tracking-wide text-slate-300 transition hover:border-white/40 hover:text-white"
          >
            <RotateCcw className="h-3 w-3" />
            Reset
          </button>
        </div>
      </div>

      <div className="mt-3">
        <p className="mb-1 text-[10px] font-black uppercase tracking-wide text-slate-400">Thesis statement</p>
        <textarea
          value={thesis}
          onChange={(e) => setThesis(e.target.value)}
          rows={2}
          placeholder="One sentence claim that answers the question..."
          className="w-full rounded-md border border-white/10 bg-[#0a0f1e] p-2 text-sm text-white placeholder:text-slate-500 focus:border-[#c084fc]/60 focus:outline-none"
        />
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        {paragraphs.map((_, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className="rounded-md border px-2.5 py-1 text-[11px] font-black uppercase tracking-wide transition"
            style={{
              borderColor: active === i ? '#c084fc' : 'rgba(255,255,255,.15)',
              background: active === i ? '#c084fc1A' : 'transparent',
              color: active === i ? '#c084fc' : '#cbd5e1',
            }}
          >
            P{i + 1}
          </button>
        ))}
        <button
          onClick={addParagraph}
          className="rounded-md border border-dashed border-white/20 px-2.5 py-1 text-[11px] font-black uppercase tracking-wide text-slate-300 transition hover:border-white/50 hover:text-white"
        >
          + paragraph
        </button>
        <span className="ml-auto text-[11px] font-bold text-slate-400">{filled}/5 PETAL slots filled</span>
      </div>

      <div className="mt-3 flex-1 space-y-2 overflow-auto">
        {PETAL.map((slot) => (
          <div key={slot.key} className="rounded-md border border-white/10 bg-white/[.02] p-2.5">
            <div className="mb-1 flex items-center justify-between gap-2">
              <p className="text-[11px] font-black uppercase tracking-wide text-[#c084fc]">{slot.label}</p>
              <button
                onClick={() => setShowExample((prev) => ({ ...prev, [slot.key]: !prev[slot.key] }))}
                className="text-[10px] font-bold uppercase tracking-wide text-slate-400 hover:text-white"
              >
                {showExample[slot.key] ? 'Hide example' : 'Show example'}
              </button>
            </div>
            <p className="mb-1 text-[11px] text-slate-400">{slot.prompt}</p>
            <textarea
              value={paragraphs[active][slot.key]}
              onChange={(e) => update(slot.key, e.target.value)}
              rows={2}
              placeholder={`Write your ${slot.label.split('·')[1]?.trim() ?? slot.label} here...`}
              className="w-full rounded-md border border-white/10 bg-[#0a0f1e] p-2 text-sm text-white placeholder:text-slate-500 focus:border-[#c084fc]/60 focus:outline-none"
            />
            {showExample[slot.key] && (
              <p className="mt-1 rounded-md border border-[#c084fc]/30 bg-[#c084fc]/10 p-2 text-[11px] italic leading-5 text-slate-200">
                <Sparkles className="mr-1 inline h-3 w-3 text-[#c084fc]" />
                {slot.example}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
