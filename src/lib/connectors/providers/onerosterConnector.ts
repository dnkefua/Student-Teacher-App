// OneRoster (1EdTech) connector — placeholder for the standards-based
// roster + gradebook path. Sits alongside the ManageBac connector and is
// chosen when the district publishes a OneRoster endpoint.
//
// TODO (production):
//   - 1EdTech OneRoster v1.2 REST: /users, /classes, /enrollments,
//     /courses, /results.
//   - OAuth2 client credentials grant.
//   - CSV-mode also supported for districts that publish a flat dump.

import type { PlatformCredential } from '../types';
import type { ProviderRows } from './kahootConnector';

export async function validateOneRosterConnection(credential: PlatformCredential): Promise<{ ok: boolean; message: string }> {
  void credential;
  return { ok: false, message: 'OneRoster endpoint URL + OAuth2 client required. Not yet enabled for EIS.' };
}

export async function fetchOneRosterRoster(): Promise<ProviderRows> {
  throw new Error('OneRoster sync not yet wired. Awaiting district endpoint.');
}
