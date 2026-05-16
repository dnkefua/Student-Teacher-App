// Kahoot Reports API connector — structured placeholder.
//
// TODO (production):
//   - Authenticate with the Kahoot Reports API using a client-credentials
//     flow (client ID + client secret pulled from Secret Manager via the
//     refs in PlatformCredential.secretRef).
//   - List games since lastSyncCursor (typically updated_at or play_at).
//   - For each game, pull participants + question-level responses.
//   - Normalise rows into the shape the Kahoot importer expects so the
//     existing eventFactory does the heavy lifting.
//
// Endpoints are intentionally NOT hard-coded here — the Kahoot Reports
// API requires authorised partner access and the public schema changes;
// the production wiring should consume the documentation pinned to the
// EIS Kahoot 360 contract.

import type { ExternalImport } from '@/lib/learningHub/types';
import { DEMO_SCHOOL_ID } from '@/lib/learningHub/types';
import { isDemoSecretRef } from '../security';
import type { ConnectorPlatform, PlatformCredential } from '../types';

export type KahootApiConfig = {
  clientIdSecretRef: string;
  clientSecretSecretRef: string;
  organizationId?: string;
  lastSyncCursor?: string;
};

export type ProviderRows = {
  rows: Record<string, unknown>[];
  importRecord: ExternalImport;
  warnings: string[];
};

function importRecord(platform: ConnectorPlatform, count: number): ExternalImport {
  return {
    id: `sync-${platform}-${Date.now()}`,
    schoolId: DEMO_SCHOOL_ID,
    platform: 'kahoot',
    uploadedBy: 'connector-kahoot',
    fileName: `kahoot-api-sync-${Date.now()}.json`,
    fileType: 'unknown',
    importStatus: 'parsed',
    rowCount: count,
    eventCount: count,
    errorCount: 0,
    createdAt: new Date().toISOString(),
    parsedAt: new Date().toISOString(),
  };
}

export async function validateKahootConnection(credential: PlatformCredential): Promise<{ ok: boolean; message: string }> {
  if (!credential.secretRef) {
    return { ok: false, message: 'No secretRef set — Kahoot Reports API client ID/secret have not been stored yet.' };
  }
  if (isDemoSecretRef(credential.secretRef)) {
    return { ok: true, message: 'Demo connection. Real validation runs once Kahoot client credentials are stored in Secret Manager.' };
  }
  // TODO production: POST to Kahoot OAuth token endpoint and check 200.
  return { ok: false, message: 'Kahoot Reports API validation not yet wired. Secret stored but live check pending.' };
}

export async function fetchKahootReports(credential: PlatformCredential): Promise<ProviderRows> {
  if (!isDemoSecretRef(credential.secretRef)) {
    throw new Error('Kahoot Reports API credentials required. Configure via /api/connectors/secrets first.');
  }
  // Demo path — generate a small believable batch of rows shaped like a
  // Kahoot CSV export so eventFactory's Kahoot normaliser handles them.
  const players = ['Aisha Khan', 'Omar Al Farsi', 'Maryam Hassan', 'Daniel Okafor', 'Ahmed Ali'];
  const games = [
    { title: 'Ratio Quick-Fire', topic: 'Ratio and Proportion' },
    { title: 'Solve the Mystery x', topic: 'Algebra & Equations' },
  ];
  const rows: Record<string, unknown>[] = [];
  for (const player of players) {
    for (const game of games) {
      const score = 30 + Math.floor(Math.random() * 65);
      rows.push({
        participant: player,
        'game title': game.title,
        topic: game.topic,
        score,
        percentage: score,
        questions: 10,
        'answer time': 9 + Math.random() * 12,
        date: new Date().toISOString(),
      });
    }
  }
  return {
    rows,
    importRecord: importRecord('kahoot', rows.length),
    warnings: [
      'Demo Kahoot sync. Live Reports API integration pending — configure client credentials in Secret Manager to enable real syncing.',
    ],
  };
}
