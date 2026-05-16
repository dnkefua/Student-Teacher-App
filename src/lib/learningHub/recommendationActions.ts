// Action handlers that turn an AIRecommendation into something concrete.
// Each handler:
//   1. Saves a small "handoff" object in localStorage so the destination tab
//      can pick up the recommendation context (no prop drilling).
//   2. Optionally creates/updates an assignment.
//   3. Returns the navigation target so the caller can switch tabs.
// Recommendation status is updated through the repository so the audit log
// captures every accept/dismiss.

import { findQuestionById, grade8Curriculum } from '@/lib/grade8Curriculum';
import { assignDemoQuestion } from '@/lib/demoAssignments';
import { saveRecommendationAction } from './repository';
import type { AIRecommendation } from './types';
import type { TabType } from '@/components/Sidebar';

const HANDOFF_KEY = 'eis-learning-hub-recommendation-handoff';

export type RecommendationHandoff = {
  recommendation: AIRecommendation;
  intent: 'assign' | 'open_lesson' | 'classroom' | 'parent_email';
  createdAt: string;
};

function persistHandoff(handoff: RecommendationHandoff): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(HANDOFF_KEY, JSON.stringify(handoff));
}

export function readHandoff(): RecommendationHandoff | null {
  if (typeof window === 'undefined') return null;
  const raw = window.localStorage.getItem(HANDOFF_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as RecommendationHandoff;
  } catch {
    return null;
  }
}

export function clearHandoff(): void {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(HANDOFF_KEY);
}

function findCurriculumQuestionFor(rec: AIRecommendation): string | undefined {
  if (rec.suggestedThreeDType) {
    // Pick the first authored question that uses this 3D type.
    const direct = grade8Curriculum.find((q) => q.threeDType === rec.suggestedThreeDType);
    if (direct) return direct.id;
  }
  // Fall back to a keyword scan against the recommendation title.
  const haystack = `${rec.title} ${rec.explanation}`.toLowerCase();
  const match = grade8Curriculum.find((q) =>
    haystack.includes(q.topic.toLowerCase()) || haystack.includes(q.title.toLowerCase()),
  );
  return match?.id;
}

export async function assignInterventionFromRecommendation(rec: AIRecommendation): Promise<{ target: TabType; questionId?: string }> {
  const questionId = findCurriculumQuestionFor(rec) ?? grade8Curriculum[0].id;
  const question = findQuestionById(questionId);
  if (question) {
    await assignDemoQuestion(question.id);
  }
  persistHandoff({ recommendation: rec, intent: 'assign', createdAt: new Date().toISOString() });
  await saveRecommendationAction({ recommendation: rec, status: 'accepted' });
  return { target: 'dashboard', questionId };
}

export async function openThreeDLessonFromRecommendation(rec: AIRecommendation): Promise<{ target: TabType }> {
  const questionId = findCurriculumQuestionFor(rec);
  if (questionId) {
    await assignDemoQuestion(questionId);
  }
  persistHandoff({ recommendation: rec, intent: 'open_lesson', createdAt: new Date().toISOString() });
  await saveRecommendationAction({ recommendation: rec, status: 'accepted' });
  return { target: 'lesson' };
}

export async function sendRecommendationToClassroom(rec: AIRecommendation): Promise<{ target: TabType }> {
  const questionId = findCurriculumQuestionFor(rec);
  if (questionId) {
    await assignDemoQuestion(questionId);
  }
  persistHandoff({ recommendation: rec, intent: 'classroom', createdAt: new Date().toISOString() });
  await saveRecommendationAction({ recommendation: rec, status: 'accepted' });
  return { target: 'classroom' };
}

export async function draftParentUpdateFromRecommendation(rec: AIRecommendation): Promise<{ target: TabType }> {
  persistHandoff({ recommendation: rec, intent: 'parent_email', createdAt: new Date().toISOString() });
  await saveRecommendationAction({ recommendation: rec, status: 'accepted' });
  return { target: 'email' };
}

export async function dismissRecommendation(rec: AIRecommendation): Promise<void> {
  await saveRecommendationAction({ recommendation: rec, status: 'dismissed' });
}

export const RECOMMENDATION_HANDOFF_KEY = HANDOFF_KEY;
