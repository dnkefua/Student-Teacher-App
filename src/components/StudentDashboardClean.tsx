'use client';

import React, { useEffect, useMemo, useState, useSyncExternalStore } from 'react';
import {
  ArrowRight,
  BookOpen,
  Calculator,
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  FlaskConical,
  GraduationCap,
  Video,
  type LucideIcon,
} from 'lucide-react';
import type { TabType } from './Sidebar';
import {
  type Assignment,
  getSubmission,
  listAssignments,
  subscribe,
} from '@/components/grade8-platform/data/assignmentStore';
import type { SubjectId } from '@/components/grade8-platform/types';

type AssignmentSubjectId = SubjectId;

/**
 * Clean student dashboard.
 *
 * A focused, low-noise landing surface for students. Replaces the
 * older marketing-heavy hero with the four things a student actually
 * needs at a glance:
 *
 *   1. A greeting and a progress bar that summarises completion across
 *      every assignment they have ever been given.
 *   2. Four big tiles — Maths, Science, English, Assignments — that
 *      lead directly to the relevant surface.
 *   3. A month calendar with coloured dots on every day that has a
 *      due assignment, plus the day's items listed when you select it.
 *   4. A compact "Up next" list with the three nearest deadlines.
 *
 * Everything else (cinematic banners, 3D showcases, NeuroQuest cards)
 * is removed in this view — students don't need to filter through
 * teacher-facing copy to find their work.
 */

const DEMO_STUDENT_ID = 'demo-student';

const SUBJECT_META: Record<
  SubjectId,
  { name: string; tagline: string; tab: TabType; icon: LucideIcon; from: string; to: string; ring: string }
> = {
  math: {
    name: 'Maths',
    tagline: 'Grade 8 MYP',
    tab: 'eis-maths',
    icon: Calculator,
    from: 'from-sky-500',
    to: 'to-blue-700',
    ring: 'ring-sky-400/40',
  },
  english: {
    name: 'English',
    tagline: 'Year 8 Language & Literature',
    tab: 'english-studio',
    icon: BookOpen,
    from: 'from-fuchsia-500',
    to: 'to-rose-700',
    ring: 'ring-fuchsia-400/40',
  },
  science: {
    name: 'Science',
    tagline: 'Year 8 Bio · Chem · Physics',
    tab: 'science-studio',
    icon: FlaskConical,
    from: 'from-emerald-500',
    to: 'to-teal-700',
    ring: 'ring-emerald-400/40',
  },
};

// ── External store hook ─────────────────────────────────────────────

function useAssignments(): Assignment[] {
  return useSyncExternalStore(subscribe, listAssignments, () => []);
}

// ── Greeting (very short) ───────────────────────────────────────────

function Greeting() {
  // new Date() + toLocaleDateString depend on (a) the moment of render
  // and (b) the runtime locale — both differ between server and client.
  // Defer the actual date string to a useEffect so the first render
  // matches between SSR and hydration, then fill in the real date.
  const [today, setToday] = useState<Date | null>(null);
  useEffect(() => {
    setToday(new Date());
  }, []);
  const dateLabel = today
    ? today.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })
    : '';
  const hour = today ? today.getHours() : 0;
  const part = today
    ? hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'
    : 'Hello';
  return (
    <header className="flex flex-wrap items-end justify-between gap-3">
      <div>
        <p
          className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400"
          suppressHydrationWarning
        >
          {dateLabel || ' '}
        </p>
        <h1 className="mt-1 text-2xl font-black text-white sm:text-3xl">{part}, Student</h1>
      </div>
    </header>
  );
}

// ── Progress card ───────────────────────────────────────────────────

