'use client';

import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  Award,
  BookOpen,
  Calculator,
  Camera,
  ChevronDown,
  ChevronUp,
  FlaskConical,
  Flame,
  GraduationCap,
  LineChart,
  Lightbulb,
  Target,
  Trash2,
  TrendingDown,
  TrendingUp,
  Sparkles,
  UserCircle,
  type LucideIcon,
} from 'lucide-react';
import { seedDemoDataRepository } from '@/lib/learningHub/repository';
import { listEvents as listLocalEvents } from '@/lib/learningHub/localStore';
import { calculateStudentMastery } from '@/lib/learningHub/mastery';
import type {
  LearningEvent,
  StudentMasteryProfile,
  ConceptMastery,
} from '@/lib/learningHub/types';
import { DEMO_ROSTER } from '@/lib/learningHub/studentMatching';
import type { TabType } from './Sidebar';

/**
 * Student Profile.
 *
 * One screen that surfaces a student's analytics across Mathematics, English
 * and Science with strength / weakness drill-down right down to individual
 * concept scores. Reads from the existing Learning Data Hub repository (the
 * same store the teacher analytics use) so every recorded LearningEvent —
 * imported quizzes, homework completions, NeuroQuest games, in-app 3D
 * interactions and AI tutor sessions — feeds the same mastery engine.
 *
 * Rendering strategy:
 *   1. Resolve a studentId from localStorage (set by acceptInvite or chosen
 *      by the teacher in the picker below). Fall back to the first demo
 *      roster entry so the page is never empty.
 *   2. If the repository is empty we seed demo data once so the UI tells a
 *      complete story on a fresh machine.
 *   3. Split events by subject, run `calculateStudentMastery` per subject,
 *      then compose the cross-subject view — overall composite, per-subject
 *      gauges, granular concept breakdown, strengths/weaknesses,
 *      recommendations with one-click navigation to the matching studio.
 */

const SUBJECTS = [
  { id: 'Mathematics', label: 'Mathematics', icon: Calculator, tab: 'eis-maths' as TabType, accent: 'from-sky-400 to-blue-600', ring: 'ring-sky-400/40', soft: 'bg-sky-500/10', text: 'text-sky-300' },
  { id: 'English',     label: 'English',     icon: BookOpen,   tab: 'english-studio' as TabType, accent: 'from-fuchsia-400 to-rose-600', ring: 'ring-fuchsia-400/40', soft: 'bg-fuchsia-500/10', text: 'text-fuchsia-300' },
  { id: 'Science',     label: 'Science',     icon: FlaskConical, tab: 'science-studio' as TabType, accent: 'from-emerald-400 to-teal-600', ring: 'ring-emerald-400/40', soft: 'bg-emerald-500/10', text: 'text-emerald-300' },
] as const;

type SubjectMeta = (typeof SUBJECTS)[number];

const STRAND_LABEL: Record<string, string> = {
  numerical: 'Numerical',
  abstract: 'Abstract',
  spatial: 'Spatial',
  data: 'Data',
  other: 'Other',
};

const PLATFORM_LABEL: Record<string, string> = {
  kahoot: 'Kahoot',
  blooket: 'Blooket',
  drfrost: 'Dr Frost',
  myimaths: 'MyiMaths',
  managebac: 'ManageBac',
  eis_maths_studio: 'EIS Studio',
  eis_learning_studio: 'EIS Studio',
  neuroquest: 'NeuroQuest',
  google_classroom: 'Google Classroom',
  microsoft_teams: 'MS Teams',
  quizizz: 'Quizizz',
  edpuzzle: 'Edpuzzle',
  seneca: 'Seneca',
  mathspace: 'Mathspace',
  manual_csv: 'Manual CSV',
  wonde: 'Wonde',
  custom: 'Custom',
};

/* ─── Mastery composition ───────────────────────────────────────────── */

type SubjectAnalytics = {
  subject: SubjectMeta;
  profile: StudentMasteryProfile;
  eventCount: number;
};

function buildSubjectAnalytics(
  events: LearningEvent[],
  student: { id: string; name: string; grade?: string },
): SubjectAnalytics[] {
  return SUBJECTS.map((subject) => {
    const subjectEvents = events.filter((e) => (e.subject ?? '').toLowerCase() === subject.id.toLowerCase());
    const profile = calculateStudentMastery(subjectEvents, { id: student.id, name: student.name, grade: student.grade });
    profile.subject = subject.id;
    return { subject, profile, eventCount: subjectEvents.length };
  });
}

