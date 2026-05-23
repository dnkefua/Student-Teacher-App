'use client';

import Image from 'next/image';
import React, { useState } from 'react';
import { ArrowRight, Compass } from 'lucide-react';
import { ClientPage } from '@/components/ClientPage';

const brandLogoSrc = '/eis-maths-studio-logo.png';

/**
 * EIS Maths Studio — Grade 8 MYP Course Map landing page.
 *
 * A 3D cinematic glassmorphic experience that mirrors the official course
 * map: a rotating compass at the centre with four bearings, each holding
 * a glass card for one of the four MYP reasoning strands:
 *
 *     N  Numerical & Abstract Reasoning  (blue · crystals)
 *     E  Thinking with Models            (green · bridge)
 *     S  Spatial Reasoning               (orange · solids)
 *     W  Reasoning with Data             (purple · charts)
 *
 * Everything is plain Tailwind + CSS-keyframe animation so it stays light:
 * no R3F bundle, no extra dependency. Glassmorphism via backdrop-blur and
 * white-alpha gradients on a soft mesh background.
 */

type Bearing = 'N' | 'E' | 'S' | 'W';
type Strand = {
  bearing: Bearing;
  title: string;
  subtitle: string;
  topics: string[];
  /** Tailwind accent classes for the card. */
  accent: { ring: string; chip: string; chipText: string; glow: string; gradient: string };
  illustration: 'crystals' | 'bridge' | 'solids' | 'charts';
};

const STRANDS: Strand[] = [
  {
    bearing: 'N',
    title: 'Numerical & Abstract Reasoning',
    subtitle: 'Number sense, ratio, algebra, equations',
    topics: ['Number sense & operations', 'Equivalence & representation', 'Proportional reasoning', 'Solving equations & inequalities'],
    accent: {
      ring: 'ring-sky-400/40',
      chip: 'bg-sky-400/20',
      chipText: 'text-sky-200',
      glow: 'shadow-[0_30px_90px_-20px_rgba(56,189,248,0.55)]',
      gradient: 'from-sky-400/30 via-sky-500/15 to-blue-600/10',
    },
    illustration: 'crystals',
  },
  {
    bearing: 'E',
    title: 'Thinking with Models',
    subtitle: 'Functions, graphs, transformations',
    topics: ['Representation & shape of functions', 'Linear functions', 'Quadratic & exponential models', 'Transformations of functions'],
    accent: {
      ring: 'ring-emerald-400/40',
      chip: 'bg-emerald-400/20',
      chipText: 'text-emerald-200',
      glow: 'shadow-[0_30px_90px_-20px_rgba(52,211,153,0.55)]',
      gradient: 'from-emerald-400/30 via-emerald-500/15 to-teal-600/10',
    },
    illustration: 'bridge',
  },
  {
    bearing: 'S',
    title: 'Spatial Reasoning',
    subtitle: 'Shape, space, transformations',
    topics: ['Visualisation of 3D shapes', 'Surface area & volume', 'Transformations', 'Similarity & congruency'],
    accent: {
      ring: 'ring-amber-400/40',
      chip: 'bg-amber-400/20',
      chipText: 'text-amber-200',
      glow: 'shadow-[0_30px_90px_-20px_rgba(251,191,36,0.55)]',
      gradient: 'from-amber-400/30 via-orange-500/15 to-rose-600/10',
    },
    illustration: 'solids',
  },
  {
    bearing: 'W',
    title: 'Reasoning with Data',
    subtitle: 'Statistics & probability',
    topics: ['Data collection & analysis', 'Measures of central tendency', 'Data distribution', 'Probability'],
    accent: {
      ring: 'ring-fuchsia-400/40',
      chip: 'bg-fuchsia-400/20',
      chipText: 'text-fuchsia-200',
      glow: 'shadow-[0_30px_90px_-20px_rgba(217,70,239,0.55)]',
      gradient: 'from-fuchsia-400/30 via-purple-500/15 to-violet-600/10',
    },
    illustration: 'charts',
  },
];

const CRITERIA = [
  { tag: 'A', label: 'Knowing & Understanding' },
  { tag: 'B', label: 'Investigating Patterns' },
  { tag: 'C', label: 'Communicating' },
  { tag: 'D', label: 'Applying in Real-Life' },
];

// ── SVG illustrations ─────────────────────────────────────────────────

