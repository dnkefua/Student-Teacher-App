'use client';

// Compact production-status strip surfaced on the dashboard.
// All checks are synchronous so SSR/CSR render the same markup.

import React from 'react';
import { Brain, Cloud, Database, MonitorPlay } from 'lucide-react';
import { isFirebaseConfigured } from '@/lib/firebase/client';
import { DEFAULT_AI_MODEL } from '@/lib/gemini';

type StatusEntry = {
  label: string;
  detail: string;
  ok: boolean;
  icon: React.ComponentType<{ className?: string }>;
};

export function SystemStatusStrip() {
  const firebaseReady = isFirebaseConfigured();

  const entries: StatusEntry[] = [
    {
      label: 'Firestore',
      detail: firebaseReady ? 'europe-west4 · live writes' : 'Demo mode · localStorage',
      ok: firebaseReady,
      icon: Database,
    },
    {
      label: 'Cloud Storage',
      detail: firebaseReady ? 'uploads/{teacherId}/…' : 'Disabled — set Firebase env',
      ok: firebaseReady,
      icon: Cloud,
    },
    {
      label: 'Gemma 4 AI',
      detail: `via /api/* · ${DEFAULT_AI_MODEL}`,
      ok: true,
      icon: Brain,
    },
    {
      label: 'TWA / Play Store',
      detail: 'EIS Maths Studio (private testing)',
      ok: true,
      icon: MonitorPlay,
    },
  ];

  return (
    <section className="rounded-lg border border-white/10 bg-white/5 p-3 backdrop-blur">
      <div className="flex items-center justify-between gap-3">
        <p className="text-[10px] font-black uppercase tracking-wide text-slate-400">Production wiring</p>
        <p className="text-[10px] font-black uppercase tracking-wide text-emerald-300">
          {entries.filter((e) => e.ok).length}/{entries.length} systems online
        </p>
      </div>
      <div className="mt-2 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        {entries.map((entry) => {
          const Icon = entry.icon;
          return (
            <div
              key={entry.label}
              className={`flex items-center gap-3 rounded-md border px-3 py-2 transition ${
                entry.ok
                  ? 'border-emerald-300/25 bg-emerald-300/5'
                  : 'border-[#ffc43b]/30 bg-[#ffc43b]/5'
              }`}
            >
              <Icon className={`h-4 w-4 ${entry.ok ? 'text-emerald-300' : 'text-[#ffe08a]'}`} />
              <div className="min-w-0">
                <p className="text-[11px] font-black uppercase tracking-wide text-slate-200">{entry.label}</p>
                <p className="truncate text-[10px] text-slate-400">{entry.detail}</p>
              </div>
              <span
                className={`ml-auto h-1.5 w-1.5 rounded-full ${
                  entry.ok ? 'bg-emerald-400 shadow-[0_0_8px_rgba(74,222,128,.7)]' : 'bg-[#ffc43b]'
                }`}
              />
            </div>
          );
        })}
      </div>
    </section>
  );
}
