// XLSX importer — reads every sheet via the xlsx package and surfaces them
// for the UI to pick from.

import * as XLSX from 'xlsx';

export type ParsedSheet = {
  name: string;
  rows: Record<string, unknown>[];
};

export async function parseXlsxFile(file: File): Promise<{ sheets: ParsedSheet[] }> {
  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: 'array' });
  const sheets: ParsedSheet[] = workbook.SheetNames.map((name) => {
    const sheet = workbook.Sheets[name];
    const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: '', raw: false });
    return { name, rows: rows.filter((r) => r && Object.keys(r).length > 0) };
  });
  return { sheets };
}

const PLATFORM_PREFERRED_SHEETS: Record<string, string[]> = {
  kahoot: ['raw report', 'raw data', 'final scores', 'questions', 'overview'],
  blooket: ['overview', 'participant summary', 'homework results', 'student reports'],
  myimaths: ['markbook', 'results', 'class results', 'homework'],
  drfrost: ['worksheet', 'assessment', 'results', 'class results'],
  managebac: ['users', 'classes', 'enrollments', 'results', 'assessments'],
};

export function pickPreferredSheet(
  sheets: ParsedSheet[],
  platform: string,
): { sheet: ParsedSheet; warning?: string } {
  if (sheets.length === 0) {
    throw new Error('No sheets found in workbook.');
  }
  const preferred = PLATFORM_PREFERRED_SHEETS[platform] ?? [];
  for (const target of preferred) {
    const hit = sheets.find((s) => s.name.toLowerCase().trim() === target);
    if (hit && hit.rows.length > 0) return { sheet: hit };
  }
  // Largest sheet by row count wins as a fallback.
  const largest = [...sheets].sort((a, b) => b.rows.length - a.rows.length)[0];
  return {
    sheet: largest,
    warning: `No known sheet name for ${platform}; used "${largest.name}" (${largest.rows.length} rows).`,
  };
}
