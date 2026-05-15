'use client';

// Live-class panel that reads the active assignment from the
// eis-demo-assignment event store and exposes the four Phase 8 actions
// (Share Lesson, Share Assignment, Open 3D Explainer, Ask AI).
//
// Uses the same cached-snapshot pattern as InteractiveLessonRenderer
// so getSnapshot returns a stable reference between renders.

import React, { useState, useSyncExternalStore } from 'react';
import {
  BookOpenCheck,
  ChevronDown,
  ChevronUp,
  Layers3,
  Loader2,
  MessageSquareShare,
  Sparkles,
  Wand2,
} from 'lucide-react';
import {
  defaultDemoAssignment,
  loadDemoAssignment,
  type DemoAssignment,
} from '@/lib/demoAssignments';
import { ExplainerByType } from './Math3DExplainers';
import { threeDLabels } from '@/lib/grade8Curriculum';

let cachedSnapshot: DemoAssignment | null = null;
function invalidate() {
  cachedSnapshot = null;
}
function subscribe(callback: () => void): () => void {
  if (typeof window === 'undefined') return () => undefined;
  const onChange = () => {
    invalidate();
    callback();
  };
  window.addEventListener('eis-demo-assignment', onChange);
  window.addEventListener('storage', onChange);
  return () => {
    window.removeEventListener('eis-demo-assignment', onChange);
    window.removeEventListener('storage', onChange);
  };
}
function getSnapshot(): DemoAssignment {
  if (cachedSnapshot === null) cachedSnapshot = loadDemoAssignment();
  return cachedSnapshot;
}
const getServerSnapshot = () => defaultDemoAssignment;

export type ActiveLessonPanelProps = {
  onShareLesson?: (assignment: DemoAssignment) => void;
  onShareAssignment?: (assignment: DemoAssignment) => void;
  onAskAi?: (assignment: DemoAssignment) => Promise<void> | void;
  /** Optional: navigate to the full Lesson Player tab. */
  onOpenLessonPlayer?: (assignment: DemoAssignment) => void;
  /** True while the AI explanation is being fetched (controlled by parent). */
  isAskingAi?: boolean;
};

export function ActiveLessonPanel({
  onShareLesson,
  onShareAssignment,
  onAskAi,
  onOpenLessonPlayer,
  isAskingAi,
}: ActiveLessonPanelProps) {
  const assignment = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [show3D, setShow3D] = useState(false);

  return (
    <section className="rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3 p-4">
        <div className="min-w-0">
          <div className="inline-flex items-center gap-2 rounded-md border border-indigo-200 bg-indigo-50 px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-indigo-700">
            <BookOpenCheck className="h-3.5 w-3.5" />
            Active lesson · live in class
          </div>
          <h3 className="mt-2 text-lg font-bold text-gray-900">{assignment.title}</h3>
          <p className="mt-0.5 text-xs font-semibold text-gray-500">{assignment.lessonTitle}</p>
          <p className="mt-2 max-w-2xl text-sm italic text-gray-600">Inquiry: {assignment.inquiryQuestion}</p>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-800">
            <span className="font-black uppercase tracking-wide text-[10px] text-gray-500">Current question · </span>
            {assignment.question}
          </p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className="rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-gray-700">
            3D · {threeDLabels[assignment.threeDType]}
          </span>
          <span className="rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-gray-700">
            Difficulty · {assignment.difficulty}
          </span>
        </div>
      </div>

      <div className="grid gap-2 border-t border-gray-100 p-3 sm:grid-cols-2 lg:grid-cols-4">
        <button
          onClick={() => onShareLesson?.(assignment)}
          disabled={!onShareLesson}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-bold text-gray-800 transition hover:border-indigo-300 hover:text-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <MessageSquareShare className="h-4 w-4" />
          Share lesson in chat
        </button>
        <button
          onClick={() => onShareAssignment?.(assignment)}
          disabled={!onShareAssignment}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-bold text-gray-800 transition hover:border-amber-400 hover:text-amber-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Sparkles className="h-4 w-4" />
          Share assignment in chat
        </button>
        <button
          onClick={() => setShow3D((v) => !v)}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-bold text-gray-800 transition hover:border-cyan-400 hover:text-cyan-700"
        >
          <Layers3 className="h-4 w-4" />
          {show3D ? 'Hide 3D explainer' : 'Open 3D explainer'}
          {show3D ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
        </button>
        <button
          onClick={() => onAskAi?.(assignment)}
          disabled={!onAskAi || Boolean(isAskingAi)}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-3 py-2 text-sm font-bold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isAskingAi ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4" />}
          {isAskingAi ? 'Asking AI…' : 'Ask AI to explain step'}
        </button>
      </div>

      {show3D ? (
        <div className="border-t border-gray-100 p-4">
          <div className="mx-auto max-w-2xl">
            <ExplainerByType type={assignment.threeDType} />
          </div>
        </div>
      ) : null}

      {onOpenLessonPlayer ? (
        <div className="border-t border-gray-100 px-4 py-2.5 text-right">
          <button
            onClick={() => onOpenLessonPlayer(assignment)}
            className="text-xs font-black uppercase tracking-wide text-indigo-600 transition hover:text-indigo-800"
          >
            Open full lesson player ↗
          </button>
        </div>
      ) : null}
    </section>
  );
}
