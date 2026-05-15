// LTI 1.3 connector stub. Will use Names & Role Provisioning + Assignment &
// Grade Services once an LTI tool deployment is configured per platform.

import type { PlatformConnector } from './externalPlatformTemplate';

export const ltiConnector: PlatformConnector = {
  async test() { return false; },
  async sync() {
    throw new Error('LTI sync requires a deployed LTI tool registration. Not yet enabled.');
  },
};
