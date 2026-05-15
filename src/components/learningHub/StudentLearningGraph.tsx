'use client';

import { useMemo, useState } from 'react';
import { Activity } from 'lucide-react';
import type { LearningEvent } from '@/lib/learningHub/types';
import { calculateStudentMastery, recommendIntervention } from '@/lib/learningHub/mastery';
import { DEMO_ROSTER } from '@/lib/learningHub/studentMatching';
import { platformAnalyticsRegistry } from '@/lib/learningHub/platformRegistry';
import { threeDLabels } from '@/lib/grade8Curriculum';

type Props = {
  events: LearningEvent[];
  mode: 'teacher' | 'student';
  defaultStudentId?: string;
};

export function StudentLearningGraph({ events, mode, defaultStudentId }: Props) {
  const [studentId, setStudentId] = useState<string>(
    defaultStudentId ?? (mode === 'student' ? DEMO_ROSTER[0].id : DEMO_ROSTER[0].id),
  );
  const student = DEMO_ROSTER.find((s) => s.id === studentId) ?? DEMO_ROSTER[0];

  const profile = useMemo(
    () => calculateStudentMastery(events, { id: student.id, name: student.name, classId: student.classId }),
    [events, student],
  );

  const timeline = useMemo(
    () =>
      events
        .filter((e) => e.studentId === student.id)
        .sort((a, b) => new Date(a.occurredAt).getTime() - new Date(b.occurredAt).getTime())
        .slice(-12),
    [events, student],
  );

  const nextRec = profile.weaknesses[0]
    ? recommendIntervention(profile.weaknesses[0], profile.conceptMastery[profile.weaknesses[0]]?.strand)
    : undefined;

  const concepts = Object.values(profile.conceptMastery).sort((a, b) => b.evidenceCount - a.evidenceCount);

  return (
    <section className="space-y-4">
      {mode === 'teacher' ? (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[10px] uppercase tracking-wide text-slate-400">Student</span>
          <select
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            className="rounded-md border border-white/10 bg-[#050711]/70 px-3 py-1.5 text-sm text-white"
          >
            {DEMO_ROSTER.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>
      ) : null}

      <div className="grid gap-3 sm:grid-cols-4">
        <article className="rounded-lg border border-white/10 bg-[#050711]/70 p-4">
          <p className="text-[10px] uppercase tracking-wide text-slate-400">Overall mastery</p>
          <p className="mt-1 text-3xl font-black text-white">{Math.round(profile.overallMastery)}%</p>
          <p className="mt-1 text-[10px] uppercase tracking-wide text-slate-500">
            Risk · <span className={profile.riskLevel === 'high' ? 'text-[#ff8a73]' : profile.riskLevel === 'medium' ? 'text-[#ffe08a]' : 'text-emerald-300'}>{profile.riskLevel}</span>
          </p>
        </article>
        <article className="rounded-lg border border-white/10 bg-[#050711]/70 p-4">
          <p className="text-[10px] uppercase tracking-wide text-slate-400">Engagement index</p>
          <p className="mt-1 text-3xl font-black text-white">{profile.engagementIndex}</p>
          <p className="mt-1 text-[10px] uppercase tracking-wide text-slate-500">Across {Object.keys(profile.platformBreakdown).length} platforms</p>
        </article>
        <article className="rounded-lg border border-white/10 bg-[#050711]/70 p-4">
          <p className="text-[10px] uppercase tracking-wide text-slate-400">Strongest</p>
          <p className="mt-1 truncate text-sm font-black text-emerald-200">{profile.strengths[0] ?? '—'}</p>
        </article>
        <article className="rounded-lg border border-white/10 bg-[#050711]/70 p-4">
          <p className="text-[10px] uppercase tracking-wide text-slate-400">Needs work</p>
          <p className="mt-1 truncate text-sm font-black text-[#ff8a73]">{profile.weaknesses[0] ?? '—'}</p>
        </article>
      </div>

      <article className="rounded-lg border border-white/10 bg-[#050711]/70 p-4">
        <p className="text-xs font-black uppercase tracking-wide text-[#8ddfff]">Concept mastery bars</p>
        <div className="mt-3 space-y-2">
          {concepts.map((c) => (
            <div key={c.concept}>
              <div className="flex items-center justify-between text-xs">
                <span className="font-black text-white">{c.concept}</span>
                <span className="text-slate-300">{Math.round(c.score)}% · {c.evidenceCount} evt · {c.trend}</span>
              </div>
              <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-white/10">
                <div
                  className={`h-full transition-[width] duration-500 ${
                    c.score >= 75 ? 'bg-emerald-400' : c.score >= 55 ? 'bg-[#ffc43b]' : 'bg-[#ff3d22]'
                  }`}
                  style={{ width: `${Math.min(100, c.score)}%` }}
                />
              </div>
            </div>
          ))}
          {concepts.length === 0 ? <p className="text-sm text-slate-400">No evidence yet — try Upload Reports to add data.</p> : null}
        </div>
      </article>

      <article className="rounded-lg border border-white/10 bg-[#050711]/70 p-4">
        <p className="flex items-center gap-2 text-xs font-black uppercase tracking-wide text-[#ffc43b]">
          <Activity className="h-3.5 w-3.5" />
          Recent activity (last 12 events)
        </p>
        <ul className="mt-3 space-y-1.5 text-xs">
          {timeline.map((e) => (
            <li key={e.id} className="flex flex-wrap items-center justify-between gap-2 rounded-md border border-white/10 bg-white/[0.03] px-3 py-1.5">
              <span className="text-slate-200">
                <span className="font-black text-white">{platformAnalyticsRegistry[e.platform].displayName}</span>{' '}
                · {e.topic ?? '—'}
              </span>
              <span className="text-[11px] text-slate-400">
                {new Date(e.occurredAt).toLocaleDateString()} · {typeof e.score === 'number' ? `${Math.round(e.score)}%` : e.eventType.replace(/_/g, ' ')}
              </span>
            </li>
          ))}
          {timeline.length === 0 ? <li className="text-slate-400">No events captured yet.</li> : null}
        </ul>
      </article>

      {nextRec ? (
        <article className="rounded-lg border border-[#49c8ff]/25 bg-[#49c8ff]/5 p-4">
          <p className="text-xs font-black uppercase tracking-wide text-[#8ddfff]">Recommended next activity</p>
          <p className="mt-1 text-sm font-black text-white">
            {threeDLabels[nextRec]} on &quot;{profile.weaknesses[0]}&quot;
          </p>
          <p className="mt-1 text-[11px] leading-5 text-slate-300">
            Open the Lesson Player and pick this scene to lift mastery on the weakest concept.
          </p>
        </article>
      ) : null}
    </section>
  );
}
