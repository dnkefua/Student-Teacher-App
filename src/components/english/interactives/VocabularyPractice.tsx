'use client';

import React, { useMemo, useState } from 'react';
import { Check, ChevronRight, RotateCcw, Trophy, Type } from 'lucide-react';
import type { SubjectLesson } from '@/lib/subjects/types';

type Word = { word: string; meaning: string; example: string };

const VOCAB_BY_UNIT: Record<string, Word[]> = {
  default: [
    { word: 'connotation', meaning: 'The associations a word carries beyond its dictionary meaning.', example: '"Slim" and "skinny" share a denotation but their connotation differs.' },
    { word: 'hyperbole', meaning: 'Deliberate exaggeration for effect.', example: '"I have a million things to do" is hyperbole.' },
    { word: 'juxtaposition', meaning: 'Placing two ideas side by side for contrast.', example: 'A war scene juxtaposed with a quiet family meal.' },
    { word: 'colloquialism', meaning: 'Informal language used in everyday speech.', example: '"Y\'all" is a colloquialism.' },
    { word: 'enjambment', meaning: 'A line of poetry running into the next without pause.', example: '"I hear the moon spinning the night / into a silver thread."' },
  ],
  advertising: [
    { word: 'slogan', meaning: 'A short, memorable phrase used in marketing.', example: '"Just do it." — Nike.' },
    { word: 'demographic', meaning: 'A specific group of consumers targeted by an advert.', example: 'The advert targets the 14–24 demographic.' },
    { word: 'rhetorical', meaning: 'Designed to persuade rather than to be answered.', example: 'A rhetorical question makes the reader pause.' },
    { word: 'persuasion', meaning: 'The act of influencing someone to think or act differently.', example: 'Adverts rely on persuasion, not information.' },
  ],
  poetry: [
    { word: 'simile', meaning: 'A comparison using "like" or "as".', example: '"The grass shone like a polished blade."' },
    { word: 'metaphor', meaning: 'A direct comparison that calls one thing another.', example: 'Time is a thief.' },
    { word: 'imagery', meaning: 'Sensory language that paints a mental picture.', example: '"The salt wind stung her cheek."' },
    { word: 'alliteration', meaning: 'Repeated consonant sounds at the start of words.', example: '"silvery sails sweeping the sea".' },
  ],
};

function pickPool(lesson: SubjectLesson): Word[] {
  const t = (lesson.unitTitle + ' ' + lesson.topic).toLowerCase();
  if (t.includes('poetry') || t.includes('poem')) return VOCAB_BY_UNIT.poetry;
  if (t.includes('advertis') || t.includes('media')) return VOCAB_BY_UNIT.advertising;
  return VOCAB_BY_UNIT.default;
}

export function VocabularyPractice({ lesson }: { lesson: SubjectLesson }) {
  const pool = useMemo(() => pickPool(lesson), [lesson]);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [known, setKnown] = useState<Set<number>>(new Set());

  const word = pool[index];

  const markKnown = () => {
    setKnown((prev) => new Set(prev).add(index));
    advance();
  };

  const advance = () => {
    setFlipped(false);
    setIndex((i) => (i + 1) % pool.length);
  };

  const reset = () => {
    setIndex(0);
    setFlipped(false);
    setKnown(new Set());
  };

  return (
    <div className="flex h-full min-h-[460px] flex-col rounded-lg border border-white/10 bg-gradient-to-br from-[#1a0a36] via-[#0a0f1e] to-[#050711] p-5">
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-md border border-[#c084fc]/40 bg-[#c084fc]/10 px-2 py-1 text-[10px] font-black uppercase tracking-wide text-[#c084fc]">
            <Type className="h-3 w-3" />
            Vocabulary Practice
          </div>
          <p className="mt-2 text-sm font-black text-white">Card {index + 1} of {pool.length}</p>
          <p className="text-[11px] text-slate-400">Click the card to flip. Mark words you know.</p>
        </div>
        <button
          onClick={reset}
          className="inline-flex items-center gap-1 rounded-md border border-white/15 px-2 py-1 text-[10px] font-black uppercase tracking-wide text-slate-300 transition hover:border-white/40 hover:text-white"
        >
          <RotateCcw className="h-3 w-3" />
          Reset
        </button>
      </div>

      <button
        onClick={() => setFlipped((f) => !f)}
        className="mt-4 flex flex-1 cursor-pointer flex-col items-center justify-center rounded-md border border-white/10 bg-[#0a0f1e] p-6 text-center transition hover:border-white/30"
      >
        {flipped ? (
          <>
            <p className="text-[10px] font-black uppercase tracking-wide text-[#c084fc]">Meaning</p>
            <p className="mt-2 text-base leading-7 text-white">{word.meaning}</p>
            <p className="mt-3 text-[11px] italic leading-5 text-slate-400">{word.example}</p>
          </>
        ) : (
          <>
            <p className="text-[10px] font-black uppercase tracking-wide text-slate-400">Word</p>
            <p className="mt-2 text-3xl font-black text-white">{word.word}</p>
            <p className="mt-2 text-[10px] font-bold text-slate-500">Click to flip</p>
          </>
        )}
      </button>

      <div className="mt-3 grid grid-cols-2 gap-1.5">
        <button
          onClick={markKnown}
          className="inline-flex items-center justify-center gap-1.5 rounded-md bg-emerald-500/80 px-3 py-2 text-[11px] font-black uppercase tracking-wide text-emerald-50 transition hover:bg-emerald-500"
        >
          <Check className="h-3.5 w-3.5" />
          I know it
        </button>
        <button
          onClick={advance}
          className="inline-flex items-center justify-center gap-1.5 rounded-md border border-white/15 px-3 py-2 text-[11px] font-black uppercase tracking-wide text-slate-200 transition hover:border-white/40 hover:text-white"
        >
          Skip
          <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </div>

      <p className="mt-3 inline-flex items-center justify-center gap-2 rounded-md border border-white/10 bg-white/[.02] px-3 py-1.5 text-[11px] font-bold text-slate-300">
        <Trophy className="h-3 w-3 text-[#ffc43b]" />
        {known.size} / {pool.length} known
      </p>
    </div>
  );
}