function Crystals() {
  return (
    <svg viewBox="0 0 200 140" className="h-full w-full">
      <defs>
        <linearGradient id="cryA" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#7dd3fc" />
          <stop offset="1" stopColor="#0c4a6e" />
        </linearGradient>
        <linearGradient id="cryB" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#bae6fd" stopOpacity="0.9" />
          <stop offset="1" stopColor="#1e40af" stopOpacity="0.4" />
        </linearGradient>
      </defs>
      <polygon points="60,120 75,40 95,30 110,120" fill="url(#cryA)" stroke="#7dd3fc" strokeWidth="0.8" />
      <polygon points="60,120 110,120 95,30" fill="url(#cryB)" opacity="0.7" />
      <polygon points="100,120 120,55 140,50 155,120" fill="url(#cryA)" stroke="#7dd3fc" strokeWidth="0.8" />
      <polygon points="100,120 155,120 140,50" fill="url(#cryB)" opacity="0.6" />
      <polygon points="135,125 150,85 165,80 175,125" fill="url(#cryA)" stroke="#7dd3fc" strokeWidth="0.8" />
    </svg>
  );
}

function Bridge() {
  return (
    <svg viewBox="0 0 200 140" className="h-full w-full">
      <defs>
        <linearGradient id="brSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#34d399" stopOpacity="0.6" />
          <stop offset="1" stopColor="#0f172a" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="200" height="140" fill="url(#brSky)" opacity="0.4" />
      {/* deck */}
      <path d="M 10 95 Q 100 30 190 95" stroke="#a7f3d0" strokeWidth="2.5" fill="none" />
      <line x1="10" y1="95" x2="190" y2="95" stroke="#6ee7b7" strokeWidth="3" />
      {/* cables */}
      <g stroke="#34d399" strokeWidth="0.6" opacity="0.7">
        <line x1="30" y1="95" x2="35" y2="62" />
        <line x1="55" y1="95" x2="60" y2="52" />
        <line x1="80" y1="95" x2="85" y2="46" />
        <line x1="105" y1="95" x2="115" y2="46" />
        <line x1="130" y1="95" x2="135" y2="50" />
        <line x1="155" y1="95" x2="160" y2="58" />
      </g>
      {/* towers */}
      <rect x="48" y="40" width="4" height="55" fill="#34d399" />
      <rect x="148" y="40" width="4" height="55" fill="#34d399" />
      {/* graph line on the deck representing 'model' */}
      <path d="M 20 120 Q 60 100 100 110 T 180 90" stroke="#facc15" strokeWidth="1.5" fill="none" opacity="0.9" />
      <circle cx="180" cy="90" r="3" fill="#facc15" />
    </svg>
  );
}

function Solids() {
  return (
    <svg viewBox="0 0 200 140" className="h-full w-full">
      <defs>
        <linearGradient id="slFace" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fbbf24" stopOpacity="0.9" />
          <stop offset="1" stopColor="#7c2d12" stopOpacity="0.5" />
        </linearGradient>
      </defs>
      {/* cube isometric */}
      <g transform="translate(35 35)">
        <polygon points="0,30 30,15 60,30 30,45" fill="url(#slFace)" stroke="#fcd34d" />
        <polygon points="0,30 0,70 30,85 30,45" fill="#b45309" stroke="#fcd34d" opacity="0.8" />
        <polygon points="60,30 60,70 30,85 30,45" fill="#92400e" stroke="#fcd34d" opacity="0.8" />
      </g>
      {/* pyramid */}
      <g transform="translate(110 35)">
        <polygon points="30,5 0,75 60,75" fill="url(#slFace)" stroke="#fcd34d" />
        <polygon points="30,5 60,75 75,55" fill="#b45309" stroke="#fcd34d" opacity="0.8" />
      </g>
      {/* sphere */}
      <g transform="translate(150 80)">
        <circle r="22" fill="url(#slFace)" stroke="#fcd34d" />
        <ellipse cx="-4" cy="-6" rx="8" ry="3" fill="#fef3c7" opacity="0.6" />
      </g>
    </svg>
  );
}

