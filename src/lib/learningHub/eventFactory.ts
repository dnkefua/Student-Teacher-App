// Per-platform row-to-LearningEvent normalisers. Every importer feeds raw
// rows through `createLearningEventFromRow`; the normaliser picks columns
// using the platform's registered aliases, infers topic/strand/event type,
// and computes a mastery signal.

import type {
  ColumnMapping,
  ExternalPlatform,
  LearningEvent,
  LearningEventType,
  MasterySignal,
  MypStrand,
} from './types';
import { DEMO_SCHOOL_ID } from './types';
import { platformAnalyticsRegistry } from './platformRegistry';

/* ─── Helpers ────────────────────────────────────────────────────────── */

export function normalizeKey(key: string): string {
  return key
    .toString()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function buildKeyIndex(row: Record<string, unknown>): Map<string, unknown> {
  const out = new Map<string, unknown>();
  for (const [k, v] of Object.entries(row)) {
    out.set(normalizeKey(k), v);
  }
  return out;
}

export function getValueByAliases(
  index: Map<string, unknown>,
  aliases: readonly string[] | undefined,
): unknown {
  if (!aliases) return undefined;
  for (const alias of aliases) {
    const k = normalizeKey(alias);
    if (index.has(k)) {
      const v = index.get(k);
      if (v !== undefined && v !== null && v !== '') return v;
    }
  }
  // Loose containment match — handles "score (%)", "total score" vs "score".
  for (const [key, value] of index.entries()) {
    if (value === undefined || value === null || value === '') continue;
    for (const alias of aliases) {
      const a = normalizeKey(alias);
      if (key === a || key.includes(a)) return value;
    }
  }
  return undefined;
}

export function parseNumber(value: unknown): number | undefined {
  if (value === undefined || value === null || value === '') return undefined;
  if (typeof value === 'number' && !Number.isNaN(value)) return value;
  const s = String(value).replace(/[^\d.+\-eE]/g, '');
  if (!s) return undefined;
  const n = Number(s);
  return Number.isFinite(n) ? n : undefined;
}

export function parseBoolean(value: unknown): boolean | undefined {
  if (value === undefined || value === null || value === '') return undefined;
  if (typeof value === 'boolean') return value;
  const s = String(value).trim().toLowerCase();
  if (['true', 'yes', 'y', '1', 'correct', 'right'].includes(s)) return true;
  if (['false', 'no', 'n', '0', 'incorrect', 'wrong'].includes(s)) return false;
  return undefined;
}

export function parseDate(value: unknown): string | undefined {
  if (value === undefined || value === null || value === '') return undefined;
  if (typeof value === 'number') {
    // Excel serial date (days since 1899-12-30).
    const ms = Math.round((value - 25569) * 86400 * 1000);
    const d = new Date(ms);
    if (!Number.isNaN(d.getTime())) return d.toISOString();
  }
  const d = new Date(String(value));
  if (!Number.isNaN(d.getTime())) return d.toISOString();
  return undefined;
}

/* ─── Topic / strand / mastery inference ────────────────────────────── */

const TOPIC_RULES: { pattern: RegExp; topic: string; strand: MypStrand }[] = [
  { pattern: /ratio|proportion|rate|scale factor/i, topic: 'Ratio and Proportion', strand: 'numerical' },
  { pattern: /fraction|decimal|percentage|percent/i, topic: 'Fractions, Decimals & Percentages', strand: 'numerical' },
  { pattern: /standard\s*form|index|indices|exponent|power/i, topic: 'Indices and Standard Form', strand: 'numerical' },
  { pattern: /recurring|rational|irrational/i, topic: 'Number Systems', strand: 'numerical' },
  { pattern: /equation|solve.*x|algebra|expression|formula|substitute/i, topic: 'Algebra & Equations', strand: 'abstract' },
  { pattern: /linear|gradient|intercept|y\s*=\s*mx|distance\s*time/i, topic: 'Linear Graphs', strand: 'abstract' },
  { pattern: /quadratic|parabola|factori/i, topic: 'Quadratic Equations', strand: 'abstract' },
  { pattern: /simultaneous|system of equation/i, topic: 'Simultaneous Equations', strand: 'abstract' },
  { pattern: /pythagoras|right.?angle|hypoten/i, topic: 'Pythagoras', strand: 'spatial' },
  { pattern: /sine|cosine|tangent|trigonom/i, topic: 'Trigonometry', strand: 'spatial' },
  { pattern: /angle|parallel line|transversal|triangle/i, topic: 'Angles and Triangles', strand: 'spatial' },
  { pattern: /circle|circumference|radius|diameter/i, topic: 'Circles', strand: 'spatial' },
  { pattern: /area|volume|surface|prism|cylinder|cuboid/i, topic: 'Area, Volume and Surface Area', strand: 'spatial' },
  { pattern: /transform|tessell|congru|similar/i, topic: 'Transformations', strand: 'spatial' },
  { pattern: /probability|chance|spinner|dice/i, topic: 'Probability', strand: 'data' },
  { pattern: /mean|median|mode|range|average/i, topic: 'Averages and Spread', strand: 'data' },
  { pattern: /scatter|correlation|bivariate|data|chart|graph|histogram|box plot/i, topic: 'Data Interpretation', strand: 'data' },
];

export function inferTopicFromActivityTitle(
  title: string | undefined,
): { topic: string; strand: MypStrand } | undefined {
  if (!title) return undefined;
  for (const rule of TOPIC_RULES) {
    if (rule.pattern.test(title)) {
      return { topic: rule.topic, strand: rule.strand };
    }
  }
  return undefined;
}

export function inferStrandFromTopic(topic: string | undefined): MypStrand | undefined {
  if (!topic) return undefined;
  const hit = TOPIC_RULES.find((r) => r.pattern.test(topic));
  return hit?.strand;
}

export function calculateMasterySignal(score?: number, accuracy?: number): MasterySignal {
  const value = accuracy ?? score;
  if (value === undefined) return 'unknown';
  if (value >= 80) return 'strong';
  if (value >= 55) return 'developing';
  return 'weak';
}

/* ─── Core factory ───────────────────────────────────────────────────── */

export type CreateEventInput = {
  platform: ExternalPlatform;
  row: Record<string, unknown>;
  mapping?: ColumnMapping;
  importId?: string;
  schoolId?: string;
  classId?: string;
};

export function createLearningEventFromRow(input: CreateEventInput): LearningEvent {
  const schema = platformAnalyticsRegistry[input.platform];
  switch (schema.normalizer) {
    case 'kahoot':
      return createLearningEventFromKahootRow(input);
    case 'blooket':
      return createLearningEventFromBlooketRow(input);
    case 'myimaths':
      return createLearningEventFromMyiMathsRow(input);
    case 'drfrost':
      return createLearningEventFromDrFrostRow(input);
    case 'managebac':
      return createLearningEventFromManageBacRow(input);
    case 'generic':
    default:
      return createLearningEventFromGenericRow(input);
  }
}

function eventId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
  return `evt-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function baseEvent(
  input: CreateEventInput,
  index: Map<string, unknown>,
  eventType: LearningEventType,
): LearningEvent {
  const schema = platformAnalyticsRegistry[input.platform];
  const externalStudentName = (getValueByAliases(index, schema.identityFields.studentName) as string | undefined) ?? undefined;
  const externalEmail = (getValueByAliases(index, schema.identityFields.email) as string | undefined) ?? undefined;
  const externalUsername = (getValueByAliases(index, schema.identityFields.username) as string | undefined) ?? undefined;

  const activityTitle = (getValueByAliases(index, schema.activityFields.activityTitle) as string | undefined) ?? undefined;
  const topicRaw = (getValueByAliases(index, schema.activityFields.topic) as string | undefined) ?? undefined;
  const inferred = inferTopicFromActivityTitle(activityTitle ?? topicRaw);

  const score = parseNumber(getValueByAliases(index, schema.performanceFields.score));
  const maxScore = parseNumber(getValueByAliases(index, schema.performanceFields.maxScore));
  const percentage = parseNumber(getValueByAliases(index, schema.performanceFields.percentage));
  const accuracy =
    percentage ?? (score !== undefined && maxScore ? (score / maxScore) * 100 : undefined);

  const durationSeconds = parseNumber(getValueByAliases(index, schema.engagementFields.durationSeconds));
  const answerTimeSeconds = parseNumber(getValueByAliases(index, schema.engagementFields.answerTimeSeconds));
  const dateRaw = getValueByAliases(index, schema.activityFields.date);
  const occurredAt = parseDate(dateRaw) ?? new Date().toISOString();
  const completion = getValueByAliases(index, schema.performanceFields.completionStatus) as string | undefined;

  const completionStatus: LearningEvent['completionStatus'] = (() => {
    if (!completion) {
      if (score !== undefined || percentage !== undefined) return 'completed';
      return 'unknown';
    }
    const c = String(completion).toLowerCase();
    if (c.includes('complete') || c === 'yes' || c === 'done') return 'completed';
    if (c.includes('partial') || c.includes('in progress')) return 'partial';
    if (c.includes('not started') || c === 'no') return 'not_started';
    return 'unknown';
  })();

  const questionText = getValueByAliases(index, schema.questionFields.questionText) as string | undefined;
  const selectedAnswer = getValueByAliases(index, schema.questionFields.selectedAnswer) as string | undefined;
  const correctAnswer = getValueByAliases(index, schema.questionFields.correctAnswer) as string | undefined;
  const isCorrect = parseBoolean(getValueByAliases(index, schema.questionFields.isCorrect));

  const masterySignal = calculateMasterySignal(score ?? percentage, accuracy);

  return {
    id: eventId(),
    schoolId: input.schoolId ?? DEMO_SCHOOL_ID,
    classId: input.classId,
    externalStudentName: externalStudentName?.toString().trim(),
    externalEmail: externalEmail?.toString().trim().toLowerCase(),
    externalUsername: externalUsername?.toString().trim(),
    platform: input.platform,
    importId: input.importId,
    subject: schema.defaultSubject ?? 'Mathematics',
    grade: schema.defaultGrade,
    topic: inferred?.topic ?? topicRaw,
    strand: inferred?.strand ?? inferStrandFromTopic(topicRaw),
    eventType,
    activityTitle: activityTitle?.toString(),
    questionText: questionText?.toString(),
    selectedAnswer: selectedAnswer?.toString(),
    correctAnswer: correctAnswer?.toString(),
    isCorrect,
    score,
    maxScore,
    accuracy: accuracy !== undefined ? Math.round(accuracy * 10) / 10 : undefined,
    durationSeconds,
    answerTimeSeconds,
    completionStatus,
    masterySignal,
    raw: input.row,
    occurredAt,
    importedAt: new Date().toISOString(),
  };
}

export function createLearningEventFromKahootRow(input: CreateEventInput): LearningEvent {
  const index = buildKeyIndex(input.row);
  const evt = baseEvent(input, index, 'question_response');
  if (evt.questionText && evt.isCorrect === false && evt.topic) {
    evt.misconceptions = [`Incorrect on "${evt.questionText.slice(0, 60)}" — likely needs ${evt.topic} reteach.`];
  }
  return evt;
}

export function createLearningEventFromBlooketRow(input: CreateEventInput): LearningEvent {
  return baseEvent(input, buildKeyIndex(input.row), 'live_game');
}

export function createLearningEventFromMyiMathsRow(input: CreateEventInput): LearningEvent {
  return baseEvent(input, buildKeyIndex(input.row), 'homework_completion');
}

export function createLearningEventFromDrFrostRow(input: CreateEventInput): LearningEvent {
  return baseEvent(input, buildKeyIndex(input.row), 'homework_completion');
}

export function createLearningEventFromManageBacRow(input: CreateEventInput): LearningEvent {
  return baseEvent(input, buildKeyIndex(input.row), 'assessment_result');
}

export function createLearningEventFromGenericRow(input: CreateEventInput): LearningEvent {
  const schema = platformAnalyticsRegistry[input.platform];
  return baseEvent(input, buildKeyIndex(input.row), schema.defaultEventType);
}
