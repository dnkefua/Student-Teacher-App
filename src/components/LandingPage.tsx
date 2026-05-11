'use client';

import Image from 'next/image';
import React, { useState } from 'react';
import {
  ArrowRight,
  BookOpen,
  BrainCircuit,
  Camera,
  CheckCircle2,
  ChevronRight,
  Clapperboard,
  Layers3,
  MonitorPlay,
  Play,
  Sparkles,
  Trophy,
  Wand2,
} from 'lucide-react';
import { ClientPage } from '@/components/ClientPage';

const brandLogoSrc = '/eis-maths-studio-logo.png';

const outcomes = [
  'AI cinematic lesson engine',
  'Interactive worked examples',
  'Camera-ready virtual classroom',
  'NeuroQuest practice missions',
];

const features = [
  {
    title: 'Cinematic Lessons',
    copy: 'Turn chapters and subtopics into visual explainers with guided scenes, motion, worked examples, quizzes, and rewards.',
    icon: Clapperboard,
    accent: 'text-[#49c8ff]',
  },
  {
    title: 'Exam Walkthroughs',
    copy: 'Show the solving path on one clean board so students can follow each decision, operation, check, and final answer.',
    icon: BookOpen,
    accent: 'text-[#ffc43b]',
  },
  {
    title: 'Live Teaching',
    copy: 'Run camera-enabled online classes with lesson context, chat, delivery controls, and screen-share friendly layouts.',
    icon: Camera,
    accent: 'text-[#ffffff]',
  },
  {
    title: 'Game Practice',
    copy: 'Connect lessons to NeuroQuest activities that reinforce reasoning, fluency, memory, and problem-solving habits.',
    icon: Trophy,
    accent: 'text-[#ff3d22]',
  },
];

const lessonFlow = [
  'Choose subject, grade, chapter and subtopic',
  'Generate a premium visual explainer',
  'Teach with camera or assign practice',
  'Reward progress with XP and badges',
];

