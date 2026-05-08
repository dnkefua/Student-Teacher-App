import React, { useMemo, useState } from 'react';
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  Box,
  Camera,
  CheckCircle2,
  Circle,
  Compass,
  Dice5,
  FunctionSquare,
  Gamepad2,
  Grid3X3,
  LineChart,
  MonitorPlay,
  Network,
  Percent,
  Play,
  Shapes,
  Sigma,
  Sparkles,
  Video,
} from 'lucide-react';
import { TabType } from './Sidebar';
import { AnimationMode, CourseLesson, eisMypMathCourse } from '@/lib/eisMypMathCourse';
import { NeuroQuestAssignment, getNeuroQuestGame, saveActiveAssignment } from '@/lib/neuroquest';

interface EISMathStudioProps {
  setActiveTab: (tab: TabType) => void;
}

const animationIcon: Record<AnimationMode, React.ElementType> = {
  'number-line': Network,
  'percentage-bars': Percent,
  'ratio-mixer': Shapes,
  'algebra-tiles': Sigma,
  'equation-balance': FunctionSquare,
  'coordinate-grid': Grid3X3,
  'angle-lab': Compass,
  'circle-lab': Circle,
  'construction-compass': Compass,
  'solid-builder': Box,
  'data-lab': BarChart3,
  'probability-spinner': Dice5,
};

const chapterAccent = [
  '#0f172a',
  '#2563eb',
  '#14b8a6',
  '#6366f1',
  '#0ea5e9',
  '#f97316',
  '#ec4899',
  '#7c3aed',
  '#0891b2',
  '#16a34a',
  '#f59e0b',
];

