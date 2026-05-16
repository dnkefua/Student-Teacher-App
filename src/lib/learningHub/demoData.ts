// Demo data seeder. Generates a believable cross-platform dataset for the
// 12 demo students across 2 classes, then persists it via localStore so the
// rest of the hub renders immediately.

import type {
  ExternalImport,
  ExternalPlatform,
  LearningEvent,
  PlatformConnection,
  PlatformStudentMapping,
} from './types';
import { DEMO_CLASS_8A, DEMO_CLASS_8B, DEMO_SCHOOL_ID } from './types';
import { DEMO_ROSTER } from './studentMatching';
import {
  clearAll,
  markDemoLoaded,
  replaceEventsForImport,
  saveConnection,
  saveImport,
  saveMapping,
} from './localStore';

function id(prefix: string, hint = ''): string {
  const seed = hint || Math.random().toString(36).slice(2, 8);
  return `${prefix}-${seed}`;
}

function isoDaysAgo(days: number, hourOffset = 0): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - days);
  d.setUTCHours(8 + hourOffset, 0, 0, 0);
  return d.toISOString();
}

/** Tagging for the demo: each student gets a profile so the events look real. */
type DemoProfile = {
  ratioBias: number;   // -1 weak, 0 average, +1 strong
  algebraBias: number;
  geometryBias: number;
  dataBias: number;
  engagementMode: 'high' | 'average' | 'low' | 'game-heavy';
};

const PROFILES: Record<string, DemoProfile> = {
  'stu-aisha-khan':    { ratioBias: +1, algebraBias: +1, geometryBias: 0, dataBias: 0, engagementMode: 'high' },
  'stu-omar-al-farsi': { ratioBias: -1, algebraBias: -1, geometryBias: -1, dataBias: -1, engagementMode: 'low' },
  'stu-maryam-hassan': { ratioBias: 0, algebraBias: +1, geometryBias: 0, dataBias: +1, engagementMode: 'average' },
  'stu-daniel-okafor': { ratioBias: -1, algebraBias: -1, geometryBias: 0, dataBias: +1, engagementMode: 'game-heavy' },
  'stu-sofia-rahman':  { ratioBias: -1, algebraBias: 0, geometryBias: 0, dataBias: -1, engagementMode: 'average' },
  'stu-ahmed-ali':     { ratioBias: 0, algebraBias: 0, geometryBias: +1, dataBias: 0, engagementMode: 'high' },
  'stu-noor-haddad':   { ratioBias: -1, algebraBias: -1, geometryBias: +1, dataBias: 0, engagementMode: 'game-heavy' },
  'stu-ethan-williams':{ ratioBias: 0, algebraBias: -1, geometryBias: +1, dataBias: 0, engagementMode: 'average' },
  'stu-layla-mansour': { ratioBias: +1, algebraBias: +1, geometryBias: +1, dataBias: +1, engagementMode: 'high' },
  'stu-yusuf-khan':    { ratioBias: -1, algebraBias: 0, geometryBias: -1, dataBias: 0, engagementMode: 'low' },
  'stu-priya-nair':    { ratioBias: 0, algebraBias: -1, geometryBias: -1, dataBias: +1, engagementMode: 'average' },
  'stu-leo-chen':      { ratioBias: +1, algebraBias: +1, geometryBias: 0, dataBias: -1, engagementMode: 'average' },
};

