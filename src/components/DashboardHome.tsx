'use client';

import React, { useEffect, useState } from 'react';
import {
  ArrowRight,
  BarChart3,
  Beaker,
  BrainCircuit,
  Camera,
  Check,
  CheckCircle2,
  Clapperboard,
  ClipboardCheck,
  Database,
  Feather,
  Loader2,
  MonitorPlay,
  Play,
  School,
  Send,
  Sparkles,
  Trophy,
  UploadCloud,
  UserCheck,
} from 'lucide-react';
import { TabType } from './Sidebar';
import { StudentDashboardClean } from '@/components/StudentDashboardClean';
import { ClassLinkSettings } from '@/components/ClassLinkSettings';
import { LiveClassManager } from '@/components/LiveClassManager';
import { InviteStudentsPanel } from '@/components/InviteStudentsPanel';
import { ExplainerByType } from '@/components/Math3DExplainers';
import { Math3DShowcase } from '@/components/Math3DShowcase';
import { TeacherSubmissionsPanel } from '@/components/TeacherSubmissionsPanel';
import { StudentAssignmentList } from '@/components/StudentAssignmentList';
import { StudentCinematicAssignmentList } from '@/components/cinematic/StudentCinematicAssignmentList';
import { PlatformDirectionCard } from '@/components/PlatformDirectionCard';
import { SubjectQuickPicker } from '@/components/SubjectQuickPicker';
import { ActiveSubjectLessonCard } from '@/components/ActiveSubjectLessonCard';
import { ClassPicker } from '@/components/ClassPicker';
import { AuthButton } from '@/components/AuthButton';
import {
  assignDemoQuestion,
  defaultDemoAssignment,
  loadDemoAssignment,
  submitDemoAnswer,
  type LearningMode,
  type DemoAssignment,
} from '@/lib/demoAssignments';
import { threeDLabels } from '@/lib/grade8Curriculum';

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

const teacherSubjectOptions = [
  {
    label: 'Maths',
    detail: 'Grade 8 Maths lessons, 3D models, assignments',
    tab: 'eis-maths' as TabType,
    icon: School,
    accent: '#49c8ff',
  },
  {
    label: 'Science',
    detail: 'Year 8 labs, particles, cells, circuits, forces',
    tab: 'science-studio' as TabType,
    icon: Beaker,
    accent: '#8df0c0',
  },
  {
    label: 'English',
    detail: 'Year 8 writing, annotation, poetry, grammar',
    tab: 'english-studio' as TabType,
    icon: Feather,
    accent: '#ffc43b',
  },
];

