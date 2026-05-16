'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
// useEffect retained for Firestore fetch only.
import { ArrowRight, BookOpen, CheckCircle2, ClipboardCheck, Loader2, Send, Sparkles, Wand2 } from 'lucide-react';
import { AnimatedExplainer } from './AnimatedExplainer';
import { ExplainerByType } from './Math3DExplainers';
import {
  findQuestionById,
  getExplainerSteps,
  threeDLabels,
  type CurriculumQuestion,
} from '@/lib/grade8Curriculum';
import { submitDemoAnswer, type DemoAssignment } from '@/lib/demoAssignments';
import { isFirebaseConfigured } from '@/lib/firebase/client';
import { getLessonProgress, saveLessonProgress } from '@/lib/firebase/firestore';
import { aiGradeAnswer } from '@/lib/ai/client';
import type { GradedAnswer } from '@/lib/ai/types';
import { recordAssignmentSubmissionEvent, recordThreeDInteractionEvent } from '@/lib/learningHub/internalEvents';
import { getDemoUserId } from '@/lib/firebase/demoUser';

export function StudentLessonPlayer({
  assignment,
  onClose,
}: {
  assignment: DemoAssignment;
  onClose?: () => void;
}) {
  const question: CurriculumQuestion | undefined = useMemo(
    () => findQuestionById(assignment.questionId),
    [assignment.questionId],
  );
  const steps = useMemo(() => (question ? getExplainerSteps(question) : []), [question]);

  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [showPractice, setShowPractice] = useState(false);
  const [answer, setAnswer] = useState(assignment.submission?.answer ?? '');
  const [submitState, setSubmitState] = useState<'idle' | 'pending' | 'done'>('idle');
  const [lessonComplete, setLessonComplete] = useState(false);
  const [aiFeedbackState, setAiFeedbackState] = useState<'idle' | 'pending' | 'done' | 'error'>('idle');
  const [aiFeedback, setAiFeedback] = useState<GradedAnswer | null>(null);
  const [aiFeedbackSource, setAiFeedbackSource] = useState<'ai' | 'mock' | null>(null);
  const [aiFeedbackError, setAiFeedbackError] = useState<string | null>(null);

  // Reset transient state when the assignment changes (render-time reset
  // pattern: cheaper than useEffect and avoids the setState-in-effect rule).
  const [trackedAssignmentId, setTrackedAssignmentId] = useState(assignment.id);
  if (assignment.id !== trackedAssignmentId) {
    setTrackedAssignmentId(assignment.id);
    setCompletedSteps(new Set());
    setShowPractice(false);
    setLessonComplete(false);
    setAnswer(assignment.submission?.answer ?? '');
    setAiFeedbackState('idle');
    setAiFeedback(null);
    setAiFeedbackSource(null);
    setAiFeedbackError(null);
  }

  // Try to load existing progress from Firestore.
  useEffect(() => {
    if (!isFirebaseConfigured() || !question) return;
    void (async () => {
      try {
        const existing = await getLessonProgress(question.id);
        if (existing?.completedSteps?.length) {
          setCompletedSteps(new Set(existing.completedSteps.map((s) => Number(s)).filter((n) => !Number.isNaN(n))));
        }
      } catch {
        // ignore — no progress yet is fine
      }
    })();
  }, [question]);

  const persistProgress = useCallback(
    async (newSteps: Set<number>, score?: number) => {
      if (!isFirebaseConfigured() || !question) return;
      try {
        await saveLessonProgress({
          lessonId: question.id,
          completedSteps: Array.from(newSteps).sort((a, b) => a - b).map(String),
          score,
        });
      } catch {
        // non-fatal: progress is best-effort
      }
    },
    [question],
  );

  const handleStepChange = useCallback(
    (idx: number) => {
      setCompletedSteps((prev) => {
        if (prev.has(idx)) return prev;
        const next = new Set(prev);
        next.add(idx);
        void persistProgress(next);
        return next;
      });
    },
    [persistProgress],
  );

  const handleExplainerComplete = useCallback(() => {
    setLessonComplete(true);
    const allSteps = new Set<number>();
    for (let i = 0; i < steps.length; i++) allSteps.add(i);
    setCompletedSteps(allSteps);
    void persistProgress(allSteps);
    if (question) {
      void recordThreeDInteractionEvent({
        studentId: getDemoUserId('student'),
        studentName: 'Demo Student',
        lessonId: question.id,
        lessonTitle: question.title,
        threeDType: question.threeDType,
        topic: question.topic,
      });
    }
  }, [steps.length, persistProgress, question]);

  const submit = async () => {
    if (!answer.trim() || submitState === 'pending') return;
    setSubmitState('pending');
    try {
      const next = await submitDemoAnswer(answer);
      setSubmitState('done');
      void persistProgress(completedSteps, next.submission?.score);
      // Emit a unified LearningEvent so the Learning Data Hub picks up the
      // submission alongside Kahoot / MyiMaths / Dr Frost evidence.
      void recordAssignmentSubmissionEvent({
        studentId: getDemoUserId('student'),
        studentName: 'Demo Student',
        assignmentId: next.id,
        lessonTitle: next.title,
        topic: question?.topic,
        score: next.submission?.score,
        feedback: next.submission?.feedback,
      });
      window.setTimeout(() => setSubmitState('idle'), 1800);
    } catch {
      setSubmitState('idle');
    }
  };

  const requestAiFeedback = async () => {
    if (!question || !assignment.submission || aiFeedbackState === 'pending') return;
    setAiFeedbackState('pending');
    setAiFeedbackError(null);
    try {
      const response = await aiGradeAnswer({
        question: question.question,
        expectedAnswer: question.expectedAnswer,
        acceptedKeywords: question.acceptedKeywords,
        studentAnswer: assignment.submission.answer,
        rubric: question.teacherNote,
      });
      setAiFeedback(response.data);
      setAiFeedbackSource(response.source);
      setAiFeedbackState('done');
    } catch (err) {
      setAiFeedbackError(err instanceof Error ? err.message : 'AI feedback failed.');
      setAiFeedbackState('error');
    }
  };

  if (!question) {
    return (
      <section className="rounded-lg border border-white/10 bg-[#061126] p-6 text-slate-300">
        Could not find lesson content for this assignment.
      </section>
    );
  }

  const stepCount = steps.length || 1;
  const progressPct = Math.round((completedSteps.size / stepCount) * 100);

  return (
    <div className="space-y-6 text-white">
      <header className="relative overflow-hidden rounded-lg border border-white/10 bg-gradient-to-br from-[#0a1736] via-[#061126] to-[#050711] p-6">
        <div className="pointer-events-none absolute -right-12 -top-12 h-44 w-44 rounded-full bg-[#49c8ff]/20 blur-3xl" />
        <div className="relative flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            <div className="inline-flex items-center gap-2 rounded-md border border-[#49c8ff]/35 bg-[#49c8ff]/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-wide text-[#8ddfff]">
              <BookOpen className="h-3.5 w-3.5" />
              Student lesson player
            </div>
            <h1 className="mt-4 text-2xl font-black tracking-tight sm:text-3xl lg:text-4xl">{assignment.title}</h1>
            <p className="mt-2 text-sm font-semibold text-slate-300">{assignment.lessonTitle}</p>
            <p className="mt-3 text-sm italic leading-6 text-[#ffc43b]">Inquiry: {assignment.inquiryQuestion}</p>
            <p className="mt-1 text-xs leading-6 text-slate-400">Objective · {assignment.objective}</p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <span className="rounded-md border border-white/15 bg-white/5 px-2 py-1 text-[10px] font-black uppercase tracking-wide text-slate-200">
              3D · {threeDLabels[assignment.threeDType]}
            </span>
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-wide text-slate-300">
              <span className="h-1.5 w-24 overflow-hidden rounded-full bg-white/10">
                <span
                  className="block h-full bg-[#49c8ff] transition-[width] duration-500"
                  style={{ width: `${progressPct}%` }}
                />
              </span>
              {progressPct}% explored
            </div>
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
        <AnimatedExplainer
          steps={steps}
          caption={`${assignment.lessonTitle}`}
          onStepChange={handleStepChange}
          onComplete={handleExplainerComplete}
        />
        <div className="space-y-4">
          <ExplainerByType type={assignment.threeDType} />
          {question.workedExample ? (
            <article className="rounded-lg border border-white/10 bg-[#061126] p-5">
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wide text-[#ffc43b]">
                <Sparkles className="h-3.5 w-3.5" />
                Worked example
              </div>
              <p className="mt-3 text-sm font-semibold text-white">{question.workedExample.prompt}</p>
              <ol className="mt-3 list-decimal space-y-1 pl-5 text-sm leading-6 text-slate-300">
                {question.workedExample.steps.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ol>
              <p className="mt-3 inline-flex items-center gap-2 rounded-md border border-[#ffc43b]/30 bg-[#ffc43b]/10 px-3 py-2 text-sm font-black text-[#ffe08a]">
                Answer · {question.workedExample.answer}
              </p>
            </article>
          ) : null}
        </div>
      </section>

      {question.practiceQuestion && lessonComplete ? (
        <section className="rounded-lg border border-[#49c8ff]/25 bg-gradient-to-r from-[#061126] via-[#0a1736] to-[#061126] p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-black uppercase tracking-wide text-[#49c8ff]">Practice round</p>
              <p className="mt-1 text-base font-semibold text-slate-200">{question.practiceQuestion.question}</p>
            </div>
            <button
              onClick={() => setShowPractice((v) => !v)}
              className="rounded-md border border-white/15 px-3 py-1.5 text-xs font-black uppercase tracking-wide text-slate-200 transition hover:border-[#49c8ff] hover:text-[#8ddfff]"
            >
              {showPractice ? 'Hide answer' : 'Show answer'}
            </button>
          </div>
          {showPractice ? (
            <div className="mt-4 rounded-md border border-white/10 bg-white/[0.03] p-4">
              <p className="text-sm font-black text-white">Answer: {question.practiceQuestion.answer}</p>
              <p className="mt-2 text-sm leading-6 text-slate-300">{question.practiceQuestion.explanation}</p>
            </div>
          ) : null}
        </section>
      ) : null}

      <section className="rounded-lg border border-white/10 bg-gradient-to-br from-[#0a1736] via-[#061126] to-[#050711] p-6">
        <div className="flex items-center gap-3">
          <ClipboardCheck className="h-5 w-5 text-[#ffc43b]" />
          <div>
            <p className="text-xs font-black uppercase tracking-wide text-[#ffe08a]">Submit your answer</p>
            <p className="text-sm font-semibold text-slate-200">{assignment.question}</p>
          </div>
        </div>
        <textarea
          value={answer}
          onChange={(event) => setAnswer(event.target.value)}
          className="mt-4 min-h-32 w-full rounded-lg border border-white/10 bg-[#050711]/70 p-4 text-sm leading-6 text-white placeholder:text-slate-500 outline-none transition focus:border-[#49c8ff] focus:ring-2 focus:ring-[#49c8ff]/30"
          placeholder="Show your working then state the answer."
        />
        <div className="mt-4 flex flex-wrap gap-3">
          <button
            onClick={submit}
            disabled={submitState === 'pending' || !answer.trim()}
            className={`relative inline-flex items-center gap-2 overflow-hidden rounded-md px-5 py-2.5 text-sm font-black transition ${
              submitState === 'done'
                ? 'bg-emerald-400 text-[#061126] shadow-[0_0_24px_rgba(74,222,128,.55)]'
                : submitState === 'pending'
                ? 'bg-[#49c8ff]/80 text-[#061126]'
                : !answer.trim()
                ? 'bg-[#49c8ff]/30 text-[#061126]/50 cursor-not-allowed'
                : 'animate-eis-pulse bg-[#49c8ff] text-[#061126] shadow-[0_0_22px_rgba(73,200,255,.35)] hover:bg-[#8ddfff]'
            }`}
          >
            {submitState === 'done' ? (
              <>
                <CheckCircle2 className="h-4 w-4" />
                Submitted!
              </>
            ) : submitState === 'pending' ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Submitting…
              </>
            ) : (
              <>
                Submit answer <Send className="h-4 w-4" />
              </>
            )}
          </button>
        </div>
        {assignment.submission ? (
          <div className="mt-5 space-y-4">
            <div className="rounded-lg border border-green-300/30 bg-green-300/10 p-4">
              <p className="flex items-center gap-2 text-sm font-black text-green-100">
                <CheckCircle2 className="h-4 w-4" />
                Feedback · {assignment.submission.score}%
              </p>
              <p className="mt-2 text-sm leading-6 text-green-50">{assignment.submission.feedback}</p>
            </div>

            <div className="rounded-lg border border-white/10 bg-[#050711]/60 p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="flex items-center gap-2 text-xs font-black uppercase tracking-wide text-[#8ddfff]">
                  <Wand2 className="h-3.5 w-3.5" />
                  AI breakdown
                </p>
                {aiFeedbackSource ? (
                  <span
                    className={`rounded-full border px-2 py-0.5 text-[10px] font-black uppercase tracking-wide ${
                      aiFeedbackSource === 'ai'
                        ? 'border-[#49c8ff]/30 bg-[#49c8ff]/10 text-[#8ddfff]'
                        : 'border-[#ffc43b]/30 bg-[#ffc43b]/10 text-[#ffe08a]'
                    }`}
                  >
                    {aiFeedbackSource === 'ai' ? 'Gemma 4' : 'AI demo mode'}
                  </span>
                ) : null}
              </div>

              {aiFeedbackState === 'idle' ? (
                <div className="mt-3 flex flex-wrap items-center gap-3">
                  <p className="text-sm text-slate-300">
                    Want a deeper breakdown of strengths, misconceptions and a next step? Ask Gemma 4 to review your answer.
                  </p>
                  <button
                    onClick={requestAiFeedback}
                    className="inline-flex items-center gap-2 rounded-md bg-[#49c8ff] px-3.5 py-2 text-xs font-black text-[#061126] transition hover:bg-[#8ddfff]"
                  >
                    <Wand2 className="h-3.5 w-3.5" />
                    Get AI breakdown
                  </button>
                </div>
              ) : null}

              {aiFeedbackState === 'pending' ? (
                <p className="mt-3 inline-flex items-center gap-2 text-sm text-slate-300">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Gemma is reviewing your answer…
                </p>
              ) : null}

              {aiFeedbackState === 'error' && aiFeedbackError ? (
                <p className="mt-3 rounded-md border border-red-300/30 bg-red-300/10 px-3 py-2 text-sm font-semibold text-red-100">
                  {aiFeedbackError}
                </p>
              ) : null}

              {aiFeedbackState === 'done' && aiFeedback ? (
                <div className="mt-3 space-y-3">
                  <p className="text-3xl font-black text-white">{aiFeedback.score}%</p>
                  <p className="text-sm leading-6 text-slate-200">{aiFeedback.feedback}</p>
                  {aiFeedback.strengths.length > 0 ? (
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-wide text-emerald-200">Strengths</p>
                      <ul className="mt-1 list-disc space-y-1 pl-5 text-sm leading-6 text-emerald-50">
                        {aiFeedback.strengths.map((s, i) => (
                          <li key={i}>{s}</li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                  {aiFeedback.misconceptions.length > 0 ? (
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-wide text-[#ff8a73]">Watch out for</p>
                      <ul className="mt-1 list-disc space-y-1 pl-5 text-sm leading-6 text-red-50">
                        {aiFeedback.misconceptions.map((m, i) => (
                          <li key={i}>{m}</li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-wide text-[#ffe08a]">Next step</p>
                    <p className="mt-1 text-sm leading-6 text-slate-100">{aiFeedback.nextStep}</p>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        ) : null}
      </section>
    </div>
  );
}
