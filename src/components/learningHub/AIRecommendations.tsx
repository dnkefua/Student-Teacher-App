'use client';

import { useMemo } from 'react';
import { ArrowRight, ParkingMeter, Sparkles, Wand2 } from 'lucide-react';
import type { AIRecommendation, LearningEvent } from '@/lib/learningHub/types';
import {
  generateRecommendationsForClass,
  generateRecommendationsForStudent,
} from '@/lib/learningHub/aiInsights';
import { calculateClassMastery, calculateStudentMastery } from '@/lib/learningHub/mastery';
import { demoClasses } from '@/lib/learningHub/demoData';
import type { TabType } from '@/components/Sidebar';
import { threeDLabels } from '@/lib/grade8Curriculum';

type Props = {
  events: LearningEvent[];
  mode: 'teacher' | 'student';
  /** Optional student scope when running in student mode. */
  studentId?: string;
  setActiveTab?: (tab: TabType) => void;
};

const PRIORITY_STYLES: Record<AIRecommendation['priority'], string> = {
  high: 'border-[#ff3d22]/30 bg-[#ff3d22]/10 text-[#ff8a73]',
  medium: 'border-[#ffc43b]/30 bg-[#ffc43b]/10 text-[#ffe08a]',
  low: 'border-[#49c8ff]/30 bg-[#49c8ff]/10 text-[#8ddfff]',
};

export function AIRecommendations({ events, mode, studentId, setActiveTab }: Props) {
  const recs: AIRecommendation[] = useMemo(() => {
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

  if (recs.length === 0) {
    return (
      <section className="rounded-lg border border-emerald-300/30 bg-emerald-300/10 p-4 text-sm leading-6 text-emerald-100">
        No interventions needed right now. Mastery, engagement and platform comparison all look healthy.
      </section>
    );
  }

  return (
    <section className="space-y-3">
      <p className="text-[11px] uppercase tracking-wide text-slate-400 inline-flex items-center gap-2">
        <Sparkles className="h-3.5 w-3.5 text-[#ffc43b]" />
        Deterministic, evidence-based recommendations. Gemma 4 augmentation can be enabled via the API route in a follow-up.
      </p>
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
                <ParkingMeter className="h-3 w-3" />
                Action · {r.suggestedAction}
              </p>
            </div>

            <div className="flex flex-col gap-2">
              {r.suggestedThreeDType && setActiveTab ? (
                <button
                  onClick={() => setActiveTab('lesson')}
                  className="inline-flex items-center gap-2 rounded-md bg-[#49c8ff] px-3 py-1.5 text-xs font-black text-[#061126] transition hover:bg-[#8ddfff]"
                >
                  <Wand2 className="h-3.5 w-3.5" />
                  Open 3D lesson
                </button>
              ) : null}
              {setActiveTab ? (
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className="inline-flex items-center gap-2 rounded-md border border-white/15 px-3 py-1.5 text-xs font-black text-slate-200 transition hover:border-white/35"
                >
                  Assign intervention
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              ) : null}
            </div>
          </div>
        </article>
      ))}
    </section>
  );
}
