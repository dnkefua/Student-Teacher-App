// Firebase Storage upload helper for teacher-supplied source material.
// Uses uploadBytesResumable so callers can render a live progress bar.
// Returns null when Storage isn't configured so callers can fall back
// to the demo flow (typed topic only, no persisted file).

import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { getStorageBucket, isFirebaseConfigured } from './client';
import { getDemoUserId } from './demoUser';

export type UploadResult = {
  downloadUrl: string;
  storagePath: string;
  filename: string;
  contentType: string;
  size: number;
};

export type UploadProgress = {
  /** 0–1, where 1 means complete. */
  fraction: number;
  bytesTransferred: number;
  totalBytes: number;
};

function sanitizeFilename(name: string): string {
  return name.replace(/[^a-zA-Z0-9._-]+/g, '_').slice(0, 120);
}

export async function uploadTeacherSource(
  file: File,
  onProgress?: (progress: UploadProgress) => void,
): Promise<UploadResult | null> {
  if (!isFirebaseConfigured()) return null;
  const storage = getStorageBucket();
  if (!storage) return null;

  const teacherId = getDemoUserId('teacher');
  const safeName = sanitizeFilename(file.name);
  const storagePath = `uploads/${teacherId}/${Date.now()}-${safeName}`;
  const fileRef = ref(storage, storagePath);

  const contentType = file.type || 'application/octet-stream';
  const task = uploadBytesResumable(fileRef, file, { contentType });

  return new Promise<UploadResult | null>((resolve, reject) => {
    task.on(
      'state_changed',
      (snapshot) => {
        if (!onProgress) return;
        const total = snapshot.totalBytes || file.size || 1;
        onProgress({
          fraction: snapshot.bytesTransferred / total,
          bytesTransferred: snapshot.bytesTransferred,
          totalBytes: total,
        });
      },
      (err) => reject(err),
      async () => {
        try {
          const downloadUrl = await getDownloadURL(task.snapshot.ref);
          resolve({
            downloadUrl,
            storagePath,
            filename: file.name,
            contentType,
            size: file.size,
          });
        } catch (err) {
          reject(err);
        }
      },
    );
  });
}
