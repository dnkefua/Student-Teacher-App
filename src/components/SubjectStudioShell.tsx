'use client';

import React from 'react';
import Grade8PlatformApp from '@/components/grade8-platform/App';
import type { SubjectId } from '@/components/grade8-platform/types';

/**
 * Thin wrapper around the Grade 8 platform. Earlier versions of this
 * shell also offered an "Under Development" toggle that fell back to the
 * legacy studios; once parity was reached (McDonald's ad lab, Science
 * subtopic depth, student-assignment flow) the toggle was removed so the
 * platform shows only the canonical surface. Legacy components are still
 * on disk for incidental references but are no longer reachable from
 * here.
 */
type Props = {
  subject: SubjectId;
  /** Subject heading shown above the platform. */
  label: string;
  /** Drives the Assignments tab: teachers create, students complete. */
  mode?: 'teacher' | 'student';
  /** Kept for callers that still pass legacy children — intentionally ignored. */
  children?: React.ReactNode;
};

export function SubjectStudioShell({ subject, label, mode = 'teacher' }: Props) {
  return (
    <div className="h-full min-h-0">
      <div className="mb-3 flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white px-4 py-2 shadow-sm">
        <div className="min-w-0">
          <p className="text-[10px] font-black uppercase tracking-wide text-slate-500">EIS Learning Studio</p>
          <h1 className="truncate text-base font-black text-slate-950">{label}</h1>
        </div>
        <span className="shrink-0 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-emerald-700">
          {mode === 'teacher' ? 'Teacher view' : 'Student view'}
        </span>
      </div>

      <div className="h-[calc(100vh-130px)] min-h-[680px] overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        <Grade8PlatformApp key={subject} initialSubject={subject} mode={mode} />
      </div>
    </div>
  );
}
