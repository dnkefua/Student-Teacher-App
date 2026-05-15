'use client';

import { useMemo, useState } from 'react';
import { Check, UserCheck, X } from 'lucide-react';
import {
  DEMO_ROSTER,
  applyStudentMappings,
  buildMappingFromSuggestion,
  suggestStudentMappings,
} from '@/lib/learningHub/studentMatching';
import type { LearningEvent, PlatformStudentMapping } from '@/lib/learningHub/types';
import { saveMapping } from '@/lib/learningHub/localStore';

type Props = {
  events: LearningEvent[];
  onMappingsApplied: (events: LearningEvent[]) => void;
};

export function StudentMatching({ events, onMappingsApplied }: Props) {
  const initial = useMemo(() => suggestStudentMappings(events), [events]);
  const [suggestions, setSuggestions] = useState(initial);
  const [overrides, setOverrides] = useState<Record<string, string>>({});

  const confirm = (idx: number) => {
    const s = suggestions[idx];
    const studentId = overrides[s.externalName] ?? s.studentId;
    const student = DEMO_ROSTER.find((r) => r.id === studentId);
    if (!student) return;
    const eventsForName = events.filter(
      (e) => e.externalStudentName?.toLowerCase().trim() === s.externalName.toLowerCase().trim(),
    );
    const mapping: PlatformStudentMapping = buildMappingFromSuggestion(
      { ...s, studentId, studentDisplayName: student.name },
      eventsForName[0]?.platform ?? 'manual_csv',
    );
    saveMapping(mapping);
    const updated = applyStudentMappings(events, [mapping]);
    onMappingsApplied(updated);
    setSuggestions((prev) => prev.filter((_, i) => i !== idx));
  };

  const dismiss = (idx: number) => {
    setSuggestions((prev) => prev.filter((_, i) => i !== idx));
  };

  if (suggestions.length === 0) {
    return (
      <section className="rounded-lg border border-emerald-300/30 bg-emerald-300/10 p-4 text-sm leading-6 text-emerald-100">
        Every external student name has been matched to a roster entry. Mastery analytics use the verified mappings.
      </section>
    );
  }

  return (
    <section className="space-y-3">
      <p className="text-xs leading-5 text-slate-300">
        Confirm or override the suggested matches. Confirming creates a PlatformStudentMapping and links every event from
        this external name to the chosen EIS student. Mastery analytics will refresh automatically.
      </p>
      <div className="overflow-x-auto rounded-md border border-white/10 bg-[#050711]/70">
        <table className="min-w-[720px] text-left text-xs text-slate-200">
          <thead className="bg-white/[0.03] text-[10px] uppercase tracking-wide text-slate-400">
            <tr>
              <th className="px-3 py-2">External name</th>
              <th className="px-3 py-2">Email</th>
              <th className="px-3 py-2">Events</th>
              <th className="px-3 py-2">Suggested EIS student</th>
              <th className="px-3 py-2">Confidence</th>
              <th className="px-3 py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {suggestions.map((s, idx) => {
              const override = overrides[s.externalName] ?? s.studentId;
              return (
                <tr key={`${s.externalName}-${idx}`} className="border-t border-white/5">
                  <td className="px-3 py-2 font-black text-white">{s.externalName}</td>
                  <td className="px-3 py-2 text-slate-300">{s.externalEmail ?? '—'}</td>
                  <td className="px-3 py-2">{s.eventCount}</td>
                  <td className="px-3 py-2">
                    <select
                      value={override}
                      onChange={(e) => setOverrides({ ...overrides, [s.externalName]: e.target.value })}
                      className="rounded-md border border-white/10 bg-[#061126] px-2 py-1 text-xs text-white"
                    >
                      {DEMO_ROSTER.map((r) => (
                        <option key={r.id} value={r.id}>{r.name}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-3 py-2">
                    <span className={
                      s.confidence >= 0.8
                        ? 'rounded-full border border-emerald-300/30 bg-emerald-300/10 px-2 py-0.5 text-emerald-200'
                        : s.confidence >= 0.55
                        ? 'rounded-full border border-[#ffc43b]/30 bg-[#ffc43b]/10 px-2 py-0.5 text-[#ffe08a]'
                        : 'rounded-full border border-[#ff3d22]/30 bg-[#ff3d22]/10 px-2 py-0.5 text-[#ff8a73]'
                    }>
                      {Math.round(s.confidence * 100)}%
                    </span>
                  </td>
                  <td className="px-3 py-2 text-right">
                    <div className="inline-flex gap-2">
                      <button onClick={() => confirm(idx)} className="inline-flex items-center gap-1 rounded-md bg-emerald-400 px-2.5 py-1 text-[11px] font-black text-[#061126] transition hover:bg-emerald-300">
                        <Check className="h-3 w-3" /> Confirm
                      </button>
                      <button onClick={() => dismiss(idx)} className="inline-flex items-center gap-1 rounded-md border border-white/15 px-2.5 py-1 text-[11px] font-black text-slate-300 transition hover:border-white/35">
                        <X className="h-3 w-3" /> Ignore
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="flex items-center gap-2 text-[11px] text-slate-400">
        <UserCheck className="h-3.5 w-3.5 text-[#8ddfff]" />
        Confidence is a token-overlap score on normalised names. Confirm any suggestion below 80% before relying on it.
      </p>
    </section>
  );
}