function ProgressCard({ assignments }: { assignments: Assignment[] }) {
  const total = assignments.length;
  const completed = assignments.filter((a) => !!getSubmission(a.id, DEMO_STUDENT_ID)).length;
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100);

  return (
    <section className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl sm:p-5">
      <div className="flex items-end justify-between gap-3">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Your progress</p>
          <p className="mt-1 text-xl font-black text-white sm:text-2xl">
            {completed} <span className="text-slate-500">/ {total}</span>{' '}
            <span className="text-sm font-bold text-slate-400">complete</span>
          </p>
        </div>
        <span className="rounded-full bg-gradient-to-r from-emerald-400 to-sky-400 bg-clip-text text-3xl font-black text-transparent sm:text-4xl">
          {percent}%
        </span>
      </div>
      <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-sky-400 to-fuchsia-400 transition-all duration-700"
          style={{ width: `${percent}%` }}
        />
      </div>
    </section>
  );
}

// ── Subject tile ───────────────────────────────────────────────────

function SubjectTile({
  subject,
  pending,
  onOpen,
}: {
  subject: SubjectId;
  pending: number;
  onOpen: () => void;
}) {
  const meta = SUBJECT_META[subject];
  const Icon = meta.icon;
  return (
    <button
      onClick={onOpen}
      className={`group relative overflow-hidden rounded-2xl border border-white/15 bg-white/5 p-5 text-left transition hover:-translate-y-0.5 hover:border-white/40 hover:bg-white/10 sm:p-6`}
    >
      <div className={`absolute -right-8 -top-8 h-32 w-32 rounded-full bg-gradient-to-br ${meta.from} ${meta.to} opacity-30 blur-2xl transition group-hover:opacity-50`} />
      <div className={`relative grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br ${meta.from} ${meta.to} shadow-md ring-1 ${meta.ring}`}>
        <Icon className="h-6 w-6 text-white" />
      </div>
      <h3 className="relative mt-4 text-lg font-black text-white">{meta.name}</h3>
      <p className="relative mt-0.5 text-xs text-slate-400">{meta.tagline}</p>
      <div className="relative mt-4 flex items-center justify-between">
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
          {pending > 0 ? `${pending} pending` : 'All caught up'}
        </span>
        <ArrowRight className="h-4 w-4 text-slate-400 transition-transform group-hover:translate-x-0.5 group-hover:text-white" />
      </div>
    </button>
  );
}

function AssignmentsTile({ pending, total, onOpen }: { pending: number; total: number; onOpen: () => void }) {
  return (
    <button
      onClick={onOpen}
      className="group relative overflow-hidden rounded-2xl border border-white/15 bg-gradient-to-br from-amber-500/20 to-orange-700/10 p-5 text-left transition hover:-translate-y-0.5 hover:border-white/40 sm:p-6"
    >
      <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-gradient-to-br from-amber-400 to-orange-600 opacity-40 blur-2xl transition group-hover:opacity-60" />
      <div className="relative grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-600 shadow-md ring-1 ring-amber-300/50">
        <GraduationCap className="h-6 w-6 text-white" />
      </div>
      <h3 className="relative mt-4 text-lg font-black text-white">Assignments</h3>
      <p className="relative mt-0.5 text-xs text-slate-300">{total} total · {pending} pending</p>
      <div className="relative mt-4 flex items-center justify-between">
        <span className="text-[10px] font-black uppercase tracking-widest text-amber-200">
          Open list →
        </span>
        <ArrowRight className="h-4 w-4 text-amber-200 transition-transform group-hover:translate-x-0.5" />
      </div>
    </button>
  );
}

// ── Calendar ────────────────────────────────────────────────────────

function startOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}
function daysInMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
}
function sameYMD(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}
function colourForSubject(s: AssignmentSubjectId): string {
  if (s === 'math') return 'bg-sky-400';
  if (s === 'science') return 'bg-emerald-400';
  return 'bg-fuchsia-400';
}

