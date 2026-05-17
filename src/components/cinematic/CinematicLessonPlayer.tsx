'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { CheckCircle2, Loader2, Send, Users, Video } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { LearningMode } from '@/lib/demoAssignments';
import type { CinematicAsset, CinematicInteractionEvent, CinematicLessonSpec } from '@/lib/cinematic/types';
import { setActiveSubjectLesson } from '@/lib/activeSubjectLesson';
import { lessonFromCinematicSpec } from '@/lib/cinematic/subjectLessonAdapter';
import {
  recordCinematicAssignmentSubmitted,
  recordCinematicCheckpointAnswered,
  recordCinematicInteraction,
  recordCinematicLessonStarted,
  recordCinematicStepViewed,
} from '@/lib/cinematic/analytics';
import { assignCinematicLessonToClass } from '@/lib/cinematic/assignments';
import { CinematicSceneRenderer } from './CinematicSceneRenderer';
import { CinematicTimeline } from './CinematicTimeline';
import { CinematicNarrationPanel } from './CinematicNarrationPanel';
import { CinematicControls } from './CinematicControls';
import { HeyGenVideoPanel } from './HeyGenVideoPanel';
import { CinematicAssetPanel } from './CinematicAssetPanel';
import { SceneStoryboard } from './SceneStoryboard';

