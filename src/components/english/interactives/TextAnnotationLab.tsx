'use client';

import React, { useMemo, useState } from 'react';
import { Highlighter, RotateCcw, Sparkles } from 'lucide-react';
import type { SubjectLesson } from '@/lib/subjects/types';

type Device = {
  id: string;
  label: string;
  color: string;
  description: string;
};

const DEVICES: Device[] = [
  { id: 'rhetorical', label: 'Rhetorical question', color: '#c084fc', description: 'Question used to provoke thought.' },
  { id: 'direct', label: 'Direct address', color: '#49c8ff', description: 'Speaks straight to "you".' },
  { id: 'fact', label: 'Fact / statistic', color: '#ffc43b', description: 'Hard data to build trust.' },
  { id: 'emotive', label: 'Emotive language', color: '#fb7185', description: 'Words chosen to provoke feeling.' },
  { id: 'repetition', label: 'Repetition / triple', color: '#34d399', description: 'Repeated words for memorability.' },
  { id: 'imperative', label: 'Imperative / call to action', color: '#fdba74', description: 'Tells the reader to act.' },
];

const SAMPLE_BY_LESSON: Record<string, { source: string; sentences: string[] }> = {
  default: {
    source: 'Sample print advertisement',
    sentences: [
      'Are you still settling for ordinary tea?',
      'Made with 100% pure Ceylon leaves — and 0% compromise.',
      '9 out of 10 chefs recommend it for breakfast service.',
      'Wake up. Pour yourself a cup. Taste the morning differently.',
      'Switch to Royal Leaf today — your mornings will thank you.',
    ],
  },
  'eng-y8-u1-w1-persuasive-techniques': {
    source: 'Royal Leaf morning tea advert',
    sentences: [
      'Are you still settling for ordinary tea?',
      'Made with 100% pure Ceylon leaves — and 0% compromise.',
      '9 out of 10 chefs recommend it for breakfast service.',
      'Wake up. Pour yourself a cup. Taste the morning differently.',
      'Switch to Royal Leaf today — your mornings will thank you.',
    ],
  },
  'eng-y8-u1-w2-print-vs-visual': {
    source: 'RTA Dubai road-safety billboard',
    sentences: [
      'One look down. One life lost.',
      'In 2023, 41% of fatal crashes in the UAE involved a distracted driver.',
      'Your phone can wait. The road cannot.',
      'Eyes up, hands ready, family home tonight.',
    ],
  },
};

export function TextAnnotationLab({ lesson }: { lesson: SubjectLesson }) {
  const sample = useMemo(
    () => SAMPLE_BY_LESSON[lesson.id] ?? SAMPLE_BY_LESSON.default,
    [lesson.id]
  );

  const [activeDevice, setActiveDevice] = useState<Device>(DEVICES[0]);
  const [tags, setTags] = useState<Record<number, Device>>({});

  const tagSentence = (i: number) => {
    setTags((prev) => {
      const next = { ...prev };
      if (next[i]?.id === activeDevice.id) delete next[i];
      else next[i] = activeDevice;
      return next;
    });
  };

  const matched = Object.keys(tags).length;
  const total = sample.sentences.length;

  return (
    <div className="flex h-full min-h-[420px] flex-col rounded-lg border border-white/10 bg-gradient-to-br from-[#1a0a36] via-[#0a0f1e] to-[#050711] p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-md border border-[#c084fc]/40 bg-[#c084fc]/10 px-2 py-1 text-[10px] font-black uppercase tracking-wide text-[#c084fc]">
            <Highlighter className="h-3 w-3" />
            Text Annotation Lab
          </div>
          <p className="mt-2 text-[10px] font-black uppercase tracking-wide text-slate-400">Source</p>
          <p className="text-sm font-black text-white">{sample.source}</p>
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
        <p className="mb-1.5 text-[10px] font-black uppercase tracking-wide text-slate-400">Highlight with</p>
        <div className="flex flex-wrap gap-1.5">
          {DEVICES.map((d) => (
            <button
              key={d.id}
              onClick={() => setActiveDevice(d)}
              className="rounded-md border px-2 py-1 text-[11px] font-black uppercase tracking-wide transition"
              style={{
                borderColor: activeDevice.id === d.id ? d.color : 'rgba(255,255,255,.15)',
                background: activeDevice.id === d.id ? `${d.color}26` : 'transparent',
                color: activeDevice.id === d.id ? d.color : '#cbd5e1',
              }}
            >
              <span className="mr-1 inline-block h-2 w-2 rounded-full" style={{ background: d.color }} />
              {d.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-3 flex-1 space-y-1.5 rounded-md border border-white/10 bg-[#0a0f1e] p-3">
        {sample.sentences.map((s, i) => {
          const tag = tags[i];
          return (
            <button
              key={i}
              onClick={() => tagSentence(i)}
              className="block w-full rounded-md p-2 text-left text-sm leading-6 transition"
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
              {s}
            </button>
          );
        })}
      </div>

      <div className="mt-3 flex items-center justify-between rounded-md border border-white/10 bg-white/[.02] px-3 py-2">
        <span className="text-[11px] font-bold text-slate-300">
          {matched}/{total} lines annotated · device · <span style={{ color: activeDevice.color }}>{activeDevice.label}</span>
        </span>
        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#c084fc]">
          <Sparkles className="h-3 w-3" />
          Tap a line to tag it
        </span>
      </div>
    </div>
  );
}
