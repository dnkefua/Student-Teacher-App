'use client';

import React, { useMemo, useState } from 'react';
import { Flame, RotateCcw, Zap } from 'lucide-react';
import type { SubjectLesson } from '@/lib/subjects/types';

type Source = { id: string; name: string; useful: number; wasted: number; color: string };

const SOURCES: Source[] = [
  { id: 'bulb-incandescent', name: 'Incandescent bulb', useful: 5, wasted: 95, color: '#ffc43b' },
  { id: 'bulb-led', name: 'LED bulb', useful: 80, wasted: 20, color: '#34d399' },
  { id: 'petrol-car', name: 'Petrol car', useful: 25, wasted: 75, color: '#fb7185' },
  { id: 'wind-turbine', name: 'Wind turbine', useful: 40, wasted: 60, color: '#22d3ee' },
  { id: 'solar-panel', name: 'Solar panel', useful: 20, wasted: 80, color: '#fdba74' },
];

export function EnergyTransferSim({ lesson: _lesson }: { lesson: SubjectLesson }) {
  void _lesson;
  const [source, setSource] = useState<Source>(SOURCES[0]);
  const [inputJ, setInputJ] = useState(100);

  const useful = useMemo(() => Math.round((inputJ * source.useful) / 100), [inputJ, source]);
  const wasted = inputJ - useful;
  const efficiency = source.useful;

  const reset = () => {
    setSource(SOURCES[0]);
    setInputJ(100);
  };

  return (
    <div className="flex h-full min-h-[460px] flex-col rounded-lg border border-white/10 bg-gradient-to-br from-[#062019] via-[#06121e] to-[#050711] p-5">
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-md border border-[#34d399]/40 bg-[#34d399]/10 px-2 py-1 text-[10px] font-black uppercase tracking-wide text-[#34d399]">
            <Zap className="h-3 w-3" />
            Energy Transfer Simulator
          </div>
          <p className="mt-2 text-sm font-black text-white">Sankey-style flow · useful vs wasted</p>
          <p className="text-[11px] text-slate-400">Compare devices and watch energy split.</p>
        </div>
        <button
          onClick={reset}
          className="inline-flex items-center gap-1 rounded-md border border-white/15 px-2 py-1 text-[10px] font-black uppercase tracking-wide text-slate-300 transition hover:border-white/40 hover:text-white"
        >
          <RotateCcw className="h-3 w-3" />
          Reset
        </button>
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {SOURCES.map((s) => {
          const active = source.id === s.id;
          return (
            <button
              key={s.id}
              onClick={() => setSource(s)}
              className="rounded-md border px-2 py-1 text-[11px] font-black uppercase tracking-wide transition"
              style={{
                borderColor: active ? s.color : 'rgba(255,255,255,.15)',
                background: active ? `${s.color}22` : 'transparent',
                color: active ? s.color : '#cbd5e1',
              }}
            >
              {s.name}
            </button>
          );
        })}
      </div>

      <div className="mt-3">
        <div className="flex items-center justify-between text-[11px] font-bold text-slate-300">
          <span>Input energy</span>
          <span style={{ color: source.color }}>{inputJ} J</span>
        </div>
        <input
          type="range"
          min={10}
          max={500}
          value={inputJ}
          onChange={(e) => setInputJ(Number(e.target.value))}
          className="mt-1 w-full"
          style={{ accentColor: source.color }}
        />
      </div>

      <svg viewBox="0 0 320 120" className="mt-3 h-36 w-full rounded-md border border-white/10 bg-[#050711]">
        {/* Input bar */}
        <rect x={10} y={50} width={70} height={20} fill={source.color} opacity={0.9} />
        <text x={45} y={45} textAnchor="middle" fontSize={9} fontWeight="bold" fill="#ffffff">{inputJ} J</text>
        {/* Useful flow */}
        <path
          d={`M80,55 C140,55 140,${30 - useful / 8} 200,${30 - useful / 8} L280,${30 - useful / 8} L280,${30 - useful / 8 + 18} L200,${30 - useful / 8 + 18} C140,${30 - useful / 8 + 18} 140,73 80,73 Z`}
          fill="#34d399"
          opacity={0.75}
        />
        <text x={285} y={36 - useful / 8} fontSize={9} fontWeight="bold" fill="#34d399">Useful {useful} J</text>
        {/* Wasted flow */}
        <path
          d={`M80,65 C140,65 140,${90 + wasted / 16} 200,${90 + wasted / 16} L280,${90 + wasted / 16} L280,${90 + wasted / 16 + 14} L200,${90 + wasted / 16 + 14} C140,${90 + wasted / 16 + 14} 140,79 80,79 Z`}
          fill="#fb7185"
          opacity={0.7}
        />
        <text x={285} y={100 + wasted / 16} fontSize={9} fontWeight="bold" fill="#fb7185">Wasted {wasted} J</text>
      </svg>

      <div className="mt-3 grid grid-cols-3 gap-2">
        <Stat label="Input" value={`${inputJ} J`} color="#cbd5e1" />
        <Stat label="Useful" value={`${useful} J`} color="#34d399" />
        <Stat label="Efficiency" value={`${efficiency}%`} color={source.color} />
      </div>

      <p className="mt-3 inline-flex items-center gap-1 rounded-md border border-white/10 bg-white/[.02] px-3 py-2 text-[11px] font-bold text-slate-300">
        <Flame className="h-3 w-3 text-[#fb7185]" />
        Wasted energy almost always ends up as heat to the surroundings.
      </p>
    </div>
  );
}

function Stat({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="rounded-md border border-white/10 bg-white/[.02] p-2 text-center">
      <p className="text-[10px] font-black uppercase tracking-wide text-slate-400">{label}</p>
      <p className="mt-1 text-sm font-black" style={{ color }}>
        {value}
      </p>
    </div>
  );
}