function AnimatedConcept({ lesson, accent }: { lesson: CourseLesson; accent: string }) {
  const Icon = animationIcon[lesson.animation];

  return (
    <div className="relative min-h-[380px] overflow-hidden rounded-lg bg-slate-950 text-white">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.06)_1px,transparent_1px)] bg-[size:34px_34px]" />
      <div className="absolute inset-0" style={{ background: `radial-gradient(circle at 75% 15%, ${accent}66, transparent 30%), radial-gradient(circle at 20% 70%, rgba(45,212,191,.22), transparent 28%)` }} />

      {lesson.animation === 'coordinate-grid' || lesson.animation === 'data-lab' ? (
        <svg className="absolute inset-8 h-[calc(100%-64px)] w-[calc(100%-64px)]" viewBox="0 0 520 300">
          <path d="M50 250H480M50 250V30" stroke="rgba(255,255,255,.72)" strokeWidth="4" strokeLinecap="round" />
          <path d="M60 230 C140 205, 180 120, 260 130 S370 82, 455 55" fill="none" stroke={accent} strokeWidth="8" strokeLinecap="round" />
          <circle cx="60" cy="230" r="11" fill="#facc15">
            <animate attributeName="cx" values="60;260;455;60" dur="5s" repeatCount="indefinite" />
            <animate attributeName="cy" values="230;130;55;230" dur="5s" repeatCount="indefinite" />
          </circle>
        </svg>
      ) : lesson.animation === 'solid-builder' ? (
        <div className="absolute left-1/2 top-[42%] h-40 w-56 -translate-x-1/2 -translate-y-1/2 [perspective:900px]">
          <div className="absolute inset-0 rounded-lg border border-white/35 shadow-[0_0_42px_rgba(255,255,255,.18)]" style={{ background: `${accent}33`, transform: 'rotateX(62deg) rotateZ(-28deg)' }} />
          <div className="absolute inset-0 translate-x-12 -translate-y-12 rounded-lg border border-cyan-200/40 bg-cyan-400/20" style={{ transform: 'rotateX(62deg) rotateZ(-28deg)' }} />
          <div className="absolute left-12 top-0 h-40 w-px bg-white/40" />
          <div className="absolute right-0 top-0 h-40 w-px bg-white/40" />
          <div className="absolute bottom-0 left-12 h-px w-56 bg-white/40" />
        </div>
      ) : lesson.animation === 'circle-lab' || lesson.animation === 'probability-spinner' ? (
        <div className="absolute left-1/2 top-[42%] grid h-56 w-56 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-[18px] border-white/15" style={{ boxShadow: `0 0 50px ${accent}66` }}>
          <div className="absolute h-1 w-28 origin-left animate-spin rounded-full" style={{ background: accent, left: '50%', top: '50%' }} />
          <div className="grid h-24 w-24 place-items-center rounded-full bg-white text-slate-950 shadow-xl">
            <Icon className="h-10 w-10" />
          </div>
        </div>
      ) : lesson.animation === 'equation-balance' || lesson.animation === 'algebra-tiles' ? (
        <div className="absolute inset-x-8 top-[34%]">
          <div className="mx-auto h-3 max-w-xl rounded-full bg-gradient-to-r from-cyan-300 to-amber-300" />
          <div className="mx-auto h-32 w-3 rounded-b-full bg-slate-500" />
          <div className="mt-[-120px] grid grid-cols-2 gap-10">
            <div className="rounded-lg border border-white/10 bg-white/10 p-6 backdrop-blur">
              <div className="flex justify-center gap-2">
                {[1, 2, 3].map((item) => <span key={item} className="grid h-12 w-12 place-items-center rounded-md font-black text-slate-950" style={{ background: accent }}>x</span>)}
              </div>
            </div>
            <div className="grid place-items-center rounded-lg border border-white/10 bg-white/10 p-6 text-5xl font-black text-amber-200 backdrop-blur">?</div>
          </div>
        </div>
      ) : lesson.animation === 'angle-lab' || lesson.animation === 'construction-compass' ? (
        <svg className="absolute inset-8 h-[calc(100%-64px)] w-[calc(100%-64px)]" viewBox="0 0 520 300">
          <path d="M120 220L405 82" stroke="white" strokeWidth="5" strokeLinecap="round" />
          <path d="M120 220L430 220" stroke="white" strokeWidth="5" strokeLinecap="round" />
          <path d="M180 220 A70 70 0 0 1 245 158" fill="none" stroke={accent} strokeWidth="14" strokeLinecap="round" />
          <circle cx="120" cy="220" r="14" fill="#facc15" />
          <circle cx="245" cy="158" r="8" fill={accent}>
            <animate attributeName="r" values="8;14;8" dur="1.6s" repeatCount="indefinite" />
          </circle>
        </svg>
      ) : (
        <div className="absolute left-8 right-8 top-1/2 h-1 rounded-full bg-gradient-to-r from-sky-400 via-emerald-300 to-amber-300" />
      )}

      <div className="absolute left-6 top-6 rounded-lg border border-white/10 bg-white/10 p-4 backdrop-blur">
        <p className="text-xs font-bold uppercase tracking-wide text-white/60">Premium animation mode</p>
        <div className="mt-2 flex items-center gap-3">
          <Icon className="h-7 w-7" style={{ color: accent }} />
          <span className="text-lg font-black">{lesson.animation.replaceAll('-', ' ')}</span>
        </div>
      </div>

      <div className="absolute bottom-6 left-6 right-6 rounded-lg border border-white/10 bg-white/10 p-4 backdrop-blur">
        <p className="text-xs font-bold uppercase tracking-wide text-amber-100">Animated explanation</p>
        <p className="mt-2 text-sm leading-6 text-slate-100">{lesson.explanation}</p>
      </div>
    </div>
  );
}

