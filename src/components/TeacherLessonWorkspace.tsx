'use client';

import React, { useMemo, useState } from 'react';
import { ArrowRight, Check, Gem, GraduationCap, Loader2, MonitorPlay, Save, Send, Sparkles } from 'lucide-react';
import { AnimatedExplainer } from './AnimatedExplainer';
import { ExplainerByType } from './Math3DExplainers';
import {
  findQuestionById,
  getExplainerSteps,
  threeDLabels,
  type CurriculumQuestion,
} from '@/lib/grade8Curriculum';
import { assignDemoQuestion, type DemoAssignment } from '@/lib/demoAssignments';

export function TeacherLessonWorkspace({
  assignment,
  onTeachLive,
  onOpenGenerator,
  onClose,
}: {
  assignment: DemoAssignment;
  onTeachLive?: () => void;
  onOpenGenerator?: () => void;
  onClose?: () => void;
}) {
  const question: CurriculumQuestion | undefined = useMemo(
    () => findQuestionById(assignment.questionId),
    [assignment.questionId],
  );
  const steps = useMemo(() => (question ? getExplainerSteps(question) : []), [question]);

  const [assignState, setAssignState] = useState<'idle' | 'pending' | 'done'>('idle');
  const [savedToast, setSavedToast] = useState(false);

  const reassign = async () => {
    if (assignState === 'pending') return;
    setAssignState('pending');
    try {
      await assignDemoQuestion(assignment.questionId);
      setAssignState('done');
      window.setTimeout(() => setAssignState('idle'), 1800);
    } catch {
      setAssignState('idle');
    }
  };

  const fakeSave = () => {
    setSavedToast(true);
    window.setTimeout(() => setSavedToast(false), 1800);
  };

  if (!question) {
    return (
      <section className="rounded-lg border border-white/10 bg-[#061126] p-6 text-slate-300">
        Could not find lesson content for this assignment.
      </section>
    );
  }

  return (
    <div className="space-y-6 text-white">
      <header className="relative overflow-hidden rounded-lg border border-white/10 bg-gradient-to-br from-[#0a1736] via-[#061126] to-[#050711] p-6">
        <div className="pointer-events-none absolute -right-12 -top-12 h-44 w-44 rounded-full bg-[#ffc43b]/20 blur-3xl" />
        <div className="relative flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            <div className="inline-flex items-center gap-2 rounded-md border border-[#ffc43b]/35 bg-[#ffc43b]/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-wide text-[#ffe08a]">
              <GraduationCap className="h-3.5 w-3.5" />
              Teacher lesson workspace
            </div>
            <h1 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">{assignment.title}</h1>
            <p className="mt-2 text-sm font-semibold text-slate-300">{assignment.lessonTitle}</p>
            <p className="mt-3 text-sm italic leading-6 text-[#8ddfff]">Inquiry: {assignment.inquiryQuestion}</p>
            <p className="mt-1 text-xs leading-6 text-slate-400">Objective · {assignment.objective}</p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <span className="rounded-md border border-white/15 bg-white/5 px-2 py-1 text-[10px] font-black uppercase tracking-wide text-slate-200">
              3D · {threeDLabels[assignment.threeDType]}
            </span>
            <span className="rounded-md border border-[#49c8ff]/30 bg-[#49c8ff]/10 px-2 py-1 text-[10px] font-black uppercase tracking-wide text-[#8ddfff]">
              status · {assignment.status}
            </span>
            {onClose ? (
              <button
                onClick={onClose}
                className="text-[10px] font-black uppercase tracking-wide text-slate-400 transition hover:text-white"
              >
                Close
              </button>
            ) : null}
          </div>
        </div>
      </header>

      <section className="grid gap-6 xl:grid-cols-[1.1fr_.9fr] xl:items-start">
        <AnimatedExplainer steps={steps} caption={assignment.lessonTitle} />
        <div className="space-y-4">
          <ExplainerByType type={assignment.threeDType} />
          <article className="rounded-lg border border-[#ffc43b]/30 bg-[#ffc43b]/5 p-5">
            <p className="flex items-center gap-2 text-xs font-black uppercase tracking-wide text-[#ffe08a]">
              <Sparkles className="h-3.5 w-3.5" />
              Teacher note
            </p>
            <p className="mt-3 text-sm leading-6 text-slate-100">{question.teacherNote}</p>
          </article>
        </div>
      </section>

      {question.workedExample ? (
        <section className="rounded-lg border border-white/10 bg-[#061126] p-6">
          <p className="text-xs font-black uppercase tracking-wide text-[#ffc43b]">Worked example to walk through</p>
          <p className="mt-3 text-base font-semibold text-white">{question.workedExample.prompt}</p>
          <ol className="mt-3 list-decimal space-y-1 pl-5 text-sm leading-6 text-slate-300">
            {question.workedExample.steps.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ol>
          <p className="mt-3 inline-flex items-center gap-2 rounded-md border border-[#ffc43b]/30 bg-[#ffc43b]/10 px-3 py-2 text-sm font-black text-[#ffe08a]">
            Answer · {question.workedExample.answer}
          </p>
        </section>
      ) : null}

      <section className="rounded-lg border border-white/10 bg-gradient-to-br from-[#0a1736] via-[#061126] to-[#050711] p-6">
        <p className="text-xs font-black uppercase tracking-wide text-[#ffe08a]">Assignment to set</p>
        <p className="mt-2 text-base font-semibold text-white">{assignment.question}</p>
        <p className="mt-1 text-xs text-slate-400">Expected · {assignment.expectedAnswer}</p>
        <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <button
            onClick={reassign}
            disabled={assignState === 'pending'}
            className={`inline-flex items-center justify-center gap-2 rounded-md px-4 py-3 text-sm font-black transition ${
              assignState === 'done'
                ? 'bg-emerald-400 text-[#061126] shadow-[0_0_24px_rgba(74,222,128,.55)]'
                : assignState === 'pending'
                ? 'bg-[#ffc43b]/80 text-[#061126]'
                : 'animate-eis-pulse bg-[#ffc43b] text-[#061126] shadow-[0_0_22px_rgba(255,196,59,.35)] hover:bg-[#ffe08a]'
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
                Assign to class
              </>
            )}
          </button>
          <button
            onClick={onTeachLive}
            disabled={!onTeachLive}
            className="inline-flex items-center justify-center gap-2 rounded-md border border-white/15 px-4 py-3 text-sm font-black text-white transition hover:border-[#49c8ff] hover:text-[#8ddfff] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <MonitorPlay className="h-4 w-4" />
            Teach live
          </button>
          <button
            onClick={onOpenGenerator}
            disabled={!onOpenGenerator}
            className="inline-flex items-center justify-center gap-2 rounded-md border border-white/15 px-4 py-3 text-sm font-black text-white transition hover:border-[#ffc43b] hover:text-[#ffc43b] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Gem className="h-4 w-4" />
            Generate extra questions
          </button>
          <button
            onClick={fakeSave}
            className="inline-flex items-center justify-center gap-2 rounded-md border border-white/15 px-4 py-3 text-sm font-black text-white transition hover:border-emerald-300 hover:text-emerald-200"
          >
            <Save className="h-4 w-4" />
            {savedToast ? 'Saved!' : 'Save lesson'}
          </button>
        </div>
        <p className="mt-4 text-[11px] text-slate-500">
          <span className="font-black uppercase tracking-wide text-slate-400">Teach live</span> and{' '}
          <span className="font-black uppercase tracking-wide text-slate-400">Generate extra</span> hook into the Virtual Classroom and AI generator panels respectively. <span className="font-black uppercase tracking-wide text-slate-400">Save lesson</span> will persist to Firestore in a later phase.
        </p>
      </section>

      <section className="rounded-lg border border-white/10 bg-[#061126] p-5 text-sm text-slate-300">
        <p className="text-xs font-black uppercase tracking-wide text-[#8ddfff]">Quick navigation</p>
        <div className="mt-2 flex flex-wrap gap-2 text-xs">
          <span className="rounded-full border border-white/15 bg-white/5 px-2 py-0.5 font-black uppercase tracking-wide text-slate-200">
            Strand · {question.strand}
          </span>
          <span className="rounded-full border border-white/15 bg-white/5 px-2 py-0.5 font-black uppercase tracking-wide text-slate-200">
            Difficulty · {question.difficulty}
          </span>
          <span className="rounded-full border border-white/15 bg-white/5 px-2 py-0.5 font-black uppercase tracking-wide text-slate-200">
            {steps.length} explainer step{steps.length === 1 ? '' : 's'}
          </span>
        </div>
        <p className="mt-3">
          Use the dashboard&apos;s curriculum picker to switch lessons. Each pick lands here with its own animated explainer, 3D scene and assignment prompt.
        </p>
        <button
          onClick={onClose}
          className="mt-3 inline-flex items-center gap-2 text-xs font-black uppercase tracking-wide text-[#ffc43b] transition hover:text-[#ffe08a]"
        >
          Back to dashboard <ArrowRight className="h-3 w-3" />
        </button>
      </section>
    </div>
  );
}