/* ─── Tiny inline visualisations ────────────────────────────────────── */

function RadialGauge({ value, label, color = '#49c8ff' }: { value: number; label?: string; color?: string }) {
  const safe = Math.max(0, Math.min(100, value));
  const r = 36;
  const c = 2 * Math.PI * r;
  const dash = (safe / 100) * c;
  return (
    <div className="relative grid place-items-center">
      <svg viewBox="-50 -50 100 100" className="h-24 w-24 -rotate-90">
        <circle cx="0" cy="0" r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="9" />
        <circle
          cx="0"
          cy="0"
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="9"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${c}`}
          style={{ transition: 'stroke-dasharray 1s cubic-bezier(0.2, 0.8, 0.2, 1)' }}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center">
        <div className="text-center">
          <p className="text-xl font-black text-white">{Math.round(safe)}<span className="text-xs text-white/60">%</span></p>
          {label && <p className="text-[9px] font-black uppercase tracking-widest text-white/50">{label}</p>}
        </div>
      </div>
    </div>
  );
}

function ScoreBar({ score, accent }: { score: number; accent: string }) {
  const safe = Math.max(0, Math.min(100, score));
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
      <div
        className={`h-full rounded-full bg-gradient-to-r ${accent}`}
        style={{ width: `${safe}%`, transition: 'width 800ms cubic-bezier(0.2, 0.8, 0.2, 1)' }}
      />
    </div>
  );
}

function TrendBadge({ trend }: { trend: ConceptMastery['trend'] }) {
  if (trend === 'improving') {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-emerald-300 ring-1 ring-emerald-400/30">
        <TrendingUp className="h-3 w-3" /> Up
      </span>
    );
  }
  if (trend === 'declining') {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-rose-500/15 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-rose-300 ring-1 ring-rose-400/30">
        <TrendingDown className="h-3 w-3" /> Down
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-white/60 ring-1 ring-white/15">
      Stable
    </span>
  );
}

function RiskPill({ level }: { level: StudentMasteryProfile['riskLevel'] }) {
  const map: Record<StudentMasteryProfile['riskLevel'], { tone: string; label: string }> = {
    low: { tone: 'bg-emerald-500/15 text-emerald-300 ring-emerald-400/30', label: 'On track' },
    medium: { tone: 'bg-amber-500/15 text-amber-300 ring-amber-400/30', label: 'Watch closely' },
    high: { tone: 'bg-rose-500/15 text-rose-300 ring-rose-400/30', label: 'Needs support' },
  };
  const m = map[level];
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-black uppercase tracking-wider ring-1 ${m.tone}`}>
      <Flame className="h-3 w-3" /> {m.label}
    </span>
  );
}

/* ─── Concept breakdown ─────────────────────────────────────────────── */

function ConceptRow({ concept, subject }: { concept: ConceptMastery; subject: SubjectMeta }) {
  return (
    <div className="rounded-lg border border-white/10 bg-slate-950/40 p-3">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-bold text-white">{concept.concept}</p>
          <div className="mt-1 flex flex-wrap items-center gap-1.5">
            {concept.strand && (
              <span className={`rounded-full ${subject.soft} px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wider ${subject.text}`}>
                {STRAND_LABEL[concept.strand] ?? concept.strand}
              </span>
            )}
            <TrendBadge trend={concept.trend} />
            <span className="text-[10px] text-white/40">
              {concept.evidenceCount} {concept.evidenceCount === 1 ? 'attempt' : 'attempts'}
            </span>
            <span className="text-[10px] text-white/40">
              · confidence {Math.round(concept.confidence * 100)}%
            </span>
          </div>
        </div>
        <div className="shrink-0 text-right">
          <p className="text-lg font-black text-white">{Math.round(concept.score)}<span className="text-xs text-white/50">%</span></p>
        </div>
      </div>
      <div className="mt-2">
        <ScoreBar score={concept.score} accent={subject.accent} />
      </div>
      {concept.recommendedAction && (
        <p className="mt-2 inline-flex items-center gap-1 rounded-md bg-amber-500/10 px-2 py-1 text-[10px] font-bold text-amber-200 ring-1 ring-amber-400/30">
          <Lightbulb className="h-3 w-3" /> {concept.recommendedAction}
        </p>
      )}
    </div>
  );
}

