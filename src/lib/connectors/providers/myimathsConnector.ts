// MyiMaths connector — production path is Drive ingestion until a vendor
// API agreement is signed.

import type { PlatformCredential } from '../types';
import type { ProviderRows } from './kahootConnector';

export async function validateMyiMathsConnection(credential: PlatformCredential): Promise<{ ok: boolean; message: string }> {
  void credential;
  return { ok: false, message: 'MyiMaths API not yet available to EIS. Production path: Drive ingestion.' };
}

export async function fetchMyiMathsViaApi(): Promise<ProviderRows> {
  throw new Error('MyiMaths direct API not yet wired. Use Drive ingestion.');
}
