'use client';

import Image from 'next/image';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowRight,
  Atom,
  BookOpen,
  Calculator,
  CheckCircle2,
  FlaskConical,
  GraduationCap,
  Layers3,
  Sparkles,
  Volume2,
  type LucideIcon,
} from 'lucide-react';
import { ClientPage } from '@/components/ClientPage';

const brandLogoSrc = '/eis-maths-studio-logo.png';

/**
 * EIS Learning Studio — Grade 8 platform landing page.
 *
 * A 3D cinematic glassmorphic experience that surfaces all three subjects
 * the platform actually delivers — Mathematics, Science and English —
 * with mouse-parallax tilt on every floating card and an animated
 * subject hub at the centre.
 *
 * Pure Tailwind + a small block of CSS keyframes. No R3F bundle, no
 * extra dependency.
 */

// ── Subject data ──────────────────────────────────────────────────────

type SubjectMeta = {
  id: 'math' | 'science' | 'english';
  name: string;
  tagline: string;
  units: string;
  icon: LucideIcon;
  /** Two-tone Tailwind colours for gradient surfaces. */
  from: string;
  to: string;
  /** Soft-glow shadow colour as `rgb` text for inline style. */
  glow: string;
  topics: string[];
};

const SUBJECTS: SubjectMeta[] = [
  {
    id: 'math',
    name: 'Mathematics',
    tagline: 'Grade 8 MYP · Four reasoning strands',
    units: '4 strands · 60+ worked examples',
    icon: Calculator,
    from: 'from-sky-400',
    to: 'to-blue-700',
    glow: '14,165,233',
    topics: [
      'Numerical & abstract reasoning',
      'Thinking with models',
      'Spatial reasoning',
      'Reasoning with data',
    ],
  },
  {
    id: 'science',
    name: 'Science',
    tagline: 'Year 8 · Biology · Chemistry · Physics',
    units: '6 units · 13 labelled diagrams · 3D labs',
    icon: FlaskConical,
    from: 'from-emerald-400',
    to: 'to-teal-700',
    glow: '52,211,153',
    topics: [
      'Cells, digestion, circulation',
      'Atoms & states of matter',
      'Ecology — food chains & webs',
      'Waves, energy & photosynthesis',
    ],
  },
  {
    id: 'english',
    name: 'English',
    tagline: 'Year 8 · Language, literature & analysis',
    units: '5 units · Interactive ad-analysis lab',
    icon: BookOpen,
    from: 'from-fuchsia-400',
    to: 'to-rose-700',
    glow: '232,121,249',
    topics: [
      'Advertising & persuasion',
      'The novel',
      'Voices in verse',
      'Language, film & Shakespeare',
    ],
  },
];

// ── Stats and features ───────────────────────────────────────────────

const STATS = [
  { value: 3, label: 'Subjects', suffix: '' },
  { value: 15, label: 'Units', suffix: '' },
  { value: 60, label: 'Worked examples', suffix: '+' },
  { value: 13, label: 'Labelled diagrams', suffix: '' },
];

type Feature = { title: string; copy: string; icon: LucideIcon; tone: string };
const FEATURES: Feature[] = [
  { title: 'Step-by-step worked solutions', copy: 'Every example walks the student through the WHY and the working line in a clean serif math display.', icon: CheckCircle2, tone: 'from-sky-400/40 to-blue-600/20' },
  { title: '3D interactive labs', copy: 'Particle model, McDonald\'s persuasive-devices lab, food webs — touch and explore.', icon: Atom, tone: 'from-emerald-400/40 to-teal-600/20' },
  { title: 'Read-aloud narration', copy: 'Browser-native TTS with a hand-picked neural voice for every concept.', icon: Volume2, tone: 'from-fuchsia-400/40 to-purple-600/20' },
  { title: 'Teacher → student loop', copy: 'Post assignments, students submit, completion tracked in real time.', icon: GraduationCap, tone: 'from-amber-400/40 to-orange-600/20' },
  { title: 'Labelled SVG diagrams', copy: 'Every science subtopic ships with a clean labelled diagram authored in code.', icon: Layers3, tone: 'from-cyan-400/40 to-sky-600/20' },
  { title: 'Built for Grade 8 IB MYP', copy: 'Aligned to the four assessment criteria from day one.', icon: Sparkles, tone: 'from-rose-400/40 to-fuchsia-600/20' },
];

const CRITERIA = [
  { tag: 'A', label: 'Knowing & Understanding' },
  { tag: 'B', label: 'Investigating Patterns' },
  { tag: 'C', label: 'Communicating' },
  { tag: 'D', label: 'Applying in Real-Life' },
];

