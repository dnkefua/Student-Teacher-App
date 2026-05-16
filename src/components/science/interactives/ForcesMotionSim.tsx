'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Activity, Pause, Play, RotateCcw } from 'lucide-react';
import type { SubjectLesson } from '@/lib/subjects/types';

const TRACK_WIDTH = 460;
const TRACK_HEIGHT = 180;
const BOX_SIZE = 36;
const MAX_X = TRACK_WIDTH - BOX_SIZE - 8;

export function ForcesMotionSim({ lesson: _lesson }: { lesson: SubjectLesson }) {
  void _lesson;
  const [push, setPush] = useState(40);
  const [friction, setFriction] = useState(15);
  const [running, setRunning] = useState(true);
  const [x, setX] = useState(8);
  const [v, setV] = useState(0);
  const lastTickRef = useRef<number>(0);

  const resultant = useMemo(() => {
    if (v > 0.01) return push - friction;
    if (v < -0.01) return push + friction;
    return Math.abs(push) > friction ? push - Math.sign(push) * friction : 0;
  }, [push, friction, v]);

  useEffect(() => {
    if (!running) return;
    let raf = 0;
    const step = (now: number) => {
      const last = lastTickRef.current || now;
      const dt = Math.min(0.05, (now - last) / 1000);
      lastTickRef.current = now;
      const mass = 1;
      const a = resultant / mass / 30;
      setV((prev) => {
        const next = prev + a * dt * 60;
        return Math.max(-200, Math.min(200, next));
      });
      setX((prev) => {
        let next = prev + v * dt;
        if (next > MAX_X) {
          next = MAX_X;
          setV((cur) => -Math.abs(cur) * 0.4);
        } else if (next < 8) {
          next = 8;
          setV((cur) => Math.abs(cur) * 0.4);
        }
        return next;
      });
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [running, resultant, v]);

  const reset = () => {
    setX(8);
    setV(0);
    setPush(40);
    setFriction(15);
  };

  return (
    <div className="flex h-full min-h-[460px] flex-col rounded-lg border border-white/10 bg-gradient-to-br from-[#062019] via-[#06121e] to-[#050711] p-5">
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-md border border-[#34d399]/40 bg-[#34d399]/10 px-2 py-1 text-[10px] font-black uppercase tracking-wide text-[#34d399]">
            <Activity className="h-3 w-3" />
            Forces & Motion Simulator
          </div>
          <p className="mt-2 text-sm font-black text-white">Drag the sliders. Watch the resultant.</p>
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

      <div className="relative mt-3 overflow-hidden rounded-md border border-white/10 bg-[#050711]" style={{ height: TRACK_HEIGHT }}>
        <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-[#34d39922] to-transparent" />
        <div className="absolute inset-x-2 bottom-12 h-px bg-[#34d39955]" />
        <div
          className="absolute bottom-12 grid place-items-center rounded-md border border-[#49c8ff]/60 bg-[#1f78ff]/40 text-xs font-black text-white shadow-[0_0_24px_rgba(73,200,255,.35)] transition-[transform] duration-75"
          style={{ width: BOX_SIZE, height: BOX_SIZE, transform: `translateX(${x}px)` }}
        >
          Box
        </div>
        <div className="absolute right-3 top-3 rounded-md border border-white/10 bg-black/40 px-2 py-1 text-[10px] font-black uppercase tracking-wide text-slate-200">
          v = {v.toFixed(1)} · resultant = {resultant.toFixed(1)} N
        </div>
        {/* Force arrows */}
        <div className="pointer-events-none absolute bottom-12 flex items-center" style={{ transform: `translateX(${x}px)`, height: BOX_SIZE }}>
          {push > 0 && (
            <div
              className="absolute left-full ml-1 flex h-2 items-center"
              style={{ width: Math.min(140, push * 1.4), background: 'linear-gradient(to right, #34d399, transparent)' }}
            >
              <span className="absolute -top-4 left-0 text-[10px] font-black text-[#34d399]">push {push}N →</span>
            </div>
          )}
          {friction > 0 && (
            <div
              className="absolute right-full mr-1 flex h-2 items-center justify-end"
              style={{ width: Math.min(140, friction * 1.4), background: 'linear-gradient(to left, #fb7185, transparent)' }}
            >
              <span className="absolute -bottom-4 right-0 text-[10px] font-black text-[#fb7185]">← friction {friction}N</span>
            </div>
          )}
        </div>
      </div>

      <div className="mt-3 space-y-2">
        <div>
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-300">
            <span>Push force</span>
            <span className="text-[#34d399]">{push} N →</span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            value={push}
            onChange={(e) => setPush(Number(e.target.value))}
            className="mt-1 w-full accent-[#34d399]"
          />
        </div>
        <div>
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-300">
            <span>Friction</span>
            <span className="text-[#fb7185]">← {friction} N</span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            value={friction}
            onChange={(e) => setFriction(Number(e.target.value))}
            className="mt-1 w-full accent-[#fb7185]"
          />
        </div>
      </div>

      <div className="mt-3 rounded-md border border-white/10 bg-white/[.02] p-2.5 text-[11px] leading-5 text-slate-300">
        <span className="font-black text-white">Reading · </span>
        {Math.abs(resultant) < 0.5
          ? 'Forces balanced — constant velocity (or stationary).'
          : resultant > 0
            ? 'Unbalanced to the right — accelerating right.'
            : 'Unbalanced to the left — decelerating or accelerating left.'}
      </div>
    </div>
  );
}
