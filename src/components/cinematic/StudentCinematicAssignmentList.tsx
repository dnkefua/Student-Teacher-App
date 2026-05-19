'use client';

import React, { useEffect, useState } from 'react';
import { ArrowRight, Clapperboard, Loader2, RefreshCw } from 'lucide-react';
import { listAssignedCinematicLessons, subscribeCinematicAssignments, type StudentCinematicAssignment } from '@/lib/cinematic/assignments';
import type { CinematicLessonSpec } from '@/lib/cinematic/types';
import { CinematicLessonPlayer } from './CinematicLessonPlayer';

function studentSpecFromAssignment(assignment: StudentCinematicAssignment): CinematicLessonSpec {
  const lesson = assignment.lesson;
  return {
    id: lesson.id,
    subject: lesson.subject,
    grade: lesson.grade,
    unitId: lesson.unitId,
    title: lesson.title,
    topic: lesson.topic,
    concept: lesson.concept,
    inquiryQuestion: lesson.inquiryQuestion,
    objectives: lesson.objectives,
    sceneType: lesson.sceneType,
    cinematicStyle: {
      tone: lesson.subject === 'science' ? 'lab_simulation' : lesson.subject === 'english' ? 'exam_coach' : 'premium_school',
      cameraStyle: lesson.subject === 'science' ? 'interactive_lab' : 'guided_walkthrough',
      colorTheme: lesson.subject === 'science' ? 'science_emerald_cyan' : lesson.subject === 'english' ? 'english_purple_gold' : 'math_cyan_gold',
      pacing: 'medium',
    },
    storyboard: lesson.storyboard,
    interactiveScene: lesson.interactiveScene,
    heygen: {
      enabled: Boolean(lesson.heygenVideoUrl),
      videoPurpose: 'lesson_intro',
      title: lesson.heygenTitle ?? lesson.title,
      script: 'Watch the studio video introduction, then complete the interactive lesson and checkpoint your teacher assigned.',
      avatarStyle: lesson.subject === 'science' ? 'science_lab_teacher' : lesson.subject === 'english' ? 'english_coach' : 'professional_teacher',
      voiceStyle: 'warm_confident',
      aspectRatio: '16:9',
      durationTargetSeconds: 45,
      includeCaptions: true,
      status: lesson.heygenVideoUrl ? 'generated' : 'not_generated',
      videoUrl: lesson.heygenVideoUrl,
    },
    assessment: {
      checkpoints: lesson.checkpoints,
      assignmentQuestions: lesson.assignmentQuestions.map((question) => ({
        id: question.id,
        question: question.question,
        rubric: `${question.marks} marks. Show your reasoning clearly.`,
        marks: question.marks,
      })),
    },
    analytics: {
      eventSubject: lesson.subject === 'science' ? 'Science' : lesson.subject === 'english' ? 'English' : 'Mathematics',
      eventType: lesson.subject === 'science' ? 'simulation_interaction' : lesson.subject === 'english' ? 'writing_submission' : '3d_interaction',
      masteryConcept: lesson.concept,
      skillTags: [lesson.subject, lesson.topic, lesson.concept],
    },
  };
}

export function StudentCinematicAssignmentList() {
  const [assignments, setAssignments] = useState<StudentCinematicAssignment[]>([]);
  const [active, setActive] = useState<StudentCinematicAssignment | null>(null);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const next = await listAssignedCinematicLessons();
      setAssignments(next);
      setActive((current) => current ?? next[0] ?? null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
    return subscribeCinematicAssignments(() => void load());
  }, []);

  if (assignments.length === 0 && !loading) return null;

  return (
    <section className="rounded-lg border border-white/10 bg-[#061126] p-5 text-white">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Clapperboard className="h-5 w-5 text-[#8ddfff]" />
          <div>
            <p className="text-xs font-black uppercase tracking-wide text-[#8ddfff]">Cinematic lesson inbox</p>
            <p className="text-sm text-slate-400">Assigned by your teacher. AI generation and teacher specs stay hidden.</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => void load()}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-md border border-white/10 px-3 py-2 text-xs font-black text-slate-200 hover:border-[#49c8ff]/60 disabled:opacity-50"
        >
          {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RefreshCw className="h-3.5 w-3.5" />}
          Refresh
        </button>
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-3">
        {assignments.map((assignment) => {
          const selected = active?.id === assignment.id;
          return (
            <button
              key={assignment.id}
              type="button"
              onClick={() => setActive(assignment)}
              className={`rounded-md border p-3 text-left transition ${
                selected ? 'border-[#49c8ff] bg-[#49c8ff]/10' : 'border-white/10 bg-white/[0.03] hover:border-white/25'
              }`}
            >
              <p className="line-clamp-2 text-sm font-black text-white">{assignment.lesson.title}</p>
              <p className="mt-2 text-[11px] uppercase tracking-wide text-slate-400">{assignment.lesson.subject} - {assignment.lesson.topic}</p>
              <span className="mt-3 inline-flex items-center gap-1 text-xs font-black text-[#8ddfff]">
                Open assigned lesson <ArrowRight className="h-3 w-3" />
              </span>
            </button>
          );
        })}
      </div>

      {active ? (
        <div className="mt-5">
          <CinematicLessonPlayer spec={studentSpecFromAssignment(active)} mode="student" />
        </div>
      ) : null}
    </section>
  );
}
