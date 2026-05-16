'use client';

import { Loader2, PlugZap, RefreshCcw, ShieldCheck } from 'lucide-react';
import { connectorRegistry } from '@/lib/connectors/registry';
import type { ConnectorPlatform, PlatformCredential, SyncJob } from '@/lib/connectors/types';

type Props = {
  platform: ConnectorPlatform;
  credential?: PlatformCredential;
  lastJob?: SyncJob;
  totalEvents: number;
  onSetup: () => void;
  onRunSync: () => void;
  isSyncing: boolean;
};

const STATUS_STYLE: Record<string, string> = {
  ready: 'border-emerald-300/30 bg-emerald-300/10 text-emerald-200',
  connected: 'border-emerald-300/30 bg-emerald-300/10 text-emerald-200',
  drive_ready: 'border-[#49c8ff]/30 bg-[#49c8ff]/10 text-[#8ddfff]',
  needs_setup: 'border-[#ffc43b]/30 bg-[#ffc43b]/10 text-[#ffe08a]',
  vendor_approval_required: 'border-[#ffc43b]/30 bg-[#ffc43b]/10 text-[#ffe08a]',
  planned: 'border-white/15 bg-white/5 text-slate-300',
  sync_failed: 'border-[#ff3d22]/30 bg-[#ff3d22]/10 text-[#ff8a73]',
  disabled: 'border-white/15 bg-white/5 text-slate-400',
};

function timeAgo(iso?: string): string {
  if (!iso) return '—';
  const ms = Date.now() - new Date(iso).getTime();
  const minutes = Math.round(ms / 60_000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h`;
  return `${Math.round(hours / 24)}d`;
}

export function ConnectorCard({ platform, credential, lastJob, totalEvents, onSetup, onRunSync, isSyncing }: Props) {
  const reg = connectorRegistry[platform];
  const effectiveStatus = credential?.status ?? reg.status;
  const badge = STATUS_STYLE[effectiveStatus] ?? STATUS_STYLE.planned;

  return (
    <article className="rounded-lg border border-white/10 bg-[#061126]/80 p-4 backdrop-blur">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-black text-white">{reg.displayName}</p>
          <p className="text-[10px] uppercase tracking-wide text-slate-500">{reg.category.replace(/_/g, ' ')}</p>
        </div>
        <span className={`rounded-full border px-2 py-0.5 text-[10px] font-black uppercase tracking-wide ${badge}`}>
          {effectiveStatus.replace(/_/g, ' ')}
        </span>
      </div>

      <p className="mt-2 text-xs leading-5 text-slate-300 line-clamp-3">{reg.description}</p>

      <div className="mt-3 grid grid-cols-2 gap-2 text-[11px]">
        <div className="rounded-md border border-white/10 bg-white/[0.03] px-2 py-1.5">
          <p className="text-slate-500">Recommended</p>
          <p className="font-mono text-slate-200">{reg.recommendedMethod}</p>
        </div>
        <div className="rounded-md border border-white/10 bg-white/[0.03] px-2 py-1.5">
          <p className="text-slate-500">Last sync</p>
          <p className="font-black text-white">
            {lastJob ? `${timeAgo(lastJob.finishedAt ?? lastJob.startedAt)} · ${lastJob.eventsCreated ?? 0} evt` : '—'}
          </p>
        </div>
        <div className="rounded-md border border-white/10 bg-white/[0.03] px-2 py-1.5">
          <p className="text-slate-500">Events in Hub</p>
          <p className="font-black text-white">{totalEvents.toLocaleString()}</p>
        </div>
        <div className="rounded-md border border-white/10 bg-white/[0.03] px-2 py-1.5">
          <p className="text-slate-500">secretRef</p>
          <p className="truncate font-mono text-slate-300">{credential?.secretRef ?? '—'}</p>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <div className="flex flex-wrap gap-1">
          {reg.requiresSchoolAdmin ? (
            <span className="rounded-full border border-[#49c8ff]/25 bg-[#49c8ff]/5 px-2 py-0.5 text-[10px] font-black uppercase tracking-wide text-[#8ddfff]">
              <ShieldCheck className="mr-1 inline h-3 w-3" /> School admin
            </span>
          ) : null}
          {reg.requiresVendorApproval ? (
            <span className="rounded-full border border-[#ffc43b]/25 bg-[#ffc43b]/5 px-2 py-0.5 text-[10px] font-black uppercase tracking-wide text-[#ffe08a]">
              Vendor approval
            </span>
          ) : null}
          {reg.supportsDriveIngestion ? (
            <span className="rounded-full border border-emerald-300/25 bg-emerald-300/5 px-2 py-0.5 text-[10px] font-black uppercase tracking-wide text-emerald-200">
              Drive ingestion ready
            </span>
          ) : null}
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <button
          onClick={onSetup}
          className="inline-flex items-center gap-1 rounded-md bg-[#49c8ff] px-2.5 py-1 text-[11px] font-black text-[#061126] transition hover:bg-[#8ddfff]"
        >
          <PlugZap className="h-3 w-3" />
          {credential ? 'Reconfigure' : 'Connect'}
        </button>
        <button
          onClick={onRunSync}
          disabled={!credential || isSyncing}
          className="inline-flex items-center gap-1 rounded-md border border-white/15 px-2.5 py-1 text-[11px] font-black text-slate-200 transition hover:border-[#49c8ff] hover:text-[#8ddfff] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSyncing ? <Loader2 className="h-3 w-3 animate-spin" /> : <RefreshCcw className="h-3 w-3" />}
          Run sync
        </button>
      </div>
    </article>
  );
}
