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
      <div className="mb-3 flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white px-4 py-2 shadow-sm">
        <div className="flex min-w-0 items-center gap-3">
          {mode === 'student' && view === 'platform' && (
            <button
              type="button"
              onClick={() => setView('home')}
              className="rounded-md border border-slate-200 px-2 py-1 text-[10px] font-black uppercase tracking-wide text-slate-600 hover:bg-slate-50"
            >
              ← Home
            </button>
          )}
          <div className="min-w-0">
            <p className="text-[10px] font-black uppercase tracking-wide text-slate-500">EIS Learning Studio</p>
            <h1 className="truncate text-base font-black text-slate-950">{label}</h1>
          </div>
        </div>
        <span className="shrink-0 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-emerald-700">
          {mode === 'teacher' ? 'Teacher view' : 'Student view'}
        </span>
      </div>

      <div className="h-[calc(100vh-130px)] min-h-[680px] overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
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
