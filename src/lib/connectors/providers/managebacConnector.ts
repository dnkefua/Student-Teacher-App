// ManageBac connector — structured placeholder.
//
// TODO (production):
//   - GET /v2/users, /v2/classes, /v2/enrollments, /v2/assessments using
//     a school-admin API token (Bearer auth) pulled from Secret Manager.
//   - Roster sync drives student identity for every other connector.
//   - Optionally publish assessment results as LearningEvents.
//
// ManageBac remains the system of record; this connector pulls the roster
// downstream so the Learning Data Hub can resolve external names back to
// EIS students.

import { DEMO_SCHOOL_ID, type ExternalImport } from '@/lib/learningHub/types';
import { isDemoSecretRef } from '../security';
import type { PlatformCredential } from '../types';
import { DEMO_ROSTER } from '@/lib/learningHub/studentMatching';
import type { ProviderRows } from './kahootConnector';

function importRecord(platform: 'managebac', count: number): ExternalImport {
  return {
    id: `sync-${platform}-${Date.now()}`,
    schoolId: DEMO_SCHOOL_ID,
    platform: 'managebac',
    uploadedBy: 'connector-managebac',
    fileName: `managebac-api-sync-${Date.now()}.json`,
    fileType: 'unknown',
    importStatus: 'parsed',
    rowCount: count,
    eventCount: count,
    errorCount: 0,
    createdAt: new Date().toISOString(),
    parsedAt: new Date().toISOString(),
  };
}

export async function validateManageBacConnection(credential: PlatformCredential): Promise<{ ok: boolean; message: string }> {
  if (!credential.secretRef) {
    return { ok: false, message: 'No secretRef set — ManageBac API token has not been stored yet.' };
  }
  if (isDemoSecretRef(credential.secretRef)) {
    return { ok: true, message: 'Demo connection. Real validation runs once a school-admin token is stored in Secret Manager.' };
  }
  // TODO production: GET /v2/users with Bearer token; expect 200.
  return { ok: false, message: 'ManageBac validation pending. Secret stored but live check not yet wired.' };
}

export async function fetchManageBacRoster(credential: PlatformCredential): Promise<ProviderRows> {
  if (!isDemoSecretRef(credential.secretRef)) {
    throw new Error('ManageBac API token required. Configure via /api/connectors/secrets first.');
  }
  // Demo roster — same 12 students the Learning Hub already knows about,
  // shaped like a ManageBac /users payload row.
  const rows = DEMO_ROSTER.map((s) => ({
    student: s.name,
    email: `${s.name.toLowerCase().replace(/\s+/g, '.')}@eis-jumeirah.org`,
    class: s.classId === 'class-grade8a' ? 'Grade 8A · Mathematics' : 'Grade 8B · Mathematics',
    'year group': 'Grade 8',
    subject: 'Mathematics',
  }));
  return {
    rows,
    importRecord: importRecord('managebac', rows.length),
    warnings: ['Demo ManageBac sync — real roster pull pending API token + role bindings.'],
  };
}

export async function fetchManageBacAssessments(credential: PlatformCredential): Promise<ProviderRows> {
  if (!isDemoSecretRef(credential.secretRef)) {
    throw new Error('ManageBac API token required.');
  }
  // Demo assessments — a small batch of summative results so analytics
  // get richer evidence when the demo connector runs.
  const rows = DEMO_ROSTER.slice(0, 6).map((s, i) => ({
    student: s.name,
    class: s.classId === 'class-grade8a' ? 'Grade 8A · Mathematics' : 'Grade 8B · Mathematics',
    assessment: ['Ratio Test', 'Linear Equations Quiz', 'Pythagoras Check'][i % 3],
    score: 50 + Math.floor(Math.random() * 45),
    'max score': 100,
    date: new Date(Date.now() - i * 86400000).toISOString(),
  }));
  return {
    rows,
    importRecord: importRecord('managebac', rows.length),
    warnings: ['Demo ManageBac assessment sync.'],
  };
}
