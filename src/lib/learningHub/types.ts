// Learning Data Hub — unified schema for cross-platform learning evidence.
//
// Every learning event (a Kahoot quiz answer, a MyiMaths homework completion,
// an EIS Maths Studio assignment submission, an AI tutor session…) is
// normalised into a single `LearningEvent` shape. Mastery analytics, AI
// recommendations and the student learning graph all read from this one
// shape, so adding a new platform = registering it + adding a normaliser.

import type { ThreeDType } from '@/lib/grade8Curriculum';

export type ExternalPlatform =
  | 'managebac'
  | 'kahoot'
  | 'blooket'
  | 'drfrost'
  | 'myimaths'
  | 'neuroquest'
  | 'eis_maths_studio'
  | 'eis_learning_studio'
  | 'google_classroom'
  | 'microsoft_teams'
  | 'quizizz'
  | 'edpuzzle'
  | 'seneca'
  | 'mathspace'
  | 'manual_csv'
  | 'wonde'
  | 'custom';

export type ConnectionMethod =
  | 'api'
  | 'csv'
  | 'xlsx'
  | 'lti'
  | 'oneroster'
  | 'caliper'
  | 'xapi'
  | 'manual'
  | 'demo';

export type ConnectionStatus = 'connected' | 'needs_setup' | 'failed' | 'demo' | 'planned';

export type PlatformConnection = {
  id: string;
  schoolId: string;
  platform: ExternalPlatform;
  displayName: string;
  method: ConnectionMethod;
  status: ConnectionStatus;
  connectedBy?: string;
  lastSyncAt?: string;
  createdAt: string;
  updatedAt?: string;
  apiBaseUrl?: string;
  notes?: string;
  supportedImportTypes?: ('csv' | 'xlsx' | 'api' | 'lti' | 'oneroster')[];
};

export type ExternalImport = {
  id: string;
  schoolId: string;
  platform: ExternalPlatform;
  uploadedBy: string;
  fileName?: string;
  fileUrl?: string;
  fileType?: 'csv' | 'xlsx' | 'unknown';
  importStatus: 'uploaded' | 'parsed' | 'mapped' | 'saved' | 'failed';
  rowCount?: number;
  eventCount?: number;
  unmappedStudentCount?: number;
  errorCount?: number;
  createdAt: string;
  parsedAt?: string;
  mappedAt?: string;
  savedAt?: string;
  errors?: string[];
};

export type LearningEventType =
  | 'lesson_view'
  | 'quiz_attempt'
  | 'question_response'
  | 'assignment_submission'
  | 'simulation_interaction'
  | 'virtual_lab'
  | 'reading_annotation'
  | 'writing_submission'
  | 'homework_completion'
  | 'live_game'
  | '3d_interaction'
  | 'ai_tutor_session'
  | 'video_watch'
  | 'class_participation'
  | 'assessment_result'
  | 'resource_open'
  | 'revision_session'
  | 'teacher_feedback';

export type MypStrand = 'numerical' | 'abstract' | 'spatial' | 'data' | 'other';

export type MasterySignal = 'strong' | 'developing' | 'weak' | 'unknown';

export type LearningEvent = {
  id: string;
  schoolId: string;
  classId?: string;
  studentId?: string;

  externalStudentName?: string;
  externalEmail?: string;
  externalUsername?: string;
  mappedStudentName?: string;

  platform: ExternalPlatform;
  importId?: string;
  sourceActivityId?: string;

  subject: string;
  grade?: string;
  unit?: string;
  topic?: string;
  concept?: string;
  strand?: MypStrand;

  eventType: LearningEventType;

  activityTitle?: string;
  activityUrl?: string;
  questionText?: string;
  selectedAnswer?: string;
  correctAnswer?: string;
  isCorrect?: boolean;

  score?: number;
  maxScore?: number;
  accuracy?: number;
  durationSeconds?: number;
  answerTimeSeconds?: number;
  attemptNumber?: number;
  completionStatus?: 'completed' | 'partial' | 'not_started' | 'unknown';

  engagementScore?: number;
  masterySignal?: MasterySignal;
  misconceptions?: string[];

  raw?: Record<string, unknown>;

  occurredAt: string;
  importedAt: string;
};

export type PlatformStudentMapping = {
  id: string;
  schoolId: string;
  platform: ExternalPlatform;
  externalName?: string;
  externalEmail?: string;
  externalUsername?: string;
  studentId: string;
  studentDisplayName: string;
  confidence: number;
  verifiedByTeacher: boolean;
  createdAt: string;
  updatedAt: string;
};

