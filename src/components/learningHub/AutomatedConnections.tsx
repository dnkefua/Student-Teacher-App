'use client';

import { useCallback, useEffect, useState } from 'react';
import { Cloud, PlugZap, RefreshCcw } from 'lucide-react';
import { connectorList, connectorRegistry } from '@/lib/connectors/registry';
import type { ConnectorPlatform } from '@/lib/connectors/types';
import { loadConnectorSnapshot, runConnectorSync, type ConnectorSnapshot } from '@/lib/connectors/repository';
import { ConnectorCard } from './ConnectorCard';
import { ConnectorSetupModal } from './ConnectorSetupModal';
import { SyncJobsPanel } from './SyncJobsPanel';
import { DriveFolderSetup } from './DriveFolderSetup';
import { ConnectorSecurityNotice } from './ConnectorSecurityNotice';
import { ApiConnectorSetup } from './ApiConnectorSetup';
import type { LearningEvent } from '@/lib/learningHub/types';
import type { TabType } from '@/components/Sidebar';

type Props = { events: LearningEvent[]; setActiveTab: (tab: TabType) => void };

const EMPTY: ConnectorSnapshot = { credentials: [], schedules: [], jobs: [], driveConfigs: [], source: 'local' };

export function AutomatedConnections({ events, setActiveTab }: Props) {
  const [snapshot, setSnapshot] = useState<ConnectorSnapshot>(EMPTY);
  const [setupFor, setSetupFor] = useState<ConnectorPlatform | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [syncingId, setSyncingId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    void loadConnectorSnapshot().then((next) => {
      if (!cancelled) setSnapshot(next);
    });
    return () => {
      cancelled = true;
    };
  }, [refreshKey]);

  const refresh = useCallback(() => setRefreshKey((k) => k + 1), []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const onChange = () => refresh();
    window.addEventListener('eis-connectors-changed', onChange);
    return () => window.removeEventListener('eis-connectors-changed', onChange);
  }, [refresh]);

  const runSync = async (platform: ConnectorPlatform, connectionId: string) => {
    if (syncingId) return;
    setSyncingId(connectionId);
    try {
      await runConnectorSync({ platform, connectionId });
      refresh();
      // Hub UI listens to its own event store; signal a refresh too.
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('eis-learning-hub-changed'));
      }
    } finally {
      setSyncingId(null);
    }
  };

  const credentialFor = (platform: ConnectorPlatform) =>
    snapshot.credentials.find((c) => c.platform === platform && c.status !== 'disabled');

  const lastJobFor = (platform: ConnectorPlatform) =>
    snapshot.jobs.find((j) => j.platform === platform);

  const eventsForPlatform = (hubPlatform: ConnectorPlatform) => {
    const reg = connectorRegistry[hubPlatform];
    return events.filter((e) => e.platform === reg.relatedLearningHubPlatform).length;
  };

  const driveCredential = credentialFor('google_drive');
  const driveConfig = driveCredential
    ? snapshot.driveConfigs.find((d) => d.connectionId === driveCredential.id) ?? null
    : null;

  return (
    <div className="space-y-5">
      <header className="rounded-lg border border-white/10 bg-gradient-to-r from-[#0a1736] via-[#061126] to-[#050711] p-4 text-white">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="inline-flex items-center gap-2 rounded-md border border-[#49c8ff]/35 bg-[#49c8ff]/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-wide text-[#8ddfff]">
              <Cloud className="h-3.5 w-3.5" />
              Automated Connections
            </div>
            <h2 className="mt-3 text-xl font-black sm:text-2xl">Connect official APIs where available, automate Drive ingestion where they aren&apos;t.</h2>
            <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-300">
              Teachers do not need to upload reports manually. For export-only tools, they place reports in a school-approved Drive folder. Learning Data Hub imports, normalises, matches students, and updates mastery automatically.
            </p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <span
              className={`inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-[10px] font-black uppercase tracking-wide ${
                snapshot.source === 'firestore'
                  ? 'border-[#49c8ff]/30 bg-[#49c8ff]/10 text-[#8ddfff]'
                  : 'border-[#ffc43b]/30 bg-[#ffc43b]/10 text-[#ffe08a]'
              }`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${snapshot.source === 'firestore' ? 'bg-[#49c8ff]' : 'bg-[#ffc43b]'}`} />
              {snapshot.source === 'firestore' ? 'Firestore persistence on' : 'Local demo mode'}
            </span>
            <span className="rounded-md border border-white/10 bg-white/5 px-2 py-1 text-[10px] font-black uppercase tracking-wide text-slate-200">
              {snapshot.credentials.length} connection{snapshot.credentials.length === 1 ? '' : 's'} · {snapshot.jobs.length} job{snapshot.jobs.length === 1 ? '' : 's'}
            </span>
            <button
              onClick={refresh}
              className="inline-flex items-center gap-1 rounded-md border border-white/15 px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-slate-200 transition hover:border-[#49c8ff] hover:text-[#8ddfff]"
            >
              <RefreshCcw className="h-3 w-3" />
              Refresh
            </button>
          </div>
        </div>
      </header>

      <ConnectorSecurityNotice />

      <section>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {connectorList.map((platform) => {
            const credential = credentialFor(platform);
            const lastJob = lastJobFor(platform);
            return (
              <ConnectorCard
                key={platform}
                platform={platform}
                credential={credential}
                lastJob={lastJob}
                totalEvents={eventsForPlatform(platform)}
                onSetup={() => setSetupFor(platform)}
                onRunSync={() => credential && void runSync(platform, credential.id)}
                isSyncing={Boolean(credential && syncingId === credential.id)}
              />
            );
          })}
        </div>
      </section>

      <DriveFolderSetup
        driveConnectionId={driveCredential?.id}
        existing={driveConfig}
        onSaved={() => refresh()}
      />

      <SyncJobsPanel jobs={snapshot.jobs} />

      <section className="grid gap-3 sm:grid-cols-2">
        <ApiConnectorSetup platform="kahoot" />
        <ApiConnectorSetup platform="managebac" />
      </section>

      <p className="text-[11px] text-slate-500">
        <PlugZap className="mr-1 inline h-3 w-3 text-[#8ddfff]" />
        Synced events flow through the same pipeline as uploaded imports: external rows → LearningEvents → student matching → mastery → recommendations. Open the&nbsp;
        <button onClick={() => setActiveTab('learning-hub')} className="font-black text-[#8ddfff] underline-offset-2 hover:underline">Learning Events</button> or&nbsp;
        <button onClick={() => setActiveTab('learning-hub')} className="font-black text-[#8ddfff] underline-offset-2 hover:underline">Mastery Analytics</button> tabs to see them.
      </p>

      <ConnectorSetupModal
        platform={setupFor}
        onClose={() => setSetupFor(null)}
        onComplete={() => {
          setSetupFor(null);
          refresh();
        }}
      />
    </div>
  );
}
