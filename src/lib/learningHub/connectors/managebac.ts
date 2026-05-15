// ManageBac connector stub. Production wiring requires the school to issue
// API credentials (OAuth2). Until then the CSV/XLSX path covers the same
// data via Upload Reports. See externalPlatformTemplate.ts.

import type { PlatformConnector } from './externalPlatformTemplate';

export const managebacConnector: PlatformConnector = {
  async test() {
    return false; // not yet wired — awaiting school API credentials
  },
  async sync() {
    throw new Error('ManageBac API sync requires school-approved OAuth credentials. Use Upload Reports for now.');
  },
};