export type ConceptMastery = {
  concept: string;
  topic?: string;
  strand?: MypStrand;
  score: number;
  confidence: number;
  evidenceCount: number;
  lastEvidenceAt: string;
  strongestPlatform?: ExternalPlatform;
  weakestPlatform?: ExternalPlatform;
  recommendedAction?: string;
  trend: 'improving' | 'stable' | 'declining';
};

export type StudentMasteryProfile = {
  id: string;
  schoolId: string;
  studentId: string;
  studentDisplayName: string;
  subject: string;
  grade?: string;
  overallMastery: number;
  engagementIndex: number;
  riskLevel: 'low' | 'medium' | 'high';
  conceptMastery: Record<string, ConceptMastery>;
  platformBreakdown: Record<
    string,
    { events: number; averageScore?: number; averageEngagement?: number; lastUsedAt?: string }
  >;
  strengths: string[];
  weaknesses: string[];
  recommendedActions: string[];
  updatedAt: string;
};

export type ClassMasteryProfile = {
  id: string;
  schoolId: string;
  classId: string;
  className: string;
  subject: string;
  grade?: string;
  overallMastery: number;
  conceptAverages: Record<string, number>;
  weakestConcepts: string[];
  strongestConcepts: string[];
  studentsAtRisk: string[];
  platformComparison: Record<
    string,
    { events: number; averageScore?: number; averageEngagement?: number }
  >;
  recommendedActions: string[];
  updatedAt: string;
};

export type AIRecommendation = {
  id: string;
  schoolId: string;
  classId?: string;
  studentId?: string;
  type:
    | 'intervention'
    | 'assignment'
    | '3d_lesson'
    | 'teacher_action'
    | 'parent_update'
    | 'revision_plan'
    | 'platform_followup';
  title: string;
  explanation: string;
  evidence: string[];
  suggestedAction: string;
  suggestedThreeDType?: ThreeDType;
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  status: 'new' | 'accepted' | 'dismissed';
};

export type IntegrationAuditLog = {
  id: string;
  schoolId: string;
  actorId: string;
  action:
    | 'upload_import'
    | 'parse_import'
    | 'map_student'
    | 'create_connection'
    | 'sync_api'
    | 'delete_import'
    | 'generate_recommendation'
    | 'save_learning_events';
  platform?: ExternalPlatform;
  importId?: string;
  details?: string;
  createdAt: string;
};

export type ImportParseResult = {
  importRecord: ExternalImport;
  rows: Record<string, unknown>[];
  events: LearningEvent[];
  detectedColumns: string[];
  warnings: string[];
};

export type ColumnMapping = {
  studentName?: string;
  studentEmail?: string;
  activityTitle?: string;
  topic?: string;
  concept?: string;
  score?: string;
  maxScore?: string;
  accuracy?: string;
  durationSeconds?: string;
  answerTimeSeconds?: string;
  questionText?: string;
  selectedAnswer?: string;
  correctAnswer?: string;
  isCorrect?: string;
  occurredAt?: string;
};

/* ─── Generic platform analytics schema ─────────────────────────────── */

export type ExternalPlatformAnalyticsSchema = {
  platform: ExternalPlatform;
  displayName: string;
  category:
    | 'quiz'
    | 'homework'
    | 'math_practice'
    | 'video_learning'
    | 'lms'
    | 'game_based_learning'
    | 'assessment'
    | 'custom';
  supportedMethods: ConnectionMethod[];
  identityFields: {
    studentName?: string[];
    email?: string[];
    username?: string[];
    className?: string[];
  };
  activityFields: {
    activityTitle?: string[];
    activityId?: string[];
    topic?: string[];
    concept?: string[];
    subject?: string[];
    grade?: string[];
    date?: string[];
  };
  performanceFields: {
    score?: string[];
    maxScore?: string[];
    percentage?: string[];
    accuracy?: string[];
    correctCount?: string[];
    incorrectCount?: string[];
    unattemptedCount?: string[];
    completionStatus?: string[];
    attemptNumber?: string[];
  };
  engagementFields: {
    durationSeconds?: string[];
    answerTimeSeconds?: string[];
    timePlayed?: string[];
    numberOfQuestions?: string[];
    participation?: string[];
  };
  questionFields: {
    questionText?: string[];
    selectedAnswer?: string[];
    correctAnswer?: string[];
    isCorrect?: string[];
  };
  defaultEventType: LearningEventType;
  defaultSubject?: string;
  defaultGrade?: string;
  normalizer: 'kahoot' | 'blooket' | 'myimaths' | 'drfrost' | 'managebac' | 'generic';
};

export const DEMO_SCHOOL_ID = 'eis-jumeirah';
export const DEMO_CLASS_8A = 'class-grade8a';
export const DEMO_CLASS_8B = 'class-grade8b';
