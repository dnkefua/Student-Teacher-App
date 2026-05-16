'use client';

import { useState } from 'react';
import { CheckCircle2, FolderTree, Loader2 } from 'lucide-react';
import type { DriveIngestionConfig } from '@/lib/connectors/types';
import { saveDriveConfig } from '@/lib/connectors/repository';
import { DEMO_SCHOOL_ID, type ExternalPlatform } from '@/lib/learningHub/types';

type Props = {
  driveConnectionId?: string;
  existing?: DriveIngestionConfig | null;
  onSaved?: (config: DriveIngestionConfig) => void;
};

const DEFAULT_ROUTING: { folderNameContains: string; platform: ExternalPlatform }[] = [
  { folderNameContains: 'kahoot', platform: 'kahoot' },
  { folderNameContains: 'blooket', platform: 'blooket' },
  { folderNameContains: 'drfrost', platform: 'drfrost' },
  { folderNameContains: 'myimaths', platform: 'myimaths' },
  { folderNameContains: 'managebac', platform: 'managebac' },
  { folderNameContains: 'generic', platform: 'manual_csv' },
];

function uid(prefix: string): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return `${prefix}-${crypto.randomUUID().split('-')[0]}`;
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function DriveFolderSetup({ driveConnectionId, existing, onSaved }: Props) {
  const [folderId, setFolderId] = useState(existing?.folderId ?? '');
  const [folderName, setFolderName] = useState(existing?.folderName ?? 'EIS Learning Hub · Drive Ingest');
  const [archive, setArchive] = useState(existing?.archiveProcessedFiles ?? true);
  const [processedFolderId, setProcessedFolderId] = useState(existing?.processedFolderId ?? '');
  const [failedFolderId, setFailedFolderId] = useState(existing?.failedFolderId ?? '');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const save = async () => {
    if (saving) return;
    setSaving(true);
    try {
      const next: DriveIngestionConfig = {
        id: existing?.id ?? uid('drv'),
        schoolId: DEMO_SCHOOL_ID,
        connectionId: driveConnectionId ?? 'demo-drive',
        folderId: folderId || 'demo-folder-id',
        folderName,
        platformRouting: DEFAULT_ROUTING,
        archiveProcessedFiles: archive,
        processedFolderId: processedFolderId || undefined,
        failedFolderId: failedFolderId || undefined,
        createdAt: existing?.createdAt ?? new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      const written = await saveDriveConfig(next);
      onSaved?.(written);
      setSaved(true);
      window.setTimeout(() => setSaved(false), 1800);
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="rounded-lg border border-white/10 bg-[#050711]/70 p-4">
      <div className="flex items-start gap-3">
        <FolderTree className="mt-0.5 h-5 w-5 text-[#8ddfff]" />
        <div className="min-w-0 flex-1">
          <p className="text-xs font-black uppercase tracking-wide text-[#8ddfff]">Drive ingestion folder</p>
          <p className="mt-1 text-[11px] leading-5 text-slate-300">
            Teachers no longer upload reports into this app. They export from the platform into the shared school Drive
            folder. Learning Data Hub imports new files automatically and routes them via subfolder name.
          </p>

          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <label className="block">
              <span className="text-[10px] font-black uppercase tracking-wide text-slate-300">Drive folder ID</span>
              <input
                value={folderId}
                onChange={(e) => setFolderId(e.target.value)}
                placeholder="1AbCdEf..."
                className="mt-1 w-full rounded-md border border-white/10 bg-[#061126] px-3 py-1.5 text-sm text-white"
              />
            </label>
            <label className="block">
              <span className="text-[10px] font-black uppercase tracking-wide text-slate-300">Folder name (display)</span>
              <input
                value={folderName}
                onChange={(e) => setFolderName(e.target.value)}
                className="mt-1 w-full rounded-md border border-white/10 bg-[#061126] px-3 py-1.5 text-sm text-white"
              />
            </label>
            <label className="block">
              <span className="text-[10px] font-black uppercase tracking-wide text-slate-300">Processed folder ID (optional)</span>
              <input
                value={processedFolderId}
                onChange={(e) => setProcessedFolderId(e.target.value)}
                className="mt-1 w-full rounded-md border border-white/10 bg-[#061126] px-3 py-1.5 text-sm text-white"
              />
            </label>
            <label className="block">
              <span className="text-[10px] font-black uppercase tracking-wide text-slate-300">Failed folder ID (optional)</span>
              <input
                value={failedFolderId}
                onChange={(e) => setFailedFolderId(e.target.value)}
                className="mt-1 w-full rounded-md border border-white/10 bg-[#061126] px-3 py-1.5 text-sm text-white"
              />
            </label>
          </div>

          <label className="mt-3 flex items-center gap-2 text-xs text-slate-200">
            <input
              type="checkbox"
              checked={archive}
              onChange={(e) => setArchive(e.target.checked)}
              className="h-3.5 w-3.5 rounded border-white/30 bg-[#061126]"
            />
            Archive each file to the processed folder after import
          </label>

          <div className="mt-3">
            <p className="text-[10px] font-black uppercase tracking-wide text-slate-400">Default routing</p>
            <ul className="mt-1 grid gap-1 sm:grid-cols-2 text-[11px] text-slate-300">
              {DEFAULT_ROUTING.map((r) => (
                <li key={r.folderNameContains} className="rounded-md border border-white/10 bg-white/[0.03] px-2 py-1">
                  Folder contains <span className="font-mono text-[#8ddfff]">{r.folderNameContains}</span> → <span className="font-mono">{r.platform}</span>
                </li>
              ))}
            </ul>
          </div>

          <button
            onClick={() => void save()}
            disabled={saving}
            className={`mt-3 inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-xs font-black transition ${
              saved
                ? 'bg-emerald-400 text-[#061126] shadow-[0_0_24px_rgba(74,222,128,.55)]'
                : 'bg-[#49c8ff] text-[#061126] hover:bg-[#8ddfff]'
            } disabled:opacity-60`}
          >
            {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : saved ? <CheckCircle2 className="h-3.5 w-3.5" /> : <FolderTree className="h-3.5 w-3.5" />}
            {saved ? 'Drive config saved' : 'Save Drive config'}
          </button>
        </div>
      </div>
    </section>
  );
}
