// Secret handling for the connector layer.
//
// PRODUCTION FLOW (target, not yet wired end-to-end):
//   1. School admin enters the API token / OAuth client secret in the
//      Connector Setup modal (one-time).
//   2. The client POSTs { platform, schoolId, credentialLabel } to
//      /api/connectors/secrets — the actual secret value goes in the body
//      ONLY in production wiring and never reaches Firestore from the client.
//   3. The server route forwards the secret to Google Secret Manager and
//      receives back a Secret Manager resource name.
//   4. The server returns a `secretRef` (e.g.
//      `projects/{p}/secrets/{name}/versions/latest`) to the client.
//   5. The client saves the PlatformCredential with that `secretRef` only.
//   6. At sync time, Cloud Run reads the secret from Secret Manager using
//      the credential's secretRef. Cloud Run is the only runtime that ever
//      sees the raw value.
//
// PROTOTYPE (this commit):
//   - We never accept or persist a real secret on the client.
//   - The server route returns a deterministic demo secretRef
//     `secretmanager://demo/{schoolId}/{platform}` so the rest of the
//     pipeline can run without real credentials.
//
// Required env vars for production wiring (NEVER prefixed NEXT_PUBLIC_):
//   GOOGLE_CLOUD_PROJECT
//   CONNECTOR_SERVICE_ACCOUNT_EMAIL
//   KAHOOT_CLIENT_ID_SECRET_REF
//   KAHOOT_CLIENT_SECRET_SECRET_REF
//   MANAGEBAC_TOKEN_SECRET_REF
//   GOOGLE_DRIVE_SERVICE_ACCOUNT_SECRET_REF

import { DEMO_SECRET_PREFIX, type ConnectorPlatform } from './types';

export function isDemoSecretRef(secretRef: string | undefined): boolean {
  return Boolean(secretRef && secretRef.startsWith(DEMO_SECRET_PREFIX));
}

export function buildDemoSecretRef(schoolId: string, platform: ConnectorPlatform): string {
  return `${DEMO_SECRET_PREFIX}/${schoolId}/${platform}`;
}

export function looksLikeRawSecret(value: string | undefined): boolean {
  if (!value) return false;
  // Anything that LOOKS like a real Bearer/OAuth token. Used to assert that
  // raw secrets never make it into Firestore via the client.
  return /^(sk|pk|key|tok|ya29|gho|gha|ghu|ghs|ghr|AKIA|AIza)/.test(value);
}

export function assertNoRawSecret(value: string | undefined, fieldName: string): void {
  if (looksLikeRawSecret(value)) {
    throw new Error(
      `Security guard: refusing to persist raw ${fieldName}. Use the /api/connectors/secrets route to store secrets in Google Secret Manager.`,
    );
  }
}

/**
 * Read a production secret from the server environment. Cloud Run / Cloud
 * Functions inject these via the Secret Manager → env binding. Never call
 * this from client components — it always returns null in the browser.
 */
export function readEnvSecret(envName: string): string | null {
  if (typeof process === 'undefined') return null;
  const value = process.env[envName];
  return value && value.length > 0 ? value : null;
}
