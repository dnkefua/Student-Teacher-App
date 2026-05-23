'use client';

import React, { useMemo, useSyncExternalStore } from 'react';
import {
  ArrowRight,
  BookOpen,
  Calculator,
  CheckCircle2,
  ClipboardList,
  Clock,
  FlaskConical,
  Layers3,
  Library,
  Sparkles,
  type LucideIcon,
} from 'lucide-react';
import {
  type Assignment,
  getSubmission,
  listAssignments,
  subscribe,
} from '@/components/grade8-platform/data/assignmentStore';
import type { SubjectId, TabType } from '@/components/grade8-platform/types';

/**
 * Per-subject home for students.
 *
 * Replaces the full teacher platform when mode === 'student' and the user
 * is on a subject tab. Shows only what a student needs in one focused page:
 *
 *   1. Hero strip with subject identity + tiny progress bar for this subject.
 *   2. "Continue your assigned lesson" — surfaces the next pending assignment.
 *   3. "Your assignments" — list of pending + completed work for this subject.
 *   4. "Resources" — three quick-access pills to deeper surfaces (lessons,
 *      practice, learning assets / labs).
 *
 * The "Browse all lessons" / "Open practice" / "View assets" actions delegate
 * up to the parent (SubjectStudioShell) which swaps in the full grade8
 * platform on the right tab. Everything else stays inside this page.
 */

const SUBJECT_META: Record<
  SubjectId,
  { name: string; tagline: string; icon: LucideIcon; from: string; to: string; chipBg: string; chipText: string }
> = {
  math: {
    name: 'Mathematics',
    tagline: 'Grade 8 MYP · Four reasoning strands',
    icon: Calculator,
    from: 'from-sky-500',
    to: 'to-blue-700',
    chipBg: 'bg-sky-500/15',
    chipText: 'text-sky-300',
  },
  english: {
    name: 'English',
    tagline: 'Year 8 · Language, literature & analysis',
    icon: BookOpen,
    from: 'from-fuchsia-500',
    to: 'to-rose-700',
    chipBg: 'bg-fuchsia-500/15',
    chipText: 'text-fuchsia-300',
  },
  science: {
    name: 'Science',
    tagline: 'Year 8 · Biology, chemistry, physics',
    icon: FlaskConical,
    from: 'from-emerald-500',
    to: 'to-teal-700',
    chipBg: 'bg-emerald-500/15',
    chipText: 'text-emerald-300',
  },
};

const DEMO_STUDENT_ID = 'demo-student';

function useAssignments(): Assignment[] {
  return useSyncExternalStore(subscribe, listAssignments, () => []);
}

