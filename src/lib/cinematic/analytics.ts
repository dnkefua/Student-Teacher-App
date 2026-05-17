import { recordLearningEventOnce } from '@/lib/learningHub/repository';
import { DEMO_CLASS_8A, DEMO_SCHOOL_ID, type LearningEvent, type LearningEventType } from '@/lib/learningHub/types';
import type { CinematicInteractionEvent, CinematicLessonSpec } from './types';

function id(prefix: string): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return `${prefix}-${crypto.randomUUID().split('-')[0]}`;
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function eventTypeFor(spec: CinematicLessonSpec, override?: LearningEventType): LearningEventType {
  if (override) return override;
  if (spec.analytics.eventType === 'reading_annotation') return 'reading_annotation';
  if (spec.analytics.eventType === 'writing_submission') return 'writing_submission';
  if (spec.analytics.eventType === 'simulation_interaction' || spec.analytics.eventType === 'virtual_lab') return 'simulation_interaction';
  return '3d_interaction';
}

function buildEvent(
  spec: CinematicLessonSpec,
  eventType: LearningEventType,
  raw: Record<string, unknown> = {},
  score?: number,
): LearningEvent {
  const now = new Date().toISOString();
  return {
    id: id('cin-event'),
    schoolId: DEMO_SCHOOL_ID,
    classId: DEMO_CLASS_8A,
    studentId: 'eis-demo-student-id',
    mappedStudentName: 'EIS Demo Student',
    platform: 'eis_learning_studio',
    sourceActivityId: spec.id,
    subject: spec.analytics.eventSubject,
    grade: spec.grade,
    unit: spec.unitId,
    topic: spec.topic,
    concept: spec.analytics.masteryConcept,
    eventType,
    activityTitle: spec.title,
    score,
    maxScore: typeof score === 'number' ? 100 : undefined,
    masterySignal: typeof score === 'number' ? (score >= 75 ? 'strong' : score >= 50 ? 'developing' : 'weak') : 'unknown',
    raw: { ...raw, skillTags: spec.analytics.skillTags },
    occurredAt: now,
    importedAt: now,
  };
}

async function record(spec: CinematicLessonSpec, eventType: LearningEventType, raw?: Record<string, unknown>, score?: number): Promise<void> {
  await recordLearningEventOnce(buildEvent(spec, eventType, raw, score));
}

export function recordCinematicLessonStarted(spec: CinematicLessonSpec): Promise<void> {
  return record(spec, 'lesson_view', { action: 'lesson_started' });
}

export function recordCinematicStepViewed(spec: CinematicLessonSpec, stepId: string): Promise<void> {
  return record(spec, 'lesson_view', { action: 'step_viewed', stepId });
}

export function recordCinematicInteraction(spec: CinematicLessonSpec, event: CinematicInteractionEvent): Promise<void> {
  return record(spec, eventTypeFor(spec), { action: event.action, stepId: event.stepId, interactionId: event.interactionId, value: event.value }, event.score);
}

export function recordCinematicCheckpointAnswered(
  spec: CinematicLessonSpec,
  checkpointId: string,
  answer: string,
  score?: number,
): Promise<void> {
  return record(spec, 'question_response', { action: 'checkpoint_answered', checkpointId, answer }, score);
}

export function recordCinematicAssignmentSubmitted(spec: CinematicLessonSpec, answer: string, score?: number): Promise<void> {
  return record(spec, 'assignment_submission', { action: 'assignment_submitted', answer }, score);
}

export function recordHeyGenVideoWatched(spec: CinematicLessonSpec, videoId: string, durationSeconds?: number): Promise<void> {
  return record(spec, 'video_watch', { action: 'heygen_video_watched', videoId, durationSeconds });
}
