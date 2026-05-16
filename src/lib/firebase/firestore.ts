// Firestore CRUD helpers for EIS Maths Studio. Every function returns
// null (or false) when Firebase isn't configured so callers can fall
// back to localStorage without crashing.

import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  type Firestore,
  type Unsubscribe,
} from 'firebase/firestore';
import type { CurriculumQuestion } from '@/lib/grade8Curriculum';
import { getDb, isFirebaseConfigured } from './client';
import { demoDisplayName, getDemoClassId, getDemoUserId } from './demoUser';
import { getActiveClassId } from '@/lib/activeClass';

function activeOrDemoClassId(): string {
  // Read the picker's selected class on the client, fall back to the
  // legacy demo class id on the server or when nothing is selected.
  if (typeof window === 'undefined') return getDemoClassId();
  return getActiveClassId() || getDemoClassId();
}
import {
  COLLECTIONS,
  type AppRole,
  type AppUser,
  type ClassRoom,
  type FirestoreAssignment,
  type GeneratedLesson,
  type LessonProgress,
  type StudentResponse,
} from './types';

function dbOrNull(): Firestore | null {
  if (!isFirebaseConfigured()) return null;
  return getDb();
}

function id(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function nowIso(): string {
  return new Date().toISOString();
}

export async function getOrCreateDemoUser(role: AppRole): Promise<AppUser | null> {
  const db = dbOrNull();
  if (!db) return null;

  const userId = getDemoUserId(role);
  const ref = doc(db, COLLECTIONS.users, userId);
  const snap = await getDoc(ref);
  if (snap.exists()) return snap.data() as AppUser;

  const user: AppUser = {
    id: userId,
    displayName: demoDisplayName(role),
    role,
    classIds: [getDemoClassId()],
    createdAt: nowIso(),
  };
  await setDoc(ref, { ...user, _createdAt: serverTimestamp() });
  return user;
}

export async function createDemoClass(): Promise<ClassRoom | null> {
  const db = dbOrNull();
  if (!db) return null;

  const classId = getDemoClassId();
  const ref = doc(db, COLLECTIONS.classes, classId);
  const snap = await getDoc(ref);
  if (snap.exists()) return snap.data() as ClassRoom;

  const teacherId = getDemoUserId('teacher');
  const studentId = getDemoUserId('student');
  const cls: ClassRoom = {
    id: classId,
    name: 'EIS Grade 8 Maths · Demo Class',
    grade: 'Grade 8',
    subject: 'Mathematics',
    teacherId,
    studentIds: [studentId],
    createdAt: nowIso(),
  };
  await setDoc(ref, { ...cls, _createdAt: serverTimestamp() });
  return cls;
}

export async function createAssignment(
  question: CurriculumQuestion,
  opts: { classId?: string; teacherId?: string; dueDate?: string } = {},
): Promise<FirestoreAssignment | null> {
  const db = dbOrNull();
  if (!db) return null;

  const classId = opts.classId ?? activeOrDemoClassId();
  const teacherId = opts.teacherId ?? getDemoUserId('teacher');
  const assignmentId = id();

  const assignment: FirestoreAssignment = {
    id: assignmentId,
    classId,
    lessonId: question.id,
    questionId: question.id,
    title: question.title,
    lessonTitle: `${question.unitLabel} · ${question.topic}`,
    inquiryQuestion: question.inquiryQuestion,
    objective: question.objective,
    prompt: question.prompt,
    question: question.question,
    expectedAnswer: question.expectedAnswer,
    acceptedKeywords: question.acceptedKeywords,
    threeDType: question.threeDType,
    difficulty: question.difficulty,
    dueDate: opts.dueDate,
    status: 'assigned',
    createdBy: teacherId,
    createdAt: nowIso(),
    updatedAt: nowIso(),
  };

  await setDoc(doc(db, COLLECTIONS.assignments, assignmentId), {
    ...assignment,
    _createdAt: serverTimestamp(),
  });
  return assignment;
}

export async function getActiveAssignments(classId?: string): Promise<FirestoreAssignment[] | null> {
  const db = dbOrNull();
  if (!db) return null;

  const targetClassId = classId ?? activeOrDemoClassId();
  const q = query(
    collection(db, COLLECTIONS.assignments),
    where('classId', '==', targetClassId),
    where('status', '==', 'assigned'),
    orderBy('createdAt', 'desc'),
    limit(50),
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data() as FirestoreAssignment);
}

export async function getAssignment(assignmentId: string): Promise<FirestoreAssignment | null> {
  const db = dbOrNull();
  if (!db) return null;
  const snap = await getDoc(doc(db, COLLECTIONS.assignments, assignmentId));
  return snap.exists() ? (snap.data() as FirestoreAssignment) : null;
}

export async function submitStudentResponse(input: {
  assignmentId: string;
  classId?: string;
  studentId?: string;
  answer: string;
  score: number;
  feedback: string;
}): Promise<StudentResponse | null> {
  const db = dbOrNull();
  if (!db) return null;

  const responseId = id();
  const response: StudentResponse = {
    id: responseId,
    assignmentId: input.assignmentId,
    classId: input.classId ?? activeOrDemoClassId(),
    studentId: input.studentId ?? getDemoUserId('student'),
    answer: input.answer,
    score: input.score,
    feedback: input.feedback,
    submittedAt: nowIso(),
  };

  await setDoc(doc(db, COLLECTIONS.studentResponses, responseId), {
    ...response,
    _createdAt: serverTimestamp(),
  });
  return response;
}

export async function getResponsesForAssignment(assignmentId: string): Promise<StudentResponse[] | null> {
  const db = dbOrNull();
  if (!db) return null;
  const q = query(
    collection(db, COLLECTIONS.studentResponses),
    where('assignmentId', '==', assignmentId),
    orderBy('submittedAt', 'desc'),
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data() as StudentResponse);
}

/** Subscribe to live changes for active assignments. Returns an unsubscribe
 *  function. Returns null (and never calls the callback) when Firebase is
 *  not configured — callers can fall back to polling or static demo data. */
export function watchActiveAssignments(
  callback: (assignments: FirestoreAssignment[]) => void,
  classId?: string,
): Unsubscribe | null {
  const db = dbOrNull();
  if (!db) return null;
  const targetClassId = classId ?? activeOrDemoClassId();
  const q = query(
    collection(db, COLLECTIONS.assignments),
    where('classId', '==', targetClassId),
    where('status', '==', 'assigned'),
    orderBy('createdAt', 'desc'),
    limit(50),
  );
  return onSnapshot(
    q,
    (snap) => callback(snap.docs.map((d) => d.data() as FirestoreAssignment)),
    (err) => console.warn('[firestore] watchActiveAssignments error', err),
  );
}

/** Subscribe to live student responses for a given assignment. */
export function watchResponsesForAssignment(
  assignmentId: string,
  callback: (responses: StudentResponse[]) => void,
): Unsubscribe | null {
  const db = dbOrNull();
  if (!db) return null;
  const q = query(
    collection(db, COLLECTIONS.studentResponses),
    where('assignmentId', '==', assignmentId),
    orderBy('submittedAt', 'desc'),
  );
  return onSnapshot(
    q,
    (snap) => callback(snap.docs.map((d) => d.data() as StudentResponse)),
    (err) => console.warn('[firestore] watchResponsesForAssignment error', err),
  );
}

export async function saveGeneratedLesson(lesson: Omit<GeneratedLesson, 'id' | 'createdAt'> & { id?: string }): Promise<GeneratedLesson | null> {
  const db = dbOrNull();
  if (!db) return null;

  const lessonId = lesson.id ?? id();
  const record: GeneratedLesson = {
    ...lesson,
    id: lessonId,
    createdAt: nowIso(),
  };
  await setDoc(doc(db, COLLECTIONS.generatedLessons, lessonId), {
    ...record,
    _createdAt: serverTimestamp(),
  });
  return record;
}

export async function getGeneratedLessons(opts: { limit?: number; createdBy?: string } = {}): Promise<GeneratedLesson[] | null> {
  const db = dbOrNull();
  if (!db) return null;

  const constraints = [orderBy('createdAt', 'desc'), limit(opts.limit ?? 25)];
  const baseRef = collection(db, COLLECTIONS.generatedLessons);
  const q = opts.createdBy
    ? query(baseRef, where('createdBy', '==', opts.createdBy), ...constraints)
    : query(baseRef, ...constraints);
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data() as GeneratedLesson);
}

export async function saveLessonProgress(input: {
  studentId?: string;
  lessonId: string;
  completedSteps: string[];
  score?: number;
}): Promise<LessonProgress | null> {
  const db = dbOrNull();
  if (!db) return null;

  const studentId = input.studentId ?? getDemoUserId('student');
  const progressId = `${studentId}_${input.lessonId}`;
  const record: LessonProgress = {
    id: progressId,
    studentId,
    lessonId: input.lessonId,
    completedSteps: input.completedSteps,
    lastOpenedAt: nowIso(),
    score: input.score,
  };
  await setDoc(doc(db, COLLECTIONS.lessonProgress, progressId), {
    ...record,
    _updatedAt: serverTimestamp(),
  });
  return record;
}

export async function getLessonProgress(lessonId: string, studentId?: string): Promise<LessonProgress | null> {
  const db = dbOrNull();
  if (!db) return null;
  const sid = studentId ?? getDemoUserId('student');
  const snap = await getDoc(doc(db, COLLECTIONS.lessonProgress, `${sid}_${lessonId}`));
  return snap.exists() ? (snap.data() as LessonProgress) : null;
}
