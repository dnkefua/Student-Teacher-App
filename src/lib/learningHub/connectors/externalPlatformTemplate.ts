// Template that a new platform connector implements when EIS approves API
// credentials for a third-party learning platform. Today the production path
// is CSV/XLSX import via src/lib/learningHub/importers/generic.ts — a
// connector replaces the upload step with a server-side sync.
//
// The contract is intentionally narrow: pull rows, hand them to
// `createLearningEventFromRow` (already platform-aware via the registry),
// then persist with `replaceEventsForImport`.

import type { LearningEvent, ExternalPlatform } from '../types';

export type ConnectorAuthMode = 'oauth2' | 'api_key' | 'service_account' | 'lti' | 'oneroster_token';

export type ConnectorConfig = {
  platform: ExternalPlatform;
  authMode: ConnectorAuthMode;
  /** Set on the server only — never bundled into the client. */
  apiKey?: string;
  /** OAuth2 / LTI / OneRoster endpoints (configured per school). */
  baseUrl?: string;
  /** Optional class filter — when set, only fetch this class's evidence. */
  classId?: string;
};

export type ConnectorSyncResult = {
  importId: string;
  rowCount: number;
  events: LearningEvent[];
  warnings: string[];
};

export interface PlatformConnector {
  /** Quick health check. Should return false when the connector cannot reach the upstream. */
  test(config: ConnectorConfig): Promise<boolean>;
  /** Fetch rows from the upstream API and normalise them through the event factory. */
  sync(config: ConnectorConfig): Promise<ConnectorSyncResult>;
}
