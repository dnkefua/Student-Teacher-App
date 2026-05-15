// Generates recommendations from a ClassMasteryProfile + raw events.
// Deterministic by design — if the school later wires the Gemma API route,
// the same recommendations are fine to keep alongside as a stable fallback.

import { recommendIntervention } from './mastery';
import type {
  AIRecommendation,
  ClassMasteryProfile,
  LearningEvent,
  StudentMasteryProfile,
} from './types';
import { DEMO_SCHOOL_ID } from './types';

function recId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return `rec-${crypto.randomUUID().split('-')[0]}`;
  return `rec-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function generateRecommendationsForClass(
  classProfile: ClassMasteryProfile,
  events: LearningEvent[],
  studentProfiles: StudentMasteryProfile[] = [],
): AIRecommendation[] {
  const recs: AIRecommendation[] = [];

  for (const concept of classProfile.weakestConcepts.slice(0, 3)) {
    const sample = events.find((e) => (e.topic ?? e.concept ?? e.activityTitle) === concept);
    const threeD = recommendIntervention(concept, sample?.strand);
    const platformLines = Object.entries(classProfile.platformComparison)
      .filter(([, v]) => typeof v.averageScore === 'number')
      .sort((a, b) => (a[1].averageScore ?? 0) - (b[1].averageScore ?? 0))
      .slice(0, 3)
      .map(([p, v]) => `${p} avg score: ${Math.round(v.averageScore ?? 0)}%`);

    recs.push({
      id: recId(),
      schoolId: classProfile.schoolId,
      classId: classProfile.classId,
      type: 'intervention',
      title: `${classProfile.className}: reteach ${concept}`,
      explanation: `Class average on "${concept}" is ${Math.round(classProfile.conceptAverages[concept] ?? 0)}%. Schedule a 20-minute reteach using the matching 3D scene before the next assignment.`,
      evidence: [
        `Class average for ${concept}: ${Math.round(classProfile.conceptAverages[concept] ?? 0)}%`,
        ...platformLines,
      ],
      suggestedAction: `Open the Lesson Player → ${threeD.replace(/_/g, ' ')} scene → assign a 3-question support set.`,
      suggestedThreeDType: threeD,
      priority: 'high',
      createdAt: new Date().toISOString(),
      status: 'new',
    });
  }

  for (const student of studentProfiles.filter((s) => s.riskLevel === 'high').slice(0, 4)) {
    const weak = student.weaknesses[0];
    if (!weak) continue;
    const sample = events.find(
      (e) => e.studentId === student.studentId && (e.topic ?? e.concept ?? e.activityTitle) === weak,
    );
    const threeD = recommendIntervention(weak, sample?.strand);
    recs.push({
      id: recId(),
      schoolId: classProfile.schoolId,
      classId: classProfile.classId,
      studentId: student.studentId,
      type: 'platform_followup',
      title: `Personalised support: ${student.studentDisplayName}`,
      explanation: `${student.studentDisplayName} is at high risk (overall mastery ${Math.round(student.overallMastery)}%). Engagement is ${student.engagementIndex}; weakest concept "${weak}".`,
      evidence: student.recommendedActions.slice(0, 3),
      suggestedAction: `Assign 3 ${threeD.replace(/_/g, ' ')} questions and pair with a peer mentor from "${student.strengths[0] ?? 'an earlier strong topic'}".`,
      suggestedThreeDType: threeD,
      priority: 'high',
      createdAt: new Date().toISOString(),
      status: 'new',
    });
  }

  // Platform follow-up — highlight a platform that's under-performing vs the class average.
  const platforms = Object.entries(classProfile.platformComparison)
    .filter(([, v]) => typeof v.averageScore === 'number')
    .sort((a, b) => (a[1].averageScore ?? 0) - (b[1].averageScore ?? 0));
  if (platforms.length >= 2) {
    const [worst, ...rest] = platforms;
    const restAvg = rest.reduce((a, b) => a + (b[1].averageScore ?? 0), 0) / rest.length;
    if ((worst[1].averageScore ?? 0) + 10 < restAvg) {
      recs.push({
        id: recId(),
        schoolId: classProfile.schoolId,
        classId: classProfile.classId,
        type: 'teacher_action',
        title: `${worst[0]} is dragging engagement`,
        explanation: `Average score on ${worst[0]} is ${Math.round(worst[1].averageScore ?? 0)}% — at least 10% below the rest of the platforms.`,
        evidence: platforms.map(([p, v]) => `${p}: ${Math.round(v.averageScore ?? 0)}%`),
        suggestedAction: `Review the ${worst[0]} content selection; consider pausing this platform for a unit and consolidating on stronger sources.`,
        priority: 'medium',
        createdAt: new Date().toISOString(),
        status: 'new',
      });
    }
  }

  return recs;
}

export function generateRecommendationsForStudent(profile: StudentMasteryProfile, events: LearningEvent[]): AIRecommendation[] {
  if (profile.weaknesses.length === 0) return [];
  return profile.weaknesses.slice(0, 2).map((weak) => {
    const sample = events.find((e) => e.studentId === profile.studentId && (e.topic ?? e.concept) === weak);
    const threeD = recommendIntervention(weak, sample?.strand);
    return {
      id: recId(),
      schoolId: profile.schoolId,
      studentId: profile.studentId,
      type: '3d_lesson' as const,
      title: `Try the ${threeD.replace(/_/g, ' ')} on ${weak}`,
      explanation: `Your mastery on "${weak}" is ${Math.round(profile.conceptMastery[weak]?.score ?? 0)}%. A short 3D session usually lifts that by ~12%.`,
      evidence: [`${profile.conceptMastery[weak]?.evidenceCount ?? 0} events across your platforms`],
      suggestedAction: 'Open the Lesson Player and pick this scene to work through.',
      suggestedThreeDType: threeD,
      priority: 'high' as const,
      createdAt: new Date().toISOString(),
      status: 'new' as const,
    };
  });
}

export const DEMO_INSIGHTS_SOURCE = DEMO_SCHOOL_ID;
