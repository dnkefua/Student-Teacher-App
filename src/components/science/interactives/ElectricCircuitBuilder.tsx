'use client';

import React, { useMemo, useState } from 'react';
import { Battery, Lightbulb, RotateCcw, Zap } from 'lucide-react';
import type { SubjectLesson } from '@/lib/subjects/types';

type Mode = 'series' | 'parallel';

export function ElectricCircuitBuilder({ lesson: _lesson }: { lesson: SubjectLesson }) {
  void _lesson;
  const [mode, setMode] = useState<Mode>('series');
  const [bulbs, setBulbs] = useState(2);
  const [voltage, setVoltage] = useState(6);
  const [broken, setBroken] = useState<Set<number>>(new Set());

  const RESISTANCE_PER_BULB = 3;

  const { totalResistance, current, brightnessPerBulb, circuitDead } = useMemo(() => {
    if (mode === 'series') {
      const allBroken = broken.size === bulbs;
      const anyBroken = broken.size > 0;
      const R = bulbs * RESISTANCE_PER_BULB;
      const I = anyBroken ? 0 : voltage / R;
      return {
        totalResistance: R,
        current: I,
        brightnessPerBulb: anyBroken ? 0 : I,
        circuitDead: allBroken || anyBroken,
      };
    }
    const liveCount = bulbs - broken.size;
    if (liveCount === 0) return { totalResistance: Infinity, current: 0, brightnessPerBulb: 0, circuitDead: true };
    const R = RESISTANCE_PER_BULB / liveCount;
    const I = voltage / R;
    return { totalResistance: R, current: I, brightnessPerBulb: voltage / RESISTANCE_PER_BULB, circuitDead: false };
  }, [bulbs, mode, voltage, broken]);

  const toggleBreak = (i: number) => {
    setBroken((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  };

  const reset = () => {
    setMode('series');
    setBulbs(2);
    setVoltage(6);
    setBroken(new Set());
  };

  const bulbBrightness = (i: number) => {
    if (broken.has(i)) return 0;
    if (mode === 'series') return circuitDead ? 0 : brightnessPerBulb;
    return brightnessPerBulb;
  };

  return (
    <div className="flex h-full min-h-[460px] flex-col rounded-lg border border-white/10 bg-gradient-to-br from-[#062019] via-[#06121e] to-[#050711] p-5">
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-md border border-[#34d399]/40 bg-[#34d399]/10 px-2 py-1 text-[10px] font-black uppercase tracking-wide text-[#34d399]">
            <Zap className="h-3 w-3" />
            Circuit Builder
          </div>
          <p className="mt-2 text-sm font-black text-white">{mode === 'series' ? 'Series circuit' : 'Parallel circuit'}</p>
          <p className="text-[11px] text-slate-400">Click any bulb to break it.</p>
        </div>
        <button
          onClick={reset}
          className="inline-flex items-center gap-1 rounded-md border border-white/15 px-2 py-1 text-[10px] font-black uppercase tracking-wide text-slate-300 transition hover:border-white/40 hover:text-white"
        >
          <RotateCcw className="h-3 w-3" />
          Reset
        </button>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-1.5">
        {(['series', 'parallel'] as const).map((m) => {
          const active = mode === m;
          return (
            <button
              key={m}
              onClick={() => {
                setMode(m);
                setBroken(new Set());
              }}
              className="rounded-md border px-2 py-1.5 text-xs font-black uppercase tracking-wide transition"
              style={{
                borderColor: active ? '#34d399' : 'rgba(255,255,255,.15)',
                background: active ? '#34d39922' : 'transparent',
                color: active ? '#34d399' : '#cbd5e1',
              }}
            >
              {m === 'series' ? 'Series' : 'Parallel'}
            </button>
          );
        })}
      </div>

      <div className="relative mt-3 h-44 rounded-md border border-white/10 bg-[#050711] p-3">
        <div className="flex items-center gap-2">
          <Battery className="h-6 w-6 text-[#ffc43b]" />
          <span className="text-[11px] font-black uppercase tracking-wide text-[#ffc43b]">{voltage} V</span>
        </div>
        <div
          className={`mt-2 grid gap-2 ${mode === 'parallel' ? 'grid-cols-1' : ''}`}
          style={mode === 'series' ? { display: 'flex', alignItems: 'center', gap: 8 } : undefined}
        >
          {Array.from({ length: bulbs }).map((_, i) => {
            const b = bulbBrightness(i);
            const lit = b > 0.05;
            const isBroken = broken.has(i);
            return (
              <button
                key={i}
                onClick={() => toggleBreak(i)}
                className="flex items-center gap-2 rounded-md border px-2 py-1.5 text-left transition"
                style={{
                  borderColor: lit ? '#ffc43b' : 'rgba(255,255,255,.18)',
                  background: lit ? `rgba(255,196,59,${Math.min(0.35, b * 0.15)})` : 'rgba(255,255,255,.03)',
                  boxShadow: lit ? `0 0 ${Math.min(30, b * 12)}px rgba(255,196,59,.45)` : 'none',
                  opacity: isBroken ? 0.45 : 1,
                }}
              >
                <Lightbulb
                  className="h-5 w-5"
                  style={{ color: lit ? '#ffc43b' : '#475569' }}
                />
                <span className="text-[11px] font-bold text-white">
                  Bulb {i + 1}
                  {isBroken && ' (broken)'}
                </span>
              </button>
            );
          })}
        </div>
        {circuitDead && mode === 'series' && (
          <p className="absolute bottom-2 right-3 rounded-md bg-[#fb7185]/20 px-2 py-1 text-[10px] font-black uppercase tracking-wide text-[#fb7185]">
            Circuit broken
          </p>
        )}
      </div>

      <div className="mt-3 space-y-2">
        <div>
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-300">
            <span>Bulbs</span>
            <span className="text-[#34d399]">{bulbs}</span>
          </div>
          <input
            type="range"
            min={1}
            max={4}
            value={bulbs}
            onChange={(e) => {
              setBulbs(Number(e.target.value));
              setBroken(new Set());
            }}
            className="mt-1 w-full accent-[#34d399]"
          />
        </div>
        <div>
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-300">
            <span>Battery voltage</span>
            <span className="text-[#ffc43b]">{voltage} V</span>
          </div>
          <input
            type="range"
            min={1.5}
            max={12}
            step={0.5}
            value={voltage}
            onChange={(e) => setVoltage(Number(e.target.value))}
            className="mt-1 w-full accent-[#ffc43b]"
          />
        </div>
      </div>

      <div className="mt-3 grid grid-cols-3 gap-1.5 text-center">
        <div className="rounded-md border border-white/10 bg-white/[.02] p-1.5">
          <p className="text-[10px] font-black uppercase tracking-wide text-slate-400">V</p>
          <p className="text-sm font-black text-white">{voltage.toFixed(1)} V</p>
        </div>
        <div className="rounded-md border border-white/10 bg-white/[.02] p-1.5">
          <p className="text-[10px] font-black uppercase tracking-wide text-slate-400">I</p>
          <p className="text-sm font-black text-white">{current.toFixed(2)} A</p>
        </div>
        <div className="rounded-md border border-white/10 bg-white/[.02] p-1.5">
          <p className="text-[10px] font-black uppercase tracking-wide text-slate-400">R total</p>
          <p className="text-sm font-black text-white">{Number.isFinite(totalResistance) ? totalResistance.toFixed(1) : '∞'} Ω</p>
        </div>
      </div>
    </div>
  );
}
