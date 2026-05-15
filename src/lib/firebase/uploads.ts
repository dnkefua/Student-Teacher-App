// Firebase Storage upload helper for teacher-supplied source material.
// Returns null when Storage isn't configured so callers can fall back
// to the demo flow (typed topic only, no persisted file).

import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getStorageBucket, isFirebaseConfigured } from './client';
import { getDemoUserId } from './demoUser';

export type UploadResult = {
  downloadUrl: string;
  storagePath: string;
  filename: string;
  contentType: string;
  size: number;
};

function sanitizeFilename(name: string): string {
  return name.replace(/[^a-zA-Z0-9._-]+/g, '_').slice(0, 120);
}

export async function uploadTeacherSource(file: File): Promise<UploadResult | null> {
  if (!isFirebaseConfigured()) return null;
  const storage = getStorageBucket();
  if (!storage) return null;

  const teacherId = getDemoUserId('teacher');
  const safeName = sanitizeFilename(file.name);
  const storagePath = `uploads/${teacherId}/${Date.now()}-${safeName}`;
  const fileRef = ref(storage, storagePath);

  await uploadBytes(fileRef, file, { contentType: file.type || 'application/octet-stream' });
  const downloadUrl = await getDownloadURL(fileRef);

  return {
    downloadUrl,
    storagePath,
    filename: file.name,
    contentType: file.type || 'application/octet-stream',
    size: file.size,
  };
}