const teacherAdvancedOptions = [
  { label: 'Cinematic Studio', tab: 'cinematic-studio' as TabType, icon: Clapperboard },
  { label: 'Learning Data Hub', tab: 'learning-hub' as TabType, icon: Database },
  { label: 'Upload Studio', tab: 'upload-studio' as TabType, icon: UploadCloud },
  { label: 'AI Lesson Generator', tab: 'place-value-lesson' as TabType, icon: BrainCircuit },
  { label: 'Live Class', tab: 'classroom' as TabType, icon: MonitorPlay },
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

/** Compact top bar — class picker + auth only. Role toggle lives in the sidebar. */
function TopBar() {
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 backdrop-blur">
      <p className="text-xs font-semibold text-slate-400">EIS Learning Studio · Year 8 · Maths · Science · English</p>
      <div className="flex items-center gap-2">
        <AuthButton compact />
        <ClassPicker />
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

function TeacherAssignmentCard({
  assignment,
  onAssign,
  setActiveTab,
}: {
  assignment: DemoAssignment;
  onAssign: (questionId: string) => Promise<void>;
  setActiveTab: (tab: TabType) => void;
}) {
  const [assignState, setAssignState] = useState<'idle' | 'pending' | 'done'>('idle');

  const handleAssign = async () => {
    if (assignState === 'pending') return;
    setAssignState('pending');
    try {
      await onAssign(assignment.questionId);
      setAssignState('done');
      window.setTimeout(() => setAssignState('idle'), 1800);
    } catch {
      setAssignState('idle');
    }
  };

  return (
    <article className="relative overflow-hidden rounded-lg border border-white/10 bg-gradient-to-br from-[#0a1736] via-[#061126] to-[#050711] p-6 text-white">
      <div className="pointer-events-none absolute -right-10 -top-10 h-44 w-44 rounded-full bg-[#ffc43b]/15 blur-3xl" />
      <div className="relative flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-wide text-[#ffc43b]">
            Active assignment · {assignment.lessonTitle}
          </p>
          <h3 className="mt-2 text-2xl font-black">{assignment.title}</h3>
          <p className="mt-2 max-w-2xl text-sm italic leading-6 text-[#8ddfff]">
            {assignment.inquiryQuestion}
          </p>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-200">{assignment.question}</p>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-2">
          <span className="rounded-md border border-[#49c8ff]/30 bg-[#49c8ff]/10 px-3 py-2 text-xs font-black uppercase tracking-wide text-[#8ddfff]">
            {assignment.status}
          </span>
          <span className="rounded-md border border-white/15 bg-white/5 px-2 py-1 text-[10px] font-black uppercase tracking-wide text-slate-200">
            3D · {threeDLabels[assignment.threeDType]}
          </span>
        </div>
      </div>

      <div className="relative mt-6 grid gap-3 md:grid-cols-3">
        <button
          onClick={handleAssign}
          disabled={assignState === 'pending'}
          className={`relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-md px-4 py-3 font-black transition ${
            assignState === 'done'
              ? 'bg-emerald-400 text-[#061126] shadow-[0_0_24px_rgba(74,222,128,.55)]'
              : assignState === 'pending'
              ? 'bg-[#ffc43b]/80 text-[#061126]'
              : 'animate-eis-pulse bg-[#ffc43b] text-[#061126] shadow-[0_0_22px_rgba(255,196,59,.35)] hover:bg-[#ffe08a]'
          }`}
        >
          {assignState === 'done' ? (
            <><Check className="h-4 w-4" /> Assigned!</>
          ) : assignState === 'pending' ? (
            <><Loader2 className="h-4 w-4 animate-spin" /> Assigning…</>
          ) : (
            <><Send className="h-4 w-4" /> Assign to Student</>
          )}
        </button>
        <button
          onClick={() => setActiveTab('eis-maths')}
          className="inline-flex items-center justify-center gap-2 rounded-md border border-white/15 px-4 py-3 font-black text-white transition hover:border-[#49c8ff] hover:text-[#8ddfff]"
        >
          Browse Curriculum <ArrowRight className="h-4 w-4" />
        </button>
        <button
          onClick={() => setActiveTab('classroom')}
          className="inline-flex items-center justify-center gap-2 rounded-md border border-white/15 px-4 py-3 font-black text-white transition hover:border-[#ffc43b] hover:text-[#ffc43b]"
        >
          <MonitorPlay className="h-4 w-4" /> Send to Live Class
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
        <p className="relative mt-4 text-sm font-semibold text-slate-400">
          No submission yet. Switch to Student view to complete the demo flow.
        </p>
      )}
    </article>
  );
}

