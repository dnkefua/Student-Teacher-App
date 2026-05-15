'use client';

import React, { useEffect, useState } from 'react';
import { ArrowRight, CheckCircle2, Inbox, Loader2, RefreshCw } from 'lucide-react';
import { getActiveAssignments, getResponsesForAssignment } from '@/lib/firebase/firestore';
import { isFirebaseConfigured } from '@/lib/firebase/client';
import { getDemoUserId } from '@/lib/firebase/demoUser';
import { findQuestionById, threeDLabels } from '@/lib/grade8Curriculum';
import type { FirestoreAssignment, StudentResponse } from '@/lib/firebase/types';
import { saveDemoAssignment, type DemoAssignment } from '@/lib/demoAssignments';

type Row = {
  assignment: FirestoreAssignment;
  myResponse?: StudentResponse;
};

export function StudentAssignmentList({
  activeAssignmentId,
  onSelect,
  onOpenLesson,
}: {
  activeAssignmentId: string;
  onSelect?: (assignment: DemoAssignment) => void;
  onOpenLesson?: () => void;
}) {
  const [rows, setRows] = useState<Row[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    if (!isFirebaseConfigured()) {
      setRows(null);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const assignments = await getActiveAssignments();
      if (!assignments) {
        setRows([]);
        return;
      }
      const studentId = getDemoUserId('student');
      const enriched = await Promise.all(
        assignments.map(async (a) => {
          const responses = (await getResponsesForAssignment(a.id)) ?? [];
          const mine = responses.find((r) => r.studentId === studentId);
          return { assignment: a, myResponse: mine };
        }),
      );
      setRows(enriched);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to load assignments.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
    const onChange = () => void load();
    window.addEventListener('eis-demo-assignment', onChange);
    return () => window.removeEventListener('eis-demo-assignment', onChange);
  }, []);

  const selectAssignment = (fs: FirestoreAssignment) => {
    const question = findQuestionById(fs.questionId);
    const next: DemoAssignment = {
      id: fs.id,
      questionId: fs.questionId,
      title: fs.title,
      lessonTitle: fs.lessonTitle,
      inquiryQuestion: fs.inquiryQuestion,
      objective: fs.objective,
      question: fs.question,
      prompt: fs.prompt,
      expectedAnswer: fs.expectedAnswer,
      teacherNote: question?.teacherNote ?? '',
      threeDType: fs.threeDType,
      difficulty: fs.difficulty,
      status: 'assigned',
      createdAt: fs.createdAt,
      firestoreBacked: true,
    };
    saveDemoAssignment(next);
    onSelect?.(next);
    onOpenLesson?.();
  };

  if (!isFirebaseConfigured()) {
    return (
      <section className="relative overflow-hidden rounded-lg border border-[#ffc43b]/25 bg-gradient-to-br from-[#1a1306] via-[#0e0a04] to-[#050711] p-6 text-white">
        <p className="text-xs font-black uppercase tracking-wide text-[#ffe08a]">Assignment inbox</p>
        <p className="mt-2 text-base font-semibold text-slate-200">
          Demo mode — Firestore is not configured. Your current assignment lives in this device&apos;s storage.
        </p>
      </section>
    );
  }

  return (
    <section className="relative overflow-hidden rounded-lg border border-white/10 bg-gradient-to-br from-[#0a1736] via-[#061126] to-[#050711] p-6 text-white">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Inbox className="h-5 w-5 text-[#ffc43b]" />
          <div>
            <p className="text-xs font-black uppercase tracking-wide text-[#ffe08a]">Assignment inbox</p>
            <p className="text-sm font-semibold text-slate-300">Everything your teacher has assigned · live from Firestore</p>
          </div>
        </div>
        <button
          onClick={() => void load()}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-md border border-white/15 px-3 py-2 text-xs font-black uppercase tracking-wide text-slate-200 transition hover:border-[#ffc43b] hover:text-[#ffe08a] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RefreshCw className="h-3.5 w-3.5" />}
          Refresh
        </button>
      </div>

      {error ? (
        <p className="mt-4 rounded-md border border-red-300/30 bg-red-300/10 px-3 py-2 text-sm font-semibold text-red-100">
          {error}
        </p>
      ) : null}

      <ul className="mt-5 space-y-3">
        {rows === null ? (
          <li className="text-sm text-slate-400">Loading…</li>
        ) : rows.length === 0 ? (
          <li className="text-sm text-slate-400">No assignments yet. Ask your teacher to assign a checkpoint.</li>
        ) : (
          rows.map(({ assignment, myResponse }) => {
            const isActive = assignment.id === activeAssignmentId;
            return (
              <li
                key={assignment.id}
                className={`rounded-md border p-4 transition ${
                  isActive
                    ? 'border-[#ffc43b] bg-[#ffc43b]/10'
                    : 'border-white/10 bg-white/[0.03] hover:border-white/25'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-black text-white">{assignment.title}</p>
                    <p className="mt-1 text-xs text-slate-400">{assignment.lessonTitle}</p>
                    <p className="mt-2 text-xs italic text-[#8ddfff]">Inquiry: {assignment.inquiryQuestion}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {myResponse ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-400/15 px-2 py-0.5 text-[10px] font-black uppercase tracking-wide text-emerald-200">
                        <CheckCircle2 className="h-3 w-3" />
                        Submitted · {myResponse.score}%
                      </span>
                    ) : (
                      <span className="rounded-full border border-white/15 bg-white/5 px-2 py-0.5 text-[10px] font-black uppercase tracking-wide text-slate-300">
                        Awaiting submission
                      </span>
                    )}
                    <span className="rounded-full border border-white/15 bg-white/5 px-2 py-0.5 text-[10px] font-black uppercase tracking-wide text-slate-300">
                      {threeDLabels[assignment.threeDType]}
                    </span>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between gap-3">
                  <p className="text-sm text-slate-200">{assignment.question}</p>
                  <button
                    onClick={() => selectAssignment(assignment)}
                    disabled={isActive}
                    className={`inline-flex shrink-0 items-center gap-2 rounded-md px-3 py-2 text-xs font-black uppercase tracking-wide transition ${
                      isActive
                        ? 'border border-[#ffc43b]/30 bg-[#ffc43b]/10 text-[#ffe08a] cursor-default'
                        : 'border border-white/15 text-slate-200 hover:border-[#ffc43b] hover:text-[#ffe08a]'
                    }`}
                  >
                    {isActive ? 'Currently active' : 'Open lesson'}
                    {!isActive ? <ArrowRight className="h-3.5 w-3.5" /> : null}
                  </button>
                </div>
              </li>
            );
          })
        )}
      </ul>
    </section>
  );
}
