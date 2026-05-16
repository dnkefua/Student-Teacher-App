// Firestore persistence for connector metadata. Never stores real secrets.

import {
  collection,
  doc,
  getDocs,
  getDoc,
  orderBy,
  query,
  setDoc,
  serverTimestamp,
  updateDoc,
  where,
  limit as firestoreLimit,
  type Firestore,
} from 'firebase/firestore';
import { getDb, isFirebaseConfigured } from '@/lib/firebase/client';
import {
  CONNECTOR_COLLECTIONS as COLL,
  type ConnectorAuditLog,
  type ConnectorPlatform,
  type ConnectorStatus,
  type DriveIngestionConfig,
  type PlatformCredential,
  type SyncJob,
  type SyncSchedule,
} from './types';

function dbOrNull(): Firestore | null {
  if (!isFirebaseConfigured()) return null;
  return getDb();
}

export function isConnectorFirestoreReady(): boolean {
  return Boolean(dbOrNull());
}

/* PlatformCredential — metadata only, never raw secrets. */

export async function savePlatformCredential(credential: PlatformCredential): Promise<PlatformCredential | null> {
  const db = dbOrNull();
  if (!db) return null;
  await setDoc(doc(db, COLL.platformCredentials, credential.id), {
    ...credential,
    _updatedAt: serverTimestamp(),
  });
  return credential;
}

export async function listPlatformCredentials(schoolId?: string): Promise<PlatformCredential[] | null> {
  const db = dbOrNull();
  if (!db) return null;
  const ref = collection(db, COLL.platformCredentials);
  const q = schoolId ? query(ref, where('schoolId', '==', schoolId)) : query(ref);
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data() as PlatformCredential);
}

export async function updatePlatformCredentialStatus(id: string, status: ConnectorStatus): Promise<boolean> {
  const db = dbOrNull();
  if (!db) return false;
  await updateDoc(doc(db, COLL.platformCredentials, id), {
    status,
    _updatedAt: serverTimestamp(),
  });
  return true;
}

/* SyncSchedule */

export async function saveSyncSchedule(s: SyncSchedule): Promise<SyncSchedule | null> {
  const db = dbOrNull();
  if (!db) return null;
  await setDoc(doc(db, COLL.syncSchedules, s.id), { ...s, _updatedAt: serverTimestamp() });
  return s;
}
export async function listSyncSchedules(schoolId?: string): Promise<SyncSchedule[] | null> {
  const db = dbOrNull();
  if (!db) return null;
  const ref = collection(db, COLL.syncSchedules);
  const q = schoolId ? query(ref, where('schoolId', '==', schoolId)) : query(ref);
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data() as SyncSchedule);
}
export async function toggleSyncSchedule(id: string, enabled: boolean): Promise<boolean> {
  const db = dbOrNull();
  if (!db) return false;
  await updateDoc(doc(db, COLL.syncSchedules, id), { enabled, _updatedAt: serverTimestamp() });
  return true;
}

/* SyncJob */

export async function createSyncJob(j: SyncJob): Promise<SyncJob | null> {
  const db = dbOrNull();
  if (!db) return null;
  await setDoc(doc(db, COLL.syncJobs, j.id), { ...j, _createdAt: serverTimestamp() });
  return j;
}
export async function updateSyncJob(j: SyncJob): Promise<SyncJob | null> {
  const db = dbOrNull();
  if (!db) return null;
  await updateDoc(doc(db, COLL.syncJobs, j.id), { ...j, _updatedAt: serverTimestamp() });
  return j;
}
export async function listSyncJobs(options: { schoolId?: string; platform?: ConnectorPlatform; limit?: number } = {}): Promise<SyncJob[] | null> {
  const db = dbOrNull();
  if (!db) return null;
  const constraints = [] as Parameters<typeof query>[1][];
  if (options.schoolId) constraints.push(where('schoolId', '==', options.schoolId));
  if (options.platform) constraints.push(where('platform', '==', options.platform));
  constraints.push(orderBy('createdAt', 'desc'));
  constraints.push(firestoreLimit(options.limit ?? 50));
  const snap = await getDocs(query(collection(db, COLL.syncJobs), ...constraints));
  return snap.docs.map((d) => d.data() as SyncJob);
}

/* DriveIngestionConfig */

export async function saveDriveIngestionConfig(d: DriveIngestionConfig): Promise<DriveIngestionConfig | null> {
  const db = dbOrNull();
  if (!db) return null;
  await setDoc(doc(db, COLL.driveIngestionConfigs, d.id), { ...d, _updatedAt: serverTimestamp() });
  return d;
}
export async function getDriveIngestionConfig(id: string): Promise<DriveIngestionConfig | null> {
  const db = dbOrNull();
  if (!db) return null;
  const snap = await getDoc(doc(db, COLL.driveIngestionConfigs, id));
  return snap.exists() ? (snap.data() as DriveIngestionConfig) : null;
}
export async function listDriveIngestionConfigs(schoolId?: string): Promise<DriveIngestionConfig[] | null> {
  const db = dbOrNull();
  if (!db) return null;
  const ref = collection(db, COLL.driveIngestionConfigs);
  const q = schoolId ? query(ref, where('schoolId', '==', schoolId)) : query(ref);
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data() as DriveIngestionConfig);
}

/* Audit log */

export async function writeConnectorAuditLog(log: ConnectorAuditLog): Promise<ConnectorAuditLog | null> {
  const db = dbOrNull();
  if (!db) return null;
  await setDoc(doc(db, COLL.connectorAuditLogs, log.id), { ...log, _createdAt: serverTimestamp() });
  return log;
}
