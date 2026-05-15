// Input + output shapes for the structured AI flows. Server-only; the API
// routes parse JSON returned by Gemma 4 into these.

import type { CurriculumUnit, Difficulty, ThreeDType } from '@/lib/grade8Curriculum';

/* ─── generate-lesson ────────────────────────────────────────────── */

export type GenerateLessonInput = {
  topic: string;
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
  unit: CurriculumUnit;
  strand: string;
  topic: string;
  inquiryQuestion: string;
  objectives: string[];
  studentExplanation: string;
  teacherNotes: string;
  animatedSteps: string[];
  threeDType: ThreeDType;
  workedExamples: GeneratedWorkedExample[];
  practiceQuestions: GeneratedPracticeQuestion[];
  assignmentQuestions: GeneratedAssignmentQuestion[];
  extensionChallenge: string;
};

/* ─── generate-assignment ────────────────────────────────────────── */

export type GenerateAssignmentInput = {
  topic: string;
  unit?: CurriculumUnit;
  difficulty?: Difficulty;
  /** How many questions to generate (default 3, max 6). */
  count?: number;
  inquiryQuestion?: string;
};

export type GenerateAssignmentOutput = {
  topic: string;
  difficulty: Difficulty;
  threeDType: ThreeDType;
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
  conceptHint?: string;
};

export type Generated3DScene = {
  threeDType: ThreeDType;
  rationale: string;
  /** Step-by-step narration aligned with the chosen 3D scene. */
  animatedSteps: string[];
};

/* ─── envelope ───────────────────────────────────────────────────── */

export type AIFlowResponse<T> = {
  data: T;
  /** Where the response actually came from. `mock` = AI demo mode. */
  source: 'ai' | 'mock';
  modelId?: string;
};
