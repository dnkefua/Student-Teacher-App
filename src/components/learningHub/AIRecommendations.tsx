'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { ArrowRight, Loader2, Mail, MonitorPlay, Send, Sparkles, Wand2, X } from 'lucide-react';
import type { AIRecommendation, LearningEvent } from '@/lib/learningHub/types';
import {
  generateRecommendationsForClass,
  generateRecommendationsForStudent,
} from '@/lib/learningHub/aiInsights';
import { calculateClassMastery, calculateStudentMastery } from '@/lib/learningHub/mastery';
import { demoClasses } from '@/lib/learningHub/demoData';
import type { TabType } from '@/components/Sidebar';
import { threeDLabels } from '@/lib/grade8Curriculum';
import {
  assignInterventionFromRecommendation,
  dismissRecommendation,
  draftParentUpdateFromRecommendation,
  openThreeDLessonFromRecommendation,
  sendRecommendationToClassroom,
} from '@/lib/learningHub/recommendationActions';

type Props = {
  events: LearningEvent[];
  mode: 'teacher' | 'student';
  studentId?: string;
  setActiveTab?: (tab: TabType) => void;
};

type Source = 'deterministic' | 'ai';

const PRIORITY_STYLES: Record<AIRecommendation['priority'], string> = {
  high: 'border-[#ff3d22]/30 bg-[#ff3d22]/10 text-[#ff8a73]',
  medium: 'border-[#ffc43b]/30 bg-[#ffc43b]/10 text-[#ffe08a]',
  low: 'border-[#49c8ff]/30 bg-[#49c8ff]/10 text-[#8ddfff]',
};

