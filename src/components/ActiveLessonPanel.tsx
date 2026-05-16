'use client';

// Live-class panel — surfaces whatever the teacher is currently teaching.
// Two stores can drive this:
//   1. the maths-only `eis-demo-assignment` event store (legacy, still wired
//      to the dashboard maths card),
//   2. the cross-subject `eis-active-subject-lesson` store (English /
//      Science / future subjects).
// We prefer the subject lesson if it exists, otherwise fall back to the
// maths assignment so existing flows keep working.

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
import {
  loadActiveSubjectLesson,
  subscribeActiveSubjectLesson,
} from '@/lib/activeSubjectLesson';
import { ExplainerByType } from './Math3DExplainers';
import { EnglishInteractiveRenderer } from './english/EnglishInteractiveRenderer';
import { ScienceInteractiveRenderer } from './science/ScienceInteractiveRenderer';
import { threeDLabels } from '@/lib/grade8Curriculum';
import type { SubjectLesson } from '@/lib/subjects/types';
import { subjectRegistry } from '@/lib/subjects/subjectRegistry';

/* ─── maths assignment store (legacy) ─────────────────────────────── */

let cachedAssignment: DemoAssignment | null = null;
function invalidateAssignment() { cachedAssignment = null; }
function subscribeAssignment(callback: () => void): () => void {
  if (typeof window === 'undefined') return () => undefined;
  const onChange = () => { invalidateAssignment(); callback(); };
  window.addEventListener('eis-demo-assignment', onChange);
  window.addEventListener('storage', onChange);
  return () => {
    window.removeEventListener('eis-demo-assignment', onChange);
    window.removeEventListener('storage', onChange);
  };
}
function getAssignmentSnapshot(): DemoAssignment {
  if (cachedAssignment === null) cachedAssignment = loadDemoAssignment();
  return cachedAssignment;
}
const getServerAssignmentSnapshot = () => defaultDemoAssignment;

/* ─── cross-subject lesson store ──────────────────────────────────── */

let cachedSubjectLesson: SubjectLesson | null = null;
let subjectLessonInitialised = false;
function invalidateSubjectLesson() { cachedSubjectLesson = null; subjectLessonInitialised = false; }
function subscribeSubjectLesson(callback: () => void): () => void {
  return subscribeActiveSubjectLesson(() => {
    invalidateSubjectLesson();
    callback();
  });
}
function getSubjectLessonSnapshot(): SubjectLesson | null {
  if (!subjectLessonInitialised) {
    cachedSubjectLesson = loadActiveSubjectLesson();
    subjectLessonInitialised = true;
  }
  return cachedSubjectLesson;
}
const getServerSubjectLessonSnapshot = () => null;

/* ─── component ───────────────────────────────────────────────────── */

export type ActiveLessonPanelProps = {
  onShareLesson?: (lesson: ShareableLesson) => void;
  onShareAssignment?: (lesson: ShareableLesson) => void;
  onAskAi?: (lesson: ShareableLesson) => Promise<void> | void;
  onOpenLessonPlayer?: (lesson: ShareableLesson) => void;
  isAskingAi?: boolean;
};

export type ShareableLesson = {
  subject: 'mathematics' | 'english' | 'science';
  title: string;
  lessonTitle: string;
  inquiryQuestion: string;
  question: string;
  /** Maths-only: the 3D scene id. */
  threeDType?: DemoAssignment['threeDType'];
  /** Non-maths: the subject interactive id. */
  subjectInteractiveType?: string;
  /** When present, the full SubjectLesson for non-maths panels. */
  subjectLesson?: SubjectLesson;
  /** When present, the maths DemoAssignment for the legacy maths panel. */
  demoAssignment?: DemoAssignment;
};

