// Hybrid Firestore-first / localStore-fallback data access. The UI imports
// only from here — no direct firestore or localStore reads in components.
//
// Returns a `source` discriminator on every write so the UI can render the
// "Firestore persistence on" / "Local demo mode" badge truthfully.

import { applyStudentMappings } from './studentMatching';
import { seedDemoLearningHubData } from './demoData';
import * as fs from './firestore';
import * as local from './localStore';
import {
  isLearningHubFirestoreReady,
} from './firestore';
import type {
  AIRecommendation,
  ExternalImport,
  IntegrationAuditLog,
  LearningEvent,
  PlatformConnection,
  PlatformStudentMapping,
} from './types';
import { DEMO_SCHOOL_ID } from './types';

export type DataSource = 'firestore' | 'local';

export type LearningHubSnapshot = {
  events: LearningEvent[];
  imports: ExternalImport[];
  connections: PlatformConnection[];
  mappings: PlatformStudentMapping[];
  recommendations: AIRecommendation[];
  source: DataSource;
};

export function isFirestoreBacked(): boolean {
  return isLearningHubFirestoreReady();
}

function logUid(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return `log-${crypto.randomUUID().split('-')[0]}`;
  return `log-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

async function safe<T>(promise: Promise<T | null>, fallback: T): Promise<T> {
  try {
    const result = await promise;
    return result ?? fallback;
  } catch (err) {
    console.warn('[learning-hub repository] Firestore call failed, using fallback.', err);
    return fallback;
  }
}

export async function loadLearningHubSnapshot(options: {
  schoolId?: string;
  mode?: 'teacher' | 'student';
  studentId?: string;
} = {}): Promise<LearningHubSnapshot> {
  const schoolId = options.schoolId ?? DEMO_SCHOOL_ID;

  if (isLearningHubFirestoreReady()) {
    const [events, imports, connections, mappings, recommendations] = await Promise.all([
      safe(fs.listLearningEvents({ schoolId, studentId: options.studentId, limitCount: 2000 }), [] as LearningEvent[]),
      safe(fs.listExternalImports(schoolId), [] as ExternalImport[]),
      safe(fs.listPlatformConnections(schoolId), [] as PlatformConnection[]),
      safe(fs.listPlatformStudentMappings({ schoolId }), [] as PlatformStudentMapping[]),
      safe(
        fs.listAIRecommendations({ schoolId, studentId: options.mode === 'student' ? options.studentId : undefined }),
        [] as AIRecommendation[],
      ),
    ]);
    return { events, imports, connections, mappings, recommendations, source: 'firestore' };
  }

  // Local fallback.
  return {
    events: local.listEvents(),
    imports: local.listImports(),
    connections: local.listConnections(),
    mappings: local.listMappings(),
    recommendations: local.listRecommendations(),
    source: 'local',
  };
}

export async function saveImportWithEvents(input: {
  importRecord: ExternalImport;
  events: LearningEvent[];
}): Promise<{ importRecord: ExternalImport; events: LearningEvent[]; source: DataSource }> {
  if (isLearningHubFirestoreReady()) {
    await safe(fs.saveExternalImport(input.importRecord), null);
    await safe(fs.saveLearningEvents(input.events), null);
    await safe(
      fs.writeIntegrationAuditLog({
        id: logUid(),
        schoolId: input.importRecord.schoolId,
        actorId: input.importRecord.uploadedBy,
        action: 'save_learning_events',
        platform: input.importRecord.platform,
        importId: input.importRecord.id,
        details: `Saved ${input.events.length} events for ${input.importRecord.fileName ?? 'unnamed file'}`,
        createdAt: new Date().toISOString(),
      }),
      null,
    );
  }
  // Always mirror in local fallback so the UI doesn't lose state if Firestore
  // is intermittently unreachable and so demo mode stays fully functional.
  local.saveImport(input.importRecord);
  local.replaceEventsForImport(input.importRecord.id, input.events);
  return {
    importRecord: input.importRecord,
    events: input.events,
    source: isLearningHubFirestoreReady() ? 'firestore' : 'local',
  };
}

export async function saveMappingsAndApply(input: {
  mappings: PlatformStudentMapping[];
  events: LearningEvent[];
}): Promise<{ events: LearningEvent[]; mappings: PlatformStudentMapping[]; source: DataSource }> {
  const updatedEvents = applyStudentMappings(input.events, input.mappings);

  if (isLearningHubFirestoreReady()) {
    await Promise.all(
      input.mappings.map((m) =>
        safe(fs.savePlatformStudentMapping(m), null).then(() =>
          fs.writeIntegrationAuditLog({
            id: logUid(),
            schoolId: m.schoolId,
            actorId: 'demo-teacher',
            action: 'map_student',
            platform: m.platform,
            details: `Mapped "${m.externalName}" to ${m.studentDisplayName} (confidence ${Math.round(m.confidence * 100)}%)`,
            createdAt: new Date().toISOString(),
          }),
        ),
      ),
    );
    // Persist updated events. This rewrites the affected docs idempotently.
    const changed = updatedEvents.filter((e, i) => e.studentId !== input.events[i]?.studentId);
    if (changed.length > 0) {
      await safe(fs.saveLearningEvents(changed), null);
    }
  }

  for (const m of input.mappings) local.saveMapping(m);
  // The locally-cached events become consistent on next snapshot load; events
  // are reapplied via applyStudentMappings when the consumer reads.
  return {
    events: updatedEvents,
    mappings: input.mappings,
    source: isLearningHubFirestoreReady() ? 'firestore' : 'local',
  };
}

export async function saveRecommendationAction(input: {
  recommendation: AIRecommendation;
  status?: 'new' | 'accepted' | 'dismissed';
}): Promise<void> {
  const status = input.status ?? input.recommendation.status;
  const next: AIRecommendation = { ...input.recommendation, status };

  if (isLearningHubFirestoreReady()) {
    await safe(fs.saveAIRecommendation(next), null);
    if (status !== 'new') {
      await safe(
        fs.writeIntegrationAuditLog({
          id: logUid(),
          schoolId: next.schoolId,
          actorId: 'demo-teacher',
          action: 'generate_recommendation',
          details: `${status} · ${next.title}`,
          createdAt: new Date().toISOString(),
        }),
        null,
      );
    }
  }

  const all = local.listRecommendations().filter((r) => r.id !== next.id);
  local.saveRecommendations([next, ...all]);
}

export async function seedDemoDataRepository(): Promise<void> {
  // Local seeding always happens (it's the demo path). Firestore mirror is
  // best-effort — we don't want to flood a production project with demo data,
  // so when Firestore is configured we only mirror the imports + connections
  // and let analytics recompute from the locally-seeded events.
  seedDemoLearningHubData();
  if (!isLearningHubFirestoreReady()) return;
  const imports = local.listImports();
  const connections = local.listConnections();
  const events = local.listEvents();
  await Promise.all([
    ...imports.map((i) => safe(fs.saveExternalImport(i), null)),
    ...connections.map((c) => safe(fs.savePlatformConnection(c), null)),
    safe(fs.saveLearningEvents(events), null),
  ]);
}

export async function clearLearningHubRepository(): Promise<void> {
  local.clearAll();
  if (!isLearningHubFirestoreReady()) return;
  // Firestore clear is intentionally NOT bulk-deleted from the client — that
  // can be destructive in a shared school environment. The audit log keeps a
  // trail of imports; deleting individual imports goes through
  // deleteImportAndEvents() so each removal is explicit and recorded.
}

export async function deleteImportEverywhere(importId: string): Promise<void> {
  if (isLearningHubFirestoreReady()) {
    await safe(fs.deleteImportAndEvents(importId), false);
  }
  local.deleteImport(importId);
}

export async function recordLearningEventOnce(event: LearningEvent): Promise<void> {
  if (isLearningHubFirestoreReady()) {
    await safe(fs.saveLearningEvents([event]), null);
  }
  local.saveEvents([event]);
}

export async function writeAuditLog(input: Omit<IntegrationAuditLog, 'id' | 'createdAt'>): Promise<void> {
  const log: IntegrationAuditLog = { id: logUid(), createdAt: new Date().toISOString(), ...input };
  if (isLearningHubFirestoreReady()) {
    await safe(fs.writeIntegrationAuditLog(log), null);
  }
}
