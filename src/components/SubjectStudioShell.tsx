'use client';

import React, { useState } from 'react';
import Grade8PlatformApp from '@/components/grade8-platform/App';
import type { SubjectId } from '@/components/grade8-platform/types';

type Props = {
  subject: SubjectId;
  label: string;
  children: React.ReactNode;
  /** Forwarded to the Grade8PlatformApp so the Assignments tab knows
   *  whether to render the teacher creator or the student worker. */
  mode?: 'teacher' | 'student';
};

export function SubjectStudioShell({ subject, label, children, mode = 'teacher' }: Props) {
  const [view, setView] = useState<'main' | 'development'>('main');

  return (
    <div className="h-full min-h-0">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
        <div>
          <p className="text-[10px] font-black uppercase tracking-wide text-slate-500">Main subject platform</p>
          <h1 className="text-lg font-black text-slate-950">{label}</h1>
        </div>
        <div className="inline-flex rounded-md border border-slate-200 bg-slate-100 p-1">
          <button
            type="button"
            onClick={() => setView('main')}
            className={`rounded px-3 py-1.5 text-xs font-black transition ${
              view === 'main' ? 'bg-slate-950 text-white shadow-sm' : 'text-slate-600 hover:text-slate-950'
            }`}
          >
            Main
          </button>
          <button
            type="button"
            onClick={() => setView('development')}
            className={`rounded px-3 py-1.5 text-xs font-black transition ${
              view === 'development' ? 'bg-amber-400 text-slate-950 shadow-sm' : 'text-slate-600 hover:text-slate-950'
            }`}
          >
            Under Development
          </button>
        </div>
      </div>

      {view === 'main' ? (
        <div className="h-[calc(100vh-150px)] min-h-[680px] overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
          <Grade8PlatformApp key={subject} initialSubject={subject} mode={mode} />
        </div>
      ) : (
        <div className="rounded-lg border border-amber-300/50 bg-amber-50 p-3">
          <div className="mb-3 rounded-md border border-amber-200 bg-white px-3 py-2">
            <p className="text-xs font-black uppercase tracking-wide text-amber-700">Under Development</p>
            <p className="mt-1 text-sm font-semibold text-slate-700">
              This is the previous studio workspace. It is kept here for testing while the Grade 8 platform is the main experience.
            </p>
          </div>
          {children}
        </div>
      )}
    </div>
  );
}