export function ActiveLessonPanel({
  onShareLesson,
  onShareAssignment,
  onAskAi,
  onOpenLessonPlayer,
  isAskingAi,
}: ActiveLessonPanelProps) {
  const assignment = useSyncExternalStore(subscribeAssignment, getAssignmentSnapshot, getServerAssignmentSnapshot);
  const subjectLesson = useSyncExternalStore(subscribeSubjectLesson, getSubjectLessonSnapshot, getServerSubjectLessonSnapshot);
  const [showInteractive, setShowInteractive] = useState(false);

  const shareable: ShareableLesson = subjectLesson
    ? {
        subject: subjectLesson.subject,
        title: subjectLesson.title,
        lessonTitle: `${subjectLesson.unitTitle} · ${subjectLesson.topic}`,
        inquiryQuestion: subjectLesson.inquiryQuestion,
        question: subjectLesson.assignmentQuestions[0]?.question ?? subjectLesson.studentExplanation,
        subjectInteractiveType: subjectLesson.interactiveType,
        subjectLesson,
      }
    : {
        subject: 'mathematics',
        title: assignment.title,
        lessonTitle: assignment.lessonTitle,
        inquiryQuestion: assignment.inquiryQuestion,
        question: assignment.question,
        threeDType: assignment.threeDType,
        demoAssignment: assignment,
      };

  const subjectMeta = subjectRegistry[shareable.subject];

  const interactiveBadge =
    shareable.subject === 'mathematics' && shareable.threeDType
      ? threeDLabels[shareable.threeDType]
      : (shareable.subjectInteractiveType ?? 'workshop').replace(/_/g, ' ');

  return (
    <section className="rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3 p-4">
        <div className="min-w-0">
          <div className="inline-flex items-center gap-2 rounded-md border border-indigo-200 bg-indigo-50 px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-indigo-700">
            <BookOpenCheck className="h-3.5 w-3.5" />
            Active lesson · live in class
          </div>
          <h3 className="mt-2 text-lg font-bold text-gray-900">{shareable.title}</h3>
          <p className="mt-0.5 text-xs font-semibold text-gray-500">{shareable.lessonTitle}</p>
          <p className="mt-2 max-w-2xl text-sm italic text-gray-600">Inquiry: {shareable.inquiryQuestion}</p>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-800">
            <span className="font-black uppercase tracking-wide text-[10px] text-gray-500">Current question · </span>
            {shareable.question}
          </p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span
            className="rounded-full border px-2.5 py-1 text-[10px] font-black uppercase tracking-wide"
            style={{
              borderColor: `${subjectMeta.theme.primary}55`,
              background: `${subjectMeta.theme.primary}15`,
              color: subjectMeta.theme.primary,
            }}
          >
            {subjectMeta.label}
          </span>
          <span className="rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-gray-700">
            {shareable.subject === 'mathematics' ? '3D · ' : 'Workshop · '}
            {interactiveBadge}
          </span>
          {shareable.demoAssignment ? (
            <span className="rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-gray-700">
              Difficulty · {shareable.demoAssignment.difficulty}
            </span>
          ) : null}
        </div>
      </div>

      <div className="grid gap-2 border-t border-gray-100 p-3 sm:grid-cols-2 lg:grid-cols-4">
        <button
          onClick={() => onShareLesson?.(shareable)}
          disabled={!onShareLesson}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-bold text-gray-800 transition hover:border-indigo-300 hover:text-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <MessageSquareShare className="h-4 w-4" />
          Share lesson in chat
        </button>
        <button
          onClick={() => onShareAssignment?.(shareable)}
          disabled={!onShareAssignment}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-bold text-gray-800 transition hover:border-amber-400 hover:text-amber-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Sparkles className="h-4 w-4" />
          Share assignment in chat
        </button>
        <button
          onClick={() => setShowInteractive((v) => !v)}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-bold text-gray-800 transition hover:border-cyan-400 hover:text-cyan-700"
        >
          <Layers3 className="h-4 w-4" />
          {showInteractive
            ? shareable.subject === 'mathematics' ? 'Hide 3D explainer' : 'Hide interactive'
            : shareable.subject === 'mathematics' ? 'Open 3D explainer' : 'Open interactive'}
          {showInteractive ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
        </button>
        <button
          onClick={() => onAskAi?.(shareable)}
          disabled={!onAskAi || Boolean(isAskingAi)}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-3 py-2 text-sm font-bold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isAskingAi ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4" />}
          {isAskingAi ? 'Asking AI…' : 'Ask AI to explain step'}
        </button>
      </div>

      {showInteractive ? (
        <div className="border-t border-gray-100 p-4">
          <div className="mx-auto max-w-2xl">
            {shareable.subject === 'mathematics' && shareable.threeDType ? (
              <ExplainerByType type={shareable.threeDType} />
            ) : shareable.subjectLesson?.subject === 'english' ? (
              <EnglishInteractiveRenderer lesson={shareable.subjectLesson} />
            ) : shareable.subjectLesson?.subject === 'science' ? (
              <ScienceInteractiveRenderer lesson={shareable.subjectLesson} />
            ) : null}
          </div>
        </div>
      ) : null}

      {onOpenLessonPlayer ? (
        <div className="border-t border-gray-100 px-4 py-2.5 text-right">
          <button
            onClick={() => onOpenLessonPlayer(shareable)}
            className="text-xs font-black uppercase tracking-wide text-indigo-600 transition hover:text-indigo-800"
          >
            Open full lesson player ↗
          </button>
        </div>
      ) : null}
    </section>
  );
}
