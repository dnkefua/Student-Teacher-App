'use client';

// Browse the teacher's saved generated lessons. Reads from Firestore
// (getGeneratedLessons) — shows a demo-mode badge when Firebase is not
// configured. Supports subject filter + an "Assign as active lesson"
// shortcut that publishes the lesson back into the cross-subject store.

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  BookOpen,
  Library,
  Loader2,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import { getGeneratedLessons } from '@/lib/firebase/firestore';
import { isFirebaseConfigured } from '@/lib/firebase/client';
import { getDemoUserId } from '@/lib/firebase/demoUser';
import { setActiveSubjectLesson } from '@/lib/activeSubjectLesson';
import type { TabType } from '@/components/Sidebar';
import type { SubjectLesson } from '@/lib/subjects/types';
import { subjectRegistry } from '@/lib/subjects/subjectRegistry';
import type { GeneratedLesson } from '@/lib/firebase/types';

interface Props {
  setActiveTab?: (tab: TabType) => void;
}

type SubjectFilter = 'all' | 'mathematics' | 'english' | 'science';

function subjectLabelFor(id: 'mathematics' | 'english' | 'science'): 'Mathematics' | 'English' | 'Science' {
  return subjectRegistry[id].label;
}

function asSubjectLesson(gl: GeneratedLesson): SubjectLesson {
  return {
    id: gl.id,
    subject: gl.subject,
    subjectLabel: subjectLabelFor(gl.subject),
    grade: 'Grade 8',
    unitId: 'ai-library',
    unitTitle: gl.strand,
    strand: gl.strand,
    topic: gl.topic,
    title: gl.title,
    inquiryQuestion: gl.inquiryQuestion,
    objectives: gl.objectives,
    studentExplanation: gl.studentExplanation,
    teacherNotes: gl.teacherNotes,
    animatedSteps: gl.animatedSteps,
    interactiveType: gl.subjectInteractiveType ?? '',
    modality: 'animated_explainer',
    workedExamples: gl.workedExamples,
    practiceQuestions: gl.practiceQuestions.map((q, i) => ({
      id: `p${i + 1}`,
      type: 'short_answer' as const,
      question: q.question,
      answer: q.answer,
      explanation: q.explanation,
    })),
    assignmentQuestions: gl.assignmentQuestions.map((q, i) => ({
      id: `a${i + 1}`,
      question: q.question,
      expectedAnswer: q.expectedAnswer,
      rubric: q.rubric,
      marks: 10,
    })),
    extensionChallenge: gl.extensionChallenge,
  };
}

