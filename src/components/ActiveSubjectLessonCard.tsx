'use client';

// Dashboard slim card that surfaces the current cross-subject active lesson
// (driven by the `eis-active-subject-lesson` store written by English /
// Science studios). When no subject lesson is active, the card hides
// entirely — teachers still see the maths assignment card above.

import React, { useSyncExternalStore } from 'react';
import { ArrowRight, Compass, Sparkles } from 'lucide-react';
import {
  loadActiveSubjectLesson,
  subscribeActiveSubjectLesson,
} from '@/lib/activeSubjectLesson';
import { subjectRegistry } from '@/lib/subjects/subjectRegistry';
import type { SubjectLesson } from '@/lib/subjects/types';
import type { TabType } from './Sidebar';

let cached: SubjectLesson | null = null;
let initialised = false;
function getSnapshot(): SubjectLesson | null {
  if (!initialised) {
    cached = loadActiveSubjectLesson();
    initialised = true;
  }
  return cached;
}
function subscribe(callback: () => void): () => void {
  return subscribeActiveSubjectLesson(() => {
    cached = null;
    initialised = false;
    callback();
  });
}
const getServerSnapshot = () => null;

interface Props {
  setActiveTab: (tab: TabType) => void;
}

export function ActiveSubjectLessonCard({ setActiveTab }: Props) {
  const lesson = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  if (!lesson) return null;

  const reg = subjectRegistry[lesson.subject];
  const studioTab: TabType =
    lesson.subject === 'english' ? 'english-studio' : lesson.subject === 'science' ? 'science-studio' : 'eis-maths';

  return (
    <section
      className="rounded-lg border p-4 backdrop-blur"
      style={{
        borderColor: `${reg.theme.primary}55`,
        background: `linear-gradient(135deg, ${reg.theme.primary}1A, rgba(255,255,255,.02))`,
      }}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[10px] font-black uppercase tracking-wide" style={{ color: reg.theme.primary }}>
            <Sparkles className="-mt-px mr-1 inline-block h-3 w-3" />
            Active {reg.label.toLowerCase()} lesson
          </p>
          <h3 className="mt-1 truncate text-lg font-black text-white">{lesson.title}</h3>
          <p className="mt-0.5 text-xs font-bold text-slate-300">
            {lesson.unitTitle} · {lesson.topic}
          </p>
          <p className="mt-2 inline-flex items-center gap-1.5 rounded-md border px-2 py-1 text-[11px] font-bold"
             style={{ borderColor: `${reg.theme.accent}55`, color: reg.theme.accent, background: `${reg.theme.accent}14` }}
          >
            <Compass className="h-3 w-3" />
            {lesson.inquiryQuestion}
          </p>
        </div>
        <div className="flex flex-col items-stretch gap-1.5">
          <button
            onClick={() => setActiveTab(studioTab)}
            className="inline-flex items-center justify-center gap-1.5 rounded-md px-3 py-1.5 text-[11px] font-black uppercase tracking-wide transition"
            style={{ background: reg.theme.primary, color: '#061126' }}
          >
            Open lesson
            <ArrowRight className="h-3 w-3" />
          </button>
          <button
            onClick={() => setActiveTab('classroom')}
            className="inline-flex items-center justify-center gap-1.5 rounded-md border px-3 py-1.5 text-[11px] font-black uppercase tracking-wide text-slate-200 transition hover:border-white/40 hover:text-white"
            style={{ borderColor: 'rgba(255,255,255,.15)' }}
          >
            Teach live
            <ArrowRight className="h-3 w-3" />
          </button>
        </div>
      </div>
    </section>
  );
}
