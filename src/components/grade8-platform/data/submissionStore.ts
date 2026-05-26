/**
 * Multimedia submission store.
 *
 * Stores files the student uploads for an assignment (or just "to the
 * teacher"). Each upload becomes a record with:
 *
 *   • a unique id,
 *   • the student id who uploaded it,
 *   • the original file name + mime type + size,
 *   • a data URL of the file content (base64) so we can render it
 *     inline AND survive a reload without a backend,
 *   • an optional assignment id linking it to a posted assignment,
 *   • an optional teacher note.
 *
 * Storage lives in localStorage. The data URL strategy is fine for the
 * file sizes a school typically uploads (sub-10 MB). Anything larger
 * needs a Firestore Storage swap — the public API will stay the same.
 *
 * Like the other stores in this folder it exposes a stable cached
 * snapshot + a subscribe() so React's useSyncExternalStore can listen
 * without triggering "snapshot is unstable" loops.
 */

import type { SubjectId } from '../types';

const STORAGE_KEY = 'eis-submissions-v1';
const EVENT_NAME = 'eis-submissions-changed';
/** Hard cap (in bytes) — refuse anything bigger so we don't blow out
 *  localStorage's ~5 MB quota in one click. Roughly 8 MB raw → ~10 MB
 *  base64. */
export const MAX_FILE_BYTES = 8 * 1024 * 1024;

export type SubmissionMediaKind = 'document' | 'image' | 'video' | 'audio' | 'other';

export type SubmissionFile = {
  id: string;
  studentId: string;
  studentName: string;
  /** Optional — links the upload to a specific assignment. */
  assignmentId?: string;
  assignmentTitle?: string;
  subject?: SubjectId;
  filename: string;
  mimeType: string;
  size: number;
  kind: SubmissionMediaKind;
  /** `data:<mime>;base64,…` URL — directly usable as an img / video / audio src. */
  dataUrl: string;
  note?: string;
  uploadedAt: string;
};

function read(): SubmissionFile[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

let cached: SubmissionFile[] = [];
let cacheLoaded = false;

function refreshCache() {
  cached = read().slice().sort((a, b) => b.uploadedAt.localeCompare(a.uploadedAt));
  cacheLoaded = true;
}

function write(next: SubmissionFile[]) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  refreshCache();
  window.dispatchEvent(new CustomEvent(EVENT_NAME));
}

function classify(mimeType: string): SubmissionMediaKind {
  if (mimeType.startsWith('image/')) return 'image';
  if (mimeType.startsWith('video/')) return 'video';
  if (mimeType.startsWith('audio/')) return 'audio';
  if (
    mimeType === 'application/pdf' ||
    mimeType.startsWith('application/vnd.openxmlformats') ||
    mimeType === 'application/msword' ||
    mimeType.startsWith('text/')
  ) {
    return 'document';
  }
  return 'other';
}

function id(): string {
  return `sub-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
}

/** Convert a File to a base64 data URL. */
function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = () => reject(reader.error || new Error('Read failed'));
    reader.readAsDataURL(file);
  });
}

// ── Public API ───────────────────────────────────────────────────────

export function listSubmissions(): SubmissionFile[] {
  if (!cacheLoaded) refreshCache();
  return cached;
}

export function listForStudent(studentId: string): SubmissionFile[] {
  return listSubmissions().filter((s) => s.studentId === studentId);
}

export function listForAssignment(assignmentId: string): SubmissionFile[] {
  return listSubmissions().filter((s) => s.assignmentId === assignmentId);
}

export async function uploadSubmission(input: {
  file: File;
  studentId: string;
  studentName: string;
  assignmentId?: string;
  assignmentTitle?: string;
  subject?: SubjectId;
  note?: string;
}): Promise<SubmissionFile | { error: string }> {
  const { file } = input;
  if (file.size > MAX_FILE_BYTES) {
    return {
      error: `File too large (${(file.size / (1024 * 1024)).toFixed(1)} MB). Maximum is ${(MAX_FILE_BYTES / (1024 * 1024)).toFixed(0)} MB.`,
    };
  }
  let dataUrl = '';
  try {
    dataUrl = await fileToDataUrl(file);
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Read failed' };
  }
  const record: SubmissionFile = {
    id: id(),
    studentId: input.studentId,
    studentName: input.studentName,
    assignmentId: input.assignmentId,
    assignmentTitle: input.assignmentTitle,
    subject: input.subject,
    filename: file.name,
    mimeType: file.type || 'application/octet-stream',
    size: file.size,
    kind: classify(file.type || ''),
    dataUrl,
    note: input.note?.trim() || undefined,
    uploadedAt: new Date().toISOString(),
  };
  const existing = read();
  write([record, ...existing]);
  return record;
}

export function deleteSubmission(id: string) {
  write(read().filter((s) => s.id !== id));
}

export function subscribe(listener: () => void): () => void {
  if (typeof window === 'undefined') return () => undefined;
  const handler = () => listener();
  window.addEventListener(EVENT_NAME, handler);
  window.addEventListener('storage', handler);
  return () => {
    window.removeEventListener(EVENT_NAME, handler);
    window.removeEventListener('storage', handler);
  };
}
