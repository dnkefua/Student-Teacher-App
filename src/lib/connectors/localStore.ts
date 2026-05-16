// Local persistence for connector metadata.
// Used as the demo path AND as the fallback when Firebase is missing.
// IMPORTANT: never stores real secrets — only PlatformCredential metadata
// with a secretRef pointer.

import type {
  ConnectorAuditLog,
  DriveIngestionConfig,
  PlatformCredential,
  SyncJob,
  SyncSchedule,
} from './types';

const KEYS = {
  credentials: 'eis-connectors-credentials',
  schedules: 'eis-connectors-schedules',
  jobs: 'eis-connectors-jobs',
  driveConfigs: 'eis-connectors-drive-configs',
  audit: 'eis-connectors-audit',
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
  window.dispatchEvent(new CustomEvent('eis-connectors-changed'));
}

export function listCredentials(): PlatformCredential[] {
  return read(KEYS.credentials, [] as PlatformCredential[]);
}
export function saveCredential(c: PlatformCredential): void {
  const all = listCredentials().filter((x) => x.id !== c.id);
  all.push(c);
  write(KEYS.credentials, all);
}

export function listSchedules(): SyncSchedule[] {
  return read(KEYS.schedules, [] as SyncSchedule[]);
}
export function saveSchedule(s: SyncSchedule): void {
  const all = listSchedules().filter((x) => x.id !== s.id);
  all.push(s);
  write(KEYS.schedules, all);
}

export function listJobs(): SyncJob[] {
  return read(KEYS.jobs, [] as SyncJob[]);
}
export function saveJob(j: SyncJob): void {
  const all = listJobs().filter((x) => x.id !== j.id);
  all.unshift(j);
  write(KEYS.jobs, all.slice(0, 100));
}

export function listDriveConfigs(): DriveIngestionConfig[] {
  return read(KEYS.driveConfigs, [] as DriveIngestionConfig[]);
}
export function saveDriveConfig(d: DriveIngestionConfig): void {
  const all = listDriveConfigs().filter((x) => x.id !== d.id);
  all.push(d);
  write(KEYS.driveConfigs, all);
}

export function listAudit(): ConnectorAuditLog[] {
  return read(KEYS.audit, [] as ConnectorAuditLog[]);
}
export function appendAudit(log: ConnectorAuditLog): void {
  const all = listAudit();
  all.unshift(log);
  write(KEYS.audit, all.slice(0, 200));
}

export function clearAllConnectors(): void {
  if (!canUseStorage()) return;
  for (const k of Object.values(KEYS)) window.localStorage.removeItem(k);
  window.dispatchEvent(new CustomEvent('eis-connectors-changed'));
}

export const CONNECTOR_STORAGE_KEYS = KEYS;
