// Pure-function mastery engine. Takes LearningEvents and produces per-student
// and per-class profiles plus recommended interventions. No I/O — deterministic
// so tests/demos are reproducible.

import type {
  ClassMasteryProfile,
  ConceptMastery,
  ExternalPlatform,
  LearningEvent,
  MypStrand,
  StudentMasteryProfile,
} from './types';
import { DEMO_SCHOOL_ID } from './types';
import type { ThreeDType } from '@/lib/grade8Curriculum';

const COMPLETION_SCORE: Record<NonNullable<LearningEvent['completionStatus']>, number> = {
  completed: 100,
  partial: 60,
  not_started: 0,
  unknown: 50,
};

function engagementForEvent(evt: LearningEvent): number {
  let score = 50;
  if (evt.completionStatus === 'completed') score += 25;
  if (evt.completionStatus === 'partial') score += 10;
  if (evt.completionStatus === 'not_started') score -= 20;
  if (evt.durationSeconds && evt.durationSeconds > 30) score += 10;
  if (evt.answerTimeSeconds && evt.answerTimeSeconds > 1 && evt.answerTimeSeconds < 60) score += 5;
  if (evt.isCorrect) score += 5;
  return Math.max(0, Math.min(100, score));
}

function scoreOrAccuracy(evt: LearningEvent): number | undefined {
  if (typeof evt.accuracy === 'number') return evt.accuracy;
  if (typeof evt.score === 'number' && typeof evt.maxScore === 'number' && evt.maxScore > 0) {
    return (evt.score / evt.maxScore) * 100;
  }
  if (typeof evt.score === 'number' && evt.score <= 100) return evt.score;
  if (typeof evt.isCorrect === 'boolean') return evt.isCorrect ? 100 : 0;
  return undefined;
}

export function calculateConceptScore(events: LearningEvent[]): number {
  if (events.length === 0) return 0;
  const acc = events.map(scoreOrAccuracy).filter((n): n is number => typeof n === 'number');
  const avgScore = acc.length ? acc.reduce((a, b) => a + b, 0) / acc.length : 50;
  const completion =
    events.reduce((sum, e) => sum + COMPLETION_SCORE[e.completionStatus ?? 'unknown'], 0) /
    events.length;
  const engagement = events.reduce((sum, e) => sum + engagementForEvent(e), 0) / events.length;
  return Math.round((0.7 * avgScore + 0.2 * completion + 0.1 * engagement) * 10) / 10;
}

function confidenceFromCount(n: number): number {
  if (n <= 0) return 0;
  if (n === 1) return 0.25;
  if (n === 2) return 0.4;
  if (n <= 3) return 0.55;
  if (n <= 5) return 0.7;
  if (n <= 8) return 0.85;
  return 0.92;
}

function detectTrend(events: LearningEvent[]): 'improving' | 'stable' | 'declining' {
  const dated = [...events]
    .filter((e) => scoreOrAccuracy(e) !== undefined && e.occurredAt)
    .sort((a, b) => new Date(a.occurredAt).getTime() - new Date(b.occurredAt).getTime());
  if (dated.length < 3) return 'stable';
  const mid = Math.floor(dated.length / 2);
  const firstAvg = dated.slice(0, mid).map(scoreOrAccuracy).reduce<number>((a, b) => a + (b ?? 0), 0) / mid;
  const lastAvg =
    dated.slice(mid).map(scoreOrAccuracy).reduce<number>((a, b) => a + (b ?? 0), 0) /
    (dated.length - mid);
  if (lastAvg - firstAvg >= 8) return 'improving';
  if (firstAvg - lastAvg >= 8) return 'declining';
  return 'stable';
}

const STRAND_TO_3D: Record<MypStrand, ThreeDType> = {
  numerical: 'percentage_bar_3d',
  abstract: 'equation_balance_3d',
  spatial: 'angle_lab_3d',
  data: 'data_visualisation_3d',
  other: 'equation_balance_3d',
};

const TOPIC_TO_3D: { rx: RegExp; type: ThreeDType }[] = [
  { rx: /ratio|proportion|rate/i, type: 'ratio_mixer_3d' },
  { rx: /equation|algebra|expression/i, type: 'equation_balance_3d' },
  { rx: /linear|gradient|intercept|coordinate/i, type: 'linear_graph_3d' },
  { rx: /angle|parallel|triangle/i, type: 'angle_lab_3d' },
  { rx: /circle/i, type: 'circle_lab_3d' },
  { rx: /area|volume|surface|solid/i, type: 'solid_geometry_3d' },
  { rx: /probability/i, type: 'probability_spinner_3d' },
  { rx: /percentage|fraction|decimal/i, type: 'percentage_bar_3d' },
  { rx: /mean|median|mode|range|data|chart|scatter/i, type: 'data_visualisation_3d' },
  { rx: /pythagoras|hypoten|trig/i, type: 'pythagoras_3d' },
];

