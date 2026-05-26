'use client';

import React, { useMemo, useRef, useState, useSyncExternalStore } from 'react';
import {
  Camera,
  Check,
  FileText,
  Film,
  Headphones,
  Image as ImageIcon,
  Loader2,
  Mic,
  Paperclip,
  Trash2,
  Upload,
  Users,
} from 'lucide-react';
import {
  type SubmissionFile,
  type SubmissionMediaKind,
  deleteSubmission,
  listSubmissions,
  subscribe,
  uploadSubmission,
} from '../../data/submissionStore';
import { listAssignments } from '../../data/assignmentStore';
import type { SubjectId } from '../../types';

/**
 * Student / teacher submissions tab.
 *
 * Student view (`mode === 'student'`):
 *   • Drop-zone or "Choose files" picker that accepts images, video,
 *     audio, PDF / Word / text — anything mime-typeable.
 *   • Optional "Attach to assignment" dropdown so submissions can be
 *     linked to a specific assignment posted by the teacher.
 *   • Optional one-line note.
 *   • The student's existing uploads listed below, grouped by date,
 *     with type-specific previews (image, audio, video, pdf-link).
 *
 * Teacher view (`mode === 'teacher'`):
 *   • Aggregated view of EVERY student's uploads with filter buttons
 *     for type (image, video, audio, doc).
 *   • Each row shows student name, filename, type pill and a preview
 *     trigger.
 */

const DEMO_STUDENT = {
  id:
    (typeof window !== 'undefined' && window.localStorage.getItem('eis-student-id')) ||
    'demo-student',
  name:
    (typeof window !== 'undefined' && window.localStorage.getItem('eis-student-name')) ||
    'Demo Student',
};

const KIND_ICON: Record<SubmissionMediaKind, typeof FileText> = {
  document: FileText,
  image: ImageIcon,
  video: Film,
  audio: Headphones,
  other: Paperclip,
};

function useSubmissions() {
  return useSyncExternalStore(subscribe, listSubmissions, () => [] as SubmissionFile[]);
}

