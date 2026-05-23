/**
 * Hybrid assignment store for the grade8 platform.
 *
 * • When Firebase is configured (env vars present), reads / writes go to
 *   Firestore so assignments persist across devices and students. A pair
 *   of onSnapshot listeners keeps an in-memory cache up to date for
 *   synchronous reads (which useSyncExternalStore requires).
 * • When Firebase isn't configured, falls back to localStorage so the
 *   demo continues to work end-to-end with no extra setup.
 *
 * The public API is unchanged from the original localStorage-only store
 * so every caller (AssignmentManager, QuickAssignButton, StudentDashboard,
 * StudentSubjectHome) keeps working without modification.
 */

import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  setDoc,
  type Unsubscribe,
} from 'firebase/firestore';
import { getDb, isFirebaseConfigured } from '@/lib/firebase/client';
import type { SubjectId, UnitId } from '../types';

const STORAGE_KEY = 'eis-g8-assignments-v1';
const EVENT_NAME = 'eis-g8-assignments-changed';
const FS_ASSIGNMENTS = 'eis-g8-assignments';
const FS_SUBMISSIONS = 'eis-g8-submissions';

export type AssignmentKind = 'exercise' | 'exam' | 'reading';

export type AssignmentItem = {
  refId: string;
  label: string;
};

export type Assignment = {
  id: string;
  title: string;
  kind: AssignmentKind;
  subject: SubjectId;
  unit: UnitId;
  items: AssignmentItem[];
  /** ISO date string. */
  dueAt: string;
  createdAt: string;
  createdBy: string;
  notes?: string;
};

export type Submission = {
  assignmentId: string;
  studentId: string;
  submittedAt: string;
  answers: Record<string, string>;
  completionPercent: number;
};

type Store = {
  assignments: Assignment[];
  submissions: Submission[];
};

const emptyStore: Store = { assignments: [], submissions: [] };

// ── Backend selection ────────────────────────────────────────────────

function useFirestore(): boolean {
  return typeof window !== 'undefined' && isFirebaseConfigured();
}

// ── In-memory cache (so synchronous reads work for both backends) ─────

let cache: Store = emptyStore;

function emitChange() {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent(EVENT_NAME));
}

// ── localStorage helpers (used as cache seed AND as the fallback path) ─

function readLocal(): Store {
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

function writeLocal(store: Store) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  cache = store;
  emitChange();
}

// ── Firestore live subscription ──────────────────────────────────────

let fsSubscribersAttached = false;
let fsUnsubA: Unsubscribe | null = null;
let fsUnsubS: Unsubscribe | null = null;

/**
 * Lazily attach Firestore onSnapshot listeners the first time the store
 * is touched on the client. Both collections feed the same in-memory
 * cache so readers see consistent state.
 */
function ensureFirestoreSubscribed() {
  if (!useFirestore() || fsSubscribersAttached) return;
  const db = getDb();
  if (!db) return;
  fsSubscribersAttached = true;

  // Seed with whatever was last in localStorage so the UI has something
  // to render between page-load and the first snapshot.
  cache = readLocal();

  fsUnsubA = onSnapshot(collection(db, FS_ASSIGNMENTS), (snap) => {
    const next = snap.docs.map((d) => d.data() as Assignment);
    cache = { ...cache, assignments: next };
    // Mirror to localStorage so a momentarily-offline reload still works.
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cache));
    } catch {
      /* ignore */
    }
    emitChange();
  });

  fsUnsubS = onSnapshot(collection(db, FS_SUBMISSIONS), (snap) => {
    const next = snap.docs.map((d) => d.data() as Submission);
    cache = { ...cache, submissions: next };
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cache));
    } catch {
      /* ignore */
    }
    emitChange();
  });
}

// On the client, also seed cache from localStorage immediately for the
// localStorage-only path.
if (typeof window !== 'undefined') {
  cache = readLocal();
  if (useFirestore()) ensureFirestoreSubscribed();
}

// ── Public API ───────────────────────────────────────────────────────