function SubjectSection({
  analytics,
  setActiveTab,
}: {
  analytics: SubjectAnalytics;
  setActiveTab: (tab: TabType) => void;
}) {
  const { subject, profile, eventCount } = analytics;
  const [expanded, setExpanded] = useState(true);
  const Icon = subject.icon;

  const concepts = useMemo(
    () => Object.values(profile.conceptMastery).sort((a, b) => a.score - b.score),
    [profile.conceptMastery],
  );
  const strongest = [...concepts].reverse().find((c) => c.score >= 75);
  const weakest = concepts.find((c) => c.score < 60) ?? concepts[0];

  return (
    <section className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl">
      <header
        className="flex cursor-pointer items-center justify-between gap-3 border-b border-white/5 px-4 py-3"
        onClick={() => setExpanded((v) => !v)}
      >
        <div className="flex min-w-0 items-center gap-3">
          <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br ${subject.accent} ring-1 ring-white/20`}>
            <Icon className="h-5 w-5 text-white" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-black text-white">{subject.label}</p>
            <p className="text-[11px] text-slate-400">
              {eventCount === 0
                ? 'No evidence yet'
                : `${concepts.length} ${concepts.length === 1 ? 'concept' : 'concepts'} tracked · ${eventCount} ${eventCount === 1 ? 'event' : 'events'}`}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <RadialGauge
            value={profile.overallMastery}
            color={subject.id === 'Mathematics' ? '#49c8ff' : subject.id === 'English' ? '#e879f9' : '#34d399'}
          />
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); setActiveTab(subject.tab); }}
            className="hidden items-center gap-1 rounded-md border border-white/15 bg-white/5 px-2.5 py-1.5 text-[10px] font-black uppercase tracking-widest text-white hover:bg-white/10 sm:inline-flex"
          >
            Open studio <ArrowRight className="h-3 w-3" />
          </button>
          {expanded ? <ChevronUp className="h-4 w-4 text-white/60" /> : <ChevronDown className="h-4 w-4 text-white/60" />}
        </div>
      </header>

      {expanded && (
        <div className="space-y-4 p-4">
          {eventCount === 0 ? (
            <p className="rounded-lg border border-dashed border-white/10 px-4 py-6 text-center text-xs text-slate-500">
              No {subject.label.toLowerCase()} evidence yet. Open the studio and complete a lesson to start
              building this profile.
            </p>
          ) : (
            <>
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-xl border border-white/10 bg-slate-950/40 p-3">
                  <p className="text-[9px] font-black uppercase tracking-widest text-white/50">Engagement</p>
                  <p className="mt-1 text-lg font-black text-white">{profile.engagementIndex}%</p>
                  <p className="text-[10px] text-white/40">across all platforms</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-slate-950/40 p-3">
                  <p className="text-[9px] font-black uppercase tracking-widest text-emerald-300/80">Top strength</p>
                  <p className="mt-1 truncate text-sm font-bold text-white">{strongest?.concept ?? '—'}</p>
                  <p className="text-[10px] text-white/40">
                    {strongest ? `${Math.round(strongest.score)}% · ${strongest.evidenceCount} attempts` : 'need more evidence'}
                  </p>
                </div>
                <div className="rounded-xl border border-white/10 bg-slate-950/40 p-3">
                  <p className="text-[9px] font-black uppercase tracking-widest text-rose-300/80">Biggest gap</p>
                  <p className="mt-1 truncate text-sm font-bold text-white">{weakest?.concept ?? '—'}</p>
                  <p className="text-[10px] text-white/40">
                    {weakest ? `${Math.round(weakest.score)}% · ${weakest.evidenceCount} attempts` : 'need more evidence'}
                  </p>
                </div>
              </div>

              <div>
                <p className="mb-2 text-[10px] font-black uppercase tracking-widest text-white/50">
                  Granular concept breakdown
                </p>
                <div className="grid gap-2 sm:grid-cols-2">
                  {concepts.map((c) => (
                    <ConceptRow key={c.concept} concept={c} subject={subject} />
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </section>
  );
}

/* ─── Cross-subject roll-ups ────────────────────────────────────────── */

type RolledConcept = ConceptMastery & { subject: string; subjectMeta: SubjectMeta };

function rollupConcepts(all: SubjectAnalytics[], filter: 'strong' | 'weak'): RolledConcept[] {
  const out: RolledConcept[] = [];
  for (const a of all) {
    for (const c of Object.values(a.profile.conceptMastery)) {
      if (filter === 'strong' && c.score >= 75) out.push({ ...c, subject: a.subject.id, subjectMeta: a.subject });
      if (filter === 'weak' && c.score < 60) out.push({ ...c, subject: a.subject.id, subjectMeta: a.subject });
    }
  }
  return out.sort((a, b) => (filter === 'strong' ? b.score - a.score : a.score - b.score));
}

function StrengthWeaknessColumn({
  title,
  icon: Icon,
  items,
  tone,
  emptyCopy,
  setActiveTab,
}: {
  title: string;
  icon: LucideIcon;
  items: RolledConcept[];
  tone: 'positive' | 'negative';
  emptyCopy: string;
  setActiveTab: (tab: TabType) => void;
}) {
  const ringClass = tone === 'positive' ? 'ring-emerald-400/30' : 'ring-rose-400/30';
  const textClass = tone === 'positive' ? 'text-emerald-300' : 'text-rose-300';
  return (
    <div className={`rounded-2xl border border-white/10 bg-white/[0.04] p-4 ring-1 ${ringClass} backdrop-blur-xl`}>
      <div className="mb-3 flex items-center gap-2">
        <Icon className={`h-4 w-4 ${textClass}`} />
        <p className={`text-[10px] font-black uppercase tracking-widest ${textClass}`}>{title}</p>
      </div>
      {items.length === 0 ? (
        <p className="rounded-md border border-dashed border-white/10 px-3 py-4 text-center text-[11px] text-slate-500">
          {emptyCopy}
        </p>
      ) : (
        <ul className="space-y-2">
          {items.slice(0, 6).map((c) => {
            const SubjectIcon = c.subjectMeta.icon;
            return (
              <li key={`${c.subject}-${c.concept}`} className="rounded-lg border border-white/10 bg-slate-950/40 p-2.5">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-white">{c.concept}</p>
                    <p className="mt-0.5 flex items-center gap-1.5 text-[10px] text-white/50">
                      <SubjectIcon className="h-3 w-3" /> {c.subject}
                      {c.strand && <span>· {STRAND_LABEL[c.strand]}</span>}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveTab(c.subjectMeta.tab)}
                    className={`shrink-0 rounded-md text-base font-black ${textClass} hover:underline`}
                    aria-label={`Open ${c.subject} studio`}
                  >
                    {Math.round(c.score)}%
                  </button>
                </div>
                <div className="mt-1.5">
                  <ScoreBar score={c.score} accent={c.subjectMeta.accent} />
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

/* ─── Recommendations ───────────────────────────────────────────────── */

type Recommendation = {
  id: string;
  title: string;
  detail: string;
  subject: SubjectMeta;
  priority: 'high' | 'medium' | 'low';
};

function buildRecommendations(all: SubjectAnalytics[]): Recommendation[] {
  const out: Recommendation[] = [];
  for (const a of all) {
    const weakConcepts = Object.values(a.profile.conceptMastery)
      .filter((c) => c.score < 60)
      .sort((x, y) => x.score - y.score)
      .slice(0, 3);

    for (const c of weakConcepts) {
      const priority: Recommendation['priority'] = c.score < 40 ? 'high' : c.score < 55 ? 'medium' : 'low';
      out.push({
        id: `rec-${a.subject.id}-${c.concept}`,
        subject: a.subject,
        title: `Re-teach "${c.concept}" in ${a.subject.label}`,
        detail:
          c.recommendedAction
            ?? `Score ${Math.round(c.score)}% across ${c.evidenceCount} ${c.evidenceCount === 1 ? 'attempt' : 'attempts'}. Trend is ${c.trend}. Open the studio and replay the lesson, then re-attempt with the worked-example panel.`,
        priority,
      });
    }

    // Cross-subject style tip when engagement is high but mastery is dropping
    if (a.profile.engagementIndex >= 75 && a.profile.overallMastery < 60 && a.eventCount > 5) {
      out.push({
        id: `rec-engagement-${a.subject.id}`,
        subject: a.subject,
        title: `Slow down on ${a.subject.label} — accuracy is below the engagement signal`,
        detail:
          'You are spending lots of time on this subject but scores have not caught up yet. Try the read-aloud explainers before attempting more questions, and use the AI tutor to verbalise the reasoning.',
        priority: 'medium',
      });
    }
  }

  // Global cross-subject pattern: weak everywhere on data/abstract → study habits
  const allWeak = all.flatMap((a) => Object.values(a.profile.conceptMastery)).filter((c) => c.score < 55);
  if (allWeak.length >= 4) {
    out.push({
      id: 'rec-study-habits',
      subject: SUBJECTS[0],
      title: 'Build a study routine across all three subjects',
      detail:
        'Weakness appears across more than three concepts. Try a 20-minute daily rotation: 8 minutes maths, 6 minutes English, 6 minutes science. Use the calendar to schedule them after class.',
      priority: 'high',
    });
  }

  return out
    .sort((a, b) => {
      const order = { high: 0, medium: 1, low: 2 } as const;
      return order[a.priority] - order[b.priority];
    })
    .slice(0, 6);
}

function RecommendationCard({
  rec,
  setActiveTab,
}: {
  rec: Recommendation;
  setActiveTab: (tab: TabType) => void;
}) {
  const Icon = rec.subject.icon;
  const priorityTone: Record<Recommendation['priority'], string> = {
    high: 'bg-rose-500/15 text-rose-300 ring-rose-400/30',
    medium: 'bg-amber-500/15 text-amber-300 ring-amber-400/30',
    low: 'bg-sky-500/15 text-sky-300 ring-sky-400/30',
  };
  return (
    <article className="flex h-full flex-col gap-2 rounded-xl border border-white/10 bg-slate-950/40 p-3">
      <div className="flex items-center justify-between gap-2">
        <div className={`grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br ${rec.subject.accent} ring-1 ring-white/20`}>
          <Icon className="h-4 w-4 text-white" />
        </div>
        <span className={`rounded-full px-2 py-0.5 text-[9px] font-black uppercase tracking-wider ring-1 ${priorityTone[rec.priority]}`}>
          {rec.priority}
        </span>
      </div>
      <p className="text-sm font-bold leading-snug text-white">{rec.title}</p>
      <p className="text-[11px] leading-5 text-slate-300">{rec.detail}</p>
      <button
        type="button"
        onClick={() => setActiveTab(rec.subject.tab)}
        className="mt-auto inline-flex items-center justify-center gap-1 rounded-md border border-white/15 bg-white/5 px-2 py-1.5 text-[10px] font-black uppercase tracking-widest text-white hover:bg-white/10"
      >
        Open {rec.subject.label} <ArrowRight className="h-3 w-3" />
      </button>
    </article>
  );
}

/* ─── Platform mix + recent activity ────────────────────────────────── */

function PlatformMix({ events }: { events: LearningEvent[] }) {
  const totals = useMemo(() => {
    const map = new Map<string, number>();
    for (const e of events) map.set(e.platform, (map.get(e.platform) ?? 0) + 1);
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]);
  }, [events]);
  const max = totals[0]?.[1] ?? 1;
  if (totals.length === 0) return null;
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur-xl">
      <div className="mb-3 flex items-center gap-2">
        <LineChart className="h-4 w-4 text-sky-300" />
        <p className="text-[10px] font-black uppercase tracking-widest text-white/60">Where the evidence comes from</p>
      </div>
      <ul className="space-y-2">
        {totals.slice(0, 6).map(([platform, count]) => (
          <li key={platform} className="flex items-center gap-3">
            <span className="w-24 shrink-0 truncate text-[11px] font-bold text-white">{PLATFORM_LABEL[platform] ?? platform}</span>
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-sky-400 to-fuchsia-400"
                style={{ width: `${(count / max) * 100}%` }}
              />
            </div>
            <span className="w-10 shrink-0 text-right text-[10px] font-black text-white/70">{count}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function RecentActivity({ events }: { events: LearningEvent[] }) {
  const recent = useMemo(
    () => [...events].sort((a, b) => b.occurredAt.localeCompare(a.occurredAt)).slice(0, 8),
    [events],
  );
  if (recent.length === 0) return null;
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur-xl">
      <div className="mb-3 flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-amber-300" />
        <p className="text-[10px] font-black uppercase tracking-widest text-white/60">Recent activity</p>
      </div>
      <ul className="space-y-1.5">
        {recent.map((e) => (
          <li key={e.id} className="flex items-center justify-between gap-2 rounded-md border border-white/5 bg-slate-950/40 px-2.5 py-1.5">
            <div className="min-w-0 flex-1">
              <p className="truncate text-[12px] font-bold text-white">{e.activityTitle ?? e.topic ?? e.eventType}</p>
              <p className="truncate text-[10px] text-white/45">
                {e.subject ?? '—'} · {PLATFORM_LABEL[e.platform] ?? e.platform} · <span suppressHydrationWarning>{new Date(e.occurredAt).toLocaleDateString()}</span>
              </p>
            </div>
            {typeof e.accuracy === 'number' && (
              <span className="shrink-0 rounded-md bg-white/10 px-1.5 py-0.5 text-[10px] font-black text-white">
                {Math.round(e.accuracy)}%
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ─── Main component ────────────────────────────────────────────────── */

type CurrentStudent = { id: string; name: string; email?: string; grade?: string };

function resolveCurrentStudent(): CurrentStudent {
  if (typeof window === 'undefined') {
    return { id: DEMO_ROSTER[0].id, name: DEMO_ROSTER[0].name, grade: 'Grade 8' };
  }
  try {
    const id = window.localStorage.getItem('eis-student-id');
    const name = window.localStorage.getItem('eis-student-name');
    const email = window.localStorage.getItem('eis-student-email') ?? undefined;
    if (id && name) return { id, name, email, grade: 'Grade 8' };
  } catch {
    /* ignore */
  }
  // Pin a demo roster entry so the page is never empty on first run.
  const demo = DEMO_ROSTER[0];
  return { id: demo.id, name: demo.name, grade: 'Grade 8' };
}

export function StudentProfile({ setActiveTab }: { setActiveTab: (tab: TabType) => void }) {
  const [student, setStudent] = useState<CurrentStudent>(() => ({ id: DEMO_ROSTER[0].id, name: DEMO_ROSTER[0].name, grade: 'Grade 8' }));
  const [events, setEvents] = useState<LearningEvent[]>([]);
  const [studentPickerId, setStudentPickerId] = useState<string | null>(null);
  const [role, setRole] = useState<'teacher' | 'student'>('teacher');
  const [loading, setLoading] = useState(true);

  // Read role + pinned student after mount (avoid hydration mismatch).
  useEffect(() => {
    setStudent(resolveCurrentStudent());
    try {
      const r = window.localStorage.getItem('eis-role');
      if (r === 'student' || r === 'teacher') setRole(r);
    } catch {
      /* ignore */
    }
  }, []);

  // When a teacher is viewing the profile they can browse other students.
  useEffect(() => {
    if (role !== 'teacher') {
      setStudentPickerId(null);
      return;
    }
    if (!studentPickerId) setStudentPickerId(student.id);
  }, [role, student.id, studentPickerId]);

  const effectiveStudent = useMemo<CurrentStudent>(() => {
    if (role === 'teacher' && studentPickerId) {
      const demo = DEMO_ROSTER.find((s) => s.id === studentPickerId);
      if (demo) return { id: demo.id, name: demo.name, grade: 'Grade 8' };
    }
    return student;
  }, [role, studentPickerId, student]);

  // Load events for this student. We deliberately bypass the shared
  // repository here and read directly from the local store. The repository
  // is Firestore-first, and when Firebase is configured offline its getDocs
  // calls hang silently — they never throw, so a try/catch wouldn't help
  // and the page would spin forever. The local store is mirrored on every
  // write (see repository.ts) so it's a complete data source. When it's
  // empty we seed the demo dataset once so the profile has signal on a
  // fresh machine.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        let all = listLocalEvents();
        if (all.length === 0) {
          await seedDemoDataRepository().catch(() => undefined);
          all = listLocalEvents();
        }
        if (cancelled) return;
        setEvents(all.filter((e) => e.studentId === effectiveStudent.id));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [effectiveStudent.id]);

  /* ─── Avatar handling ─────────────────────────────────────────────
   * Persisted per-student in localStorage as a base64 data URL. Capped
   * at ~256KB by client-side downscale so the localStorage quota survives
   * a class of 30 students sharing the same browser profile.
   */
  const avatarKey = `eis-student-avatar-${effectiveStudent.id}`;
  const [avatar, setAvatar] = useState<string | null>(null);
  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(avatarKey);
      setAvatar(stored);
    } catch {
      setAvatar(null);
    }
  }, [avatarKey]);

  const downscaleImage = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = () => reject(reader.error ?? new Error('read failed'));
      reader.onload = () => {
        const img = new Image();
        img.onerror = () => reject(new Error('image decode failed'));
        img.onload = () => {
          const max = 256;
          const ratio = Math.min(1, max / Math.max(img.width, img.height));
          const w = Math.round(img.width * ratio);
          const h = Math.round(img.height * ratio);
          const canvas = document.createElement('canvas');
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext('2d');
          if (!ctx) return reject(new Error('canvas unsupported'));
          ctx.drawImage(img, 0, 0, w, h);
          resolve(canvas.toDataURL('image/jpeg', 0.82));
        };
        img.src = String(reader.result);
      };
      reader.readAsDataURL(file);
    });

  const onAvatarChange = async (file: File) => {
    if (!file || !file.type.startsWith('image/')) {
      alert('Please pick an image file.');
      return;
    }
    try {
      const dataUrl = await downscaleImage(file);
      window.localStorage.setItem(avatarKey, dataUrl);
      setAvatar(dataUrl);
    } catch (err) {
      console.warn('[StudentProfile] avatar upload failed', err);
      alert('Could not save that image. Try a smaller picture.');
    }
  };

  const onAvatarClear = () => {
    try { window.localStorage.removeItem(avatarKey); } catch { /* ignore */ }
    setAvatar(null);
  };

  const analytics = useMemo(() => buildSubjectAnalytics(events, effectiveStudent), [events, effectiveStudent]);
  const overallMastery = useMemo(() => {
    const subjectsWithData = analytics.filter((a) => a.eventCount > 0);
    if (subjectsWithData.length === 0) return 0;
    return Math.round(
      (subjectsWithData.reduce((sum, a) => sum + a.profile.overallMastery, 0) / subjectsWithData.length) * 10,
    ) / 10;
  }, [analytics]);
  const overallEngagement = useMemo(() => {
    const subjectsWithData = analytics.filter((a) => a.eventCount > 0);
    if (subjectsWithData.length === 0) return 0;
    return Math.round(
      subjectsWithData.reduce((sum, a) => sum + a.profile.engagementIndex, 0) / subjectsWithData.length,
    );
  }, [analytics]);
  const overallRisk: StudentMasteryProfile['riskLevel'] =
    overallMastery >= 75 ? 'low' : overallMastery >= 55 ? 'medium' : 'high';

  const strengths = useMemo(() => rollupConcepts(analytics, 'strong'), [analytics]);
  const weaknesses = useMemo(() => rollupConcepts(analytics, 'weak'), [analytics]);
  const recommendations = useMemo(() => buildRecommendations(analytics), [analytics]);

  return (
    <div className="mx-auto max-w-6xl space-y-5">
      <header className="rounded-2xl border border-white/10 bg-gradient-to-br from-sky-500/10 via-fuchsia-500/10 to-emerald-500/10 p-5 backdrop-blur-xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-center gap-4">
            <div className="relative h-20 w-20 shrink-0">
              <label
                htmlFor="eis-avatar-input"
                className="group block h-full w-full cursor-pointer overflow-hidden rounded-2xl border border-white/20 bg-white/10 backdrop-blur-xl"
                title="Change profile picture"
              >
                {avatar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={avatar} alt={`${effectiveStudent.name} avatar`} className="h-full w-full object-cover" />
                ) : (
                  <div className="grid h-full w-full place-items-center">
                    <UserCircle className="h-10 w-10 text-white/80" />
                  </div>
                )}
                <span className="absolute inset-x-0 bottom-0 flex translate-y-full items-center justify-center gap-1 bg-black/60 py-1 text-[9px] font-black uppercase tracking-widest text-white opacity-0 transition group-hover:translate-y-0 group-hover:opacity-100">
                  <Camera className="h-3 w-3" /> Change
                </span>
              </label>
              <input
                id="eis-avatar-input"
                type="file"
                accept="image/*"
                capture="user"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) onAvatarChange(f);
                  e.target.value = '';
                }}
              />
              {avatar && (
                <button
                  type="button"
                  onClick={onAvatarClear}
                  className="absolute -right-1 -top-1 grid h-6 w-6 place-items-center rounded-full border border-white/20 bg-slate-900/90 text-rose-300 shadow-md hover:bg-slate-800"
                  aria-label="Remove profile picture"
                  title="Remove profile picture"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              )}
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/60">Student profile</p>
              <h1 className="mt-0.5 truncate text-2xl font-black text-white sm:text-3xl">{effectiveStudent.name}</h1>
              <p className="mt-1 text-xs text-slate-300">
                {effectiveStudent.grade ?? 'Grade 8 MYP 2'}
                {effectiveStudent.email && <span className="text-slate-400"> · {effectiveStudent.email}</span>}
              </p>
              {!avatar && (
                <label
                  htmlFor="eis-avatar-input"
                  className="mt-2 inline-flex cursor-pointer items-center gap-1 rounded-md border border-white/15 bg-white/10 px-2 py-1 text-[10px] font-black uppercase tracking-widest text-white hover:bg-white/20"
                >
                  <Camera className="h-3 w-3" /> Add photo
                </label>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <RadialGauge value={overallMastery} label="Overall" color="#a5b4fc" />
            <div className="flex flex-col gap-1.5">
              <RiskPill level={overallRisk} />
              <p className="text-[10px] text-white/50">
                Engagement {overallEngagement}% · {events.length} events
              </p>
            </div>
          </div>
        </div>

        {/* Teacher picker — only visible to teachers previewing other students */}
        {role === 'teacher' && (
          <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-white/10 pt-3">
            <p className="text-[10px] font-black uppercase tracking-widest text-white/40">Teacher view · pick student</p>
            <select
              value={studentPickerId ?? effectiveStudent.id}
              onChange={(e) => setStudentPickerId(e.target.value)}
              className="rounded-md border border-white/15 bg-slate-950/70 px-2 py-1 text-xs text-white"
            >
              {DEMO_ROSTER.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>
        )}
      </header>

      {loading ? (
        <div className="grid place-items-center rounded-2xl border border-white/10 bg-white/5 p-12">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#49c8ff] border-t-transparent" />
        </div>
      ) : (
        <>
          {/* Cross-subject roll-ups */}
          <section className="grid gap-3 lg:grid-cols-2">
            <StrengthWeaknessColumn
              title="Strengths · score ≥ 75%"
              icon={Award}
              items={strengths}
              tone="positive"
              emptyCopy="No strong concepts yet — keep practising and they will show up here."
              setActiveTab={setActiveTab}
            />
            <StrengthWeaknessColumn
              title="Weaknesses · score < 60%"
              icon={Target}
              items={weaknesses}
              tone="negative"
              emptyCopy="Nothing flagged below 60%. Excellent work."
              setActiveTab={setActiveTab}
            />
          </section>

          {/* Personalised recommendations */}
          <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur-xl">
            <div className="mb-3 flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-amber-300" />
              <p className="text-[10px] font-black uppercase tracking-widest text-amber-200/90">
                Recommendations to improve your studies
              </p>
            </div>
            {recommendations.length === 0 ? (
              <p className="rounded-md border border-dashed border-white/10 px-3 py-4 text-center text-[11px] text-slate-500">
                No improvement actions queued — keep practising and the AI engine will surface targeted next steps as soon as a pattern emerges.
              </p>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {recommendations.map((rec) => (
                  <RecommendationCard key={rec.id} rec={rec} setActiveTab={setActiveTab} />
                ))}
              </div>
            )}
          </section>

          {/* Per-subject deep dive */}
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4 text-sky-300" />
              <p className="text-[10px] font-black uppercase tracking-widest text-white/60">Subject deep dive</p>
            </div>
            {analytics.map((a) => (
              <SubjectSection key={a.subject.id} analytics={a} setActiveTab={setActiveTab} />
            ))}
          </section>

          {/* Platform mix + recent activity */}
          <section className="grid gap-3 lg:grid-cols-2">
            <PlatformMix events={events} />
            <RecentActivity events={events} />
          </section>
        </>
      )}
    </div>
  );
}
