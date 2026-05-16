'use client';

import { useMemo, useState } from 'react';
import type { ClassMasteryProfile, LearningEvent } from '@/lib/learningHub/types';
import { calculateClassMastery, calculateStudentMastery } from '@/lib/learningHub/mastery';
import { platformAnalyticsRegistry } from '@/lib/learningHub/platformRegistry';
import { demoClasses } from '@/lib/learningHub/demoData';
import { Send, TrendingDown, TrendingUp, Wand2 } from 'lucide-react';
import type { TabType } from '@/components/Sidebar';
import { assignDemoQuestion } from '@/lib/demoAssignments';
import { findQuestionById, grade8Curriculum } from '@/lib/grade8Curriculum';
import { resolveIntervention } from '@/lib/subjects/interventionRegistry';
import { subjectRegistry } from '@/lib/subjects/subjectRegistry';

type SubjectFilter = 'all' | 'mathematics' | 'english' | 'science';

const SUBJECT_FILTER_OPTIONS: { id: SubjectFilter; label: string; match?: string }[] = [
  { id: 'all', label: 'All subjects' },
  { id: 'mathematics', label: 'Mathematics', match: 'mathematics' },
  { id: 'english', label: 'English', match: 'english' },
  { id: 'science', label: 'Science', match: 'science' },
];

function eventMatchesSubject(event: LearningEvent, filter: SubjectFilter): boolean {
  if (filter === 'all') return true;
  return (event.subject ?? '').toLowerCase() === filter;
}

type Props = { events: LearningEvent[]; setActiveTab?: (tab: TabType) => void };

