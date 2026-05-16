// Google Drive auto-ingestion — structured placeholder.
//
// TODO (production):
//   - Authenticate as a Workspace service account or via domain-wide
//     delegation pulled from Secret Manager.
//   - Drive API: files.list() on the configured folderId, filtered to
//     mimeType csv/xlsx, page through results.
//   - Track processed file IDs in Firestore (or move to a processed folder).
//   - For each new file: download bytes → call the existing CSV/XLSX
//     importers under src/lib/learningHub/importers/.
//   - On failure: move to failedFolderId or log to connectorAuditLogs.
//
// Today this connector returns a demo batch routed across the per-platform
// subfolders so the rest of the pipeline (event factory → student matching
// → mastery → recommendations) runs end-to-end without real Drive access.

import type { ExternalImport, ExternalPlatform } from '@/lib/learningHub/types';
import { DEMO_SCHOOL_ID } from '@/lib/learningHub/types';
import { isDemoSecretRef } from '../security';
import type { DriveIngestionConfig, PlatformCredential } from '../types';
import type { ProviderRows } from './kahootConnector';

const FOLDER_TO_PLATFORM: { match: RegExp; platform: ExternalPlatform }[] = [
  { match: /kahoot/i, platform: 'kahoot' },
  { match: /blooket/i, platform: 'blooket' },
  { match: /(drfrost|dr\s*frost)/i, platform: 'drfrost' },
  { match: /(myimaths|mymaths)/i, platform: 'myimaths' },
  { match: /managebac/i, platform: 'managebac' },
];

export function routePlatformFromFolderName(folder: string): ExternalPlatform {
  for (const r of FOLDER_TO_PLATFORM) if (r.match.test(folder)) return r.platform;
  return 'manual_csv';
}

export async function validateDriveConnection(credential: PlatformCredential): Promise<{ ok: boolean; message: string }> {
  if (!credential.secretRef) {
    return { ok: false, message: 'No secretRef set — Drive service account credentials not configured.' };
  }
  if (isDemoSecretRef(credential.secretRef)) {
    return { ok: true, message: 'Demo Drive ingestion. Real validation runs once a Workspace service account is configured in Secret Manager.' };
  }
  return { ok: false, message: 'Drive validation pending live wiring.' };
}

type DemoBatchRow = { folder: string; row: Record<string, unknown> };

function demoDriveBatch(): DemoBatchRow[] {
  const players = ['Aisha Khan', 'Omar Al Farsi', 'Noor Haddad', 'Layla Mansour'];
  const out: DemoBatchRow[] = [];
  for (const player of players) {
    out.push({
      folder: 'Blooket',
      row: {
        student: player,
        'homework title': 'Ratio Speed Round',
        topic: 'Ratio and Proportion',
        accuracy: 40 + Math.floor(Math.random() * 50),
        correct: Math.floor(Math.random() * 8),
        incorrect: Math.floor(Math.random() * 4),
        'time played': 120 + Math.floor(Math.random() * 300),
        date: new Date().toISOString(),
      },
    });
    out.push({
      folder: 'MyiMaths',
      row: {
        name: player,
        class: 'Grade 8A',
        task: 'Solving Two-Step Equations',
        'curriculum area': 'Algebra & Equations',
        percentage: 50 + Math.floor(Math.random() * 45),
        attempts: 1 + Math.floor(Math.random() * 2),
        completion: 'Completed',
        date: new Date(Date.now() - 86400000).toISOString(),
      },
    });
    out.push({
      folder: 'Dr Frost',
      row: {
        pupil: player,
        class: 'Grade 8A',
        worksheet: 'Pythagoras Practice',
        topic: 'Pythagoras',
        score: 5 + Math.floor(Math.random() * 5),
        'max score': 10,
        completed: 'Yes',
        date: new Date(Date.now() - 2 * 86400000).toISOString(),
      },
    });
  }
  return out;
}

function importFor(platform: ExternalPlatform, count: number, fileName: string): ExternalImport {
  return {
    id: `sync-drive-${platform}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    schoolId: DEMO_SCHOOL_ID,
    platform,
    uploadedBy: 'connector-drive',
    fileName,
    fileType: 'xlsx',
    importStatus: 'parsed',
    rowCount: count,
    eventCount: count,
    errorCount: 0,
    createdAt: new Date().toISOString(),
    parsedAt: new Date().toISOString(),
  };
}

/** Returns one ProviderRows bundle per platform that the demo batch touched.
 *  Each bundle ends up as an ExternalImport in the Learning Hub so the
 *  delete-import controls work on Drive-ingested data too. */
export async function fetchDriveBatch(
  credential: PlatformCredential,
  config?: DriveIngestionConfig | null,
): Promise<ProviderRows[]> {
  if (!isDemoSecretRef(credential.secretRef)) {
    throw new Error('Google Drive service account required. Configure via /api/connectors/secrets first.');
  }

  void config; // future: use config.platformRouting to override defaults

  const batch = demoDriveBatch();
  const grouped = new Map<ExternalPlatform, Record<string, unknown>[]>();
  for (const item of batch) {
    const platform = routePlatformFromFolderName(item.folder);
    if (!grouped.has(platform)) grouped.set(platform, []);
    grouped.get(platform)!.push(item.row);
  }

  const bundles: ProviderRows[] = [];
  for (const [platform, rows] of grouped.entries()) {
    bundles.push({
      rows,
      importRecord: importFor(platform, rows.length, `drive-${platform}-${Date.now()}.xlsx`),
      warnings: [
        `Demo Drive ingestion. ${rows.length} row(s) routed to ${platform}. Production sync uses the Drive API to list real files under the school-approved folder.`,
      ],
    });
  }
  return bundles;
}
