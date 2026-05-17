'use client';

import React, { useEffect, useState } from 'react';
import { Film, RefreshCcw } from 'lucide-react';
import { listAssetsForLesson } from '@/lib/cinematic/assetPipeline';
import type { CinematicAsset } from '@/lib/cinematic/types';

export function CinematicAssetPanel({ lessonId }: { lessonId: string }) {
  const [assets, setAssets] = useState<CinematicAsset[]>([]);

  useEffect(() => {
    let alive = true;
    const load = async () => {
      const next = await listAssetsForLesson(lessonId);
      if (alive) setAssets(next);
    };
    void load();
    window.addEventListener('eis-cinematic-assets-changed', load);
    return () => {
      alive = false;
      window.removeEventListener('eis-cinematic-assets-changed', load);
    };
  }, [lessonId]);

  return (
    <div className="rounded-lg border border-white/10 bg-[#061126] p-4">
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-black uppercase tracking-wide text-[#ffc43b]">Cinematic assets</p>
        <RefreshCcw className="h-3.5 w-3.5 text-slate-500" />
      </div>
      <div className="mt-3 space-y-2">
        {assets.length === 0 ? (
          <p className="rounded-md border border-white/10 bg-white/[0.03] px-3 py-3 text-xs leading-5 text-slate-400">
            No saved video assets yet. Generate an avatar explainer from the HeyGen panel.
          </p>
        ) : (
          assets.map((asset) => (
            <div key={asset.id} className="rounded-md border border-white/10 bg-white/[0.03] p-3">
              <div className="flex items-start gap-2">
                <Film className="mt-0.5 h-4 w-4 text-[#8ddfff]" />
                <div className="min-w-0">
                  <p className="truncate text-sm font-black text-white">{asset.title}</p>
                  <p className="mt-1 text-[11px] uppercase tracking-wide text-slate-400">
                    {asset.assetType.replace(/_/g, ' ')} · {asset.status}
                  </p>
                  {asset.videoUrl ? (
                    <a href={asset.videoUrl} target="_blank" rel="noreferrer" className="mt-2 inline-block text-xs font-black text-[#8ddfff]">
                      Open Video
                    </a>
                  ) : null}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
