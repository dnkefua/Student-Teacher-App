'use client';

import React, { useMemo, useState } from 'react';
import { PenLine, Plus, RotateCcw, Wand2 } from 'lucide-react';
import type { SubjectLesson } from '@/lib/subjects/types';

type Chip = {
  id: string;
  role: 'subject' | 'verb' | 'object' | 'adverbial' | 'connector';
  text: string;
};

const ROLE_STYLE: Record<Chip['role'], { color: string; label: string }> = {
  subject: { color: '#49c8ff', label: 'Subject' },
  verb: { color: '#c084fc', label: 'Verb' },
  object: { color: '#34d399', label: 'Object' },
  adverbial: { color: '#ffc43b', label: 'Adverbial' },
  connector: { color: '#fb7185', label: 'Connector' },
};

const POOL: Chip[] = [
  { id: 's1', role: 'subject', text: 'Charlie' },
  { id: 's2', role: 'subject', text: 'The advertisement' },
  { id: 's3', role: 'subject', text: 'Katherina' },
  { id: 'v1', role: 'verb', text: 'reveals' },
  { id: 'v2', role: 'verb', text: 'persuades' },
  { id: 'v3', role: 'verb', text: 'refuses' },
  { id: 'o1', role: 'object', text: 'the audience' },
  { id: 'o2', role: 'object', text: 'her own voice' },
  { id: 'o3', role: 'object', text: 'a single golden ticket' },
  { id: 'a1', role: 'adverbial', text: 'with sharp wit' },
  { id: 'a2', role: 'adverbial', text: 'across every stanza' },
  { id: 'a3', role: 'adverbial', text: 'in the closing scene' },
  { id: 'c1', role: 'connector', text: ', and' },
  { id: 'c2', role: 'connector', text: '; however,' },
  { id: 'c3', role: 'connector', text: ' because' },
];

const PUNCTUATION = [',', ';', ':', '—', '.'];

function classifySentence(chips: Chip[]): { type: string; explanation: string } {
  const connectors = chips.filter((c) => c.role === 'connector').length;
  if (connectors === 0) return { type: 'Simple', explanation: 'One independent clause.' };
  const hasSemicolon = chips.some((c) => c.role === 'connector' && c.text.includes(';'));
  const hasBecause = chips.some((c) => c.role === 'connector' && c.text.includes('because'));
  if (hasBecause) return { type: 'Complex', explanation: 'Independent + dependent clause via subordinator.' };
  if (hasSemicolon) return { type: 'Compound', explanation: 'Two independents joined by a semicolon.' };
  return { type: 'Compound', explanation: 'Two independents joined by a coordinator.' };
}

export function GrammarSentenceBuilder({ lesson: _lesson }: { lesson: SubjectLesson }) {
  void _lesson;
  const [built, setBuilt] = useState<Chip[]>([]);
  const [draft, setDraft] = useState('');

  const compiled = useMemo(() => built.map((c) => c.text).join(' ').replace(/\s+([,.;:])/g, '$1'), [built]);
  const classification = useMemo(() => classifySentence(built), [built]);

  const add = (chip: Chip) => setBuilt((prev) => [...prev, chip]);
  const removeAt = (i: number) => setBuilt((prev) => prev.filter((_, idx) => idx !== i));
  const reset = () => setBuilt([]);

  const insertPunctuation = (p: string) => setDraft((prev) => prev + p);

  return (
    <div className="flex h-full min-h-[460px] flex-col rounded-lg border border-white/10 bg-gradient-to-br from-[#1a0a36] via-[#0a0f1e] to-[#050711] p-5">
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-md border border-[#c084fc]/40 bg-[#c084fc]/10 px-2 py-1 text-[10px] font-black uppercase tracking-wide text-[#c084fc]">
            <PenLine className="h-3 w-3" />
            Grammar Sentence Builder
          </div>
          <p className="mt-2 text-[10px] font-black uppercase tracking-wide text-slate-400">Construct &amp; classify</p>
          <p className="text-sm text-slate-200">Tap chips in order to build a sentence. The classifier names it for you.</p>
        </div>
        <button
          onClick={reset}
          className="inline-flex items-center gap-1 rounded-md border border-white/15 px-2 py-1 text-[10px] font-black uppercase tracking-wide text-slate-300 transition hover:border-white/40 hover:text-white"
        >
          <RotateCcw className="h-3 w-3" />
          Reset
        </button>
      </div>

      <div className="mt-3 rounded-md border border-white/10 bg-[#0a0f1e] p-3">
        <p className="mb-1 text-[10px] font-black uppercase tracking-wide text-slate-400">Your sentence</p>
        {built.length === 0 ? (
          <p className="text-sm italic text-slate-500">Tap a chip below to begin.</p>
        ) : (
          <div className="flex flex-wrap items-center gap-1.5">
            {built.map((c, i) => {
              const style = ROLE_STYLE[c.role];
              return (
                <button
                  key={`${c.id}-${i}`}
                  onClick={() => removeAt(i)}
                  className="rounded-md border px-2 py-1 text-sm font-bold transition hover:opacity-80"
                  style={{ borderColor: `${style.color}55`, background: `${style.color}1A`, color: style.color }}
                  title={`${style.label} · tap to remove`}
                >
                  {c.text}
                </button>
              );
            })}
          </div>
        )}
        {built.length > 0 && (
          <p className="mt-2 rounded-md border border-white/10 bg-white/[.03] p-2 text-sm leading-6 text-white">
            {compiled}
          </p>
        )}
        <p className="mt-2 text-[11px] font-bold text-slate-400">
          Type · <span style={{ color: '#c084fc' }}>{classification.type}</span> — {classification.explanation}
        </p>
      </div>

      <div className="mt-3 space-y-2">
        {(['subject', 'verb', 'object', 'adverbial', 'connector'] as const).map((role) => {
          const style = ROLE_STYLE[role];
          const chips = POOL.filter((c) => c.role === role);
          return (
            <div key={role}>
              <p className="mb-1 text-[10px] font-black uppercase tracking-wide" style={{ color: style.color }}>
                {style.label}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {chips.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => add(c)}
                    className="inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs font-bold transition hover:opacity-90"
                    style={{ borderColor: `${style.color}40`, background: `${style.color}10`, color: '#e2e8f0' }}
                  >
                    <Plus className="h-3 w-3" style={{ color: style.color }} />
                    {c.text}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 rounded-md border border-white/10 bg-white/[.02] p-3">
        <div className="mb-1 flex items-center justify-between">
          <p className="text-[10px] font-black uppercase tracking-wide text-slate-400">Punctuation drill</p>
          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#ffc43b]">
            <Wand2 className="h-3 w-3" />
            Tap to insert
          </span>
        </div>
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          rows={3}
          placeholder="Rewrite a sentence using semi-colons, colons or dashes..."
          className="w-full rounded-md border border-white/10 bg-[#0a0f1e] p-2 text-sm text-white placeholder:text-slate-500 focus:border-[#c084fc]/60 focus:outline-none"
        />
        <div className="mt-1.5 flex flex-wrap gap-1.5">
          {PUNCTUATION.map((p) => (
            <button
              key={p}
              onClick={() => insertPunctuation(p)}
              className="rounded-md border border-white/15 px-2 py-1 text-xs font-black text-slate-200 transition hover:border-[#ffc43b]/60 hover:text-[#ffc43b]"
            >
              {p}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
