'use client';

import { collection, doc, getDocs, limit, orderBy, query, serverTimestamp, setDoc, updateDoc, where, type QueryConstraint } from 'firebase/firestore';
import { getDb, isFirebaseConfigured } from '@/lib/firebase/client';
import { getDemoUserId } from '@/lib/firebase/demoUser';
import type { CinematicAsset, CinematicLessonRecord, CinematicLessonSpec, HeyGenLessonVideoSpec, SubjectId } from './types';

const ASSET_STORAGE_KEY = 'eis-cinematic-assets';
const LESSON_STORAGE_KEY = 'eis-cinematic-lessons';
const COLL = {
  assets: 'cinematicAssets',
  lessons: 'cinematicLessons',
} as const;

function canUseStorage(): boolean {
  return typeof window !== 'undefined' && Boolean(window.localStorage);
}

function read<T>(key: string): T[] {
  if (!canUseStorage()) return [];
  try {
    const raw = window.localStorage.getItem(key);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? (parsed as T[]) : [];
  } catch {
    return [];
  }
}

function write<T>(key: string, value: T[], eventName: string): void {
  if (!canUseStorage()) return;
  window.localStorage.setItem(key, JSON.stringify(value.slice(0, 200)));
  window.dispatchEvent(new CustomEvent(eventName));
}

function id(prefix: string): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return `${prefix}-${crypto.randomUUID().split('-')[0]}`;
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function createMockHeyGenAsset(input: {
  lessonId: string;
  subject: SubjectId;
  title: string;
  script: string;
  purpose?: HeyGenLessonVideoSpec['videoPurpose'];
  providerId?: string;
  videoUrl?: string | null;
  status?: CinematicAsset['status'];
}): CinematicAsset {
  const assetType =
    input.purpose === 'recap'
      ? 'heygen_recap_video'
      : input.purpose === 'parent_summary'
        ? 'heygen_parent_summary'
        : 'heygen_intro_video';
  const now = new Date().toISOString();
  return {
    id: id('asset'),
    lessonId: input.lessonId,
    subject: input.subject,
    assetType,
    status: input.status ?? 'demo',
    title: input.title,
    script: input.script,
    videoUrl: input.videoUrl ?? undefined,
    provider: input.status === 'ready' || input.status === 'queued' || input.status === 'processing' ? 'heygen' : 'mock',
    providerId: input.providerId ?? 'mock-heygen-video',
    createdAt: now,
    updatedAt: now,
  };
}

function localSaveAsset(asset: CinematicAsset): CinematicAsset {
  const existing = read<CinematicAsset>(ASSET_STORAGE_KEY);
  const current = existing.find((a) => a.id === asset.id);
  const assets = existing.filter((a) => a.id !== asset.id);
  const next = { ...asset, createdAt: current?.createdAt ?? asset.createdAt, updatedAt: new Date().toISOString() };
  write(ASSET_STORAGE_KEY, [next, ...assets], 'eis-cinematic-assets-changed');
  return next;
}

function localSaveLesson(record: CinematicLessonRecord): CinematicLessonRecord {
  const existing = read<CinematicLessonRecord>(LESSON_STORAGE_KEY);
  const current = existing.find((lesson) => lesson.id === record.id);
  const lessons = existing.filter((lesson) => lesson.id !== record.id);
  const next = { ...record, createdAt: current?.createdAt ?? record.createdAt, updatedAt: new Date().toISOString() };
  write(LESSON_STORAGE_KEY, [next, ...lessons], 'eis-cinematic-lessons-changed');
  return next;
}

export async function saveCinematicAsset(asset: CinematicAsset): Promise<CinematicAsset> {
  const next = localSaveAsset(asset);
  const db = isFirebaseConfigured() ? getDb() : null;
  if (db) {
    try {
      await setDoc(doc(db, COLL.assets, next.id), { ...next, _updatedAt: serverTimestamp() });
    } catch (err) {
      console.warn('[cinematic assets] Firestore save failed; local fallback retained.', err);
    }
  }
  return next;
}