// ── Hooks ────────────────────────────────────────────────────────────

/** Tracks normalised mouse position (-1 … +1) for 3D parallax. */
function useMouseParallax() {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handle = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = (e.clientY / window.innerHeight) * 2 - 1;
      setPos({ x, y });
    };
    window.addEventListener('mousemove', handle);
    return () => window.removeEventListener('mousemove', handle);
  }, []);
  return pos;
}

/** Animated count-up from 0 to `target` over `durationMs`. */
function useCountUp(target: number, durationMs = 1500): number {
  const [value, setValue] = useState(0);
  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const elapsed = now - start;
      const ratio = Math.min(1, elapsed / durationMs);
      // ease-out
      const eased = 1 - Math.pow(1 - ratio, 3);
      setValue(Math.round(target * eased));
      if (ratio < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, durationMs]);
  return value;
}

// ── Background ───────────────────────────────────────────────────────

/** Random particle field — purely cosmetic. Memoised so positions don't
 *  shuffle on every re-render. */
function ParticleField({ count = 60 }: { count?: number }) {
  const seeds = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => {
        const rnd = (n: number) => ((Math.sin(i * 99.9 + n) + 1) / 2);
        return {
          left: rnd(1) * 100,
          top: rnd(2) * 100,
          size: 1 + rnd(3) * 2.5,
          delay: rnd(4) * 12,
          duration: 8 + rnd(5) * 10,
          opacity: 0.2 + rnd(6) * 0.5,
        };
      }),
    [count],
  );
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {seeds.map((s, i) => (
        <span
          key={i}
          className="absolute rounded-full bg-white"
          style={{
            left: `${s.left}%`,
            top: `${s.top}%`,
            width: `${s.size}px`,
            height: `${s.size}px`,
            opacity: s.opacity,
            animation: `landing-twinkle ${s.duration}s ease-in-out ${s.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

// ── 3D Subject Hub (centre) ──────────────────────────────────────────

/** Animated central hub that pulses behind the subject cards. */
function StudioHub({ mouse }: { mouse: { x: number; y: number } }) {
  return (
    <div
      className="relative grid h-80 w-80 place-items-center md:h-96 md:w-96"
      style={{
        transform: `perspective(1200px) rotateX(${mouse.y * -4}deg) rotateY(${mouse.x * 4}deg)`,
        transition: 'transform 0.25s ease-out',
      }}
    >
      {/* spinning conic gradient ring */}
      <div
        className="absolute inset-0 rounded-full opacity-40"
        style={{
          background:
            'conic-gradient(from 0deg, rgba(56,189,248,0), rgba(56,189,248,0.6), rgba(52,211,153,0.6), rgba(217,70,239,0.6), rgba(251,191,36,0.6), rgba(56,189,248,0))',
          animation: 'landing-spin 30s linear infinite',
          filter: 'blur(8px)',
        }}
      />
      {/* counter-spinning ring */}
      <div
        className="absolute inset-6 rounded-full opacity-30"
        style={{
          background:
            'conic-gradient(from 180deg, rgba(232,121,249,0.5), rgba(56,189,248,0.5), rgba(52,211,153,0.5), rgba(232,121,249,0.5))',
          animation: 'landing-spin 45s linear infinite reverse',
          filter: 'blur(10px)',
        }}
      />

      {/* glass rings */}
      <div className="absolute inset-2 rounded-full border border-white/15" />
      <div className="absolute inset-8 rounded-full border border-white/10" />
      <div className="absolute inset-14 rounded-full border border-white/20" />

      {/* orbital ticks */}
      <svg className="absolute inset-0 h-full w-full animate-[landing-spin_50s_linear_infinite]" viewBox="-100 -100 200 200">
        {Array.from({ length: 60 }).map((_, i) => (
          <line
            key={i}
            x1="0"
            y1="-94"
            x2="0"
            y2={i % 5 === 0 ? -86 : -90}
            stroke="#ffffff"
            strokeOpacity={i % 5 === 0 ? 0.6 : 0.2}
            strokeWidth={i % 5 === 0 ? 1.2 : 0.5}
            transform={`rotate(${i * 6})`}
          />
        ))}
      </svg>

      {/* central glass disc */}
      <div className="relative grid h-44 w-44 place-items-center rounded-full border border-white/30 bg-gradient-to-br from-[#0c4a6e]/70 via-[#5b21b6]/70 to-[#831843]/70 shadow-[inset_0_0_50px_rgba(255,255,255,0.2),0_0_80px_rgba(217,70,239,0.4)] backdrop-blur-xl">
        <div className="text-center">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/60">
            EIS Jumeirah
          </p>
          <p className="mt-1 bg-gradient-to-r from-sky-200 via-white to-fuchsia-200 bg-clip-text text-lg font-black text-transparent">
            Learning Studio
          </p>
          <p className="mt-1 text-[9px] font-bold uppercase tracking-widest text-white/50">
            Grade 8 · One Platform
          </p>
        </div>
      </div>

      {/* orbiting subject motes */}
      {SUBJECTS.map((s, idx) => {
        const angle = (idx * 360) / SUBJECTS.length;
        return (
          <div
            key={s.id}
            className="absolute inset-0"
            style={{ transform: `rotate(${angle}deg)`, animation: 'landing-spin 25s linear infinite' }}
          >
            <div
              className={`absolute left-1/2 top-1 -translate-x-1/2 grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br ${s.from} ${s.to} shadow-lg ring-2 ring-white/40`}
              style={{ animation: 'landing-spin 25s linear infinite reverse' }}
            >
              <s.icon className="h-4 w-4 text-white" />
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── Subject card with parallax tilt ──────────────────────────────────

function SubjectCard({
  subject,
  mouse,
  index,
}: {
  subject: SubjectMeta;
  mouse: { x: number; y: number };
  index: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  const Icon = subject.icon;

  // Per-card tilt amplified when hovered; each card gets a slightly
  // different baseline angle so they don't all mirror each other.
  const baseRotate = (index - 1) * 6; // -6, 0, +6
  const tiltX = mouse.y * (hovered ? -12 : -4);
  const tiltY = mouse.x * (hovered ? 14 : 6) + baseRotate;

  return (
    <div
      ref={cardRef}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative cursor-pointer"
      style={{
        transform: `perspective(1400px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(${hovered ? -8 : 0}px)`,
        transition: 'transform 0.35s cubic-bezier(0.2, 0.8, 0.2, 1)',
        animation: `landing-float 9s ease-in-out ${index * 1.4}s infinite`,
        transformStyle: 'preserve-3d',
      }}
    >
      {/* outer glow */}
      <div
        className="pointer-events-none absolute -inset-4 rounded-3xl opacity-60 blur-2xl"
        style={{
          background: `radial-gradient(circle at 50% 50%, rgba(${subject.glow}, 0.5) 0%, transparent 70%)`,
        }}
      />

      <article
        className={`relative overflow-hidden rounded-3xl border border-white/20 bg-white/[0.07] p-6 backdrop-blur-2xl transition-all duration-500 ${
          hovered ? 'border-white/40 bg-white/[0.12]' : ''
        }`}
        style={{
          boxShadow: hovered
            ? `0 50px 120px -20px rgba(${subject.glow}, 0.6), inset 0 1px 0 rgba(255,255,255,0.15)`
            : `0 30px 90px -25px rgba(${subject.glow}, 0.4), inset 0 1px 0 rgba(255,255,255,0.1)`,
        }}
      >
        {/* gradient halo behind icon */}
        <div className={`absolute -right-10 -top-10 h-40 w-40 rounded-full bg-gradient-to-br ${subject.from} ${subject.to} opacity-30 blur-3xl`} />

        <div className="relative">
          <div className="flex items-start justify-between gap-3">
            <div
              className={`grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br ${subject.from} ${subject.to} shadow-lg ring-1 ring-white/30`}
              style={{
                transform: hovered ? 'translateZ(40px) rotate(-6deg)' : 'translateZ(20px)',
                transition: 'transform 0.35s ease',
              }}
            >
              <Icon className="h-7 w-7 text-white" />
            </div>
            <span className="rounded-full border border-white/20 bg-white/10 px-2.5 py-1 text-[10px] font-black uppercase tracking-widest text-white/80">
              {subject.id === 'math' ? 'Maths' : subject.id}
            </span>
          </div>

          <h3
            className="mt-5 text-2xl font-black text-white"
            style={{
              transform: hovered ? 'translateZ(20px)' : 'translateZ(0)',
              transition: 'transform 0.35s ease',
            }}
          >
            {subject.name}
          </h3>
          <p className="mt-1 text-xs text-slate-300">{subject.tagline}</p>

          <p className={`mt-3 inline-block rounded-full bg-gradient-to-r ${subject.from} ${subject.to} bg-clip-text px-2 py-0.5 text-xs font-black text-transparent ring-1 ring-white/20`}>
            {subject.units}
          </p>

          <ul className="mt-4 space-y-1.5">
            {subject.topics.map((topic) => (
              <li key={topic} className="flex items-start gap-2 text-xs leading-5 text-slate-200">
                <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gradient-to-r ${subject.from} ${subject.to}`} />
                <span>{topic}</span>
              </li>
            ))}
          </ul>

          <div
            className="mt-5 flex items-center justify-between border-t border-white/10 pt-4"
            style={{
              transform: hovered ? 'translateZ(15px)' : 'translateZ(0)',
              transition: 'transform 0.35s ease',
            }}
          >
            <span className="text-[10px] font-black uppercase tracking-widest text-white/50">
              Explore →
            </span>
            <ArrowRight className={`h-4 w-4 transition-transform ${hovered ? 'translate-x-1 text-white' : 'text-white/60'}`} />
          </div>
        </div>

        {/* shimmer sweep on hover */}
        <span
          className={`pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/15 to-transparent transition-transform duration-1000 ${
            hovered ? 'translate-x-full' : ''
          }`}
        />
      </article>
    </div>
  );
}

