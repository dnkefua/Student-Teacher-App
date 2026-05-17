'use client';

import type { CinematicAsset, HeyGenLessonVideoSpec, SubjectId } from './types';

const STORAGE_KEY = 'eis-cinematic-assets';

function canUseStorage(): boolean {
  return typeof window !== 'undefined' && Boolean(window.localStorage);
}

function readAssets(): CinematicAsset[] {
  if (!canUseStorage()) return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? (parsed as CinematicAsset[]) : [];
  } catch {
    return [];
  }
}

function writeAssets(assets: CinematicAsset[]): void {
  if (!canUseStorage()) return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(assets.slice(0, 200)));
  window.dispatchEvent(new CustomEvent('eis-cinematic-assets-changed'));
}

function id(prefix: string): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return `${prefix}-${crypto.randomUUID().split('-')[0]}`;
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function saveCinematicAsset(asset: CinematicAsset): CinematicAsset {
  const assets = readAssets().filter((a) => a.id !== asset.id);
  const next = { ...asset, updatedAt: new Date().toISOString() };
  writeAssets([next, ...assets]);
  return next;
}

export function listAssetsForLesson(lessonId: string): CinematicAsset[] {
  return readAssets().filter((asset) => asset.lessonId === lessonId);
}

export function updateCinematicAssetStatus(
  assetId: string,
  patch: Partial<Pick<CinematicAsset, 'status' | 'videoUrl' | 'thumbnailUrl' | 'providerId'>>,
): CinematicAsset | null {
  const assets = readAssets();
  const current = assets.find((asset) => asset.id === assetId);
  if (!current) return null;
  const next = { ...current, ...patch, updatedAt: new Date().toISOString() };
  writeAssets([next, ...assets.filter((asset) => asset.id !== assetId)]);
  return next;
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

export const CINEMATIC_ASSET_STORAGE_KEY = STORAGE_KEY;
