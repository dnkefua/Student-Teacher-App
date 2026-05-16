// Helpers that turn internal app activity (assignments, 3D interactions,
// NeuroQuest games, AI tutor sessions, live class participation) into
// canonical LearningEvents. Same shape as imported events so analytics
// don't need to special-case the platform.

import { recordLearningEventOnce } from './repository';
import { inferStrandFromTopic, inferTopicFromActivityTitle } from './eventFactory';
import type { LearningEvent, MypStrand } from './types';
import { DEMO_SCHOOL_ID } from './types';

function evtId(prefix: string): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return `${prefix}-${crypto.randomUUID().split('-')[0]}`;
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function nowIso(): string {
  return new Date().toISOString();
}

function inferContext(title?: string, topic?: string): { topic?: string; strand?: MypStrand } {
  const titleInfer = inferTopicFromActivityTitle(title);
  if (titleInfer) return titleInfer;
  return { topic, strand: inferStrandFromTopic(topic) };
}

export async function recordAssignmentSubmissionEvent(input: {
  studentId: string;
  studentName: string;
  assignmentId: string;
  lessonTitle: string;
  topic?: string;
  score?: number;
  feedback?: string;
}): Promise<void> {
  const ctx = inferContext(input.lessonTitle, input.topic);
  const accuracy = typeof input.score === 'number' ? Math.max(0, Math.min(100, input.score)) : undefined;
  const event: LearningEvent = {
    id: evtId('evt-eis-assign'),
    schoolId: DEMO_SCHOOL_ID,
    studentId: input.studentId,
    mappedStudentName: input.studentName,
    externalStudentName: input.studentName,
    platform: 'eis_maths_studio',
    sourceActivityId: input.assignmentId,
    subject: 'Mathematics',
    grade: 'Grade 8',
    topic: ctx.topic,
    strand: ctx.strand,
    eventType: 'assignment_submission',
    activityTitle: input.lessonTitle,
    score: accuracy,
    maxScore: 100,
    accuracy,
    completionStatus: 'completed',
    masterySignal: accuracy === undefined ? 'unknown' : accuracy >= 80 ? 'strong' : accuracy >= 55 ? 'developing' : 'weak',
    occurredAt: nowIso(),
    importedAt: nowIso(),
  };
  await recordLearningEventOnce(event);
}

export async function recordThreeDInteractionEvent(input: {
  studentId: string;
  studentName: string;
  lessonId: string;
  lessonTitle: string;
  threeDType: string;
  topic?: string;
  durationSeconds?: number;
}): Promise<void> {
  const ctx = inferContext(input.lessonTitle, input.topic);
  const event: LearningEvent = {
    id: evtId('evt-eis-3d'),
    schoolId: DEMO_SCHOOL_ID,
    studentId: input.studentId,
    mappedStudentName: input.studentName,
    externalStudentName: input.studentName,
    platform: 'eis_maths_studio',
    sourceActivityId: input.lessonId,
    subject: 'Mathematics',
    grade: 'Grade 8',
    topic: ctx.topic,
    strand: ctx.strand,
    eventType: '3d_interaction',
    activityTitle: `${input.lessonTitle} · ${input.threeDType}`,
    durationSeconds: input.durationSeconds,
    completionStatus: 'completed',
    masterySignal: 'unknown',
    occurredAt: nowIso(),
    importedAt: nowIso(),
  };
  await recordLearningEventOnce(event);
}

export async function recordNeuroQuestGameEvent(input: {
  studentId: string;
  studentName: string;
  gameTitle: string;
  topic?: string;
  score?: number;
  durationSeconds?: number;
}): Promise<void> {
  const ctx = inferContext(input.gameTitle, input.topic);
  const accuracy = typeof input.score === 'number' ? Math.max(0, Math.min(100, input.score)) : undefined;
  const event: LearningEvent = {
    id: evtId('evt-nq'),
    schoolId: DEMO_SCHOOL_ID,
    studentId: input.studentId,
    mappedStudentName: input.studentName,
    externalStudentName: input.studentName,
    platform: 'neuroquest',
    subject: 'Mathematics',
    grade: 'Grade 8',
    topic: ctx.topic,
    strand: ctx.strand,
    eventType: 'live_game',
    activityTitle: input.gameTitle,
    score: accuracy,
    maxScore: 100,
    accuracy,
    durationSeconds: input.durationSeconds,
    completionStatus: 'completed',
    masterySignal: accuracy === undefined ? 'unknown' : accuracy >= 80 ? 'strong' : accuracy >= 55 ? 'developing' : 'weak',
    occurredAt: nowIso(),
    importedAt: nowIso(),
  };
  await recordLearningEventOnce(event);
}

export async function recordAITutorSessionEvent(input: {
  studentId: string;
  studentName: string;
  topic?: string;
  question?: string;
}): Promise<void> {
  const ctx = inferContext(input.question, input.topic);
  const event: LearningEvent = {
    id: evtId('evt-tutor'),
    schoolId: DEMO_SCHOOL_ID,
    studentId: input.studentId,
    mappedStudentName: input.studentName,
    externalStudentName: input.studentName,
    platform: 'eis_maths_studio',
    subject: 'Mathematics',
    grade: 'Grade 8',
    topic: ctx.topic,
    strand: ctx.strand,
    eventType: 'ai_tutor_session',
    activityTitle: input.question ? `AI tutor — ${input.question.slice(0, 80)}` : 'AI tutor session',
    questionText: input.question,
    completionStatus: 'completed',
    masterySignal: 'unknown',
    occurredAt: nowIso(),
    importedAt: nowIso(),
  };
  await recordLearningEventOnce(event);
}

export async function recordClassParticipationEvent(input: {
  studentId: string;
  studentName: string;
  classId: string;
  activityTitle: string;
  durationSeconds?: number;
}): Promise<void> {
  const ctx = inferContext(input.activityTitle);
  const event: LearningEvent = {
    id: evtId('evt-class'),
    schoolId: DEMO_SCHOOL_ID,
    classId: input.classId,
    studentId: input.studentId,
    mappedStudentName: input.studentName,
    externalStudentName: input.studentName,
    platform: 'eis_maths_studio',
    subject: 'Mathematics',
    grade: 'Grade 8',
    topic: ctx.topic,
    strand: ctx.strand,
    eventType: 'class_participation',
    activityTitle: input.activityTitle,
    durationSeconds: input.durationSeconds,
    completionStatus: 'completed',
    masterySignal: 'unknown',
    occurredAt: nowIso(),
    importedAt: nowIso(),
  };
  await recordLearningEventOnce(event);
}