type NumericBias = 'ratioBias' | 'algebraBias' | 'geometryBias' | 'dataBias';
type SubjectLabel = 'Mathematics' | 'English' | 'Science';
type Concept = {
  topic: string;
  strand: LearningEvent['strand'];
  bias: NumericBias;
  subject?: SubjectLabel;
};
const CONCEPTS: Concept[] = [
  // Mathematics
  { topic: 'Ratio and Proportion', strand: 'numerical', bias: 'ratioBias', subject: 'Mathematics' },
  { topic: 'Algebra & Equations', strand: 'abstract', bias: 'algebraBias', subject: 'Mathematics' },
  { topic: 'Linear Graphs', strand: 'abstract', bias: 'algebraBias', subject: 'Mathematics' },
  { topic: 'Angles and Triangles', strand: 'spatial', bias: 'geometryBias', subject: 'Mathematics' },
  { topic: 'Circles', strand: 'spatial', bias: 'geometryBias', subject: 'Mathematics' },
  { topic: 'Probability', strand: 'data', bias: 'dataBias', subject: 'Mathematics' },
  { topic: 'Averages and Spread', strand: 'data', bias: 'dataBias', subject: 'Mathematics' },
  // English (use algebraBias as a proxy for "verbal reasoning" so the bias
  // map still works; scores still look natural).
  { topic: 'Persuasive Devices', strand: 'abstract', bias: 'algebraBias', subject: 'English' },
  { topic: 'PETAL Analysis', strand: 'abstract', bias: 'algebraBias', subject: 'English' },
  { topic: 'Poetry Devices', strand: 'abstract', bias: 'algebraBias', subject: 'English' },
  // Science
  { topic: 'Particle Model', strand: 'spatial', bias: 'geometryBias', subject: 'Science' },
  { topic: 'Cell Structure', strand: 'spatial', bias: 'geometryBias', subject: 'Science' },
  { topic: 'Forces and Motion', strand: 'numerical', bias: 'algebraBias', subject: 'Science' },
];

const PLATFORMS: ExternalPlatform[] = [
  'kahoot',
  'blooket',
  'drfrost',
  'myimaths',
  'eis_maths_studio',
  'neuroquest',
];

function noisyScore(base: number, drift: number): number {
  const v = base + (Math.random() - 0.5) * 8 + drift * 4;
  return Math.max(5, Math.min(98, Math.round(v)));
}

function eventForStudent(
  studentId: string,
  studentName: string,
  concept: Concept,
  platform: ExternalPlatform,
  daysAgo: number,
  importId: string,
): LearningEvent {
  const profile = PROFILES[studentId];
  const baseByConcept = 60 + profile[concept.bias] * 15;
  const platformBonus = platform === 'kahoot' || platform === 'blooket' ? (profile.engagementMode === 'game-heavy' ? +12 : 0) : 0;
  const homeworkPenalty =
    (platform === 'myimaths' || platform === 'drfrost') && profile.engagementMode === 'game-heavy' ? -10 : 0;
  const score = noisyScore(baseByConcept + platformBonus + homeworkPenalty, profile.engagementMode === 'high' ? 0.6 : profile.engagementMode === 'low' ? -0.5 : 0);

  const isQuiz = platform === 'kahoot' || platform === 'blooket' || platform === 'neuroquest';
  const isHomework = platform === 'myimaths' || platform === 'drfrost';
  const eventType: LearningEvent['eventType'] = isQuiz
    ? 'question_response'
    : isHomework
    ? 'homework_completion'
    : platform === 'eis_maths_studio'
    ? '3d_interaction'
    : 'assignment_submission';

  const completionStatus: LearningEvent['completionStatus'] =
    profile.engagementMode === 'low' && isHomework && Math.random() < 0.35
      ? 'partial'
      : profile.engagementMode === 'low' && isHomework && Math.random() < 0.15
      ? 'not_started'
      : 'completed';

  const duration = 60 + Math.floor(Math.random() * 240);

  return {
    id: id('evt', `${studentId}-${platform}-${concept.topic.slice(0, 8)}-${daysAgo}`),
    schoolId: DEMO_SCHOOL_ID,
    classId: DEMO_ROSTER.find((s) => s.id === studentId)?.classId,
    studentId,
    mappedStudentName: studentName,
    externalStudentName: studentName,
    platform,
    importId,
    subject: concept.subject ?? 'Mathematics',
    grade: 'Grade 8',
    topic: concept.topic,
    strand: concept.strand,
    eventType,
    activityTitle: `${concept.topic} · ${platform}`,
    score,
    maxScore: 100,
    accuracy: score,
    durationSeconds: duration,
    completionStatus,
    masterySignal: score >= 80 ? 'strong' : score >= 55 ? 'developing' : 'weak',
    occurredAt: isoDaysAgo(daysAgo, Math.floor(Math.random() * 6)),
    importedAt: new Date().toISOString(),
  };
}

