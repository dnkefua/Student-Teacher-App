'use client';

import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { AlertTriangle, CheckCircle2, FileSpreadsheet, Loader2, UploadCloud, Wand2, X } from 'lucide-react';
import type { ColumnMapping, ExternalPlatform, ImportParseResult, LearningEvent } from '@/lib/learningHub/types';
import { parseReport } from '@/lib/learningHub/importers/generic';
import { platformAnalyticsRegistry } from '@/lib/learningHub/platformRegistry';
import { saveImportWithEvents } from '@/lib/learningHub/repository';
import { ColumnMapper } from './ColumnMapper';

const SUPPORTED_PLATFORMS: ExternalPlatform[] = [
  'kahoot',
  'blooket',
  'drfrost',
  'myimaths',
  'managebac',
  'manual_csv',
];

type Props = { defaultPlatform?: ExternalPlatform; onImported: (events: LearningEvent[]) => void };
type Phase = 'idle' | 'parsing' | 'parsed' | 'saved' | 'error';

type Confidence = 'high' | 'medium' | 'low';

function detectConfidence(result: ImportParseResult): Confidence {
  if (result.events.length === 0) return 'low';
  const sample = result.events[0];
  const hasStudent = Boolean(sample.externalStudentName || sample.externalEmail);
  const hasActivity = Boolean(sample.activityTitle || sample.topic);
  const hasScore =
    sample.score !== undefined || sample.accuracy !== undefined || sample.isCorrect !== undefined;
  const hasDate = Boolean(sample.occurredAt);
  if (hasStudent && hasActivity && hasScore && hasDate) return 'high';
  if (hasStudent && hasActivity) return 'medium';
  return 'low';
}

