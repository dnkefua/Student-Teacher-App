'use client';

import { collection, doc, getDocs, limit, orderBy, query, serverTimestamp, setDoc, where, type QueryConstraint } from 'firebase/firestore';
import { getActiveClassId } from '@/lib/activeClass';
import { getDb, isFirebaseConfigured } from '@/lib/firebase/client';
import { getDemoClassId, getDemoUserId } from '@/lib/firebase/demoUser';
import type {
  CinematicCheckpoint,
  CinematicLessonSpec,
  CinematicSceneType,
  CinematicStoryboardStep,
  InteractiveSceneSpec,
  SubjectId,
} from './types';

const STORAGE_KEY = 'eis-cinematic-student-assignments-v1';
const EVENT_NAME = 'eis-cinematic-assignments-changed';
const COLLECTION = 'cinematicAssignments';

export type StudentCinematicAssignment = {
  id: string;
  lessonId: string;
  classId: string;
  assignedBy: string;
  assignedAt: string;
  status: 'assigned' | 'submitted' | 'closed';
  lesson: {
    id: string;
    subject: SubjectId;
    grade: 'Grade 8';
    unitId: string;
    title: string;
    topic: string;
    concept: string;
    inquiryQuestion: string;
    objectives: string[];
    sceneType: CinematicSceneType;
    storyboard: CinematicStoryboardStep[];
    interactiveScene: InteractiveSceneSpec;
    checkpoints: CinematicCheckpoint[];
    assignmentQuestions: Array<{
      id: string;
      question: string;
      marks: number;
    }>;
    heygenVideoUrl?: string;
    heygenTitle?: string;
    heygenPurpose?: string;
  };
};

function canUseStorage(): boolean {
  return typeof window !== 'undefined' && Boolean(window.localStorage);
}

function nowIso(): string {
  return new Date().toISOString();
}

function uid(prefix: string): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return `${prefix}-${crypto.randomUUID().split('-')[0]}`;
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function activeClassId(): string {
  if (typeof window === 'undefined') return getDemoClassId();
  return getActiveClassId() || getDemoClassId();
}

function readLocal(): StudentCinematicAssignment[] {
  if (!canUseStorage()) return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? (parsed as StudentCinematicAssignment[]) : [];
  } catch {
    return [];
  }
}

function writeLocal(assignments: StudentCinematicAssignment[]): void {
  if (!canUseStorage()) return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(assignments.slice(0, 100)));
  window.dispatchEvent(new CustomEvent(EVENT_NAME));
}

function studentCheckpoint(checkpoint: CinematicCheckpoint): CinematicCheckpoint {
  return {
    id: checkpoint.id,
    prompt: checkpoint.prompt,
    type: checkpoint.type,
    choices: checkpoint.choices,
    feedback: checkpoint.feedback,
  };
}

export function buildStudentCinematicAssignment(spec: CinematicLessonSpec): StudentCinematicAssignment {
  const classId = activeClassId();
  const assignedAt = nowIso();
  return {
    id: uid('cin-assign'),
    lessonId: spec.id,
    classId,
    assignedBy: getDemoUserId('teacher'),
    assignedAt,
    status: 'assigned',
    lesson: {
      id: spec.id,
      subject: spec.subject,
      grade: spec.grade,
      unitId: spec.unitId,
      title: spec.title,
      topic: spec.topic,
      concept: spec.concept,
      inquiryQuestion: spec.inquiryQuestion,
      objectives: spec.objectives,
      sceneType: spec.sceneType,
      storyboard: spec.storyboard,
      interactiveScene: spec.interactiveScene,
      checkpoints: spec.assessment.checkpoints.map(studentCheckpoint),
      assignmentQuestions: spec.assessment.assignmentQuestions.map((question) => ({
        id: question.id,
        question: question.question,
        marks: question.marks,
      })),
      heygenVideoUrl: spec.heygen.videoUrl,
      heygenTitle: spec.heygen.title,
      heygenPurpose: spec.heygen.videoPurpose,
    },
  };
}

export async function assignCinematicLessonToClass(spec: CinematicLessonSpec): Promise<StudentCinematicAssignment> {
  const assignment = buildStudentCinematicAssignment(spec);
  const local = readLocal().filter((item) => item.lessonId !== spec.id || item.classId !== assignment.classId);
  writeLocal([assignment, ...local]);

  const db = isFirebaseConfigured() ? getDb() : null;
  if (db) {
    try {
      await setDoc(doc(db, COLLECTION, assignment.id), { ...assignment, _createdAt: serverTimestamp() });
    } catch (err) {
      console.warn('[cinematic assignments] Firestore save failed; local fallback retained.', err);
    }
  }

  return assignment;
}

export async function listAssignedCinematicLessons(classId = activeClassId()): Promise<StudentCinematicAssignment[]> {
  const local = readLocal().filter((assignment) => assignment.classId === classId && assignment.status === 'assigned');
  const db = isFirebaseConfigured() ? getDb() : null;
  if (!db) return local;

  try {
    const constraints: QueryConstraint[] = [
      where('classId', '==', classId),
      where('status', '==', 'assigned'),
      orderBy('assignedAt', 'desc'),
      limit(25),
    ];
    const snap = await getDocs(query(collection(db, COLLECTION), ...constraints));
    const remote = snap.docs.map((d) => d.data() as StudentCinematicAssignment);
    return remote.length > 0 ? remote : local;
  } catch (err) {
    console.warn('[cinematic assignments] Firestore list failed; using local fallback.', err);
    return local;
  }
}

export function subscribeCinematicAssignments(callback: () => void): () => void {
  if (typeof window === 'undefined') return () => undefined;
  window.addEventListener(EVENT_NAME, callback);
  window.addEventListener('storage', callback);
  return () => {
    window.removeEventListener(EVENT_NAME, callback);
    window.removeEventListener('storage', callback);
  };
}

export const CINEMATIC_ASSIGNMENTS_STORAGE_KEY = STORAGE_KEY;
export const CINEMATIC_ASSIGNMENTS_EVENT = EVENT_NAME;