function Charts() {
  return (
    <svg viewBox="0 0 200 140" className="h-full w-full">
      <defs>
        <linearGradient id="chBar" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#a78bfa" />
          <stop offset="1" stopColor="#f0abfc" />
        </linearGradient>
      </defs>
      {/* axis */}
      <line x1="20" y1="115" x2="180" y2="115" stroke="#c4b5fd" strokeWidth="1" />
      <line x1="20" y1="115" x2="20" y2="25" stroke="#c4b5fd" strokeWidth="1" />
      {/* bars */}
      <rect x="35" y="80" width="18" height="35" rx="2" fill="url(#chBar)" />
      <rect x="62" y="60" width="18" height="55" rx="2" fill="url(#chBar)" />
      <rect x="89" y="45" width="18" height="70" rx="2" fill="url(#chBar)" />
      <rect x="116" y="55" width="18" height="60" rx="2" fill="url(#chBar)" />
      <rect x="143" y="35" width="18" height="80" rx="2" fill="url(#chBar)" />
      {/* trend line */}
      <path d="M 44 80 L 71 60 L 98 45 L 125 55 L 152 35" stroke="#facc15" strokeWidth="2" fill="none" strokeLinecap="round" />
      <circle cx="44" cy="80" r="3" fill="#facc15" />
      <circle cx="71" cy="60" r="3" fill="#facc15" />
      <circle cx="98" cy="45" r="3" fill="#facc15" />
      <circle cx="125" cy="55" r="3" fill="#facc15" />
      <circle cx="152" cy="35" r="3" fill="#facc15" />
    </svg>
  );
}

function Illustration({ kind }: { kind: Strand['illustration'] }) {
  if (kind === 'crystals') return <Crystals />;
  if (kind === 'bridge') return <Bridge />;
  if (kind === 'solids') return <Solids />;
  return <Charts />;
}

// ── 3D animated compass rose ─────────────────────────────────────────

function CompassRose() {
  return (
    <div className="relative grid h-72 w-72 place-items-center md:h-80 md:w-80">
      {/* concentric rings */}
      <div className="absolute inset-0 rounded-full border border-white/10 bg-white/5 backdrop-blur-xl" />
      <div className="absolute inset-2 rounded-full border border-white/15" />
      <div className="absolute inset-6 rounded-full border border-white/10" />

      {/* spinning rose */}
      <svg
        viewBox="-100 -100 200 200"
        className="absolute inset-0 h-full w-full animate-[spin_60s_linear_infinite]"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="needleA" x1="0" y1="-1" x2="0" y2="1">
            <stop offset="0" stopColor="#f43f5e" />
            <stop offset="0.5" stopColor="#ffffff" />
            <stop offset="1" stopColor="#3b82f6" />
          </linearGradient>
        </defs>
        {/* N-S needle */}
        <polygon points="0,-80 8,0 0,80 -8,0" fill="url(#needleA)" stroke="#fff" strokeWidth="0.5" />
        {/* E-W needle (rotated) */}
        <polygon points="0,-80 8,0 0,80 -8,0" fill="url(#needleA)" stroke="#fff" strokeWidth="0.5" opacity="0.7" transform="rotate(90)" />
        {/* diagonal accents */}
        <g opacity="0.5">
          <polygon points="0,-55 4,0 0,55 -4,0" fill="#fde047" transform="rotate(45)" />
          <polygon points="0,-55 4,0 0,55 -4,0" fill="#fde047" transform="rotate(135)" />
        </g>
        {/* tick marks */}
        {Array.from({ length: 36 }).map((_, i) => (
          <line
            key={i}
            x1="0"
            y1="-90"
            x2="0"
            y2={i % 9 === 0 ? -82 : -86}
            stroke="#ffffff"
            strokeOpacity={i % 9 === 0 ? 0.8 : 0.3}
            strokeWidth={i % 9 === 0 ? 1.5 : 0.6}
            transform={`rotate(${i * 10})`}
          />
        ))}
      </svg>

      {/* fixed cardinal letters above the spinning rose */}
      <div className="absolute inset-0">
        <span className="absolute left-1/2 top-3 -translate-x-1/2 text-[11px] font-black tracking-[0.4em] text-white/80">N</span>
        <span className="absolute bottom-3 left-1/2 -translate-x-1/2 text-[11px] font-black tracking-[0.4em] text-white/80">S</span>
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[11px] font-black tracking-[0.4em] text-white/80">W</span>
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-black tracking-[0.4em] text-white/80">E</span>
      </div>

      {/* centre disc */}
      <div className="relative grid h-40 w-40 place-items-center rounded-full border border-white/20 bg-gradient-to-br from-[#1e3a8a]/80 via-[#5b21b6]/70 to-[#831843]/70 shadow-[inset_0_0_40px_rgba(255,255,255,0.15)] backdrop-blur-xl">
        <div className="text-center">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/60">EIS · Grade 8</p>
          <p className="mt-1 bg-gradient-to-r from-sky-200 via-white to-fuchsia-200 bg-clip-text text-base font-black text-transparent">
            MYP Mathematics
          </p>
          <p className="mt-1 text-[9px] font-bold uppercase tracking-widest text-white/50">Course Map</p>
        </div>
      </div>
    </div>
  );
}

