'use client';

import React, { useState } from 'react';
import { MessageSquareReply, MessageSquareWarning, Mic, RotateCcw } from 'lucide-react';
import type { SubjectLesson } from '@/lib/subjects/types';

type Argument = {
  id: string;
  claim: string;
  reason: string;
  evidence: string;
  counter: string;
};

export function DebateSimulator({ lesson }: { lesson: SubjectLesson }) {
  const [motion, setMotion] = useState(`This house believes ${lesson.topic.toLowerCase()} matters.`);
  const [side, setSide] = useState<'for' | 'against'>('for');
  const [args, setArgs] = useState<Argument[]>([
    { id: '1', claim: '', reason: '', evidence: '', counter: '' },
  ]);

  const updateArg = (id: string, patch: Partial<Argument>) =>
    setArgs((prev) => prev.map((a) => (a.id === id ? { ...a, ...patch } : a)));

  const addArg = () =>
    setArgs((prev) => [...prev, { id: String(Date.now()), claim: '', reason: '', evidence: '', counter: '' }]);

  const reset = () => {
    setMotion(`This house believes ${lesson.topic.toLowerCase()} matters.`);
    setSide('for');
    setArgs([{ id: '1', claim: '', reason: '', evidence: '', counter: '' }]);
  };

  const strength = args.reduce((s, a) => {
    const filled = [a.claim, a.reason, a.evidence, a.counter].filter((v) => v.trim().length > 0).length;
    return s + filled / 4;
  }, 0);
  const strengthPct = Math.round((strength / args.length) * 100);

  return (
    <div className="flex h-full min-h-[460px] flex-col rounded-lg border border-white/10 bg-gradient-to-br from-[#1a0a36] via-[#0a0f1e] to-[#050711] p-5">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <div className="inline-flex items-center gap-1.5 rounded-md border border-[#c084fc]/40 bg-[#c084fc]/10 px-2 py-1 text-[10px] font-black uppercase tracking-wide text-[#c084fc]">
            <Mic className="h-3 w-3" />
            Debate Simulator
          </div>
          <p className="mt-2 text-[10px] font-black uppercase tracking-wide text-slate-400">Motion</p>
          <input
            value={motion}
            onChange={(e) => setMotion(e.target.value)}
            className="mt-1 w-full rounded-md border border-white/10 bg-[#0a0f1e] px-2 py-1.5 text-sm font-black text-white focus:border-white/30 focus:outline-none"
          />
        </div>
        <button
          onClick={reset}
          className="inline-flex items-center gap-1 rounded-md border border-white/15 px-2 py-1 text-[10px] font-black uppercase tracking-wide text-slate-300 transition hover:border-white/40 hover:text-white"
        >
          <RotateCcw className="h-3 w-3" />
          Reset
        </button>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-1.5">
        {(['for', 'against'] as const).map((s) => (
          <button
            key={s}
            onClick={() => setSide(s)}
            className="rounded-md border px-2 py-1.5 text-xs font-black uppercase tracking-wide transition"
            style={{
              borderColor: side === s ? (s === 'for' ? '#34d399' : '#fb7185') : 'rgba(255,255,255,.15)',
              background: side === s ? (s === 'for' ? '#34d39922' : '#fb718522') : 'transparent',
              color: side === s ? (s === 'for' ? '#34d399' : '#fb7185') : '#cbd5e1',
            }}
          >
            Speaking {s.toUpperCase()}
          </button>
        ))}
      </div>

      <div className="mt-3 flex-1 space-y-2 overflow-auto">
        {args.map((a, i) => (
          <div key={a.id} className="rounded-md border border-white/10 bg-white/[.02] p-3">
            <p className="mb-1.5 text-[11px] font-black uppercase tracking-wide text-[#c084fc]">
              Argument {i + 1}
            </p>
            <input
              value={a.claim}
              onChange={(e) => updateArg(a.id, { claim: e.target.value })}
              placeholder="Claim · one sentence"
              className="mb-1.5 w-full rounded-md border border-white/10 bg-[#0a0f1e] px-2 py-1.5 text-sm text-white placeholder:text-slate-500 focus:border-white/30 focus:outline-none"
            />
            <input
              value={a.reason}
              onChange={(e) => updateArg(a.id, { reason: e.target.value })}
              placeholder="Reason · because..."
              className="mb-1.5 w-full rounded-md border border-white/10 bg-[#0a0f1e] px-2 py-1.5 text-sm text-white placeholder:text-slate-500 focus:border-white/30 focus:outline-none"
            />
            <input
              value={a.evidence}
              onChange={(e) => updateArg(a.id, { evidence: e.target.value })}
              placeholder="Evidence · stat, quote, example"
              className="mb-1.5 w-full rounded-md border border-white/10 bg-[#0a0f1e] px-2 py-1.5 text-sm text-white placeholder:text-slate-500 focus:border-white/30 focus:outline-none"
            />
            <div className="mt-1 flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wide text-[#fb7185]">
              <MessageSquareWarning className="h-3 w-3" />
              Counterargument you must answer
            </div>
            <input
              value={a.counter}
              onChange={(e) => updateArg(a.id, { counter: e.target.value })}
              placeholder="The opposing side will say..."
              className="mt-1 w-full rounded-md border border-[#fb7185]/30 bg-[#0a0f1e] px-2 py-1.5 text-sm text-white placeholder:text-slate-500 focus:border-[#fb7185]/60 focus:outline-none"
            />
          </div>
        ))}
        <button
          onClick={addArg}
          className="inline-flex items-center gap-1 rounded-md border border-dashed border-white/20 px-2.5 py-1.5 text-[11px] font-black uppercase tracking-wide text-slate-300 transition hover:border-white/50 hover:text-white"
        >
          <MessageSquareReply className="h-3 w-3" />
          Add argument
        </button>
      </div>

      <p className="mt-3 rounded-md border border-white/10 bg-white/[.02] px-3 py-2 text-[11px] font-bold text-slate-300">
        Argument strength · {strengthPct}% (claim · reason · evidence · counter all filled = strong).
      </p>
    </div>
  );
}
