import { checkAnswer, findQuestionById, grade8Curriculum, type CurriculumQuestion } from './grade8Curriculum';

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
  question: string;
  prompt: string;
  expectedAnswer: string;
  teacherNote: string;
  status: 'draft' | 'assigned' | 'submitted';
  createdAt: string;
  submission?: DemoSubmission;
};

const ASSIGNMENT_KEY = 'eis-demo-assignment-v2';
const LEGACY_KEY = 'eis-demo-assignment-v1';

const defaultQuestion = grade8Curriculum[0];

function buildAssignment(question: CurriculumQuestion, status: DemoAssignment['status'] = 'assigned'): DemoAssignment {
  return {
    id: `${question.id}-${Date.now()}`,
    questionId: question.id,
    title: question.title,
    lessonTitle: `${question.unitLabel} · ${question.topic}`,
    question: question.question,
    prompt: question.prompt,
    expectedAnswer: question.expectedAnswer,
    teacherNote: question.teacherNote,
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

  const stored = window.localStorage.getItem(ASSIGNMENT_KEY) ?? window.localStorage.getItem(LEGACY_KEY);
  if (!stored) return defaultDemoAssignment;

  try {
    const parsed = JSON.parse(stored) as Partial<DemoAssignment>;
    const question = (parsed.questionId && findQuestionById(parsed.questionId)) || defaultQuestion;
    return {
      ...buildAssignment(question, (parsed.status as DemoAssignment['status']) ?? 'assigned'),
      ...parsed,
      questionId: question.id,
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

export function assignDemoQuestion(questionId?: string): DemoAssignment {
  const question = (questionId && findQuestionById(questionId)) || defaultQuestion;
  const assignment = buildAssignment(question, 'assigned');
  saveDemoAssignment(assignment);
  return assignment;
}

export function submitDemoAnswer(answer: string): DemoAssignment {
  const assignment = loadDemoAssignment();
  const question = findQuestionById(assignment.questionId) ?? defaultQuestion;
  const isCorrect = checkAnswer(question, answer);

  const submission: DemoSubmission = {
    answer,
    score: isCorrect ? 100 : 62,
    submittedAt: new Date().toISOString(),
    feedback: isCorrect ? question.correctFeedback : question.partialFeedback,
  };

  const next: DemoAssignment = {
    ...assignment,
    status: 'submitted',
    submission,
  };

  saveDemoAssignment(next);
  return next;
}