export function StudentSubjectHome({
  subject,
  onBrowse,
}: {
  subject: SubjectId;
  /** Open the full grade8 platform on the requested tab (e.g. 'lesson'). */
  onBrowse: (tab: TabType) => void;
}) {
  const meta = SUBJECT_META[subject];
  const Icon = meta.icon;
  const all = useAssignments();

  const forSubject = useMemo(
    () => all.filter((a) => a.subject === subject).sort((a, b) => a.dueAt.localeCompare(b.dueAt)),
    [all, subject],
  );

  const pending = forSubject.filter((a) => !getSubmission(a.id, DEMO_STUDENT_ID));
  const completed = forSubject.filter((a) => !!getSubmission(a.id, DEMO_STUDENT_ID));
  const continueItem = pending[0];
  const total = forSubject.length;
  const completedCount = completed.length;
  const progress = total === 0 ? 0 : Math.round((completedCount / total) * 100);

  const resourceLinks: { label: string; tab: TabType; icon: LucideIcon; description: string }[] = [
    { label: 'Lessons',  tab: 'lesson',   icon: BookOpen,      description: 'Walk through the worked examples for each unit.' },
    { label: 'Practice', tab: 'practice', icon: ClipboardList, description: 'Practice questions with hints and reveal answers.' },
    { label: 'Assets',   tab: 'assets',   icon: Library,       description: 'Reading material, videos and reference sheets.' },
  ];

  if (subject === 'science' || subject === 'english') {
    resourceLinks.unshift({
      label: 'Core Concepts',
      tab: 'learn',
      icon: Layers3,
      description: 'Subtopic explanations with labelled diagrams and read-aloud.',
    });
  }

  return (
    <div className="h-full overflow-y-auto bg-slate-950 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-5xl space-y-6">
        {/* ── Hero ── */}
        <header className={`relative overflow-hidden rounded-2xl border border-white/15 bg-gradient-to-br ${meta.from} ${meta.to} p-5 text-white shadow-2xl sm:p-7`}>
          <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full bg-white/15 blur-3xl" />
          <div className="relative flex flex-wrap items-end justify-between gap-4">
            <div className="min-w-0">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.3em] text-white/90">
                <Sparkles className="h-3 w-3" /> Student view
              </div>
              <div className="mt-3 flex items-center gap-3">
                <div className="grid h-14 w-14 place-items-center rounded-2xl bg-white/15 ring-1 ring-white/30 backdrop-blur">
                  <Icon className="h-7 w-7 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-black sm:text-3xl">{meta.name}</h1>
                  <p className="text-xs text-white/80">{meta.tagline}</p>
                </div>
              </div>
            </div>
            <div className="w-full sm:w-auto sm:min-w-[200px]">
              <div className="flex items-center justify-between gap-3">
                <span className="text-[10px] font-black uppercase tracking-widest text-white/70">Your progress</span>
                <span className="text-lg font-black text-white">{progress}%</span>
              </div>
              <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-black/30">
                <div className="h-full rounded-full bg-white/90 transition-all duration-700" style={{ width: `${progress}%` }} />
              </div>
              <p className="mt-1 text-[10px] text-white/70">
                {completedCount} of {total} assignment{total === 1 ? '' : 's'} submitted
              </p>
            </div>
          </div>
        </header>

        {/* ── Continue ── */}
        <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
            Continue where you left off
          </p>
          {continueItem ? (
            <div className="mt-3 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] p-4">
              <div className="min-w-0 flex-1">
                <p className="truncate text-base font-black text-white">{continueItem.title}</p>
                <p className="mt-0.5 text-xs text-slate-400">
                  {continueItem.kind} · due {new Date(continueItem.dueAt).toLocaleDateString()}
                </p>
              </div>
              <button
                onClick={() => onBrowse('assignments')}
                className={`inline-flex items-center gap-2 rounded-lg bg-gradient-to-r ${meta.from} ${meta.to} px-4 py-2 text-xs font-black uppercase tracking-widest text-white shadow-lg transition hover:scale-[1.02]`}
              >
                Open <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          ) : (
            <div className="mt-3 flex flex-col items-center justify-center gap-2 rounded-xl border border-emerald-400/20 bg-emerald-400/5 p-6 text-center">
              <CheckCircle2 className="h-10 w-10 text-emerald-400" />
              <p className="text-sm font-black text-white">All caught up</p>
              <p className="text-xs text-slate-400">No pending {meta.name} assignments.</p>
            </div>
          )}
        </section>

        {/* ── Your assignments ── */}
        <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
              Your assignments
            </p>
            <button
              onClick={() => onBrowse('assignments')}
              className="text-[10px] font-black uppercase tracking-widest text-sky-300 hover:underline"
            >
              View all →
            </button>
          </div>

          {forSubject.length === 0 ? (
            <p className="mt-3 rounded-md bg-white/5 p-4 text-center text-sm text-slate-400">
              No {meta.name} assignments yet.
            </p>
          ) : (
            <ul className="mt-3 space-y-2">
              {forSubject.slice(0, 5).map((a) => {
                const submitted = !!getSubmission(a.id, DEMO_STUDENT_ID);
                const overdue = !submitted && new Date(a.dueAt) < new Date();
                return (
                  <li
                    key={a.id}
                    className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.03] px-3 py-2.5"
                  >
                    {submitted ? (
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                    ) : overdue ? (
                      <Clock className="h-4 w-4 shrink-0 text-red-400" />
                    ) : (
                      <Clock className="h-4 w-4 shrink-0 text-slate-400" />
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold text-white">{a.title}</p>
                      <p className="text-[10px] uppercase tracking-wider text-slate-500">
                        {a.kind} · {new Date(a.dueAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span
                      className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                        submitted
                          ? 'bg-emerald-500/15 text-emerald-300'
                          : overdue
                            ? 'bg-red-500/15 text-red-300'
                            : `${meta.chipBg} ${meta.chipText}`
                      }`}
                    >
                      {submitted ? 'Done' : overdue ? 'Overdue' : 'Pending'}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        {/* ── Resources ── */}
        <section>
          <p className="mb-3 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
            Resources & study material
          </p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {resourceLinks.map((r) => {
              const ResIcon = r.icon;
              return (
                <button
                  key={r.tab}
                  onClick={() => onBrowse(r.tab)}
                  className="group flex h-full flex-col rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-left transition hover:-translate-y-0.5 hover:border-white/30 hover:bg-white/[0.08]"
                >
                  <div className={`grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br ${meta.from} ${meta.to} text-white shadow-md`}>
                    <ResIcon className="h-5 w-5" />
                  </div>
                  <p className="mt-3 text-sm font-black text-white">{r.label}</p>
                  <p className="mt-1 text-xs leading-5 text-slate-400">{r.description}</p>
                  <span className="mt-3 inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-slate-500 group-hover:text-white">
                    Open <ArrowRight className="h-3 w-3" />
                  </span>
                </button>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
