import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  Box,
  Camera,
  ChevronDown,
  CheckCircle2,
  Circle,
  Columns3,
  Compass,
  ExternalLink,
  Dice5,
  FunctionSquare,
  Gamepad2,
  Grid3X3,
  LineChart,
  MonitorPlay,
  Network,
  Pause,
  Percent,
  Play,
  RotateCcw,
  Shapes,
  Sigma,
  Sparkles,
  Video,
  X,
  Youtube,
  type LucideIcon,
} from 'lucide-react';
import { TabType } from './Sidebar';
import { AnimationMode, CourseLesson, eisMypMathCourse } from '@/lib/eisMypMathCourse';
import { ConceptResearchPack, WorkedStep, getConceptResearchPack } from '@/lib/eisConceptResearch';
import { NeuroQuestAssignment, getNeuroQuestGame, saveActiveAssignment } from '@/lib/neuroquest';
import { CinematicLessonPlayer } from '@/components/CinematicLessonEngine';
import { generateLessonAssetPackage, inputFromCourseLesson } from '@/lib/lessonEngine';
import { createMathCinematicLearningPack } from '@/lib/cinematic/learningPack';
import { CinematicLearningPackPanel } from '@/components/cinematic/CinematicLearningPackPanel';

interface EISMathStudioProps {
  setActiveTab: (tab: TabType) => void;
}

