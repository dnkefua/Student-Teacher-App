// OneRoster (1EdTech) connector stub. Provides standards-based roster +
// gradebook sync once the district publishes a OneRoster endpoint.

import type { PlatformConnector } from './externalPlatformTemplate';

export const oneRosterConnector: PlatformConnector = {
  async test() { return false; },
  async sync() {
    throw new Error('OneRoster sync needs a district endpoint URL + OAuth2 client. Not yet enabled.');
  },
};
