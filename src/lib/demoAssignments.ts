import {
  checkAnswer,
  findQuestionById,
  grade8Curriculum,
  type CurriculumQuestion,
  type ThreeDType,
} from './grade8Curriculum';
import {
  createAssignment as firestoreCreateAssignment,
  createDemoClass,
  getOrCreateDemoUser,
  submitStudentResponse,
} from './firebase/firestore';
import { isFirebaseConfigured } from './firebase/client';

export type LearningMode = 'teacher' | 'student';

export type DemoSubmission = {
  answer: string;
  feedback: string;
  score: number;
  submittedAt: string;
};

export type DemoAssignment = {
  id: string;
  questionId: string;
  title: string;
  lessonTitle: string;
  inquiryQuestion: string;
  objective: string;
  question: string;
  prompt: string;
  expectedAnswer: string;
  teacherNote: string;
  threeDType: ThreeDType;
  difficulty: CurriculumQuestion['difficulty'];
  status: 'draft' | 'assigned' | 'submitted';
  createdAt: string;
  submission?: DemoSubmission;
  /** When true, the canonical record lives in Firestore (id matches the Firestore doc). */
  firestoreBacked?: boolean;
};

const ASSIGNMENT_KEY = 'eis-demo-assignment-v3';
const LEGACY_KEYS = ['eis-demo-assignment-v2', 'eis-demo-assignment-v1'];

const defaultQuestion = grade8Curriculum[0];

function buildAssignment(
  question: CurriculumQuestion,
  status: DemoAssignment['status'] = 'assigned',
  overrideId?: string,
): DemoAssignment {
  return {
    id: overrideId ?? `${question.id}-${Date.now()}`,
    questionId: question.id,
    title: question.title,
    lessonTitle: `${question.unitLabel} · ${question.topic}`,
    inquiryQuestion: question.inquiryQuestion,
    objective: question.objective,
    question: question.question,
    prompt: question.prompt,
    expectedAnswer: question.expectedAnswer,
    teacherNote: question.teacherNote,
    threeDType: question.threeDType,
    difficulty: question.difficulty,
    status,
    createdAt: new Date().toISOString(),
  };
}

export const defaultDemoAssignment: DemoAssignment = buildAssignment(defaultQuestion);

function canUseStorage() {
  return typeof window !== 'undefined' && Boolean(window.localStorage);
}

export function loadDemoAssignment(): DemoAssignment {
  if (!canUseStorage()) return defaultDemoAssignment;

  let stored = window.localStorage.getItem(ASSIGNMENT_KEY);
  if (!stored) {
    for (const legacy of LEGACY_KEYS) {
      const value = window.localStorage.getItem(legacy);
      if (value) {
        stored = value;
        break;
      }
    }
  }
  if (!stored) return defaultDemoAssignment;

  try {
    const parsed = JSON.parse(stored) as Partial<DemoAssignment>;
    const question = (parsed.questionId && findQuestionById(parsed.questionId)) || defaultQuestion;
    return {
      ...buildAssignment(question, (parsed.status as DemoAssignment['status']) ?? 'assigned'),
      ...parsed,
      questionId: question.id,
      threeDType: question.threeDType,
      inquiryQuestion: question.inquiryQuestion,
      objective: question.objective,
      difficulty: question.difficulty,
    } as DemoAssignment;
  } catch {
    return defaultDemoAssignment;
  }
}

export function saveDemoAssignment(assignment: DemoAssignment) {
  if (!canUseStorage()) return;
  window.localStorage.setItem(ASSIGNMENT_KEY, JSON.stringify(assignment));
  window.dispatchEvent(new CustomEvent('eis-demo-assignment', { detail: assignment }));
}

/**
 * Returns true when Firestore writes are happening. Caller can use this
 * to decide whether to show a "Demo mode: Firestore not configured" banner.
 */
export function isFirestoreBacked(): boolean {
  return isFirebaseConfigured();
}

export async function assignDemoQuestion(questionId?: string): Promise<DemoAssignment> {
  const question = (questionId && findQuestionById(questionId)) || defaultQuestion;

  if (isFirebaseConfigured()) {
    try {
      // Make sure the demo class + users exist before writing the assignment.
      await Promise.all([createDemoClass(), getOrCreateDemoUser('teacher')]);
      const fs = await firestoreCreateAssignment(question);
      if (fs) {
        const assignment: DemoAssignment = {
          ...buildAssignment(question, 'assigned', fs.id),
          firestoreBacked: true,
        };
        saveDemoAssignment(assignment);
        return assignment;
      }
    } catch (err) {
      console.warn('[demoAssignments] Firestore createAssignment failed; falling back to localStorage.', err);
    }
  }

  const assignment = buildAssignment(question, 'assigned');
  saveDemoAssignment(assignment);
  return assignment;
}

export async function submitDemoAnswer(answer: string): Promise<DemoAssignment> {
  const assignment = loadDemoAssignment();
  const question = findQuestionById(assignment.questionId) ?? defaultQuestion;
  const isCorrect = checkAnswer(question, answer);

  const submission: DemoSubmission = {
    answer,
    score: isCorrect ? 100 : 62,
    submittedAt: new Date().toISOString(),
    feedback: isCorrect ? question.correctFeedback : question.partialFeedback,
  };

  if (assignment.firestoreBacked && isFirebaseConfigured()) {
    try {
      await Promise.all([createDemoClass(), getOrCreateDemoUser('student')]);
      await submitStudentResponse({
        assignmentId: assignment.id,
        answer: submission.answer,
        score: submission.score,
        feedback: submission.feedback,
      });
    } catch (err) {
      console.warn('[demoAssignments] Firestore submitStudentResponse failed; keeping localStorage copy.', err);
    }
  }

  const next: DemoAssignment = {
    ...assignment,
    status: 'submitted',
    submission,
  };

  saveDemoAssignment(next);
  return next;
}
