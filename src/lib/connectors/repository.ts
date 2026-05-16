// Hybrid Firestore-first / localStore-fallback for the connector layer.
// Mirrors the Learning Hub repository pattern: every write hits the local
// cache (for offline + demo) and the Firestore mirror when configured.

import {
  isConnectorFirestoreReady,
  listSyncJobs as fsListSyncJobs,
  listPlatformCredentials,
  listSyncSchedules,
  listDriveIngestionConfigs,
  savePlatformCredential,
  saveSyncSchedule,
  saveDriveIngestionConfig,
  toggleSyncSchedule,
  updatePlatformCredentialStatus,
  writeConnectorAuditLog,
} from './firestore';
import {
  appendAudit,
  listCredentials,
  listSchedules,
  listJobs,
  listDriveConfigs,
  saveCredential as localSaveCredential,
  saveSchedule as localSaveSchedule,
  saveDriveConfig as localSaveDriveConfig,
  clearAllConnectors,
} from './localStore';
import {
  type ConnectorAuditLog,
  type ConnectorPlatform,
  type DriveIngestionConfig,
  type PlatformCredential,
  type SyncJob,
  type SyncSchedule,
  type ConnectorStatus,
} from './types';
import { DEMO_SCHOOL_ID } from '@/lib/learningHub/types';
import { buildDemoSecretRef, isDemoSecretRef } from './security';
import { connectorRegistry } from './registry';
import { runSyncForPlatform } from './syncRunner';

export type ConnectorSnapshot = {
  credentials: PlatformCredential[];
  schedules: SyncSchedule[];
  jobs: SyncJob[];
  driveConfigs: DriveIngestionConfig[];
  source: 'firestore' | 'local';
};

function uid(prefix: string): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return `${prefix}-${crypto.randomUUID().split('-')[0]}`;
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

async function safe<T>(promise: Promise<T | null>, fallback: T): Promise<T> {
  try {
    const result = await promise;
    return result ?? fallback;
  } catch (err) {
    console.warn('[connector repository] Firestore call failed, using local fallback.', err);
    return fallback;
  }
}

function logAudit(input: Omit<ConnectorAuditLog, 'id' | 'createdAt'>): ConnectorAuditLog {
  const log: ConnectorAuditLog = { id: uid('conn-log'), createdAt: new Date().toISOString(), ...input };
  appendAudit(log);
  if (isConnectorFirestoreReady()) {
    void writeConnectorAuditLog(log).catch(() => undefined);
  }
  return log;
}

export async function loadConnectorSnapshot(schoolId: string = DEMO_SCHOOL_ID): Promise<ConnectorSnapshot> {
  if (isConnectorFirestoreReady()) {
    const [credentials, schedules, jobs, driveConfigs] = await Promise.all([
      safe(listPlatformCredentials(schoolId), [] as PlatformCredential[]),
      safe(listSyncSchedules(schoolId), [] as SyncSchedule[]),
      safe(fsListSyncJobs({ schoolId, limit: 50 }), [] as SyncJob[]),
      safe(listDriveIngestionConfigs(schoolId), [] as DriveIngestionConfig[]),
    ]);
    return { credentials, schedules, jobs, driveConfigs, source: 'firestore' };
  }
  return {
    credentials: listCredentials(),
    schedules: listSchedules(),
    jobs: listJobs(),
    driveConfigs: listDriveConfigs(),
    source: 'local',
  };
}

export async function setupConnector(input: {
  schoolId?: string;
  platform: ConnectorPlatform;
  method: PlatformCredential['method'];
  displayName: string;
  secretRef?: string;
  notes?: string;
}): Promise<PlatformCredential> {
  const schoolId = input.schoolId ?? DEMO_SCHOOL_ID;
  const registryEntry = connectorRegistry[input.platform];
  const status: ConnectorStatus =
    registryEntry.category === 'planned'
      ? 'planned'
      : registryEntry.category === 'roster_mis' && !input.secretRef
      ? 'planned'
      : input.secretRef
      ? isDemoSecretRef(input.secretRef)
        ? 'connected'
        : 'connected'
      : registryEntry.supportsDriveIngestion
      ? 'drive_ready'
      : 'needs_setup';

  const credential: PlatformCredential = {
    id: uid(`conn-${input.platform}`),
    schoolId,
    platform: input.platform,
    method: input.method,
    status,
    secretRef: input.secretRef,
    displayName: input.displayName,
    createdBy: 'demo-teacher',
    createdAt: new Date().toISOString(),
    notes: input.notes,
  };

  localSaveCredential(credential);
  if (isConnectorFirestoreReady()) {
    await safe(savePlatformCredential(credential), null);
  }
  logAudit({ schoolId, actorId: 'demo-teacher', action: 'create_connection', platform: input.platform, connectionId: credential.id });
  return credential;
}

