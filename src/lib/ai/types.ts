// Input + output shapes for the structured AI flows. Server-only; the API
// routes parse JSON returned by Gemma 4 into these.

import type { CurriculumUnit, Difficulty, ThreeDType } from '@/lib/grade8Curriculum';
import type { SubjectId } from '@/lib/subjects/types';

/* ─── generate-lesson ────────────────────────────────────────────── */

export type GenerateLessonInput = {
  topic: string;
  /** Subject the lesson is for. Defaults to 'mathematics' on the server. */
  subject?: SubjectId;
  unit?: CurriculumUnit;
  strand?: string;
  /** Optional teacher context (e.g. uploaded text). */
  context?: string;
};

export type GeneratedWorkedExample = {
  prompt: string;
  steps: string[];
  answer: string;
};

export type GeneratedPracticeQuestion = {
  question: string;
  answer: string;
  explanation: string;
};

export type GeneratedAssignmentQuestion = {
  question: string;
  expectedAnswer: string;
  acceptedKeywords: string[];
  rubric: string;
};

export type GeneratedLesson = {
  title: string;
  subject: SubjectId;
  /** Maths-only — the IB MYP Year 3 strand bucket. */
  unit?: CurriculumUnit;
  strand: string;
  topic: string;
  inquiryQuestion: string;
  objectives: string[];
  studentExplanation: string;
  teacherNotes: string;
  animatedSteps: string[];
  /** Maths-only: the matching 3D scene id. */
  threeDType?: ThreeDType;
  /** English / Science: the matching interactive workshop id (e.g. 'cell_3d', 'essay_planner'). */
  subjectInteractiveType?: string;
  workedExamples: GeneratedWorkedExample[];
  practiceQuestions: GeneratedPracticeQuestion[];
  assignmentQuestions: GeneratedAssignmentQuestion[];
  extensionChallenge: string;
};

/* ─── generate-assignment ────────────────────────────────────────── */

export type GenerateAssignmentInput = {
  topic: string;
  subject?: SubjectId;
  unit?: CurriculumUnit;
  difficulty?: Difficulty;
  /** How many questions to generate (default 3, max 6). */
  count?: number;
  inquiryQuestion?: string;
};

export type GenerateAssignmentOutput = {
  topic: string;
  subject: SubjectId;
  difficulty: Difficulty;
  /** Maths-only. */
  threeDType?: ThreeDType;
  /** English / Science. */
  subjectInteractiveType?: string;
  questions: GeneratedAssignmentQuestion[];
};

/* ─── grade-answer ───────────────────────────────────────────────── */

export type GradeAnswerInput = {
  question: string;
  expectedAnswer: string;
  acceptedKeywords?: string[];
  studentAnswer: string;
  rubric?: string;
};

export type GradedAnswer = {
  score: number;
  feedback: string;
  strengths: string[];
  misconceptions: string[];
  nextStep: string;
};

/* ─── generate-3d-scene ──────────────────────────────────────────── */

export type Generate3DSceneInput = {
  topic: string;
  subject?: SubjectId;
  conceptHint?: string;
};

export type Generated3DScene = {
  subject: SubjectId;
  /** Maths-only. */
  threeDType?: ThreeDType;
  /** English / Science. */
  subjectInteractiveType?: string;
  rationale: string;
  /** Step-by-step narration aligned with the chosen scene/workshop. */
  animatedSteps: string[];
};

/* ─── envelope ───────────────────────────────────────────────────── */

export type AIFlowResponse<T> = {
  data: T;
  /** Where the response actually came from. `mock` = AI demo mode. */
  source: 'ai' | 'mock';
  modelId?: string;
};
