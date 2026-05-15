// Stable per-role demo user IDs cached in localStorage so the EIS demo
// flow keeps working without real auth. Real auth (Firebase Auth) can be
// layered on later by replacing the call sites in firestore.ts.

import type { AppRole } from './types';

const KEYS: Record<AppRole, string> = {
  teacher: 'eis-demo-teacher-id',
  student: 'eis-demo-student-id',
  admin: 'eis-demo-admin-id',
};

const DEMO_CLASS_ID = 'demo-class-eis-g8';

function randomId(prefix: string): string {
  const seed = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  return `${prefix}-${seed.split('-')[0]}`;
}

export function getDemoUserId(role: AppRole): string {
  if (typeof window === 'undefined') return `${role}-server`;
  const key = KEYS[role];
  const existing = window.localStorage.getItem(key);
  if (existing) return existing;
  const next = randomId(role === 'teacher' ? 'teacher-demo' : role === 'student' ? 'student-demo' : 'admin-demo');
  window.localStorage.setItem(key, next);
  return next;
}

export function getDemoClassId(): string {
  return DEMO_CLASS_ID;
}

export function demoDisplayName(role: AppRole): string {
  if (role === 'teacher') return 'Demo Teacher';
  if (role === 'student') return 'Demo Student';
  return 'Demo Admin';
}
