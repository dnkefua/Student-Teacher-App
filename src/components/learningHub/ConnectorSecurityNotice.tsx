'use client';

import { ShieldCheck } from 'lucide-react';

export function ConnectorSecurityNotice() {
  return (
    <section className="rounded-lg border border-[#49c8ff]/25 bg-[#49c8ff]/5 p-4 text-slate-200">
      <div className="flex items-start gap-3">
        <ShieldCheck className="mt-0.5 h-5 w-5 text-[#8ddfff]" />
        <div className="min-w-0">
          <p className="text-xs font-black uppercase tracking-wide text-[#8ddfff]">Connector security model</p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-xs leading-5 text-slate-300">
            <li><span className="font-black text-white">No scraping.</span> Every connector uses an official channel (vendor API, OneRoster, Drive ingestion) or doesn&apos;t exist.</li>
            <li><span className="font-black text-white">No platform passwords</span> from teachers or students — ever.</li>
            <li>API access requires school admin approval. Vendor approval is required for Kahoot Reports API + Blooket / MyiMaths / Dr Frost vendor APIs.</li>
            <li>Secrets live in Google Secret Manager (or server-side env). Firestore stores <span className="font-mono text-[#8ddfff]">secretRef</span> pointers only.</li>
            <li>Every sync writes a row to <span className="font-mono text-[#8ddfff]">connectorAuditLogs</span> with actor + status + counts.</li>
            <li>Drive ingestion only reads from school-approved Workspace folders that the admin explicitly shares with the connector service account.</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
