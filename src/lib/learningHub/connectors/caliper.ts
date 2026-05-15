// IMS Caliper Analytics connector stub. Will publish/consume Caliper
// envelopes once EIS adopts a Caliper-compliant LRS.

import type { PlatformConnector } from './externalPlatformTemplate';

export const caliperConnector: PlatformConnector = {
  async test() { return false; },
  async sync() {
    throw new Error('Caliper sync requires a configured LRS endpoint. Not yet enabled.');
  },
};
