'use client';

import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  BarChart3,
  BrainCircuit,
  Camera,
  Check,
  CheckCircle2,
  ClipboardCheck,
  Gem,
  Loader2,
  MonitorPlay,
  Play,
  School,
  Send,
  Sparkles,
  Trophy,
  UserCheck,
} from 'lucide-react';
import { TabType } from './Sidebar';
import {
  AngleLab3D,
  CircleLab3D,
  ExplainerByType,
  PercentageBar3D,
  ProbabilitySpinner3D,
} from '@/components/Math3DExplainers';
import { TeacherSubmissionsPanel } from '@/components/TeacherSubmissionsPanel';
import { StudentAssignmentList } from '@/components/StudentAssignmentList';
import { SystemStatusStrip } from '@/components/SystemStatusStrip';
import { SubjectQuickPicker } from '@/components/SubjectQuickPicker';
import { ActiveSubjectLessonCard } from '@/components/ActiveSubjectLessonCard';
import {
  assignDemoQuestion,
  defaultDemoAssignment,
  isFirestoreBacked,
  loadDemoAssignment,
  submitDemoAnswer,
  type LearningMode,
  type DemoAssignment,
} from '@/lib/demoAssignments';
import {
  grade8Curriculum,
  threeDLabels,
  unitLabels,
  type CurriculumUnit,
} from '@/lib/grade8Curriculum';

interface DashboardHomeProps {
  mode: LearningMode;
  setMode: (mode: LearningMode) => void;
  setActiveTab: (tab: TabType) => void;
}

const progressCards = [
  { label: 'Chapter Progress', value: '64%', detail: 'Number System and Algebra active', icon: BarChart3, accent: '#49c8ff' },
  { label: 'Class Mastery', value: '78%', detail: '18 of 23 students on track', icon: UserCheck, accent: '#ffc43b' },
  { label: 'Live Readiness', value: 'Camera', detail: 'Virtual classroom route ready', icon: Camera, accent: '#8ddfff' },
  { label: 'XP Earned', value: '8,420', detail: 'NeuroQuest practice evidence', icon: Trophy, accent: '#ff8a3d' },
];

const quickActions = [
  { label: 'Open Lesson Player', tab: 'lesson' as TabType, icon: Play, style: 'bg-[#49c8ff] text-[#061126] hover:bg-[#8ddfff]' },
  { label: 'Generate Lesson with AI', tab: 'place-value-lesson' as TabType, icon: BrainCircuit, style: 'bg-[#ffc43b] text-[#061126] hover:bg-[#ffe08a]' },
  { label: 'Start Live Class', tab: 'classroom' as TabType, icon: MonitorPlay, style: 'border border-white/20 text-white hover:border-[#49c8ff] hover:text-[#8ddfff]' },
];

function useDemoAssignmentState() {
  const [assignment, setAssignment] = useState<DemoAssignment>(defaultDemoAssignment);

  useEffect(() => {
    const timer = window.setTimeout(() => setAssignment(loadDemoAssignment()), 0);

    const onStorage = () => setAssignment(loadDemoAssignment());
    const onAssignment = (event: Event) => {
      const custom = event as CustomEvent<DemoAssignment>;
      setAssignment(custom.detail ?? loadDemoAssignment());
    };

    window.addEventListener('storage', onStorage);
    window.addEventListener('eis-demo-assignment', onAssignment);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('eis-demo-assignment', onAssignment);
    };
  }, []);

  return [assignment, setAssignment] as const;
}

function HeroBackdrop() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_22%,rgba(255,196,59,.22),transparent_32%),radial-gradient(circle_at_82%_24%,rgba(73,200,255,.24),transparent_34%),linear-gradient(135deg,rgba(4,18,54,.85),rgba(5,7,17,.96)_60%,rgba(20,8,5,.85))]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,.10)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,.08)_1px,transparent_1px)] bg-[size:54px_54px]" />
      <div className="absolute -left-10 -top-10 h-40 w-40 rounded-full bg-[#ffc43b]/15 blur-3xl" />
      <div className="absolute -right-10 -top-6 h-44 w-44 rounded-full bg-[#49c8ff]/20 blur-3xl" />
    </div>
  );
}

