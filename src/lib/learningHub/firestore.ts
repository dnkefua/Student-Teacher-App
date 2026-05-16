// Firestore persistence for the Learning Data Hub.
// Mirrors the pattern in src/lib/firebase/firestore.ts: every helper returns
// null (or false) when Firebase isn't configured so callers can fall back to
// localStore gracefully.

import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit as firestoreLimit,
  orderBy,
  query,
  setDoc,
  serverTimestamp,
  updateDoc,
  where,
  writeBatch,
  type Firestore,
} from 'firebase/firestore';
import { getDb, isFirebaseConfigured } from '@/lib/firebase/client';
import type {
  AIRecommendation,
  ClassMasteryProfile,
  ExternalImport,
  ExternalPlatform,
  IntegrationAuditLog,
  LearningEvent,
  PlatformConnection,
  PlatformStudentMapping,
  StudentMasteryProfile,
} from './types';

const COLL = {
  platformConnections: 'platformConnections',
  externalImports: 'externalImports',
  platformStudentMappings: 'platformStudentMappings',
  learningEvents: 'learningEvents',
  studentMasteryProfiles: 'studentMasteryProfiles',
  classMasteryProfiles: 'classMasteryProfiles',
  aiRecommendations: 'aiRecommendations',
  integrationAuditLogs: 'integrationAuditLogs',
} as const;

function dbOrNull(): Firestore | null {
  if (!isFirebaseConfigured()) return null;
  return getDb();
}

export function isLearningHubFirestoreReady(): boolean {
  return Boolean(dbOrNull());
}

/* ─── PlatformConnection ────────────────────────────────────────────── */

export async function savePlatformConnection(connection: PlatformConnection): Promise<PlatformConnection | null> {
  const db = dbOrNull();
  if (!db) return null;
  await setDoc(doc(db, COLL.platformConnections, connection.id), {
    ...connection,
    _updatedAt: serverTimestamp(),
  });
  return connection;
}

export async function listPlatformConnections(schoolId?: string): Promise<PlatformConnection[] | null> {
  const db = dbOrNull();
  if (!db) return null;
  const ref = collection(db, COLL.platformConnections);
  const q = schoolId ? query(ref, where('schoolId', '==', schoolId)) : query(ref);
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data() as PlatformConnection);
}

/* ─── ExternalImport ─────────────────────────────────────────────────── */

export async function saveExternalImport(record: ExternalImport): Promise<ExternalImport | null> {
  const db = dbOrNull();
  if (!db) return null;
  await setDoc(doc(db, COLL.externalImports, record.id), {
    ...record,
    _createdAt: serverTimestamp(),
  });
  return record;
}

export async function updateExternalImport(record: ExternalImport): Promise<ExternalImport | null> {
  const db = dbOrNull();
  if (!db) return null;
  await updateDoc(doc(db, COLL.externalImports, record.id), {
    ...record,
    _updatedAt: serverTimestamp(),
  });
  return record;
}

export async function listExternalImports(schoolId?: string): Promise<ExternalImport[] | null> {
  const db = dbOrNull();
  if (!db) return null;
  const ref = collection(db, COLL.externalImports);
  const q = schoolId
    ? query(ref, where('schoolId', '==', schoolId), orderBy('createdAt', 'desc'), firestoreLimit(100))
    : query(ref, orderBy('createdAt', 'desc'), firestoreLimit(100));
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data() as ExternalImport);
}

/* ─── LearningEvent ──────────────────────────────────────────────────── */

export async function saveLearningEvents(events: LearningEvent[]): Promise<LearningEvent[] | null> {
  const db = dbOrNull();
  if (!db) return null;
  if (events.length === 0) return [];
  // Batch into chunks of 450 (Firestore batch limit is 500; leave headroom).
  const chunks: LearningEvent[][] = [];
  for (let i = 0; i < events.length; i += 450) chunks.push(events.slice(i, i + 450));
  for (const chunk of chunks) {
    const batch = writeBatch(db);
    for (const evt of chunk) {
      batch.set(doc(db, COLL.learningEvents, evt.id), { ...evt, _createdAt: serverTimestamp() });
    }
    await batch.commit();
  }
  return events;
}

export async function listLearningEvents(options: {
  schoolId?: string;
  classId?: string;
  studentId?: string;
  platform?: ExternalPlatform;
  limitCount?: number;
} = {}): Promise<LearningEvent[] | null> {
  const db = dbOrNull();
  if (!db) return null;
  const constraints = [];
  if (options.schoolId) constraints.push(where('schoolId', '==', options.schoolId));
  if (options.classId) constraints.push(where('classId', '==', options.classId));
  if (options.studentId) constraints.push(where('studentId', '==', options.studentId));
  if (options.platform) constraints.push(where('platform', '==', options.platform));
  // Firestore requires the orderBy field to be filtered with inequality only;
  // we sort client-side after fetch for simplicity.
  constraints.push(firestoreLimit(options.limitCount ?? 1000));
  const q = query(collection(db, COLL.learningEvents), ...constraints);
  const snap = await getDocs(q);
  const list = snap.docs.map((d) => d.data() as LearningEvent);
  return list.sort((a, b) => new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime());
}