// ── Stat tile ────────────────────────────────────────────────────────

function StatTile({ stat }: { stat: typeof STATS[number] }) {
  const value = useCountUp(stat.value, 1400);
  return (
    <div className="rounded-2xl border border-white/15 bg-white/5 p-4 text-center backdrop-blur-xl">
      <p className="bg-gradient-to-r from-sky-300 via-fuchsia-200 to-amber-200 bg-clip-text text-3xl font-black text-transparent">
        {value}
        {stat.suffix}
      </p>
      <p className="mt-1 text-[10px] font-black uppercase tracking-[0.2em] text-white/60">
        {stat.label}
      </p>
    </div>
  );
}

// ── Feature card ─────────────────────────────────────────────────────

function FeatureCard({ feature, mouse, index }: { feature: Feature; mouse: { x: number; y: number }; index: number }) {
  const [hovered, setHovered] = useState(false);
  const Icon = feature.icon;
  const tiltX = mouse.y * (hovered ? -6 : -2);
  const tiltY = mouse.x * (hovered ? 6 : 2);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group relative h-full"
      style={{
        transform: `perspective(1200px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`,
        transition: 'transform 0.4s ease',
        animation: `landing-float 11s ease-in-out ${index * 0.7}s infinite`,
      }}
    >
      <div className={`pointer-events-none absolute -inset-1 rounded-2xl bg-gradient-to-br ${feature.tone} blur-xl opacity-50`} />
      <div className="relative h-full overflow-hidden rounded-2xl border border-white/15 bg-white/[0.05] p-4 backdrop-blur-xl">
        <div className={`mb-3 grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br ${feature.tone} ring-1 ring-white/20`}>
          <Icon className="h-5 w-5 text-white" />
        </div>
        <p className="text-sm font-black text-white">{feature.title}</p>
        <p className="mt-1.5 text-xs leading-5 text-slate-300">{feature.copy}</p>
      </div>
    </div>
  );
}

