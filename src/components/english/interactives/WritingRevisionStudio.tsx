'use client';

import React, { useMemo, useState } from 'react';
import { ClipboardCopy, RotateCcw, Sparkles, Wand2 } from 'lucide-react';
import type { SubjectLesson } from '@/lib/subjects/types';

type Check = {
  id: string;
  label: string;
  hint: string;
  evaluate: (text: string) => { pass: boolean; detail: string };
};

const TELL_WORDS = [
  'sad', 'happy', 'angry', 'scared', 'nervous', 'excited', 'tired', 'shocked', 'embarrassed',
];

const COHESIVE_DEVICES = [
  'however', 'although', 'therefore', 'meanwhile', 'in contrast', 'furthermore', 'as a result',
  'consequently', 'on the other hand', 'similarly', 'in addition',
];

const SENTENCE_OPENER_BUCKETS: { id: string; label: string; test: (s: string) => boolean }[] = [
  { id: 'adverb', label: 'Adverbial (-ly)', test: (s) => /^\s*[a-z]+ly\b/i.test(s) },
  { id: 'ing', label: 'Verb-ing', test: (s) => /^\s*[a-z]+ing\b/i.test(s) },
  { id: 'subordinator', label: 'Subordinator', test: (s) => /^\s*(although|because|whilst|when|after|before|if|since|as)\b/i.test(s) },
  { id: 'pronoun', label: 'Pronoun', test: (s) => /^\s*(he|she|it|they|i|we)\b/i.test(s) },
  { id: 'noun', label: 'Noun phrase', test: (s) => /^\s*(the|a|an|my|our|his|her|their)\b/i.test(s) },
];

