// Wonde MIS connector — planned. Wonde is the roster bridge once EIS opts in.
//
// TODO (production):
//   - Authenticate with a Wonde API token from Secret Manager.
//   - GET /v1.0/schools/{id}/students, /classes, /enrollments, /year_groups.
//   - Feed rows into the same roster identity layer that ManageBac uses.

import type { PlatformCredential } from '../types';
import type { ProviderRows } from './kahootConnector';

export async function validateWondeConnection(credential: PlatformCredential): Promise<{ ok: boolean; message: string }> {
  void credential;
  return { ok: false, message: 'Wonde sync is planned. EIS must opt-in at the MIS level first.' };
}

export async function fetchWondeRoster(): Promise<ProviderRows> {
  throw new Error('Wonde MIS sync is planned. School-level opt-in required.');
}
