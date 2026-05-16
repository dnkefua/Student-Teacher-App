'use client';

import { useState } from 'react';
import { Loader2, ShieldAlert, Sparkles, X } from 'lucide-react';
import { connectorRegistry } from '@/lib/connectors/registry';
import type { ConnectorPlatform } from '@/lib/connectors/types';
import { setupConnector, scheduleSync } from '@/lib/connectors/repository';
import { buildDemoSecretRef } from '@/lib/connectors/security';
import { DEMO_SCHOOL_ID } from '@/lib/learningHub/types';

type Props = {
  platform: ConnectorPlatform | null;
  onClose: () => void;
  onComplete: () => void;
};

export function ConnectorSetupModal({ platform, onClose, onComplete }: Props) {
  const reg = platform ? connectorRegistry[platform] : null;
  const [method, setMethod] = useState(reg?.recommendedMethod ?? 'drive_folder');
  const [demoSecret, setDemoSecret] = useState('');
  const [scheduleNightly, setScheduleNightly] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedRef, setSavedRef] = useState<string | null>(null);

  if (!platform || !reg) return null;

  const submit = async () => {
    setBusy(true);
    setError(null);
    try {
      // Always go through the secrets route — even in demo, this is what
      // production wiring will hit. The route returns a demo secretRef.
      const res = await fetch('/api/connectors/secrets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ platform, schoolId: DEMO_SCHOOL_ID, credentialLabel: reg.displayName }),
      });
      const json = (await res.json()) as { secretRef?: string };
      const secretRef = json.secretRef ?? buildDemoSecretRef(DEMO_SCHOOL_ID, platform);
      void demoSecret; // intentionally not persisted; see security notice
      const credential = await setupConnector({
        platform,
        method,
        displayName: reg.displayName,
        secretRef,
        notes: 'Created via Connector Setup modal',
      });
      if (scheduleNightly && reg.supportsAutomaticSync) {
        await scheduleSync({
          platform,
          connectionId: credential.id,
          frequency: 'daily',
          enabled: true,
        });
      }
      setSavedRef(secretRef);
      window.setTimeout(() => {
        onComplete();
      }, 700);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save connector.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-xl rounded-lg border border-white/10 bg-[#050711] p-6 text-white shadow-2xl">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[10px] uppercase tracking-wide text-slate-400">Set up connector</p>
            <h2 className="mt-1 text-xl font-black">{reg.displayName}</h2>
            <p className="mt-1 text-xs text-slate-400">{reg.category.replace(/_/g, ' ')}</p>
          </div>
          <button onClick={onClose} className="text-slate-400 transition hover:text-white"><X className="h-4 w-4" /></button>
        </div>

        <p className="mt-3 rounded-md border border-white/10 bg-white/[0.03] p-3 text-xs leading-5 text-slate-200">
          {reg.description}
        </p>

        <div className="mt-4">
          <p className="text-[10px] font-black uppercase tracking-wide text-[#8ddfff]">Setup instructions</p>
          <ol className="mt-2 list-decimal space-y-1 pl-5 text-xs leading-5 text-slate-200">
            {reg.setupInstructions.map((s) => <li key={s}>{s}</li>)}
          </ol>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <label className="block">
            <span className="text-[10px] font-black uppercase tracking-wide text-slate-300">Method</span>
            <select
              value={method}
              onChange={(e) => setMethod(e.target.value as typeof method)}
              className="mt-1 w-full rounded-md border border-white/10 bg-[#061126] px-3 py-1.5 text-sm text-white"
            >
              <option value="api">API (Recommended)</option>
              <option value="oauth">OAuth</option>
              <option value="oneroster">OneRoster</option>
              <option value="drive_folder">Drive folder ingestion</option>
              <option value="service_account">Service account</option>
              <option value="vendor_partner">Vendor / partner export</option>
              <option value="manual_export">Manual export</option>
            </select>
          </label>
          <label className="block">
            <span className="text-[10px] font-black uppercase tracking-wide text-slate-300">Schedule</span>
            <label className="mt-2 flex items-center gap-2 text-xs">
              <input
                type="checkbox"
                checked={scheduleNightly}
                onChange={(e) => setScheduleNightly(e.target.checked)}
                className="h-3.5 w-3.5 rounded border-white/30 bg-[#061126]"
              />
              Nightly at 02:00 Asia/Dubai
            </label>
          </label>
        </div>

        <div className="mt-4 rounded-md border border-[#ffc43b]/30 bg-[#ffc43b]/5 p-3 text-[11px] leading-5 text-[#ffe08a]">
          <p className="inline-flex items-center gap-2 font-black uppercase tracking-wide">
            <ShieldAlert className="h-3.5 w-3.5" />
            Demo only — not stored as a real credential
          </p>
          <p className="mt-1 text-slate-200">
            Production setup writes the real secret to Google Secret Manager via this same route and persists only the resulting
            <span className="font-mono"> secretRef</span> in Firestore. The optional field below is never sent to Firestore.
          </p>
          <input
            value={demoSecret}
            onChange={(e) => setDemoSecret(e.target.value)}
            placeholder="(optional) paste any value — discarded after this modal closes"
            className="mt-2 w-full rounded-md border border-white/10 bg-[#050711] px-3 py-1.5 text-xs text-slate-300"
          />
        </div>

        {error ? (
          <p className="mt-3 rounded-md border border-red-300/30 bg-red-300/10 px-3 py-2 text-sm font-semibold text-red-100">{error}</p>
        ) : null}
        {savedRef ? (
          <p className="mt-3 rounded-md border border-emerald-300/30 bg-emerald-300/10 px-3 py-2 text-xs font-semibold text-emerald-100">
            Connection saved. secretRef · <span className="font-mono">{savedRef}</span>
          </p>
        ) : null}

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <button
            onClick={() => void submit()}
            disabled={busy}
            className="inline-flex items-center gap-2 rounded-md bg-[#49c8ff] px-3 py-1.5 text-xs font-black text-[#061126] transition hover:bg-[#8ddfff] disabled:opacity-60"
          >
            {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
            Save demo connection
          </button>
          <a
            href="https://github.com/dnkefua/Student-Teacher-App/blob/main/docs/automated-connectors-gcp.md"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-md border border-white/15 px-3 py-1.5 text-xs font-black text-slate-200 transition hover:border-white/35"
          >
            Production setup guide ↗
          </a>
        </div>
      </div>
    </div>
  );
}