export function recommendIntervention(topic: string | undefined, strand: MypStrand | undefined): ThreeDType {
  if (topic) {
    for (const r of TOPIC_TO_3D) if (r.rx.test(topic)) return r.type;
  }
  return STRAND_TO_3D[strand ?? 'other'];
}

export function groupEventsByConcept(events: LearningEvent[]): Map<string, LearningEvent[]> {
  const map = new Map<string, LearningEvent[]>();
  for (const evt of events) {
    const key = evt.topic ?? evt.concept ?? evt.activityTitle ?? 'Untagged';
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(evt);
  }
  return map;
}

export function calculateEngagementIndex(events: LearningEvent[]): number {
  if (events.length === 0) return 0;
  return Math.round(events.reduce((sum, e) => sum + engagementForEvent(e), 0) / events.length);
}

function platformStrength(events: LearningEvent[]): { strongest?: ExternalPlatform; weakest?: ExternalPlatform } {
  const byPlatform = new Map<ExternalPlatform, number[]>();
  for (const evt of events) {
    const s = scoreOrAccuracy(evt);
    if (s === undefined) continue;
    if (!byPlatform.has(evt.platform)) byPlatform.set(evt.platform, []);
    byPlatform.get(evt.platform)!.push(s);
  }
  let strongest: ExternalPlatform | undefined;
  let weakest: ExternalPlatform | undefined;
  let strongestAvg = -1;
  let weakestAvg = 999;
  for (const [p, arr] of byPlatform.entries()) {
    const avg = arr.reduce((a, b) => a + b, 0) / arr.length;
    if (avg > strongestAvg) { strongestAvg = avg; strongest = p; }
    if (avg < weakestAvg) { weakestAvg = avg; weakest = p; }
  }
  return { strongest, weakest };
}

export function calculateStudentMastery(
  events: LearningEvent[],
  student: { id: string; name: string; classId?: string; grade?: string },
): StudentMasteryProfile {
  const owned = events.filter((e) => e.studentId === student.id);
  const byConcept = groupEventsByConcept(owned);
  const conceptMastery: Record<string, ConceptMastery> = {};
  for (const [concept, conceptEvents] of byConcept.entries()) {
    const score = calculateConceptScore(conceptEvents);
    const confidence = confidenceFromCount(conceptEvents.length);
    const lastEvidenceAt = conceptEvents
      .map((e) => e.occurredAt)
      .sort()
      .at(-1) ?? new Date().toISOString();
    const sample = conceptEvents.find((e) => e.strand) ?? conceptEvents[0];
    const ps = platformStrength(conceptEvents);
    const recType = recommendIntervention(concept, sample?.strand);
    conceptMastery[concept] = {
      concept,
      topic: concept,
      strand: sample?.strand,
      score,
      confidence,
      evidenceCount: conceptEvents.length,
      lastEvidenceAt,
      strongestPlatform: ps.strongest,
      weakestPlatform: ps.weakest,
      recommendedAction: score < 60 ? `Reteach with ${recType.replace(/_/g, ' ')}` : undefined,
      trend: detectTrend(conceptEvents),
    };
  }

  const overall =
    Object.values(conceptMastery).length === 0
      ? 0
      : Math.round(
          (Object.values(conceptMastery).reduce((a, c) => a + c.score, 0) /
            Object.values(conceptMastery).length) *
            10,
        ) / 10;

  const engagementIndex = calculateEngagementIndex(owned);
  const riskLevel: StudentMasteryProfile['riskLevel'] =
    overall >= 75 ? 'low' : overall >= 55 ? 'medium' : 'high';

  const strengths = Object.values(conceptMastery)
    .filter((c) => c.score >= 75)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((c) => c.concept);

  const weaknesses = Object.values(conceptMastery)
    .filter((c) => c.score < 60)
    .sort((a, b) => a.score - b.score)
    .slice(0, 3)
    .map((c) => c.concept);

  const platformBreakdown: StudentMasteryProfile['platformBreakdown'] = {};
  for (const evt of owned) {
    const slot = platformBreakdown[evt.platform] ?? { events: 0, averageScore: undefined, averageEngagement: undefined, lastUsedAt: undefined };
    slot.events += 1;
    const s = scoreOrAccuracy(evt);
    if (typeof s === 'number') {
      slot.averageScore = slot.averageScore === undefined ? s : (slot.averageScore + s) / 2;
    }
    slot.averageEngagement = (slot.averageEngagement ?? 0) === 0 ? engagementForEvent(evt) : ((slot.averageEngagement ?? 0) + engagementForEvent(evt)) / 2;
    slot.lastUsedAt = !slot.lastUsedAt || evt.occurredAt > slot.lastUsedAt ? evt.occurredAt : slot.lastUsedAt;
    platformBreakdown[evt.platform] = slot;
  }

  const recommendedActions: string[] = [];
  for (const w of weaknesses) {
    const c = conceptMastery[w];
    if (!c) continue;
    const rec = recommendIntervention(w, c.strand);
    recommendedActions.push(`Assign ${rec.replace(/_/g, ' ')} for "${w}" (score ${Math.round(c.score)}).`);
  }

  return {
    id: `mp-${student.id}`,
    schoolId: DEMO_SCHOOL_ID,
    studentId: student.id,
    studentDisplayName: student.name,
    subject: 'Mathematics',
    grade: student.grade ?? 'Grade 8',
    overallMastery: overall,
    engagementIndex,
    riskLevel,
    conceptMastery,
    platformBreakdown,
    strengths,
    weaknesses,
    recommendedActions,
    updatedAt: new Date().toISOString(),
  };
}

