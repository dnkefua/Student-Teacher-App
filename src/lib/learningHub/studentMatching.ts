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

/** Tiered similarity per the Phase 5 brief. Returns a confidence in [0, 1].
 *  Rule order:
 *    - exact normalized name       → 0.95
 *    - first + last token match    → 0.85
 *    - one name fully contains other → 0.70
 *    - fuzzy token-overlap (Jaccard) → 0.40 – 0.65
 *    - no overlap                  → 0
 *  Email match is handled by the caller and clamps to 0.99 separately. */
export function calculateNameSimilarity(a: string, b: string): number {
  const an = normalizeStudentName(a);
  const bn = normalizeStudentName(b);
  if (!an || !bn) return 0;
  if (an === bn) return 0.95;

  const at = an.split(' ').filter(Boolean);
  const bt = bn.split(' ').filter(Boolean);
  const aSet = new Set(at);
  const bSet = new Set(bt);
  const intersect = at.filter((t) => bSet.has(t)).length;
  const union = new Set<string>([...at, ...bt]);

  // First + last token both match (handles ordered "Aisha Khan" vs "Khan Aisha").
  if (at.length >= 2 && bt.length >= 2) {
    const aFirst = at[0];
    const aLast = at[at.length - 1];
    const bFirst = bt[0];
    const bLast = bt[bt.length - 1];
    const firstMatch = aFirst === bFirst || aFirst === bLast;
    const lastMatch = aLast === bLast || aLast === bFirst;
    if (firstMatch && lastMatch) return 0.85;
  }

  // One side fully contains the other (handles "A Khan" vs "Aisha Khan").
  if (an.includes(bn) || bn.includes(an)) return 0.7;

  // Fuzzy overlap.
  if (union.size === 0) return 0;
  const jaccard = intersect / union.size;
  if (jaccard >= 0.6) return 0.65;
  if (jaccard >= 0.4) return 0.55;
  if (jaccard >= 0.2) return 0.4;
  return 0;
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
    // Exact email match wins outright (confidence 0.99 per the brief).
    if (entry.externalEmail) {
      const emailNorm = entry.externalEmail.toLowerCase().trim();
      const rosterMatch = roster.find((r) =>
        r.name.toLowerCase().replace(/\s+/g, '.').includes(emailNorm.split('@')[0]),
      );
      if (rosterMatch) best = { id: rosterMatch.id, name: rosterMatch.name, score: 0.99 };
    }
    if (!best) {
      for (const student of roster) {
        const score = calculateNameSimilarity(entry.externalName, student.name);
        if (!best || score > best.score) best = { id: student.id, name: student.name, score };
      }
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
