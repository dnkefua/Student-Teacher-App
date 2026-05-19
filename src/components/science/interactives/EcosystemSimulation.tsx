'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Pause, Play, RotateCcw, Trees } from 'lucide-react';
import type { SubjectLesson } from '@/lib/subjects/types';

type Pop = { plants: number; rabbits: number; foxes: number };

const START: Pop = { plants: 200, rabbits: 60, foxes: 10 };
const FOOD_WEB = [
  { label: 'Grass', role: 'Producer', color: '#34d399' },
  { label: 'Seeds', role: 'Producer', color: '#86efac' },
  { label: 'Rabbit', role: 'Primary consumer', color: '#fdba74' },
  { label: 'Mouse', role: 'Primary consumer', color: '#fcd34d' },
  { label: 'Fox', role: 'Secondary consumer', color: '#fb7185' },
  { label: 'Eagle', role: 'Top predator', color: '#93c5fd' },
  { label: 'Fungi', role: 'Decomposer', color: '#c084fc' },
];

function step(p: Pop, params: { sun: number; hunting: number }): Pop {
  const plantGrowth = 0.18 * params.sun;
  const rabbitEatRate = 0.005;
  const rabbitGrowth = 0.45;
  const foxEatRate = 0.012;
  const foxGrowth = 0.25;
  const foxDie = 0.4;

  const newPlants = Math.max(0, p.plants + plantGrowth * p.plants - rabbitEatRate * p.plants * p.rabbits);
  const newRabbits = Math.max(
    0,
    p.rabbits + rabbitGrowth * rabbitEatRate * p.plants * p.rabbits - foxEatRate * p.rabbits * p.foxes - params.hunting * 0.01 * p.rabbits,
  );
  const newFoxes = Math.max(
    0,
    p.foxes + foxGrowth * foxEatRate * p.rabbits * p.foxes - foxDie * p.foxes / Math.max(1, p.rabbits),
  );
  return {
    plants: Math.min(1000, newPlants),
    rabbits: Math.min(500, newRabbits),
    foxes: Math.min(120, newFoxes),
  };
}

export function EcosystemSimulation({ lesson: _lesson }: { lesson: SubjectLesson }) {
  void _lesson;
  const [pop, setPop] = useState<Pop>(START);
  const [running, setRunning] = useState(true);
  const [sun, setSun] = useState(1);
  const [hunting, setHunting] = useState(0);
  const [history, setHistory] = useState<Pop[]>([]);
  const lastTickRef = useRef(0);

  useEffect(() => {
    if (!running) return;
    let raf = 0;
    const tick = (t: number) => {
      if (t - lastTickRef.current > 200) {
        lastTickRef.current = t;
        setPop((p) => {
          const next = step(p, { sun, hunting });
          setHistory((h) => [...h.slice(-59), next]);
          return next;
        });
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [running, sun, hunting]);

  const reset = () => {
    setPop(START);
    setHistory([]);
    setSun(1);
    setHunting(0);
  };

  return (
    <div className="flex h-full min-h-[460px] flex-col rounded-lg border border-white/10 bg-gradient-to-br from-[#062019] via-[#06121e] to-[#050711] p-5">
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-md border border-[#34d399]/40 bg-[#34d399]/10 px-2 py-1 text-[10px] font-black uppercase tracking-wide text-[#34d399]">
            <Trees className="h-3 w-3" />
            Ecosystem Simulation
          </div>
          <p className="mt-2 text-sm font-black text-white">Plants → Rabbits → Foxes</p>
          <p className="text-[11px] text-slate-400">Lotka–Volterra style predator–prey loop.</p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <button
            onClick={() => setRunning((r) => !r)}
            className="inline-flex items-center gap-1 rounded-md border border-white/15 px-2 py-1 text-[10px] font-black uppercase tracking-wide text-slate-300 transition hover:border-white/40 hover:text-white"
          >
            {running ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
            {running ? 'Pause' : 'Play'}
          </button>
          <button
            onClick={reset}
            className="inline-flex items-center gap-1 rounded-md border border-white/15 px-2 py-1 text-[10px] font-black uppercase tracking-wide text-slate-300 transition hover:border-white/40 hover:text-white"
          >
            <RotateCcw className="h-3 w-3" />
            Reset
          </button>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-3 gap-2">
        <Stat label="Plants" value={pop.plants} color="#34d399" />
        <Stat label="Rabbits" value={pop.rabbits} color="#fdba74" />
        <Stat label="Foxes" value={pop.foxes} color="#fb7185" />
      </div>

      <div className="mt-3 rounded-md border border-white/10 bg-[#050711] p-3">
        <p className="text-[10px] font-black uppercase tracking-wide text-[#34d399]">Interactive food web</p>
        <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {FOOD_WEB.map((organism) => (
            <div
              key={organism.label}
              className="rounded-md border p-2"
              style={{ borderColor: `${organism.color}55`, background: `${organism.color}10` }}
            >
              <p className="text-xs font-black text-white">{organism.label}</p>
              <p className="mt-0.5 text-[10px] font-bold uppercase tracking-wide" style={{ color: organism.color }}>
                {organism.role}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-3 grid gap-2 text-[11px] font-bold text-slate-300 sm:grid-cols-3">
          <span className="rounded-md bg-white/[0.04] p-2">Grass - Rabbit - Fox</span>
          <span className="rounded-md bg-white/[0.04] p-2">Seeds - Mouse - Eagle</span>
          <span className="rounded-md bg-white/[0.04] p-2">Dead matter - Fungi - soil nutrients</span>
        </div>
      </div>

      <svg viewBox="0 0 240 80" className="mt-3 h-32 w-full rounded-md border border-white/10 bg-[#050711]">
        {(['plants', 'rabbits', 'foxes'] as const).map((key) => {
          const color = key === 'plants' ? '#34d399' : key === 'rabbits' ? '#fdba74' : '#fb7185';
          const max = key === 'plants' ? 1000 : key === 'rabbits' ? 500 : 120;
          const pts = history.map((h, i) => `${(i / 60) * 240},${80 - (h[key] / max) * 76}`).join(' ');
          return <polyline key={key} fill="none" stroke={color} strokeWidth={1.4} points={pts} />;
        })}
      </svg>

      <div className="mt-3 space-y-2">
        <Slider label="Sunlight (plant growth)" value={sun} min={0} max={2} step={0.1} onChange={setSun} accent="#34d399" suffix="×" />
        <Slider label="Hunting pressure on rabbits" value={hunting} min={0} max={1} step={0.05} onChange={setHunting} accent="#fb7185" suffix="" />
      </div>
    </div>
  );
}

function Stat({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div
      className="rounded-md border p-2 text-center"
      style={{ borderColor: `${color}55`, background: `${color}10` }}
    >
      <p className="text-[10px] font-black uppercase tracking-wide" style={{ color }}>
        {label}
      </p>
      <p className="mt-1 text-lg font-black text-white">{Math.round(value)}</p>
    </div>
  );
}

function Slider({
  label, value, min, max, step, onChange, accent, suffix,
}: { label: string; value: number; min: number; max: number; step: number; onChange: (v: number) => void; accent: string; suffix: string }) {
  return (
    <div>
      <div className="flex items-center justify-between text-[11px] font-bold text-slate-300">
        <span>{label}</span>
        <span style={{ color: accent }}>{value.toFixed(2)}{suffix}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-1 w-full"
        style={{ accentColor: accent }}
      />
    </div>
  );
}