export function calculateClassMastery(
  events: LearningEvent[],
  classInfo: { classId: string; className: string; grade?: string; studentIds: string[]; studentNames: Record<string, string> },
): ClassMasteryProfile {
  const studentProfiles = classInfo.studentIds.map((id) =>
    calculateStudentMastery(events, { id, name: classInfo.studentNames[id] ?? id, classId: classInfo.classId, grade: classInfo.grade }),
  );

  const conceptAverages: Record<string, number> = {};
  const conceptCounts: Record<string, number> = {};
  for (const p of studentProfiles) {
    for (const [concept, m] of Object.entries(p.conceptMastery)) {
      conceptAverages[concept] = (conceptAverages[concept] ?? 0) + m.score;
      conceptCounts[concept] = (conceptCounts[concept] ?? 0) + 1;
    }
  }
  for (const k of Object.keys(conceptAverages)) {
    conceptAverages[k] = Math.round((conceptAverages[k] / conceptCounts[k]) * 10) / 10;
  }

  const sortedConcepts = Object.entries(conceptAverages).sort((a, b) => a[1] - b[1]);
  const weakestConcepts = sortedConcepts.slice(0, 3).map(([k]) => k);
  const strongestConcepts = sortedConcepts.slice(-3).reverse().map(([k]) => k);

  const overallMastery = studentProfiles.length
    ? Math.round((studentProfiles.reduce((a, b) => a + b.overallMastery, 0) / studentProfiles.length) * 10) / 10
    : 0;

  const studentsAtRisk = studentProfiles
    .filter((p) => p.riskLevel === 'high')
    .map((p) => p.studentDisplayName);

  const platformComparison: ClassMasteryProfile['platformComparison'] = {};
  for (const evt of events) {
    if (!classInfo.studentIds.includes(evt.studentId ?? '')) continue;
    const slot = platformComparison[evt.platform] ?? { events: 0 };
    slot.events += 1;
    const s = scoreOrAccuracy(evt);
    if (typeof s === 'number') {
      slot.averageScore = slot.averageScore === undefined ? s : (slot.averageScore + s) / 2;
    }
    slot.averageEngagement = (slot.averageEngagement ?? 0) === 0 ? engagementForEvent(evt) : ((slot.averageEngagement ?? 0) + engagementForEvent(evt)) / 2;
    platformComparison[evt.platform] = slot;
  }

  const recommendedActions: string[] = [];
  for (const w of weakestConcepts) {
    const sample = events.find((e) => (e.topic ?? e.concept ?? e.activityTitle) === w);
    const rec = recommendIntervention(w, sample?.strand);
    recommendedActions.push(`Class intervention on "${w}" — schedule a ${rec.replace(/_/g, ' ')} lesson.`);
  }

  return {
    id: `cmp-${classInfo.classId}`,
    schoolId: DEMO_SCHOOL_ID,
    classId: classInfo.classId,
    className: classInfo.className,
    subject: 'Mathematics',
    grade: classInfo.grade ?? 'Grade 8',
    overallMastery,
    conceptAverages,
    weakestConcepts,
    strongestConcepts,
    studentsAtRisk,
    platformComparison,
    recommendedActions,
    updatedAt: new Date().toISOString(),
  };
}

export function buildClassHeatmap(events: LearningEvent[], studentIds: string[]): { studentId: string; concepts: { concept: string; score: number }[] }[] {
  const byStudent = new Map<string, LearningEvent[]>();
  for (const evt of events) {
    if (!evt.studentId) continue;
    if (!studentIds.includes(evt.studentId)) continue;
    if (!byStudent.has(evt.studentId)) byStudent.set(evt.studentId, []);
    byStudent.get(evt.studentId)!.push(evt);
  }
  return Array.from(byStudent.entries()).map(([studentId, list]) => {
    const groups = groupEventsByConcept(list);
    const concepts = Array.from(groups.entries()).map(([concept, list]) => ({
      concept,
      score: calculateConceptScore(list),
    }));
    return { studentId, concepts };
  });
}
