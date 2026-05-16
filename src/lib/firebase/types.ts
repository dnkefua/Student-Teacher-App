// Firestore document shapes for EIS Maths Studio.
// All timestamps are stored as ISO strings so demo localStorage mirrors
// match what Firestore returns.

import type { CurriculumQuestion, ThreeDType } from '@/lib/grade8Curriculum';

export type AppRole = 'teacher' | 'student' | 'admin';

export type AppUser = {
  id: string;
  displayName: string;
  email?: string;
  role: AppRole;
  classIds: string[];
  createdAt: string;
};

export type ClassRoom = {
  id: string;
  name: string;
  grade: 'Grade 8';
  subject: 'Mathematics';
  teacherId: string;
  studentIds: string[];
  createdAt: string;
};

export type FirestoreAssignment = {
  id: string;
  classId: string;
  lessonId: string;
  questionId: string;
  title: string;
  lessonTitle: string;
  inquiryQuestion: string;
  objective: string;
  prompt: string;
  question: string;
  expectedAnswer: string;
  acceptedKeywords: string[];
  threeDType: ThreeDType;
  difficulty: CurriculumQuestion['difficulty'];
  dueDate?: string;
  status: 'draft' | 'assigned' | 'closed';
  createdBy: string;
  createdAt: string;
  updatedAt: string;
};

export type StudentResponse = {
  id: string;
  assignmentId: string;
  classId: string;
  studentId: string;
  answer: string;
  score: number;
  feedback: string;
  submittedAt: string;
};

export type GeneratedLesson = {
  id: string;
  title: string;
  subject: 'mathematics' | 'english' | 'science';
  /** Maths-only — the four IB MYP Year 3 strand buckets. */
  unit?: 'numerical' | 'abstract' | 'spatial' | 'data';
  strand: string;
  topic: string;
  inquiryQuestion: string;
  objectives: string[];
  studentExplanation: string;
  teacherNotes: string;
  animatedSteps: string[];
  /** Maths-only: the matching 3D scene id. */
  threeDType?: ThreeDType;
  /** English / Science: the matching interactive workshop id. */
  subjectInteractiveType?: string;
  workedExamples: Array<{ prompt: string; steps: string[]; answer: string }>;
  practiceQuestions: Array<{ question: string; answer: string; explanation: string }>;
  assignmentQuestions: Array<{
    question: string;
    expectedAnswer: string;
    acceptedKeywords: string[];
    rubric: string;
  }>;
  extensionChallenge: string;
  createdBy: string;
  source: 'ai' | 'manual' | 'upload';
  createdAt: string;
  /** Cloud Storage download URL when the lesson was generated from a teacher upload. */
  sourceUrl?: string;
  /** Original filename of the teacher upload (for display). */
  sourceFilename?: string;
};

export type LessonProgress = {
  id: string;
  studentId: string;
  lessonId: string;
  completedSteps: string[];
  lastOpenedAt: string;
  score?: number;
};

export const COLLECTIONS = {
  users: 'users',
  classes: 'classes',
  courses: 'courses',
  lessons: 'lessons',
  assignments: 'assignments',
  studentResponses: 'studentResponses',
  generatedLessons: 'generatedLessons',
  lessonProgress: 'lessonProgress',
} as const;