export function UploadReports({ defaultPlatform, onImported }: Props) {
  const [platform, setPlatform] = useState<ExternalPlatform>(defaultPlatform ?? 'kahoot');
  const [phase, setPhase] = useState<Phase>('idle');
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<ImportParseResult | null>(null);
  const [confidence, setConfidence] = useState<Confidence | null>(null);
  const [mapping, setMapping] = useState<ColumnMapping | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [savedSource, setSavedSource] = useState<'firestore' | 'local' | null>(null);

  const accept = {
    'text/csv': ['.csv'],
    'application/vnd.ms-excel': ['.xls'],
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
  };

  const onDrop = async (files: File[]) => {
    const picked = files[0];
    if (!picked) return;
    setFile(picked);
    setError(null);
    setResult(null);
    setMapping(null);
    setSavedSource(null);
    setPhase('parsing');
    try {
      const parsed = await parseReport(picked, platform, { uploadedBy: 'demo-teacher' });
      setResult(parsed);
      setConfidence(detectConfidence(parsed));
      setPhase('parsed');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not parse the file.');
      setPhase('error');
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxFiles: 1,
    maxSize: 15 * 1024 * 1024,
  });

  const save = async () => {
    if (!result) return;
    const final: ImportParseResult = {
      ...result,
      importRecord: { ...result.importRecord, importStatus: 'saved', savedAt: new Date().toISOString() },
    };
    const { source } = await saveImportWithEvents({ importRecord: final.importRecord, events: final.events });
    setSavedSource(source);
    onImported(final.events);
    setPhase('saved');
    window.setTimeout(() => setPhase('parsed'), 1800);
  };

  const reset = () => {
    setFile(null);
    setResult(null);
    setError(null);
    setMapping(null);
    setSavedSource(null);
    setPhase('idle');
  };

  const showMapper = confidence === 'low' || platform === 'manual_csv' || platform === 'custom';

  return (
    <section className="space-y-4">
      <div className="rounded-lg border border-white/10 bg-[#061126]/80 p-5 backdrop-blur">
        <p className="text-xs font-black uppercase tracking-wide text-[#ffc43b]">1 · Choose source platform</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {SUPPORTED_PLATFORMS.map((p) => (
            <button
              key={p}
              onClick={() => setPlatform(p)}
              className={`rounded-md border px-3 py-1.5 text-xs font-black uppercase tracking-wide transition ${
                platform === p
                  ? 'border-[#49c8ff] bg-[#49c8ff]/10 text-[#8ddfff]'
                  : 'border-white/15 text-slate-300 hover:border-white/35'
              }`}
            >
              {platformAnalyticsRegistry[p].displayName}
            </button>
          ))}
        </div>
        <p className="mt-3 text-[11px] text-slate-400">
          If your spreadsheet layout is unusual, map the columns manually before saving.
        </p>
      </div>

      <div className="rounded-lg border border-white/10 bg-[#061126]/80 p-5 backdrop-blur">
        <p className="text-xs font-black uppercase tracking-wide text-[#ffc43b]">2 · Drop your CSV or XLSX</p>
        <div
          {...getRootProps()}
          className={`mt-3 cursor-pointer rounded-lg border-2 border-dashed p-6 text-center transition ${
            isDragActive ? 'border-[#49c8ff] bg-[#49c8ff]/5' : 'border-white/15 hover:border-[#49c8ff]/60 hover:bg-white/[0.03]'
          }`}
        >
          <input {...getInputProps()} />
          <UploadCloud className="mx-auto h-7 w-7 text-[#8ddfff]" />
          <p className="mt-2 text-sm font-semibold text-white">
            {isDragActive ? 'Drop here…' : 'Drag-and-drop or click to upload'}
          </p>
          <p className="mt-1 text-[11px] text-slate-400">CSV or XLSX · max 15 MB</p>
        </div>

        {file ? (
          <div className="mt-4 flex items-center justify-between rounded-md border border-white/10 bg-white/[0.03] p-3">
            <div className="flex items-center gap-3">
              <FileSpreadsheet className="h-4 w-4 text-[#ffc43b]" />
              <div>
                <p className="text-sm font-black text-white">{file.name}</p>
                <p className="text-[11px] text-slate-400">{(file.size / 1024).toFixed(0)} KB</p>
              </div>
            </div>
            <button onClick={reset} className="text-slate-400 transition hover:text-white" title="Clear">
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : null}

        {phase === 'parsing' ? (
          <p className="mt-3 inline-flex items-center gap-2 text-xs text-slate-300">
            <Loader2 className="h-3 w-3 animate-spin" />
            Parsing &amp; normalising…
          </p>
        ) : null}

        {error ? (
          <p className="mt-3 rounded-md border border-red-300/30 bg-red-300/10 px-3 py-2 text-sm font-semibold text-red-100">{error}</p>
        ) : null}
      </div>

      {result ? (
        <div className="rounded-lg border border-white/10 bg-[#061126]/80 p-5 backdrop-blur">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs font-black uppercase tracking-wide text-[#ffc43b]">3 · Review &amp; save</p>
            <div className="flex flex-wrap gap-2">
              <span
                className={`rounded-full border px-2 py-0.5 text-[10px] font-black uppercase tracking-wide ${
                  confidence === 'high'
                    ? 'border-emerald-300/30 bg-emerald-300/10 text-emerald-200'
                    : confidence === 'medium'
                    ? 'border-[#ffc43b]/30 bg-[#ffc43b]/10 text-[#ffe08a]'
                    : 'border-[#ff3d22]/30 bg-[#ff3d22]/10 text-[#ff8a73]'
                }`}
              >
                parser · {confidence}
              </span>
              <span className="rounded-full border border-white/15 bg-white/5 px-2 py-0.5 text-[10px] font-black uppercase tracking-wide text-slate-200">
                {result.events.length} events ready
              </span>
            </div>
          </div>

          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            <div className="rounded-md border border-white/10 bg-white/[0.03] p-3">
              <p className="text-[10px] uppercase tracking-wide text-slate-500">Rows</p>
              <p className="text-lg font-black text-white">{result.rows.length}</p>
            </div>
            <div className="rounded-md border border-white/10 bg-white/[0.03] p-3">
              <p className="text-[10px] uppercase tracking-wide text-slate-500">Columns detected</p>
              <p className="text-lg font-black text-white">{result.detectedColumns.length}</p>
            </div>
            <div className="rounded-md border border-white/10 bg-white/[0.03] p-3">
              <p className="text-[10px] uppercase tracking-wide text-slate-500">Warnings</p>
              <p className="text-lg font-black text-white">{result.warnings.length}</p>
            </div>
          </div>

          {result.warnings.length > 0 ? (
            <ul className="mt-3 space-y-1 rounded-md border border-amber-300/20 bg-amber-300/5 p-3 text-[11px] leading-5 text-amber-200">
              {result.warnings.map((w, i) => (
                <li key={i} className="flex items-start gap-2">
                  <AlertTriangle className="mt-0.5 h-3 w-3 shrink-0" />
                  {w}
                </li>
              ))}
            </ul>
          ) : null}

          {showMapper ? (
            <div className="mt-4">
              <ColumnMapper
                result={result}
                platform={platform}
                onApply={(next, m) => {
                  setResult(next);
                  setMapping(m);
                  setConfidence(detectConfidence(next));
                }}
              />
            </div>
          ) : null}

          <div className="mt-4 overflow-x-auto rounded-md border border-white/10 bg-[#050711]/70">
            <table className="min-w-[640px] text-left text-xs text-slate-200">
              <thead className="bg-white/[0.03] text-[10px] uppercase tracking-wide text-slate-400">
                <tr>
                  <th className="px-3 py-2">Student</th>
                  <th className="px-3 py-2">Activity</th>
                  <th className="px-3 py-2">Topic</th>
                  <th className="px-3 py-2">Score</th>
                  <th className="px-3 py-2">Signal</th>
                </tr>
              </thead>
              <tbody>
                {result.events.slice(0, 8).map((e) => (
                  <tr key={e.id} className="border-t border-white/5">
                    <td className="px-3 py-2 text-white">{e.externalStudentName ?? '—'}</td>
                    <td className="max-w-[220px] truncate px-3 py-2">{e.activityTitle ?? '—'}</td>
                    <td className="px-3 py-2">{e.topic ?? '—'}</td>
                    <td className="px-3 py-2">{e.score !== undefined ? `${Math.round(e.score)}%` : e.accuracy !== undefined ? `${Math.round(e.accuracy)}%` : '—'}</td>
                    <td className="px-3 py-2">{e.masterySignal ?? 'unknown'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <button
              onClick={() => void save()}
              className={`inline-flex items-center gap-2 rounded-md px-4 py-2.5 text-sm font-black transition ${
                phase === 'saved'
                  ? 'bg-emerald-400 text-[#061126] shadow-[0_0_24px_rgba(74,222,128,.55)]'
                  : 'animate-eis-pulse bg-[#49c8ff] text-[#061126] shadow-[0_0_22px_rgba(73,200,255,.35)] hover:bg-[#8ddfff]'
              }`}
            >
              {phase === 'saved' ? <CheckCircle2 className="h-4 w-4" /> : <Wand2 className="h-4 w-4" />}
              {phase === 'saved' ? 'Saved to Learning Events' : 'Save to Learning Events'}
            </button>
            {mapping ? (
              <span className="text-[11px] uppercase tracking-wide text-[#ffe08a]">Manual mapping applied</span>
            ) : null}
            {savedSource ? (
              <span className="text-[11px] uppercase tracking-wide text-slate-400">
                Persistence · <span className={savedSource === 'firestore' ? 'text-[#8ddfff]' : 'text-[#ffe08a]'}>{savedSource}</span>
              </span>
            ) : null}
          </div>
        </div>
      ) : null}
    </section>
  );
}
