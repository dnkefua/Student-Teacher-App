'use client';

import React, { useState } from 'react';
import { Plus, RotateCcw, Users } from 'lucide-react';
import type { SubjectLesson } from '@/lib/subjects/types';

type Card = {
  id: string;
  quote: string;
  trait: string;
  evidence: string;
};

const TRAITS = ['Resilient', 'Compassionate', 'Cunning', 'Loyal', 'Proud', 'Curious', 'Fearful', 'Ambitious'];

export function CharacterAnalysisBoard({ lesson }: { lesson: SubjectLesson }) {
  const [character, setCharacter] = useState('Charlie Bucket');
  const [cards, setCards] = useState<Card[]>([
    { id: '1', quote: '', trait: TRAITS[0], evidence: '' },
  ]);

  const addCard = () =>
    setCards((prev) => [...prev, { id: String(Date.now()), quote: '', trait: TRAITS[0], evidence: '' }]);

  const updateCard = (id: string, patch: Partial<Card>) =>
    setCards((prev) => prev.map((c) => (c.id === id ? { ...c, ...patch } : c)));

  const removeCard = (id: string) => setCards((prev) => prev.filter((c) => c.id !== id));

  const reset = () => {
    setCharacter('Charlie Bucket');
    setCards([{ id: '1', quote: '', trait: TRAITS[0], evidence: '' }]);
  };

  const usedTraits = Array.from(new Set(cards.map((c) => c.trait).filter(Boolean)));

  return (
    <div className="flex h-full min-h-[460px] flex-col rounded-lg border border-white/10 bg-gradient-to-br from-[#1a0a36] via-[#0a0f1e] to-[#050711] p-5">
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-md border border-[#c084fc]/40 bg-[#c084fc]/10 px-2 py-1 text-[10px] font-black uppercase tracking-wide text-[#c084fc]">
            <Users className="h-3 w-3" />
            Character Analysis Board
          </div>
          <p className="mt-2 text-[10px] font-black uppercase tracking-wide text-slate-400">Character ({lesson.unitTitle})</p>
          <input
            value={character}
            onChange={(e) => setCharacter(e.target.value)}
            className="mt-1 w-full max-w-xs rounded-md border border-white/10 bg-[#0a0f1e] px-2 py-1 text-sm font-black text-white focus:border-white/30 focus:outline-none"
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

      <div className="mt-3 flex-1 space-y-2 overflow-auto">
        {cards.map((card, i) => (
          <div key={card.id} className="rounded-md border border-white/10 bg-white/[.02] p-3">
            <div className="flex items-center justify-between gap-2">
              <p className="text-[11px] font-black uppercase tracking-wide text-[#c084fc]">Evidence {i + 1}</p>
              {cards.length > 1 && (
                <button
                  onClick={() => removeCard(card.id)}
                  className="text-[11px] font-bold text-slate-400 hover:text-white"
                >
                  Remove
                </button>
              )}
            </div>
            <div className="mt-1.5 grid gap-2 sm:grid-cols-[1fr_auto]">
              <textarea
                value={card.quote}
                onChange={(e) => updateCard(card.id, { quote: e.target.value })}
                rows={2}
                placeholder={`"Quote that reveals ${character}'s nature..."`}
                className="rounded-md border border-white/10 bg-[#0a0f1e] p-2 text-sm text-white placeholder:text-slate-500 focus:border-white/30 focus:outline-none"
              />
              <select
                value={card.trait}
                onChange={(e) => updateCard(card.id, { trait: e.target.value })}
                className="rounded-md border border-white/10 bg-[#0a0f1e] px-2 py-2 text-sm text-white focus:border-white/30 focus:outline-none"
              >
                {TRAITS.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
            <textarea
              value={card.evidence}
              onChange={(e) => updateCard(card.id, { evidence: e.target.value })}
              rows={2}
              placeholder="Brief analysis — what this quote shows and how the writer crafts it..."
              className="mt-2 w-full rounded-md border border-white/10 bg-[#0a0f1e] p-2 text-sm text-white placeholder:text-slate-500 focus:border-white/30 focus:outline-none"
            />
          </div>
        ))}
        <button
          onClick={addCard}
          className="inline-flex items-center gap-1 rounded-md border border-dashed border-white/20 px-2.5 py-1.5 text-[11px] font-black uppercase tracking-wide text-slate-300 transition hover:border-white/50 hover:text-white"
        >
          <Plus className="h-3 w-3" />
          Add quote
        </button>
      </div>

      {usedTraits.length > 0 && (
        <p className="mt-3 rounded-md border border-white/10 bg-white/[.02] px-3 py-2 text-[11px] text-slate-300">
          <span className="font-black text-white">{character}</span> · traits in evidence ·{' '}
          {usedTraits.map((t, i) => (
            <span key={t} className="text-[#c084fc]">
              {t}
              {i < usedTraits.length - 1 ? ', ' : ''}
            </span>
          ))}
        </p>
      )}
    </div>
  );
}
