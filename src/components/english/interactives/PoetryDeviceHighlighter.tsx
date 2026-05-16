'use client';

import React, { useMemo, useState } from 'react';
import { Quote, RotateCcw } from 'lucide-react';
import type { SubjectLesson } from '@/lib/subjects/types';

type Device = { id: string; label: string; color: string; hint: string };

const DEVICES: Device[] = [
  { id: 'simile', label: 'Simile', color: '#49c8ff', hint: 'Compares using "like" or "as".' },
  { id: 'metaphor', label: 'Metaphor', color: '#c084fc', hint: 'Direct comparison without "like"/"as".' },
  { id: 'imagery', label: 'Imagery', color: '#34d399', hint: 'Sensory description that creates a picture.' },
  { id: 'allit', label: 'Alliteration', color: '#ffc43b', hint: 'Repeated initial consonant sounds.' },
  { id: 'enjamb', label: 'Enjambment', color: '#fb7185', hint: 'A line runs into the next without pause.' },
  { id: 'repetition', label: 'Repetition', color: '#fdba74', hint: 'Repeated word/phrase for emphasis.' },
  { id: 'allusion', label: 'Allusion', color: '#22d3ee', hint: 'Reference to another text, idea, or place.' },
];

const POEMS: Record<string, { title: string; author: string; lines: string[] }> = {
  default: {
    title: 'Search For My Tongue',
    author: 'Sujata Bhatt',
    lines: [
      'You ask me what I mean',
      'by saying I have lost my tongue.',
      'I ask you, what would you do',
      'if you had two tongues in your mouth,',
      'and lost the first one, the mother tongue,',
      'and could not really know the other,',
      'the foreign tongue.',
      'You could not use them both together',
      'even if you thought that way.',
    ],
  },
  'eng-y8-u3-w1-elements-of-poetry': {
    title: 'The Last Poem (excerpt)',
    author: 'Abu Nawas',
    lines: [
      'Pour me the wine that pleases me,',
      'And say it freely: this is wine.',
      'Why drink in secret when',
      'The world drinks openly?',
      'The night is short. The morning long.',
      'Let me be lost in song.',
    ],
  },
  'eng-y8-u3-w2-identity-poetry': {
    title: 'Untitled (excerpt)',
    author: 'Adam Mohammed',
    lines: [
      'I carry two homes in one chest,',
      'one whispers in Arabic, one shouts in English,',
      'and neither will quiet down for the other.',
      'I am the bridge that aches in the middle.',
    ],
  },
  'eng-y8-u3-w3-social-justice': {
    title: 'Half-Caste (excerpt)',
    author: 'John Agard',
    lines: [
      'Excuse me',
      'standing on one leg',
      'I’m half-caste',
      'Explain yuself',
      'wha yu mean',
      'when yu say half-caste',
    ],
  },
  'eng-y8-u3-w4-displacement': {
    title: 'Island Man (excerpt)',
    author: 'Grace Nichols',
    lines: [
      'Morning',
      'and island man wakes up',
      'to the sound of blue surf',
      'in his head',
      'the steady breaking and wombing',
    ],
  },
  'eng-y8-u3-w5-presents-from-pakistan': {
    title: 'Presents from My Aunts in Pakistan (excerpt)',
    author: 'Moniza Alvi',
    lines: [
      'They sent me a salwar kameez',
      'peacock-blue,',
      'and another',
      'glistening like an orange split open,',
      'embossed slippers, gold and black',
      'points curling.',
    ],
  },
};

export function PoetryDeviceHighlighter({ lesson }: { lesson: SubjectLesson }) {
  const poem = useMemo(() => POEMS[lesson.id] ?? POEMS.default, [lesson.id]);

  const [active, setActive] = useState<Device>(DEVICES[0]);
  const [tags, setTags] = useState<Record<number, Device>>({});

  const toggle = (i: number) => {
    setTags((prev) => {
      const next = { ...prev };
      if (next[i]?.id === active.id) delete next[i];
      else next[i] = active;
      return next;
    });
  };

  return (
    <div className="flex h-full min-h-[460px] flex-col rounded-lg border border-white/10 bg-gradient-to-br from-[#1a0a36] via-[#0a0f1e] to-[#050711] p-5">
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-md border border-[#c084fc]/40 bg-[#c084fc]/10 px-2 py-1 text-[10px] font-black uppercase tracking-wide text-[#c084fc]">
            <Quote className="h-3 w-3" />
            Poetry Device Highlighter
          </div>
          <p className="mt-2 text-sm font-black text-white">{poem.title}</p>
          <p className="text-[11px] font-bold text-slate-400">{poem.author}</p>
        </div>
        <button
          onClick={() => setTags({})}
          className="inline-flex items-center gap-1 rounded-md border border-white/15 px-2 py-1 text-[10px] font-black uppercase tracking-wide text-slate-300 transition hover:border-white/40 hover:text-white"
        >
          <RotateCcw className="h-3 w-3" />
          Reset
        </button>
      </div>

      <div className="mt-3">
        <p className="mb-1 text-[10px] font-black uppercase tracking-wide text-slate-400">Choose a device, then tap a line</p>
        <div className="flex flex-wrap gap-1.5">
          {DEVICES.map((d) => (
            <button
              key={d.id}
              onClick={() => setActive(d)}
              className="rounded-md border px-2 py-1 text-[11px] font-black uppercase tracking-wide transition"
              style={{
                borderColor: active.id === d.id ? d.color : 'rgba(255,255,255,.15)',
                background: active.id === d.id ? `${d.color}22` : 'transparent',
                color: active.id === d.id ? d.color : '#cbd5e1',
              }}
            >
              <span className="mr-1 inline-block h-2 w-2 rounded-full" style={{ background: d.color }} />
              {d.label}
            </button>
          ))}
        </div>
        <p className="mt-1 text-[11px] italic text-slate-400">{active.hint}</p>
      </div>

      <div className="mt-3 flex-1 space-y-1 rounded-md border border-white/10 bg-[#0a0f1e] p-3">
        {poem.lines.map((line, i) => {
          const tag = tags[i];
          return (
            <button
              key={i}
              onClick={() => toggle(i)}
              className="block w-full rounded-md p-1.5 text-left text-sm leading-6 transition"
              style={{
                background: tag ? `${tag.color}22` : 'transparent',
                borderLeft: tag ? `3px solid ${tag.color}` : '3px solid transparent',
                color: '#e2e8f0',
              }}
            >
              {tag && (
                <span
                  className="mr-2 rounded-full px-2 py-0.5 text-[10px] font-black uppercase tracking-wide"
                  style={{ background: `${tag.color}33`, color: tag.color }}
                >
                  {tag.label}
                </span>
              )}
              {line}
            </button>
          );
        })}
      </div>

      <p className="mt-3 text-[11px] text-slate-400">
        {Object.keys(tags).length} line{Object.keys(tags).length === 1 ? '' : 's'} annotated · use these in your PETAL analysis.
      </p>
    </div>
  );
}
