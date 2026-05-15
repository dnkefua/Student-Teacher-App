// Glue between file parsing (csv.ts / xlsx.ts) and the event factory.
// Exposes one entry point per platform; each returns an ImportParseResult.

import { parseCsvFile } from './csv';
import { parseXlsxFile, pickPreferredSheet } from './xlsx';
import { createLearningEventFromRow } from '../eventFactory';
import { platformAnalyticsRegistry } from '../platformRegistry';
import { DEMO_SCHOOL_ID, type ColumnMapping, type ExternalImport, type ExternalPlatform, type ImportParseResult } from '../types';

function uid(prefix: string): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return `${prefix}-${crypto.randomUUID().split('-')[0]}`;
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function fileType(file: File): 'csv' | 'xlsx' | 'unknown' {
  const name = file.name.toLowerCase();
  if (name.endsWith('.csv')) return 'csv';
  if (name.endsWith('.xlsx') || name.endsWith('.xls')) return 'xlsx';
  return 'unknown';
}

async function readRows(file: File, platform: ExternalPlatform): Promise<{ rows: Record<string, unknown>[]; detected: string[]; warnings: string[] }> {
  const warnings: string[] = [];
  const type = fileType(file);
  if (type === 'csv') {
    const rows = await parseCsvFile(file);
    const detected = rows[0] ? Object.keys(rows[0]) : [];
    return { rows, detected, warnings };
  }
  if (type === 'xlsx') {
    const { sheets } = await parseXlsxFile(file);
    if (sheets.length === 0) throw new Error('No sheets found in workbook.');
    const { sheet, warning } = pickPreferredSheet(sheets, platform);
    if (warning) warnings.push(warning);
    if (sheets.length > 1) {
      warnings.push(`Workbook has ${sheets.length} sheets. Using "${sheet.name}". Re-upload with a single sheet to override.`);
    }
    const detected = sheet.rows[0] ? Object.keys(sheet.rows[0]) : [];
    return { rows: sheet.rows, detected, warnings };
  }
  throw new Error(`Unsupported file type for ${file.name}. Upload CSV or XLSX.`);
}

export async function parseReport(
  file: File,
  platform: ExternalPlatform,
  options: { uploadedBy: string; schoolId?: string; classId?: string; mapping?: ColumnMapping } = { uploadedBy: 'demo-teacher' },
): Promise<ImportParseResult> {
  const importId = uid('imp');
  const schoolId = options.schoolId ?? DEMO_SCHOOL_ID;
  const { rows, detected, warnings } = await readRows(file, platform);

  const events = rows.map((row) =>
    createLearningEventFromRow({
      platform,
      row,
      mapping: options.mapping,
      importId,
      schoolId,
      classId: options.classId,
    }),
  );

  const importRecord: ExternalImport = {
    id: importId,
    schoolId,
    platform,
    uploadedBy: options.uploadedBy,
    fileName: file.name,
    fileType: fileType(file),
    importStatus: 'parsed',
    rowCount: rows.length,
    eventCount: events.length,
    errorCount: 0,
    createdAt: new Date().toISOString(),
    parsedAt: new Date().toISOString(),
    errors: [],
  };

  return { importRecord, rows, events, detectedColumns: detected, warnings };
}

// Convenience per-platform exports — the UI uses these names, but they all
// delegate to parseReport(platform, …) above.
export const parseKahootReport = (file: File, opts?: Parameters<typeof parseReport>[2]) => parseReport(file, 'kahoot', opts);
export const parseBlooketReport = (file: File, opts?: Parameters<typeof parseReport>[2]) => parseReport(file, 'blooket', opts);
export const parseMyiMathsReport = (file: File, opts?: Parameters<typeof parseReport>[2]) => parseReport(file, 'myimaths', opts);
export const parseDrFrostReport = (file: File, opts?: Parameters<typeof parseReport>[2]) => parseReport(file, 'drfrost', opts);
export const parseManageBacReport = (file: File, opts?: Parameters<typeof parseReport>[2]) => parseReport(file, 'managebac', opts);
export const parseGenericReport = (file: File, opts?: Parameters<typeof parseReport>[2]) => parseReport(file, 'manual_csv', opts);

export const PLATFORM_REGISTRY_DEBUG = platformAnalyticsRegistry;