export function MasteryAnalytics({ events, setActiveTab }: Props) {
  const classes = useMemo(() => demoClasses(), []);
  const [classId, setClassId] = useState<string>(classes[0]?.classId ?? '');
  const [subjectFilter, setSubjectFilter] = useState<SubjectFilter>('all');
  const cls = classes.find((c) => c.classId === classId) ?? classes[0];

  const filteredEvents = useMemo(
    () => events.filter((e) => eventMatchesSubject(e, subjectFilter)),
    [events, subjectFilter],
  );

  const subjectCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const e of events) {
      const s = (e.subject ?? '').toLowerCase();
      counts[s] = (counts[s] ?? 0) + 1;
    }
    return counts;
  }, [events]);

  const profile: ClassMasteryProfile | null = useMemo(() => {
    if (!cls) return null;
    return calculateClassMastery(filteredEvents, {
      classId: cls.classId,
      className: cls.className,
      grade: 'Grade 8',
      studentIds: cls.studentIds,
      studentNames: cls.studentNames,
    });
  }, [filteredEvents, cls]);

  const heatmap = useMemo(() => {
    if (!cls) return [];
    return cls.studentIds.map((sid) => {
      const sp = calculateStudentMastery(filteredEvents, { id: sid, name: cls.studentNames[sid] ?? sid });
      return { name: sp.studentDisplayName, overall: sp.overallMastery, concepts: sp.conceptMastery };
    });
  }, [filteredEvents, cls]);

  const topicColumns = useMemo(() => {
    if (!profile) return [];
    return Object.keys(profile.conceptAverages).slice(0, 6);
  }, [profile]);

  if (!profile) return null;

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {classes.map((c) => (
            <button
              key={c.classId}
              onClick={() => setClassId(c.classId)}
              className={`rounded-md border px-3 py-1.5 text-xs font-black uppercase tracking-wide transition ${
                classId === c.classId
                  ? 'border-[#49c8ff] bg-[#49c8ff]/10 text-[#8ddfff]'
                  : 'border-white/15 text-slate-300 hover:border-white/35'
              }`}
            >
              {c.className}
            </button>
          ))}
        </div>
        <span className="text-[11px] uppercase tracking-wide text-slate-400">
          Overall mastery <span className="text-base font-black text-white">{Math.round(profile.overallMastery)}%</span>
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-2 rounded-lg border border-white/10 bg-white/[.02] p-2">
        <span className="text-[10px] font-black uppercase tracking-wide text-slate-400">Subject</span>
        {SUBJECT_FILTER_OPTIONS.map((opt) => {
          const reg = opt.match ? subjectRegistry[opt.match as keyof typeof subjectRegistry] : null;
          const color = reg?.theme.primary ?? '#49c8ff';
          const active = subjectFilter === opt.id;
          const eventCount = opt.id === 'all'
            ? events.length
            : (subjectCounts[opt.id] ?? 0);
          return (
            <button
              key={opt.id}
              onClick={() => setSubjectFilter(opt.id)}
              className="rounded-md border px-2.5 py-1 text-[11px] font-black uppercase tracking-wide transition"
              style={{
                borderColor: active ? color : 'rgba(255,255,255,.15)',
                background: active ? `${color}22` : 'transparent',
                color: active ? color : '#cbd5e1',
              }}
            >
              {opt.label}
              <span className="ml-1 text-[10px] font-bold opacity-70">{eventCount}</span>
            </button>
          );
        })}
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <article className="rounded-lg border border-emerald-300/25 bg-emerald-300/5 p-4">
          <p className="text-xs font-black uppercase tracking-wide text-emerald-200">Strongest concepts</p>
          <ul className="mt-2 space-y-1 text-sm text-slate-100">
            {profile.strongestConcepts.map((c) => (
              <li key={c}>
                <span className="font-black text-white">{c}</span>{' '}
                <span className="text-emerald-300">· {Math.round(profile.conceptAverages[c] ?? 0)}%</span>
              </li>
            ))}
            {profile.strongestConcepts.length === 0 ? <li className="text-emerald-200/70">Not enough evidence yet.</li> : null}
          </ul>
        </article>
        <article className="rounded-lg border border-[#ffc43b]/30 bg-[#ffc43b]/5 p-4">
          <p className="text-xs font-black uppercase tracking-wide text-[#ffe08a]">Weakest concepts</p>
          <ul className="mt-2 space-y-2 text-sm text-slate-100">
            {profile.weakestConcepts.map((c) => {
              const sample = filteredEvents.find((e) => (e.topic ?? e.concept ?? e.activityTitle) === c);
              const intervention = resolveIntervention(c);
              const sampleSubject = (sample?.subject ?? '').toLowerCase();
              // For maths, surface the closest curriculum question so the
              // 1-tap "Assign intervention" can still write a demoAssignment.
              const mathsQuestion =
                intervention.subject === 'mathematics'
                  ? grade8Curriculum.find((q) => q.threeDType === intervention.interactiveType) ??
                    grade8Curriculum.find((q) => q.topic === c) ??
                    findQuestionById('abstract-linear-equation-balance')
                  : null;
              const reg = subjectRegistry[intervention.subject];
              const subjectName = sampleSubject || reg.label.toLowerCase();
              return (
                <li key={c} className="rounded-md border border-white/10 bg-white/[0.03] p-2">
                  <div className="flex items-center justify-between gap-2">
                    <span>
                      <span className="font-black text-white">{c}</span>{' '}
                      <span className="text-[#ffc43b]">· {Math.round(profile.conceptAverages[c] ?? 0)}%</span>
                    </span>
                    <span
                      className="rounded-full border px-2 py-0.5 text-[10px] font-black uppercase tracking-wide"
                      style={{ borderColor: `${reg.theme.primary}55`, color: reg.theme.primary }}
                    >
                      {subjectName}
                    </span>
                  </div>
                  {setActiveTab ? (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {mathsQuestion ? (
                        <button
                          onClick={async () => {
                            await assignDemoQuestion(mathsQuestion.id);
                            setActiveTab('dashboard');
                          }}
                          className="inline-flex items-center gap-1 rounded-md bg-[#ffc43b] px-2 py-1 text-[10px] font-black text-[#061126] transition hover:bg-[#ffe08a]"
                        >
                          <Send className="h-3 w-3" />
                          Assign intervention
                        </button>
                      ) : null}
                      <button
                        onClick={() => setActiveTab(intervention.tab as TabType)}
                        className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-[10px] font-black uppercase tracking-wide transition"
                        style={{ background: reg.theme.primary, color: '#061126' }}
                      >
                        <Wand2 className="h-3 w-3" />
                        Open {intervention.label}
                      </button>
                    </div>
                  ) : null}
                </li>
              );
            })}
          </ul>
        </article>
        <article className="rounded-lg border border-[#ff3d22]/30 bg-[#ff3d22]/5 p-4">
          <p className="text-xs font-black uppercase tracking-wide text-[#ff8a73]">Students at risk</p>
          <ul className="mt-2 space-y-1 text-sm text-slate-100">
            {profile.studentsAtRisk.length === 0 ? <li className="text-[#ff8a73]/70">No students currently flagged.</li> : profile.studentsAtRisk.map((n) => <li key={n}>{n}</li>)}
          </ul>
        </article>
      </div>

      <div className="rounded-lg border border-white/10 bg-[#050711]/70 p-4">
        <p className="text-xs font-black uppercase tracking-wide text-slate-300">Concept heatmap</p>
        <div className="mt-3 overflow-x-auto">
          <table className="min-w-[640px] border-separate border-spacing-1 text-left text-xs">
            <thead className="text-[10px] uppercase tracking-wide text-slate-400">
              <tr>
                <th className="px-2 py-1">Student</th>
                {topicColumns.map((t) => (
                  <th key={t} className="max-w-[120px] truncate px-2 py-1 text-center">{t}</th>
                ))}
                <th className="px-2 py-1 text-center">Overall</th>
              </tr>
            </thead>
            <tbody>
              {heatmap.map((row) => (
                <tr key={row.name}>
                  <td className="rounded-md bg-white/[0.04] px-2 py-1 font-black text-white">{row.name}</td>
                  {topicColumns.map((t) => {
                    const score = Math.round(row.concepts[t]?.score ?? 0);
                    const bg = score >= 75 ? 'bg-emerald-400/20 text-emerald-100' : score >= 55 ? 'bg-[#ffc43b]/20 text-[#ffe08a]' : score > 0 ? 'bg-[#ff3d22]/20 text-[#ff8a73]' : 'bg-white/[0.03] text-slate-500';
                    return (
                      <td key={t} className={`rounded-md px-2 py-1 text-center font-black ${bg}`}>
                        {score > 0 ? `${score}` : '—'}
                      </td>
                    );
                  })}
                  <td className="rounded-md bg-white/[0.04] px-2 py-1 text-center font-black text-white">{Math.round(row.overall)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <article className="rounded-lg border border-white/10 bg-[#050711]/70 p-4">
          <p className="text-xs font-black uppercase tracking-wide text-[#8ddfff]">Platform comparison</p>
          <ul className="mt-3 space-y-2">
            {Object.entries(profile.platformComparison)
              .sort((a, b) => (b[1].averageScore ?? 0) - (a[1].averageScore ?? 0))
              .map(([p, v]) => (
                <li key={p} className="flex items-center justify-between gap-3 rounded-md border border-white/10 bg-white/[0.03] px-3 py-2 text-sm">
                  <span className="font-black text-white">{platformAnalyticsRegistry[p as keyof typeof platformAnalyticsRegistry]?.displayName ?? p}</span>
                  <span className="flex items-center gap-2 text-slate-300">
                    <span>{v.events} evt</span>
                    {typeof v.averageScore === 'number' ? (
                      <span className="flex items-center gap-1 font-black text-white">
                        {v.averageScore >= 70 ? <TrendingUp className="h-3 w-3 text-emerald-300" /> : <TrendingDown className="h-3 w-3 text-[#ff8a73]" />}
                        {Math.round(v.averageScore)}%
                      </span>
                    ) : null}
                  </span>
                </li>
              ))}
          </ul>
        </article>
        <article className="rounded-lg border border-white/10 bg-[#050711]/70 p-4">
          <p className="text-xs font-black uppercase tracking-wide text-[#ffc43b]">Recommended class actions</p>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm leading-6 text-slate-200">
            {profile.recommendedActions.map((a, i) => (
              <li key={i}>{a}</li>
            ))}
          </ul>
        </article>
      </div>
    </section>
  );
}