function Calendar({ assignments }: { assignments: Assignment[] }) {
  const today = new Date();
  const [cursor, setCursor] = useState(() => startOfMonth(today));
  const [selected, setSelected] = useState<Date>(today);

  const monthLabel = cursor.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
  const firstWeekday = cursor.getDay(); // 0=Sun
  const dayCount = daysInMonth(cursor);

  // Map of YYYY-MM-DD → assignments due that day
  const byDate = useMemo(() => {
    const map = new Map<string, Assignment[]>();
    assignments.forEach((a) => {
      const key = a.dueAt.slice(0, 10);
      const existing = map.get(key);
      if (existing) existing.push(a);
      else map.set(key, [a]);
    });
    return map;
  }, [assignments]);

  const cells: (number | null)[] = [];
  for (let i = 0; i < firstWeekday; i++) cells.push(null);
  for (let d = 1; d <= dayCount; d++) cells.push(d);

  const selectedAssignments = useMemo(() => {
    const key = `${selected.getFullYear()}-${String(selected.getMonth() + 1).padStart(2, '0')}-${String(selected.getDate()).padStart(2, '0')}`;
    return byDate.get(key) || [];
  }, [selected, byDate]);

  return (
    <section className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl sm:p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CalendarDays className="h-4 w-4 text-slate-400" />
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Schedule</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))}
            className="rounded-md border border-white/10 bg-white/5 p-1 text-slate-300 hover:bg-white/10"
            aria-label="Previous month"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
          </button>
          <span
            className="min-w-[110px] text-center text-sm font-bold text-white"
            suppressHydrationWarning
          >
            {monthLabel}
          </span>
          <button
            onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))}
            className="rounded-md border border-white/10 bg-white/5 p-1 text-slate-300 hover:bg-white/10"
            aria-label="Next month"
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* weekday labels */}
      <div className="mt-3 grid grid-cols-7 gap-1 text-center text-[9px] font-black uppercase tracking-widest text-slate-500">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((w) => (
          <div key={w}>{w}</div>
        ))}
      </div>

      {/* day grid */}
      <div className="mt-1 grid grid-cols-7 gap-1">
        {cells.map((day, i) => {
          if (day === null) return <div key={`empty-${i}`} className="h-12" />;
          const dayDate = new Date(cursor.getFullYear(), cursor.getMonth(), day);
          const key = `${dayDate.getFullYear()}-${String(dayDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          const items = byDate.get(key) || [];
          const isToday = sameYMD(dayDate, today);
          const isSelected = sameYMD(dayDate, selected);
          return (
            <button
              key={key}
              onClick={() => setSelected(dayDate)}
              className={`relative grid h-11 place-items-center rounded-lg text-sm font-bold transition active:scale-95 sm:h-12 sm:text-xs ${
                isSelected
                  ? 'bg-gradient-to-br from-sky-500/40 to-fuchsia-500/40 text-white ring-2 ring-white/60'
                  : isToday
                    ? 'bg-white/10 text-white ring-1 ring-white/30'
                    : 'text-slate-300 hover:bg-white/5 active:bg-white/10'
              }`}
            >
              {day}
              {items.length > 0 && (
                <div className="absolute bottom-1 left-1/2 flex -translate-x-1/2 gap-0.5">
                  {items.slice(0, 3).map((a) => (
                    <span key={a.id} className={`h-1 w-1 rounded-full ${colourForSubject(a.subject)}`} />
                  ))}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* selected-day list */}
      <div className="mt-3 border-t border-white/10 pt-3">
        <p
          className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400"
          suppressHydrationWarning
        >
          {selected.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}
        </p>
        {selectedAssignments.length === 0 ? (
          <p className="mt-2 text-xs text-slate-500">Nothing scheduled.</p>
        ) : (
          <ul className="mt-2 space-y-1.5">
            {selectedAssignments.map((a) => (
              <li key={a.id} className="flex items-center gap-2 rounded-md border border-white/5 bg-white/5 px-2 py-1.5">
                <span className={`h-2 w-2 shrink-0 rounded-full ${colourForSubject(a.subject)}`} />
                <span className="min-w-0 flex-1 truncate text-xs text-slate-200">{a.title}</span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{a.kind}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* online class link slot — visible only if a class link is configured */}
      <ClassLink />
    </section>
  );
}

/** Reads an optional teacher-configured live-class link from localStorage. */
function ClassLink() {
  const [link, setLink] = useState<string | null>(null);
  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const stored = window.localStorage.getItem('eis-class-link');
      if (stored) setLink(stored);
    } catch {
      /* ignore */
    }
  }, []);
  if (!link) return null;
  return (
    <a
      href={link}
      target="_blank"
      rel="noreferrer"
      className="mt-3 flex items-center justify-between gap-2 rounded-lg border border-sky-400/30 bg-sky-400/10 px-3 py-2 text-xs font-bold text-sky-200 transition hover:bg-sky-400/20"
    >
      <span className="inline-flex items-center gap-2">
        <Video className="h-3.5 w-3.5" /> Join live class
      </span>
      <ArrowRight className="h-3.5 w-3.5" />
    </a>
  );
}

// ── Up Next list ────────────────────────────────────────────────────

function UpNext({ assignments, onOpen }: { assignments: Assignment[]; onOpen: () => void }) {
  const pending = useMemo(
    () =>
      assignments
        .filter((a) => !getSubmission(a.id, DEMO_STUDENT_ID))
        .sort((a, b) => a.dueAt.localeCompare(b.dueAt))
        .slice(0, 4),
    [assignments],
  );

  return (
    <section className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl sm:p-5">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-slate-400" />
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Up next</span>
        </div>
        <button
          onClick={onOpen}
          className="text-[10px] font-black uppercase tracking-widest text-sky-300 hover:underline"
        >
          View all →
        </button>
      </div>
      {pending.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-6 text-center">
          <CheckCircle2 className="h-8 w-8 text-emerald-400" />
          <p className="text-sm font-bold text-white">You&apos;re all caught up</p>
          <p className="text-xs text-slate-500">No pending assignments.</p>
        </div>
      ) : (
        <ul className="space-y-2">
          {pending.map((a) => {
            const due = new Date(a.dueAt);
            const isOverdue = due < new Date();
            return (
              <li
                key={a.id}
                className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/5 px-3 py-2.5"
              >
                <span className={`h-2 w-2 shrink-0 rounded-full ${colourForSubject(a.subject)}`} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-white">{a.title}</p>
                  <p className="text-[10px] uppercase tracking-wider text-slate-500">
                    {a.subject} · {a.kind}
                  </p>
                </div>
                <span
                  className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                    isOverdue ? 'bg-red-500/20 text-red-300' : 'bg-white/10 text-slate-300'
                  }`}
                  suppressHydrationWarning
                >
                  {due.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

// ── Main ───────────────────────────────────────────────────────────

export function StudentDashboardClean({ setActiveTab }: { setActiveTab: (t: TabType) => void }) {
  const assignments = useAssignments();

  const pendingBySubject = useMemo(() => {
    const m: Record<SubjectId, number> = { math: 0, english: 0, science: 0 };
    assignments.forEach((a) => {
      if (getSubmission(a.id, DEMO_STUDENT_ID)) return;
      if (a.subject in m) m[a.subject as SubjectId] += 1;
    });
    return m;
  }, [assignments]);

  const totalPending = pendingBySubject.math + pendingBySubject.english + pendingBySubject.science;

  return (
    <div className="space-y-5">
      <Greeting />

      <ProgressCard assignments={assignments} />

      {/* Subject + Assignments tiles */}
      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <SubjectTile subject="math" pending={pendingBySubject.math} onOpen={() => setActiveTab(SUBJECT_META.math.tab)} />
        <SubjectTile subject="english" pending={pendingBySubject.english} onOpen={() => setActiveTab(SUBJECT_META.english.tab)} />
        <SubjectTile subject="science" pending={pendingBySubject.science} onOpen={() => setActiveTab(SUBJECT_META.science.tab)} />
        <AssignmentsTile
          pending={totalPending}
          total={assignments.length}
          onOpen={() => setActiveTab('eis-maths')}
        />
      </section>

      {/* Calendar + Up next */}
      <section className="grid gap-3 lg:grid-cols-[1.3fr_1fr]">
        <Calendar assignments={assignments} />
        <UpNext assignments={assignments} onOpen={() => setActiveTab('eis-maths')} />
      </section>
    </div>
  );
}