export async function deleteEventsForImport(importId: string): Promise<boolean> {
  const db = dbOrNull();
  if (!db) return false;
  const snap = await getDocs(query(collection(db, COLL.learningEvents), where('importId', '==', importId)));
  if (snap.empty) return true;
  const chunks: typeof snap.docs[] = [];
  for (let i = 0; i < snap.docs.length; i += 450) chunks.push(snap.docs.slice(i, i + 450));
  for (const chunk of chunks) {
    const batch = writeBatch(db);
    for (const d of chunk) batch.delete(d.ref);
    await batch.commit();
  }
  return true;
}

/* ─── PlatformStudentMapping ────────────────────────────────────────── */

export async function savePlatformStudentMapping(mapping: PlatformStudentMapping): Promise<PlatformStudentMapping | null> {
  const db = dbOrNull();
  if (!db) return null;
  await setDoc(doc(db, COLL.platformStudentMappings, mapping.id), {
    ...mapping,
    _updatedAt: serverTimestamp(),
  });
  return mapping;
}

export async function listPlatformStudentMappings(options: { schoolId?: string; platform?: ExternalPlatform } = {}): Promise<PlatformStudentMapping[] | null> {
  const db = dbOrNull();
  if (!db) return null;
  const constraints = [];
  if (options.schoolId) constraints.push(where('schoolId', '==', options.schoolId));
  if (options.platform) constraints.push(where('platform', '==', options.platform));
  const snap = await getDocs(query(collection(db, COLL.platformStudentMappings), ...constraints));
  return snap.docs.map((d) => d.data() as PlatformStudentMapping);
}

/* ─── Mastery profiles ───────────────────────────────────────────────── */

export async function saveStudentMasteryProfile(profile: StudentMasteryProfile): Promise<StudentMasteryProfile | null> {
  const db = dbOrNull();
  if (!db) return null;
  await setDoc(doc(db, COLL.studentMasteryProfiles, profile.id), {
    ...profile,
    _updatedAt: serverTimestamp(),
  });
  return profile;
}

export async function listStudentMasteryProfiles(options: { schoolId?: string; classId?: string } = {}): Promise<StudentMasteryProfile[] | null> {
  const db = dbOrNull();
  if (!db) return null;
  const constraints = [];
  if (options.schoolId) constraints.push(where('schoolId', '==', options.schoolId));
  // No `classId` on the StudentMasteryProfile root — left for future denorm.
  const snap = await getDocs(query(collection(db, COLL.studentMasteryProfiles), ...constraints));
  return snap.docs.map((d) => d.data() as StudentMasteryProfile);
}

export async function saveClassMasteryProfile(profile: ClassMasteryProfile): Promise<ClassMasteryProfile | null> {
  const db = dbOrNull();
  if (!db) return null;
  await setDoc(doc(db, COLL.classMasteryProfiles, profile.id), {
    ...profile,
    _updatedAt: serverTimestamp(),
  });
  return profile;
}

export async function getClassMasteryProfile(classId: string): Promise<ClassMasteryProfile | null> {
  const db = dbOrNull();
  if (!db) return null;
  const snap = await getDoc(doc(db, COLL.classMasteryProfiles, `cmp-${classId}`));
  return snap.exists() ? (snap.data() as ClassMasteryProfile) : null;
}

/* ─── AIRecommendation ──────────────────────────────────────────────── */

export async function saveAIRecommendation(recommendation: AIRecommendation): Promise<AIRecommendation | null> {
  const db = dbOrNull();
  if (!db) return null;
  await setDoc(doc(db, COLL.aiRecommendations, recommendation.id), {
    ...recommendation,
    _updatedAt: serverTimestamp(),
  });
  return recommendation;
}

export async function listAIRecommendations(options: {
  schoolId?: string;
  classId?: string;
  studentId?: string;
  status?: 'new' | 'accepted' | 'dismissed';
} = {}): Promise<AIRecommendation[] | null> {
  const db = dbOrNull();
  if (!db) return null;
  const constraints = [];
  if (options.schoolId) constraints.push(where('schoolId', '==', options.schoolId));
  if (options.classId) constraints.push(where('classId', '==', options.classId));
  if (options.studentId) constraints.push(where('studentId', '==', options.studentId));
  if (options.status) constraints.push(where('status', '==', options.status));
  constraints.push(firestoreLimit(200));
  const snap = await getDocs(query(collection(db, COLL.aiRecommendations), ...constraints));
  return snap.docs.map((d) => d.data() as AIRecommendation);
}

export async function updateAIRecommendationStatus(recommendationId: string, status: 'new' | 'accepted' | 'dismissed'): Promise<boolean> {
  const db = dbOrNull();
  if (!db) return false;
  await updateDoc(doc(db, COLL.aiRecommendations, recommendationId), {
    status,
    _updatedAt: serverTimestamp(),
  });
  return true;
}

/* ─── IntegrationAuditLog ────────────────────────────────────────────── */

export async function writeIntegrationAuditLog(log: IntegrationAuditLog): Promise<IntegrationAuditLog | null> {
  const db = dbOrNull();
  if (!db) return null;
  await setDoc(doc(db, COLL.integrationAuditLogs, log.id), {
    ...log,
    _createdAt: serverTimestamp(),
  });
  return log;
}

/* ─── Composite delete ──────────────────────────────────────────────── */

export async function deleteImportAndEvents(importId: string): Promise<boolean> {
  const db = dbOrNull();
  if (!db) return false;
  await deleteEventsForImport(importId);
  await deleteDoc(doc(db, COLL.externalImports, importId));
  return true;
}

export const LEARNING_HUB_COLLECTIONS = COLL;