function tokeniseSentences(text: string): string[] {
  return text
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

const CHECKS: Check[] = [
  {
    id: 'length',
    label: 'Word count',
    hint: 'Most Year 8 paragraphs land between 80 and 180 words.',
    evaluate: (text) => {
      const words = text.trim().split(/\s+/).filter(Boolean).length;
      return {
        pass: words >= 80 && words <= 250,
        detail: `${words} words${words < 80 ? ' — keep building' : words > 250 ? ' — consider trimming' : ''}`,
      };
    },
  },
  {
    id: 'show-dont-tell',
    label: 'Show, don\'t tell',
    hint: 'Replace bare emotion words with sensory or behavioural detail.',
    evaluate: (text) => {
      const lower = text.toLowerCase();
      const hits = TELL_WORDS.filter((w) => new RegExp(`\\b${w}\\b`).test(lower));
      return {
        pass: hits.length === 0,
        detail:
          hits.length === 0
            ? 'No bare emotion words found.'
            : `Found · ${hits.join(', ')} — show with detail instead.`,
      };
    },
  },
  {
    id: 'cohesion',
    label: 'Cohesive devices',
    hint: 'Aim for at least 2 connectives across paragraphs.',
    evaluate: (text) => {
      const lower = text.toLowerCase();
      const hits = COHESIVE_DEVICES.filter((w) => lower.includes(w));
      return {
        pass: hits.length >= 2,
        detail: hits.length ? `Found · ${hits.join(', ')}` : 'None found — add one or two.',
      };
    },
  },
  {
    id: 'varied-openers',
    label: 'Varied sentence openers',
    hint: 'Use at least 3 different opener types across the paragraph.',
    evaluate: (text) => {
      const sentences = tokeniseSentences(text);
      if (!sentences.length) return { pass: false, detail: 'Draft is empty.' };
      const buckets = new Set<string>();
      for (const s of sentences) {
        const bucket = SENTENCE_OPENER_BUCKETS.find((b) => b.test(s));
        buckets.add(bucket?.id ?? 'other');
      }
      return {
        pass: buckets.size >= 3,
        detail: `${buckets.size} distinct opener type${buckets.size === 1 ? '' : 's'} across ${sentences.length} sentence${sentences.length === 1 ? '' : 's'}.`,
      };
    },
  },
  {
    id: 'punctuation',
    label: 'Sentence-level punctuation variety',
    hint: 'Use at least one semicolon, colon, or dash for control.',
    evaluate: (text) => {
      const variety = [';', ':', '—'].filter((p) => text.includes(p));
      return {
        pass: variety.length > 0,
        detail: variety.length ? `Found · ${variety.join(' ')}` : 'No ; : — found — try one.',
      };
    },
  },
];

export function WritingRevisionStudio({ lesson }: { lesson: SubjectLesson }) {
  const taskPrompt = useMemo(() => lesson.assignmentQuestions[0]?.question ?? lesson.inquiryQuestion, [lesson]);
  const [draft, setDraft] = useState('');

  const results = useMemo(() => CHECKS.map((c) => ({ ...c, ...c.evaluate(draft) })), [draft]);
  const passed = results.filter((r) => r.pass).length;

  const copy = async () => {
    if (typeof navigator === 'undefined' || !navigator.clipboard) return;
    await navigator.clipboard.writeText(draft);
  };

  return (
    <div className="flex h-full min-h-[460px] flex-col rounded-lg border border-white/10 bg-gradient-to-br from-[#1a0a36] via-[#0a0f1e] to-[#050711] p-5">
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-md border border-[#c084fc]/40 bg-[#c084fc]/10 px-2 py-1 text-[10px] font-black uppercase tracking-wide text-[#c084fc]">
            <Wand2 className="h-3 w-3" />
            Writing Revision Studio
          </div>
          <p className="mt-2 text-[10px] font-black uppercase tracking-wide text-slate-400">Task</p>
          <p className="line-clamp-2 text-sm text-slate-200">{taskPrompt}</p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <button
            onClick={copy}
            className="inline-flex items-center gap-1 rounded-md border border-white/15 px-2 py-1 text-[10px] font-black uppercase tracking-wide text-slate-300 transition hover:border-white/40 hover:text-white"
          >
            <ClipboardCopy className="h-3 w-3" />
            Copy
          </button>
          <button
            onClick={() => setDraft('')}
            className="inline-flex items-center gap-1 rounded-md border border-white/15 px-2 py-1 text-[10px] font-black uppercase tracking-wide text-slate-300 transition hover:border-white/40 hover:text-white"
          >
            <RotateCcw className="h-3 w-3" />
            Reset
          </button>
        </div>
      </div>

      <textarea
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        rows={10}
        placeholder="Paste or type your draft. Live revision checks update as you write..."
        className="mt-3 w-full rounded-md border border-white/10 bg-[#0a0f1e] p-3 text-sm leading-6 text-white placeholder:text-slate-500 focus:border-[#c084fc]/60 focus:outline-none"
      />

      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        {results.map((r) => (
          <div
            key={r.id}
            className="rounded-md border p-2.5"
            style={{
              borderColor: r.pass ? 'rgba(52,211,153,.45)' : 'rgba(251,191,36,.45)',
              background: r.pass ? 'rgba(52,211,153,.08)' : 'rgba(251,191,36,.06)',
            }}
          >
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-black uppercase tracking-wide text-white">{r.label}</p>
              <span
                className="rounded-full px-2 py-0.5 text-[10px] font-black uppercase tracking-wide"
                style={{
                  background: r.pass ? 'rgba(52,211,153,.18)' : 'rgba(251,191,36,.18)',
                  color: r.pass ? '#34d399' : '#fbbf24',
                }}
              >
                {r.pass ? 'Strong' : 'Revise'}
              </span>
            </div>
            <p className="mt-1 text-[11px] leading-5 text-slate-300">{r.detail}</p>
            <p className="mt-0.5 text-[10px] italic text-slate-500">{r.hint}</p>
          </div>
        ))}
      </div>

      <div className="mt-3 flex items-center justify-between rounded-md border border-white/10 bg-white/[.02] px-3 py-2">
        <span className="text-[11px] font-bold text-slate-300">
          {passed}/{CHECKS.length} revision checks passing
        </span>
        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#c084fc]">
          <Sparkles className="h-3 w-3" />
          Live feedback
        </span>
      </div>
    </div>
  );
}
