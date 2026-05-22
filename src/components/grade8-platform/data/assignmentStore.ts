/**
 * Lightweight localStorage-backed assignment store for the grade8 platform.
 *
 * Keeps the demo end-to-end without requiring Firestore. When the school is
 * ready to ship for real students this becomes the seam to swap in
 * Firestore writes — the public API stays the same.
 *
 * Listeners are notified via a single CustomEvent so multiple panels stay
 * in sync without a global state library.
 */

import type { SubjectId, UnitId } from '../types';

const STORAGE_KEY = 'eis-g8-assignments-v1';
const EVENT_NAME = 'eis-g8-assignments-changed';

export type AssignmentKind = 'exercise' | 'exam' | 'reading';

export type AssignmentItem = {
  /** Stable id of the exercise / exam question being referenced. */
  refId: string;
  /** Short summary so the student sees what they're attempting. */
  label: string;
};

export type Assignment = {
  id: string;
  title: string;
  kind: AssignmentKind;
  subject: SubjectId;
  unit: UnitId;
  /** Items the student must complete. */
  items: AssignmentItem[];
  /** ISO date string. */
  dueAt: string;
  createdAt: string;
  createdBy: string;
  /** Optional instructions or note from the teacher. */
  notes?: string;
};

export type Submission = {
  assignmentId: string;
  studentId: string;
  submittedAt: string;
  /** Map of refId → student answer (free text). */
  answers: Record<string, string>;
  /** Computed locally — naive completion percent (answers present ÷ items). */
  completionPercent: number;
};

type Store = {
  assignments: Assignment[];
  submissions: Submission[];
};

const emptyStore: Store = { assignments: [], submissions: [] };

function read(): Store {
  if (typeof window === 'undefined') return emptyStore;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyStore;
    const parsed = JSON.parse(raw) as Partial<Store>;
    return {
      assignments: Array.isArray(parsed.assignments) ? parsed.assignments : [],
      submissions: Array.isArray(parsed.submissions) ? parsed.submissions : [],
    };
  } catch {
    return emptyStore;
  }
}

function write(store: Store) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  window.dispatchEvent(new CustomEvent(EVENT_NAME));
}

export function listAssignments(): Assignment[] {
  return read().assignments;
}

export function listAssignmentsForStudent(): Assignment[] {
  // Every assignment is visible to every demo student — keeps things
  // simple. Real-life scoping would join through a class/roster table.
  return read().assignments.slice().sort((a, b) => a.dueAt.localeCompare(b.dueAt));
}

export function createAssignment(input: Omit<Assignment, 'id' | 'createdAt'> & { id?: string }): Assignment {
  const store = read();
  const assignment: Assignment = {
    ...input,
    id: input.id ?? `assignment-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    createdAt: new Date().toISOString(),
  };
  store.assignments = [assignment, ...store.assignments];
  write(store);
  return assignment;
}

export function deleteAssignment(id: string) {
  const store = read();
  store.assignments = store.assignments.filter((a) => a.id !== id);
  store.submissions = store.submissions.filter((s) => s.assignmentId !== id);
  write(store);
}

export function submitAssignment(submission: Submission) {
  const store = read();
  store.submissions = [
    submission,
    ...store.submissions.filter(
      (s) => !(s.assignmentId === submission.assignmentId && s.studentId === submission.studentId),
    ),
  ];
  write(store);
}

export function getSubmission(assignmentId: string, studentId: string): Submission | undefined {
  return read().submissions.find(
    (s) => s.assignmentId === assignmentId && s.studentId === studentId,
  );
}

export function listSubmissionsForAssignment(assignmentId: string): Submission[] {
  return read().submissions.filter((s) => s.assignmentId === assignmentId);
}

export function subscribe(listener: () => void): () => void {
  if (typeof window === 'undefined') return () => undefined;
  const handler = () => listener();
  window.addEventListener(EVENT_NAME, handler);
  window.addEventListener('storage', handler);
  return () => {
    window.removeEventListener(EVENT_NAME, handler);
    window.removeEventListener('storage', handler);
  };
}
