// Maps external names ("aishak", "Aisha K", "khan_a") onto known EIS roster
// entries with a confidence score. Deterministic so the demo is reproducible.

import type { LearningEvent, PlatformStudentMapping } from './types';
import { DEMO_SCHOOL_ID } from './types';

export const DEMO_ROSTER: { id: string; name: string; classId?: string }[] = [
  { id: 'stu-aisha-khan', name: 'Aisha Khan', classId: 'class-grade8a' },
  { id: 'stu-omar-al-farsi', name: 'Omar Al Farsi', classId: 'class-grade8a' },
  { id: 'stu-maryam-hassan', name: 'Maryam Hassan', classId: 'class-grade8a' },
  { id: 'stu-daniel-okafor', name: 'Daniel Okafor', classId: 'class-grade8a' },
  { id: 'stu-sofia-rahman', name: 'Sofia Rahman', classId: 'class-grade8a' },
  { id: 'stu-ahmed-ali', name: 'Ahmed Ali', classId: 'class-grade8a' },
  { id: 'stu-noor-haddad', name: 'Noor Haddad', classId: 'class-grade8b' },
  { id: 'stu-ethan-williams', name: 'Ethan Williams', classId: 'class-grade8b' },
  { id: 'stu-layla-mansour', name: 'Layla Mansour', classId: 'class-grade8b' },
  { id: 'stu-yusuf-khan', name: 'Yusuf Khan', classId: 'class-grade8b' },
  { id: 'stu-priya-nair', name: 'Priya Nair', classId: 'class-grade8b' },
  { id: 'stu-leo-chen', name: 'Leo Chen', classId: 'class-grade8b' },
];

export function normalizeStudentName(name: string | undefined): string {
  if (!name) return '';
  return name.toString().toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
}

/** Cheap Jaccard-on-tokens score [0, 1]. Sufficient for typo-tolerance and
 *  reordered names ("Khan Aisha" ↔ "Aisha Khan"). */
export function calculateNameSimilarity(a: string, b: string): number {
  const an = normalizeStudentName(a);
  const bn = normalizeStudentName(b);
  if (!an || !bn) return 0;
  if (an === bn) return 1;
  const at = new Set(an.split(' ').filter(Boolean));
  const bt = new Set(bn.split(' ').filter(Boolean));
  let intersect = 0;
  at.forEach((t) => { if (bt.has(t)) intersect++; });
  const union = new Set<string>();
  at.forEach((t) => union.add(t));
  bt.forEach((t) => union.add(t));
  if (union.size === 0) return 0;
  let score = intersect / union.size;
  // Bonus when the longest shared token matches at least 4 chars.
  for (const t of at) if (bt.has(t) && t.length >= 4) score += 0.1;
  // Bonus when initial+surname matches (e.g. "a khan" vs "aisha khan").
  const aLast = an.split(' ').pop();
  const bLast = bn.split(' ').pop();
  if (aLast && bLast && aLast === bLast) score += 0.15;
  return Math.min(1, score);
}

export type SuggestedMapping = {
  externalName: string;
  externalEmail?: string;
  studentId: string;
  studentDisplayName: string;
  confidence: number;
  eventCount: number;
};

export function suggestStudentMappings(
  events: LearningEvent[],
  roster: { id: string; name: string }[] = DEMO_ROSTER,
): SuggestedMapping[] {
  const grouped = new Map<string, { externalName: string; externalEmail?: string; count: number }>();
  for (const evt of events) {
    if (!evt.externalStudentName) continue;
    const key = `${evt.externalStudentName}|${evt.externalEmail ?? ''}`;
    const existing = grouped.get(key);
    if (existing) existing.count += 1;
    else
      grouped.set(key, {
        externalName: evt.externalStudentName,
        externalEmail: evt.externalEmail,
        count: 1,
      });
  }

  const suggestions: SuggestedMapping[] = [];
  for (const entry of grouped.values()) {
    let best: { id: string; name: string; score: number } | null = null;
    for (const student of roster) {
      const score = calculateNameSimilarity(entry.externalName, student.name);
      if (!best || score > best.score) best = { id: student.id, name: student.name, score };
    }
    if (best) {
      suggestions.push({
        externalName: entry.externalName,
        externalEmail: entry.externalEmail,
        studentId: best.id,
        studentDisplayName: best.name,
        confidence: Math.round(best.score * 100) / 100,
        eventCount: entry.count,
      });
    }
  }
  return suggestions.sort((a, b) => b.eventCount - a.eventCount);
}

export function applyStudentMappings(
  events: LearningEvent[],
  mappings: PlatformStudentMapping[],
): LearningEvent[] {
  if (mappings.length === 0) return events;
  const byKey = new Map<string, PlatformStudentMapping>();
  for (const m of mappings) {
    if (m.externalName) byKey.set(`${m.platform}|${normalizeStudentName(m.externalName)}`, m);
    if (m.externalEmail) byKey.set(`${m.platform}|${m.externalEmail.toLowerCase()}`, m);
  }
  return events.map((evt) => {
    if (evt.studentId) return evt;
    const byName = evt.externalStudentName
      ? byKey.get(`${evt.platform}|${normalizeStudentName(evt.externalStudentName)}`)
      : undefined;
    const byEmail = evt.externalEmail
      ? byKey.get(`${evt.platform}|${evt.externalEmail.toLowerCase()}`)
      : undefined;
    const match = byName ?? byEmail;
    if (!match) return evt;
    return { ...evt, studentId: match.studentId, mappedStudentName: match.studentDisplayName };
  });
}

export function buildMappingFromSuggestion(s: SuggestedMapping, platform: LearningEvent['platform']): PlatformStudentMapping {
  return {
    id: `${platform}-${s.studentId}-${Date.now()}`,
    schoolId: DEMO_SCHOOL_ID,
    platform,
    externalName: s.externalName,
    externalEmail: s.externalEmail,
    studentId: s.studentId,
    studentDisplayName: s.studentDisplayName,
    confidence: s.confidence,
    verifiedByTeacher: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}
