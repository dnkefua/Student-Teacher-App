'use client';

import { useMemo, useState } from 'react';
import type { LearningEvent } from '@/lib/learningHub/types';
import { platformAnalyticsRegistry } from '@/lib/learningHub/platformRegistry';

type Props = { events: LearningEvent[] };

export function LearningEventsTable({ events }: Props) {
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