export function AIRecommendations({ events, mode, studentId, setActiveTab }: Props) {
  const deterministic = useMemo<AIRecommendation[]>(() => {
    if (mode === 'student' && studentId) {
      const profile = calculateStudentMastery(events, { id: studentId, name: studentId });
      return generateRecommendationsForStudent(profile, events);
    }
    const all: AIRecommendation[] = [];
    for (const cls of demoClasses()) {
      const profile = calculateClassMastery(events, {
        classId: cls.classId,
        className: cls.className,
        grade: 'Grade 8',
        studentIds: cls.studentIds,
        studentNames: cls.studentNames,
      });
      const studentProfiles = cls.studentIds.map((sid) =>
        calculateStudentMastery(events, { id: sid, name: cls.studentNames[sid] ?? sid }),
      );
      all.push(...generateRecommendationsForClass(profile, events, studentProfiles));
    }
    return all.sort((a, b) => (a.priority === b.priority ? 0 : a.priority === 'high' ? -1 : 1)).slice(0, 12);
  }, [events, mode, studentId]);

  const [recs, setRecs] = useState<AIRecommendation[]>(deterministic);
  const [source, setSource] = useState<Source>('deterministic');
  const [loadingAi, setLoadingAi] = useState(false);
  const [busyRec, setBusyRec] = useState<string | null>(null);

  // Keep recs in sync when the underlying deterministic output changes (e.g.
  // teacher seeded demo data or confirmed a mapping).
  useEffect(() => {
    setRecs(deterministic);
    setSource('deterministic');
  }, [deterministic]);

  const askAi = useCallback(async () => {
    if (loadingAi || deterministic.length === 0) return;
    setLoadingAi(true);
    try {
      const res = await fetch('/api/learning-hub/recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: mode === 'student' ? 'student' : 'class',
          events: events.slice(0, 200),
          classProfile:
            mode === 'teacher' && events.length > 0
              ? calculateClassMastery(events, {
                  classId: demoClasses()[0]?.classId ?? 'class-grade8a',
                  className: demoClasses()[0]?.className ?? 'Demo class',
                  grade: 'Grade 8',
                  studentIds: demoClasses()[0]?.studentIds ?? [],
                  studentNames: demoClasses()[0]?.studentNames ?? {},
                })
              : undefined,
          studentProfile:
            mode === 'student' && studentId
              ? calculateStudentMastery(events, { id: studentId, name: studentId })
              : undefined,
        }),
      });
      if (!res.ok) return;
      const json = (await res.json()) as { recommendations: AIRecommendation[]; source: Source };
      if (Array.isArray(json.recommendations) && json.recommendations.length > 0) {
        setRecs(json.recommendations);
        setSource(json.source);
      }
    } catch (err) {
      console.warn('[ai-recommendations] enrichment failed; keeping deterministic output.', err);
    } finally {
      setLoadingAi(false);
    }
  }, [events, mode, studentId, loadingAi, deterministic.length]);

  const handle = async (rec: AIRecommendation, intent: 'assign' | 'lesson' | 'classroom' | 'email' | 'dismiss') => {
    if (busyRec) return;
    setBusyRec(rec.id);
    try {
      if (intent === 'dismiss') {
        await dismissRecommendation(rec);
        setRecs((prev) => prev.filter((r) => r.id !== rec.id));
        return;
      }
      const result =
        intent === 'assign'
          ? await assignInterventionFromRecommendation(rec)
          : intent === 'lesson'
          ? await openThreeDLessonFromRecommendation(rec)
          : intent === 'classroom'
          ? await sendRecommendationToClassroom(rec)
          : await draftParentUpdateFromRecommendation(rec);
      setActiveTab?.(result.target);
    } finally {
      setBusyRec(null);
    }
  };

  if (recs.length === 0) {
    return (
      <section className="rounded-lg border border-emerald-300/30 bg-emerald-300/10 p-4 text-sm leading-6 text-emerald-100">
        No interventions needed right now. Mastery, engagement and platform comparison all look healthy.
      </section>
    );
  }

  return (
    <section className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-[11px] uppercase tracking-wide text-slate-400 inline-flex items-center gap-2">
          <Sparkles className="h-3.5 w-3.5 text-[#ffc43b]" />
          {source === 'ai' ? 'Gemma 4 enrichment · evidence-based' : 'Deterministic engine · evidence-based'}
        </p>
        {mode === 'teacher' ? (
          <button
            onClick={() => void askAi()}
            disabled={loadingAi}
            className="inline-flex items-center gap-2 rounded-md border border-white/15 px-3 py-1.5 text-xs font-black text-slate-200 transition hover:border-[#49c8ff] hover:text-[#8ddfff] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loadingAi ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Wand2 className="h-3.5 w-3.5" />}
            {loadingAi ? 'Asking Gemma 4…' : 'Generate AI recommendations'}
          </button>
        ) : null}
      </div>
      {recs.map((r) => (
        <article key={r.id} className="rounded-lg border border-white/10 bg-[#050711]/70 p-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className={`rounded-full border px-2 py-0.5 text-[10px] font-black uppercase tracking-wide ${PRIORITY_STYLES[r.priority]}`}>
                  {r.priority}
                </span>
                <span className="rounded-full border border-white/15 bg-white/5 px-2 py-0.5 text-[10px] font-black uppercase tracking-wide text-slate-300">
                  {r.type.replace(/_/g, ' ')}
                </span>
                {r.suggestedThreeDType ? (
                  <span className="rounded-full border border-[#49c8ff]/30 bg-[#49c8ff]/10 px-2 py-0.5 text-[10px] font-black uppercase tracking-wide text-[#8ddfff]">
                    3D · {threeDLabels[r.suggestedThreeDType]}
                  </span>
                ) : null}
              </div>
              <p className="mt-2 text-sm font-black text-white">{r.title}</p>
              <p className="mt-1 text-xs leading-5 text-slate-300">{r.explanation}</p>

              {r.evidence.length > 0 ? (
                <ul className="mt-3 grid gap-1 sm:grid-cols-2">
                  {r.evidence.map((line, i) => (
                    <li key={i} className="rounded-md border border-white/10 bg-white/[0.03] px-2 py-1 text-[11px] text-slate-200">
                      {line}
                    </li>
                  ))}
                </ul>
              ) : null}

              <p className="mt-3 inline-flex items-center gap-2 rounded-md border border-emerald-300/25 bg-emerald-300/5 px-3 py-1.5 text-[11px] font-semibold text-emerald-100">
                Action · {r.suggestedAction}
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <button
                onClick={() => void handle(r, 'assign')}
                disabled={busyRec === r.id}
                className="inline-flex items-center gap-2 rounded-md bg-[#ffc43b] px-3 py-1.5 text-xs font-black text-[#061126] transition hover:bg-[#ffe08a] disabled:opacity-60"
              >
                <Send className="h-3.5 w-3.5" />
                Assign intervention
              </button>
              <button
                onClick={() => void handle(r, 'lesson')}
                disabled={busyRec === r.id}
                className="inline-flex items-center gap-2 rounded-md bg-[#49c8ff] px-3 py-1.5 text-xs font-black text-[#061126] transition hover:bg-[#8ddfff] disabled:opacity-60"
              >
                <Wand2 className="h-3.5 w-3.5" />
                Open 3D lesson
              </button>
              {mode === 'teacher' ? (
                <>
                  <button
                    onClick={() => void handle(r, 'classroom')}
                    disabled={busyRec === r.id}
                    className="inline-flex items-center gap-2 rounded-md border border-white/15 px-3 py-1.5 text-xs font-black text-slate-200 transition hover:border-[#49c8ff] hover:text-[#8ddfff]"
                  >
                    <MonitorPlay className="h-3.5 w-3.5" />
                    Send to classroom
                  </button>
                  <button
                    onClick={() => void handle(r, 'email')}
                    disabled={busyRec === r.id}
                    className="inline-flex items-center gap-2 rounded-md border border-white/15 px-3 py-1.5 text-xs font-black text-slate-200 transition hover:border-[#ffc43b] hover:text-[#ffe08a]"
                  >
                    <Mail className="h-3.5 w-3.5" />
                    Draft parent update
                  </button>
                </>
              ) : null}
              <button
                onClick={() => void handle(r, 'dismiss')}
                disabled={busyRec === r.id}
                className="inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-xs font-black text-slate-400 transition hover:text-white"
              >
                <X className="h-3.5 w-3.5" />
                Dismiss
              </button>
              {busyRec === r.id ? (
                <span className="inline-flex items-center gap-1 text-[10px] text-slate-400">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  Routing…
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[10px] text-slate-500">
                  Audit-logged on action <ArrowRight className="h-3 w-3" />
                </span>
              )}
            </div>
          </div>
        </article>
      ))}
    </section>
  );
}
