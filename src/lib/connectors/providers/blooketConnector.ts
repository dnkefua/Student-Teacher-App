// Blooket connector — production path is Drive ingestion until enterprise /
// partner API access is approved. This file exists so syncRunner has a
// clear platform-specific entry point even when the work delegates.

import type { PlatformCredential } from '../types';
import type { ProviderRows } from './kahootConnector';

export async function validateBlooketConnection(credential: PlatformCredential): Promise<{ ok: boolean; message: string }> {
  void credential;
  return { ok: false, message: 'Blooket has no public API. Production path: Drive ingestion via the Drive connector.' };
}

export async function fetchBlooketViaApi(): Promise<ProviderRows> {
  throw new Error('Blooket direct API not available. Use Drive ingestion via the Drive connector.');
}
