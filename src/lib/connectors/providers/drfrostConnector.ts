// Dr Frost connector — production path is Drive ingestion for results +
// Wonde/ManageBac for roster.

import type { PlatformCredential } from '../types';
import type { ProviderRows } from './kahootConnector';

export async function validateDrFrostConnection(credential: PlatformCredential): Promise<{ ok: boolean; message: string }> {
  void credential;
  return {
    ok: false,
    message: 'Dr Frost results API requires partner approval. Production path: Drive ingestion + Wonde roster.',
  };
}

export async function fetchDrFrostViaApi(): Promise<ProviderRows> {
  throw new Error('Dr Frost direct API not yet wired. Use Drive ingestion.');
}