// ── Main export ──────────────────────────────────────────────────────

export function LandingPage() {
  const [showPlatform, setShowPlatform] = useState(false);
  const mouse = useMouseParallax();

  if (showPlatform) {
    return <ClientPage />;
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#040711] text-white">
      {/* ──────── ambient backdrop ──────── */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        {/* radial mesh gradient — moves slightly with the mouse */}
        <div
          className="absolute inset-0 transition-transform duration-700"
          style={{
            background:
              'radial-gradient(circle at 15% 18%, rgba(56,189,248,0.22), transparent 45%),' +
              'radial-gradient(circle at 85% 22%, rgba(52,211,153,0.20), transparent 45%),' +
              'radial-gradient(circle at 18% 85%, rgba(251,191,36,0.18), transparent 42%),' +
              'radial-gradient(circle at 85% 85%, rgba(232,121,249,0.22), transparent 45%)',
            transform: `translate(${mouse.x * 12}px, ${mouse.y * 12}px)`,
          }}
        />
        {/* faint grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,.07)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,.07)_1px,transparent_1px)] bg-[size:60px_60px]" />
        {/* large floating orbs */}
        <div className="absolute left-[8%] top-[18%] h-72 w-72 rounded-full bg-sky-500/20 blur-3xl" style={{ animation: 'landing-float 16s ease-in-out infinite' }} />
        <div className="absolute right-[6%] top-[12%] h-80 w-80 rounded-full bg-emerald-500/20 blur-3xl" style={{ animation: 'landing-float 18s ease-in-out 2s infinite' }} />
        <div className="absolute left-[10%] bottom-[8%] h-80 w-80 rounded-full bg-amber-500/15 blur-3xl" style={{ animation: 'landing-float 20s ease-in-out 1s infinite' }} />
        <div className="absolute right-[8%] bottom-[10%] h-80 w-80 rounded-full bg-fuchsia-500/20 blur-3xl" style={{ animation: 'landing-float 17s ease-in-out 3s infinite' }} />
        {/* twinkling particle field */}
        <ParticleField count={70} />
      </div>

      {/* ──────── top bar ──────── */}
      <header className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8">
        <div className="flex items-center gap-3">
          <div className="relative h-10 w-10 overflow-hidden rounded-xl border border-white/20 bg-white/10 backdrop-blur-xl">
            <Image src={brandLogoSrc} alt="EIS Learning Studio" fill sizes="40px" />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/70">Emirates International School</p>
            <p className="text-sm font-black text-white">Learning Studio · Jumeirah</p>
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
          <Sparkles className="h-3.5 w-3.5" />
          Grade 8 · IB MYP
        </span>
        <h1 className="mt-5 text-3xl font-black leading-tight tracking-tight text-white sm:text-6xl">
          <span className="bg-gradient-to-r from-sky-300 via-fuchsia-200 to-amber-200 bg-clip-text text-transparent">
            Three subjects.
          </span>
          <br />
          One studio. Every concept.
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
          Maths, Science and English brought together with worked solutions,
          3D interactive labs, labelled diagrams, read-aloud lessons and a
          built-in teacher → student assignment loop.
        </p>
      </section>

      {/* ──────── stats strip ──────── */}
      <section className="relative z-10 mx-auto mt-8 max-w-3xl px-5 sm:px-8">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {STATS.map((s) => (
            <StatTile key={s.label} stat={s} />
          ))}
        </div>
      </section>

      {/* ──────── 3D Hub + Subject cards ──────── */}
      <section className="relative z-10 mx-auto mt-14 max-w-7xl px-5 sm:px-8">
        <div className="relative grid items-center gap-8 lg:grid-cols-[1fr_auto_1fr]">
          {/* left subject card */}
          <div className="flex justify-center">
            <div className="w-full max-w-sm">
              <SubjectCard subject={SUBJECTS[0]} mouse={mouse} index={0} />
            </div>
          </div>

          {/* centre hub */}
          <div className="order-first flex justify-center lg:order-none">
            <StudioHub mouse={mouse} />
          </div>

          {/* right subject card */}
          <div className="flex justify-center">
            <div className="w-full max-w-sm">
              <SubjectCard subject={SUBJECTS[2]} mouse={mouse} index={2} />
            </div>
          </div>
        </div>

        {/* science card centred below the hub */}
        <div className="mt-8 flex justify-center">
          <div className="w-full max-w-sm">
            <SubjectCard subject={SUBJECTS[1]} mouse={mouse} index={1} />
          </div>
        </div>
      </section>

      {/* ──────── Feature constellation ──────── */}
      <section className="relative z-10 mx-auto mt-20 max-w-6xl px-5 sm:px-8">
        <div className="mb-6 text-center">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/60">What you get</p>
          <h2 className="mt-2 text-2xl font-black text-white sm:text-3xl">
            A complete teaching toolkit
          </h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f, i) => (
            <FeatureCard key={f.title} feature={f} mouse={mouse} index={i} />
          ))}
        </div>
      </section>

      {/* ──────── assessment criteria strip ──────── */}
      <section className="relative z-10 mx-auto mt-16 max-w-5xl px-5 sm:px-8">
        <div className="rounded-3xl border border-white/15 bg-white/5 p-5 backdrop-blur-2xl">
          <div className="mb-3 flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/60">
              Assessment Objectives · MYP Criteria
            </span>
            <span className="h-px flex-1 bg-gradient-to-r from-white/20 to-transparent" />
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {CRITERIA.map((c) => (
              <div key={c.tag} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5 px-3 py-3 transition hover:-translate-y-0.5 hover:border-white/30">
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
          50%      { transform: translateY(-14px); }
        }
        @keyframes landing-spin {
          0%   { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes landing-twinkle {
          0%, 100% { opacity: 0.15; transform: scale(0.8); }
          50%      { opacity: 0.85; transform: scale(1.4); }
        }
      `}</style>
    </main>
  );
}