const animationIcon: Record<AnimationMode, LucideIcon> = {
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

const mediaCopy: Record<AnimationMode, { diagram: string; model: string; video: string; frames: string[] }> = {
  'number-line': {
    diagram: 'Number line with benchmarks and inequality boundaries',
    model: '3D place-value blocks arranged by magnitude',
    video: 'Animated journey from estimate to exact value',
    frames: ['Locate the starting value', 'Move by the operation', 'Check the final position'],
  },
  'percentage-bars': {
    diagram: 'Hundred-grid and equivalent percentage bar',
    model: 'Layered 100-block model for fraction-decimal-percent links',
    video: 'Discount and multiplier explainer reel',
    frames: ['Show the whole', 'Shade the percent', 'Convert or apply the multiplier'],
  },
  'ratio-mixer': {
    diagram: 'Tape diagram and equivalent ratio table',
    model: '3D mixture tanks with linked coloured parts',
    video: 'Ratio sharing and scaling reel',
    frames: ['Count total parts', 'Find one part', 'Scale each share'],
  },
  'algebra-tiles': {
    diagram: 'Tile pattern, expression and simplified form',
    model: '3D algebra tiles for x terms and constants',
    video: 'Concrete-to-symbolic algebra reel',
    frames: ['Build the tiles', 'Group like terms', 'Write the rule'],
  },
  'equation-balance': {
    diagram: 'Balance model with inverse-operation trail',
    model: '3D equality scale with matching operations',
    video: 'Solve, check and interpret reel',
    frames: ['Balance both sides', 'Undo operations', 'Substitute to check'],
  },
  'coordinate-grid': {
    diagram: 'Coordinate plane, table of values and gradient triangle',
    model: '3D graph surface with moving point marker',
    video: 'Table-to-graph motion reel',
    frames: ['Generate coordinates', 'Plot points', 'Read gradient or intersection'],
  },
  'angle-lab': {
    diagram: 'Angle facts, parallel lines and polygon split',
    model: '3D rotating angle arms and compass rose',
    video: 'Angle relationship proof reel',
    frames: ['Mark known facts', 'Name the relationship', 'Calculate the unknown'],
  },
  'circle-lab': {
    diagram: 'Circle parts, circumference strip and sector area',
    model: '3D circle pieces that unwrap and rearrange',
    video: 'Radius, circumference and area reel',
    frames: ['Identify the part', 'Choose the formula', 'Connect units to meaning'],
  },
  'construction-compass': {
    diagram: 'Compass arcs, triangle construction and bisectors',
    model: '3D compass-and-straightedge construction board',
    video: 'Precision construction step reel',
    frames: ['Draw the base', 'Sweep fixed-radius arcs', 'Join and verify'],
  },
  'solid-builder': {
    diagram: 'Net, face labels and volume layers',
    model: '3D prism that unfolds into surface area',
    video: 'Area, surface area and volume reel',
    frames: ['Decompose the shape', 'Label dimensions', 'Calculate with correct units'],
  },
  'data-lab': {
    diagram: 'Dot plot, frequency table and mean balance',
    model: '3D data columns showing centre and spread',
    video: 'Data question-to-conclusion reel',
    frames: ['Collect clean data', 'Display the distribution', 'Compare centre and spread'],
  },
  'probability-spinner': {
    diagram: 'Sample space, spinner sectors and probability scale',
    model: '3D spinner with changing sector weights',
    video: 'Theoretical vs experimental probability reel',
    frames: ['Count outcomes', 'Spin trials', 'Compare estimate with theory'],
  },
};

const youtubeTopicQueries: Record<AnimationMode, string[]> = {
  'number-line': ['grade 8 place value visual explanation', 'grade 8 integers number line visual explanation', 'grade 8 inequalities number line animation'],
  'percentage-bars': ['grade 8 percentages visual explanation', 'percentage bar model animation', 'fractions decimals percentages visual explanation'],
  'ratio-mixer': ['grade 8 ratio visual explanation', 'ratio tape diagram animation', 'unit rate scale drawing visual explanation'],
  'algebra-tiles': ['grade 8 algebra tiles visual explanation', 'expanding brackets algebra tiles animation', 'nth term visual patterns grade 8'],
  'equation-balance': ['solving equations balance scale visual explanation', 'grade 8 inequalities visual explanation', 'formula substitution visual explanation'],
  'coordinate-grid': ['grade 8 coordinate plane visual explanation', 'linear graphs slope visual explanation', 'gradient triangle animation'],
  'angle-lab': ['grade 8 angle relationships visual explanation', 'parallel lines angle facts animation', 'polygon angle sum visual explanation'],
  'circle-lab': ['parts of a circle visual explanation', 'circle circumference area animation', 'semicircle quadrant area visual explanation'],
  'construction-compass': ['constructing triangles compass straightedge visual explanation', 'perpendicular bisector construction animation', 'angle bisector construction visual explanation'],
  'solid-builder': ['surface area nets visual explanation', 'volume of prisms unit cubes animation', 'area of compound shapes visual explanation'],
  'data-lab': ['mean median mode visual explanation', 'frequency tables dot plots visual explanation', 'compare distributions centre spread visual explanation'],
  'probability-spinner': ['probability spinner visual explanation', 'experimental probability animation', 'theoretical probability sample space visual explanation'],
};

const trustedVideoChannels = ['Khan Academy', 'Math Antics', 'Cognito', 'The Organic Chemistry Tutor'];

function getYoutubeVideoId(url: string) {
  const trimmed = url.trim();
  const directId = /^[a-zA-Z0-9_-]{11}$/.test(trimmed) ? trimmed : null;
  if (directId) return directId;

  const patterns = [
    /youtube\.com\/watch\?[^#]*v=([a-zA-Z0-9_-]{11})/,
    /youtu\.be\/([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
  ];
  return patterns.map((pattern) => trimmed.match(pattern)?.[1]).find(Boolean) ?? '';
}

function getYoutubeSearchUrl(query: string) {
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
}

function clampProgress(value: number) {
  return Math.max(0, Math.min(100, value));
}

type MathExamPack = {
  id: string;
  type: 'Exam' | 'GL Exam';
  title: string;
  duration: string;
  marks: number;
  focus: string;
  questions: string[];
};

function createMathExamPacks(lesson: CourseLesson): MathExamPack[] {
  const fluency = lesson.exercises.fluency;
  const reasoning = lesson.exercises.reasoning;
  const extension = lesson.exercises.extension;

  return [
    {
      id: `${lesson.id}-exam-1`,
      type: 'Exam',
      title: 'Exam 1 - Concept Check',
      duration: '20 minutes',
      marks: 20,
      focus: 'Core knowledge, vocabulary, and method accuracy.',
      questions: [
        lesson.workedExample.prompt,
        fluency[0] ?? `Answer a fluency question on ${lesson.title}.`,
        fluency[1] ?? `Show a second method for ${lesson.title}.`,
        `Explain the key idea behind ${lesson.title} in two sentences.`,
      ],
    },
    {
      id: `${lesson.id}-exam-2`,
      type: 'Exam',
      title: 'Exam 2 - Skills and Methods',
      duration: '30 minutes',
      marks: 30,
      focus: 'Fluency, multi-step working, and clear mathematical communication.',
      questions: [
        fluency[2] ?? lesson.workedExample.prompt,
        reasoning[0] ?? `Solve a reasoning problem on ${lesson.title}.`,
        `Create and solve a similar problem for ${lesson.title}.`,
        `Check your answer using estimation, substitution, or a diagram.`,
      ],
    },
    {
      id: `${lesson.id}-exam-3`,
      type: 'Exam',
      title: 'Exam 3 - Challenge Paper',
      duration: '40 minutes',
      marks: 40,
      focus: 'Reasoning, unfamiliar contexts, and extension challenge work.',
      questions: [
        reasoning[1] ?? reasoning[0] ?? `Explain a misconception in ${lesson.title}.`,
        extension,
        `Write a model solution for ${lesson.workedExample.prompt}`,
        `Design one exam question that tests ${lesson.objectives[0]?.toLowerCase() ?? lesson.title.toLowerCase()}.`,
      ],
    },
    {
      id: `${lesson.id}-gl-1`,
      type: 'GL Exam',
      title: 'GL Exam 1 - Fast Fluency',
      duration: '18 minutes',
      marks: 25,
      focus: 'Timed arithmetic, number sense, and short-answer accuracy.',
      questions: [
        `Multiple choice: ${fluency[0] ?? lesson.workedExample.prompt}`,
        `Short answer: ${fluency[1] ?? lesson.workedExample.prompt}`,
        `Select the best estimate for: ${lesson.workedExample.prompt}`,
        `Spot the error in a worked solution for ${lesson.title}.`,
      ],
    },
    {
      id: `${lesson.id}-gl-2`,
      type: 'GL Exam',
      title: 'GL Exam 2 - Reasoning and Logic',
      duration: '22 minutes',
      marks: 30,
      focus: 'Pattern recognition, logical steps, and explanation under time pressure.',
      questions: [
        `Choose the statement that must be true: ${reasoning[0] ?? lesson.inquiry}`,
        `Complete the missing step in the solution to: ${lesson.workedExample.prompt}`,
        `Which diagram would best represent ${lesson.title}? Explain briefly.`,
        `Reasoning: ${reasoning[1] ?? extension}`,
      ],
    },
    {
      id: `${lesson.id}-gl-3`,
      type: 'GL Exam',
      title: 'GL Exam 3 - Mixed Application',
      duration: '30 minutes',
      marks: 35,
      focus: 'Mixed GL-style problem solving with diagrams, tables, and applied contexts.',
      questions: [
        `Data interpretation: create a table or diagram for ${lesson.title}.`,
        `Applied question: ${extension}`,
        `Non-calculator reasoning: solve a simpler related case first, then generalise.`,
        `Final check: explain why your answer is reasonable.`,
      ],
    },
  ];
}

function InteractiveConceptCanvas({ mode, accent, progress }: { mode: AnimationMode; accent: string; progress: number }) {
  const t = progress / 100;
  const percent = Math.round(progress);
  const scene = Math.min(2, Math.floor(progress / 34));

  if (mode === 'percentage-bars') {
    return (
      <div className="grid gap-5">
        <div className="grid grid-cols-10 gap-1 rounded-lg bg-slate-950 p-3 shadow-inner">
          {Array.from({ length: 100 }, (_, index) => (
            <div
              key={index}
              className="aspect-square rounded-sm transition-colors duration-300"
              style={{ background: index < percent ? accent : 'rgba(255,255,255,.12)' }}
            />
          ))}
        </div>
        <div className="rounded-lg border border-white/10 bg-slate-950 p-4">
          <div className="flex items-center justify-between text-sm font-bold text-white">
            <span>0%</span>
            <span>{percent}% of the whole</span>
            <span>100%</span>
          </div>
          <div className="mt-3 h-8 overflow-hidden rounded-full bg-white/10">
            <div className="h-full rounded-full transition-all duration-300" style={{ width: `${percent}%`, background: `linear-gradient(90deg, ${accent}, #facc15)` }} />
          </div>
          <div className="mt-4 grid grid-cols-3 gap-3 text-center text-sm font-black text-slate-950">
            <div className="rounded-md bg-white p-3">fraction<br />{percent}/100</div>
            <div className="rounded-md bg-white p-3">decimal<br />{(percent / 100).toFixed(2)}</div>
            <div className="rounded-md bg-white p-3">percent<br />{percent}%</div>
          </div>
        </div>
      </div>
    );
  }

  if (mode === 'ratio-mixer') {
    const leftHeight = 24 + t * 62;
    const rightHeight = 18 + t * 72;
    return (
      <div className="grid gap-5">
        <div className="grid grid-cols-[2fr_5fr] gap-4">
          {[
            { label: '2 parts', height: leftHeight, color: accent },
            { label: '5 parts', height: rightHeight, color: '#facc15' },
          ].map((tank) => (
            <div key={tank.label} className="relative h-64 overflow-hidden rounded-lg border border-white/15 bg-slate-950 p-4">
              <div className="absolute inset-x-4 bottom-12 rounded-md transition-all duration-300" style={{ height: `${tank.height}%`, background: tank.color, boxShadow: `0 0 35px ${tank.color}77` }} />
              <div className="absolute bottom-4 left-0 right-0 text-center text-sm font-black text-white">{tank.label}</div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-2">
          {Array.from({ length: 7 }, (_, index) => (
            <span key={index} className="h-9 rounded-md transition-transform duration-300" style={{ background: index < 2 ? accent : '#facc15', transform: `translateY(${index <= scene ? -6 : 0}px)` }} />
          ))}
        </div>
      </div>
    );
  }

  if (mode === 'algebra-tiles') {
    return (
      <div className="relative min-h-80 overflow-hidden rounded-lg bg-slate-950 p-6">
        <div className="grid grid-cols-3 gap-4">
          {['Term 1', 'Term 2', 'Term n'].map((label, group) => (
            <div key={label} className="rounded-lg border border-white/10 bg-white/5 p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-400">{label}</p>
              <div className="mt-4 flex min-h-36 flex-wrap content-end gap-2">
                {Array.from({ length: group === 0 ? 3 : group === 1 ? 5 : 7 }, (_, index) => (
                  <span
                    key={index}
                    className="grid h-10 w-10 place-items-center rounded-md text-sm font-black text-slate-950 transition-transform duration-300"
                    style={{ background: index < 2 ? accent : '#facc15', transform: `translateY(${scene === group || progress > 75 ? -8 : 0}px)` }}
                  >
                    {index < 2 ? 'x' : '1'}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-5 rounded-lg bg-white p-4 text-center text-xl font-black text-slate-950">
          Visual rule: <span style={{ color: accent }}>2n</span> + growing constants
        </div>
      </div>
    );
  }

  if (mode === 'equation-balance') {
    const tilt = Math.sin(t * Math.PI * 2) * 5;
    return (
      <svg className="h-80 w-full rounded-lg bg-slate-950" viewBox="0 0 640 360" role="img" aria-label="Interactive equation balance">
        <path d="M90 300H550" stroke="rgba(255,255,255,.6)" strokeWidth="9" strokeLinecap="round" />
        <path d="M320 300V110" stroke="rgba(255,255,255,.5)" strokeWidth="8" strokeLinecap="round" />
        <g style={{ transform: `rotate(${tilt}deg)`, transformOrigin: '320px 120px', transition: 'transform .3s ease' }}>
          <path d="M150 120H490" stroke={accent} strokeWidth="10" strokeLinecap="round" />
          <path d="M170 120L118 248M170 120L222 248M470 120L418 248M470 120L522 248" stroke="rgba(255,255,255,.38)" strokeWidth="4" />
          <rect x="87" y="238" width="165" height="25" rx="8" fill="rgba(255,255,255,.14)" />
          <rect x="388" y="238" width="165" height="25" rx="8" fill="rgba(255,255,255,.14)" />
          {[0, 1, 2].map((item) => <rect key={item} x={105 + item * 43} y={194 - scene * 9} width="34" height="34" rx="6" fill={accent} />)}
          {[0, 1, 2, 3, 4].map((item) => <circle key={item} cx={413 + item * 24} cy={211 + scene * 4} r="13" fill="#facc15" />)}
        </g>
        <text x="225" y="70" fill="white" fontSize="24" fontWeight="900">remove the same value from both sides</text>
        <text x="267" y="342" fill="#fde68a" fontSize="20" fontWeight="800">x = isolated</text>
      </svg>
    );
  }

  if (mode === 'coordinate-grid' || mode === 'data-lab') {
    const x = 90 + t * 390;
    const y = 270 - t * 205;
    return (
      <svg className="h-80 w-full rounded-lg bg-slate-950" viewBox="0 0 640 360" role="img" aria-label="Interactive graph">
        {Array.from({ length: 10 }, (_, index) => <path key={`v-${index}`} d={`M${90 + index * 43} 40V290`} stroke="rgba(255,255,255,.09)" />)}
        {Array.from({ length: 7 }, (_, index) => <path key={`h-${index}`} d={`M70 ${70 + index * 35}H545`} stroke="rgba(255,255,255,.09)" />)}
        <path d="M70 290H555M90 310V40" stroke="rgba(255,255,255,.65)" strokeWidth="5" strokeLinecap="round" />
        <path d="M90 270L480 65" stroke={accent} strokeWidth="8" strokeLinecap="round" />
        <path d={`M90 270L${x} ${y}`} stroke="#facc15" strokeWidth="8" strokeLinecap="round" />
        <circle cx={x} cy={y} r="14" fill="#facc15" style={{ transition: 'all .25s ease' }} />
        <path d={`M${Math.max(90, x - 95)} ${y}H${x}V${Math.min(270, y + 55)}`} stroke="#38bdf8" strokeWidth="5" fill="none" strokeLinecap="round" />
        <text x="392" y="96" fill="white" fontSize="22" fontWeight="900">y = mx + c</text>
        <text x={x + 12} y={y - 12} fill="#fde68a" fontSize="18" fontWeight="800">({Math.round(t * 10)}, {Math.round(1 + t * 8)})</text>
      </svg>
    );
  }

  if (mode === 'angle-lab' || mode === 'construction-compass') {
    const angle = 20 + t * 130;
    const rad = (Math.PI / 180) * angle;
    const x = 170 + Math.cos(-rad) * 250;
    const y = 250 + Math.sin(-rad) * 250;
    return (
      <svg className="h-80 w-full rounded-lg bg-slate-950" viewBox="0 0 640 360" role="img" aria-label="Interactive angle lab">
        <path d="M170 250H540" stroke="rgba(255,255,255,.7)" strokeWidth="7" strokeLinecap="round" />
        <path d={`M170 250L${x} ${y}`} stroke={accent} strokeWidth="8" strokeLinecap="round" style={{ transition: 'all .25s ease' }} />
        <path d={`M235 250 A65 65 0 0 1 ${170 + Math.cos(-rad) * 65} ${250 + Math.sin(-rad) * 65}`} fill="none" stroke="#facc15" strokeWidth="12" strokeLinecap="round" />
        <circle cx="170" cy="250" r="15" fill="#facc15" />
        <circle cx={x} cy={y} r="9" fill="white" />
        <path d="M90 92H540M90 156H540" stroke="rgba(255,255,255,.24)" strokeWidth="5" strokeLinecap="round" />
        <path d="M225 205 A90 90 0 0 1 405 205" stroke="rgba(255,255,255,.45)" strokeWidth="4" strokeDasharray="9 8" fill="none" />
        <text x="255" y="224" fill="#fde68a" fontSize="28" fontWeight="900">{Math.round(angle)} degrees</text>
        <text x="278" y="55" fill="white" fontSize="20" fontWeight="900">rotate, measure, justify</text>
      </svg>
    );
  }

  if (mode === 'circle-lab' || mode === 'probability-spinner') {
    const strip = 40 + t * 360;
    return (
      <div className="relative min-h-80 overflow-hidden rounded-lg bg-slate-950 p-6">
        <div className="mx-auto grid h-56 w-56 place-items-center rounded-full border-[14px] border-white/10 shadow-2xl transition-transform duration-300" style={{ background: `conic-gradient(${accent} 0 ${120 + t * 60}deg, #facc15 ${120 + t * 60}deg 250deg, #38bdf8 250deg 360deg)`, transform: `rotate(${t * 220}deg) rotateX(50deg)` }}>
          <div className="h-20 w-20 rounded-full bg-slate-950 shadow-inner" />
          <div className="absolute left-1/2 top-1/2 h-1.5 w-28 origin-left rounded-full bg-white" />
        </div>
        <div className="absolute bottom-10 left-8 right-8">
          <p className="mb-2 text-sm font-bold text-slate-300">Circumference unwrap / outcome space</p>
          <div className="h-7 overflow-hidden rounded-full bg-white/10">
            <div className="h-full rounded-full transition-all duration-300" style={{ width: `${Math.min(100, strip / 4.1)}%`, background: `linear-gradient(90deg, ${accent}, #facc15, #38bdf8)` }} />
          </div>
        </div>
      </div>
    );
  }

  if (mode === 'solid-builder') {
    const fold = 55 - t * 55;
    return (
      <div className="relative min-h-80 overflow-hidden rounded-lg bg-slate-950 p-6 [perspective:900px]">
        <div className="absolute left-1/2 top-1/2 h-28 w-28 -translate-x-1/2 -translate-y-1/2" style={{ transformStyle: 'preserve-3d', transform: 'rotateX(58deg) rotateZ(-35deg)' }}>
          {[
            ['front', `translateZ(56px) rotateX(${fold}deg)`, accent],
            ['back', `translateZ(-56px) rotateX(-${fold}deg)`, '#38bdf8'],
            ['left', `translateX(-56px) rotateY(-${fold}deg)`, '#facc15'],
            ['right', `translateX(56px) rotateY(${fold}deg)`, accent],
            ['top', `translateY(-56px) rotateX(${fold}deg)`, '#38bdf8'],
            ['base', 'translateZ(0)', 'rgba(255,255,255,.16)'],
          ].map(([face, transform, color]) => (
            <div key={face} className="absolute grid h-28 w-28 place-items-center rounded-md border border-white/20 text-xs font-black uppercase tracking-wide text-white shadow-xl transition-transform duration-300" style={{ transform, background: color }}>
              {face}
            </div>
          ))}
        </div>
        <div className="absolute bottom-8 left-8 right-8 grid grid-cols-8 gap-1">
          {Array.from({ length: Math.max(4, Math.round(32 * t)) }, (_, index) => <span key={index} className="h-5 rounded-sm bg-cyan-300/80" />)}
        </div>
      </div>
    );
  }

  const x = 80 + t * 450;
  return (
    <svg className="h-80 w-full rounded-lg bg-slate-950" viewBox="0 0 640 360" role="img" aria-label="Interactive number line">
      <path d="M70 180H565" stroke="rgba(255,255,255,.7)" strokeWidth="6" strokeLinecap="round" />
      {Array.from({ length: 11 }, (_, index) => (
        <g key={index}>
          <path d={`M${90 + index * 43} 164V196`} stroke="rgba(255,255,255,.45)" strokeWidth="3" />
          <text x={83 + index * 43} y="226" fill="rgba(255,255,255,.75)" fontSize="16">{index - 5}</text>
        </g>
      ))}
      <path d={`M80 145H${x}`} stroke={accent} strokeWidth="12" strokeLinecap="round" />
      <circle cx={x} cy="180" r="17" fill="#facc15" style={{ transition: 'cx .25s ease' }} />
      <rect x="120" y="62" width={Math.max(40, t * 310)} height="48" rx="8" fill={accent} opacity=".78" />
      <text x="132" y="93" fill="white" fontSize="20" fontWeight="900">magnitude grows along the scale</text>
    </svg>
  );
}

function ConceptDiagram({ mode, accent }: { mode: AnimationMode; accent: string }) {
  if (mode === 'percentage-bars') {
    return (
      <div className="grid gap-4">
        <div className="grid grid-cols-10 gap-1 rounded-lg bg-slate-900 p-3">
          {Array.from({ length: 100 }, (_, index) => (
            <div key={index} className="aspect-square rounded-sm" style={{ background: index < 42 ? accent : 'rgba(255,255,255,.14)' }} />
          ))}
        </div>
        <div className="h-8 overflow-hidden rounded-full bg-slate-800">
          <div className="h-full w-[42%] rounded-full" style={{ background: `linear-gradient(90deg, ${accent}, #facc15)` }} />
        </div>
        <div className="flex justify-between text-xs font-bold uppercase tracking-wide text-slate-300">
          <span>0%</span>
          <span>42 shaded parts</span>
          <span>100%</span>
        </div>
      </div>
    );
  }

  if (mode === 'ratio-mixer') {
    return (
      <div className="grid gap-5">
        <div className="grid grid-cols-[2fr_5fr] gap-2">
          {['2 parts', '5 parts'].map((label, index) => (
            <div key={label} className="rounded-lg border border-white/10 bg-slate-900 p-3">
              <div className="h-28 rounded-md" style={{ background: index === 0 ? `${accent}dd` : '#facc15dd' }} />
              <p className="mt-2 text-center text-sm font-bold text-white">{label}</p>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: 7 }, (_, index) => (
            <span key={index} className="h-7 rounded-md" style={{ background: index < 2 ? accent : '#facc15' }} />
          ))}
        </div>
      </div>
    );
  }

  if (mode === 'algebra-tiles' || mode === 'equation-balance') {
    return (
      <svg className="h-72 w-full" viewBox="0 0 520 300" role="img" aria-label="Algebra balance diagram">
        <path d="M70 225H450" stroke="rgba(255,255,255,.72)" strokeWidth="8" strokeLinecap="round" />
        <path d="M260 225V80" stroke="rgba(255,255,255,.55)" strokeWidth="7" strokeLinecap="round" />
        <path d="M145 126H375" stroke={accent} strokeWidth="9" strokeLinecap="round" />
        <path d="M145 126L105 205M145 126L185 205M375 126L335 205M375 126L415 205" stroke="rgba(255,255,255,.42)" strokeWidth="4" />
        {[0, 1, 2].map((item) => (
          <rect key={item} x={92 + item * 48} y="176" width="38" height="38" rx="6" fill={accent} />
        ))}
        {[0, 1, 2, 3].map((item) => (
          <circle key={item} cx={333 + item * 24} cy="195" r="13" fill="#facc15" />
        ))}
        <text x="110" y="201" fill="#0f172a" fontSize="22" fontWeight="800">x</text>
        <text x="222" y="66" fill="white" fontSize="22" fontWeight="800">same operation both sides</text>
      </svg>
    );
  }

  if (mode === 'coordinate-grid' || mode === 'data-lab') {
    return (
      <svg className="h-72 w-full" viewBox="0 0 520 300" role="img" aria-label="Coordinate graph diagram">
        {Array.from({ length: 9 }, (_, index) => <path key={`v-${index}`} d={`M${70 + index * 45} 35V255`} stroke="rgba(255,255,255,.09)" />)}
        {Array.from({ length: 6 }, (_, index) => <path key={`h-${index}`} d={`M60 ${55 + index * 38}H470`} stroke="rgba(255,255,255,.09)" />)}
        <path d="M60 255H480M70 270V35" stroke="rgba(255,255,255,.68)" strokeWidth="4" strokeLinecap="round" />
        <path d="M85 230L175 188L265 145L355 102L445 60" stroke={accent} strokeWidth="7" fill="none" strokeLinecap="round" />
        <path d="M265 145H355V102" stroke="#facc15" strokeWidth="5" fill="none" strokeLinecap="round" />
        {[85, 175, 265, 355, 445].map((x, index) => (
          <circle key={x} cx={x} cy={230 - index * 42.5} r="9" fill="#facc15" />
        ))}
        <text x="300" y="135" fill="#fde68a" fontSize="18" fontWeight="800">rise</text>
        <text x="293" y="167" fill="#fde68a" fontSize="18" fontWeight="800">run</text>
      </svg>
    );
  }

  if (mode === 'angle-lab' || mode === 'construction-compass') {
    return (
      <svg className="h-72 w-full" viewBox="0 0 520 300" role="img" aria-label="Angle and construction diagram">
        <path d="M70 105H455M70 190H455" stroke="rgba(255,255,255,.42)" strokeWidth="5" strokeLinecap="round" />
        <path d="M140 245L390 45" stroke={accent} strokeWidth="7" strokeLinecap="round" />
        <path d="M205 193 A75 75 0 0 1 250 157" fill="none" stroke="#facc15" strokeWidth="12" strokeLinecap="round" />
        <path d="M115 205 A70 70 0 0 1 255 205M335 112 A70 70 0 0 0 475 112" fill="none" stroke="rgba(255,255,255,.5)" strokeWidth="3" strokeDasharray="8 7" />
        <circle cx="205" cy="193" r="10" fill="#facc15" />
        <text x="270" y="148" fill="white" fontSize="20" fontWeight="800">angle fact</text>
      </svg>
    );
  }

  if (mode === 'circle-lab' || mode === 'probability-spinner') {
    return (
      <svg className="h-72 w-full" viewBox="0 0 520 300" role="img" aria-label="Circle and probability diagram">
        <circle cx="260" cy="150" r="92" fill="rgba(255,255,255,.08)" stroke="rgba(255,255,255,.55)" strokeWidth="5" />
        <path d="M260 150L260 58A92 92 0 0 1 345 185Z" fill={accent} opacity=".9" />
        <path d="M260 150L345 185A92 92 0 0 1 183 207Z" fill="#facc15" opacity=".86" />
        <path d="M260 150L183 207A92 92 0 0 1 260 58Z" fill="#38bdf8" opacity=".76" />
        <path d="M260 150H352" stroke="white" strokeWidth="4" strokeLinecap="round" />
        <path d="M168 258H352" stroke="#facc15" strokeWidth="6" strokeLinecap="round" />
        <text x="278" y="143" fill="white" fontSize="18" fontWeight="800">r</text>
        <text x="202" y="280" fill="#fde68a" fontSize="18" fontWeight="800">circumference unwrap</text>
      </svg>
    );
  }

  if (mode === 'solid-builder') {
    return (
      <div className="grid gap-5">
        <div className="grid grid-cols-4 gap-2">
          {['top', 'front', 'side', 'base'].map((face, index) => (
            <div key={face} className="grid h-24 place-items-center rounded-md border border-white/10 text-sm font-black uppercase tracking-wide text-white" style={{ background: index % 2 === 0 ? `${accent}99` : '#facc1599' }}>
              {face}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-6 gap-1">
          {Array.from({ length: 24 }, (_, index) => <span key={index} className="h-6 rounded-sm bg-cyan-300/80" />)}
        </div>
      </div>
    );
  }

  return (
    <svg className="h-72 w-full" viewBox="0 0 520 300" role="img" aria-label="Number line diagram">
      <path d="M60 150H470" stroke="rgba(255,255,255,.72)" strokeWidth="5" strokeLinecap="round" />
      {Array.from({ length: 9 }, (_, index) => (
        <g key={index}>
          <path d={`M${80 + index * 45} 138V162`} stroke="rgba(255,255,255,.52)" strokeWidth="3" />
          <text x={73 + index * 45} y="188" fill="rgba(255,255,255,.72)" fontSize="15">{index - 4}</text>
        </g>
      ))}
      <path d="M215 118H350" stroke={accent} strokeWidth="12" strokeLinecap="round" />
      <circle cx="215" cy="150" r="16" fill="#0f172a" stroke={accent} strokeWidth="6" />
      <circle cx="350" cy="150" r="16" fill={accent} />
      <text x="210" y="88" fill="#fde68a" fontSize="20" fontWeight="800">solution ray</text>
    </svg>
  );
}

function Concept3DModel({ mode, accent }: { mode: AnimationMode; accent: string }) {
  const cubeCount = mode === 'solid-builder' ? 18 : mode === 'data-lab' ? 12 : 9;

  if (mode === 'circle-lab' || mode === 'probability-spinner') {
    return (
      <div className="relative grid min-h-72 place-items-center overflow-hidden rounded-lg bg-slate-900 [perspective:900px]">
        <div className="relative h-52 w-52 animate-spin rounded-full border-[18px] border-white/10 shadow-2xl [animation-duration:9s]" style={{ background: `conic-gradient(${accent} 0 120deg, #facc15 120deg 230deg, #38bdf8 230deg 360deg)`, transform: 'rotateX(58deg)' }}>
          <div className="absolute inset-12 rounded-full bg-slate-950 shadow-inner" />
          <div className="absolute left-1/2 top-1/2 h-2 w-24 origin-left -translate-y-1/2 rounded-full bg-white" />
        </div>
        <p className="absolute bottom-5 rounded-md bg-black/35 px-3 py-2 text-sm font-bold text-white">3D rotating sector model</p>
      </div>
    );
  }

  if (mode === 'angle-lab' || mode === 'construction-compass') {
    return (
      <div className="relative grid min-h-72 place-items-center overflow-hidden rounded-lg bg-slate-900">
        <div className="absolute h-56 w-56 rounded-full border border-dashed border-white/25" />
        <div className="absolute h-2 w-44 origin-left rounded-full bg-white" style={{ left: '50%', top: '50%', transform: 'rotate(-7deg)' }} />
        <div className="absolute h-2 w-44 origin-left animate-spin rounded-full" style={{ left: '50%', top: '50%', background: accent, animationDuration: '6s' }} />
        <div className="grid h-16 w-16 place-items-center rounded-full bg-white font-black text-slate-950 shadow-xl">A</div>
        <p className="absolute bottom-5 rounded-md bg-black/35 px-3 py-2 text-sm font-bold text-white">Rotating ray and compass arc</p>
      </div>
    );
  }

  return (
    <div className="relative min-h-72 overflow-hidden rounded-lg bg-slate-900 p-6 [perspective:900px]">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.06)_1px,transparent_1px)] bg-[size:32px_32px]" />
      <div className="relative mx-auto mt-8 grid w-fit grid-cols-6 gap-3" style={{ transform: 'rotateX(58deg) rotateZ(-28deg)', transformStyle: 'preserve-3d' }}>
        {Array.from({ length: cubeCount }, (_, index) => (
          <span
            key={index}
            className="h-10 w-10 rounded-md border border-white/20 shadow-[10px_10px_0_rgba(15,23,42,.6)]"
            style={{ background: index % 3 === 0 ? accent : index % 3 === 1 ? '#facc15' : '#38bdf8', transform: `translateZ(${(index % 4) * 6}px)` }}
          />
        ))}
      </div>
      <p className="absolute bottom-5 left-6 rounded-md bg-black/35 px-3 py-2 text-sm font-bold text-white">3D manipulative model</p>
    </div>
  );
}

/**
 * Three-frame teaching storyboard. Replaces the previous "playable video reel"
 * decoration with a clean numbered sequence of the three stages a teacher
 * walks through when introducing this concept. No fake play button, no
 * rotating gradients — just substance.
 */
function ConceptStoryboard({
  pack,
  mode,
  accent,
  progress,
}: {
  pack: ConceptResearchPack;
  mode: AnimationMode;
  accent: string;
  progress: number;
}) {
  const copy = mediaCopy[mode];
  const sceneIndex = Math.min(2, Math.floor(progress / 34));

  return (
    <section className="rounded-lg border border-white/10 bg-slate-950 p-4">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-cyan-200">Teaching storyboard</p>
          <h3 className="mt-0.5 text-lg font-bold text-white">{pack.topic}</h3>
        </div>
        <span className="rounded-md border border-white/10 bg-white/5 px-2 py-1 text-[10px] font-bold text-slate-300">
          Frame {sceneIndex + 1} of {copy.frames.length}
        </span>
      </div>
      <ol className="grid gap-3 md:grid-cols-3">
        {copy.frames.map((frame, index) => {
          const isActive = index === sceneIndex;
          return (
            <li
              key={frame}
              className={`rounded-md border p-3 transition ${isActive ? 'border-cyan-300 bg-white/10' : 'border-white/10 bg-white/5'}`}
              style={isActive ? { boxShadow: `0 0 0 1px ${accent}` } : undefined}
            >
              <div className="flex items-center gap-2">
                <span
                  className="grid h-6 w-6 shrink-0 place-items-center rounded-full text-[10px] font-black text-white"
                  style={{ background: accent }}
                >
                  {index + 1}
                </span>
                <p className="text-[10px] font-black uppercase tracking-wide text-cyan-200">
                  {isActive ? 'Current' : `Frame ${index + 1}`}
                </p>
              </div>
              <p className="mt-2 text-sm font-semibold leading-6 text-white">{frame}</p>
            </li>
          );
        })}
      </ol>
      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{ width: `${progress}%`, background: accent }}
        />
      </div>
    </section>
  );
}

function YouTubeVisualSourcePanel({ lesson }: { lesson: CourseLesson }) {
  const topicQueries = youtubeTopicQueries[lesson.animation];
  const [videoUrl, setVideoUrl] = useState(lesson.animation === 'number-line' ? 'https://www.youtube.com/watch?v=a4FXl4zb3E4' : '');
  const videoId = getYoutubeVideoId(videoUrl);
  const lessonSearch = getYoutubeSearchUrl(`${lesson.title} ${lesson.textbookSection} grade 8 maths visual explanation animation`);

  return (
    <section className="rounded-lg border border-white/10 bg-slate-950 p-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-red-200">
            <Youtube className="h-4 w-4" />
            YouTube visual source layer
          </p>
          <h4 className="mt-1 text-lg font-black text-white">Pull external video explanations into this concept lab</h4>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-300">
            Use public YouTube embeds and teacher-selected sources as supporting media while the original interactive model remains available for live explanation.
          </p>
        </div>
        <a href={lessonSearch} target="_blank" rel="noreferrer" className="inline-flex shrink-0 items-center justify-center gap-2 rounded-md bg-white px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-red-100">
          Search This Topic <ExternalLink className="h-4 w-4" />
        </a>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[1.25fr_0.75fr]">
        <div>
          <label className="text-xs font-bold uppercase tracking-wide text-slate-400" htmlFor="youtube-url">Paste a YouTube lesson URL or video ID</label>
          <div className="mt-2 flex flex-col gap-2 sm:flex-row">
            <input
              id="youtube-url"
              className="min-h-11 flex-1 rounded-md border border-white/10 bg-white px-3 text-sm font-medium text-slate-950 outline-none transition focus:border-red-300"
              onChange={(event) => setVideoUrl(event.target.value)}
              placeholder="https://www.youtube.com/watch?v=..."
              value={videoUrl}
            />
            <button onClick={() => setVideoUrl('https://www.youtube.com/watch?v=a4FXl4zb3E4')} className="rounded-md border border-white/15 px-4 py-2 text-sm font-semibold text-white transition hover:border-white/50">
              Load Example
            </button>
          </div>

          <div className="mt-4 aspect-video overflow-hidden rounded-lg border border-white/10 bg-black">
            {videoId ? (
              <iframe
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="h-full w-full"
                referrerPolicy="strict-origin-when-cross-origin"
                src={`https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1`}
                title={`YouTube visual explanation for ${lesson.title}`}
              />
            ) : (
              <div className="grid h-full place-items-center p-6 text-center">
                <div>
                  <Youtube className="mx-auto h-12 w-12 text-red-300" />
                  <p className="mt-4 text-lg font-black text-white">Choose or paste a YouTube explainer</p>
                  <p className="mt-2 text-sm leading-6 text-slate-400">Some schools block YouTube or some owners disable embedding. Use the search links if the player cannot load.</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-xs font-bold uppercase tracking-wide text-slate-400">Curated search routes</p>
          {topicQueries.map((query) => (
            <a key={query} href={getYoutubeSearchUrl(`${query} ${trustedVideoChannels.join(' OR ')}`)} target="_blank" rel="noreferrer" className="flex items-center justify-between gap-3 rounded-lg border border-white/10 bg-white/5 p-3 text-sm font-semibold text-slate-100 transition hover:border-red-200 hover:bg-red-300/10">
              <span>{query}</span>
              <ExternalLink className="h-4 w-4 shrink-0 text-red-200" />
            </a>
          ))}
          <div className="rounded-lg border border-amber-200/20 bg-amber-200/10 p-3 text-sm leading-6 text-amber-50">
            Recommended channels to check first: {trustedVideoChannels.join(', ')}.
          </div>
        </div>
      </div>
    </section>
  );
}

function ConceptMediaWall({ lesson, pack, accent }: { lesson: CourseLesson; pack: ConceptResearchPack; accent: string }) {
  const copy = mediaCopy[lesson.animation];
  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const sceneIndex = Math.min(2, Math.floor(progress / 34));

  useEffect(() => {
    if (!isPlaying) return undefined;
    const timer = window.setInterval(() => {
      setProgress((current) => (current >= 100 ? 0 : current + 1.35));
    }, 90);

    return () => window.clearInterval(timer);
  }, [isPlaying]);

  const jumpToScene = (index: number) => {
    setProgress(clampProgress(index * 34 + 2));
    setIsPlaying(false);
  };

  return (
    <section className="rounded-lg border border-white/10 bg-white/10 p-5 backdrop-blur">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-cyan-200">Illustrations, 3D and video</p>
          <h3 className="text-xl font-black">Concept media wall</h3>
        </div>
        <p className="text-sm text-slate-300">Built for full-window teaching and screen sharing</p>
      </div>

      <div className="mt-5 rounded-lg border border-cyan-200/20 bg-slate-950 p-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-cyan-200">Interactive teacher controls</p>
            <h4 className="mt-1 text-lg font-black text-white">{copy.frames[sceneIndex]}</h4>
          </div>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => setIsPlaying((current) => !current)} className="inline-flex items-center gap-2 rounded-md bg-white px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-100">
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              {isPlaying ? 'Pause' : 'Play'}
            </button>
            <button onClick={() => { setProgress(0); setIsPlaying(false); }} className="inline-flex items-center gap-2 rounded-md border border-white/15 px-4 py-2 text-sm font-semibold text-white transition hover:border-white/50">
              Reset <RotateCcw className="h-4 w-4" />
            </button>
          </div>
        </div>

        <input
          aria-label="Scrub concept animation"
          className="mt-4 w-full accent-cyan-300"
          max="100"
          min="0"
          onChange={(event) => {
            setProgress(Number(event.target.value));
            setIsPlaying(false);
          }}
          type="range"
          value={progress}
        />
        <div className="mt-3 grid gap-2 md:grid-cols-3">
          {copy.frames.map((frame, index) => (
            <button
              key={frame}
              onClick={() => jumpToScene(index)}
              className={`rounded-md border px-3 py-2 text-left text-sm font-semibold transition ${sceneIndex === index ? 'border-cyan-200 bg-cyan-200 text-slate-950' : 'border-white/10 bg-white/5 text-slate-200 hover:border-white/40'}`}
            >
              Scene {index + 1}: {frame}
            </button>
          ))}
        </div>
      </div>

      <article className="mt-5 rounded-lg border border-white/10 bg-slate-950 p-4">
        <p className="text-xs font-bold uppercase tracking-wide text-slate-400">Interactive model</p>
        <h4 className="mt-1 font-bold text-white">{pack.topic}</h4>
        <p className="mt-1 text-xs text-slate-400">Drag the timeline above to watch the model change in step with the worked solution.</p>
        <div className="mt-4">
          <InteractiveConceptCanvas mode={lesson.animation} accent={accent} progress={progress} />
        </div>
      </article>

      <div className="mt-5 grid gap-4 xl:grid-cols-2">
        <article className="rounded-lg border border-white/10 bg-slate-950 p-4">
          <p className="text-xs font-bold uppercase tracking-wide text-slate-400">Visual diagram</p>
          <h4 className="mt-1 font-bold text-white">{copy.diagram}</h4>
          <div className="mt-4 overflow-hidden rounded-lg border border-white/10 bg-slate-900 p-3">
            <ConceptDiagram mode={lesson.animation} accent={accent} />
          </div>
        </article>

        <article className="rounded-lg border border-white/10 bg-slate-950 p-4">
          <p className="text-xs font-bold uppercase tracking-wide text-slate-400">Spatial view</p>
          <h4 className="mt-1 font-bold text-white">Visualise the structure in three dimensions</h4>
          <div className="mt-4">
            <Concept3DModel mode={lesson.animation} accent={accent} />
          </div>
        </article>
      </div>

      <div className="mt-4">
        <ConceptStoryboard pack={pack} mode={lesson.animation} accent={accent} progress={progress} />
      </div>

      <div className="mt-4">
        <YouTubeVisualSourcePanel lesson={lesson} />
      </div>
    </section>
  );
}

function ConceptLabWindow({
  lesson,
  pack,
  accent,
  onClose,
  onTeach,
}: {
  lesson: CourseLesson;
  pack: ConceptResearchPack;
  accent: string;
  onClose: () => void;
  onTeach: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950 text-white">
      <div className="sticky top-0 z-10 border-b border-white/10 bg-slate-950/90 px-5 py-4 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-cyan-200">Full-window concept studio</p>
            <h2 className="text-2xl font-black tracking-normal">{lesson.title}</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            <button onClick={onTeach} className="inline-flex items-center gap-2 rounded-md bg-white px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-100">
              Teach With Camera <Video className="h-4 w-4" />
            </button>
            <button onClick={onClose} className="inline-flex items-center gap-2 rounded-md border border-white/20 px-4 py-2 text-sm font-semibold text-white transition hover:border-white/50">
              Close <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl gap-6 px-5 py-6 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-6">
          <AnimatedConcept lesson={lesson} accent={accent} />
          <ConceptMediaWall lesson={lesson} pack={pack} accent={accent} />

          <section className="rounded-lg border border-white/10 bg-white/10 p-5 backdrop-blur">
            <div className="flex items-start gap-3">
              <Columns3 className="mt-1 h-5 w-5 shrink-0" style={{ color: accent }} />
              <div>
                <h3 className="text-lg font-bold">Research-backed illustration sequence</h3>
                <p className="mt-2 text-sm leading-6 text-slate-200">{pack.researchNote}</p>
              </div>
            </div>
            <div className="mt-5 grid gap-3 md:grid-cols-2">
              {pack.visualStrategies.map((strategy, index) => (
                <article key={strategy.title} className="rounded-lg border border-white/10 bg-slate-900/70 p-4">
                  <div className="flex items-center gap-3">
                    <span className="grid h-8 w-8 place-items-center rounded-md text-sm font-black text-slate-950" style={{ background: accent }}>{index + 1}</span>
                    <h4 className="font-bold">{strategy.title}</h4>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-slate-200">{strategy.method}</p>
                  <p className="mt-3 text-xs font-bold uppercase tracking-wide text-cyan-200">Teacher move</p>
                  <p className="mt-1 text-sm leading-6 text-slate-300">{strategy.classroomMove}</p>
                  <p className="mt-3 text-xs font-bold uppercase tracking-wide text-amber-200">Animation cue</p>
                  <p className="mt-1 text-sm leading-6 text-slate-300">{strategy.animationCue}</p>
                </article>
              ))}
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <section className="rounded-lg border border-white/10 bg-white p-5 text-slate-950">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Five examples</p>
            <h3 className="mt-1 text-xl font-black">Model the concept from concrete to symbolic</h3>
            <div className="mt-4 space-y-3">
              {pack.examples.map((example, index) => (
                <article key={`${example.label}-${example.prompt}`} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-start gap-3">
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-md text-sm font-black text-white" style={{ background: accent }}>{index + 1}</span>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wide text-slate-500">{example.label}</p>
                      <p className="mt-1 font-semibold text-slate-900">{example.prompt}</p>
                    </div>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-slate-700">{example.method}</p>
                  <div className="mt-3 rounded-md bg-slate-950 p-3 font-mono text-sm font-bold text-white">Answer: {example.answer}</div>
                </article>
              ))}
            </div>
          </section>

          <section className="rounded-lg border border-white/10 bg-white p-5 text-slate-950">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Five exercises</p>
            <h3 className="mt-1 text-xl font-black">Student practice with success checks</h3>
            <div className="mt-4 space-y-3">
              {pack.exercises.map((exercise, index) => (
                <article key={`${exercise.label}-${exercise.prompt}`} className="rounded-lg border border-slate-200 p-4">
                  <div className="flex gap-3">
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-md bg-slate-100 text-sm font-black text-slate-800">{index + 1}</span>
                    <div>
                      <p className="font-semibold text-slate-900">{exercise.prompt}</p>
                      <p className="mt-2 text-sm leading-6 text-slate-600"><strong>Success check:</strong> {exercise.successCheck}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="rounded-lg border border-white/10 bg-white/10 p-5 backdrop-blur">
            <h3 className="text-lg font-bold">Presentation rhythm</h3>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {['Illustrate', 'Animate', 'Practise'].map((step, index) => (
                <div key={step} className="rounded-lg border border-white/10 bg-slate-900/70 p-4">
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-400">Stage {index + 1}</p>
                  <p className="mt-1 text-lg font-black">{step}</p>
                </div>
              ))}
            </div>
            <button onClick={onClose} className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-white/20 px-4 py-3 font-semibold text-white transition hover:border-cyan-300 hover:text-cyan-100">
              Return to course map <RotateCcw className="h-4 w-4" />
            </button>
          </section>
        </div>
      </div>
    </div>
  );
}

/**
 * Interactive step-by-step worked-solution viewer.
 *
 * Renders an optional `formula` banner, then walks the student through the
 * `steps` one at a time. Each step shows a teacher-style explanation and an
 * optional `working` line in a monospace box (the algebraic / numeric line
 * the student should write down). A reveal-all toggle skips to the full
 * solution. The final card shows the answer.
 *
 * If `steps` is empty, falls back to rendering the legacy single-paragraph
 * `method` so existing data still works.
 */
function WorkedSolutionSteps({
  steps,
  method,
  answer,
  formula,
  accent,
}: {
  steps?: WorkedStep[];
  method: string;
  answer: string;
  formula?: string;
  accent: string;
}) {
  const safeSteps = steps && steps.length > 0 ? steps : null;
  const [index, setIndex] = useState(0);
  const [showAll, setShowAll] = useState(false);

  if (!safeSteps) {
    return (
      <div>
        <p className="text-sm leading-6 text-gray-700">{method}</p>
        <div className="mt-3 inline-flex items-center gap-2 rounded-md bg-slate-950 px-3 py-2">
          <span className="text-[10px] font-black uppercase tracking-wide text-slate-400">Answer</span>
          <span className="font-mono text-sm font-bold text-amber-200">{answer}</span>
        </div>
      </div>
    );
  }

  const visibleSteps = showAll ? safeSteps : safeSteps.slice(0, index + 1);
  const atEnd = index >= safeSteps.length - 1;

  return (
    <div className="space-y-4">
      {formula ? (
        <div className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2">
          <p className="text-[10px] font-black uppercase tracking-widest text-amber-700">Key formula</p>
          <p className="mt-0.5 font-mono text-sm font-bold text-amber-900">{formula}</p>
        </div>
      ) : null}

      <ol className="space-y-2.5">
        {visibleSteps.map((step, i) => (
          <li
            key={i}
            className="flex gap-3 rounded-md border border-gray-200 bg-white p-3 shadow-sm"
          >
            <span
              className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-xs font-black text-white"
              style={{ background: accent }}
            >
              {i + 1}
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm leading-6 text-gray-800">{step.text}</p>
              {step.working ? (
                <p className="mt-2 rounded bg-slate-950 px-2.5 py-1.5 font-mono text-xs font-semibold text-amber-200 break-words">
                  {step.working}
                </p>
              ) : null}
            </div>
          </li>
        ))}
      </ol>

      <div className="flex flex-wrap items-center gap-2">
        {!showAll && (
          <>
            <button
              onClick={() => setIndex((i) => Math.max(0, i - 1))}
              disabled={index === 0}
              className="rounded-md border border-gray-300 px-3 py-1.5 text-xs font-bold text-gray-700 transition hover:bg-gray-50 disabled:opacity-40"
            >
              ← Previous
            </button>
            <button
              onClick={() => setIndex((i) => Math.min(safeSteps.length - 1, i + 1))}
              disabled={atEnd}
              className="rounded-md px-3 py-1.5 text-xs font-bold text-white shadow-sm transition disabled:opacity-40"
              style={{ background: accent }}
            >
              Next step →
            </button>
            <button
              onClick={() => setShowAll(true)}
              className="text-xs font-semibold text-gray-600 underline-offset-2 hover:underline"
            >
              Show all steps
            </button>
            <span className="ml-auto text-[10px] font-bold uppercase tracking-wide text-gray-400">
              Step {index + 1} of {safeSteps.length}
            </span>
          </>
        )}
        {showAll && (
          <button
            onClick={() => {
              setShowAll(false);
              setIndex(0);
            }}
            className="rounded-md border border-gray-300 px-3 py-1.5 text-xs font-bold text-gray-700 transition hover:bg-gray-50"
          >
            ← Walk through again
          </button>
        )}
      </div>

      {(showAll || atEnd) && (
        <div className="rounded-md border border-emerald-200 bg-emerald-50 p-3">
          <p className="text-[10px] font-black uppercase tracking-widest text-emerald-700">Final answer</p>
          <p className="mt-1 font-mono text-sm font-bold text-emerald-900 break-words">{answer}</p>
        </div>
      )}
    </div>
  );
}

/** Compact hero for the currently-selected lesson. Combines inquiry,
 *  objectives, primary CTA and delivery actions into ONE card so the
 *  studio body starts with a clear single anchor instead of three. */
function LessonHeroCard({
  lesson,
  accent,
  onOpenLab,
  onBuildPlan,
  onTeachLive,
}: {
  lesson: CourseLesson;
  accent: string;
  onOpenLab: () => void;
  onBuildPlan: () => void;
  onTeachLive: () => void;
}) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-wide text-gray-500">{lesson.textbookSection}</p>
          <h2 className="mt-1 text-2xl font-bold text-gray-900">{lesson.title}</h2>
        </div>
        <button
          onClick={onOpenLab}
          className="inline-flex shrink-0 items-center gap-2 rounded-md px-4 py-2 text-sm font-bold text-white shadow-sm transition hover:opacity-90"
          style={{ background: accent }}
        >
          Open Worked Solution <MonitorPlay className="h-4 w-4" />
        </button>
      </div>

      <p className="mt-4 rounded-md border-l-4 border-amber-300 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-900">
        <strong>Inquiry:</strong> {lesson.inquiry}
      </p>

      <div className="mt-4 grid gap-2 md:grid-cols-3">
        {lesson.objectives.map((objective) => (
          <div
            key={objective}
            className="flex items-start gap-2 rounded-md border border-gray-200 bg-gray-50 px-3 py-2"
          >
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
            <p className="text-xs leading-5 text-gray-700">{objective}</p>
          </div>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap gap-2 border-t border-gray-100 pt-4">
        <button
          onClick={onBuildPlan}
          className="inline-flex items-center gap-2 rounded-md bg-slate-900 px-3.5 py-2 text-xs font-bold text-white transition hover:bg-slate-700"
        >
          <BookOpen className="h-3.5 w-3.5" /> Build Lesson Plan
        </button>
        <button
          onClick={onTeachLive}
          className="inline-flex items-center gap-2 rounded-md border border-gray-200 px-3.5 py-2 text-xs font-bold text-gray-700 transition hover:bg-gray-50"
        >
          <Video className="h-3.5 w-3.5" /> Teach With Camera
        </button>
        <span className="ml-auto inline-flex items-center gap-1 text-[11px] font-semibold text-gray-500">
          <Gamepad2 className="h-3.5 w-3.5" /> Saves to planner, grader, classroom chat
        </span>
      </div>
    </div>
  );
}

function MathExamPanel({ lesson, accent }: { lesson: CourseLesson; accent: string }) {
  const packs = createMathExamPacks(lesson);

  return (
    <section className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-gray-500">Exams</p>
          <h3 className="mt-1 text-lg font-black text-gray-900">3 Exams + 3 GL Exams</h3>
        </div>
        <span className="rounded-md border px-2.5 py-1 text-[10px] font-black uppercase tracking-wide" style={{ borderColor: `${accent}55`, color: accent }}>
          {lesson.title}
        </span>
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-2">
        {packs.map((pack) => (
          <details key={pack.id} className="group rounded-lg border border-gray-200 bg-gray-50 p-3 open:bg-white open:shadow-sm">
            <summary className="cursor-pointer list-none">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[10px] font-black uppercase tracking-wide" style={{ color: pack.type === 'GL Exam' ? '#7c3aed' : accent }}>
                    {pack.type}
                  </p>
                  <h4 className="mt-1 font-black text-gray-950">{pack.title}</h4>
                  <p className="mt-1 text-xs leading-5 text-gray-600">{pack.focus}</p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-xs font-black text-gray-900">{pack.marks} marks</p>
                  <p className="mt-1 text-[11px] font-semibold text-gray-500">{pack.duration}</p>
                </div>
              </div>
            </summary>
            <ol className="mt-3 space-y-2 border-t border-gray-200 pt-3">
              {pack.questions.map((question, index) => (
                <li key={`${pack.id}-${index}`} className="flex gap-2 rounded-md bg-white p-2 text-xs leading-5 text-gray-700">
                  <span className="font-black" style={{ color: pack.type === 'GL Exam' ? '#7c3aed' : accent }}>
                    {index + 1}.
                  </span>
                  <span>{question}</span>
                </li>
              ))}
            </ol>
          </details>
        ))}
      </div>
    </section>
  );
}

/** Section wrapper with a header (title + count) and a children slot. */
function ExpandableSection({
  title,
  subtitle,
  count,
  accent,
  children,
}: {
  title: string;
  subtitle?: string;
  count: number;
  accent: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-3">
      <header className="flex items-end justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span
              className="inline-flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 text-[10px] font-black text-white"
              style={{ background: accent }}
            >
              {count}
            </span>
            <h3 className="text-base font-bold text-gray-900">{title}</h3>
          </div>
          {subtitle ? <p className="mt-1 text-xs text-gray-500">{subtitle}</p> : null}
        </div>
      </header>
      {children}
    </section>
  );
}

/** A controlled expandable card. When `isOpen` it claims the full grid
 *  row (col-span-full) and renders rich detail. Collapsed it shows the
 *  number + title only. The parent owns selection state, so only one
 *  card in a group can be open at a time — eliminates dead space and
 *  keeps the viewport focused on what the user clicked. */
function ExpandableCard({
  index,
  accent,
  title,
  preview,
  children,
  variant,
  isOpen,
  onToggle,
  fullWidth = false,
}: {
  index: number | string;
  accent: string;
  title: string;
  preview?: string;
  children: React.ReactNode;
  variant: 'example' | 'exercise' | 'extension' | 'project';
  isOpen: boolean;
  onToggle: () => void;
  fullWidth?: boolean;
}) {
  const palette = {
    example: { bg: 'bg-white', border: 'border-gray-200', hover: 'hover:border-gray-400 hover:bg-gray-50' },
    exercise: { bg: 'bg-indigo-50/60', border: 'border-indigo-200', hover: 'hover:border-indigo-400 hover:bg-indigo-50' },
    extension: { bg: 'bg-emerald-50/60', border: 'border-emerald-200', hover: 'hover:border-emerald-400 hover:bg-emerald-50' },
    project: { bg: 'bg-white', border: 'border-gray-200', hover: 'hover:border-gray-400' },
  }[variant];

  return (
    <article
      className={`group relative overflow-hidden rounded-lg border shadow-sm transition-all ${palette.bg} ${palette.border} ${palette.hover} ${isOpen || fullWidth ? 'col-span-full' : ''}`}
      style={isOpen ? { boxShadow: `0 0 0 2px ${accent}, 0 12px 32px -8px ${accent}55` } : undefined}
    >
      <button
        type="button"
        onClick={onToggle}
        className={`flex w-full items-start gap-3 text-left transition ${isOpen ? 'p-5' : 'p-4'}`}
        aria-expanded={isOpen}
      >
        <span
          className={`grid shrink-0 place-items-center rounded-full font-black text-white transition-all ${isOpen ? 'h-10 w-10 text-base' : 'h-7 w-7 text-xs'}`}
          style={{ background: accent }}
        >
          {index}
        </span>
        <div className="min-w-0 flex-1 overflow-hidden">
          <p className={`break-words font-semibold text-gray-900 transition-all ${isOpen ? 'text-base leading-6 sm:text-lg sm:leading-7' : 'line-clamp-2 text-sm leading-5'}`}>
            {title}
          </p>
          {!isOpen && preview ? (
            <p className="mt-1 line-clamp-1 text-xs text-gray-500">{preview}</p>
          ) : null}
        </div>
        <ChevronDown
          className={`mt-1 h-4 w-4 shrink-0 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      {isOpen ? (
        <div className="border-t border-gray-100 bg-gradient-to-b from-transparent to-gray-50/40 px-4 pb-5 pt-4 sm:px-6 sm:pb-6 sm:pt-5">
          <div className="max-w-4xl break-words sm:ml-[3.25rem]">{children}</div>
        </div>
      ) : null}
    </article>
  );
}

export function EISMathStudio({ setActiveTab }: EISMathStudioProps) {
  const [chapterId, setChapterId] = useState(eisMypMathCourse[0].id);
  const activeChapter = useMemo(() => eisMypMathCourse.find((chapter) => chapter.id === chapterId) ?? eisMypMathCourse[0], [chapterId]);
  const [lessonId, setLessonId] = useState(activeChapter.lessons[0].id);
  const [isLessonWindowOpen, setIsLessonWindowOpen] = useState(false);
  const [isCourseMapOpen, setIsCourseMapOpen] = useState(true);
  const [isChapterPanelOpen, setIsChapterPanelOpen] = useState(true);
  const [openExample, setOpenExample] = useState<string | null>(null);
  const [openExercise, setOpenExercise] = useState<string | null>('extension');
  const [openProject, setOpenProject] = useState(true);
  const lesson = useMemo(() => activeChapter.lessons.find((item) => item.id === lessonId) ?? activeChapter.lessons[0], [activeChapter, lessonId]);
  const conceptPack = useMemo(() => getConceptResearchPack(lesson, activeChapter), [lesson, activeChapter]);
  const cinematicPack = useMemo(() => createMathCinematicLearningPack(lesson, activeChapter), [lesson, activeChapter]);
  const generatedLessonPackage = useMemo(
    () => generateLessonAssetPackage(inputFromCourseLesson(lesson, activeChapter.title)),
    [lesson, activeChapter.title],
  );
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
    setIsLessonWindowOpen(false);
  };

  const openLessonWindow = (id: string) => {
    setLessonId(id);
    setIsLessonWindowOpen(true);
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
        `Open the worked-solution player to walk through each step with the matching diagram, then attempt the 5 student exercises.`,
        `Evidence: ${conceptPack.exercises[0].prompt} ${conceptPack.exercises[1].prompt} Extension: ${lesson.exercises.extension}`,
      ].join('\n'),
      createdAt: new Date().toISOString(),
    };
    saveActiveAssignment(assignment);
    if (destination) setActiveTab(destination);
  };

  return (
    <div className="space-y-6">
      <section className="grid gap-5 xl:grid-cols-[320px_1fr]">
        <div className="self-start rounded-lg border border-gray-200 bg-white shadow-sm">
          <button
            onClick={() => setIsCourseMapOpen((value) => !value)}
            className="flex w-full items-center justify-between gap-3 p-4 text-left transition hover:bg-gray-50"
            aria-expanded={isCourseMapOpen}
          >
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-gray-500">Choose chapter</p>
              <h2 className="mt-1 text-lg font-semibold text-gray-900">Full Course Chapters</h2>
              <p className="mt-1 text-sm text-gray-500">{eisMypMathCourse.length} chapters · {lessonCount} lessons</p>
            </div>
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-gray-100 text-gray-700">
              <ChevronDown className={`h-4 w-4 transition-transform ${isCourseMapOpen ? 'rotate-180' : ''}`} />
            </span>
          </button>
          <div className="border-t border-gray-100 px-4 py-3">
            <p className="text-xs font-bold uppercase tracking-wide text-gray-500">Selected</p>
            <p className="mt-1 font-semibold text-gray-900">{activeChapter.chapter}: {activeChapter.title}</p>
          </div>
          {isCourseMapOpen ? (
          <div className="space-y-2 border-t border-gray-100 p-4">
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
          ) : null}
        </div>

        <div className="space-y-6">
          <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
            <button
              onClick={() => setIsChapterPanelOpen((value) => !value)}
              className="flex w-full items-start justify-between gap-4 p-5 text-left transition hover:bg-gray-50"
              aria-expanded={isChapterPanelOpen}
            >
              <div>
                <div className="mb-3 inline-flex items-center gap-2 rounded-md bg-gray-100 px-3 py-2 text-xs font-bold uppercase tracking-wide text-gray-600">
                  <BookOpen className="h-4 w-4" />
                  {activeChapter.chapter} · {activeChapter.textbookStart}
                </div>
                <h2 className="text-2xl font-bold text-gray-900">{activeChapter.title}</h2>
                <p className="pt-2 text-sm text-gray-600">{activeChapter.lessons.length} lessons · selected subtopic: {lesson.title}</p>
              </div>
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-gray-100 text-gray-700">
                <ChevronDown className={`h-4 w-4 transition-transform ${isChapterPanelOpen ? 'rotate-180' : ''}`} />
              </span>
            </button>

            {isChapterPanelOpen ? (
            <div className="border-t border-gray-100 p-5">
              <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <p className="text-sm font-semibold leading-6 text-gray-700">Choose a subtopic.</p>
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
                    onClick={() => openLessonWindow(item.id)}
                    className={`rounded-lg border p-4 text-left transition ${active ? 'border-indigo-300 bg-indigo-50' : 'border-gray-200 hover:bg-gray-50'}`}
                  >
                    <Icon className="mb-3 h-5 w-5" style={{ color: accent }} />
                    <p className="text-xs font-bold uppercase tracking-wide text-gray-500">{item.textbookSection}</p>
                    <h3 className="mt-1 font-semibold text-gray-900">{item.title}</h3>
                    <p className="mt-3 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-indigo-700">
                      Open full-window lab <ArrowRight className="h-3.5 w-3.5" />
                    </p>
                  </button>
                );
              })}
            </div>
            </div>
            ) : (
              <div className="border-t border-gray-100 p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <p className="text-xs font-bold uppercase tracking-wide text-gray-500">Active lesson</p>
                    <p className="truncate font-semibold text-gray-900">{lesson.title}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button onClick={() => setIsLessonWindowOpen(true)} className="inline-flex items-center gap-2 rounded-md bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800">
                      Open Lesson <MonitorPlay className="h-4 w-4" />
                    </button>
                    <a href={game.href} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-md border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50">
                      Practice <Play className="h-4 w-4" />
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Active lesson hero — title, inquiry, objectives, primary CTA + delivery controls in one compact row */}
          <LessonHeroCard
            lesson={lesson}
            accent={accent}
            onOpenLab={() => setIsLessonWindowOpen(true)}
            onBuildPlan={() => saveLessonAssignment('lesson-planner')}
            onTeachLive={() => saveLessonAssignment('classroom')}
          />

          <MathExamPanel lesson={lesson} accent={accent} />

          <CinematicLearningPackPanel pack={cinematicPack} accent={accent} />

          {/* Worked Examples — controlled single-select. Opened card spans full row. */}
          <ExpandableSection
            title="Worked Examples"
            subtitle="Click any card — it expands to fill the row with method and answer."
            count={conceptPack.examples.length}
            accent={accent}
          >
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3" style={{ gridAutoRows: 'min-content' }}>
              {conceptPack.examples.map((example, index) => {
                const key = `${example.label}-${index}`;
                const isOpen = openExample === key;
                return (
                  <ExpandableCard
                    key={key}
                    index={index + 1}
                    accent={accent}
                    title={example.prompt}
                    preview={example.method}
                    variant="example"
                    isOpen={isOpen}
                    onToggle={() => setOpenExample(isOpen ? null : key)}
                  >
                    <WorkedSolutionSteps
                      steps={example.steps}
                      method={example.method}
                      answer={example.answer}
                      formula={example.formula}
                      accent={accent}
                    />
                  </ExpandableCard>
                );
              })}
            </div>
          </ExpandableSection>

          {/* Exercises — same pattern. Extension is its own emerald card. */}
          <ExpandableSection
            title="Student Exercises"
            subtitle="Each exercise has its own success check — click to expand."
            count={conceptPack.exercises.length + 1}
            accent={accent}
          >
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3" style={{ gridAutoRows: 'min-content' }}>
              {conceptPack.exercises.map((exercise, index) => {
                const key = `${exercise.label}-${index}`;
                const isOpen = openExercise === key;
                return (
                  <ExpandableCard
                    key={key}
                    index={index + 1}
                    accent={accent}
                    title={exercise.prompt}
                    preview={exercise.successCheck}
                    variant="exercise"
                    isOpen={isOpen}
                    onToggle={() => setOpenExercise(isOpen ? null : key)}
                  >
                    <div className="rounded-lg bg-white/70 p-4">
                      <p className="text-xs font-black uppercase tracking-wide text-indigo-700">Success check</p>
                      <p className="mt-2 text-base leading-7 text-indigo-900">{exercise.successCheck}</p>
                    </div>
                  </ExpandableCard>
                );
              })}
              <ExpandableCard
                index="+"
                accent="#10b981"
                title="Extension challenge"
                preview={lesson.exercises.extension}
                variant="extension"
                isOpen={openExercise === 'extension'}
                onToggle={() =>
                  setOpenExercise(openExercise === 'extension' ? null : 'extension')
                }
              >
                <p className="text-base leading-7 text-emerald-900">{lesson.exercises.extension}</p>
              </ExpandableCard>
            </div>
          </ExpandableSection>

          {/* Chapter Project — always full-width */}
          <ExpandableCard
            index="P"
            accent={accent}
            title={`Chapter Project · ${activeChapter.chapter}`}
            preview={activeChapter.project}
            variant="project"
            isOpen={openProject}
            onToggle={() => setOpenProject((v) => !v)}
            fullWidth
          >
            <p className="text-base leading-7 text-gray-700">{activeChapter.project}</p>
            <p className="mt-3 text-sm text-gray-500">
              <strong>Global context:</strong> {activeChapter.globalContext}
            </p>
          </ExpandableCard>
        </div>
      </section>

      {isLessonWindowOpen ? (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950">
          <div className="sticky top-0 z-20 border-b border-white/10 bg-slate-950/90 px-5 py-4 backdrop-blur">
            <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-cyan-200">Worked solution · step-by-step</p>
                <h2 className="text-xl font-black text-white">{lesson.title}</h2>
              </div>
              <button onClick={() => setIsLessonWindowOpen(false)} className="inline-flex items-center gap-2 rounded-md border border-white/20 px-4 py-2 text-sm font-semibold text-white transition hover:border-white/50">
                Close <X className="h-4 w-4" />
              </button>
            </div>
          </div>
          <div className="mx-auto max-w-7xl p-4 md:p-6">
            <CinematicLessonPlayer packageData={generatedLessonPackage} />
          </div>
        </div>
      ) : null}
    </div>
  );
}