function bytes(n: number): string {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(1)} MB`;
}

// ── Student uploader ────────────────────────────────────────────────

function StudentUploader({ subject }: { subject?: SubjectId }) {
  const all = useSubmissions();
  const mine = all.filter((s) => s.studentId === DEMO_STUDENT.id);
  const assignments = useMemo(() => listAssignments(), []);
  const subjectAssignments = subject
    ? assignments.filter((a) => a.subject === subject)
    : assignments;

  const [assignmentId, setAssignmentId] = useState<string>('');
  const [note, setNote] = useState('');
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);

  const onFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setError(null);
    setSuccess(null);
    setUploading(true);
    try {
      const chosen = assignmentId
        ? subjectAssignments.find((a) => a.id === assignmentId)
        : undefined;
      for (const file of Array.from(files)) {
        const res = await uploadSubmission({
          file,
          studentId: DEMO_STUDENT.id,
          studentName: DEMO_STUDENT.name,
          assignmentId: chosen?.id,
          assignmentTitle: chosen?.title,
          subject: chosen?.subject ?? subject,
          note: note.trim() || undefined,
        });
        if ('error' in res) {
          setError(res.error);
          break;
        }
      }
      setSuccess(`Uploaded ${files.length} file${files.length === 1 ? '' : 's'}`);
      setNote('');
      setTimeout(() => setSuccess(null), 2500);
    } finally {
      setUploading(false);
    }
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    void onFiles(e.dataTransfer.files);
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <header>
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">
          My submissions
        </p>
        <h1 className="mt-1 text-2xl font-black text-slate-900">Upload your work</h1>
        <p className="mt-1 text-sm text-slate-600">
          Pictures, screenshots, documents, video and audio — drag them in or pick
          from your device. Files are linked to the assignment you choose.
        </p>
      </header>

      {/* Picker controls */}
      <div className="grid gap-3 sm:grid-cols-3">
        <label className="text-[10px] font-bold uppercase tracking-wide text-slate-500">
          Attach to assignment <span className="font-normal text-slate-400">(optional)</span>
          <select
            value={assignmentId}
            onChange={(e) => setAssignmentId(e.target.value)}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm normal-case text-slate-800 outline-none focus:border-blue-500"
          >
            <option value="">Not linked</option>
            {subjectAssignments.map((a) => (
              <option key={a.id} value={a.id}>
                {a.title}
              </option>
            ))}
          </select>
        </label>
        <label className="text-[10px] font-bold uppercase tracking-wide text-slate-500 sm:col-span-2">
          Note for the teacher <span className="font-normal text-slate-400">(optional)</span>
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Anything they should know about this submission"
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm normal-case text-slate-800 outline-none focus:border-blue-500"
          />
        </label>
      </div>

      {/* Drop zone */}
      <div
        onDrop={onDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => fileInputRef.current?.click()}
        className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 px-4 py-10 text-center transition hover:border-blue-400 hover:bg-blue-50/40"
      >
        {uploading ? (
          <>
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            <p className="text-sm font-bold text-slate-700">Uploading…</p>
          </>
        ) : (
          <>
            <Upload className="h-8 w-8 text-blue-500" />
            <p className="text-base font-black text-slate-900">Drop files here</p>
            <p className="text-xs text-slate-500">
              or click to pick from your device · up to 8 MB per file
            </p>
          </>
        )}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          accept="image/*,video/*,audio/*,application/pdf,.doc,.docx,.txt"
          onChange={(e) => onFiles(e.target.files)}
        />
      </div>

      {/* Quick capture buttons (mobile / iPad) — opens the camera or
          mic directly via `capture` attribute. */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => cameraInputRef.current?.click()}
          className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50"
        >
          <Camera className="h-4 w-4 text-rose-500" />
          Take photo / video
        </button>
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*,video/*"
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore — `capture` is non-standard but widely supported.
          capture="environment"
          className="hidden"
          onChange={(e) => onFiles(e.target.files)}
        />
        <button
          onClick={() => audioInputRef.current?.click()}
          className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50"
        >
          <Mic className="h-4 w-4 text-purple-500" />
          Record audio
        </button>
        <input
          ref={audioInputRef}
          type="file"
          accept="audio/*"
          // @ts-ignore
          capture="user"
          className="hidden"
          onChange={(e) => onFiles(e.target.files)}
        />
      </div>

      {success && (
        <div className="inline-flex items-center gap-2 rounded-md bg-emerald-100 px-3 py-2 text-sm font-bold text-emerald-700">
          <Check className="h-4 w-4" /> {success}
        </div>
      )}
      {error && (
        <div className="rounded-md bg-red-100 px-3 py-2 text-sm font-bold text-red-700">
          {error}
        </div>
      )}

      {/* Existing uploads */}
      <section>
        <h2 className="mb-3 text-sm font-black uppercase tracking-wide text-slate-500">
          Your uploads ({mine.length})
        </h2>
        {mine.length === 0 ? (
          <p className="rounded-md border border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
            Nothing uploaded yet.
          </p>
        ) : (
          <SubmissionGrid submissions={mine} canDelete />
        )}
      </section>
    </div>
  );
}

// ── Teacher view ───────────────────────────────────────────────────

function TeacherView() {
  const all = useSubmissions();
  const [filter, setFilter] = useState<SubmissionMediaKind | 'all'>('all');
  const filtered = filter === 'all' ? all : all.filter((s) => s.kind === filter);

  const counts: Record<SubmissionMediaKind | 'all', number> = {
    all: all.length,
    document: 0,
    image: 0,
    video: 0,
    audio: 0,
    other: 0,
  };
  all.forEach((s) => {
    counts[s.kind] += 1;
  });

  const FILTER_BUTTONS: { id: SubmissionMediaKind | 'all'; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'image', label: 'Images' },
    { id: 'video', label: 'Video' },
    { id: 'audio', label: 'Audio' },
    { id: 'document', label: 'Docs' },
    { id: 'other', label: 'Other' },
  ];

  return (
    <div className="space-y-5">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">
            Class submissions
          </p>
          <h1 className="mt-1 text-2xl font-black text-slate-900">
            <Users className="mr-1.5 inline h-5 w-5 text-blue-500" />
            Student uploads ({all.length})
          </h1>
        </div>
        <div className="flex flex-wrap gap-1">
          {FILTER_BUTTONS.map((b) => (
            <button
              key={b.id}
              onClick={() => setFilter(b.id)}
              className={`rounded-md px-3 py-1.5 text-xs font-bold transition ${
                filter === b.id
                  ? 'bg-blue-600 text-white'
                  : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
              }`}
            >
              {b.label} <span className="ml-1 text-[10px] opacity-70">({counts[b.id]})</span>
            </button>
          ))}
        </div>
      </header>

      {filtered.length === 0 ? (
        <p className="rounded-md border border-dashed border-slate-300 bg-slate-50 px-4 py-12 text-center text-sm text-slate-500">
          No submissions in this filter.
        </p>
      ) : (
        <SubmissionGrid submissions={filtered} />
      )}
    </div>
  );
}

// ── Shared grid + preview ──────────────────────────────────────────

function SubmissionGrid({
  submissions,
  canDelete,
}: {
  submissions: SubmissionFile[];
  canDelete?: boolean;
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {submissions.map((s) => (
        <SubmissionCard key={s.id} submission={s} canDelete={canDelete} />
      ))}
    </div>
  );
}

function SubmissionCard({
  submission: s,
  canDelete,
}: {
  submission: SubmissionFile;
  canDelete?: boolean;
}) {
  const Icon = KIND_ICON[s.kind];
  return (
    <article className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="grid h-40 place-items-center bg-slate-100">
        {s.kind === 'image' && (
          <img src={s.dataUrl} alt={s.filename} className="h-full w-full object-cover" />
        )}
        {s.kind === 'video' && (
          <video src={s.dataUrl} controls className="h-full w-full object-cover" />
        )}
        {s.kind === 'audio' && (
          <div className="w-full p-4">
            <audio src={s.dataUrl} controls className="w-full" />
          </div>
        )}
        {(s.kind === 'document' || s.kind === 'other') && (
          <a
            href={s.dataUrl}
            download={s.filename}
            target="_blank"
            rel="noreferrer"
            className="flex flex-col items-center gap-2 text-slate-500 hover:text-slate-800"
          >
            <Icon className="h-12 w-12" />
            <span className="text-xs font-bold">Open</span>
          </a>
        )}
      </div>
      <div className="p-3">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-black text-slate-900">{s.filename}</p>
            <p className="text-[10px] text-slate-500">
              {s.studentName} · {bytes(s.size)}
              {s.assignmentTitle ? ` · ${s.assignmentTitle}` : ''}
            </p>
          </div>
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-slate-600">
            <Icon className="h-3 w-3" />
            {s.kind}
          </span>
        </div>
        {s.note && (
          <p className="mt-2 rounded-md bg-amber-50 px-2 py-1.5 text-xs text-amber-900">{s.note}</p>
        )}
        {canDelete && (
          <button
            onClick={() => {
              if (confirm(`Delete ${s.filename}?`)) deleteSubmission(s.id);
            }}
            className="mt-2 inline-flex items-center gap-1 rounded-md border border-red-200 bg-red-50 px-2 py-1 text-[10px] font-bold text-red-700 hover:bg-red-100"
          >
            <Trash2 className="h-3 w-3" /> Delete
          </button>
        )}
      </div>
    </article>
  );
}

// ── Public entry ───────────────────────────────────────────────────

export function SubmissionsView({
  mode,
  subject,
}: {
  mode: 'teacher' | 'student';
  subject?: SubjectId;
}) {
  return mode === 'student' ? <StudentUploader subject={subject} /> : <TeacherView />;
}
