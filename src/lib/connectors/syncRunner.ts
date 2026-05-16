// Orchestrates a single connector sync end-to-end:
//   1. Mark a SyncJob as running.
//   2. Invoke the platform's provider (Drive bundle list or API rows).
//   3. Normalise rows through the Hub's existing eventFactory.
//   4. Persist via the Hub repository (Firestore-first, local mirror) so
//      Mastery Analytics + Recommendations pick the new evidence up.
//   5. Mark the SyncJob as success/failed and write an audit log entry.
//
// IMPORTANT: this layer always uses the Learning Hub pipeline — there is
// no separate analytics path for synced vs uploaded data.

import { createLearningEventFromRow } from '@/lib/learningHub/eventFactory';
import { saveImportWithEvents } from '@/lib/learningHub/repository';
import type {
  ConnectorPlatform,
  ConnectorSyncResult,
  PlatformCredential,
  SyncJob,
} from './types';
import { fetchKahootReports } from './providers/kahootConnector';
import { fetchManageBacRoster, fetchManageBacAssessments } from './providers/managebacConnector';
import { fetchDriveBatch } from './providers/googleDriveConnector';
import { fetchWondeRoster } from './providers/wondeConnector';
import { fetchBlooketViaApi } from './providers/blooketConnector';
import { fetchMyiMathsViaApi } from './providers/myimathsConnector';
import { fetchDrFrostViaApi } from './providers/drfrostConnector';
import { appendAudit, listCredentials, listSchedules, listDriveConfigs, saveJob } from './localStore';

const appendJob = saveJob;
import { isConnectorFirestoreReady, createSyncJob, updateSyncJob, writeConnectorAuditLog } from './firestore';
import { DEMO_SCHOOL_ID } from '@/lib/learningHub/types';

function uid(prefix: string): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return `${prefix}-${crypto.randomUUID().split('-')[0]}`;
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function safeMirror(label: string, action: () => Promise<unknown>): Promise<void> {
  return action()
    .then(() => undefined)
    .catch((err) => {
      console.warn(`[connector-sync] ${label} failed`, err);
    });
}

async function runProvider(credential: PlatformCredential): Promise<{ bundles: { rows: Record<string, unknown>[]; warnings: string[]; importRecord: import('@/lib/learningHub/types').ExternalImport }[]; }> {
  const driveConfigs = listDriveConfigs();
  switch (credential.platform) {
    case 'kahoot': {
      const result = await fetchKahootReports(credential);
      return { bundles: [result] };
    }
    case 'managebac': {
      const roster = await fetchManageBacRoster(credential);
      const assessments = await fetchManageBacAssessments(credential);
      return { bundles: [roster, assessments] };
    }
    case 'google_drive': {
      const config = driveConfigs.find((d) => d.connectionId === credential.id) ?? null;
      const bundles = await fetchDriveBatch(credential, config);
      return { bundles };
    }
    case 'blooket':
      // Production path: Drive ingestion. Direct API throws clearly.
      await fetchBlooketViaApi();
      return { bundles: [] };
    case 'myimaths':
      await fetchMyiMathsViaApi();
      return { bundles: [] };
    case 'drfrost':
      await fetchDrFrostViaApi();
      return { bundles: [] };
    case 'wonde':
      await fetchWondeRoster();
      return { bundles: [] };
    case 'generic':
    default:
      return { bundles: [] };
  }
}

function bumpAudit(action: import('./types').ConnectorAuditLog['action'], platform: ConnectorPlatform, syncJobId: string, details?: string): void {
  const log: import('./types').ConnectorAuditLog = {
    id: uid('conn-log'),
    schoolId: DEMO_SCHOOL_ID,
    actorId: 'connector-system',
    action,
    platform,
    syncJobId,
    details,
    createdAt: new Date().toISOString(),
  };
  appendAudit(log);
  if (isConnectorFirestoreReady()) void safeMirror('writeConnectorAuditLog', () => writeConnectorAuditLog(log));
}

export async function runSyncForPlatform(input: {
  schoolId?: string;
  platform: ConnectorPlatform;
  connectionId: string;
}): Promise<ConnectorSyncResult> {
  const schoolId = input.schoolId ?? DEMO_SCHOOL_ID;
  const credential = listCredentials().find((c) => c.id === input.connectionId);
  if (!credential) {
    throw new Error(`No connector credential found for ${input.connectionId}`);
  }

  const job: SyncJob = {
    id: uid('job'),
    schoolId,
    platform: input.platform,
    connectionId: credential.id,
    method: credential.method,
    status: 'running',
    startedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  };
  appendJob(job);
  if (isConnectorFirestoreReady()) void safeMirror('createSyncJob', () => createSyncJob(job));
  bumpAudit('start_sync', input.platform, job.id);

  try {
    const { bundles } = await runProvider(credential);

    let eventsCreated = 0;
    let importsCreated = 0;
    const warnings: string[] = [];

    for (const bundle of bundles) {
      warnings.push(...bundle.warnings);
      if (bundle.rows.length === 0) continue;

      const platform = bundle.importRecord.platform;
      const events = bundle.rows.map((row) =>
        createLearningEventFromRow({
          platform,
          row,
          importId: bundle.importRecord.id,
          schoolId,
        }),
      );
      const finalImport = {
        ...bundle.importRecord,
        eventCount: events.length,
        importStatus: 'saved' as const,
        savedAt: new Date().toISOString(),
      };
      await saveImportWithEvents({ importRecord: finalImport, events });
      eventsCreated += events.length;
      importsCreated += 1;
    }

    const finished: SyncJob = {
      ...job,
      status: bundles.length === 0 ? 'partial' : 'success',
      finishedAt: new Date().toISOString(),
      rowsPulled: bundles.reduce((sum, b) => sum + b.rows.length, 0),
      eventsCreated,
      importsCreated,
      filesProcessed: bundles.length,
    };
    saveJob(finished);
    if (isConnectorFirestoreReady()) void safeMirror('updateSyncJob', () => updateSyncJob(finished));
    bumpAudit('finish_sync', input.platform, job.id, `${importsCreated} imports / ${eventsCreated} events`);

    return { job: finished, eventsCreated, importsCreated, warnings };
  } catch (err) {
    const failed: SyncJob = {
      ...job,
      status: 'failed',
      finishedAt: new Date().toISOString(),
      error: err instanceof Error ? err.message : String(err),
    };
    saveJob(failed);
    if (isConnectorFirestoreReady()) void safeMirror('updateSyncJob', () => updateSyncJob(failed));
    bumpAudit('fail_sync', input.platform, job.id, failed.error);
    return { job: failed, eventsCreated: 0, importsCreated: 0, warnings: [failed.error ?? 'Unknown sync failure'] };
  }
}

export async function runAllEnabledSyncs(schoolId: string = DEMO_SCHOOL_ID): Promise<ConnectorSyncResult[]> {
  const schedules = listSchedules().filter((s) => s.enabled);
  const out: ConnectorSyncResult[] = [];
  for (const s of schedules) {
    if (s.schoolId !== schoolId) continue;
    try {
      const r = await runSyncForPlatform({ schoolId, platform: s.platform, connectionId: s.connectionId });
      out.push(r);
    } catch (err) {
      console.warn('[connector-sync] schedule failed', err);
    }
  }
  return out;
}
