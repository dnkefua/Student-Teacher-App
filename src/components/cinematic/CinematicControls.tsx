'use client';

import React from 'react';
import { Expand, RotateCcw, UserCog, UserRound } from 'lucide-react';

export function CinematicControls({
  mode,
  onModeChange,
  onReset,
}: {
  mode: 'teacher' | 'student';
  onModeChange: (mode: 'teacher' | 'student') => void;
  onReset: () => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2 rounded-lg border border-white/10 bg-[#061126] p-3">
      <button
        type="button"
        onClick={onReset}
        className="inline-flex items-center gap-2 rounded-md border border-white/10 px-3 py-2 text-xs font-black text-slate-200 transition hover:border-[#49c8ff]/50 hover:text-white"
      >
        <RotateCcw className="h-3.5 w-3.5" />
        Reset
      </button>
      <button
        type="button"
        className="inline-flex items-center gap-2 rounded-md border border-white/10 px-3 py-2 text-xs font-black text-slate-200 transition hover:border-[#49c8ff]/50 hover:text-white"
      >
        <Expand className="h-3.5 w-3.5" />
        Fullscreen
      </button>
      <div className="ml-auto grid grid-cols-2 gap-1 rounded-md border border-white/10 bg-white/[0.03] p-1">
        <button
          type="button"
          onClick={() => onModeChange('teacher')}
          className={`inline-flex items-center justify-center gap-1.5 rounded px-2 py-1.5 text-[11px] font-black ${
            mode === 'teacher' ? 'bg-[#ffc43b] text-[#061126]' : 'text-slate-300 hover:text-white'
          }`}
        >
          <UserCog className="h-3.5 w-3.5" />
          Teacher
        </button>
        <button
          type="button"
          onClick={() => onModeChange('student')}
          className={`inline-flex items-center justify-center gap-1.5 rounded px-2 py-1.5 text-[11px] font-black ${
            mode === 'student' ? 'bg-[#49c8ff] text-[#061126]' : 'text-slate-300 hover:text-white'
          }`}
        >
          <UserRound className="h-3.5 w-3.5" />
          Student
        </button>
      </div>
    </div>
  );
}
