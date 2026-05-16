// Cross-subject "what is the teacher teaching right now" store.
//
// Separate from `demoAssignments` (which remains maths-only) so we can
// represent an active English or Science lesson without disturbing the
// existing maths assignment flow. Components that want to display "the
// current lesson, regardless of subject" subscribe here.

import type { SubjectLesson } from './subjects/types';

const STORAGE_KEY = 'eis-active-subject-lesson-v1';
const EVENT_NAME = 'eis-active-subject-lesson';

export type ActiveSubjectLessonDetail = SubjectLesson | null;

function canUseStorage() {
  return typeof window !== 'undefined' && Boolean(window.localStorage);
}

export function loadActiveSubjectLesson(): SubjectLesson | null {
  if (!canUseStorage()) return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as SubjectLesson;
  } catch {
    return null;
  }
}

export function setActiveSubjectLesson(lesson: SubjectLesson | null) {
  if (!canUseStorage()) return;
  if (lesson) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lesson));
  } else {
    window.localStorage.removeItem(STORAGE_KEY);
  }
  window.dispatchEvent(new CustomEvent<ActiveSubjectLessonDetail>(EVENT_NAME, { detail: lesson }));
}

export function subscribeActiveSubjectLesson(callback: () => void): () => void {
  if (typeof window === 'undefined') return () => undefined;
  const onChange = () => callback();
  window.addEventListener(EVENT_NAME, onChange);
  window.addEventListener('storage', onChange);
  return () => {
    window.removeEventListener(EVENT_NAME, onChange);
    window.removeEventListener('storage', onChange);
  };
}