export function EISMathStudio({ setActiveTab }: EISMathStudioProps) {
  const [chapterId, setChapterId] = useState(eisMypMathCourse[0].id);
  const activeChapter = useMemo(() => eisMypMathCourse.find((chapter) => chapter.id === chapterId) ?? eisMypMathCourse[0], [chapterId]);
  const [lessonId, setLessonId] = useState(activeChapter.lessons[0].id);
  const lesson = useMemo(() => activeChapter.lessons.find((item) => item.id === lessonId) ?? activeChapter.lessons[0], [activeChapter, lessonId]);
  const chapterIndex = eisMypMathCourse.findIndex((chapter) => chapter.id === activeChapter.id);
  const accent = chapterAccent[Math.max(0, chapterIndex)] ?? '#6366f1';
  const lessonCount = eisMypMathCourse.reduce((count, chapter) => count + chapter.lessons.length, 0);
  const game = getNeuroQuestGame(
    lesson.animation === 'probability-spinner' || lesson.animation === 'data-lab' || lesson.animation === 'construction-compass'
      ? 'memory-match'
      : lesson.animation === 'coordinate-grid' || lesson.animation === 'solid-builder'
        ? 'maze-pursuit-3d'
        : 'math-racer-3d'
  );

  const selectChapter = (id: string) => {
    const nextChapter = eisMypMathCourse.find((chapter) => chapter.id === id) ?? eisMypMathCourse[0];
    setChapterId(nextChapter.id);
    setLessonId(nextChapter.lessons[0].id);
  };

  const saveLessonAssignment = (destination?: TabType) => {
    const assignment: NeuroQuestAssignment = {
      id: `eis-myp-${lesson.id}-${Date.now()}`,
      gameSlug: game.slug,
      title: `EIS MYP Year 2 Maths: ${lesson.title}`,
      objective: lesson.objectives.join(' '),
      duration: '50 minutes',
      instructions: [
        `${activeChapter.chapter}: ${activeChapter.title}`,
        `Textbook section: ${lesson.textbookSection}`,
        `Inquiry: ${lesson.inquiry}`,
        `Complete the animated explanation, worked example and exercise set.`,
        `Evidence: ${lesson.exercises.fluency[0]} ${lesson.exercises.reasoning[0]} Extension: ${lesson.exercises.extension}`,
      ].join('\n'),
      createdAt: new Date().toISOString(),
    };
    saveActiveAssignment(assignment);
    if (destination) setActiveTab(destination);
  };

  return (
    <div className="space-y-8">
      <section className="overflow-hidden rounded-lg border border-slate-200 bg-slate-950 text-white shadow-sm">
        <div className="grid gap-8 p-6 lg:grid-cols-[0.92fr_1.08fr] lg:p-8">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-md border border-amber-300/30 bg-amber-300/10 px-3 py-2 text-xs font-bold uppercase tracking-wide text-amber-100">
              <Sparkles className="h-4 w-4" />
              Pearson IB MYP Year 2 · EIS Grade 8
            </div>
            <h1 className="text-3xl font-bold tracking-normal sm:text-4xl">Complete Grade 8 Maths Course</h1>
            <p className="mt-4 max-w-2xl leading-7 text-slate-300">
              Full textbook-aligned course structure with {eisMypMathCourse.length} chapters, {lessonCount} lessons, original exercises, worked examples, animated explanations, NeuroQuest practice and online teaching handoffs.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <button onClick={() => saveLessonAssignment('lesson-planner')} className="inline-flex items-center gap-2 rounded-md bg-white px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-amber-100">
                Build Teacher Lesson <BookOpen className="h-4 w-4" />
              </button>
              <button onClick={() => saveLessonAssignment('classroom')} className="inline-flex items-center gap-2 rounded-md border border-white/20 px-4 py-2 text-sm font-semibold text-white transition hover:border-cyan-300 hover:text-cyan-100">
                Teach With Camera <Video className="h-4 w-4" />
              </button>
            </div>
          </div>
          <AnimatedConcept lesson={lesson} accent={accent} />
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[340px_1fr]">
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <h2 className="px-1 text-lg font-semibold text-gray-900">Full Course Chapters</h2>
          <div className="mt-4 space-y-2">
            {eisMypMathCourse.map((chapter, index) => {
              const active = chapter.id === activeChapter.id;
              return (
                <button
                  key={chapter.id}
                  onClick={() => selectChapter(chapter.id)}
                  className={`w-full rounded-lg border p-3 text-left transition ${active ? 'border-indigo-300 bg-indigo-50' : 'border-gray-200 hover:bg-gray-50'}`}
                >
                  <div className="flex gap-3">
                    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg text-sm font-black text-white" style={{ background: chapterAccent[index] }}>
                      {index + 1}
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wide text-gray-500">{chapter.chapter} · starts {chapter.textbookStart}</p>
                      <p className="font-semibold text-gray-900">{chapter.title}</p>
                      <p className="mt-1 text-xs text-gray-500">{chapter.lessons.length} lessons</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <div className="mb-3 inline-flex items-center gap-2 rounded-md bg-gray-100 px-3 py-2 text-xs font-bold uppercase tracking-wide text-gray-600">
                  <BookOpen className="h-4 w-4" />
                  {activeChapter.chapter} · {activeChapter.textbookStart}
                </div>
                <h2 className="text-2xl font-bold text-gray-900">{activeChapter.title}</h2>
                <p className="mt-2 max-w-3xl text-gray-600">{activeChapter.statementOfInquiry}</p>
              </div>
              <a href={game.href} target="_blank" rel="noreferrer" className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-slate-950 px-4 py-2 font-medium text-white transition hover:bg-slate-800">
                NeuroQuest Practice <Play className="h-4 w-4" />
              </a>
            </div>

            <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {activeChapter.lessons.map((item) => {
                const Icon = animationIcon[item.animation];
                const active = item.id === lesson.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setLessonId(item.id)}
                    className={`rounded-lg border p-4 text-left transition ${active ? 'border-indigo-300 bg-indigo-50' : 'border-gray-200 hover:bg-gray-50'}`}
                  >
                    <Icon className="mb-3 h-5 w-5" style={{ color: accent }} />
                    <p className="text-xs font-bold uppercase tracking-wide text-gray-500">{item.textbookSection}</p>
                    <h3 className="mt-1 font-semibold text-gray-900">{item.title}</h3>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
            <div className="space-y-6">
              <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                <p className="text-sm font-bold uppercase tracking-wide text-gray-500">{lesson.textbookSection}</p>
                <h2 className="mt-2 text-2xl font-bold text-gray-900">{lesson.title}</h2>
                <p className="mt-3 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">
                  <strong>Inquiry:</strong> {lesson.inquiry}
                </p>
                <div className="mt-5 grid gap-3 md:grid-cols-3">
                  {lesson.objectives.map((objective) => (
                    <div key={objective} className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                      <CheckCircle2 className="mb-3 h-5 w-5 text-green-600" />
                      <p className="text-sm font-medium leading-6 text-gray-800">{objective}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900">Worked Example</h3>
                <p className="mt-3 font-semibold text-gray-800">{lesson.workedExample.prompt}</p>
                <ol className="mt-4 space-y-3">
                  {lesson.workedExample.steps.map((step, index) => (
                    <li key={step} className="flex gap-3">
                      <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-sm font-bold text-white" style={{ background: accent }}>{index + 1}</span>
                      <span className="text-sm leading-6 text-gray-700">{step}</span>
                    </li>
                  ))}
                </ol>
                <div className="mt-4 rounded-lg bg-slate-950 p-4 font-mono text-sm font-bold text-white">
                  Answer: {lesson.workedExample.answer}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900">Exercises</h3>
                <div className="mt-4 space-y-5">
                  <div>
                    <p className="mb-2 text-xs font-bold uppercase tracking-wide text-gray-500">Fluency</p>
                    <ul className="space-y-2">
                      {lesson.exercises.fluency.map((item) => <li key={item} className="rounded-lg bg-gray-50 p-3 text-sm text-gray-700">{item}</li>)}
                    </ul>
                  </div>
                  <div>
                    <p className="mb-2 text-xs font-bold uppercase tracking-wide text-gray-500">Reasoning</p>
                    <ul className="space-y-2">
                      {lesson.exercises.reasoning.map((item) => <li key={item} className="rounded-lg bg-indigo-50 p-3 text-sm text-indigo-900">{item}</li>)}
                    </ul>
                  </div>
                  <div>
                    <p className="mb-2 text-xs font-bold uppercase tracking-wide text-gray-500">Extension</p>
                    <div className="rounded-lg bg-emerald-50 p-3 text-sm leading-6 text-emerald-900">{lesson.exercises.extension}</div>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900">Delivery Controls</h3>
                <div className="mt-4 space-y-3 text-sm leading-6 text-gray-700">
                  <p className="flex gap-2"><Camera className="mt-0.5 h-4 w-4 shrink-0 text-indigo-600" />Use Virtual Classroom camera preflight before live teaching.</p>
                  <p className="flex gap-2"><MonitorPlay className="mt-0.5 h-4 w-4 shrink-0 text-indigo-600" />Screen-share the animated explanation and game walkthrough.</p>
                  <p className="flex gap-2"><Gamepad2 className="mt-0.5 h-4 w-4 shrink-0 text-indigo-600" />Saved lesson flows into planner, grader, email and classroom chat.</p>
                </div>
                <div className="mt-5 grid gap-2">
                  <button onClick={() => saveLessonAssignment('lesson-planner')} className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white transition hover:bg-indigo-700">
                    Build Complete Lesson Plan <ArrowRight className="h-4 w-4" />
                  </button>
                  <button onClick={() => saveLessonAssignment('classroom')} className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-gray-200 px-4 py-2 font-medium text-gray-700 transition hover:bg-gray-50">
                    Open Camera Classroom <Video className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900">Chapter Project</h3>
            <p className="mt-2 text-gray-700">{activeChapter.project}</p>
            <p className="mt-3 text-sm text-gray-500">Global context: {activeChapter.globalContext}</p>
          </div>
        </div>
      </section>
    </div>
  );
}
