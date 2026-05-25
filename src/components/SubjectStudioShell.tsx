'use client';

import React, { useState } from 'react';
import Grade8PlatformApp from '@/components/grade8-platform/App';
import { StudentSubjectHome } from '@/components/StudentSubjectHome';
import type { SubjectId, TabType } from '@/components/grade8-platform/types';

/**
 * Thin wrapper around the grade8 platform.
 *
 * In teacher mode it goes straight to the full platform.
 * In student mode it lands on the focused StudentSubjectHome by default
 * and only opens the full platform when the student clicks one of the
 * deeper "Lessons / Practice / Assets / Assignments" pills.
 */
type Props = {
  subject: SubjectId;
  /** Subject heading shown above the platform. */
  label: string;
  /** Drives the Assignments tab and the student-home gating. */
  mode?: 'teacher' | 'student';
  /** Kept for callers that still pass legacy children — intentionally ignored. */
  children?: React.ReactNode;
};

export function SubjectStudioShell({ subject, label, mode = 'teacher' }: Props) {
  // For students, default to the focused home; teachers go straight to the
  // full platform. The `tab` state carries the deep-link target when the
  // student clicks through to lessons / assignments / etc.
  const [view, setView] = useState<'home' | 'platform'>(mode === 'student' ? 'home' : 'platform');
  const [tab, setTab] = useState<TabType>('overview');

  return (
    <div className="h-full min-h-0">
      <div className="mb-3 flex items-center justify-between gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 shadow-sm sm:px-4">
        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          {mode === 'student' && view === 'platform' && (
            <button
              type="button"
              onClick={() => setView('home')}
              className="shrink-0 rounded-md border border-slate-200 px-2 py-1 text-[10px] font-black uppercase tracking-wide text-slate-600 hover:bg-slate-50"
            >
              ← Home
            </button>
          )}
          <div className="min-w-0">
            <p className="hidden text-[10px] font-black uppercase tracking-wide text-slate-500 sm:block">
              EIS Learning Studio
            </p>
            <h1 className="truncate text-sm font-black text-slate-950 sm:text-base">{label}</h1>
          </div>
        </div>
        <span className="shrink-0 rounded-full bg-emerald-100 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-emerald-700 sm:px-2.5 sm:text-[10px]">
          {mode === 'teacher' ? 'Teacher' : 'Student'}
          <span className="hidden sm:inline"> view</span>
        </span>
      </div>

      {/* Use dynamic viewport height (dvh) so mobile browser chrome doesn't
          double-clip the platform area. Falls back gracefully where dvh isn't
          supported via the calc() fallback. */}
      <div className="h-[calc(100dvh-110px)] min-h-[560px] overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm sm:h-[calc(100dvh-130px)] sm:min-h-[680px]">
        {mode === 'student' && view === 'home' ? (
          <StudentSubjectHome
            subject={subject}
            onBrowse={(target) => {
              setTab(target);
              setView('platform');
            }}
          />
        ) : (
          <Grade8PlatformApp
            key={`${subject}-${view}-${tab}`}
            initialSubject={subject}
            initialTab={tab}
            mode={mode}
          />
        )}
      </div>
    </div>
  );
}