function timeAgo(iso: string): string {
  const ms = Date.now() - new Date(iso).getTime();
  const minutes = Math.round(ms / 60000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  return `${days}d ago`;
}

export function LessonLibraryPanel({ setActiveTab }: Props) {
  const fbReady = isFirebaseConfigured();
  const [lessons, setLessons] = useState<GeneratedLesson[] | null>(null);
  const [filter, setFilter] = useState<SubjectFilter>('all');
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    if (!fbReady) {
      setLessons(null);
      return;
    }
    setLoading(true);
    try {
      const result = await getGeneratedLessons({
        createdBy: getDemoUserId('teacher'),
        limit: 30,
      });
      setLessons(result ?? []);
    } catch (err) {
      console.warn('[LessonLibrary] load failed', err);
      setLessons([]);
    } finally {
      setLoading(false);
    }
  }, [fbReady]);

  useEffect(() => {
    void load();
  }, [load]);

  const filtered = useMemo(
    () => (lessons ?? []).filter((l) => filter === 'all' || l.subject === filter),
    [lessons, filter],
  );

  const counts = useMemo(() => {
    const c = { all: lessons?.length ?? 0, mathematics: 0, english: 0, science: 0 } as Record<SubjectFilter, number>;
    for (const l of lessons ?? []) c[l.subject] += 1;
    return c;
  }, [lessons]);

  const teachLesson = (lesson: GeneratedLesson) => {
    if (lesson.subject === 'mathematics') {
      // Maths goes through the legacy demoAssignment store via the
      // Lesson Player. Just navigate; we don't auto-assign.
      setActiveTab?.('lesson');
      return;
    }
    setActiveSubjectLesson(asSubjectLesson(lesson));
    setActiveTab?.(lesson.subject === 'english' ? 'english-studio' : 'science-studio');
  };

  return (
    <section className="rounded-lg border border-white/10 bg-gradient-to-br from-[#0a1736] via-[#061126] to-[#050711] p-5 text-white">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <Library className="h-5 w-5 text-[#ffe08a]" />
          <div>
            <p className="text-xs font-black uppercase tracking-wide text-[#ffe08a]">Lesson library</p>
            <p className="text-sm font-semibold text-slate-300">
              Your AI-generated lessons, saved to Firestore.
            </p>
          </div>
        </div>
        <button
          onClick={() => void load()}
          disabled={loading || !fbReady}
          className="inline-flex items-center gap-1.5 rounded-md border border-white/15 px-2.5 py-1.5 text-[11px] font-black uppercase tracking-wide text-slate-200 transition hover:border-white/40 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? <Loader2 className="h-3 w-3 animate-spin" /> : <RefreshCw className="h-3 w-3" />}
          Refresh
        </button>
      </div>

      {!fbReady ? (
        <p className="mt-4 rounded-md border border-[#ffc43b]/30 bg-[#ffc43b]/10 px-3 py-2 text-sm leading-6 text-[#ffe08a]">
          Demo mode — Firestore is not configured. Saved lessons would appear here once Firebase env vars are set.
        </p>
      ) : (
        <>
          <div className="mt-4 flex flex-wrap items-center gap-1.5">
            {(['all', 'mathematics', 'english', 'science'] as SubjectFilter[]).map((id) => {
              const reg = id === 'all' ? null : subjectRegistry[id];
              const color = reg?.theme.primary ?? '#49c8ff';
              const active = filter === id;
              const label = id === 'all' ? 'All subjects' : reg!.label;
              return (
                <button
                  key={id}
                  onClick={() => setFilter(id)}
                  className="rounded-md border px-2.5 py-1 text-[11px] font-black uppercase tracking-wide transition"
                  style={{
                    borderColor: active ? color : 'rgba(255,255,255,.15)',
                    background: active ? `${color}22` : 'transparent',
                    color: active ? color : '#cbd5e1',
                  }}
                >
                  {label}
                  <span className="ml-1 text-[10px] font-bold opacity-70">{counts[id]}</span>
                </button>
              );
            })}
          </div>

          <div className="mt-3 space-y-2">
            {lessons === null ? (
              <p className="text-sm text-slate-400">Loading…</p>
            ) : filtered.length === 0 ? (
              <div className="rounded-md border border-dashed border-white/15 bg-white/[.02] p-6 text-center">
                <BookOpen className="mx-auto h-7 w-7 text-slate-500" />
                <p className="mt-2 text-sm text-slate-300">
                  No saved lessons yet for this filter.
                </p>
                <p className="mt-1 text-[11px] text-slate-500">
                  Generate one above and click "Save to library" to see it here.
                </p>
              </div>
            ) : (
              filtered.map((lesson) => {
                const reg = subjectRegistry[lesson.subject];
                const interactiveLabel =
                  lesson.subject === 'mathematics' && lesson.threeDType
                    ? lesson.threeDType.replace(/_/g, ' ')
                    : (lesson.subjectInteractiveType ?? 'workshop').replace(/_/g, ' ');
                return (
                  <article
                    key={lesson.id}
                    className="flex flex-wrap items-start justify-between gap-3 rounded-md border p-3"
                    style={{
                      borderColor: `${reg.theme.primary}33`,
                      background: `linear-gradient(135deg, ${reg.theme.primary}10, rgba(255,255,255,.02))`,
                    }}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span
                          className="rounded-full border px-2 py-0.5 text-[10px] font-black uppercase tracking-wide"
                          style={{ borderColor: `${reg.theme.primary}55`, color: reg.theme.primary }}
                        >
                          {reg.label}
                        </span>
                        <span className="rounded-full border border-white/15 bg-white/5 px-2 py-0.5 text-[10px] font-black uppercase tracking-wide text-slate-300">
                          {interactiveLabel}
                        </span>
                        <span className="text-[10px] text-slate-500">{timeAgo(lesson.createdAt)}</span>
                      </div>
                      <p className="mt-1 text-sm font-black text-white">{lesson.title}</p>
                      <p className="mt-0.5 text-xs text-slate-400">
                        {lesson.strand} · {lesson.topic}
                      </p>
                    </div>
                    <button
                      onClick={() => teachLesson(lesson)}
                      className="inline-flex items-center gap-1 rounded-md px-2.5 py-1.5 text-[11px] font-black uppercase tracking-wide transition"
                      style={{ background: reg.theme.primary, color: '#061126' }}
                    >
                      <Sparkles className="h-3 w-3" />
                      Teach
                      <ArrowRight className="h-3 w-3" />
                    </button>
                  </article>
                );
              })
            )}
          </div>
        </>
      )}
    </section>
  );
}
