'use client';

import React from 'react';
import {
  BarChart3,
  Beaker,
  Clapperboard,
  Feather,
  School,
  Video,
} from 'lucide-react';

type Pillar = {
  id: string;
  label: string;
  arrow: string;
  detail: string;
  icon: React.ComponentType<{ className?: string }>;
  accent: string;
};

const pillars: Pillar[] = [
  { id: 'maths', label: 'Maths', arrow: '3D concept mastery', detail: 'Interactive 3D explainers for ratios, place value, area, algebra and more.', icon: School, accent: '#49c8ff' },
  { id: 'science', label: 'Science', arrow: 'Simulations & virtual labs', detail: 'Spin a cell, model particles, build circuits, balance forces.', icon: Beaker, accent: '#8df0c0' },
  { id: 'english', label: 'English', arrow: 'Annotation & writing workshops', detail: 'PETAL essay planner, poetry devices, grammar builder, text annotation.', icon: Feather, accent: '#ffc43b' },
  { id: 'cinematic', label: 'Cinematic Studio', arrow: 'Reusable lesson engine', detail: 'Generate a CinematicLessonSpec and preview the app-rendered scene.', icon: Clapperboard, accent: '#ff8a3d' },
  { id: 'hub', label: 'Learning Data Hub', arrow: 'Analytics & recommendations', detail: 'Teacher-only mastery, evidence imports and AI-powered next-step nudges.', icon: BarChart3, accent: '#c8a8ff' },
  { id: 'studio-video', label: 'Studio Video', arrow: 'Cinematic lesson clips', detail: 'Short lesson videos wrapped around the interactive lesson.', icon: Video, accent: '#ff3d72' },
];

export function PlatformDirectionCard({ compact = false }: { compact?: boolean }) {
  return (
    <section className="rounded-lg border border-white/10 bg-[#061126]/80 p-5 text-white backdrop-blur">
      <div className="flex items-end justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase tracking-widest text-[#ffc43b]">Platform direction</p>
          <h2 className={compact ? 'mt-1 text-lg font-black' : 'mt-1 text-xl font-black sm:text-2xl'}>
            One EIS Learning Studio. Six clear layers.
          </h2>
          {!compact && (
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-300">
              Interactive lessons, simulations, writing workshops, cinematic explainers, and unified learning intelligence.
            </p>
          )}
        </div>
      </div>

      <div className={`mt-4 grid gap-3 ${compact ? 'sm:grid-cols-2 lg:grid-cols-3' : 'sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6'}`}>
        {pillars.map((pillar) => {
          const Icon = pillar.icon;
          return (
            <article
              key={pillar.id}
              className="relative overflow-hidden rounded-md border border-white/10 bg-white/[0.03] p-4 transition hover:border-white/25 hover:bg-white/[0.06]"
            >
              <div
                className="pointer-events-none absolute -right-6 -top-6 h-16 w-16 rounded-full opacity-30 blur-2xl"
                style={{ background: pillar.accent }}
              />
              <div className="relative flex items-center gap-2">
                <span
                  className="grid h-8 w-8 place-items-center rounded-md"
                  style={{ background: `${pillar.accent}22`, color: pillar.accent }}
                >
                  <Icon className="h-4 w-4" />
                </span>
                <p className="text-sm font-black text-white">{pillar.label}</p>
              </div>
              <p className="relative mt-2 text-[11px] font-black uppercase tracking-wide" style={{ color: pillar.accent }}>
                → {pillar.arrow}
              </p>
              {!compact && (
                <p className="relative mt-2 text-xs leading-5 text-slate-300">{pillar.detail}</p>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}
