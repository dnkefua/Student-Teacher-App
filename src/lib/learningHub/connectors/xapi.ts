// xAPI / Experience API connector stub. Will POST/GET xAPI statements once
// EIS chooses an LRS (SCORM Cloud, Learning Locker, Watershed).

import type { PlatformConnector } from './externalPlatformTemplate';

export const xapiConnector: PlatformConnector = {
  async test() { return false; },
  async sync() {
    throw new Error('xAPI sync requires an LRS endpoint + actor scope. Not yet enabled.');
  },
};