export function CinematicLessonPlayer({
  spec,
  mode = 'teacher',
}: {
  spec: CinematicLessonSpec;
  mode?: LearningMode;
}) {
  const [previewMode, setPreviewMode] = useState<LearningMode>(mode);
  const [currentStepId, setCurrentStepId] = useState(spec.storyboard[0]?.id);
  const [completedStepIds, setCompletedStepIds] = useState<string[]>([]);
  const [checkpointAnswers, setCheckpointAnswers] = useState<Record<string, string>>({});
  const [assignmentAnswer, setAssignmentAnswer] = useState('');
  const [submitState, setSubmitState] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [assetNotice, setAssetNotice] = useState<string | null>(null);
  const [teacherNotice, setTeacherNotice] = useState<string | null>(null);

  const currentStep = useMemo(
    () => spec.storyboard.find((step) => step.id === currentStepId) ?? spec.storyboard[0],
    [currentStepId, spec.storyboard],
  );
  const teacherMode = previewMode === 'teacher';

  useEffect(() => {
    void recordCinematicLessonStarted(spec);
  }, [spec]);

  const selectStep = (stepId: string) => {
    setCurrentStepId(stepId);
    setCompletedStepIds((prev) => (prev.includes(stepId) ? prev : [...prev, stepId]));
    void recordCinematicStepViewed(spec, stepId);
  };

  const handleInteraction = (event: CinematicInteractionEvent) => {
    void recordCinematicInteraction(spec, event);
  };

  const answerCheckpoint = (checkpointId: string, answer: string) => {
    setCheckpointAnswers((prev) => ({ ...prev, [checkpointId]: answer }));
    void recordCinematicCheckpointAnswered(spec, checkpointId, answer, answer.trim().length > 8 ? 80 : 45);
  };

  const submitAssignment = async () => {
    if (!assignmentAnswer.trim() || submitState === 'saving') return;
    setSubmitState('saving');
    await recordCinematicAssignmentSubmitted(spec, assignmentAnswer, assignmentAnswer.trim().length > 30 ? 82 : 55);
    setSubmitState('saved');
    window.setTimeout(() => setSubmitState('idle'), 1800);
  };

  const onAssetSaved = (asset: CinematicAsset) => {
    setAssetNotice(`${asset.title} saved as ${asset.status}.`);
  };

  const reset = () => {
    setCurrentStepId(spec.storyboard[0]?.id);
    setCompletedStepIds([]);
    setCheckpointAnswers({});
    setAssignmentAnswer('');
  };

  const handleTeacherAction = async (action: 'assign_to_class' | 'teach_live' | 'generate_recap_video' | 'send_to_learning_hub') => {
    if (action === 'teach_live') {
      setActiveSubjectLesson(lessonFromCinematicSpec(spec));
      setTeacherNotice('Lesson is now live in the cross-subject teaching store.');
    } else if (action === 'generate_recap_video') {
      setTeacherNotice('Use the HeyGen panel to generate a short recap video from the lesson script.');
    } else if (action === 'assign_to_class') {
      const assignment = await assignCinematicLessonToClass(spec);
      setTeacherNotice(`Assigned "${assignment.lesson.title}" to the current class. Students receive the lesson view, not the teacher spec.`);
    } else {
      setTeacherNotice('Learning Data Hub event recorded for this cinematic lesson.');
    }
    await recordCinematicInteraction(spec, {
      lessonId: spec.id,
      stepId: currentStep?.id,
      interactionId: `teacher_${action}`,
      action,
    });
  };

  return (
    <div className="space-y-5 text-white">
      <header className="overflow-hidden rounded-lg border border-white/10 bg-gradient-to-br from-[#0a1736] via-[#061126] to-[#050711] p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-md border border-[#49c8ff]/30 bg-[#49c8ff]/10 px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-[#8ddfff]">
                Cinematic Lesson Studio
              </span>
              <span className="rounded-md border border-[#ffc43b]/30 bg-[#ffc43b]/10 px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-[#ffe08a]">
                {spec.analytics.eventSubject}
              </span>
            </div>
            <h1 className="mt-3 text-2xl font-black tracking-normal sm:text-3xl">{spec.title}</h1>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              {spec.topic} · {spec.analytics.masteryConcept}
            </p>
            <p className="mt-2 max-w-3xl text-sm italic leading-6 text-[#ffe08a]">Inquiry: {spec.inquiryQuestion}</p>
          </div>
          <div className="grid grid-cols-2 gap-2 text-center text-xs">
            <div className="rounded-md border border-white/10 bg-white/[0.03] p-3">
              <p className="font-black text-white">{spec.storyboard.length}</p>
              <p className="mt-1 uppercase tracking-wide text-slate-400">Scenes</p>
            </div>
            <div className="rounded-md border border-white/10 bg-white/[0.03] p-3">
              <p className="font-black text-white">{spec.assessment.checkpoints.length}</p>
              <p className="mt-1 uppercase tracking-wide text-slate-400">Checkpoints</p>
            </div>
          </div>
        </div>
      </header>

      <CinematicControls mode={previewMode} onModeChange={setPreviewMode} onReset={reset} />

      <section className="grid gap-5 xl:grid-cols-[360px_1fr_320px] xl:items-start">
        <div className="space-y-5">
          <CinematicTimeline steps={spec.storyboard} currentStepId={currentStep?.id} completedStepIds={completedStepIds} onSelectStep={selectStep} />
          <CinematicNarrationPanel
            step={currentStep}
            masteryConcept={spec.analytics.masteryConcept}
            teacherMode={teacherMode}
            onGenerateHeyGen={() => setAssetNotice('Use the HeyGen panel to generate and save the avatar explainer.')}
          />
        </div>

        <div className="space-y-5">
          <CinematicSceneRenderer spec={spec} currentStepId={currentStep?.id} onInteraction={handleInteraction} />
          <CheckpointPanel spec={spec} answers={checkpointAnswers} onAnswer={answerCheckpoint} />
          <AssignmentPanel
            spec={spec}
            answer={assignmentAnswer}
            setAnswer={setAssignmentAnswer}
            submitState={submitState}
            onSubmit={submitAssignment}
          />
        </div>

        <aside className="space-y-5">
          <HeyGenVideoPanel spec={spec} teacherMode={teacherMode} onAssetSaved={onAssetSaved} />
          {assetNotice ? <p className="rounded-md border border-emerald-300/25 bg-emerald-300/10 px-3 py-2 text-xs text-emerald-100">{assetNotice}</p> : null}
          <CinematicAssetPanel lessonId={spec.id} />
          {teacherNotice ? <p className="rounded-md border border-[#49c8ff]/25 bg-[#49c8ff]/10 px-3 py-2 text-xs text-[#d9f6ff]">{teacherNotice}</p> : null}
          {teacherMode ? <TeacherActions onAction={handleTeacherAction} /> : <StudentActions />}
        </aside>
      </section>

      <SceneStoryboard spec={spec} />
    </div>
  );
}

function CheckpointPanel({
  spec,
  answers,
  onAnswer,
}: {
  spec: CinematicLessonSpec;
  answers: Record<string, string>;
  onAnswer: (checkpointId: string, answer: string) => void;
}) {
  return (
    <section className="rounded-lg border border-white/10 bg-[#061126] p-4">
      <p className="text-xs font-black uppercase tracking-wide text-[#ffc43b]">Student checkpoints</p>
      <div className="mt-3 space-y-3">
        {spec.assessment.checkpoints.map((checkpoint) => (
          <div key={checkpoint.id} className="rounded-md border border-white/10 bg-white/[0.03] p-3">
            <p className="text-sm font-black text-white">{checkpoint.prompt}</p>
            {checkpoint.choices?.length ? (
              <div className="mt-2 flex flex-wrap gap-2">
                {checkpoint.choices.map((choice) => (
                  <button
                    key={choice}
                    type="button"
                    onClick={() => onAnswer(checkpoint.id, choice)}
                    className="rounded-md border border-white/10 px-2.5 py-1.5 text-xs font-bold text-slate-200 hover:border-[#49c8ff]/60 hover:text-white"
                  >
                    {choice}
                  </button>
                ))}
              </div>
            ) : (
              <input
                value={answers[checkpoint.id] ?? ''}
                onChange={(event) => onAnswer(checkpoint.id, event.target.value)}
                placeholder="Type a short response"
                className="mt-2 w-full rounded-md border border-white/10 bg-[#050711] px-3 py-2 text-sm text-white outline-none focus:border-[#49c8ff]"
              />
            )}
            {answers[checkpoint.id] ? <p className="mt-2 text-xs leading-5 text-emerald-100">{checkpoint.feedback}</p> : null}
          </div>
        ))}
      </div>
    </section>
  );
}

