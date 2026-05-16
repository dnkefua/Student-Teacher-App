# Automated Connectors — Cloud Scheduler + Cloud Run reference

The Learning Data Hub connector layer is designed to run two ways:

- **Demo mode (today):** every connector runs in-browser against the
  demo path. `secretRef` is a marker (`secretmanager://demo/...`), no
  real platform data leaves the user's session.
- **Production mode:** a Cloud Scheduler job calls
  `POST /api/connectors/sync-all` on the App Hosting deployment. The
  Next.js server route invokes `runAllEnabledSyncs` → each registered
  connector pulls evidence and writes through the Learning Hub
  repository. Real secrets live in Google Secret Manager and are
  injected as env vars at runtime.

## 1 · Architecture

```
Cloud Scheduler (cron: 02:00 Asia/Dubai)
   │
   ▼
HTTPS POST /api/connectors/sync-all
   │  Header: x-cron-secret: $CONNECTOR_CRON_SECRET
   ▼
Next.js App Hosting (Cloud Run)
   │  src/lib/connectors/syncRunner.ts → runAllEnabledSyncs()
   ▼
Per-platform provider (src/lib/connectors/providers/*)
   │  Reads secret from Secret Manager via env binding
   │  Pulls rows from API or Drive
   ▼
Learning Hub repository (src/lib/learningHub/repository.ts)
   │  saveImportWithEvents() — Firestore + local mirror
   ▼
Firestore: externalImports, learningEvents, integrationAuditLogs
   │
   ▼
UI (Learning Data Hub) re-renders on `eis-learning-hub-changed` event
```

## 2 · Recommended schedule

- Nightly at **02:00 Asia/Dubai** for most platforms.
- More frequent for ManageBac roster (hourly during the school day).
- Drive ingestion can run more often (every 15 minutes) because file
  diffs are cheap.

## 3 · Required env vars

NEVER prefix any of these with `NEXT_PUBLIC_*`:

```
GOOGLE_CLOUD_PROJECT                          (project id, e.g. student-teacher-app-495806)
CONNECTOR_SERVICE_ACCOUNT_EMAIL               (run-as identity)
CONNECTOR_CRON_SECRET                         (shared secret for Cloud Scheduler → /sync-all)

# Secret Manager resource names (or env-bound secrets)
KAHOOT_CLIENT_ID_SECRET_REF                   (e.g. projects/p/secrets/kahoot-client-id/versions/latest)
KAHOOT_CLIENT_SECRET_SECRET_REF
MANAGEBAC_TOKEN_SECRET_REF
GOOGLE_DRIVE_SERVICE_ACCOUNT_SECRET_REF
WONDE_TOKEN_SECRET_REF                        (when Wonde is approved)
```

Plus the Hub's existing env (`NEXT_PUBLIC_FIREBASE_*`, `GEMINI_API_KEY`).

## 4 · Security model

- Use a dedicated service account for the App Hosting backend. Bind the
  `secretmanager.secretAccessor` role on the relevant secrets only.
- Cloud Scheduler authenticates with an OIDC token signed for the App
  Hosting URL, OR uses the shared `CONNECTOR_CRON_SECRET` (the simpler
  path; prefer OIDC long-term).
- `/api/connectors/sync-all` rejects requests without the matching
  `x-cron-secret` header when the env is set.
- `/api/connectors/secrets` proxies the raw secret to Secret Manager
  and returns only the resource name. The client never persists raw
  tokens to Firestore.
- Firestore security rules (see `docs/firestore-learning-hub-rules.md`)
  restrict `platformCredentials` writes to admin role + same-school
  claims.

## 5 · Per-platform notes

| Platform | Method | Status | Action needed |
|---|---|---|---|
| Kahoot | Official Reports API | `ready` | Kahoot 360 / Enterprise client credentials → Secret Manager |
| ManageBac | Public API / OneRoster | `ready` | School-admin API token → Secret Manager |
| Google Drive | Drive folder ingestion | `ready` | Workspace service account + shared folder share |
| Blooket | Drive ingestion | `drive_ready` | Teachers export to `Drive/Blooket` |
| MyiMaths | Drive ingestion | `drive_ready` | Teachers export to `Drive/MyiMaths` |
| Dr Frost | Drive ingestion | `drive_ready` | Teachers export to `Drive/Dr Frost` |
| Wonde | API roster sync | `planned` | School MIS opt-in + API token |
| Generic | Drive ingestion | `drive_ready` | Any CSV/XLSX into `Drive/Generic` |

## 6 · Setup flow

1. School admin enables the vendor API and issues credentials.
2. Run **Connector Setup** in Learning Data Hub → Automated Connections.
3. Modal POSTs `/api/connectors/secrets` (production: this server route
   writes to Secret Manager and returns the resource name).
4. Modal POSTs `/api/connectors/setup` with the `secretRef` only.
5. Schedule is created (nightly daily by default).
6. Hit **Run sync** for the first sync.
7. Inspect `Learning events` tab + `Student matching` tab — unmapped
   students surface for teacher confirmation.
8. Confirm mappings; Mastery Analytics + AI Recommendations recompute.

## 7 · Provisioning the Cloud Scheduler job

Using gcloud:

```bash
gcloud scheduler jobs create http connector-nightly-sync \
  --schedule="0 2 * * *" \
  --time-zone="Asia/Dubai" \
  --uri="https://dnkefua--student-teacher-app-495806.europe-west4.hosted.app/api/connectors/sync-all" \
  --http-method=POST \
  --headers="Content-Type=application/json,x-cron-secret=$CONNECTOR_CRON_SECRET" \
  --message-body='{"source":"cloud-scheduler"}' \
  --project=student-teacher-app-495806
```

For OIDC auth instead of the shared secret, pass
`--oidc-service-account-email=$CONNECTOR_SERVICE_ACCOUNT_EMAIL` and
remove the `x-cron-secret` header — then verify the token inside
`/sync-all` using the Google Auth Library.

## 8 · Observability

- Every sync writes to `connectorAuditLogs` with actor, status, counts.
- Failed jobs surface in the **Automated Connections → Recent sync jobs**
  table with their error message.
- Add Cloud Logging exclusions to redact `secretRef` values from any
  log output.

## 9 · Disabling a connector

- UI: `Disable` from the connector card (future iteration — current
  cards expose Reconfigure + Run sync; `repository.disableConnector`
  is wired for follow-up).
- CLI: update the `platformCredentials` document's `status` field to
  `disabled`; subsequent `runAllEnabledSyncs` runs skip it.
