'use client';

import React from 'react';
import { ArrowRight, Beaker, Compass, Feather, School } from 'lucide-react';
import type { TabType } from './Sidebar';
import { subjectRegistry } from '@/lib/subjects/subjectRegistry';
import type { SubjectId } from '@/lib/subjects/types';
import { grade8Curriculum } from '@/lib/grade8Curriculum';
import { year8EnglishLessons, year8EnglishUnits } from '@/lib/subjects/english/year8EnglishCurriculum';
import { year8ScienceLessons, year8ScienceUnits } from '@/lib/subjects/science/year8ScienceCurriculum';

type IconComponent = React.ComponentType<React.SVGProps<SVGSVGElement>>;

type SubjectTile = {
  id: SubjectId;
  icon: IconComponent;
  units: number;
  lessons: number;
  highlight: string;
  tab: TabType;
};

const TILES: SubjectTile[] = [
  {
    id: 'mathematics',
    icon: School,
    units: 4,
    lessons: grade8Curriculum.length,
    highlight: '10 interactive 3D explainers — equations, ratios, geometry, probability, data.',
    tab: 'eis-maths',
  },
  {
    id: 'english',
    icon: Feather,
    units: year8EnglishUnits.length,
    lessons: year8EnglishLessons.length,
    highlight: 'Advertising, novel, poetry, documentary film and Shakespeare with annotation + PETAL workshops.',
    tab: 'english-studio',
  },
  {
    id: 'science',
    icon: Beaker,
    units: year8ScienceUnits.length,
    lessons: year8ScienceLessons.length,
    highlight: 'Particle model 3D, cell explorer, force diagrams and series-parallel circuits.',
    tab: 'science-studio',
  },
];

interface Props {
  setActiveTab: (tab: TabType) => void;
}

export function SubjectQuickPicker({ setActiveTab }: Props) {
  return (
    <section className="rounded-lg border border-white/10 bg-white/5 p-4 backdrop-blur">
      <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
        <div>
          <p className="text-[10px] font-black uppercase tracking-wide text-[#ffc43b]">
            <Compass className="-mt-px mr-1 inline-block h-3 w-3" />
            Subjects on the platform
          </p>
          <h2 className="mt-1 text-lg font-black text-white">Pick a subject to teach today</h2>
        </div>
        <p className="text-[11px] font-bold text-slate-400">
          Three subjects · {grade8Curriculum.length + year8EnglishLessons.length + year8ScienceLessons.length}{' '}
          lessons across Year 8
        </p>
      </div>

      <div className="grid gap-2 sm:grid-cols-3">
        {TILES.map((tile) => {
          const reg = subjectRegistry[tile.id];
          const Icon = tile.icon;
          return (
            <button
              key={tile.id}
              onClick={() => setActiveTab(tile.tab)}
              className="group flex flex-col gap-2 rounded-lg border p-3 text-left transition hover:border-white/30"
              style={{
                borderColor: `${reg.theme.primary}33`,
                background: `linear-gradient(140deg, ${reg.theme.primary}10, rgba(255,255,255,.02))`,
              }}
            >
              <div className="flex items-center justify-between">
                <span
                  className="grid h-9 w-9 place-items-center rounded-md"
                  style={{ background: `${reg.theme.primary}22`, color: reg.theme.primary }}
                >
                  <Icon className="h-4 w-4" />
                </span>
                <span
                  className="rounded-full border px-2 py-0.5 text-[10px] font-black uppercase tracking-wide"
                  style={{ borderColor: `${reg.theme.primary}55`, color: reg.theme.primary }}
                >
                  {reg.label}
                </span>
              </div>
              <p className="text-sm font-black text-white">{reg.studioLabel}</p>
              <p className="line-clamp-2 text-[11px] leading-5 text-slate-300">{tile.highlight}</p>
              <div className="mt-auto flex items-center justify-between pt-1">
                <span className="text-[10px] font-bold text-slate-400">
                  {tile.units} units · {tile.lessons} lessons
                </span>
                <span
                  className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wide transition group-hover:translate-x-0.5"
                  style={{ color: reg.theme.primary }}
                >
                  Open studio
                  <ArrowRight className="h-3 w-3" />
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
