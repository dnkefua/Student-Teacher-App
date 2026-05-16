'use client';

import React, { useState } from 'react';
import { BookOpen, RotateCcw } from 'lucide-react';
import type { SubjectLesson } from '@/lib/subjects/types';

type Beat = { id: string; label: string; description: string; color: string };

const BEATS: Beat[] = [
  { id: 'exposition', label: 'Exposition', description: 'Setting, main characters, status quo.', color: '#49c8ff' },
  { id: 'inciting', label: 'Inciting incident', description: 'The event that tips the story into motion.', color: '#c084fc' },
  { id: 'rising', label: 'Rising action', description: 'Complications, stakes, choices.', color: '#34d399' },
  { id: 'climax', label: 'Climax', description: 'Highest tension. The point of no return.', color: '#ffc43b' },
  { id: 'falling', label: 'Falling action', description: 'Consequences ripple outward.', color: '#fdba74' },
  { id: 'resolution', label: 'Resolution', description: 'New status quo — what changed?', color: '#fb7185' },
];

export function StoryStructureMap({ lesson: _lesson }: { lesson: SubjectLesson }) {
  void _lesson;
  const [notes, setNotes] = useState<Record<string, string>>({});

  const filled = BEATS.filter((b) => (notes[b.id] ?? '').trim().length > 0).length;

  const reset = () => setNotes({});

  return (
    <div className="flex h-full min-h-[460px] flex-col rounded-lg border border-white/10 bg-gradient-to-br from-[#1a0a36] via-[#0a0f1e] to-[#050711] p-5">
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-md border border-[#c084fc]/40 bg-[#c084fc]/10 px-2 py-1 text-[10px] font-black uppercase tracking-wide text-[#c084fc]">
            <BookOpen className="h-3 w-3" />
            Story Structure Map
          </div>
          <p className="mt-2 text-sm font-black text-white">Plot a six-beat narrative arc</p>
          <p className="text-[11px] text-slate-400">Capture one detail for each beat. The arrow above tracks completion.</p>
        </div>
        <button
          onClick={reset}
          className="inline-flex items-center gap-1 rounded-md border border-white/15 px-2 py-1 text-[10px] font-black uppercase tracking-wide text-slate-300 transition hover:border-white/40 hover:text-white"
        >
          <RotateCcw className="h-3 w-3" />
          Reset
        </button>
      </div>

      <div className="mt-3 flex items-center gap-1.5">
        {BEATS.map((b) => {
          const ok = (notes[b.id] ?? '').trim().length > 0;
          return (
            <div
              key={b.id}
              className="h-1.5 flex-1 rounded-full transition-all"
              style={{ background: ok ? b.color : 'rgba(255,255,255,.08)' }}
            />
          );
        })}
      </div>

      <div className="mt-3 grid flex-1 gap-2 overflow-auto md:grid-cols-2">
        {BEATS.map((b, i) => (
          <div key={b.id} className="rounded-md border border-white/10 bg-white/[.02] p-3">
            <div className="flex items-center gap-1.5">
              <span
                className="grid h-5 w-5 place-items-center rounded-full text-[10px] font-black"
                style={{ background: `${b.color}22`, color: b.color }}
              >
                {i + 1}
              </span>
              <span className="text-[11px] font-black uppercase tracking-wide" style={{ color: b.color }}>
                {b.label}
              </span>
            </div>
            <p className="mt-1 text-[11px] italic text-slate-400">{b.description}</p>
            <textarea
              value={notes[b.id] ?? ''}
              onChange={(e) => setNotes((prev) => ({ ...prev, [b.id]: e.target.value }))}
              rows={2}
              placeholder={`One sentence for the ${b.label.toLowerCase()}...`}
              className="mt-2 w-full rounded-md border border-white/10 bg-[#0a0f1e] p-2 text-sm text-white placeholder:text-slate-500 focus:border-white/30 focus:outline-none"
            />
          </div>
        ))}
      </div>

      <p className="mt-3 rounded-md border border-white/10 bg-white/[.02] px-3 py-2 text-[11px] font-bold text-slate-300">
        {filled}/{BEATS.length} beats mapped — when all six are filled, your plan can carry an analytical paragraph.
      </p>
    </div>
  );
}