export function listAssignments(): Assignment[] {
  ensureFirestoreSubscribed();
  return cache.assignments;
}

export function listAssignmentsForStudent(): Assignment[] {
  ensureFirestoreSubscribed();
  return cache.assignments.slice().sort((a, b) => a.dueAt.localeCompare(b.dueAt));
}

export function createAssignment(
  input: Omit<Assignment, 'id' | 'createdAt'> & { id?: string },
): Assignment {
  const assignment: Assignment = {
    ...input,
    id: input.id ?? `assignment-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    createdAt: new Date().toISOString(),
  };
  if (useFirestore()) {
    const db = getDb();
    if (db) {
      void setDoc(doc(db, FS_ASSIGNMENTS, assignment.id), assignment);
      // Optimistic in-memory update so the UI doesn't wait for the
      // round-trip; the onSnapshot listener will reconcile on the next tick.
      cache = { ...cache, assignments: [assignment, ...cache.assignments] };
      emitChange();
      return assignment;
    }
  }
  // localStorage fallback
  const store = readLocal();
  store.assignments = [assignment, ...store.assignments];
  writeLocal(store);
  return assignment;
}

export function deleteAssignment(id: string) {
  if (useFirestore()) {
    const db = getDb();
    if (db) {
      void deleteDoc(doc(db, FS_ASSIGNMENTS, id));
      // Also drop any submissions for this assignment.
      cache.submissions
        .filter((s) => s.assignmentId === id)
        .forEach((s) => {
          void deleteDoc(doc(db, FS_SUBMISSIONS, `${s.assignmentId}__${s.studentId}`));
        });
      cache = {
        assignments: cache.assignments.filter((a) => a.id !== id),
        submissions: cache.submissions.filter((s) => s.assignmentId !== id),
      };
      emitChange();
      return;
    }
  }
  const store = readLocal();
  store.assignments = store.assignments.filter((a) => a.id !== id);
  store.submissions = store.submissions.filter((s) => s.assignmentId !== id);
  writeLocal(store);
}

export function submitAssignment(submission: Submission) {
  if (useFirestore()) {
    const db = getDb();
    if (db) {
      // Composite-key the submission so re-submitting overwrites the same doc.
      const key = `${submission.assignmentId}__${submission.studentId}`;
      void setDoc(doc(db, FS_SUBMISSIONS, key), submission);
      cache = {
        ...cache,
        submissions: [
          submission,
          ...cache.submissions.filter(
            (s) => !(s.assignmentId === submission.assignmentId && s.studentId === submission.studentId),
          ),
        ],
      };
      emitChange();
      return;
    }
  }
  const store = readLocal();
  store.submissions = [
    submission,
    ...store.submissions.filter(
      (s) => !(s.assignmentId === submission.assignmentId && s.studentId === submission.studentId),
    ),
  ];
  writeLocal(store);
}

export function getSubmission(assignmentId: string, studentId: string): Submission | undefined {
  ensureFirestoreSubscribed();
  return cache.submissions.find(
    (s) => s.assignmentId === assignmentId && s.studentId === studentId,
  );
}

export function listSubmissionsForAssignment(assignmentId: string): Submission[] {
  ensureFirestoreSubscribed();
  return cache.submissions.filter((s) => s.assignmentId === assignmentId);
}

export function subscribe(listener: () => void): () => void {
  if (typeof window === 'undefined') return () => undefined;
  ensureFirestoreSubscribed();
  const handler = () => listener();
  window.addEventListener(EVENT_NAME, handler);
  window.addEventListener('storage', handler);
  return () => {
    window.removeEventListener(EVENT_NAME, handler);
    window.removeEventListener('storage', handler);
  };
}

/**
 * Tear down the Firestore subscriptions — useful for tests or when
 * the user signs out. Safe to call when nothing is attached.
 */
export function disposeFirestoreSubscriptions() {
  if (fsUnsubA) {
    fsUnsubA();
    fsUnsubA = null;
  }
  if (fsUnsubS) {
    fsUnsubS();
    fsUnsubS = null;
  }
  fsSubscribersAttached = false;
}
