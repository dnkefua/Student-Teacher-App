'use client';

import React, { useEffect, useState } from 'react';
import { ChevronDown, ChevronRight, Inbox, Loader2, RefreshCw, UserCircle } from 'lucide-react';
import {
  getActiveAssignments,
  getResponsesForAssignment,
} from '@/lib/firebase/firestore';
import { isFirebaseConfigured } from '@/lib/firebase/client';
import { threeDLabels } from '@/lib/grade8Curriculum';
import type {
  FirestoreAssignment,
  StudentResponse,
} from '@/lib/firebase/types';

type AssignmentWithResponses = {
  assignment: FirestoreAssignment;
  responses: StudentResponse[];
};

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

export function TeacherSubmissionsPanel() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<AssignmentWithResponses[] | null>(null);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    if (!isFirebaseConfigured()) {
      setData(null);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const assignments = await getActiveAssignments();
      if (!assignments) {
        setData([]);
        return;
      }
      const enriched = await Promise.all(
        assignments.map(async (a) => ({
          assignment: a,
          responses: (await getResponsesForAssignment(a.id)) ?? [],
        })),
      );
      setData(enriched);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to load submissions.';
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

  const toggle = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  if (!isFirebaseConfigured()) {
    return (
      <section className="relative overflow-hidden rounded-lg border border-[#ffc43b]/25 bg-gradient-to-br from-[#1a1306] via-[#0e0a04] to-[#050711] p-6 text-white">
        <p className="text-xs font-black uppercase tracking-wide text-[#ffe08a]">Submissions panel</p>
        <p className="mt-2 text-base font-semibold text-slate-200">
          Demo mode — Firestore is not configured. Enable Firebase and set the env vars to see live student submissions here.
        </p>
      </section>
    );
  }

  return (
    <section className="relative overflow-hidden rounded-lg border border-white/10 bg-gradient-to-br from-[#0a1736] via-[#061126] to-[#050711] p-6 text-white">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Inbox className="h-5 w-5 text-[#49c8ff]" />
          <div>
            <p className="text-xs font-black uppercase tracking-wide text-[#8ddfff]">Live submissions</p>
            <p className="text-sm font-semibold text-slate-300">From the EIS Grade 8 Maths demo class · Firestore</p>
          </div>
        </div>
        <button
          onClick={() => void load()}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-md border border-white/15 px-3 py-2 text-xs font-black uppercase tracking-wide text-slate-200 transition hover:border-[#49c8ff] hover:text-[#8ddfff] disabled:cursor-not-allowed disabled:opacity-60"
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

      <div className="mt-5 space-y-3">
        {data === null ? (
          <p className="text-sm text-slate-400">Loading…</p>
        ) : data.length === 0 ? (
          <p className="text-sm text-slate-400">
            No assignments yet. Use the &ldquo;Assign to Student&rdquo; flow above to create one.
          </p>
        ) : (
          data.map(({ assignment, responses }) => {
            const isOpen = expanded.has(assignment.id);
            return (
              <article key={assignment.id} className="rounded-md border border-white/10 bg-[#050711]/55">
                <button
                  onClick={() => toggle(assignment.id)}
                  className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left transition hover:bg-white/[0.04]"
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="truncate text-sm font-black text-white">{assignment.title}</p>
                      <span className="rounded-full border border-white/15 bg-white/5 px-2 py-0.5 text-[10px] font-black uppercase tracking-wide text-slate-300">
                        {assignment.difficulty}
                      </span>
                      <span className="rounded-full border border-[#49c8ff]/25 bg-[#49c8ff]/10 px-2 py-0.5 text-[10px] font-black uppercase tracking-wide text-[#8ddfff]">
                        {threeDLabels[assignment.threeDType]}
                      </span>
                    </div>
                    <p className="mt-1 truncate text-xs text-slate-400">
                      {assignment.lessonTitle} · created {timeAgo(assignment.createdAt)}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="rounded-md border border-white/15 bg-white/5 px-2 py-1 text-[10px] font-black uppercase tracking-wide text-slate-200">
                      {responses.length} submission{responses.length === 1 ? '' : 's'}
                    </span>
                    {isOpen ? <ChevronDown className="h-4 w-4 text-slate-300" /> : <ChevronRight className="h-4 w-4 text-slate-300" />}
                  </div>
                </button>

                {isOpen ? (
                  <div className="border-t border-white/10 px-4 py-4">
                    <p className="text-xs italic text-[#8ddfff]">Inquiry: {assignment.inquiryQuestion}</p>
                    <p className="mt-2 text-sm font-semibold text-slate-200">{assignment.question}</p>
                    <p className="mt-1 text-[11px] text-slate-500">Expected · {assignment.expectedAnswer}</p>

                    {responses.length === 0 ? (
                      <p className="mt-4 text-sm text-slate-400">No submissions yet.</p>
                    ) : (
                      <ul className="mt-4 space-y-3">
                        {responses.map((r) => (
                          <li key={r.id} className="rounded-md border border-white/10 bg-white/[0.03] p-3">
                            <div className="flex items-center justify-between gap-3">
                              <div className="flex items-center gap-2">
                                <UserCircle className="h-4 w-4 text-[#ffc43b]" />
                                <p className="text-xs font-black uppercase tracking-wide text-slate-200">
                                  {r.studentId}
                                </p>
                              </div>
                              <div className="flex items-center gap-2">
                                <span
                                  className={`rounded-full px-2 py-0.5 text-[10px] font-black uppercase tracking-wide ${
                                    r.score >= 90
                                      ? 'bg-emerald-400/15 text-emerald-200'
                                      : r.score >= 60
                                      ? 'bg-[#ffc43b]/15 text-[#ffe08a]'
                                      : 'bg-[#ff3d22]/15 text-[#ff8a73]'
                                  }`}
                                >
                                  {r.score}%
                                </span>
                                <span className="text-[10px] text-slate-500">{timeAgo(r.submittedAt)}</span>
                              </div>
                            </div>
                            <p className="mt-2 text-sm text-white">{r.answer}</p>
                            <p className="mt-2 text-xs leading-5 text-slate-400">{r.feedback}</p>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ) : null}
              </article>
            );
          })
        )}
      </div>
    </section>
  );
}