function PersistenceBadge() {
  const backed = isFirestoreBacked();
  if (backed) {
    return (
      <span className="inline-flex items-center gap-2 rounded-md border border-[#49c8ff]/30 bg-[#49c8ff]/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-wide text-[#8ddfff]">
        <span className="h-1.5 w-1.5 rounded-full bg-[#49c8ff]" />
        Firestore persistence on
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-2 rounded-md border border-[#ffc43b]/35 bg-[#ffc43b]/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-wide text-[#ffe08a]">
      <span className="h-1.5 w-1.5 rounded-full bg-[#ffc43b]" />
      Demo mode · Firestore not configured
    </span>
  );
}

function ModeBar({ mode, setMode }: { mode: LearningMode; setMode: (mode: LearningMode) => void }) {
  return (
    <div className="flex flex-col gap-3 rounded-lg border border-white/10 bg-white/5 p-3 backdrop-blur md:flex-row md:items-center md:justify-between">
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-xs font-black uppercase tracking-wide text-[#ffc43b]">Premium demo path</p>
          <PersistenceBadge />
        </div>
        <p className="mt-1 text-sm font-semibold text-slate-200">
          Landing → Launch App → Teacher Dashboard → EIS Maths → AI 3D Generator → Assign → Student Submit → Virtual Classroom
        </p>
      </div>
      <div className="grid grid-cols-2 rounded-md border border-white/10 bg-[#050711]/70 p-1">
        {(['teacher', 'student'] as const).map((item) => (
          <button
            key={item}
            onClick={() => setMode(item)}
            className={`rounded px-4 py-2 text-sm font-black capitalize transition ${
              mode === item ? 'bg-[#49c8ff] text-[#061126] shadow-[0_0_22px_rgba(73,200,255,.35)]' : 'text-slate-300 hover:text-white'
            }`}
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  );
}

function ProgressCard({ card }: { card: typeof progressCards[number] }) {
  const Icon = card.icon;
  return (
    <article className="relative overflow-hidden rounded-lg border border-white/10 bg-white/5 p-5 backdrop-blur transition hover:border-white/25 hover:bg-white/10">
      <div
        className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full opacity-25 blur-2xl"
        style={{ background: card.accent }}
      />
      <div className="relative flex items-center justify-between">
        <Icon className="h-6 w-6" style={{ color: card.accent }} />
        <span className="rounded-full border border-white/15 bg-white/5 px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-slate-200">
          Live
        </span>
      </div>
      <p className="relative mt-4 text-xs font-black uppercase tracking-wide text-slate-400">{card.label}</p>
      <p className="relative mt-1 text-3xl font-black text-white">{card.value}</p>
      <p className="relative mt-2 text-sm leading-6 text-slate-300">{card.detail}</p>
    </article>
  );
}

const curriculumUnits: CurriculumUnit[] = ['abstract', 'numerical', 'spatial', 'data'];

function TeacherAssignmentCard({
  assignment,
  onAssign,
  setActiveTab,
}: {
  assignment: DemoAssignment;
  onAssign: (questionId: string) => Promise<void>;
  setActiveTab: (tab: TabType) => void;
}) {
  const [selectedUnit, setSelectedUnit] = useState<CurriculumUnit>(() => {
    const current = grade8Curriculum.find((q) => q.id === assignment.questionId);
    return current?.unit ?? 'abstract';
  });
  const [selectedId, setSelectedId] = useState<string>(assignment.questionId);
  const [assignState, setAssignState] = useState<'idle' | 'pending' | 'done'>('idle');

  const handleAssign = async () => {
    if (assignState === 'pending') return;
    setAssignState('pending');
    try {
      await onAssign(selectedId);
      setAssignState('done');
      window.setTimeout(() => setAssignState('idle'), 1800);
    } catch {
      setAssignState('idle');
    }
  };

  const visibleQuestions = useMemo(
    () => grade8Curriculum.filter((q) => q.unit === selectedUnit),
    [selectedUnit],
  );

  return (
    <article className="relative overflow-hidden rounded-lg border border-white/10 bg-gradient-to-br from-[#0a1736] via-[#061126] to-[#050711] p-6 text-white">
      <div className="pointer-events-none absolute -right-10 -top-10 h-44 w-44 rounded-full bg-[#ffc43b]/15 blur-3xl" />
      <div className="relative flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-wide text-[#ffc43b]">Active assignment · {assignment.lessonTitle}</p>
          <h3 className="mt-2 text-2xl font-black">{assignment.title}</h3>
          <p className="mt-2 max-w-2xl text-sm italic leading-6 text-[#8ddfff]">Inquiry: {assignment.inquiryQuestion}</p>
          <p className="mt-1 max-w-2xl text-xs leading-6 text-slate-400">Objective · {assignment.objective}</p>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-200">{assignment.question}</p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <span className="rounded-md border border-[#49c8ff]/30 bg-[#49c8ff]/10 px-3 py-2 text-xs font-black uppercase tracking-wide text-[#8ddfff]">
            {assignment.status}
          </span>
          <span className="rounded-md border border-white/15 bg-white/5 px-2 py-1 text-[10px] font-black uppercase tracking-wide text-slate-200">
            3D · {threeDLabels[assignment.threeDType]}
          </span>
          <button
            onClick={() => setActiveTab('lesson')}
            className="inline-flex items-center gap-1 rounded-md border border-[#49c8ff]/35 bg-[#49c8ff]/10 px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-[#8ddfff] transition hover:border-[#49c8ff] hover:bg-[#49c8ff]/20"
          >
            Open lesson workspace
            <ArrowRight className="h-3 w-3" />
          </button>
        </div>
      </div>

      <div className="relative mt-6 rounded-lg border border-white/10 bg-[#050711]/60 p-4">
        <div className="flex items-center justify-between">
          <p className="text-xs font-black uppercase tracking-wide text-slate-300">MYP 3 curriculum bank</p>
          <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">EIS MYP Mathematics Overview</p>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {curriculumUnits.map((unit) => (
            <button
              key={unit}
              onClick={() => setSelectedUnit(unit)}
              className={`rounded-md px-3 py-1.5 text-xs font-black uppercase tracking-wide transition ${
                selectedUnit === unit
                  ? 'bg-[#49c8ff] text-[#061126]'
                  : 'border border-white/15 text-slate-300 hover:text-white'
              }`}
            >
              {unitLabels[unit]}
            </button>
          ))}
        </div>
        <div className="mt-4 grid gap-2 md:grid-cols-2">
          {visibleQuestions.map((q) => {
            const difficultyStyle =
              q.difficulty === 'support'
                ? 'bg-[#49c8ff]/15 text-[#8ddfff] border-[#49c8ff]/30'
                : q.difficulty === 'extension'
                ? 'bg-[#ff3d22]/15 text-[#ff8a73] border-[#ff3d22]/30'
                : 'bg-[#ffc43b]/15 text-[#ffe08a] border-[#ffc43b]/30';
            return (
              <button
                key={q.id}
                onClick={() => setSelectedId(q.id)}
                className={`group rounded-md border p-3 text-left transition ${
                  selectedId === q.id
                    ? 'border-[#ffc43b] bg-[#ffc43b]/10'
                    : 'border-white/10 bg-white/5 hover:border-white/30'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="text-[10px] font-black uppercase tracking-wide text-[#8ddfff]">{q.topic}</p>
                  <span className={`rounded-full border px-2 py-0.5 text-[9px] font-black uppercase tracking-wide ${difficultyStyle}`}>
                    {q.difficulty}
                  </span>
                </div>
                <p className="mt-1 text-sm font-black text-white">{q.title}</p>
                <p className="mt-1 text-xs leading-5 text-slate-400">{q.question}</p>
                <p className="mt-2 text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                  3D · {threeDLabels[q.threeDType]}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      <div className="relative mt-5 grid gap-3 md:grid-cols-3">
        <button
          onClick={handleAssign}
          disabled={assignState === 'pending'}
          className={`relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-md px-4 py-3 font-black transition ${
            assignState === 'done'
              ? 'bg-emerald-400 text-[#061126] shadow-[0_0_24px_rgba(74,222,128,.55)]'
              : assignState === 'pending'
              ? 'bg-[#ffc43b]/80 text-[#061126]'
              : 'animate-eis-pulse bg-[#ffc43b] text-[#061126] shadow-[0_0_22px_rgba(255,196,59,.35)] hover:bg-[#ffe08a] hover:shadow-[0_0_28px_rgba(255,196,59,.55)] active:scale-[0.97]'
          }`}
        >
          {assignState === 'done' ? (
            <>
              <Check className="h-4 w-4" />
              Assigned!
            </>
          ) : assignState === 'pending' ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Assigning…
            </>
          ) : (
            <>
              <Send className="h-4 w-4" />
              Assign to Student
            </>
          )}
        </button>
        <button onClick={() => setActiveTab('place-value-lesson')} className="inline-flex items-center justify-center gap-2 rounded-md border border-white/15 px-4 py-3 font-black text-white transition hover:border-[#49c8ff] hover:text-[#8ddfff]">
          <Gem className="h-4 w-4" />
          Open AI 3D Generator
        </button>
        <button onClick={() => setActiveTab('classroom')} className="inline-flex items-center justify-center gap-2 rounded-md border border-white/15 px-4 py-3 font-black text-white transition hover:border-[#ffc43b] hover:text-[#ffc43b]">
          <MonitorPlay className="h-4 w-4" />
          Send to Live Class
        </button>
      </div>

      {assignment.submission ? (
        <div className="relative mt-5 rounded-md border border-green-300/30 bg-green-300/10 p-4">
          <p className="text-xs font-black uppercase tracking-wide text-green-200">Student submission received</p>
          <p className="mt-2 font-semibold text-white">{assignment.submission.answer}</p>
          <p className="mt-2 text-sm leading-6 text-green-50">{assignment.submission.feedback}</p>
          <p className="mt-3 text-2xl font-black text-green-100">{assignment.submission.score}%</p>
        </div>
      ) : (
        <p className="relative mt-4 text-sm font-semibold text-slate-400">No submission yet. Switch to Student view to complete the demo flow.</p>
      )}
    </article>
  );
}

function StudentAssignmentCard({ assignment, setAssignment, setActiveTab }: { assignment: DemoAssignment; setAssignment: (assignment: DemoAssignment) => void; setActiveTab: (tab: TabType) => void }) {
  const [answer, setAnswer] = useState(assignment.submission?.answer ?? '');
  const [submitState, setSubmitState] = useState<'idle' | 'pending' | 'done'>('idle');
  const assigned = assignment.status !== 'draft';

  const submit = async () => {
    if (!answer.trim() || submitState === 'pending') return;
    setSubmitState('pending');
    try {
      const next = await submitDemoAnswer(answer);
      setAssignment(next);
      setSubmitState('done');
      window.setTimeout(() => setSubmitState('idle'), 1800);
    } catch {
      setSubmitState('idle');
    }
  };

  return (
    <article className="relative overflow-hidden rounded-lg border border-white/10 bg-gradient-to-br from-[#0a1736] via-[#061126] to-[#050711] p-6 text-white">
      <div className="pointer-events-none absolute -right-10 -top-10 h-44 w-44 rounded-full bg-[#49c8ff]/20 blur-3xl" />
      <div className="relative flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-wide text-[#8ddfff]">Student assignment</p>
          <h3 className="mt-2 text-2xl font-black">{assigned ? assignment.title : 'No assignment yet'}</h3>
          {assigned ? (
            <>
              <p className="mt-2 max-w-2xl text-sm italic leading-6 text-[#ffc43b]">Inquiry: {assignment.inquiryQuestion}</p>
              <p className="mt-2 text-sm leading-6 text-slate-300">{assignment.prompt}</p>
            </>
          ) : (
            <p className="mt-2 text-sm leading-6 text-slate-300">Ask the teacher to assign a checkpoint.</p>
          )}
        </div>
        <ClipboardCheck className="h-8 w-8 text-[#ffc43b]" />
      </div>

      {assigned ? (
        <>
          <div className="relative mt-5 rounded-lg border border-[#ffc43b]/20 bg-[#ffc43b]/5 p-5">
            <p className="text-xs font-black uppercase tracking-wide text-[#ffc43b]">Question</p>
            <p className="mt-2 text-xl font-black text-white">{assignment.question}</p>
          </div>
          <textarea
            value={answer}
            onChange={(event) => setAnswer(event.target.value)}
            className="relative mt-4 min-h-32 w-full rounded-lg border border-white/10 bg-[#050711]/70 p-4 text-sm leading-6 text-white placeholder:text-slate-500 outline-none transition focus:border-[#49c8ff] focus:ring-2 focus:ring-[#49c8ff]/30"
            placeholder="Example: Add 7 to both sides, then divide by 5. x = 7. Check: 5(7) - 7 = 28."
          />
          <div className="relative mt-4 flex flex-wrap gap-3">
            <button
              onClick={submit}
              disabled={submitState === 'pending' || !answer.trim()}
              className={`relative inline-flex items-center gap-2 overflow-hidden rounded-md px-4 py-3 font-black transition ${
                submitState === 'done'
                  ? 'bg-emerald-400 text-[#061126] shadow-[0_0_24px_rgba(74,222,128,.55)]'
                  : submitState === 'pending'
                  ? 'bg-[#49c8ff]/80 text-[#061126]'
                  : !answer.trim()
                  ? 'bg-[#49c8ff]/30 text-[#061126]/50 cursor-not-allowed'
                  : 'animate-eis-pulse bg-[#49c8ff] text-[#061126] shadow-[0_0_22px_rgba(73,200,255,.35)] hover:bg-[#8ddfff] hover:shadow-[0_0_28px_rgba(73,200,255,.55)] active:scale-[0.97]'
              }`}
            >
              {submitState === 'done' ? (
                <>
                  <Check className="h-4 w-4" />
                  Submitted!
                </>
              ) : submitState === 'pending' ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Submitting…
                </>
              ) : (
                <>
                  Submit Answer <Send className="h-4 w-4" />
                </>
              )}
            </button>
            <button onClick={() => setActiveTab('eis-maths')} className="inline-flex items-center gap-2 rounded-md border border-white/15 px-4 py-3 font-black text-white transition hover:border-[#ffc43b] hover:text-[#ffc43b]">
              Study 3D Lesson <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </>
      ) : null}

      {assignment.submission ? (
        <div className="relative mt-5 rounded-lg border border-green-300/30 bg-green-300/10 p-4">
          <p className="flex items-center gap-2 text-sm font-black text-green-100">
            <CheckCircle2 className="h-4 w-4" />
            Feedback: {assignment.submission.score}%
          </p>
          <p className="mt-2 text-sm leading-6 text-green-50">{assignment.submission.feedback}</p>
        </div>
      ) : null}
    </article>
  );
}

function TeacherDashboard({ assignment, setAssignment, setActiveTab }: { assignment: DemoAssignment; setAssignment: (assignment: DemoAssignment) => void; setActiveTab: (tab: TabType) => void }) {
  const today = useMemo(() => 'Solving equations with visual balance models', []);

  const assign = async (questionId: string) => {
    const next = await assignDemoQuestion(questionId);
    setAssignment(next);
  };

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-lg border border-white/10 p-6 text-white shadow-[0_24px_90px_rgba(5,7,17,.45)] lg:p-10">
        <HeroBackdrop />
        <div className="relative grid gap-8 lg:grid-cols-[1.1fr_.9fr] lg:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-md border border-[#ffc43b]/35 bg-[#ffc43b]/10 px-3 py-2 text-xs font-black uppercase tracking-wide text-[#ffe08a]">
              <Sparkles className="h-4 w-4" />
              Teacher Dashboard
            </div>
            <h1 className="mt-5 text-3xl font-black tracking-normal sm:text-4xl lg:text-5xl">Today&apos;s Grade 8 Maths Lesson</h1>
            <p className="mt-4 max-w-2xl text-lg font-semibold leading-8 text-slate-200">{today}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <button key={action.label} onClick={() => setActiveTab(action.tab)} className={`inline-flex items-center gap-2 rounded-md px-4 py-3 font-black transition ${action.style}`}>
                    {action.label} <Icon className="h-4 w-4" />
                  </button>
                );
              })}
            </div>
          </div>
          <ExplainerByType type={assignment.threeDType} />
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {progressCards.map((card) => (
          <ProgressCard key={card.label} card={card} />
        ))}
      </section>

      <TeacherAssignmentCard assignment={assignment} onAssign={assign} setActiveTab={setActiveTab} />

      <TeacherSubmissionsPanel />

      <section className="grid gap-5 xl:grid-cols-2">
        <CircleLab3D />
        <AngleLab3D />
      </section>

      <section className="grid gap-5 xl:grid-cols-2">
        <PercentageBar3D />
        <ProbabilitySpinner3D />
      </section>

      <section className="relative overflow-hidden rounded-lg border border-[#49c8ff]/25 bg-gradient-to-r from-[#061126] via-[#0a1736] to-[#061126] p-6 text-white">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_85%_50%,rgba(73,200,255,.25),transparent_45%)]" />
        <div className="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-wide text-[#49c8ff]">AI 3D Lesson Generator</p>
            <p className="mt-2 max-w-3xl text-base font-semibold leading-7 text-slate-200">
              Generate cinematic explainers with 3D models, guided examples, quizzes, rewards, and teacher-ready assignment checkpoints.
            </p>
          </div>
          <button onClick={() => setActiveTab('place-value-lesson')} className="inline-flex items-center justify-center gap-2 rounded-md bg-[#ffc43b] px-5 py-3 font-black text-[#061126] transition hover:bg-[#ffe08a]">
            Open Generator <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </section>
    </div>
  );
}

function StudentDashboard({ assignment, setAssignment, setActiveTab }: { assignment: DemoAssignment; setAssignment: (assignment: DemoAssignment) => void; setActiveTab: (tab: TabType) => void }) {
  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-lg border border-white/10 p-6 text-white shadow-[0_24px_90px_rgba(5,7,17,.45)] lg:p-10">
        <HeroBackdrop />
        <div className="relative grid gap-8 lg:grid-cols-[1fr_1fr] lg:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-md border border-[#49c8ff]/35 bg-[#49c8ff]/10 px-3 py-2 text-xs font-black uppercase tracking-wide text-[#8ddfff]">
              <School className="h-4 w-4" />
              Student View
            </div>
            <h1 className="mt-5 text-3xl font-black tracking-normal sm:text-4xl lg:text-5xl">Learn, interact, answer, submit.</h1>
            <p className="mt-4 max-w-xl text-lg font-semibold leading-8 text-slate-200">
              Follow the visual model, solve the assigned checkpoint, receive instant feedback, then join the virtual class.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <button onClick={() => setActiveTab('eis-maths')} className="inline-flex items-center gap-2 rounded-md bg-[#49c8ff] px-4 py-3 font-black text-[#061126] transition hover:bg-[#8ddfff]">
                Start 3D Lesson <Play className="h-4 w-4" />
              </button>
              <button onClick={() => setActiveTab('classroom')} className="inline-flex items-center gap-2 rounded-md border border-white/20 px-4 py-3 font-black text-white transition hover:border-[#ffc43b] hover:text-[#ffc43b]">
                Join Live Class <MonitorPlay className="h-4 w-4" />
              </button>
            </div>
          </div>
          <ExplainerByType type={assignment.threeDType} />
        </div>
      </section>

      <StudentAssignmentList
        activeAssignmentId={assignment.id}
        onSelect={setAssignment}
        onOpenLesson={() => setActiveTab('lesson')}
      />

      <StudentAssignmentCard assignment={assignment} setAssignment={setAssignment} setActiveTab={setActiveTab} />

      <section className="grid gap-5 xl:grid-cols-2">
        <CircleLab3D />
        <AngleLab3D />
      </section>

      <section className="grid gap-5 xl:grid-cols-2">
        <PercentageBar3D />
        <ProbabilitySpinner3D />
      </section>
    </div>
  );
}

export function DashboardHome({ mode, setMode, setActiveTab }: DashboardHomeProps) {
  const [assignment, setAssignment] = useDemoAssignmentState();

  return (
    <div className="relative min-h-full text-white">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[520px] bg-[radial-gradient(ellipse_at_top,rgba(73,200,255,.10),transparent_60%)]" aria-hidden="true" />
      <div className="relative space-y-6">
        <ModeBar mode={mode} setMode={setMode} />
        <SystemStatusStrip />
        <SubjectQuickPicker setActiveTab={setActiveTab} />
        <ActiveSubjectLessonCard setActiveTab={setActiveTab} />

        {mode === 'teacher' ? (
          <TeacherDashboard assignment={assignment} setAssignment={setAssignment} setActiveTab={setActiveTab} />
        ) : (
          <StudentDashboard assignment={assignment} setAssignment={setAssignment} setActiveTab={setActiveTab} />
        )}
      </div>
    </div>
  );
}
