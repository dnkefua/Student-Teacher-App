'use client';

import type { SyncJob } from '@/lib/connectors/types';
import { connectorRegistry } from '@/lib/connectors/registry';

type Props = { jobs: SyncJob[] };

const STATUS_STYLE: Record<SyncJob['status'], string> = {
  scheduled: 'border-white/15 bg-white/5 text-slate-300',
  running: 'border-[#49c8ff]/30 bg-[#49c8ff]/10 text-[#8ddfff]',
  success: 'border-emerald-300/30 bg-emerald-300/10 text-emerald-200',
  failed: 'border-[#ff3d22]/30 bg-[#ff3d22]/10 text-[#ff8a73]',
  partial: 'border-[#ffc43b]/30 bg-[#ffc43b]/10 text-[#ffe08a]',
};

function timeAgo(iso?: string): string {
  if (!iso) return '—';
  const ms = Date.now() - new Date(iso).getTime();
  if (ms < 60_000) return 'just now';
  const minutes = Math.round(ms / 60_000);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  return `${days}d ago`;
}

export function SyncJobsPanel({ jobs }: Props) {
  return (
    <section className="rounded-lg border border-white/10 bg-[#050711]/70 p-4">
      <p className="text-xs font-black uppercase tracking-wide text-[#ffc43b]">Recent sync jobs</p>
      {jobs.length === 0 ? (
        <p className="mt-2 text-xs text-slate-400">No sync jobs yet. Run a connector to populate this list.</p>
      ) : (
        <div className="mt-3 overflow-x-auto rounded-md border border-white/10 bg-[#050711]/70">
          <table className="min-w-[760px] text-left text-xs text-slate-200">
            <thead className="bg-white/[0.03] text-[10px] uppercase tracking-wide text-slate-400">
              <tr>
                <th className="px-3 py-2">Platform</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2">Method</th>
                <th className="px-3 py-2">Rows</th>
                <th className="px-3 py-2">Events</th>
                <th className="px-3 py-2">Started</th>
                <th className="px-3 py-2">Finished</th>
                <th className="px-3 py-2">Error</th>
              </tr>
            </thead>
            <tbody>
              {jobs.slice(0, 25).map((j) => (
                <tr key={j.id} className="border-t border-white/5">
                  <td className="px-3 py-2 font-black text-white">{connectorRegistry[j.platform]?.displayName ?? j.platform}</td>
                  <td className="px-3 py-2">
                    <span className={`rounded-full border px-2 py-0.5 text-[10px] font-black uppercase tracking-wide ${STATUS_STYLE[j.status]}`}>
                      {j.status}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-slate-400">{j.method}</td>
                  <td className="px-3 py-2">{j.rowsPulled ?? '—'}</td>
                  <td className="px-3 py-2">{j.eventsCreated ?? '—'}</td>
                  <td className="px-3 py-2 text-slate-400">{timeAgo(j.startedAt)}</td>
                  <td className="px-3 py-2 text-slate-400">{timeAgo(j.finishedAt)}</td>
                  <td className="max-w-[220px] truncate px-3 py-2 text-[#ff8a73]">{j.error ?? ''}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
