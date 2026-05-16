'use client';

import { useMemo, useState } from 'react';
import { Loader2, Trash2 } from 'lucide-react';
import type { LearningEvent } from '@/lib/learningHub/types';
import { platformAnalyticsRegistry } from '@/lib/learningHub/platformRegistry';
import { deleteImportEverywhere } from '@/lib/learningHub/repository';

type Props = { events: LearningEvent[]; onDeleteImport?: () => void };

export function LearningEventsTable({ events, onDeleteImport }: Props) {
  const [busyImport, setBusyImport] = useState<string | null>(null);

  const importSummary = useMemo(() => {
    const map = new Map<string, { platform: LearningEvent['platform']; count: number }>();
    for (const e of events) {
      if (!e.importId) continue;
      const existing = map.get(e.importId);
      if (existing) existing.count += 1;
      else map.set(e.importId, { platform: e.platform, count: 1 });
    }
    return Array.from(map.entries()).map(([importId, v]) => ({ importId, ...v }));
  }, [events]);

  const deleteImport = async (importId: string) => {
    if (busyImport) return;
    if (!confirm('Delete this import and every event it created? This is logged in the audit trail.')) return;
    setBusyImport(importId);
    try {
      await deleteImportEverywhere(importId);
      onDeleteImport?.();
    } finally {
      setBusyImport(null);
    }
  };

  return TableInner({ events, importSummary, deleteImport, busyImport });
}

