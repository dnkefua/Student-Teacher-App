// Automated Connections — types.
//
// The connector layer sits BELOW the Learning Data Hub. Every successful
// sync ends with rows being normalised by the Hub's eventFactory and saved
// through the Hub's repository, so analytics and recommendations stay
// driven by the canonical LearningEvent shape.
//
// Important: this layer never stores raw API tokens or service-account JSON.
// PlatformCredential records carry a `secretRef` that points to Google
// Secret Manager (production) or a demo marker (prototype).

import type { ExternalPlatform as HubPlatform } from '@/lib/learningHub/types';

export type ConnectorPlatform =
  | 'kahoot'
  | 'managebac'
  | 'google_drive'
  | 'blooket'
  | 'myimaths'
  | 'drfrost'
  | 'wonde'
  | 'generic';

export type ConnectorMethod =
  | 'api'
  | 'oauth'
  | 'service_account'
  | 'drive_folder'
  | 'oneroster'
  | 'manual_export'
  | 'vendor_partner';

export type ConnectorStatus =
  | 'ready'
  | 'needs_setup'
  | 'connected'
  | 'sync_failed'
  | 'planned'
  | 'vendor_approval_required'
  | 'drive_ready'
  | 'disabled';

export type PlatformCredential = {
  id: string;
  schoolId: string;
  platform: ConnectorPlatform;
  method: ConnectorMethod;
  status: ConnectorStatus;

  /** Opaque pointer to the real secret. Production: Secret Manager URI.
   *  Demo: `secretmanager://demo/{schoolId}/{platform}`. Never holds a
   *  real key. */
  secretRef?: string;

  displayName: string;
  createdBy: string;
  createdAt: string;
  updatedAt?: string;
  lastValidatedAt?: string;
  expiresAt?: string;
  notes?: string;
};

export type SyncSchedule = {
  id: string;
  schoolId: string;
  platform: ConnectorPlatform;
  connectionId: string;
  enabled: boolean;
  frequency: 'hourly' | 'daily' | 'weekly' | 'manual';
  timezone: string;
  hour?: number;
  minute?: number;
  lastRunAt?: string;
  nextRunAt?: string;
  createdAt: string;
  updatedAt?: string;
};

export type SyncJobStatus = 'scheduled' | 'running' | 'success' | 'failed' | 'partial';

export type SyncJob = {
  id: string;
  schoolId: string;
  platform: ConnectorPlatform;
  connectionId: string;
  method: ConnectorMethod;
  status: SyncJobStatus;
  startedAt?: string;
  finishedAt?: string;
  lastCursor?: string;
  nextCursor?: string;
  rowsPulled?: number;
  filesProcessed?: number;
  eventsCreated?: number;
  importsCreated?: number;
  unmappedStudents?: number;
  error?: string;
  createdAt: string;
};

export type ConnectorRegistryItem = {
  platform: ConnectorPlatform;
  displayName: string;
  category: 'official_api' | 'school_system' | 'drive_ingestion' | 'export_only' | 'roster_mis' | 'planned';
  recommendedMethod: ConnectorMethod;
  fallbackMethod?: ConnectorMethod;
  status: ConnectorStatus;
  description: string;
  setupInstructions: string[];
  requiresSchoolAdmin: boolean;
  requiresVendorApproval: boolean;
  supportsAutomaticSync: boolean;
  supportsDriveIngestion: boolean;
  supportedData: 'roster' | 'reports' | 'assignments' | 'gradebook' | 'mixed';
  /** Which Learning Hub platform a Drive-ingested file should route to. */
  relatedLearningHubPlatform: HubPlatform;
};

export type DriveIngestionConfig = {
  id: string;
  schoolId: string;
  connectionId: string;
  folderId: string;
  folderName?: string;
  platformRouting: {
    folderNameContains: string;
    platform: HubPlatform;
  }[];
  archiveProcessedFiles: boolean;
  processedFolderId?: string;
  failedFolderId?: string;
  createdAt: string;
  updatedAt?: string;
};

export type ConnectorAuditLog = {
  id: string;
  schoolId: string;
  actorId: string;
  action:
    | 'create_connection'
    | 'update_connection'
    | 'disable_connection'
    | 'set_secret_ref'
    | 'schedule_sync'
    | 'start_sync'
    | 'finish_sync'
    | 'fail_sync'
    | 'save_drive_config'
    | 'validate_connection';
  platform: ConnectorPlatform;
  connectionId?: string;
  syncJobId?: string;
  details?: string;
  createdAt: string;
};

export type ConnectorSyncResult = {
  job: SyncJob;
  eventsCreated: number;
  importsCreated: number;
  warnings: string[];
};

export const CONNECTOR_COLLECTIONS = {
  platformCredentials: 'platformCredentials',
  syncSchedules: 'syncSchedules',
  syncJobs: 'syncJobs',
  driveIngestionConfigs: 'driveIngestionConfigs',
  connectorAuditLogs: 'connectorAuditLogs',
} as const;

export const DEMO_SECRET_PREFIX = 'secretmanager://demo';