export async function runConnectorSync(input: {
  schoolId?: string;
  platform: ConnectorPlatform;
  connectionId: string;
}): Promise<SyncJob> {
  const schoolId = input.schoolId ?? DEMO_SCHOOL_ID;
  const result = await runSyncForPlatform({ schoolId, platform: input.platform, connectionId: input.connectionId });
  return result.job;
}

export async function saveDriveConfig(config: DriveIngestionConfig): Promise<DriveIngestionConfig> {
  localSaveDriveConfig(config);
  if (isConnectorFirestoreReady()) {
    await safe(saveDriveIngestionConfig(config), null);
  }
  logAudit({
    schoolId: config.schoolId,
    actorId: 'demo-teacher',
    action: 'save_drive_config',
    platform: 'google_drive',
    connectionId: config.connectionId,
    details: `folder: ${config.folderName ?? config.folderId}`,
  });
  return config;
}

export async function listRecentSyncJobs(_platform?: ConnectorPlatform): Promise<SyncJob[]> {
  // Local first (always current after a sync); Firestore mirror is best-effort.
  void _platform;
  return listJobs();
}

export async function validateConnector(connectionId: string): Promise<{ ok: boolean; message: string }> {
  const credential = listCredentials().find((c) => c.id === connectionId);
  if (!credential) return { ok: false, message: 'Connection not found.' };
  const reg = connectorRegistry[credential.platform];
  if (reg.category === 'planned') return { ok: false, message: `${reg.displayName} is planned. School/vendor approval required.` };
  if (!credential.secretRef && reg.recommendedMethod === 'api') {
    return { ok: false, message: `${reg.displayName} needs a secretRef before validation can run.` };
  }
  if (credential.secretRef && isDemoSecretRef(credential.secretRef)) {
    return { ok: true, message: `${reg.displayName} demo connection is valid.` };
  }
  return { ok: true, message: `${reg.displayName} live credentials present. Real validation runs server-side.` };
}

export async function disableConnector(connectionId: string): Promise<void> {
  const credential = listCredentials().find((c) => c.id === connectionId);
  if (!credential) return;
  const next: PlatformCredential = { ...credential, status: 'disabled', updatedAt: new Date().toISOString() };
  localSaveCredential(next);
  if (isConnectorFirestoreReady()) {
    await safe(updatePlatformCredentialStatus(connectionId, 'disabled'), false);
  }
  logAudit({ schoolId: credential.schoolId, actorId: 'demo-teacher', action: 'disable_connection', platform: credential.platform, connectionId });
}

export async function scheduleSync(input: {
  schoolId?: string;
  platform: ConnectorPlatform;
  connectionId: string;
  frequency: SyncSchedule['frequency'];
  enabled: boolean;
}): Promise<SyncSchedule> {
  const schoolId = input.schoolId ?? DEMO_SCHOOL_ID;
  const schedule: SyncSchedule = {
    id: uid('sched'),
    schoolId,
    platform: input.platform,
    connectionId: input.connectionId,
    enabled: input.enabled,
    frequency: input.frequency,
    timezone: 'Asia/Dubai',
    hour: 2,
    minute: 0,
    createdAt: new Date().toISOString(),
  };
  localSaveSchedule(schedule);
  if (isConnectorFirestoreReady()) {
    await safe(saveSyncSchedule(schedule), null);
  }
  logAudit({
    schoolId,
    actorId: 'demo-teacher',
    action: 'schedule_sync',
    platform: input.platform,
    connectionId: input.connectionId,
    details: `frequency: ${input.frequency}`,
  });
  return schedule;
}

export async function toggleScheduleEnabled(scheduleId: string, enabled: boolean): Promise<void> {
  const existing = listSchedules().find((s) => s.id === scheduleId);
  if (!existing) return;
  const next: SyncSchedule = { ...existing, enabled, updatedAt: new Date().toISOString() };
  localSaveSchedule(next);
  if (isConnectorFirestoreReady()) {
    await safe(toggleSyncSchedule(scheduleId, enabled), false);
  }
}

export async function clearAllConnectorState(): Promise<void> {
  clearAllConnectors();
}

export const CONNECTOR_DEMO_SECRET = buildDemoSecretRef;