function AssignmentPanel({
  spec,
  answer,
  setAnswer,
  submitState,
  onSubmit,
}: {
  spec: CinematicLessonSpec;
  answer: string;
  setAnswer: (value: string) => void;
  submitState: 'idle' | 'saving' | 'saved';
  onSubmit: () => void;
}) {
  return (
    <section className="rounded-lg border border-white/10 bg-[#061126] p-4">
      <p className="text-xs font-black uppercase tracking-wide text-[#ffc43b]">Assignment</p>
      <div className="mt-3 space-y-3">
        {spec.assessment.assignmentQuestions.map((question) => (
          <article key={question.id} className="rounded-md border border-white/10 bg-white/[0.03] p-3">
            <p className="text-sm font-black text-white">{question.question}</p>
            <p className="mt-1 text-xs leading-5 text-slate-400">{question.rubric}</p>
          </article>
        ))}
      </div>
      <textarea
        value={answer}
        onChange={(event) => setAnswer(event.target.value)}
        placeholder="Write the student response here"
        className="mt-3 min-h-28 w-full rounded-md border border-white/10 bg-[#050711] p-3 text-sm leading-6 text-white outline-none focus:border-[#49c8ff]"
      />
      <button
        type="button"
        onClick={onSubmit}
        disabled={!answer.trim() || submitState === 'saving'}
        className="mt-3 inline-flex items-center gap-2 rounded-md bg-[#49c8ff] px-4 py-2 text-sm font-black text-[#061126] transition hover:bg-[#8ddfff] disabled:cursor-not-allowed disabled:opacity-45"
      >
        {submitState === 'saving' ? <Loader2 className="h-4 w-4 animate-spin" /> : submitState === 'saved' ? <CheckCircle2 className="h-4 w-4" /> : <Send className="h-4 w-4" />}
        {submitState === 'saved' ? 'Submitted' : 'Submit'}
      </button>
    </section>
  );
}

function TeacherActions({ onAction }: { onAction: (action: 'assign_to_class' | 'teach_live' | 'generate_recap_video' | 'send_to_learning_hub') => void }) {
  const actions: { label: string; action: 'assign_to_class' | 'teach_live' | 'generate_recap_video' | 'send_to_learning_hub'; Icon: LucideIcon }[] = [
    { label: 'Assign to class', action: 'assign_to_class', Icon: Users },
    { label: 'Teach live', action: 'teach_live', Icon: Video },
    { label: 'Generate recap video', action: 'generate_recap_video', Icon: Video },
    { label: 'Send to Learning Data Hub', action: 'send_to_learning_hub', Icon: Send },
  ];
  return (
    <div className="rounded-lg border border-white/10 bg-[#061126] p-4">
      <p className="text-xs font-black uppercase tracking-wide text-[#ffc43b]">Teacher controls</p>
      <div className="mt-3 grid gap-2">
        {actions.map(({ label, action, Icon }) => (
          <button
            key={label}
            type="button"
            onClick={() => onAction(action)}
            className="inline-flex items-center gap-2 rounded-md border border-white/10 px-3 py-2 text-xs font-black text-slate-200 hover:border-[#49c8ff]/60 hover:text-white"
          >
            <Icon className="h-3.5 w-3.5" />
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}

function StudentActions() {
  return (
    <div className="rounded-lg border border-white/10 bg-[#061126] p-4">
      <p className="text-xs font-black uppercase tracking-wide text-[#8ddfff]">Student controls</p>
      <div className="mt-3 grid gap-2">
        {['Start lesson', 'Continue', 'Submit checkpoint'].map((label) => (
          <button key={label} type="button" className="rounded-md border border-white/10 px-3 py-2 text-left text-xs font-black text-slate-200 hover:border-[#49c8ff]/60 hover:text-white">
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