// ── Strand card ──────────────────────────────────────────────────────

function StrandCard({ strand, index }: { strand: Strand; index: number }) {
  return (
    <article
      className={`group relative overflow-hidden rounded-3xl border border-white/15 bg-white/5 p-6 backdrop-blur-2xl transition-all duration-500 hover:-translate-y-1 hover:bg-white/[0.08] ${strand.accent.glow}`}
      style={{
        animation: `landing-float 8s ease-in-out ${index * 1.3}s infinite`,
      }}
    >
      {/* gradient halo */}
      <div className={`pointer-events-none absolute -inset-1 bg-gradient-to-br ${strand.accent.gradient} opacity-60 blur-2xl`} />

      <div className="relative">
        <div className="flex items-start justify-between gap-3">
          <span
            className={`inline-flex h-9 w-9 items-center justify-center rounded-full font-black text-white ring-2 ${strand.accent.ring} bg-white/10`}
            aria-hidden="true"
          >
            {strand.bearing}
          </span>
          <span className={`rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-widest ${strand.accent.chip} ${strand.accent.chipText}`}>
            Strand
          </span>
        </div>

        <h3 className="mt-4 text-lg font-black text-white">{strand.title}</h3>
        <p className="mt-1 text-xs text-slate-300">{strand.subtitle}</p>

        {/* Illustration */}
        <div className="mt-4 h-32 overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/10 to-black/30 p-2">
          <Illustration kind={strand.illustration} />
        </div>

        <ul className="mt-4 space-y-1.5">
          {strand.topics.map((topic) => (
            <li key={topic} className="flex items-start gap-2 text-xs text-slate-200">
              <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${strand.accent.chip}`} />
              <span>{topic}</span>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}

// ── Main export ──────────────────────────────────────────────────────

export function LandingPage() {
  const [showPlatform, setShowPlatform] = useState(false);

  if (showPlatform) {
    return <ClientPage />;
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#040711] text-white">
      {/* ──────── ambient backdrop ──────── */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        {/* soft mesh gradient */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_18%,rgba(56,189,248,0.22),transparent_45%),radial-gradient(circle_at_85%_22%,rgba(52,211,153,0.18),transparent_45%),radial-gradient(circle_at_18%_85%,rgba(251,191,36,0.18),transparent_42%),radial-gradient(circle_at_85%_85%,rgba(217,70,239,0.20),transparent_45%)]" />
        {/* faint grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,.08)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,.08)_1px,transparent_1px)] bg-[size:60px_60px]" />
        {/* floating orbs */}
        <div className="absolute left-[10%] top-[20%] h-64 w-64 rounded-full bg-sky-500/20 blur-3xl" style={{ animation: 'landing-float 14s ease-in-out infinite' }} />
        <div className="absolute right-[8%] top-[15%] h-72 w-72 rounded-full bg-emerald-500/20 blur-3xl" style={{ animation: 'landing-float 16s ease-in-out 2s infinite' }} />
        <div className="absolute left-[12%] bottom-[12%] h-72 w-72 rounded-full bg-amber-500/20 blur-3xl" style={{ animation: 'landing-float 18s ease-in-out 1s infinite' }} />
        <div className="absolute right-[10%] bottom-[12%] h-72 w-72 rounded-full bg-fuchsia-500/20 blur-3xl" style={{ animation: 'landing-float 15s ease-in-out 3s infinite' }} />
      </div>

      {/* ──────── top bar ──────── */}
      <header className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8">
        <div className="flex items-center gap-3">
          <div className="relative h-10 w-10 overflow-hidden rounded-xl border border-white/20 bg-white/10 backdrop-blur-xl">
            <Image src={brandLogoSrc} alt="EIS Maths Studio" fill sizes="40px" />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/70">Emirates International School</p>
            <p className="text-sm font-black text-white">Maths Studio · Jumeirah</p>
          </div>
        </div>
        <button
          onClick={() => setShowPlatform(true)}
          className="group inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-widest text-white backdrop-blur-xl transition hover:border-white/40 hover:bg-white/20"
        >
          Enter platform
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
        </button>
      </header>

      {/* ──────── hero copy ──────── */}
      <section className="relative z-10 mx-auto max-w-5xl px-5 pt-6 text-center sm:px-8 sm:pt-12">
        <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-3 py-1 text-[10px] font-black uppercase tracking-[0.4em] text-white/70 backdrop-blur-xl">
          <Compass className="h-3.5 w-3.5" />
          Year 8 MYP · Course Map
        </span>
        <h1 className="mt-5 text-3xl font-black leading-tight tracking-tight text-white sm:text-5xl">
          One platform.{' '}
          <span className="bg-gradient-to-r from-sky-300 via-fuchsia-200 to-amber-200 bg-clip-text text-transparent">
            Four reasoning strands.
          </span>{' '}
          The whole Grade 8 curriculum.
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
          Worked solutions, interactive 3D labs, read-aloud lessons and a built-in
          assignment loop — all aligned to the four MYP reasoning strands and the
          four assessment criteria.
        </p>
      </section>

      {/* ──────── compass + strand grid ──────── */}
      <section className="relative z-10 mx-auto mt-10 max-w-7xl px-5 sm:mt-14 sm:px-8">
        <div className="relative grid gap-5 lg:grid-cols-[1fr_auto_1fr] lg:gap-8">
          {/* left column: N (top), W (bottom) */}
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1 lg:gap-8">
            <StrandCard strand={STRANDS[0]} index={0} />
            <StrandCard strand={STRANDS[3]} index={3} />
          </div>

          {/* centre compass */}
          <div className="order-first flex justify-center self-center lg:order-none">
            <CompassRose />
          </div>

          {/* right column: E (top), S (bottom) */}
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1 lg:gap-8">
            <StrandCard strand={STRANDS[1]} index={1} />
            <StrandCard strand={STRANDS[2]} index={2} />
          </div>
        </div>
      </section>

      {/* ──────── assessment criteria strip ──────── */}
      <section className="relative z-10 mx-auto mt-12 max-w-5xl px-5 sm:mt-16 sm:px-8">
        <div className="rounded-3xl border border-white/15 bg-white/5 p-5 backdrop-blur-2xl">
          <div className="mb-3 flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/60">
              Assessment Objectives
            </span>
            <span className="h-px flex-1 bg-gradient-to-r from-white/20 to-transparent" />
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {CRITERIA.map((c) => (
              <div
                key={c.tag}
                className="group flex items-center gap-3 rounded-2xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5 px-3 py-3 transition hover:border-white/30"
              >
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-gradient-to-br from-sky-400 to-fuchsia-400 text-xs font-black text-slate-900">
                  {c.tag}
                </span>
                <span className="text-xs font-bold text-white">{c.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ──────── CTA ──────── */}
      <section className="relative z-10 mx-auto mt-12 max-w-3xl px-5 pb-16 text-center sm:mt-16 sm:px-8 sm:pb-24">
        <button
          onClick={() => setShowPlatform(true)}
          className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-gradient-to-r from-sky-400 via-fuchsia-400 to-amber-300 px-8 py-4 text-sm font-black uppercase tracking-widest text-slate-950 shadow-[0_30px_80px_-20px_rgba(217,70,239,0.6)] transition hover:shadow-[0_30px_100px_-15px_rgba(217,70,239,0.8)]"
        >
          <span className="relative">Enter the studio</span>
          <ArrowRight className="relative h-4 w-4 transition-transform group-hover:translate-x-1" />
          <span className="absolute inset-0 -translate-x-full bg-white/40 transition-transform duration-700 group-hover:translate-x-full" />
        </button>
        <p className="mt-4 text-[10px] font-black uppercase tracking-[0.4em] text-white/40">
          Built for Emirates International School · Jumeirah
        </p>
      </section>

      {/* ──────── animation keyframes ──────── */}
      <style jsx>{`
        @keyframes landing-float {
          0%, 100% { transform: translateY(0px); }
          50%      { transform: translateY(-12px); }
        }
      `}</style>
    </main>
  );
}