export async function listAssetsForLesson(lessonId: string): Promise<CinematicAsset[]> {
  const local = read<CinematicAsset>(ASSET_STORAGE_KEY).filter((asset) => asset.lessonId === lessonId);
  const db = isFirebaseConfigured() ? getDb() : null;
  if (!db) return local;
  try {
    const snap = await getDocs(query(collection(db, COLL.assets), where('lessonId', '==', lessonId), limit(50)));
    const remote = snap.docs.map((d) => d.data() as CinematicAsset);
    return remote.length > 0 ? remote.sort((a, b) => b.createdAt.localeCompare(a.createdAt)) : local;
  } catch (err) {
    console.warn('[cinematic assets] Firestore list failed; using local fallback.', err);
    return local;
  }
}

export async function updateCinematicAssetStatus(
  assetId: string,
  patch: Partial<Pick<CinematicAsset, 'status' | 'videoUrl' | 'thumbnailUrl' | 'providerId'>>,
): Promise<CinematicAsset | null> {
  const assets = read<CinematicAsset>(ASSET_STORAGE_KEY);
  const current = assets.find((asset) => asset.id === assetId);
  const next = current ? localSaveAsset({ ...current, ...patch }) : null;
  const db = isFirebaseConfigured() ? getDb() : null;
  if (db) {
    try {
      await updateDoc(doc(db, COLL.assets, assetId), { ...patch, updatedAt: new Date().toISOString(), _updatedAt: serverTimestamp() });
    } catch (err) {
      console.warn('[cinematic assets] Firestore status update failed; local fallback retained.', err);
    }
  }
  return next;
}

export async function saveCinematicLessonSpec(input: {
  spec: CinematicLessonSpec;
  source: CinematicLessonRecord['source'];
  createdBy?: string;
}): Promise<CinematicLessonRecord> {
  const now = new Date().toISOString();
  const record: CinematicLessonRecord = {
    id: input.spec.id,
    spec: input.spec,
    subject: input.spec.subject,
    title: input.spec.title,
    topic: input.spec.topic,
    createdBy: input.createdBy ?? getDemoUserId('teacher'),
    source: input.source,
    createdAt: now,
    updatedAt: now,
  };
  const next = localSaveLesson(record);
  const db = isFirebaseConfigured() ? getDb() : null;
  if (db) {
    try {
      await setDoc(doc(db, COLL.lessons, next.id), { ...next, _updatedAt: serverTimestamp() });
    } catch (err) {
      console.warn('[cinematic lessons] Firestore save failed; local fallback retained.', err);
    }
  }
  return next;
}

export async function listCinematicLessonSpecs(options: { subject?: SubjectId; limitCount?: number } = {}): Promise<CinematicLessonRecord[]> {
  const local = read<CinematicLessonRecord>(LESSON_STORAGE_KEY);
  const db = isFirebaseConfigured() ? getDb() : null;
  if (!db) return options.subject ? local.filter((lesson) => lesson.subject === options.subject) : local;
  try {
    const constraints: QueryConstraint[] = [];
    if (options.subject) constraints.push(where('subject', '==', options.subject));
    constraints.push(orderBy('updatedAt', 'desc'), limit(options.limitCount ?? 25));
    const snap = await getDocs(query(collection(db, COLL.lessons), ...constraints));
    const remote = snap.docs.map((d) => d.data() as CinematicLessonRecord);
    return remote.length > 0 ? remote : local;
  } catch (err) {
    console.warn('[cinematic lessons] Firestore list failed; using local fallback.', err);
    return options.subject ? local.filter((lesson) => lesson.subject === options.subject) : local;
  }
}

export const CINEMATIC_ASSET_STORAGE_KEY = ASSET_STORAGE_KEY;
export const CINEMATIC_LESSON_STORAGE_KEY = LESSON_STORAGE_KEY;
export const CINEMATIC_COLLECTIONS = COLL;
