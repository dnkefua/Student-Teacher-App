'use client';

import React, { useMemo, useState } from 'react';
import { Beaker, RotateCcw, TestTube } from 'lucide-react';
import type { SubjectLesson } from '@/lib/subjects/types';

type Reagent = { id: string; name: string; strength: number; label: string };
const ACIDS: Reagent[] = [
  { id: 'hcl', name: 'Hydrochloric acid', strength: -3, label: 'Strong acid (HCl)' },
  { id: 'citric', name: 'Citric acid', strength: -1, label: 'Weak acid' },
];
const ALKALIS: Reagent[] = [
  { id: 'naoh', name: 'Sodium hydroxide', strength: +3, label: 'Strong alkali (NaOH)' },
  { id: 'ammonia', name: 'Ammonia solution', strength: +1, label: 'Weak alkali' },
];

function pHColor(ph: number): string {
  if (ph <= 2) return '#ef4444';
  if (ph <= 4) return '#fb923c';
  if (ph <= 6) return '#fbbf24';
  if (ph <= 8) return '#34d399';
  if (ph <= 10) return '#22d3ee';
  if (ph <= 12) return '#6366f1';
  return '#7c3aed';
}

export function ChemicalReactionLab({ lesson: _lesson }: { lesson: SubjectLesson }) {
  void _lesson;
  const [acid, setAcid] = useState<Reagent>(ACIDS[0]);
  const [alkali, setAlkali] = useState<Reagent>(ALKALIS[0]);
  const [acidMl, setAcidMl] = useState(10);
  const [alkaliMl, setAlkaliMl] = useState(0);

  const totalMl = acidMl + alkaliMl;
  // Volumetric weighted strength, mapped onto pH 0..14.
  const ph = useMemo(() => {
    if (totalMl === 0) return 7;
    const net = (acid.strength * acidMl + alkali.strength * alkaliMl) / totalMl;
    return Math.max(0, Math.min(14, 7 + net));
  }, [acid, alkali, acidMl, alkaliMl, totalMl]);

  const color = pHColor(ph);
  const reading = ph < 6 ? 'acidic' : ph > 8 ? 'alkaline' : 'neutral';

  const reset = () => {
    setAcid(ACIDS[0]);
    setAlkali(ALKALIS[0]);
    setAcidMl(10);
    setAlkaliMl(0);
  };

  return (
    <div className="flex h-full min-h-[460px] flex-col rounded-lg border border-white/10 bg-gradient-to-br from-[#062019] via-[#06121e] to-[#050711] p-5">
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-md border border-[#34d399]/40 bg-[#34d399]/10 px-2 py-1 text-[10px] font-black uppercase tracking-wide text-[#34d399]">
            <Beaker className="h-3 w-3" />
            Chemical Reaction Lab
          </div>
          <p className="mt-2 text-sm font-black text-white">Acid + Alkali → Salt + Water</p>
          <p className="text-[11px] text-slate-400">Mix volumes and watch universal indicator track pH.</p>
        </div>
        <button
          onClick={reset}
          className="inline-flex items-center gap-1 rounded-md border border-white/15 px-2 py-1 text-[10px] font-black uppercase tracking-wide text-slate-300 transition hover:border-white/40 hover:text-white"
        >
          <RotateCcw className="h-3 w-3" />
          Reset
        </button>
      </div>

      <div className="mt-3 grid gap-3 lg:grid-cols-[1fr_1fr]">
        <div className="space-y-2">
          <Picker label="Acid" options={ACIDS} value={acid} onChange={setAcid} accent="#fb7185" />
          <Slider label="Acid (mL)" value={acidMl} min={0} max={50} onChange={setAcidMl} accent="#fb7185" />
          <Picker label="Alkali" options={ALKALIS} value={alkali} onChange={setAlkali} accent="#22d3ee" />
          <Slider label="Alkali (mL)" value={alkaliMl} min={0} max={50} onChange={setAlkaliMl} accent="#22d3ee" />
        </div>
        <div className="flex flex-col items-center justify-center rounded-md border border-white/10 bg-[#050711] p-4">
          <div
            className="grid h-32 w-20 place-items-end overflow-hidden rounded-b-md border border-white/15 transition-all"
            style={{ background: `linear-gradient(180deg, transparent 30%, ${color} 80%)`, boxShadow: `0 0 30px ${color}55` }}
          >
            <TestTube className="-mb-1 h-6 w-6 text-white/70" />
          </div>
          <p className="mt-3 text-[10px] font-black uppercase tracking-wide text-slate-400">pH</p>
          <p className="text-3xl font-black" style={{ color }}>{ph.toFixed(1)}</p>
          <p className="mt-1 text-[11px] font-bold uppercase tracking-wide" style={{ color }}>{reading}</p>
        </div>
      </div>

      <div className="mt-3 rounded-md border border-white/10 bg-white/[.02] p-3 text-[11px] leading-5 text-slate-300">
        <p>
          <span className="font-black text-white">Word equation · </span>
          {acid.name.toLowerCase()} + {alkali.name.toLowerCase()} → salt + water
        </p>
        <p className="mt-1 text-slate-400">
          When pH ≈ 7 with both reagents present, the reaction has neutralised: H⁺ + OH⁻ → H₂O.
        </p>
      </div>
    </div>
  );
}

function Picker({
  label, options, value, onChange, accent,
}: { label: string; options: Reagent[]; value: Reagent; onChange: (r: Reagent) => void; accent: string }) {
  return (
    <div>
      <p className="text-[10px] font-black uppercase tracking-wide" style={{ color: accent }}>{label}</p>
      <div className="mt-1 flex flex-wrap gap-1.5">
        {options.map((o) => {
          const active = value.id === o.id;
          return (
            <button
              key={o.id}
              onClick={() => onChange(o)}
              className="rounded-md border px-2 py-1 text-[11px] font-black uppercase tracking-wide transition"
              style={{
                borderColor: active ? accent : 'rgba(255,255,255,.15)',
                background: active ? `${accent}22` : 'transparent',
                color: active ? accent : '#cbd5e1',
              }}
            >
              {o.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function Slider({
  label, value, min, max, onChange, accent,
}: { label: string; value: number; min: number; max: number; onChange: (v: number) => void; accent: string }) {
  return (
    <div>
      <div className="flex items-center justify-between text-[11px] font-bold text-slate-300">
        <span>{label}</span>
        <span style={{ color: accent }}>{value} mL</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-1 w-full"
        style={{ accentColor: accent }}
      />
    </div>
  );
}