function HeroScene() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <div className="absolute inset-0 bg-[#050711]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_24%,rgba(255,196,59,.2),transparent_30%),radial-gradient(circle_at_78%_32%,rgba(73,200,255,.23),transparent_34%),linear-gradient(135deg,rgba(4,18,54,.9),rgba(5,7,17,.95)_58%,rgba(20,8,5,.88))]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,.13)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,.1)_1px,transparent_1px)] bg-[size:54px_54px]" />
      <div className="absolute left-[9%] top-[10%] h-28 w-28 rounded-full bg-[#ffc43b]/20 blur-3xl" />
      <div className="absolute right-[8%] top-[18%] h-36 w-36 rounded-full bg-[#49c8ff]/25 blur-3xl" />

      <div className="absolute left-1/2 top-[48%] h-[460px] w-[760px] -translate-x-1/2 -translate-y-1/2 [perspective:1200px]">
        <div className="absolute inset-0 rounded-lg border border-[#49c8ff]/25 bg-[#071126]/85 shadow-[0_0_90px_rgba(73,200,255,.2)]" style={{ transform: 'rotateX(64deg) rotateZ(-27deg)' }} />
        <div className="absolute left-20 top-20 h-32 w-32 rounded-md border border-[#ff3d22]/50 bg-[#ff3d22]/25 shadow-[18px_18px_0_rgba(5,7,17,.75)]" style={{ transform: 'rotateX(64deg) rotateZ(-27deg) translateZ(38px)' }} />
        <div className="absolute left-64 top-12 h-24 w-56 rounded-md border border-[#1f78ff]/50 bg-[#1f78ff]/25 shadow-[18px_18px_0_rgba(5,7,17,.75)]" style={{ transform: 'rotateX(64deg) rotateZ(-27deg) translateZ(64px)' }} />
        <div className="absolute right-20 top-28 h-44 w-44 rounded-md border border-[#ffc43b]/50 bg-[#ffc43b]/20 shadow-[18px_18px_0_rgba(5,7,17,.75)]" style={{ transform: 'rotateX(64deg) rotateZ(-27deg) translateZ(42px)' }} />
        <div className="absolute bottom-20 left-28 right-20 h-2 rounded-full bg-gradient-to-r from-[#49c8ff] via-[#ffc43b] to-[#ff3d22]" style={{ transform: 'rotateX(64deg) rotateZ(-27deg) translateZ(90px)' }} />
      </div>

      <div className="absolute bottom-16 left-[8%] hidden w-[38rem] rounded-lg border border-white/10 bg-white/10 p-5 text-white backdrop-blur md:block">
        <div className="grid grid-cols-4 gap-3">
          {['5x - 7', '+7 both sides', '5x = 35', 'x = 7'].map((label, index) => (
            <div key={label} className="rounded-md bg-slate-950/75 p-3 text-center">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-400">Step {index + 1}</p>
              <p className="mt-1 font-black text-[#d8f6ff]">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function LandingPage() {
  const [showPlatform, setShowPlatform] = useState(false);

  if (showPlatform) {
    return <ClientPage />;
  }

  return (
    <main className="min-h-screen bg-[#050711] text-white">
      <section className="relative min-h-[92vh] overflow-hidden">
        <HeroScene />

        <header className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-5 py-5">
          <div className="flex items-center gap-3">
            <div className="grid h-14 w-14 place-items-center overflow-hidden rounded-md border border-[#49c8ff]/25 bg-[#071126] shadow-[0_0_35px_rgba(73,200,255,.22)]">
              <Image src={brandLogoSrc} alt="EIS Maths Studio logo" width={48} height={48} priority className="h-12 w-12 object-contain" />
            </div>
            <div>
              <p className="text-sm font-black uppercase tracking-wide text-white">EIS Maths Studio</p>
              <p className="text-xs font-semibold text-[#8ddfff]">Student Teacher App</p>
            </div>
          </div>
          <button onClick={() => setShowPlatform(true)} className="hidden items-center gap-2 rounded-md bg-[#ffc43b] px-4 py-2 text-sm font-black text-[#061126] transition hover:bg-[#ffe08a] sm:inline-flex">
            Enter Platform <ArrowRight className="h-4 w-4" />
          </button>
        </header>

        <div className="relative z-10 mx-auto grid max-w-7xl gap-10 px-5 pb-16 pt-16 lg:grid-cols-[0.95fr_0.75fr] lg:items-end lg:pt-24">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-md border border-[#ffc43b]/35 bg-[#ffc43b]/10 px-3 py-2 text-xs font-black uppercase tracking-wide text-[#ffe08a]">
              <Sparkles className="h-4 w-4" />
              EIS branded AI learning workspace
            </div>
            <h1 className="max-w-4xl text-5xl font-black tracking-normal text-white sm:text-6xl lg:text-7xl">
              Cinematic lessons students can see, follow and remember.
            </h1>
            <p className="mt-6 max-w-2xl text-lg font-medium leading-8 text-slate-200">
              A unified platform for teachers to plan, teach, explain, assess and reinforce learning with AI-generated visual lessons, online classroom tools and NeuroQuest practice.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button onClick={() => setShowPlatform(true)} className="inline-flex items-center gap-2 rounded-md bg-[#49c8ff] px-5 py-3 font-black text-[#061126] transition hover:bg-[#8ddfff]">
                Launch App <Play className="h-5 w-5" />
              </button>
              <a href="#experience" className="inline-flex items-center gap-2 rounded-md border border-[#ffc43b]/35 px-5 py-3 font-black text-white transition hover:border-[#ffc43b] hover:text-[#ffe08a]">
                Explore Experience <ChevronRight className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div className="rounded-lg border border-white/10 bg-white/10 p-5 backdrop-blur">
            <div className="mb-5 flex items-center gap-4 rounded-md border border-white/10 bg-[#050711]/70 p-3">
              <Image src={brandLogoSrc} alt="EIS Maths Studio logo" width={80} height={80} priority className="h-20 w-20 rounded-md object-contain" />
              <div>
                <p className="text-xs font-black uppercase tracking-wide text-[#ffc43b]">Built for Emirates International School</p>
                <p className="mt-1 text-xl font-black text-white">EIS Maths Studio</p>
              </div>
            </div>
            <div className="mt-4 grid gap-3">
              {outcomes.map((outcome) => (
                <div key={outcome} className="flex items-center gap-3 rounded-md bg-slate-950/70 p-3">
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-[#ffc43b]" />
                  <p className="font-bold text-slate-100">{outcome}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="experience" className="border-y border-white/10 bg-white text-slate-950">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-16 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          <div>
            <p className="text-xs font-black uppercase tracking-wide text-[#1663c7]">The platform standard</p>
            <h2 className="mt-3 text-3xl font-black tracking-normal sm:text-4xl">Every lesson should demonstrate the thinking, not just describe it.</h2>
            <p className="mt-4 text-base leading-8 text-slate-600">
              The app turns content into guided boards, animated visual models, clean exam walkthroughs and practice loops that help students understand where each step starts, ends and why it works.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <article key={feature.title} className="rounded-lg border border-slate-200 bg-slate-950 p-5 text-white">
                  <Icon className={`h-7 w-7 ${feature.accent}`} />
                  <h3 className="mt-4 text-xl font-black">{feature.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-300">{feature.copy}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-[#050711]">
        <div className="mx-auto max-w-7xl px-5 py-16">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <p className="text-xs font-black uppercase tracking-wide text-[#ffc43b]">From course to classroom</p>
              <h2 className="mt-3 text-3xl font-black tracking-normal sm:text-4xl">A complete teaching loop in one place.</h2>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {lessonFlow.map((step, index) => (
                <div key={step} className="rounded-lg border border-white/10 bg-white/10 p-5">
                  <p className="text-sm font-black text-[#ffc43b]">0{index + 1}</p>
                  <p className="mt-3 text-lg font-black">{step}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-12 grid gap-4 lg:grid-cols-3">
            {[
              { label: 'Lesson Engine', value: 'Scene by scene explainers', icon: Wand2 },
              { label: '3D Visuals', value: 'Interactive concept models', icon: Layers3 },
              { label: 'Live Class', value: 'Camera and teaching controls', icon: MonitorPlay },
              { label: 'AI Planning', value: 'Teacher-ready lesson plans', icon: BrainCircuit },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <article key={item.label} className="rounded-lg border border-white/10 bg-white p-5 text-slate-950">
                  <Icon className="h-6 w-6 text-[#1663c7]" />
                  <p className="mt-4 text-xs font-black uppercase tracking-wide text-slate-500">{item.label}</p>
                  <h3 className="mt-1 text-xl font-black">{item.value}</h3>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-white px-5 py-14 text-slate-950">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 rounded-lg border border-slate-200 p-6 shadow-[0_20px_60px_rgba(6,17,38,.08)] md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-wide text-[#1663c7]">Ready for review</p>
            <h2 className="mt-2 text-2xl font-black">Open the working platform and continue building.</h2>
          </div>
          <button onClick={() => setShowPlatform(true)} className="inline-flex items-center justify-center gap-2 rounded-md bg-[#061126] px-5 py-3 font-black text-white transition hover:bg-[#123a86]">
            Enter Student Teacher App <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </section>
    </main>
  );
}
