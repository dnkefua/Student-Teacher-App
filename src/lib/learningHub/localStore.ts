// localStorage persistence for the Learning Data Hub. Used as the demo path
// AND as the offline fallback when Firebase isn't configured. Same shape as
// the Firestore helpers so consumers can switch later.

import type {
  AIRecommendation,
  ExternalImport,
  LearningEvent,
  PlatformConnection,
  PlatformStudentMapping,
} from './types';

const KEYS = {
  connections: 'eis-learning-hub-connections',
  imports: 'eis-learning-hub-imports',
  events: 'eis-learning-hub-events',
  mappings: 'eis-learning-hub-mappings',
  recommendations: 'eis-learning-hub-recommendations',
  demoLoaded: 'eis-learning-hub-demo-loaded',
} as const;

function canUseStorage(): boolean {
  return typeof window !== 'undefined' && Boolean(window.localStorage);
}

function read<T>(key: string, fallback: T[]): T[] {
  if (!canUseStorage()) return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as T[]) : fallback;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T[]): void {
  if (!canUseStorage()) return;
  window.localStorage.setItem(key, JSON.stringify(value));
  window.dispatchEvent(new CustomEvent('eis-learning-hub-changed'));
}

/* ─── Public API ─────────────────────────────────────────────────────── */

export function listConnections(): PlatformConnection[] {
  return read(KEYS.connections, [] as PlatformConnection[]);
}

export function saveConnection(connection: PlatformConnection): void {
  const all = listConnections().filter((c) => c.id !== connection.id);
  all.push(connection);
  write(KEYS.connections, all);
}

export function listImports(): ExternalImport[] {
  return read(KEYS.imports, [] as ExternalImport[]);
}

export function saveImport(record: ExternalImport): void {
  const all = listImports().filter((i) => i.id !== record.id);
  all.unshift(record);
  write(KEYS.imports, all.slice(0, 50));
}

export function deleteImport(importId: string): void {
  write(KEYS.imports, listImports().filter((i) => i.id !== importId));
  write(KEYS.events, listEvents().filter((e) => e.importId !== importId));
}

export function listEvents(): LearningEvent[] {
  return read(KEYS.events, [] as LearningEvent[]);
}

export function saveEvents(events: LearningEvent[]): void {
  if (events.length === 0) return;
  // Cap stored events so localStorage doesn't blow up.
  const merged = [...events, ...listEvents()].slice(0, 2000);
  write(KEYS.events, merged);
}

export function replaceEventsForImport(importId: string, events: LearningEvent[]): void {
  const other = listEvents().filter((e) => e.importId !== importId);
  write(KEYS.events, [...events, ...other].slice(0, 2000));
}

export function listMappings(): PlatformStudentMapping[] {
  return read(KEYS.mappings, [] as PlatformStudentMapping[]);
}

export function saveMapping(mapping: PlatformStudentMapping): void {
  const all = listMappings().filter(
    (m) => !(m.platform === mapping.platform && (m.externalName ?? '').toLowerCase() === (mapping.externalName ?? '').toLowerCase()),
  );
  all.push(mapping);
  write(KEYS.mappings, all);
}

export function clearMappings(): void {
  write(KEYS.mappings, []);
}

export function listRecommendations(): AIRecommendation[] {
  return read(KEYS.recommendations, [] as AIRecommendation[]);
}

export function saveRecommendations(recs: AIRecommendation[]): void {
  write(KEYS.recommendations, recs);
}

export function markDemoLoaded(): void {
  if (canUseStorage()) window.localStorage.setItem(KEYS.demoLoaded, new Date().toISOString());
}

export function isDemoLoaded(): boolean {
  if (!canUseStorage()) return false;
  return Boolean(window.localStorage.getItem(KEYS.demoLoaded));
}

export function clearAll(): void {
  if (!canUseStorage()) return;
  for (const key of Object.values(KEYS)) window.localStorage.removeItem(key);
  window.dispatchEvent(new CustomEvent('eis-learning-hub-changed'));
}

export const LEARNING_HUB_STORAGE_KEYS = KEYS;
