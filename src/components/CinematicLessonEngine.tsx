'use client';

import React, { useEffect, useMemo, useState } from 'react';
import {
  Award,
  Box,
  CheckCircle2,
  Clipboard,
  Film,
  Pause,
  Play,
  RotateCcw,
  Sparkles,
  Volume2,
  Wand2,
  XCircle,
} from 'lucide-react';
import {
  defaultPlaceValueGeneratorInput,
  ExamQuestionWalkthrough,
  generateLessonAssetPackage,
  LessonGeneratorInput,
  LessonVideoAssetPackage,
  QuizQuestion,
  Scene,
} from '@/lib/lessonEngine';
import { VisualResearchBlueprint } from '@/lib/mathVisualResearch';

function lessonProgress(scenes: Scene[], activeSceneIndex: number, progress: number) {
  const elapsed = scenes.slice(0, activeSceneIndex).reduce((sum, scene) => sum + scene.durationSeconds, 0);
  const total = scenes.reduce((sum, scene) => sum + scene.durationSeconds, 0);
  return Math.min(100, ((elapsed + progress * scenes[activeSceneIndex].durationSeconds) / total) * 100);
}

export function MotionGraphicsLayer({ progress, accent = '#38bdf8' }: { progress: number; accent?: string }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.05)_1px,transparent_1px)] bg-[size:42px_42px]" />
      <div className="absolute left-[12%] top-[12%] h-48 w-48 rounded-full blur-3xl motion-safe:animate-pulse" style={{ background: `${accent}33` }} />
      <div className="absolute right-[8%] top-[18%] h-40 w-40 rounded-full bg-amber-300/20 blur-3xl motion-safe:animate-pulse" />
      {Array.from({ length: 18 }, (_, index) => (
        <span
          key={index}
          className="absolute h-1.5 w-1.5 rounded-full bg-white/60 motion-safe:animate-bounce"
          style={{
            left: `${(index * 29 + progress * 22) % 100}%`,
            top: `${(index * 17 + progress * 9) % 100}%`,
            animationDelay: `${index * 70}ms`,
          }}
        />
      ))}
    </div>
  );
}

