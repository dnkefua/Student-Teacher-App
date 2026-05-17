'use client';

import React, { useState } from 'react';
import { CheckCircle2, PenLine, XCircle } from 'lucide-react';

type Mark = ';' | ':' | '—';

const marks: { mark: Mark; name: string; rule: string; example: string; tint: string }[] = [
  {
    mark: ';',
    name: 'Semicolon',
    rule: 'Joins two equally weighted, related, FULL sentences.',
    example: 'The drought was predictable; the farmers were unprepared for it.',
    tint: '#8ddfff',
  },
  {
    mark: ':',
    name: 'Colon',
    rule: 'Introduces what follows — a list or a detailed explanation of the previous idea.',
    example: 'We require three things for success: discipline, time, and commitment.',
    tint: '#ffe08a',
  },
  {
    mark: '—',
    name: 'Dash',
    rule: 'High-emphasis interruption or parenthetical thought.',
    example: 'The solution was simple — almost laughably easy — but required perfect execution.',
    tint: '#fda4af',
  },
];

const challenge: { id: string; prompt: string; answer: Mark; explain: string }[] = [
  {
    id: 'q1',
    prompt: 'We need to save money __ therefore we must cut down on spending.',
    answer: ';',
    explain: 'Two full independent clauses joined by "therefore" — a semicolon is the academic-flow choice.',
  },
  {
    id: 'q2',
    prompt: 'Our goal is clear __ sustainability for all citizens.',
    answer: ':',
    explain: 'The second part EXPLAINS the first. A colon introduces the explanation.',
  },
  {
    id: 'q3',
    prompt: 'The machine broke __ a terrifying, irreversible sound __ and stopped entirely.',
    answer: '—',
    explain: 'A high-emphasis parenthetical inside a sentence. Dashes carry the dramatic interruption.',
  },
];

export function AcademicFlowGrammarPanel() {
  const [choices, setChoices] = useState<Record<string, Mark | undefined>>({});

  return (
    <section className="rounded-lg border border-white/10 bg-[#050711] p-4 text-white">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#c084fc]">
            MYP Criterion D · Syntax & Sophistication
          </p>
          <h2 className="text-base font-black text-white">The three marks of academic flow</h2>
        </div>
        <p className="max-w-md text-[11px] font-semibold leading-5 text-slate-400">
          Carry these marks across every chapter — they earn the &quot;sophisticated control of language&quot; descriptor.
        </p>
      </div>

      <div className="mt-3 grid gap-2 md:grid-cols-3">
        {marks.map((m) => (
          <div
            key={m.mark}
            className="rounded-md border bg-white/[.03] p-3"
            style={{ borderColor: `${m.tint}55` }}
          >
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black" style={{ color: m.tint }}>{m.mark}</span>
              <span className="text-[11px] font-black uppercase tracking-wide" style={{ color: m.tint }}>{m.name}</span>
            </div>
            <p className="mt-1 text-[11px] leading-5 text-slate-300">{m.rule}</p>
            <p className="mt-2 rounded-md border border-white/10 bg-white/[.02] px-2 py-1.5 text-[11px] italic leading-5 text-slate-200">
              {m.example}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-3 rounded-md border border-white/10 bg-[#0a0f1e] p-3">
        <div className="flex items-center gap-2">
          <PenLine className="h-3.5 w-3.5 text-[#c084fc]" />
          <p className="text-[10px] font-black uppercase tracking-wide text-[#c084fc]">Choose the right mark</p>
        </div>
        <ul className="mt-3 space-y-2">
          {challenge.map((q) => {
            const chosen = choices[q.id];
            const correct = chosen === q.answer;
            const answered = chosen !== undefined;
            return (
              <li key={q.id} className="rounded-md border border-white/10 bg-white/[.02] p-2">
                <p className="text-xs leading-5 text-slate-200">{q.prompt.replace(/__/g, '___')}</p>
                <div className="mt-2 flex items-center gap-1.5">
                  {(['; ', ':', '—'] as Mark[]).map((mark) => {
                    const trimmed = mark.trim() as Mark;
                    return (
                      <button
                        key={trimmed}
                        type="button"
                        onClick={() => setChoices((prev) => ({ ...prev, [q.id]: trimmed }))}
                        className="rounded-md border px-3 py-1 text-sm font-black transition"
                        style={{
                          borderColor:
                            chosen === trimmed
                              ? correct
                                ? '#34d399'
                                : '#fb7185'
                              : 'rgba(255,255,255,.15)',
                          background:
                            chosen === trimmed
                              ? correct
                                ? 'rgba(52,211,153,.18)'
                                : 'rgba(251,113,133,.18)'
                              : 'transparent',
                          color: chosen === trimmed ? (correct ? '#34d399' : '#fb7185') : '#e2e8f0',
                        }}
                      >
                        {trimmed}
                      </button>
                    );
                  })}
                  {answered && (
                    <span
                      className="inline-flex items-center gap-1 text-[11px] font-bold"
                      style={{ color: correct ? '#34d399' : '#fb7185' }}
                    >
                      {correct ? <CheckCircle2 className="h-3.5 w-3.5" /> : <XCircle className="h-3.5 w-3.5" />}
                      {correct ? 'Correct' : `Answer · ${q.answer}`}
                    </span>
                  )}
                </div>
                {answered && (
                  <p className="mt-1 text-[11px] leading-5 text-slate-400">{q.explain}</p>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
