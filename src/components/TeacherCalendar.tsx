'use client';

import React, { useMemo, useState, useSyncExternalStore } from 'react';
import {
  ArrowRight,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock,
  Video,
} from 'lucide-react';
import {
  type LiveClassSession,
  listSessions,
  subscribe,
} from '@/lib/liveClass/liveClassStore';
import type { TabType } from './Sidebar';

/**
 * Teacher calendar.
 *
 * Renders a month grid with every scheduled LiveClassSession plotted
 * as a coloured dot. Click any day to see that day's sessions listed
 * underneath with full time / duration / "Open class" action.
 *
 * The calendar is read-only — creating new sessions still happens
 * from the LiveClassManager card on the dashboard. This view is the
 * "where do all my links live" hub.
 */

const SUBJECT_COLOR: Record<string, string> = {
  math: 'bg-sky-400',
  english: 'bg-fuchsia-400',
  science: 'bg-emerald-400',
};
const SUBJECT_RING: Record<string, string> = {
  math: 'ring-sky-400/40',
  english: 'ring-fuchsia-400/40',
  science: 'ring-emerald-400/40',
};

function startOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}
function daysInMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
}
function sameYMD(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

export function TeacherCalendar({ setActiveTab }: { setActiveTab: (tab: TabType) => void }) {
  const sessions = useSyncExternalStore(subscribe, listSessions, () => [] as LiveClassSession[]);
  const today = new Date();
  const [cursor, setCursor] = useState(() => startOfMonth(today));
  const [selected, setSelected] = useState<Date>(today);

  const monthLabel = cursor.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
  const firstWeekday = cursor.getDay();
  const dayCount = daysInMonth(cursor);

  // Map of YYYY-MM-DD → sessions starting that day.
  const byDate = useMemo(() => {
    const m = new Map<string, LiveClassSession[]>();
    sessions.forEach((s) => {
      const d = new Date(s.startsAt);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      const existing = m.get(key);
      if (existing) existing.push(s);
      else m.set(key, [s]);
    });
    return m;
  }, [sessions]);

  const cells: (number | null)[] = [];
  for (let i = 0; i < firstWeekday; i++) cells.push(null);
  for (let d = 1; d <= dayCount; d++) cells.push(d);

  const selectedKey = `${selected.getFullYear()}-${String(selected.getMonth() + 1).padStart(2, '0')}-${String(selected.getDate()).padStart(2, '0')}`;
  const selectedSessions = byDate.get(selectedKey) || [];

  // Stats
  const upcomingCount = sessions.filter((s) => new Date(s.startsAt).getTime() >= Date.now()).length;
  const todayCount = byDate.get(
    `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`,
  )?.length || 0;

  return (
    <div className="mx-auto max-w-5xl space-y-5">
      <header>
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
          Teacher schedule
        </p>
        <h1 className="mt-1 flex items-center gap-2 text-2xl font-black text-white sm:text-3xl">
          <CalendarDays className="h-7 w-7 text-sky-400" />
          Calendar
        </h1>
        <p className="mt-1 text-sm text-slate-400">
          {sessions.length === 0
            ? 'No live classes scheduled yet. Create one from the teacher dashboard.'
            : `${upcomingCount} upcoming · ${todayCount} today · ${sessions.length} total`}
        </p>
      </header>

      <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        {/* Month grid */}
        <section className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl sm:p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-slate-300" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300">
                Month
              </span>
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
                className="min-w-[120px] text-center text-sm font-bold text-white"
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

          <div className="mt-3 grid grid-cols-7 gap-1 text-center text-[9px] font-black uppercase tracking-widest text-slate-500">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((w) => (
              <div key={w}>{w}</div>
            ))}
          </div>

          <div className="mt-1 grid grid-cols-7 gap-1">
            {cells.map((day, i) => {
              if (day === null) return <div key={`empty-${i}`} className="h-14" />;
              const dayDate = new Date(cursor.getFullYear(), cursor.getMonth(), day);
              const key = `${dayDate.getFullYear()}-${String(dayDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
              const items = byDate.get(key) || [];
              const isToday = sameYMD(dayDate, today);
              const isSelected = sameYMD(dayDate, selected);
              return (
                <button
                  key={key}
                  onClick={() => setSelected(dayDate)}
                  className={`relative grid h-14 place-items-center rounded-lg text-sm font-bold transition active:scale-95 ${
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
                      {items.slice(0, 4).map((s) => (
                        <span
                          key={s.id}
                          className={`h-1.5 w-1.5 rounded-full ${SUBJECT_COLOR[s.subject || 'math'] || 'bg-slate-400'}`}
                        />
                      ))}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </section>

        {/* Selected-day sessions */}
        <section className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl sm:p-5">
          <p
            className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400"
            suppressHydrationWarning
          >
            {selected.toLocaleDateString(undefined, {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
            })}
          </p>
          {selectedSessions.length === 0 ? (
            <p className="mt-3 rounded-md border border-dashed border-white/10 px-3 py-6 text-center text-xs text-slate-500">
              Nothing scheduled on this day.
            </p>
          ) : (
            <ul className="mt-3 space-y-2">
              {selectedSessions
                .slice()
                .sort((a, b) => a.startsAt.localeCompare(b.startsAt))
                .map((s) => (
                  <li
                    key={s.id}
                    className={`rounded-xl border border-white/10 bg-slate-950/40 p-3 ring-1 ${SUBJECT_RING[s.subject || 'math']}`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-black text-white">{s.title}</p>
                        <p className="mt-0.5 flex items-center gap-1 text-[11px] text-slate-400" suppressHydrationWarning>
                          <Clock className="h-3 w-3" />
                          {new Date(s.startsAt).toLocaleTimeString(undefined, {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                          {' · '}
                          {s.durationMin} min
                          {s.classLabel && ` · ${s.classLabel}`}
                        </p>
                      </div>
                      <button
                        onClick={() => setActiveTab('classroom')}
                        className="inline-flex items-center gap-1 rounded-md bg-emerald-500 px-2 py-1 text-[10px] font-black text-emerald-950 shadow-md hover:bg-emerald-400"
                      >
                        <Video className="h-3 w-3" />
                        Open
                      </button>
                    </div>
                  </li>
                ))}
            </ul>
          )}

          <button
            onClick={() => setActiveTab('dashboard')}
            className="mt-4 inline-flex w-full items-center justify-center gap-1.5 rounded-md border border-white/15 bg-white/5 px-3 py-2 text-xs font-bold text-slate-200 hover:bg-white/10"
          >
            Create a new session
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </section>
      </div>
    </div>
  );
}