export function seedDemoLearningHubData(): { events: LearningEvent[]; imports: ExternalImport[]; connections: PlatformConnection[] } {
  clearAll();

  const events: LearningEvent[] = [];
  const imports: ExternalImport[] = [];
  const connections: PlatformConnection[] = [];

  for (const platform of PLATFORMS) {
    const importId = id('imp', platform);
    const importedAt = new Date().toISOString();
    const platformEvents: LearningEvent[] = [];

    for (const student of DEMO_ROSTER) {
      const conceptsForStudent = CONCEPTS.slice(0, 4 + Math.floor(Math.random() * 3));
      for (const concept of conceptsForStudent) {
        for (let i = 0; i < 1 + Math.floor(Math.random() * 2); i++) {
          const daysAgo = 1 + Math.floor(Math.random() * 21);
          platformEvents.push(eventForStudent(student.id, student.name, concept, platform, daysAgo, importId));
        }
      }
    }

    events.push(...platformEvents);

    const importRecord: ExternalImport = {
      id: importId,
      schoolId: DEMO_SCHOOL_ID,
      platform,
      uploadedBy: 'demo-teacher',
      fileName: `${platform}-demo-report.xlsx`,
      fileType: 'xlsx',
      importStatus: 'saved',
      rowCount: platformEvents.length,
      eventCount: platformEvents.length,
      errorCount: 0,
      createdAt: importedAt,
      parsedAt: importedAt,
      mappedAt: importedAt,
      savedAt: importedAt,
    };
    imports.push(importRecord);
    saveImport(importRecord);
    replaceEventsForImport(importId, platformEvents);

    const connection: PlatformConnection = {
      id: id('conn', platform),
      schoolId: DEMO_SCHOOL_ID,
      platform,
      displayName: platform,
      method: 'demo',
      status: 'demo',
      createdAt: importedAt,
      lastSyncAt: importedAt,
    };
    connections.push(connection);
    saveConnection(connection);

    // Persist the demo student-mappings so the matching tab shows verified rows.
    for (const student of DEMO_ROSTER) {
      const mapping: PlatformStudentMapping = {
        id: id('map', `${platform}-${student.id}`),
        schoolId: DEMO_SCHOOL_ID,
        platform,
        externalName: student.name,
        studentId: student.id,
        studentDisplayName: student.name,
        confidence: 1,
        verifiedByTeacher: true,
        createdAt: importedAt,
        updatedAt: importedAt,
      };
      saveMapping(mapping);
    }
  }

  markDemoLoaded();
  return { events, imports, connections };
}

export function clearDemoLearningHubData(): void {
  clearAll();
}

export function demoClasses() {
  const studentsByClass = new Map<string, { id: string; name: string }[]>();
  for (const s of DEMO_ROSTER) {
    if (!s.classId) continue;
    if (!studentsByClass.has(s.classId)) studentsByClass.set(s.classId, []);
    studentsByClass.get(s.classId)!.push({ id: s.id, name: s.name });
  }
  return [
    { classId: DEMO_CLASS_8A, className: 'Grade 8A · Mathematics', studentIds: (studentsByClass.get(DEMO_CLASS_8A) ?? []).map((s) => s.id), studentNames: Object.fromEntries((studentsByClass.get(DEMO_CLASS_8A) ?? []).map((s) => [s.id, s.name])) },
    { classId: DEMO_CLASS_8B, className: 'Grade 8B · Mathematics', studentIds: (studentsByClass.get(DEMO_CLASS_8B) ?? []).map((s) => s.id), studentNames: Object.fromEntries((studentsByClass.get(DEMO_CLASS_8B) ?? []).map((s) => [s.id, s.name])) },
  ];
}
