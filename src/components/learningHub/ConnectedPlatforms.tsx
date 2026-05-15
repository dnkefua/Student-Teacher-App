'use client';

import { Database, Link2, Loader2, UploadCloud } from 'lucide-react';
import type { ExternalImport, LearningEvent, PlatformConnection } from '@/lib/learningHub/types';
import { platformAnalyticsRegistry } from '@/lib/learningHub/platformRegistry';

type Props = {
  connections: PlatformConnection[];
  imports: ExternalImport[];
  events: LearningEvent[];
  onUpload: (platform: PlatformConnection['platform']) => void;
};

const CORE_PLATFORMS: PlatformConnection['platform'][] = [
  'managebac',
  'kahoot',
  'blooket',
  'drfrost',
  'myimaths',
  'neuroquest',
  'eis_maths_studio',
  'manual_csv',
];

export function ConnectedPlatforms({ connections, imports, events, onUpload }: Props) {
  return (
    <div className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {CORE_PLATFORMS.map((platform) => {
          const schema = platformAnalyticsRegistry[platform];
          const connection = connections.find((c) => c.platform === platform);
          const platformEvents = events.filter((e) => e.platform === platform);
          const lastImport = imports.find((i) => i.platform === platform);
          const status: PlatformConnection['status'] = connection?.status ?? (platformEvents.length > 0 ? 'demo' : 'needs_setup');

          const badgeStyle =
            status === 'connected'
              ? 'border-emerald-300/30 bg-emerald-300/10 text-emerald-200'
              : status === 'demo'
              ? 'border-[#49c8ff]/30 bg-[#49c8ff]/10 text-[#8ddfff]'
              : status === 'planned'
              ? 'border-white/15 bg-white/5 text-slate-300'
              : 'border-[#ffc43b]/30 bg-[#ffc43b]/10 text-[#ffe08a]';

          return (
            <article key={platform} className="rounded-lg border border-white/10 bg-[#061126]/80 p-4 backdrop-blur">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-black text-white">{schema.displayName}</p>
                  <p className="text-[10px] uppercase tracking-wide text-slate-500">{schema.category.replace(/_/g, ' ')}</p>
                </div>
                <span className={`rounded-full border px-2 py-0.5 text-[10px] font-black uppercase tracking-wide ${badgeStyle}`}>
                  {status.replace(/_/g, ' ')}
                </span>
              </div>
              <p className="mt-2 text-xs leading-5 text-slate-400">
                Supports: <span className="font-mono text-slate-300">{schema.supportedMethods.join(', ')}</span>
              </p>
              <div className="mt-3 grid grid-cols-2 gap-2 text-[11px]">
                <div className="rounded-md border border-white/10 bg-white/[0.03] px-2 py-1.5">
                  <p className="text-slate-500">Events stored</p>
                  <p className="font-black text-white">{platformEvents.length.toLocaleString()}</p>
                </div>
                <div className="rounded-md border border-white/10 bg-white/[0.03] px-2 py-1.5">
                  <p className="text-slate-500">Last import</p>
                  <p className="truncate font-black text-white">
                    {lastImport ? new Date(lastImport.createdAt).toLocaleDateString() : '—'}
                  </p>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  onClick={() => onUpload(platform)}
                  className="inline-flex items-center gap-2 rounded-md bg-[#49c8ff] px-3 py-1.5 text-xs font-black text-[#061126] transition hover:bg-[#8ddfff]"
                >
                  <UploadCloud className="h-3.5 w-3.5" />
                  Upload report
                </button>
                <button
                  disabled
                  className="inline-flex items-center gap-2 rounded-md border border-white/15 px-3 py-1.5 text-xs font-black text-slate-400 opacity-70"
                >
                  <Link2 className="h-3.5 w-3.5" />
                  Setup API (soon)
                </button>
              </div>
            </article>
          );
        })}
      </div>
      <p className="flex items-center gap-2 text-xs text-slate-400">
        <Database className="h-3.5 w-3.5 text-[#8ddfff]" />
        Local storage holds {events.length.toLocaleString()} normalised events across {imports.length} imports.
        <Loader2 className="h-3 w-3 animate-spin text-transparent" aria-hidden />
      </p>
    </div>
  );
}