function TableInner({
  events,
  importSummary,
  deleteImport,
  busyImport,
}: {
  events: LearningEvent[];
  importSummary: { importId: string; platform: LearningEvent['platform']; count: number }[];
  deleteImport: (id: string) => void;
  busyImport: string | null;
}) {
  const [platform, setPlatform] = useState<string>('all');
  const [topic, setTopic] = useState<string>('all');
  const [signal, setSignal] = useState<string>('all');
  const [studentQuery, setStudentQuery] = useState('');

  const platforms = useMemo(() => Array.from(new Set(events.map((e) => e.platform))), [events]);
  const topics = useMemo(() => Array.from(new Set(events.map((e) => e.topic).filter((x): x is string => !!x))).sort(), [events]);

  const filtered = useMemo(
    () =>
      events
        .filter((e) => platform === 'all' || e.platform === platform)
        .filter((e) => topic === 'all' || e.topic === topic)
        .filter((e) => signal === 'all' || e.masterySignal === signal)
        .filter((e) =>
          !studentQuery
            ? true
            : (e.mappedStudentName ?? e.externalStudentName ?? '').toLowerCase().includes(studentQuery.toLowerCase()),
        )
        .sort((a, b) => new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime())
        .slice(0, 200),
    [events, platform, topic, signal, studentQuery],
  );

  return (
    <section className="space-y-3">
      {importSummary.length > 0 ? (
        <div className="rounded-lg border border-white/10 bg-[#050711]/70 p-3">
          <p className="text-[10px] font-black uppercase tracking-wide text-slate-400">Active imports</p>
          <ul className="mt-2 grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
            {importSummary.map((row) => (
              <li key={row.importId} className="flex items-center justify-between gap-2 rounded-md border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs">
                <span className="min-w-0 truncate">
                  <span className="font-black text-white">{platformAnalyticsRegistry[row.platform].displayName}</span>
                  <span className="text-slate-400"> · {row.count} events · </span>
                  <span className="font-mono text-slate-500">{row.importId}</span>
                </span>
                <button
                  onClick={() => deleteImport(row.importId)}
                  disabled={busyImport === row.importId}
                  className="inline-flex items-center gap-1 rounded-md border border-white/15 px-2 py-1 text-[10px] font-black text-slate-300 transition hover:border-[#ff3d22]/40 hover:text-[#ff8a73] disabled:opacity-60"
                >
                  {busyImport === row.importId ? <Loader2 className="h-3 w-3 animate-spin" /> : <Trash2 className="h-3 w-3" />}
                  Delete
                </button>
              </li>
            ))}
          </ul>
          <p className="mt-2 text-[11px] text-slate-500">
            Deleting an import removes it from Firestore (when configured) and the local cache, along with every event
            it created. Audit-logged.
          </p>
        </div>
      ) : null}

      <div className="grid gap-2 sm:grid-cols-4">
        <input
          value={studentQuery}
          onChange={(e) => setStudentQuery(e.target.value)}
          placeholder="Filter by student name…"
          className="rounded-md border border-white/10 bg-[#050711]/70 px-3 py-2 text-sm text-white outline-none focus:border-[#49c8ff]"
        />
        <select value={platform} onChange={(e) => setPlatform(e.target.value)} className="rounded-md border border-white/10 bg-[#050711]/70 px-3 py-2 text-sm text-white">
          <option value="all">All platforms</option>
          {platforms.map((p) => (
            <option key={p} value={p}>{platformAnalyticsRegistry[p].displayName}</option>
          ))}
        </select>
        <select value={topic} onChange={(e) => setTopic(e.target.value)} className="rounded-md border border-white/10 bg-[#050711]/70 px-3 py-2 text-sm text-white">
          <option value="all">All topics</option>
          {topics.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
        <select value={signal} onChange={(e) => setSignal(e.target.value)} className="rounded-md border border-white/10 bg-[#050711]/70 px-3 py-2 text-sm text-white">
          <option value="all">All mastery signals</option>
          <option value="strong">Strong</option>
          <option value="developing">Developing</option>
          <option value="weak">Weak</option>
          <option value="unknown">Unknown</option>
        </select>
      </div>

      <div className="overflow-x-auto rounded-md border border-white/10 bg-[#050711]/70">
        <table className="min-w-[860px] text-left text-xs text-slate-200">
          <thead className="bg-white/[0.03] text-[10px] uppercase tracking-wide text-slate-400">
            <tr>
              <th className="px-3 py-2">Student</th>
              <th className="px-3 py-2">Platform</th>
              <th className="px-3 py-2">Activity</th>
              <th className="px-3 py-2">Topic</th>
              <th className="px-3 py-2">Event</th>
              <th className="px-3 py-2">Score</th>
              <th className="px-3 py-2">Mastery</th>
              <th className="px-3 py-2">Date</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((e) => (
              <tr key={e.id} className="border-t border-white/5">
                <td className="px-3 py-2 font-black text-white">{e.mappedStudentName ?? e.externalStudentName ?? '—'}</td>
                <td className="px-3 py-2">{platformAnalyticsRegistry[e.platform].displayName}</td>
                <td className="max-w-[220px] truncate px-3 py-2">{e.activityTitle ?? '—'}</td>
                <td className="px-3 py-2">{e.topic ?? '—'}</td>
                <td className="px-3 py-2 text-[11px] text-slate-400">{e.eventType.replace(/_/g, ' ')}</td>
                <td className="px-3 py-2">{e.score !== undefined ? `${Math.round(e.score)}` : e.accuracy !== undefined ? `${Math.round(e.accuracy)}%` : '—'}</td>
                <td className="px-3 py-2">
                  <span className={
                    e.masterySignal === 'strong'
                      ? 'rounded-full border border-emerald-300/30 bg-emerald-300/10 px-2 py-0.5 text-emerald-200'
                      : e.masterySignal === 'developing'
                      ? 'rounded-full border border-[#ffc43b]/30 bg-[#ffc43b]/10 px-2 py-0.5 text-[#ffe08a]'
                      : e.masterySignal === 'weak'
                      ? 'rounded-full border border-[#ff3d22]/30 bg-[#ff3d22]/10 px-2 py-0.5 text-[#ff8a73]'
                      : 'rounded-full border border-white/15 bg-white/5 px-2 py-0.5 text-slate-300'
                  }>
                    {e.masterySignal ?? 'unknown'}
                  </span>
                </td>
                <td className="px-3 py-2 text-slate-400">{new Date(e.occurredAt).toLocaleDateString()}</td>
              </tr>
            ))}
            {filtered.length === 0 ? (
              <tr><td colSpan={8} className="px-3 py-6 text-center text-slate-400">No events match the current filters.</td></tr>
            ) : null}
          </tbody>
        </table>
      </div>
      <p className="text-[11px] text-slate-500">Showing the most recent {filtered.length} of {events.length.toLocaleString()} normalised events.</p>
    </section>
  );
}
