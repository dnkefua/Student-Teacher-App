'use client';

import { useMemo, useState } from 'react';
import { Wand2 } from 'lucide-react';
import type { ColumnMapping, ExternalPlatform, ImportParseResult } from '@/lib/learningHub/types';
import { createLearningEventFromRow } from '@/lib/learningHub/eventFactory';

type Field = keyof ColumnMapping;

const FIELDS: { key: Field; label: string }[] = [
  { key: 'studentName', label: 'Student name' },
  { key: 'studentEmail', label: 'Student email' },
  { key: 'activityTitle', label: 'Activity title' },
  { key: 'topic', label: 'Topic' },
  { key: 'concept', label: 'Concept' },
  { key: 'score', label: 'Score' },
  { key: 'maxScore', label: 'Max score' },
  { key: 'accuracy', label: 'Accuracy / percentage' },
  { key: 'durationSeconds', label: 'Duration (seconds)' },
  { key: 'answerTimeSeconds', label: 'Answer time (seconds)' },
  { key: 'questionText', label: 'Question text' },
  { key: 'selectedAnswer', label: 'Selected answer' },
  { key: 'correctAnswer', label: 'Correct answer' },
  { key: 'isCorrect', label: 'Is correct (yes/no)' },
  { key: 'occurredAt', label: 'Date / timestamp' },
];

type Props = {
  result: ImportParseResult;
  platform: ExternalPlatform;
  onApply: (next: ImportParseResult, mapping: ColumnMapping) => void;
};

export function ColumnMapper({ result, platform, onApply }: Props) {
  const [mapping, setMapping] = useState<ColumnMapping>({});
  const detected = result.detectedColumns;

  const previewEvents = useMemo(() => {
    const slice = result.rows.slice(0, 5);
    return slice.map((row) =>
      createLearningEventFromRow({ platform, row, mapping, importId: result.importRecord.id }),
    );
  }, [result, platform, mapping]);

  const apply = () => {
    const remapped = result.rows.map((row) =>
      createLearningEventFromRow({ platform, row, mapping, importId: result.importRecord.id }),
    );
    onApply(
      {
        ...result,
        events: remapped,
        warnings: [...result.warnings, 'Column mapping applied manually by teacher.'],
      },
      mapping,
    );
  };

  return (
    <section className="rounded-lg border border-[#ffc43b]/30 bg-[#ffc43b]/5 p-4">
      <p className="text-xs font-black uppercase tracking-wide text-[#ffe08a]">Manual column mapping</p>
      <p className="mt-1 text-[11px] leading-5 text-slate-300">
        If your spreadsheet layout is unusual, map columns manually before saving. Anything left blank falls back to the
        platform&apos;s registered aliases.
      </p>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {FIELDS.map((f) => (
          <label key={f.key} className="block">
            <span className="text-[10px] font-black uppercase tracking-wide text-slate-300">{f.label}</span>
            <select
              value={mapping[f.key] ?? ''}
              onChange={(e) => setMapping((prev) => ({ ...prev, [f.key]: e.target.value || undefined }))}
              className="mt-1 w-full rounded-md border border-white/10 bg-[#050711]/70 px-3 py-1.5 text-sm text-white"
            >
              <option value="">— skip —</option>
              {detected.map((col) => (
                <option key={col} value={col}>{col}</option>
              ))}
            </select>
          </label>
        ))}
      </div>

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
            {previewEvents.map((e) => (
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

      <button
        onClick={apply}
        className="mt-4 inline-flex items-center gap-2 rounded-md bg-[#ffc43b] px-3 py-2 text-xs font-black text-[#061126] transition hover:bg-[#ffe08a]"
      >
        <Wand2 className="h-3.5 w-3.5" />
        Apply mapping
      </button>
    </section>
  );
}