function StudentAssignmentCard({
  assignment,
  setAssignment,
  setActiveTab,
}: {
  assignment: DemoAssignment;
  setAssignment: (assignment: DemoAssignment) => void;
  setActiveTab: (tab: TabType) => void;
}) {
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
              <p className="mt-2 max-w-2xl text-sm italic leading-6 text-[#ffc43b]">
                {assignment.inquiryQuestion}
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-300">{assignment.prompt}</p>
            </>
          ) : (
            <p className="mt-2 text-sm leading-6 text-slate-300">Ask the teacher to assign a checkpoint.</p>
          )}
        </div>
        <ClipboardCheck className="h-8 w-8 shrink-0 text-[#ffc43b]" />
      </div>

      {assigned && (
        <>
          <div className="relative mt-5 rounded-lg border border-[#ffc43b]/20 bg-[#ffc43b]/5 p-5">
            <p className="text-xs font-black uppercase tracking-wide text-[#ffc43b]">Question</p>
            <p className="mt-2 text-xl font-black text-white">{assignment.question}</p>
          </div>
          <textarea
            value={answer}
            onChange={(event) => setAnswer(event.target.value)}
            className="relative mt-4 min-h-32 w-full rounded-lg border border-white/10 bg-[#050711]/70 p-4 text-sm leading-6 text-white placeholder:text-slate-500 outline-none transition focus:border-[#49c8ff] focus:ring-2 focus:ring-[#49c8ff]/30"
            placeholder="Write your answer here…"
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
                  ? 'cursor-not-allowed bg-[#49c8ff]/30 text-[#061126]/50'
                  : 'animate-eis-pulse bg-[#49c8ff] text-[#061126] shadow-[0_0_22px_rgba(73,200,255,.35)] hover:bg-[#8ddfff]'
              }`}
            >
              {submitState === 'done' ? (
                <><Check className="h-4 w-4" /> Submitted!</>
              ) : submitState === 'pending' ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> Submitting…</>
              ) : (
                <>Submit Answer <Send className="h-4 w-4" /></>
              )}
            </button>
            <button
              onClick={() => setActiveTab('eis-maths')}
              className="inline-flex items-center gap-2 rounded-md border border-white/15 px-4 py-3 font-black text-white transition hover:border-[#ffc43b] hover:text-[#ffc43b]"
            >
              Study 3D Lesson <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </>
      )}

      {assignment.submission && (
        <div className="relative mt-5 rounded-lg border border-green-300/30 bg-green-300/10 p-4">
          <p className="flex items-center gap-2 text-sm font-black text-green-100">
            <CheckCircle2 className="h-4 w-4" />
            Feedback: {assignment.submission.score}%
          </p>
          <p className="mt-2 text-sm leading-6 text-green-50">{assignment.submission.feedback}</p>
        </div>
      )}
    </article>
  );
}

function TeacherDashboard({
  assignment,
  setAssignment,
  setActiveTab,
}: {
  assignment: DemoAssignment;
  setAssignment: (assignment: DemoAssignment) => void;
  setActiveTab: (tab: TabType) => void;
}) {
  if (teacherSubjectOptions.length > 0) {
    return (
      <div className="mx-auto flex min-h-[calc(100vh-11rem)] max-w-5xl flex-col justify-center gap-8 py-8">
        <section className="space-y-4">
          <div className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-black uppercase tracking-wide text-slate-300">
            <Sparkles className="h-4 w-4 text-[#ffc43b]" />
            Teacher Dashboard
          </div>
          <div className="space-y-3">
            <h1 className="max-w-3xl text-3xl font-black tracking-normal text-white sm:text-4xl lg:text-5xl">
              What are you teaching today?
            </h1>
            <p className="max-w-2xl text-base leading-7 text-slate-300">
              Choose a subject to start. Everything else is tucked away until you need it.
            </p>
          </div>
        </section>

        <section className="grid gap-3 md:grid-cols-3">
          {teacherSubjectOptions.map((subject) => {
            const Icon = subject.icon;
            return (
              <button
                key={subject.label}
                type="button"
                onClick={() => setActiveTab(subject.tab)}
                className="group min-h-48 rounded-lg border border-white/10 bg-white/[0.04] p-5 text-left transition hover:-translate-y-0.5 hover:border-white/25 hover:bg-white/[0.07] focus:outline-none focus:ring-2 focus:ring-[#49c8ff]/60"
              >
                <span
                  className="grid h-11 w-11 place-items-center rounded-md"
                  style={{ background: `${subject.accent}22`, color: subject.accent }}
                >
                  <Icon className="h-5 w-5" />
                </span>
                <span className="mt-8 block text-2xl font-black text-white">{subject.label}</span>
                <span className="mt-2 block text-sm leading-6 text-slate-400">{subject.detail}</span>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-black" style={{ color: subject.accent }}>
                  Open {subject.label}
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </span>
              </button>
            );
          })}
        </section>

        <section className="space-y-3 border-t border-white/10 pt-5">
          <p className="text-xs font-black uppercase tracking-wide text-slate-500">Advanced tools</p>
          <div className="flex flex-wrap gap-2">
            {teacherAdvancedOptions.map((tool) => {
              const Icon = tool.icon;
              return (
                <button
                  key={tool.label}
                  type="button"
                  onClick={() => setActiveTab(tool.tab)}
                  className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/[0.03] px-3 py-2 text-xs font-black text-slate-300 transition hover:border-[#49c8ff]/50 hover:text-white"
                >
                  <Icon className="h-3.5 w-3.5 text-[#8ddfff]" />
                  {tool.label}
                </button>
              );
            })}
          </div>
        </section>

        {/* Live-class session scheduler — replaces the old simple URL
            input. Each session has its own token, attached students,
            and shareable mailto link. Most-recent session URL is also
            mirrored to eis-class-link so the legacy student-dashboard
            "Join live class" pill keeps working. */}
        <LiveClassManager onOpenClassroom={() => setActiveTab('classroom')} />

        {/* Keep the legacy single-URL pasteboard for teachers who still
            want a manual override (e.g. a long-running Meet room). */}
        <ClassLinkSettings />

        {/* My Students roster + invite-by-email flow. Generates a unique
            invite link per student and (via mailto:) hands it off to the
            teacher's email client. When the student opens the link, the
            LandingPage records them as joined and locks them to student view. */}
        <InviteStudentsPanel />
      </div>
    );
  }

  const assign = async (questionId: string) => {
    const next = await assignDemoQuestion(questionId);
    setAssignment(next);
  };

  return (
    <div className="space-y-6">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-lg border border-white/10 p-6 text-white shadow-[0_24px_90px_rgba(5,7,17,.45)] lg:p-10">
        <HeroBackdrop />
        <div className="relative grid gap-8 lg:grid-cols-[1.1fr_.9fr] lg:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-md border border-[#ffc43b]/35 bg-[#ffc43b]/10 px-3 py-2 text-xs font-black uppercase tracking-wide text-[#ffe08a]">
              <Sparkles className="h-4 w-4" />
              Teacher Dashboard
            </div>
            <h1 className="mt-5 text-3xl font-black tracking-normal sm:text-4xl lg:text-5xl">
              Today&apos;s Grade 8 Maths Lesson
            </h1>
            <p className="mt-4 max-w-2xl text-lg font-semibold leading-8 text-slate-200">
              Solving equations with visual balance models
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <button
                    key={action.label}
                    onClick={() => setActiveTab(action.tab)}
                    className={`inline-flex items-center gap-2 rounded-md px-4 py-3 font-black transition ${action.style}`}
                  >
                    {action.label} <Icon className="h-4 w-4" />
                  </button>
                );
              })}
            </div>
          </div>
          <ExplainerByType type={assignment.threeDType} />
        </div>
      </section>

      {/* Stats */}
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {progressCards.map((card) => (
          <ProgressCard key={card.label} card={card} />
        ))}
      </section>

      {/* Platform framing */}
      <PlatformDirectionCard />

      {/* Subject quick access */}
      <SubjectQuickPicker setActiveTab={setActiveTab} />
      <ActiveSubjectLessonCard setActiveTab={setActiveTab} />

      {/* Assignment */}
      <TeacherAssignmentCard
        assignment={assignment}
        onAssign={assign}
        setActiveTab={setActiveTab}
      />

      {/* 3D Lesson Library — single viewport, switchable */}
      <Math3DShowcase initial={assignment.threeDType} />

      {/* Submissions */}
      <TeacherSubmissionsPanel />
    </div>
  );
}

function StudentDashboard({
  setActiveTab,
}: {
  // Unused legacy props kept for backwards compatibility with the parent.
  assignment?: DemoAssignment;
  setAssignment?: (assignment: DemoAssignment) => void;
  setActiveTab: (tab: TabType) => void;
}) {
  return <StudentDashboardClean setActiveTab={setActiveTab} />;
}

export function DashboardHome({ mode, setMode: _setMode, setActiveTab }: DashboardHomeProps) {
  const [assignment, setAssignment] = useDemoAssignmentState();

  return (
    <div className="relative min-h-full text-white">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[520px] bg-[radial-gradient(ellipse_at_top,rgba(73,200,255,.10),transparent_60%)]"
        aria-hidden="true"
      />
      <div className="relative space-y-5">
        <TopBar />

        {mode === 'teacher' ? (
          <TeacherDashboard
            assignment={assignment}
            setAssignment={setAssignment}
            setActiveTab={setActiveTab}
          />
        ) : (
          <StudentDashboard
            assignment={assignment}
            setAssignment={setAssignment}
            setActiveTab={setActiveTab}
          />
        )}
      </div>
    </div>
  );
}
