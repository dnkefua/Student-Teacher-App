'use client';

// Compact pre-flight summary for API-style connectors. The full setup
// happens inside ConnectorSetupModal — this card just surfaces the
// production wiring requirements so admins know what to gather.

import { LinkIcon } from 'lucide-react';
import { connectorRegistry } from '@/lib/connectors/registry';
import type { ConnectorPlatform } from '@/lib/connectors/types';

type Props = { platform: ConnectorPlatform };

export function ApiConnectorSetup({ platform }: Props) {
  const reg = connectorRegistry[platform];
  return (
    <article className="rounded-lg border border-white/10 bg-[#050711]/70 p-4 text-sm leading-6 text-slate-200">
      <div className="flex items-center gap-2">
        <LinkIcon className="h-4 w-4 text-[#8ddfff]" />
        <p className="text-xs font-black uppercase tracking-wide text-[#8ddfff]">API integration checklist · {reg.displayName}</p>
      </div>
      <ul className="mt-3 list-disc space-y-1 pl-5 text-xs leading-5">
        {reg.setupInstructions.map((s) => <li key={s}>{s}</li>)}
      </ul>
      <p className="mt-3 text-[11px] text-slate-400">
        Required env: <span className="font-mono text-[#8ddfff]">GOOGLE_CLOUD_PROJECT</span>, <span className="font-mono text-[#8ddfff]">CONNECTOR_SERVICE_ACCOUNT_EMAIL</span>, <span className="font-mono text-[#8ddfff]">{platform.toUpperCase()}_*_SECRET_REF</span>. None of these are <span className="font-mono">NEXT_PUBLIC_*</span>.
      </p>
    </article>
  );
}