function PlaceValueVisual({ scene, progress }: { scene: Scene; progress: number }) {
  const t = progress;
  const numberDigits = scene.id.includes('7305') || scene.id.includes('zero') ? ['7', '3', '0', '5'] : ['5', '4', '8', '2'];
  const places = ['Thousands', 'Hundreds', 'Tens', 'Ones'];
  const colors = ['#38bdf8', '#facc15', '#34d399', '#fb7185'];

  if (scene.id.includes('tower')) {
    return (
      <div className="grid h-full min-h-[420px] place-items-center p-4">
        <div className="grid w-full max-w-4xl gap-3 md:grid-cols-4">
          {places.map((place, index) => (
            <div key={place} className="relative min-h-72 overflow-hidden rounded-lg border border-white/10 bg-white/10 p-4">
              <div className="absolute inset-x-0 bottom-0 transition-all duration-500" style={{ height: `${25 + index * 17 + t * 12}%`, background: `linear-gradient(180deg, ${colors[index]}22, ${colors[index]}99)` }} />
              <div className="relative z-10 flex h-full flex-col justify-between">
                <p className="text-xs font-bold uppercase tracking-wide text-slate-300">Floor {index + 1}</p>
                <div className="text-center">
                  <p className="text-5xl font-black" style={{ color: colors[index] }}>{numberDigits[index]}</p>
                  <p className="mt-2 font-bold text-white">{place}</p>
                </div>
                <p className="text-center font-mono text-sm text-amber-100">x {10 ** (3 - index)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (scene.id.includes('base-ten') || scene.id.includes('5482') || scene.id.includes('7305')) {
    const counts = scene.id.includes('7305') ? [7, 3, 0, 5] : scene.id.includes('base-ten') ? [1, 1, 1, 1] : [5, 4, 8, 2];
    return (
      <div className="grid min-h-[420px] gap-4 p-4 md:grid-cols-4">
        {places.map((place, placeIndex) => (
          <div key={place} className="rounded-lg border border-white/10 bg-slate-950/75 p-4">
            <p className="text-center text-xs font-bold uppercase tracking-wide text-slate-400">{place}</p>
            <div className="mt-5 grid min-h-64 place-items-center">
              <div className="grid grid-cols-3 gap-1.5" style={{ transform: 'rotateX(58deg) rotateZ(-28deg)', transformStyle: 'preserve-3d' }}>
                {Array.from({ length: Math.max(1, counts[placeIndex]) }, (_, index) => (
                  <span
                    key={index}
                    className={`${placeIndex === 0 ? 'h-14 w-14' : placeIndex === 1 ? 'h-12 w-12' : placeIndex === 2 ? 'h-8 w-14' : 'h-8 w-8'} rounded-sm border border-white/20 shadow-[7px_7px_0_rgba(15,23,42,.75)] transition-transform duration-300`}
                    style={{ background: colors[placeIndex], opacity: counts[placeIndex] === 0 ? 0.18 : 1, transform: `translateZ(${(index % 5) * 6 + t * 14}px)` }}
                  />
                ))}
              </div>
            </div>
            <p className="text-center font-black text-white">{counts[placeIndex]} x {10 ** (3 - placeIndex)}</p>
          </div>
        ))}
      </div>
    );
  }

  if (scene.id.includes('digit-power')) {
    const index = Math.min(3, Math.floor(t * 4));
    const values = [5, 50, 500, 5000];
    return (
      <div className="grid min-h-[420px] place-items-center p-6">
        <div className="w-full max-w-4xl">
          <div className="grid grid-cols-4 gap-3">
            {places.slice().reverse().map((place, placeIndex) => {
              const active = placeIndex === index;
              return (
                <div key={place} className={`rounded-lg border p-5 text-center transition ${active ? 'border-cyan-200 bg-cyan-200 text-slate-950 scale-105' : 'border-white/10 bg-white/10 text-white'}`}>
                  <p className="text-xs font-bold uppercase tracking-wide">{place}</p>
                  <p className="mt-4 text-6xl font-black">{active ? '5' : ''}</p>
                </div>
              );
            })}
          </div>
          <div className="mt-8 rounded-lg bg-white p-6 text-center text-5xl font-black text-slate-950">{values[index]}</div>
        </div>
      </div>
    );
  }

  if (scene.id.includes('zero')) {
    const removed = t > 0.5;
    return (
      <div className="grid min-h-[420px] place-items-center p-6">
        <div className="w-full max-w-4xl rounded-lg border border-white/10 bg-white/10 p-6">
          <div className="grid grid-cols-4 gap-3">
            {numberDigits.map((digit, index) => (
              <div key={`${digit}-${index}`} className={`rounded-lg border p-5 text-center transition duration-500 ${digit === '0' ? 'border-amber-200 bg-amber-200/10' : 'border-white/10 bg-slate-950'} ${removed && digit === '0' ? 'scale-50 opacity-0' : 'scale-100 opacity-100'}`}>
                <p className="text-6xl font-black text-white">{removed && digit === '0' ? '' : digit}</p>
                <p className="mt-2 text-xs font-bold uppercase tracking-wide text-slate-400">{places[index]}</p>
              </div>
            ))}
          </div>
          <p className="mt-6 rounded-lg bg-white p-5 text-center text-6xl font-black text-slate-950 transition">{removed ? '735' : '7,305'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid min-h-[420px] place-items-center p-6">
      <div className="text-center">
        <p className="text-7xl font-black text-white">5,482</p>
        <p className="mt-4 text-xl text-slate-200">{scene.visualDescription}</p>
      </div>
    </div>
  );
}

function RationalNumberVisual({ scene, progress }: { scene: Scene; progress: number }) {
  const t = progress;
  const markerX = scene.id.includes('integers')
    ? 320 + (t < 0.5 ? t * 2 * 185 : 185 - (t - 0.5) * 2 * 300)
    : scene.id.includes('example')
      ? 190 + Math.sin(t * Math.PI * 1.25) * 225
      : 320;

  if (scene.id.includes('decimal-grid')) {
    const shaded = Math.max(1, Math.round(45 * t));
    return (
      <div className="grid min-h-[420px] gap-5 p-5 lg:grid-cols-[1fr_0.8fr]">
        <div className="rounded-lg border border-white/10 bg-slate-950/80 p-5">
          <p className="mb-4 text-center text-sm font-bold uppercase tracking-wide text-cyan-200">Hundredths grid</p>
          <div className="mx-auto grid max-w-sm grid-cols-10 gap-1 rounded-lg bg-white/5 p-3">
            {Array.from({ length: 100 }, (_, index) => (
              <span
                key={index}
                className="aspect-square rounded-sm transition-colors duration-300"
                style={{ background: index < shaded ? '#38bdf8' : 'rgba(255,255,255,.12)' }}
              />
            ))}
          </div>
          <div className="mt-5 rounded-lg bg-white p-4 text-center text-2xl font-black text-slate-950">
            {shaded}/100 = {(shaded / 100).toFixed(2)}
          </div>
        </div>
        <div className="rounded-lg border border-white/10 bg-slate-950/80 p-5">
          <p className="mb-4 text-center text-sm font-bold uppercase tracking-wide text-amber-200">Tenths become hundredths</p>
          <div className="space-y-3">
            {Array.from({ length: 10 }, (_, row) => (
              <div key={row} className="h-7 overflow-hidden rounded-full bg-white/10">
                <div className="h-full rounded-full transition-all duration-300" style={{ width: `${Math.max(0, Math.min(100, (t * 10 - row) * 100))}%`, background: row < 4 ? '#facc15' : '#38bdf8' }} />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (scene.id.includes('fraction-strips')) {
    const stripSets = [
      { label: '1 whole', parts: 1, active: 1 },
      { label: 'halves', parts: 2, active: 1 },
      { label: 'quarters', parts: 4, active: 2 },
      { label: 'eighths', parts: 8, active: 4 },
      { label: 'tenths', parts: 10, active: 5 },
    ];
    return (
      <div className="grid min-h-[420px] content-center gap-4 p-6">
        {stripSets.map((strip, stripIndex) => (
          <div key={strip.label} className="grid grid-cols-[90px_1fr] items-center gap-4">
            <p className="text-right text-xs font-bold uppercase tracking-wide text-slate-300">{strip.label}</p>
            <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${strip.parts}, minmax(0, 1fr))` }}>
              {Array.from({ length: strip.parts }, (_, index) => (
                <span
                  key={index}
                  className="grid h-12 place-items-center rounded-md border border-white/15 text-xs font-black text-slate-950 transition-transform duration-300"
                  style={{
                    background: index < strip.active ? (stripIndex % 2 ? '#38bdf8' : '#facc15') : 'rgba(255,255,255,.12)',
                    transform: index < strip.active && t > stripIndex * 0.15 ? 'translateY(-5px)' : 'translateY(0)',
                  }}
                >
                  {index < strip.active ? '' : ''}
                </span>
              ))}
            </div>
          </div>
        ))}
        <div className="rounded-lg bg-white p-4 text-center text-2xl font-black text-slate-950">1/2 = 2/4 = 4/8 = 5/10 = 0.5</div>
      </div>
    );
  }

  if (scene.id.includes('conversion-lab')) {
    return (
      <div className="grid min-h-[420px] content-center gap-6 p-6">
        <div className="rounded-lg border border-white/10 bg-slate-950/80 p-5">
          <NumberLine markerX={250} label="-1.5 = -3/2 = -1 1/2" />
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          {['-1.5', '-3/2', '-1 1/2'].map((label, index) => (
            <div key={label} className="rounded-lg border border-white/10 bg-white p-4 text-center text-3xl font-black text-slate-950 transition-transform duration-300" style={{ transform: `translateY(${t > index * 0.22 ? -8 : 0}px)` }}>
              {label}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (scene.id.includes('quiz')) {
    return (
      <div className="grid min-h-[420px] place-items-center p-6">
        <div className="grid w-full max-w-4xl gap-4 md:grid-cols-3">
          {['Place it', 'Convert it', 'Calculate it'].map((label, index) => (
            <div key={label} className="rounded-lg border border-white/10 bg-white/10 p-6 text-center transition-transform duration-300" style={{ transform: `translateY(${Math.sin((t + index * 0.2) * Math.PI * 2) * -8}px)` }}>
              <p className="text-5xl font-black text-cyan-200">{index + 1}</p>
              <p className="mt-3 text-xl font-black text-white">{label}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="grid min-h-[420px] content-center gap-5 p-5">
      <div className="rounded-lg border border-white/10 bg-slate-950/80 p-5">
        <NumberLine markerX={markerX} label={scene.id.includes('example') ? '-7 + 12 - 9 lands at -4' : 'integers, decimals and fractions share one line'} />
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-white/10 bg-white/10 p-5">
          <p className="text-xs font-bold uppercase tracking-wide text-cyan-200">Integer</p>
          <p className="mt-2 text-4xl font-black text-white">-3</p>
          <p className="mt-2 text-sm text-slate-300">3 spaces left of zero</p>
        </div>
        <div className="rounded-lg border border-white/10 bg-white/10 p-5">
          <p className="text-xs font-bold uppercase tracking-wide text-amber-200">Decimal</p>
          <p className="mt-2 text-4xl font-black text-white">0.45</p>
          <p className="mt-2 text-sm text-slate-300">45 hundredths shaded</p>
        </div>
        <div className="rounded-lg border border-white/10 bg-white/10 p-5">
          <p className="text-xs font-bold uppercase tracking-wide text-emerald-200">Fraction</p>
          <p className="mt-2 text-4xl font-black text-white">1/2</p>
          <p className="mt-2 text-sm text-slate-300">equal parts of a whole</p>
        </div>
      </div>
    </div>
  );
}

function BlueprintVisual({ blueprint, scene, progress }: { blueprint: VisualResearchBlueprint; scene: Scene; progress: number }) {
  const mode = blueprint.animation;
  const pulse = Math.sin(progress * Math.PI * 2);

  if (mode === 'percentage-bars') {
    const percent = Math.max(8, Math.round(progress * 100));
    return (
      <div className="grid min-h-[420px] gap-3 p-5">
        <div className="rounded-lg border border-white/10 bg-slate-950/80 p-5">
          <p className="mb-4 text-center text-sm font-bold uppercase tracking-wide text-cyan-200">{blueprint.diagrams[0]}</p>
          <div className="mx-auto grid max-w-sm grid-cols-10 gap-1 rounded-lg bg-white/5 p-3">
            {Array.from({ length: 100 }, (_, index) => (
              <span key={index} className="aspect-square rounded-sm" style={{ background: index < percent ? '#38bdf8' : 'rgba(255,255,255,.12)' }} />
            ))}
          </div>
          <div className="mt-5 h-9 overflow-hidden rounded-full bg-white/10">
            <div className="h-full rounded-full bg-gradient-to-r from-cyan-300 to-amber-200 transition-all" style={{ width: `${percent}%` }} />
          </div>
        </div>
        <CalloutPanel blueprint={blueprint} scene={scene} />
      </div>
    );
  }

  if (mode === 'ratio-mixer') {
    return (
      <div className="grid min-h-[420px] gap-3 p-5">
        <div className="grid grid-cols-[2fr_5fr] gap-4">
          {[['2 parts', '#38bdf8'], ['5 parts', '#facc15']].map(([label, color], index) => (
            <div key={label} className="relative overflow-hidden rounded-lg border border-white/10 bg-slate-950/80 p-4">
              <div className="absolute inset-x-4 bottom-12 rounded-md transition-all" style={{ height: `${30 + progress * (index ? 58 : 42)}%`, background: color }} />
              <p className="absolute bottom-4 left-0 right-0 text-center font-black text-white">{label}</p>
            </div>
          ))}
        </div>
        <CalloutPanel blueprint={blueprint} scene={scene} />
      </div>
    );
  }

  if (mode === 'algebra-tiles') {
    return (
      <div className="grid min-h-[420px] gap-3 p-5">
        <div className="rounded-lg border border-white/10 bg-slate-950/80 p-5">
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3].map((term) => (
              <div key={term} className="rounded-lg bg-white/5 p-4">
                <p className="text-xs font-bold uppercase tracking-wide text-slate-400">Term {term}</p>
                <div className="mt-4 flex min-h-44 flex-wrap content-end gap-2">
                  {Array.from({ length: term * 2 + 1 }, (_, index) => (
                    <span key={index} className="grid h-10 w-10 place-items-center rounded-md font-black text-slate-950 transition-transform" style={{ background: index < term ? '#38bdf8' : '#facc15', transform: `translateY(${pulse * -5}px)` }}>
                      {index < term ? 'x' : '1'}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        <CalloutPanel blueprint={blueprint} scene={scene} />
      </div>
    );
  }

  if (mode === 'equation-balance') {
    return (
      <div className="grid min-h-[420px] gap-3 p-5">
        <EquationStoryboardVisual progress={progress} />
        <CalloutPanel blueprint={blueprint} scene={scene} />
      </div>
    );
  }

  if (mode === 'coordinate-grid' || mode === 'data-lab') {
    const x = 95 + progress * 410;
    const y = mode === 'data-lab' ? 270 - Math.abs(pulse) * 160 : 275 - progress * 205;
    return (
      <div className="grid min-h-[420px] gap-3 p-5">
        <svg className="h-full min-h-96 rounded-lg bg-slate-950/80" viewBox="0 0 640 380">
          {Array.from({ length: 10 }, (_, index) => <path key={`v-${index}`} d={`M${90 + index * 45} 45V300`} stroke="rgba(255,255,255,.09)" />)}
          {Array.from({ length: 7 }, (_, index) => <path key={`h-${index}`} d={`M70 ${70 + index * 35}H560`} stroke="rgba(255,255,255,.09)" />)}
          <path d="M70 300H570M90 320V45" stroke="rgba(255,255,255,.65)" strokeWidth="5" strokeLinecap="round" />
          <path d={mode === 'data-lab' ? 'M120 270H150V210H180V250H210V160H240V235H270V120H300' : 'M95 275L505 70'} stroke="#38bdf8" strokeWidth="8" fill="none" strokeLinecap="round" />
          <circle cx={x} cy={y} r="14" fill="#facc15" />
          <text x="135" y="45" fill="white" fontSize="22" fontWeight="900">{blueprint.diagrams[0]}</text>
        </svg>
        <CalloutPanel blueprint={blueprint} scene={scene} />
      </div>
    );
  }

  if (mode === 'angle-lab' || mode === 'construction-compass') {
    const angle = 25 + progress * 125;
    const rad = (Math.PI / 180) * angle;
    return (
      <div className="grid min-h-[420px] gap-3 p-5">
        <svg className="h-full min-h-96 rounded-lg bg-slate-950/80" viewBox="0 0 640 380">
          <path d="M170 280H540" stroke="rgba(255,255,255,.72)" strokeWidth="7" strokeLinecap="round" />
          <path d={`M170 280L${170 + Math.cos(-rad) * 280} ${280 + Math.sin(-rad) * 280}`} stroke="#38bdf8" strokeWidth="8" strokeLinecap="round" />
          <path d={`M235 280 A65 65 0 0 1 ${170 + Math.cos(-rad) * 65} ${280 + Math.sin(-rad) * 65}`} fill="none" stroke="#facc15" strokeWidth="12" strokeLinecap="round" />
          <path d="M90 90H540M90 155H540" stroke="rgba(255,255,255,.24)" strokeWidth="5" strokeLinecap="round" />
          <text x="260" y="250" fill="#fde68a" fontSize="26" fontWeight="900">{Math.round(angle)} degrees</text>
        </svg>
        <CalloutPanel blueprint={blueprint} scene={scene} />
      </div>
    );
  }

  if (mode === 'circle-lab' || mode === 'probability-spinner') {
    return (
      <div className="grid min-h-[420px] gap-3 p-5">
        <div className="relative grid place-items-center rounded-lg border border-white/10 bg-slate-950/80 p-5">
          <div className="relative h-64 w-64 rounded-full border-[14px] border-white/10 shadow-2xl" style={{ background: `conic-gradient(#38bdf8 0 ${100 + progress * 80}deg, #facc15 ${100 + progress * 80}deg 250deg, #34d399 250deg 360deg)`, transform: `rotate(${progress * 220}deg) rotateX(45deg)` }}>
            <div className="absolute inset-16 rounded-full bg-slate-950" />
            <div className="absolute left-1/2 top-1/2 h-1.5 w-32 origin-left rounded-full bg-white" />
          </div>
          <div className="mt-6 h-7 w-full overflow-hidden rounded-full bg-white/10">
            <div className="h-full rounded-full bg-gradient-to-r from-cyan-300 to-amber-200" style={{ width: `${35 + progress * 55}%` }} />
          </div>
        </div>
        <CalloutPanel blueprint={blueprint} scene={scene} />
      </div>
    );
  }

  if (mode === 'solid-builder') {
    return (
      <div className="grid min-h-[420px] gap-3 p-5">
        <div className="relative overflow-hidden rounded-lg border border-white/10 bg-slate-950/80 p-6 [perspective:900px]">
          <div className="absolute left-1/2 top-1/2 h-28 w-28 -translate-x-1/2 -translate-y-1/2" style={{ transformStyle: 'preserve-3d', transform: 'rotateX(58deg) rotateZ(-35deg)' }}>
            {['front', 'back', 'left', 'right', 'top', 'base'].map((face, index) => (
              <div key={face} className="absolute grid h-28 w-28 place-items-center rounded-md border border-white/20 text-xs font-black uppercase tracking-wide text-white transition-transform" style={{ background: index % 2 ? '#facc1599' : '#38bdf899', transform: `rotateY(${index * 35 * progress}deg) translateZ(${40 + index * 3}px)` }}>
                {face}
              </div>
            ))}
          </div>
        </div>
        <CalloutPanel blueprint={blueprint} scene={scene} />
      </div>
    );
  }

  return (
    <div className="grid min-h-[420px] gap-3 p-5">
      <div className="rounded-lg border border-white/10 bg-slate-950/80 p-5">
        <NumberLine markerX={95 + progress * 410} label={blueprint.diagrams[0]} />
      </div>
      <CalloutPanel blueprint={blueprint} scene={scene} />
    </div>
  );
}

function CalloutPanel({ blueprint, scene }: { blueprint: VisualResearchBlueprint; scene: Scene }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/8 px-4 py-3 text-white backdrop-blur">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-wide text-cyan-200">Visual teaching cues</p>
          <p className="mt-1 truncate text-sm font-semibold text-slate-200">{scene.title}: {blueprint.researchBasis[0]}</p>
        </div>
        <div className="grid gap-2 sm:grid-cols-3 xl:w-[48%]">
          {[blueprint.diagrams[0], blueprint.interactions[0], blueprint.teacherMoves[0]].map((item) => (
            <div key={item} className="truncate rounded-md bg-white/10 px-3 py-2 text-xs font-bold text-slate-100">
              {item}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function NumberLine({ markerX, label }: { markerX: number; label: string }) {
  return (
    <svg className="h-72 w-full" viewBox="0 0 640 300" role="img" aria-label="Rational number line visual">
      <path d="M70 150H570" stroke="rgba(255,255,255,.72)" strokeWidth="6" strokeLinecap="round" />
      {Array.from({ length: 11 }, (_, index) => {
        const x = 90 + index * 46;
        return (
          <g key={index}>
            <path d={`M${x} 128V172`} stroke="rgba(255,255,255,.5)" strokeWidth="3" />
            <text x={x - 9} y="205" fill="rgba(255,255,255,.8)" fontSize="17" fontWeight="800">{index - 5}</text>
          </g>
        );
      })}
      {Array.from({ length: 10 }, (_, index) => {
        const x = 113 + index * 46;
        return <path key={index} d={`M${x} 140V160`} stroke="rgba(250,204,21,.65)" strokeWidth="2" />;
      })}
      <path d="M320 108V190" stroke="#38bdf8" strokeWidth="5" strokeLinecap="round" />
      <text x="309" y="96" fill="#67e8f9" fontSize="18" fontWeight="900">0</text>
      <circle cx={markerX} cy="150" r="16" fill="#facc15" style={{ transition: 'cx .3s ease' }} />
      <path d={`M320 116H${markerX}`} stroke="#facc15" strokeWidth="8" strokeLinecap="round" opacity=".75" />
      <text x="120" y="55" fill="white" fontSize="22" fontWeight="900">{label}</text>
    </svg>
  );
}

function ConceptStoryboardVisual({ blueprint, progress }: { blueprint: VisualResearchBlueprint; progress: number }) {
  const step = Math.min(3, Math.floor(progress * 4));
  const active = (index: number) => step >= index;
  const mode = blueprint.animation;

  if (mode === 'number-line') {
    return <NumberLineJumpIllustration activeStep={step} visualAction="Subtract 5 by jumping left from 2." workingLines={['Start at 2', 'Move 5 spaces left', 'Land on -3', '2 - 5 = -3']} />;
  }

  if (mode === 'percentage-bars') {
    return (
      <div className="rounded-lg border border-white/10 bg-slate-950 p-4">
        <PercentageFractionDemo activeStep={step} />
      </div>
    );
  }

  if (mode === 'ratio-mixer') {
    return <RatioSharingIllustration activeStep={step} workingLines={['Total parts: 5 + 4 = 9', 'One part: 72 / 9 = 8', 'Shares: 5 x 8 and 4 x 8', 'Answer: 40 AED and 32 AED']} />;
  }

  if (mode === 'equation-balance') {
    return <EquationStoryboardVisual activeStep={step} />;
  }

  if (mode === 'data-lab') {
    return <DataStoryIllustration activeStep={step} workingLines={['Add values: 45', 'Divide by 5 values', '45 / 5 = 9', 'Mean = 9']} />;
  }

  if (mode === 'probability-spinner') {
    return <ProbabilityStoryIllustration activeStep={step} workingLines={['Even outcomes: 2, 4, 6', 'Total outcomes: 6', 'P(even) = 3/6', 'P(even) = 1/2']} />;
  }

  const panelsByMode: Record<string, Array<{ title: string; expression: string; action: string; accent: string }>> = {
    'algebra-tiles': [
      { title: 'Start with brackets', expression: '4(x + 3) - 2x', action: 'Show 4 groups of x + 3.', accent: '#38bdf8' },
      { title: 'Distribute', expression: '4x + 12 - 2x', action: 'Four x tiles and twelve unit tiles appear.', accent: '#facc15' },
      { title: 'Collect like terms', expression: '4x - 2x + 12', action: 'x terms slide into one group.', accent: '#34d399' },
      { title: 'Simplify', expression: '2x + 12', action: 'The simplified expression locks in.', accent: '#a78bfa' },
    ],
    'coordinate-grid': [
      { title: 'Choose x values', expression: 'x = 0, 1, 2', action: 'A table lights up row by row.', accent: '#38bdf8' },
      { title: 'Calculate y', expression: 'y = 2x + 1', action: 'Outputs become 1, 3, and 5.', accent: '#facc15' },
      { title: 'Plot points', expression: '(0,1), (1,3), (2,5)', action: 'Points land on the grid.', accent: '#34d399' },
      { title: 'Draw the line', expression: 'straight-line graph', action: 'A glowing line connects all solutions.', accent: '#a78bfa' },
    ],
    'angle-lab': [
      { title: 'Identify fact', expression: 'angles total 180', action: 'Triangle corners detach.', accent: '#38bdf8' },
      { title: 'Add known angles', expression: '47 + 68 = 115', action: 'Known angles stack together.', accent: '#facc15' },
      { title: 'Subtract from whole', expression: '180 - 115', action: 'Missing sector opens.', accent: '#34d399' },
      { title: 'Answer', expression: '65 degrees', action: 'The angle glows with its reason.', accent: '#a78bfa' },
    ],
    'circle-lab': [
      { title: 'Choose formula', expression: 'A = pi r^2', action: 'Radius sweeps the circle.', accent: '#38bdf8' },
      { title: 'Substitute', expression: 'A = pi x 5^2', action: 'Five-unit radius pins to the disc.', accent: '#facc15' },
      { title: 'Square radius', expression: '25pi', action: 'Area tiles fill the circle.', accent: '#34d399' },
      { title: 'Approximate', expression: 'about 78.5 cm^2', action: 'Final area label appears.', accent: '#a78bfa' },
    ],
    'construction-compass': [
      { title: 'Draw base', expression: '7 cm base', action: 'Base segment draws first.', accent: '#38bdf8' },
      { title: 'Set compass', expression: '5 cm and 6 cm arcs', action: 'Arcs sweep from both endpoints.', accent: '#facc15' },
      { title: 'Find intersection', expression: 'third vertex', action: 'Arc crossing flashes.', accent: '#34d399' },
      { title: 'Join sides', expression: 'triangle complete', action: 'Exact triangle locks into place.', accent: '#a78bfa' },
    ],
    'solid-builder': [
      { title: 'Identify shape', expression: 'cuboid 8 x 5 x 3', action: '3D faces turn toward the camera.', accent: '#38bdf8' },
      { title: 'Unfold net', expression: '2(lw + lh + wh)', action: 'Paired faces hinge open.', accent: '#facc15' },
      { title: 'Add face areas', expression: '2(40 + 24 + 15)', action: 'Face totals stack.', accent: '#34d399' },
      { title: 'Surface area', expression: '158 cm^2', action: 'Complete net glows.', accent: '#a78bfa' },
    ],
  };

  const panels = panelsByMode[mode] ?? [
    { title: 'Read', expression: blueprint.diagrams[0], action: blueprint.teacherMoves[0], accent: '#38bdf8' },
    { title: 'Model', expression: blueprint.threeDModels[0], action: blueprint.interactions[0], accent: '#facc15' },
    { title: 'Act', expression: blueprint.interactions[1] ?? blueprint.interactions[0], action: blueprint.teacherMoves[1] ?? blueprint.teacherMoves[0], accent: '#34d399' },
    { title: 'Check', expression: 'final answer', action: 'State and verify the result.', accent: '#a78bfa' },
  ];

  return (
    <div className="rounded-lg border border-white/10 bg-slate-950 p-4">
      <div className="grid min-h-[430px] gap-3 lg:grid-cols-4">
        {panels.map((panel, index) => (
          <div key={panel.title} className={`relative overflow-hidden rounded-lg border border-white/10 bg-white p-4 text-slate-950 transition duration-500 ${active(index) ? 'scale-[1.01] opacity-100 shadow-[0_0_35px_rgba(56,189,248,.18)]' : 'opacity-55'}`} style={{ backgroundImage: 'linear-gradient(rgba(14,165,233,.13) 1px, transparent 1px), linear-gradient(90deg, rgba(14,165,233,.13) 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
            <p className="text-xs font-black uppercase tracking-wide text-slate-500">Step {index + 1}</p>
            <h4 className="mt-2 text-lg font-black">{panel.title}</h4>
            <div className="mt-5 grid min-h-28 place-items-center rounded-lg text-center text-2xl font-black" style={{ background: `${panel.accent}33`, border: `3px solid ${panel.accent}` }}>
              {panel.expression}
            </div>
            <p className="mt-4 text-sm font-bold leading-6 text-slate-700">{panel.action}</p>
            <div className="absolute bottom-3 right-3 h-9 w-9 rounded-full" style={{ background: panel.accent, opacity: active(index) ? 1 : 0.28 }} />
          </div>
        ))}
      </div>
    </div>
  );
}

export function ThreeDExplainerScene({ packageData, scene, progress }: { packageData: LessonVideoAssetPackage; scene: Scene; progress: number }) {
  const isPlaceValue = packageData.subtopic.toLowerCase().includes('place value');
  const isRationalNumbers =
    packageData.subtopic.toLowerCase().includes('integers') &&
    packageData.subtopic.toLowerCase().includes('decimals') &&
    packageData.subtopic.toLowerCase().includes('fractions');

  return (
    <div className="relative min-h-[460px] overflow-hidden rounded-lg border border-white/10 bg-slate-950">
      <MotionGraphicsLayer progress={progress} />
      <div className="relative z-10">
        {isPlaceValue ? (
          <PlaceValueVisual scene={scene} progress={progress} />
        ) : isRationalNumbers ? (
          <RationalNumberVisual scene={scene} progress={progress} />
        ) : packageData.visualBlueprint ? (
          <div className="grid gap-3 p-5">
            <ConceptStoryboardVisual blueprint={packageData.visualBlueprint} progress={progress} />
            <CalloutPanel blueprint={packageData.visualBlueprint} scene={scene} />
          </div>
        ) : (
          <div className="grid min-h-[420px] place-items-center p-6">
            <div className="relative h-72 w-72 [perspective:900px]">
              <div className="absolute inset-0 rounded-lg border border-cyan-200/40 bg-cyan-300/20 shadow-[0_0_60px_rgba(56,189,248,.25)] transition-transform duration-500" style={{ transform: `rotateX(${55 + progress * 20}deg) rotateZ(${-28 + progress * 65}deg)` }} />
              <div className="absolute inset-10 rounded-lg border border-amber-200/40 bg-amber-300/20 transition-transform duration-500" style={{ transform: `rotateX(58deg) rotateZ(${-18 - progress * 40}deg) translateZ(35px)` }} />
              <div className="absolute inset-0 grid place-items-center text-center">
                <Box className="mx-auto h-16 w-16 text-cyan-100" />
                <p className="mt-4 max-w-xs text-xl font-black text-white">{packageData.subtopic}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function NarrationPanel({ scene, isPlaying }: { scene: Scene; isPlaying: boolean }) {
  return (
    <aside className="rounded-lg border border-white/10 bg-white p-5 text-slate-950">
      <div className="flex items-center justify-between gap-3">
        <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-slate-500">
          <Volume2 className="h-4 w-4" />
          Narration
        </p>
        <span className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ${isPlaying ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>
          {isPlaying ? 'playing' : 'paused'}
        </span>
      </div>
      <p className="mt-4 text-lg font-semibold leading-8 text-slate-900">{scene.narration}</p>
      <p className="mt-4 rounded-lg bg-slate-100 p-3 text-sm leading-6 text-slate-600">{scene.purpose}</p>
    </aside>
  );
}

export function SceneTimelineEngine({
  scenes,
  activeSceneIndex,
  setActiveSceneIndex,
  progress,
  setProgress,
  isPlaying,
  setIsPlaying,
}: {
  scenes: Scene[];
  activeSceneIndex: number;
  setActiveSceneIndex: (index: number) => void;
  progress: number;
  setProgress: (progress: number) => void;
  isPlaying: boolean;
  setIsPlaying: (value: boolean) => void;
}) {
  const totalProgress = lessonProgress(scenes, activeSceneIndex, progress);

  return (
    <section className="rounded-lg border border-white/10 bg-slate-950 p-4 text-white">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-cyan-200">Scene timeline engine</p>
          <h3 className="text-xl font-black">{scenes[activeSceneIndex].title}</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => setIsPlaying(!isPlaying)} className="inline-flex items-center gap-2 rounded-md bg-white px-4 py-2 text-sm font-bold text-slate-950">
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            {isPlaying ? 'Pause' : 'Play'}
          </button>
          <button onClick={() => { setActiveSceneIndex(0); setProgress(0); setIsPlaying(false); }} className="inline-flex items-center gap-2 rounded-md border border-white/15 px-4 py-2 text-sm font-bold text-white">
            Reset <RotateCcw className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
        <div className="h-full rounded-full bg-gradient-to-r from-cyan-300 via-amber-200 to-pink-300 transition-all" style={{ width: `${totalProgress}%` }} />
      </div>

      <div className="mt-4 grid gap-2 md:grid-cols-3 xl:grid-cols-5">
        {scenes.map((scene, index) => (
          <button
            key={scene.id}
            onClick={() => {
              setActiveSceneIndex(index);
              setProgress(0);
              setIsPlaying(false);
            }}
            className={`rounded-md border p-3 text-left text-xs font-bold transition ${index === activeSceneIndex ? 'border-cyan-200 bg-cyan-200 text-slate-950' : 'border-white/10 bg-white/5 text-slate-200 hover:border-white/40'}`}
          >
            <span className="block uppercase tracking-wide">Scene {index + 1}</span>
            <span className="mt-1 block">{scene.title}</span>
          </button>
        ))}
      </div>
    </section>
  );
}

export function InteractiveCheckpoint({ scene }: { scene: Scene }) {
  const [selected, setSelected] = useState('');
  if (!scene.studentInteraction) return null;

  return (
    <section className="rounded-lg border border-amber-200/30 bg-amber-100 p-5 text-slate-950">
      <p className="text-xs font-bold uppercase tracking-wide text-amber-700">Interactive checkpoint</p>
      <h3 className="mt-1 text-xl font-black">{scene.studentInteraction}</h3>
      <div className="mt-4 grid gap-2 sm:grid-cols-3">
        {['Observe the model', 'Make the change', 'Explain why'].map((option) => (
          <button key={option} onClick={() => setSelected(option)} className={`rounded-md border p-3 text-sm font-bold ${selected === option ? 'border-slate-950 bg-slate-950 text-white' : 'border-amber-300 bg-white text-slate-900'}`}>
            {option}
          </button>
        ))}
      </div>
      {selected ? <p className="mt-3 rounded-md bg-white p-3 text-sm font-semibold text-slate-700">Great. The engine pauses here so the teacher can invite students to {selected.toLowerCase()}.</p> : null}
    </section>
  );
}

function PercentageFractionDemo({ activeStep }: { activeStep: number }) {
  const showMultiply = activeStep >= 1;
  const showCancel = activeStep >= 2;
  const showAnswer = activeStep >= 3;

  return (
    <div className="min-h-72 rounded-lg bg-slate-950 p-5">
      <p className="text-xs font-bold uppercase tracking-wide text-cyan-200">Live fraction method demonstration</p>
      <div className="mt-5 flex flex-wrap items-center justify-center gap-5 text-4xl font-black text-white">
        <span className="text-amber-200">8%</span>
        <span className="text-slate-400">of</span>
        <span className="text-amber-200">300</span>
        <span className="text-slate-400">=</span>
        <FractionBlock numerator="8" denominator={showCancel ? '1' : '100'} strikeDenominator={showCancel} replacementDenominator="1" />
        {showMultiply ? <span className="text-slate-400">x</span> : null}
        {showMultiply ? <FractionBlock numerator={showCancel ? '3' : '300'} denominator="1" strikeNumerator={showCancel} replacementNumerator="3" /> : null}
        {showAnswer ? (
          <>
            <span className="text-slate-400">=</span>
            <span className="rounded-lg bg-green-300 px-5 py-3 text-slate-950 shadow-[0_0_35px_rgba(134,239,172,.32)]">24</span>
          </>
        ) : null}
      </div>
      <div className="mt-7 grid gap-3 md:grid-cols-4">
        {[
          '8% means 8 out of 100',
          'of 300 means multiply by 300',
          '300 and 100 simplify to 3 and 1',
          '8 x 3 = 24',
        ].map((label, index) => (
          <div key={label} className={`rounded-lg border p-3 text-sm font-bold transition ${activeStep >= index ? 'border-cyan-200 bg-cyan-200 text-slate-950' : 'border-white/10 bg-white/5 text-slate-300'}`}>
            {index + 1}. {label}
          </div>
        ))}
      </div>
    </div>
  );
}

function FractionBlock({
  numerator,
  denominator,
  strikeNumerator,
  strikeDenominator,
  replacementNumerator,
  replacementDenominator,
}: {
  numerator: string;
  denominator: string;
  strikeNumerator?: boolean;
  strikeDenominator?: boolean;
  replacementNumerator?: string;
  replacementDenominator?: string;
}) {
  return (
    <span className="relative inline-grid min-w-24 place-items-center rounded-lg bg-white px-4 py-3 text-slate-950 shadow-lg">
      <span className="relative text-3xl font-black">
        {strikeNumerator ? <span className="absolute left-0 right-0 top-1/2 h-1 -rotate-12 bg-red-500" /> : null}
        {numerator}
      </span>
      <span className="my-1 h-1 w-16 rounded-full bg-slate-950" />
      <span className="relative text-3xl font-black">
        {strikeDenominator ? <span className="absolute left-0 right-0 top-1/2 h-1 -rotate-12 bg-red-500" /> : null}
        {denominator}
      </span>
      {replacementNumerator ? <span className="absolute -right-3 -top-3 grid h-8 w-8 place-items-center rounded-full bg-cyan-200 text-sm font-black text-slate-950">{replacementNumerator}</span> : null}
      {replacementDenominator ? <span className="absolute -bottom-3 -right-3 grid h-8 w-8 place-items-center rounded-full bg-cyan-200 text-sm font-black text-slate-950">{replacementDenominator}</span> : null}
    </span>
  );
}

function ExamWorkingCard({ title, lines, activeStep }: { title: string; lines: string[]; activeStep: number }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white p-4 text-slate-950">
      <p className="text-xs font-bold uppercase tracking-wide text-slate-500">{title}</p>
      <div className="mt-3 space-y-2">
        {lines.map((line, index) => (
          <div key={line} className={`rounded-md p-3 font-mono text-sm font-black transition ${activeStep >= index ? 'bg-cyan-100 text-slate-950' : 'bg-slate-100 text-slate-500'}`}>
            {line}
          </div>
        ))}
      </div>
    </div>
  );
}

function EquationStoryboardVisual({ progress = 0, activeStep }: { progress?: number; activeStep?: number }) {
  const stage = activeStep ?? Math.min(3, Math.floor(progress * 4));
  const visible = (index: number) => stage >= index;

  return (
    <div className="rounded-lg border border-white/10 bg-slate-950 p-4 shadow-[0_20px_80px_rgba(15,23,42,.45)]">
      <div className="grid min-h-[430px] gap-3 lg:grid-cols-2">
        <div className={`relative overflow-hidden rounded-lg border border-slate-300 bg-white p-5 text-slate-950 transition duration-500 ${visible(0) ? 'opacity-100' : 'opacity-55'}`} style={{ backgroundImage: 'linear-gradient(rgba(14,165,233,.16) 1px, transparent 1px), linear-gradient(90deg, rgba(14,165,233,.16) 1px, transparent 1px)', backgroundSize: '28px 28px' }}>
          <p className="text-xs font-black uppercase tracking-wide text-slate-500">Step 1: write the equation</p>
          <div className="mt-10 text-center text-5xl font-black tracking-normal">5x - 7 = 28</div>
          <svg className="absolute bottom-7 right-8 h-28 w-36" viewBox="0 0 160 120" aria-hidden="true">
            <path d="M38 60C70 84 106 82 132 54" stroke="#f59e0b" strokeWidth="10" fill="none" strokeLinecap="round" />
            <path d="M24 56L54 78" stroke="#f59e0b" strokeWidth="10" strokeLinecap="round" />
            <path d="M118 50L148 28" stroke="#1e293b" strokeWidth="12" strokeLinecap="round" />
            <path d="M123 47L148 28" stroke="#facc15" strokeWidth="6" strokeLinecap="round" />
          </svg>
        </div>

        <div className={`relative overflow-hidden rounded-lg border border-slate-300 bg-white p-5 text-slate-950 transition duration-500 ${visible(1) ? 'opacity-100' : 'opacity-55'}`} style={{ backgroundImage: 'linear-gradient(rgba(14,165,233,.16) 1px, transparent 1px), linear-gradient(90deg, rgba(14,165,233,.16) 1px, transparent 1px)', backgroundSize: '28px 28px' }}>
          <p className="text-xs font-black uppercase tracking-wide text-slate-500">Step 2: inverse operation</p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3 text-4xl font-black">
            <span>5x - 7</span>
            <span className={`rounded-md bg-lime-300 px-2 transition ${visible(1) ? 'scale-110 shadow-[0_0_30px_rgba(132,204,22,.55)]' : ''}`}>+ 7</span>
            <span>=</span>
            <span>28</span>
            <span className={`rounded-md bg-lime-300 px-2 transition ${visible(1) ? 'scale-110 shadow-[0_0_30px_rgba(132,204,22,.55)]' : ''}`}>+ 7</span>
          </div>
          <div className="mt-8 grid place-items-center">
            <div className="rounded-lg bg-lime-300 px-5 py-3 text-2xl font-black shadow-lg">add 7 to both sides</div>
          </div>
          <svg className="absolute bottom-4 right-6 h-24 w-28" viewBox="0 0 120 100" aria-hidden="true">
            <path d="M26 64C42 44 62 43 83 58" stroke="#f59e0b" strokeWidth="11" fill="none" strokeLinecap="round" />
            <rect x="76" y="23" width="34" height="34" rx="6" fill="#94a3b8" stroke="#0f172a" strokeWidth="4" />
            <text x="82" y="47" fill="#0f172a" fontSize="21" fontWeight="900">+7</text>
          </svg>
        </div>

        <div className={`relative overflow-hidden rounded-lg border border-slate-300 bg-white p-5 text-slate-950 transition duration-500 ${visible(2) ? 'opacity-100' : 'opacity-55'}`} style={{ backgroundImage: 'linear-gradient(rgba(14,165,233,.16) 1px, transparent 1px), linear-gradient(90deg, rgba(14,165,233,.16) 1px, transparent 1px)', backgroundSize: '28px 28px' }}>
          <p className="text-xs font-black uppercase tracking-wide text-slate-500">Step 3: unwrap subtraction</p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-5xl font-black">
            <span>5x</span>
            <span className="relative rounded-md px-2 text-slate-400">
              -7
              <span className={`absolute left-0 right-0 top-1/2 h-2 -rotate-12 rounded-full bg-lime-400 transition ${visible(2) ? 'opacity-100' : 'opacity-0'}`} />
            </span>
            <span className="relative rounded-md bg-lime-300 px-2">
              +7
              <span className={`absolute -right-3 -top-3 grid h-8 w-8 place-items-center rounded-full bg-white text-sm text-green-700 transition ${visible(2) ? 'opacity-100' : 'opacity-0'}`}>0</span>
            </span>
            <span>=</span>
            <span>35</span>
          </div>
          <svg className="mt-8 h-24 w-full" viewBox="0 0 520 110" aria-hidden="true">
            <path d="M75 78C168 20 270 20 392 70" stroke="#65a30d" strokeWidth="18" fill="none" strokeLinecap="round" />
            <path d="M387 70L346 33M387 70L333 83" stroke="#65a30d" strokeWidth="18" strokeLinecap="round" />
          </svg>
          <p className="absolute bottom-5 left-5 right-5 rounded-lg bg-slate-950 px-4 py-3 text-center text-lg font-black text-white">-7 + 7 cancels, leaving 5x = 35</p>
        </div>

        <div className={`relative overflow-hidden rounded-lg border border-slate-300 bg-white p-5 text-slate-950 transition duration-500 ${visible(3) ? 'opacity-100' : 'opacity-55'}`} style={{ backgroundImage: 'linear-gradient(rgba(14,165,233,.16) 1px, transparent 1px), linear-gradient(90deg, rgba(14,165,233,.16) 1px, transparent 1px)', backgroundSize: '28px 28px' }}>
          <p className="text-xs font-black uppercase tracking-wide text-slate-500">Step 4: divide and check</p>
          <div className="mt-5 grid gap-5 md:grid-cols-[1fr_0.7fr] md:items-center">
            <div>
              <div className="flex justify-center gap-1">
                {Array.from({ length: 5 }, (_, index) => (
                  <div key={index} className="grid h-12 w-12 place-items-center rounded-md border-2 border-slate-800 bg-slate-200 text-2xl font-black">x</div>
                ))}
              </div>
              <div className="mt-2 flex justify-center gap-1">
                {Array.from({ length: 5 }, (_, index) => (
                  <div key={index} className={`grid h-12 w-12 place-items-center rounded-md bg-lime-300 text-2xl font-black transition ${visible(3) ? 'translate-y-1' : ''}`}>7</div>
                ))}
              </div>
              <div className="mt-4 text-center text-4xl font-black">5x / 5 = 35 / 5</div>
            </div>
            <div className="rounded-lg border-4 border-lime-500 bg-lime-200 p-5 text-center shadow-[0_0_35px_rgba(132,204,22,.45)]">
              <p className="text-sm font-black uppercase tracking-wide text-green-800">The solution</p>
              <p className="mt-1 text-5xl font-black">x = 7</p>
            </div>
          </div>
          <p className="mt-4 rounded-lg bg-slate-950 px-4 py-3 text-center text-xl font-black text-white">Check: 5(7) - 7 = 28</p>
        </div>
      </div>
    </div>
  );
}

function EquationSolvingIllustration({ activeStep, workingLines }: { activeStep: number; workingLines: string[] }) {
  const stage = Math.min(3, activeStep);
  const caption = [
    'Start with a balanced scale: the left side and right side have the same value.',
    'Add 7 to both sides. The -7 and +7 on the left make zero, so the balance stays level.',
    'Divide both sides into 5 equal groups. Each x-group must be worth 7.',
    'Check by substituting x = 7. The left side becomes 35 - 7, which equals 28.',
  ][stage];

  return (
    <div className="grid min-h-[420px] gap-4 p-4 xl:grid-cols-[1fr_0.55fr]">
      <div className="overflow-hidden rounded-lg border border-white/10 bg-slate-950 p-4">
        <EquationStoryboardVisual activeStep={stage} />
        <p className="mt-3 rounded-lg bg-white/10 p-3 text-sm font-semibold leading-6 text-slate-100">{caption}</p>
      </div>
      <div className="grid gap-3">
        {['Write equation', 'Add 7 to both sides', 'Divide by 5', 'Check x = 7'].map((label, index) => (
          <div key={label} className={`rounded-lg border p-4 transition ${activeStep === index ? 'border-cyan-200 bg-cyan-200 text-slate-950' : activeStep > index ? 'border-green-300/40 bg-green-300/15 text-green-50' : 'border-white/10 bg-white/5 text-slate-200'}`}>
            <p className="text-xs font-black uppercase tracking-wide">Step {index + 1}</p>
            <p className="mt-1 text-lg font-black">{label}</p>
            <p className="mt-2 font-mono text-sm font-bold">{workingLines[index] ?? ''}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function NumberLineJumpIllustration({ activeStep, visualAction, workingLines }: { activeStep: number; visualAction: string; workingLines: string[] }) {
  const stage = Math.min(3, activeStep);
  const positions = [412, 366, 320, 274, 228, 182];
  const currentPosition = positions[stage === 0 ? 0 : stage === 1 ? 2 : stage === 2 ? 5 : 5];
  const caption = [
    'Start at 2. The marker sits two spaces to the right of zero.',
    'Subtracting means moving left. Each jump is one unit.',
    'After five left jumps, the marker lands at -3.',
    'Read the landing point and check the direction: 2 - 5 = -3.',
  ][stage];

  return (
    <div className="grid min-h-[420px] gap-4 p-4 xl:grid-cols-[1fr_0.48fr]">
      <div className="rounded-lg border border-white/10 bg-slate-950 p-4">
        <svg className="h-[340px] w-full" viewBox="0 0 760 360" role="img" aria-label="Number line jump demonstration">
          <rect width="760" height="360" rx="24" fill="rgba(2,6,23,.96)" />
          <path d="M80 190H680" stroke="rgba(255,255,255,.72)" strokeWidth="8" strokeLinecap="round" />
          {Array.from({ length: 13 }, (_, index) => {
            const value = index - 6;
            const x = 110 + index * 46;
            return (
              <g key={value}>
                <path d={`M${x} 164V216`} stroke={value === 0 ? '#38bdf8' : 'rgba(255,255,255,.48)'} strokeWidth={value === 0 ? 5 : 3} />
                <text x={x - 10} y="250" fill={value === -3 || value === 2 ? '#fde68a' : 'rgba(255,255,255,.75)'} fontSize="21" fontWeight="900">{value}</text>
              </g>
            );
          })}
          {Array.from({ length: 5 }, (_, index) => {
            const start = 478 - index * 46;
            const end = start - 38;
            const visible = stage >= 1 && (stage >= 2 || index < 2);
            return visible ? (
              <path key={index} d={`M${start} ${134 - (index % 2) * 22} Q${start - 20} ${94 - (index % 2) * 22} ${end} ${134 - (index % 2) * 22}`} fill="none" stroke="#facc15" strokeWidth="6" strokeLinecap="round" markerEnd="url(#jumpArrow)" />
            ) : null;
          })}
          <defs>
            <marker id="jumpArrow" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto" markerUnits="strokeWidth">
              <path d="M0,0 L0,6 L9,3 z" fill="#facc15" />
            </marker>
          </defs>
          <circle cx={currentPosition} cy="190" r="23" fill="#facc15" stroke="#fef3c7" strokeWidth="5" />
          <text x={currentPosition - 8} y="198" fill="#422006" fontSize="21" fontWeight="900">{stage < 2 ? '2' : '-3'}</text>
          <text x="94" y="62" fill="white" fontSize="28" fontWeight="900">2 - 5</text>
          <text x="94" y="96" fill="#cbd5e1" fontSize="18" fontWeight="700">{visualAction}</text>
        </svg>
        <p className="mt-3 rounded-lg bg-white/10 p-3 text-sm font-semibold leading-6 text-slate-100">{caption}</p>
      </div>
      <ExamWorkingCard title="Number-line working" lines={workingLines.length ? workingLines : ['Start at 2', 'Move 5 spaces left', 'Land on -3', '2 - 5 = -3']} activeStep={activeStep} />
    </div>
  );
}

function RatioSharingIllustration({ activeStep, workingLines }: { activeStep: number; workingLines: string[] }) {
  const stage = Math.min(3, activeStep);
  return (
    <div className="grid min-h-[420px] gap-4 p-4 xl:grid-cols-[1fr_0.48fr]">
      <div className="rounded-lg border border-white/10 bg-slate-950 p-5">
        <p className="text-xs font-bold uppercase tracking-wide text-cyan-200">Divide 72 AED in the ratio 5:4</p>
        <div className="mt-5 grid gap-4 md:grid-cols-[5fr_4fr]">
          {[
            ['First share', 5, '#38bdf8', '40 AED'],
            ['Second share', 4, '#facc15', '32 AED'],
          ].map(([label, parts, color, answer]) => (
            <div key={String(label)} className="rounded-lg bg-white/5 p-4">
              <p className="text-center text-sm font-black text-white">{label}</p>
              <div className="mt-4 grid gap-2">
                {Array.from({ length: Number(parts) }, (_, index) => (
                  <div key={index} className="grid h-10 place-items-center rounded-md text-sm font-black text-slate-950 transition" style={{ background: String(color), opacity: stage >= 1 ? 1 : 0.65 }}>
                    {stage >= 1 ? '8 AED' : '1 part'}
                  </div>
                ))}
              </div>
              <p className={`mt-4 rounded-lg p-3 text-center text-2xl font-black transition ${stage >= 2 ? 'bg-white text-slate-950' : 'bg-white/10 text-white'}`}>{stage >= 2 ? answer : `${parts} parts`}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 rounded-lg bg-amber-200 p-3 text-center text-lg font-black text-slate-950">
          {stage === 0 ? '5 + 4 = 9 total parts' : stage === 1 ? '72 / 9 = 8 AED per part' : 'Shares: 5 x 8 and 4 x 8'}
        </div>
      </div>
      <ExamWorkingCard title="Ratio working" lines={workingLines} activeStep={activeStep} />
    </div>
  );
}

function DataStoryIllustration({ activeStep, workingLines }: { activeStep: number; workingLines: string[] }) {
  const stage = Math.min(3, activeStep);
  const values = [4, 8, 8, 10, 15];
  return (
    <div className="grid min-h-[420px] gap-4 p-4 xl:grid-cols-[1fr_0.48fr]">
      <div className="rounded-lg border border-white/10 bg-slate-950 p-5">
        <p className="text-xs font-bold uppercase tracking-wide text-cyan-200">Mean as a balance point</p>
        <div className="mt-6 flex min-h-48 items-end justify-center gap-4">
          {values.map((value, index) => (
            <div key={`${value}-${index}`} className="grid gap-2 text-center">
              <div className="w-14 rounded-t-lg bg-cyan-300 transition-all" style={{ height: `${value * 10}px`, opacity: stage >= 0 ? 1 : 0.4 }} />
              <p className="font-black text-white">{value}</p>
            </div>
          ))}
        </div>
        <div className="mt-6 rounded-lg bg-white/10 p-4">
          <div className="relative h-12 rounded-full bg-white/10">
            <div className="absolute left-[50%] top-0 h-12 w-1 rounded-full bg-amber-200" />
            <div className="absolute left-[48%] -top-8 rounded-lg bg-amber-200 px-3 py-1 text-sm font-black text-slate-950">mean = 9</div>
          </div>
        </div>
        <p className="mt-4 rounded-lg bg-white/10 p-3 text-sm font-semibold text-slate-100">{stage < 1 ? 'Add all values.' : stage < 2 ? 'Divide by the number of values.' : 'The mean is the balance point for the data set.'}</p>
      </div>
      <ExamWorkingCard title="Data working" lines={workingLines} activeStep={activeStep} />
    </div>
  );
}

function ProbabilityStoryIllustration({ activeStep, workingLines }: { activeStep: number; workingLines: string[] }) {
  const stage = Math.min(3, activeStep);
  return (
    <div className="grid min-h-[420px] gap-4 p-4 xl:grid-cols-[1fr_0.48fr]">
      <div className="rounded-lg border border-white/10 bg-slate-950 p-5">
        <p className="text-xs font-bold uppercase tracking-wide text-cyan-200">Favourable outcomes over total outcomes</p>
        <div className="mt-7 grid place-items-center">
          <div className="relative h-64 w-64 rounded-full border-[12px] border-white/10 shadow-2xl" style={{ background: 'conic-gradient(#38bdf8 0 180deg, #facc15 180deg 360deg)', transform: `rotate(${stage * 20}deg)` }}>
            <div className="absolute inset-20 grid place-items-center rounded-full bg-slate-950 text-4xl font-black text-white">{stage >= 2 ? '1/2' : '?'}</div>
            <div className="absolute -right-8 top-12 rounded-lg bg-cyan-200 px-3 py-2 text-sm font-black text-slate-950">2,4,6</div>
            <div className="absolute -left-8 bottom-12 rounded-lg bg-amber-200 px-3 py-2 text-sm font-black text-slate-950">1,3,5</div>
          </div>
        </div>
        <div className="mt-5 grid grid-cols-3 gap-2">
          {['Count even outcomes', 'Count all outcomes', 'Simplify 3/6'].map((label, index) => (
            <div key={label} className={`rounded-md p-3 text-center text-xs font-black ${stage >= index ? 'bg-cyan-200 text-slate-950' : 'bg-white/10 text-slate-300'}`}>{label}</div>
          ))}
        </div>
      </div>
      <ExamWorkingCard title="Probability working" lines={workingLines} activeStep={activeStep} />
    </div>
  );
}

function ModeExamStepDemo({
  packageData,
  examQuestion,
  activeStep,
  visualAction,
}: {
  packageData: LessonVideoAssetPackage;
  examQuestion: ExamQuestionWalkthrough;
  activeStep: number;
  visualAction: string;
}) {
  const blueprint = packageData.visualBlueprint;
  const mode = blueprint?.animation;
  const stage = Math.min(3, activeStep);
  const workingLines = examQuestion.approach.map((item) => item.working);

  if (mode === 'number-line') {
    return (
      <div className="grid min-h-72 gap-4">
        <NumberLineJumpIllustration activeStep={activeStep} visualAction={visualAction} workingLines={workingLines} />
      </div>
    );
  }

  if (mode === 'ratio-mixer') {
    return (
      <div className="grid min-h-72 gap-4">
        <RatioSharingIllustration activeStep={activeStep} workingLines={workingLines} />
      </div>
    );
  }

  if (mode === 'algebra-tiles') {
    return (
      <div className="grid min-h-72 gap-4 p-4 md:grid-cols-[1fr_0.8fr]">
        <div className="rounded-lg border border-white/10 bg-white/5 p-4">
          <p className="text-xs font-bold uppercase tracking-wide text-cyan-200">Algebra tiles / area model</p>
          <div className="mt-5 grid grid-cols-[90px_1fr] gap-3">
            <div className="grid place-items-center rounded-lg bg-cyan-300 text-3xl font-black text-slate-950">4</div>
            <div className="grid grid-cols-2 gap-2">
              <div className="grid h-24 place-items-center rounded-lg bg-cyan-200 text-3xl font-black text-slate-950">x</div>
              <div className="grid h-24 place-items-center rounded-lg bg-amber-200 text-3xl font-black text-slate-950">3</div>
            </div>
          </div>
          <div className="mt-5 flex justify-center gap-3">
            {['4x', '12', '-2x'].map((term, index) => (
              <span key={term} className={`rounded-lg px-4 py-3 text-2xl font-black transition ${stage >= index ? 'bg-white text-slate-950' : 'bg-white/10 text-white'}`}>{term}</span>
            ))}
          </div>
        </div>
        <ExamWorkingCard title="Algebra working" lines={workingLines} activeStep={activeStep} />
      </div>
    );
  }

  if (mode === 'equation-balance') {
    return (
      <div className="grid min-h-72 gap-4">
        <EquationSolvingIllustration activeStep={activeStep} workingLines={workingLines} />
      </div>
    );
  }

  if (mode === 'data-lab') {
    return (
      <div className="grid min-h-72 gap-4">
        <DataStoryIllustration activeStep={activeStep} workingLines={workingLines} />
      </div>
    );
  }

  if (mode === 'coordinate-grid') {
    return (
      <div className="grid min-h-72 gap-4 p-4 md:grid-cols-[1fr_0.8fr]">
        <svg className="h-72 rounded-lg bg-white/5" viewBox="0 0 520 280">
          {Array.from({ length: 8 }, (_, index) => <path key={`v-${index}`} d={`M${70 + index * 50} 30V230`} stroke="rgba(255,255,255,.1)" />)}
          {Array.from({ length: 5 }, (_, index) => <path key={`h-${index}`} d={`M55 ${50 + index * 40}H450`} stroke="rgba(255,255,255,.1)" />)}
          <path d="M55 230H465M70 245V30" stroke="rgba(255,255,255,.65)" strokeWidth="4" />
          <path d="M80 210L180 160L280 110L380 60" stroke="#38bdf8" strokeWidth="7" fill="none" strokeLinecap="round" />
          <circle cx={stage >= 1 ? 280 : 180} cy={stage >= 1 ? 110 : 160} r="12" fill="#facc15" />
          <path d="M180 160H280V110" stroke="#facc15" strokeWidth="5" fill="none" />
        </svg>
        <ExamWorkingCard title="Graph method" lines={workingLines} activeStep={activeStep} />
      </div>
    );
  }

  if (mode === 'angle-lab' || mode === 'construction-compass') {
    return (
      <div className="grid min-h-72 gap-4 p-4 md:grid-cols-[1fr_0.8fr]">
        <svg className="h-72 rounded-lg bg-white/5" viewBox="0 0 520 280">
          <path d="M90 210H430" stroke="rgba(255,255,255,.75)" strokeWidth="6" strokeLinecap="round" />
          <path d={stage >= 2 ? 'M90 210L350 80' : 'M90 210L300 135'} stroke="#38bdf8" strokeWidth="7" strokeLinecap="round" />
          <path d="M145 210 A58 58 0 0 1 190 172" fill="none" stroke="#facc15" strokeWidth="11" strokeLinecap="round" />
          <path d="M75 75H440M75 128H440" stroke="rgba(255,255,255,.25)" strokeWidth="5" />
          <text x="205" y="180" fill="#fde68a" fontSize="24" fontWeight="900">{stage >= 2 ? '117 deg' : '63 deg'}</text>
        </svg>
        <ExamWorkingCard title="Angle reasoning" lines={workingLines} activeStep={activeStep} />
      </div>
    );
  }

  if (mode === 'probability-spinner') {
    return (
      <div className="grid min-h-72 gap-4">
        <ProbabilityStoryIllustration activeStep={activeStep} workingLines={workingLines} />
      </div>
    );
  }

  if (mode === 'circle-lab') {
    return (
      <div className="grid min-h-72 gap-4 p-4 md:grid-cols-[1fr_0.8fr]">
        <svg className="h-72 rounded-lg bg-white/5" viewBox="0 0 520 280">
          <circle cx="250" cy="135" r="82" fill="rgba(56,189,248,.25)" stroke="rgba(255,255,255,.7)" strokeWidth="5" />
          <path d="M250 135H332" stroke="#facc15" strokeWidth="6" strokeLinecap="round" />
          <path d="M168 240H332" stroke="#38bdf8" strokeWidth="7" strokeLinecap="round" />
          <text x="165" y="265" fill="white" fontSize="17" fontWeight="900">{mode === 'circle-lab' ? 'unwrap circumference' : 'favourable / total'}</text>
        </svg>
        <ExamWorkingCard title="Circle formula method" lines={workingLines} activeStep={activeStep} />
      </div>
    );
  }

  if (mode === 'solid-builder') {
    return (
      <div className="grid min-h-72 gap-4 p-4 md:grid-cols-[1fr_0.8fr]">
        <div className="relative min-h-72 rounded-lg bg-white/5 p-5 [perspective:900px]">
          <div className="absolute left-1/2 top-1/2 h-28 w-28 -translate-x-1/2 -translate-y-1/2" style={{ transformStyle: 'preserve-3d', transform: 'rotateX(58deg) rotateZ(-35deg)' }}>
            {['front', 'back', 'left', 'right', 'top', 'base'].map((face, index) => (
              <div key={face} className="absolute grid h-28 w-28 place-items-center rounded-md border border-white/25 text-xs font-black uppercase tracking-wide text-white" style={{ background: index % 2 ? '#facc1599' : '#38bdf899', transform: `rotateY(${stage >= 1 ? index * 18 : 0}deg) translateZ(${40 + index * 2}px)` }}>{face}</div>
            ))}
          </div>
        </div>
        <ExamWorkingCard title="Measurement method" lines={workingLines} activeStep={activeStep} />
      </div>
    );
  }

  const cards = [blueprint?.diagrams[0] ?? 'Read the model', blueprint?.interactions[0] ?? 'Mark known values', blueprint?.threeDModels[0] ?? 'Animate relationship', visualAction];

  return (
    <div className="grid min-h-72 place-items-center p-4">
      <div className="w-full max-w-3xl">
        <div className="grid gap-3 md:grid-cols-4">
          {cards.map((card, index) => (
            <div key={`${card}-${index}`} className={`min-h-32 rounded-lg border p-4 transition ${activeStep >= index ? 'border-cyan-200 bg-cyan-200/20 scale-105' : 'border-white/10 bg-white/5'}`}>
              <p className="text-xs font-bold uppercase tracking-wide text-cyan-200">Action {index + 1}</p>
              <p className="mt-2 text-sm font-bold leading-6 text-white">{card}</p>
            </div>
          ))}
        </div>
        <div className="mt-5 h-3 overflow-hidden rounded-full bg-white/10">
          <div className="h-full rounded-full bg-gradient-to-r from-cyan-300 to-amber-200 transition-all" style={{ width: `${Math.min(100, (activeStep + 1) * 25)}%` }} />
        </div>
      </div>
    </div>
  );
}

export function ExamQuestionCoach({
  examQuestion,
  packageData,
}: {
  examQuestion: ExamQuestionWalkthrough;
  packageData: LessonVideoAssetPackage;
}) {
  const [activeStep, setActiveStep] = useState(0);
  const step = examQuestion.approach[activeStep] ?? examQuestion.approach[0];
  const isRationalNumbers = packageData.subtopic.toLowerCase().includes('integers') && packageData.subtopic.toLowerCase().includes('fractions');
  const isPlaceValue = packageData.subtopic.toLowerCase().includes('place value');
  const animationMode = packageData.visualBlueprint?.animation;

  return (
    <section className="rounded-lg border border-cyan-200/20 bg-slate-950 p-4 text-white md:p-5">
      <div className="rounded-lg border border-white/10 bg-white text-slate-950 shadow-[0_24px_80px_rgba(15,23,42,.28)]">
        <div className="border-b border-slate-200 p-5">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-cyan-700">Exam question walkthrough</p>
              <h3 className="mt-1 text-2xl font-black">One-board guided solution</h3>
              <p className="mt-3 max-w-5xl text-lg font-semibold leading-8 text-slate-900">{examQuestion.prompt}</p>
            </div>
            <div className="rounded-md bg-amber-50 px-4 py-3 text-sm font-semibold leading-6 text-amber-950 xl:max-w-sm">
              <span className="font-black">Tip:</span> {examQuestion.examTip}
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {examQuestion.given.map((item) => (
              <span key={item} className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-600">{item}</span>
            ))}
          </div>
        </div>

        <div className="p-5">
          <div className="grid gap-2 md:grid-cols-4">
            {examQuestion.approach.map((approachStep, index) => (
              <button
                key={approachStep.title}
                onClick={() => setActiveStep(index)}
                className={`min-h-20 rounded-md border px-3 py-2 text-left transition focus:outline-none focus:ring-2 focus:ring-cyan-300 ${activeStep === index ? 'border-slate-950 bg-slate-950 text-white' : activeStep > index ? 'border-green-200 bg-green-50 text-green-950' : 'border-slate-200 bg-white text-slate-700 hover:border-slate-400'}`}
              >
                <span className="text-[11px] font-black uppercase tracking-wide">Step {index + 1}</span>
                <span className="mt-1 block text-sm font-black leading-5">{approachStep.title}</span>
              </button>
            ))}
          </div>

          <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
            <div className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-amber-300 transition-all" style={{ width: `${((activeStep + 1) / examQuestion.approach.length) * 100}%` }} />
          </div>

          <div className="mt-5 overflow-hidden rounded-lg bg-slate-950 text-white">
            <div className="flex flex-col gap-3 border-b border-white/10 bg-white/5 p-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-cyan-200">Step {activeStep + 1} of {examQuestion.approach.length}</p>
                <h4 className="mt-1 text-2xl font-black text-white">{step.title}</h4>
              </div>
              <div className="rounded-md bg-white px-4 py-2 font-mono text-sm font-black text-slate-950">{step.working}</div>
            </div>

            <div className="p-4">
              {animationMode === 'percentage-bars' ? (
                <PercentageFractionDemo activeStep={activeStep} />
              ) : isRationalNumbers ? (
                <NumberLine markerX={activeStep === 0 ? 182 : activeStep === 1 ? 412 : activeStep === 2 ? 275 : 275} label={step.visualAction} />
              ) : isPlaceValue ? (
                <div className="grid gap-3 sm:grid-cols-4">
                  {['5 thousands', '4 hundreds', '8 tens', '2 ones'].map((label, index) => (
                    <div key={label} className={`rounded-lg border p-4 text-center transition ${activeStep >= Math.min(index, 2) ? 'border-cyan-200 bg-cyan-200/20' : 'border-white/10 bg-white/5'}`}>
                      <p className="text-3xl font-black text-white">{label.split(' ')[0]}</p>
                      <p className="mt-2 text-xs font-bold uppercase tracking-wide text-slate-300">{label.split(' ')[1]}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <ModeExamStepDemo packageData={packageData} examQuestion={examQuestion} activeStep={activeStep} visualAction={step.visualAction} />
              )}
            </div>

            <div className="grid gap-3 border-t border-white/10 bg-white/5 p-4 lg:grid-cols-[1fr_auto] lg:items-center">
              <p className="text-sm font-semibold leading-6 text-slate-100">{step.explanation}</p>
              <div className="rounded-md bg-green-100 px-4 py-3 text-green-950">
                <p className="text-xs font-black uppercase tracking-wide text-green-700">Final answer</p>
                <p className="mt-1 text-lg font-black">{examQuestion.finalAnswer}</p>
              </div>
            </div>
          </div>

          {examQuestion.alternativeApproaches?.length ? (
            <details className="mt-4 rounded-md border border-indigo-100 bg-indigo-50 p-4 text-indigo-950">
              <summary className="cursor-pointer text-sm font-black uppercase tracking-wide text-indigo-700">Show alternative method</summary>
              <div className="mt-4 grid gap-3 lg:grid-cols-2">
                {examQuestion.alternativeApproaches.map((method) => (
                  <article key={method.title} className="rounded-md bg-white p-4">
                    <h5 className="font-black">{method.title}</h5>
                    <p className="mt-2 text-sm leading-6">{method.whenToUse}</p>
                    <ol className="mt-3 space-y-2">
                      {method.steps.map((alternativeStep, index) => (
                        <li key={alternativeStep} className="flex gap-2 text-sm font-semibold leading-6">
                          <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-indigo-200 text-xs font-black">{index + 1}</span>
                          {alternativeStep}
                        </li>
                      ))}
                    </ol>
                  </article>
                ))}
              </div>
            </details>
          ) : null}
        </div>
      </div>
    </section>
  );
}

export function QuizEngine({ quiz, onComplete }: { quiz: QuizQuestion[]; onComplete: (score: number) => void }) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const score = quiz.filter((question) => answers[question.id] === question.answer).length;
  const complete = Object.keys(answers).length === quiz.length;

  return (
    <section className="rounded-lg border border-white/10 bg-white p-5 text-slate-950">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Quiz engine</p>
          <h3 className="text-xl font-black">Knowledge check</h3>
        </div>
        <span className="rounded-md bg-slate-950 px-4 py-2 text-sm font-black text-white">{score}/{quiz.length}</span>
      </div>
      <div className="mt-4 space-y-4">
        {quiz.map((question, index) => {
          const selected = answers[question.id];
          const correct = selected === question.answer;
          return (
            <article key={question.id} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <p className="font-bold">{index + 1}. {question.prompt}</p>
              <div className="mt-3 grid gap-2 md:grid-cols-2">
                {question.options.map((option) => (
                  <button key={option} onClick={() => setAnswers((current) => ({ ...current, [question.id]: option }))} className={`rounded-md border p-3 text-left text-sm font-semibold ${selected === option && correct ? 'border-green-400 bg-green-50 text-green-900' : selected === option ? 'border-red-300 bg-red-50 text-red-900' : 'border-slate-200 bg-white text-slate-800'}`}>
                    {option}
                  </button>
                ))}
              </div>
              {selected ? (
                <p className={`mt-3 flex gap-2 rounded-md p-3 text-sm leading-6 ${correct ? 'bg-green-50 text-green-900' : 'bg-red-50 text-red-900'}`}>
                  {correct ? <CheckCircle2 className="h-5 w-5 shrink-0" /> : <XCircle className="h-5 w-5 shrink-0" />}
                  {question.explanation}
                </p>
              ) : null}
            </article>
          );
        })}
      </div>
      <button disabled={!complete} onClick={() => onComplete(score)} className="mt-5 w-full rounded-lg bg-slate-950 px-5 py-3 font-bold text-white enabled:hover:bg-slate-800 disabled:opacity-40">
        Submit Quiz
      </button>
    </section>
  );
}

export function RewardSystem({ packageData, score }: { packageData: LessonVideoAssetPackage; score: number }) {
  return (
    <section className="relative overflow-hidden rounded-lg border border-amber-200/30 bg-slate-950 p-6 text-center text-white">
      <MotionGraphicsLayer progress={0.7} accent="#facc15" />
      <div className="relative mx-auto max-w-xl">
        <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-amber-200 text-slate-950 shadow-[0_0_55px_rgba(250,204,21,.42)]">
          <Award className="h-10 w-10" />
        </div>
        <h3 className="mt-5 text-3xl font-black">{packageData.reward.message}</h3>
        <p className="mt-2 text-slate-200">Quiz score: {score}/{packageData.quiz.length}</p>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg border border-white/10 bg-white/10 p-4">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-400">XP gained</p>
            <p className="mt-1 text-3xl font-black text-amber-100">+{packageData.reward.xp}</p>
          </div>
          <div className="rounded-lg border border-white/10 bg-white/10 p-4">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-400">Badge</p>
            <p className="mt-1 text-2xl font-black text-cyan-100">{packageData.reward.badge}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export function VideoExportTimeline({ packageData }: { packageData: LessonVideoAssetPackage }) {
  const [open, setOpen] = useState(false);
  return (
    <section className="rounded-lg border border-white/10 bg-slate-950 p-5 text-white">
      <button onClick={() => setOpen(!open)} className="flex w-full items-center justify-between gap-3 text-left">
        <span>
          <span className="block text-xs font-bold uppercase tracking-wide text-cyan-200">Video export timeline</span>
          <span className="mt-1 block text-xl font-black">Remotion-ready structure prepared</span>
        </span>
        <Clipboard className="h-6 w-6 text-amber-200" />
      </button>
      {open ? (
        <pre className="mt-4 max-h-96 overflow-auto rounded-lg bg-black p-4 text-xs leading-5 text-cyan-100">
          {JSON.stringify(packageData, null, 2)}
        </pre>
      ) : null}
    </section>
  );
}

export function CinematicLessonPlayer({ packageData }: { packageData: LessonVideoAssetPackage }) {
  const [activeSceneIndex, setActiveSceneIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [quizScore, setQuizScore] = useState<number | null>(null);
  const activeScene = packageData.scenes[activeSceneIndex];

  useEffect(() => {
    if (!isPlaying) return undefined;
    const timer = window.setInterval(() => {
      setProgress((current) => {
        if (current < 1) return current + 0.01;
        setActiveSceneIndex((index) => (index + 1 < packageData.scenes.length ? index + 1 : index));
        return 0;
      });
    }, 120);
    return () => window.clearInterval(timer);
  }, [isPlaying, packageData.scenes.length]);

  return (
    <div className="space-y-6 rounded-lg bg-slate-950 p-4 text-white md:p-6">
      <section className="relative overflow-hidden rounded-lg border border-cyan-200/20 bg-slate-950 p-6">
        <MotionGraphicsLayer progress={progress} />
        <div className="relative z-10 grid gap-5 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p className="inline-flex items-center gap-2 rounded-md border border-amber-200/30 bg-amber-200/10 px-3 py-2 text-xs font-bold uppercase tracking-wide text-amber-100">
              <Film className="h-4 w-4" />
              {packageData.subject} Grade {packageData.grade} cinematic lesson
            </p>
            <h1 className="mt-5 text-4xl font-black tracking-normal md:text-5xl">{packageData.title}</h1>
            <p className="mt-3 max-w-3xl text-lg leading-8 text-slate-200">{packageData.chapter} / {packageData.subtopic}</p>
          </div>
          <div className="rounded-lg border border-white/10 bg-white/10 p-4">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-400">Style</p>
            <p className="mt-1 max-w-sm text-sm font-semibold text-slate-100">{packageData.cinematicStyle}</p>
            {packageData.textbookReference ? (
              <p className="mt-3 rounded-md bg-slate-950 px-3 py-2 text-xs font-bold uppercase tracking-wide text-cyan-100">
                Textbook: {packageData.textbookReference}
              </p>
            ) : null}
          </div>
        </div>
      </section>

      <SceneTimelineEngine
        scenes={packageData.scenes}
        activeSceneIndex={activeSceneIndex}
        setActiveSceneIndex={setActiveSceneIndex}
        progress={progress}
        setProgress={setProgress}
        isPlaying={isPlaying}
        setIsPlaying={setIsPlaying}
      />

      <div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
        <ThreeDExplainerScene packageData={packageData} scene={activeScene} progress={progress} />
        <div className="space-y-6">
          <NarrationPanel scene={activeScene} isPlaying={isPlaying} />
          <section className="rounded-lg border border-white/10 bg-white/10 p-5">
            <p className="text-xs font-bold uppercase tracking-wide text-cyan-200">Animation steps</p>
            <ol className="mt-3 space-y-2">
              {activeScene.animationSteps.map((step, index) => (
                <li key={step} className="flex gap-3 text-sm leading-6 text-slate-200">
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-cyan-200 text-xs font-black text-slate-950">{index + 1}</span>
                  {step}
                </li>
              ))}
            </ol>
          </section>
        </div>
      </div>

      <InteractiveCheckpoint scene={activeScene} />
      <ExamQuestionCoach examQuestion={packageData.examQuestion} packageData={packageData} />
      <QuizEngine quiz={packageData.quiz} onComplete={(score) => setQuizScore(score)} />
      {quizScore !== null ? <RewardSystem packageData={packageData} score={quizScore} /> : null}
      <VideoExportTimeline packageData={packageData} />
    </div>
  );
}

export function LessonGenerator({ initialInput = defaultPlaceValueGeneratorInput }: { initialInput?: LessonGeneratorInput }) {
  const [input, setInput] = useState<LessonGeneratorInput>(initialInput);
  const packageData = useMemo(() => generateLessonAssetPackage(input), [input]);

  const updateField = (field: keyof LessonGeneratorInput, value: string) => {
    setInput((current) => ({
      ...current,
      [field]: field === 'grade' ? Number(value) : value,
    }));
  };

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-lg border border-[#49c8ff]/20 bg-[#050711] p-5 text-white shadow-[0_24px_80px_rgba(5,7,17,.18)]">
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-lg bg-[#ffc43b] text-[#061126]">
            <Wand2 className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-[#49c8ff]">AI 3D Lesson Generator</p>
            <h2 className="text-2xl font-black text-white">Generate cinematic, interactive maths explainers</h2>
          </div>
        </div>
        <p className="mt-4 max-w-4xl text-sm leading-7 text-slate-300">
          Build a teacher-ready 3D lesson with narration, visual actions, exam walkthroughs, student checkpoints, quiz feedback, reward moments and a video-ready scene timeline.
        </p>

        <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <label className="text-sm font-bold text-slate-200">
            Subject
            <input value={input.subject} onChange={(event) => updateField('subject', event.target.value)} className="mt-1 w-full rounded-md border border-white/10 bg-white px-3 py-2 font-medium text-slate-950" />
          </label>
          <label className="text-sm font-bold text-slate-200">
            Grade
            <input type="number" value={input.grade} onChange={(event) => updateField('grade', event.target.value)} className="mt-1 w-full rounded-md border border-white/10 bg-white px-3 py-2 font-medium text-slate-950" />
          </label>
          <label className="text-sm font-bold text-slate-200">
            Chapter
            <input value={input.chapter} onChange={(event) => updateField('chapter', event.target.value)} className="mt-1 w-full rounded-md border border-white/10 bg-white px-3 py-2 font-medium text-slate-950" />
          </label>
          <label className="text-sm font-bold text-slate-200">
            Subtopic
            <input value={input.subtopic} onChange={(event) => updateField('subtopic', event.target.value)} className="mt-1 w-full rounded-md border border-white/10 bg-white px-3 py-2 font-medium text-slate-950" />
          </label>
        </div>
      </section>

      <CinematicLessonPlayer packageData={packageData} />
    </div>
  );
}
