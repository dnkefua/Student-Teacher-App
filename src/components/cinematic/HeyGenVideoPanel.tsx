'use client';

import React, { useState } from 'react';
import { Clapperboard, Loader2, PlayCircle, Wand2 } from 'lucide-react';
import { createMockHeyGenAsset, saveCinematicAsset } from '@/lib/cinematic/assetPipeline';
import type { CinematicAsset, CinematicLessonSpec } from '@/lib/cinematic/types';

type CreateResponse = {
  videoId: string;
  status: 'queued' | 'processing' | 'generated' | 'failed' | 'demo';
  videoUrl?: string | null;
  message?: string;
  source: 'heygen' | 'mock';
};

export function HeyGenVideoPanel({
  spec,
  teacherMode,
  onAssetSaved,
}: {
  spec: CinematicLessonSpec;
  teacherMode: boolean;
  onAssetSaved?: (asset: CinematicAsset) => void;
}) {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState(spec.heygen.videoUrl ?? '');
  const [providerId, setProviderId] = useState(spec.heygen.heygenVideoId ?? '');
  const [status, setStatus] = useState<'not_generated' | 'queued' | 'processing' | 'generated' | 'failed' | 'demo'>(spec.heygen.status ?? 'not_generated');

  const generate = async () => {
    if (!teacherMode || busy) return;
    setBusy(true);
    setMessage(null);
    try {
      const res = await fetch('/api/heygen/create-lesson-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lessonId: spec.id,
          title: spec.heygen.title,
          script: spec.heygen.script,
          avatarStyle: spec.heygen.avatarStyle,
          voiceStyle: spec.heygen.voiceStyle,
          aspectRatio: spec.heygen.aspectRatio,
          includeCaptions: spec.heygen.includeCaptions,
          videoPurpose: spec.heygen.videoPurpose,
        }),
      });
      const data = (await res.json()) as CreateResponse;
      if (!res.ok) throw new Error(data.message ?? 'Could not create HeyGen video.');
      setProviderId(data.videoId);
      setStatus(data.status === 'demo' ? 'demo' : 'queued');
      setVideoUrl(data.videoUrl ?? '');
      setMessage(data.message ?? (data.source === 'heygen' ? 'HeyGen video queued.' : 'HeyGen demo asset saved.'));
      const asset = createMockHeyGenAsset({
        lessonId: spec.id,
        subject: spec.subject,
        title: spec.heygen.title,
        script: spec.heygen.script,
        purpose: spec.heygen.videoPurpose,
        providerId: data.videoId,
        videoUrl: data.videoUrl,
        status: data.status === 'demo' ? 'demo' : 'queued',
      });
      const saved = saveCinematicAsset(asset);
      onAssetSaved?.(saved);
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'HeyGen generation failed.');
      setStatus('failed');
    } finally {
      setBusy(false);
    }
  };

  const checkStatus = async () => {
    if (!providerId || providerId === 'mock-heygen-video') return;
    setBusy(true);
    try {
      const res = await fetch(`/api/heygen/video-status?videoId=${encodeURIComponent(providerId)}`);
      const data = (await res.json()) as CreateResponse;
      if (!res.ok) throw new Error(data.message ?? 'Could not check video status.');
      setStatus(data.status === 'generated' ? 'generated' : data.status);
      setVideoUrl(data.videoUrl ?? '');
      setMessage(data.message ?? `Video status: ${data.status}`);
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Video status check failed.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="rounded-lg border border-white/10 bg-[#061126] p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase tracking-wide text-[#ffc43b]">HeyGen avatar video</p>
          <p className="mt-1 text-[11px] uppercase tracking-wide text-slate-400">
            {spec.heygen.videoPurpose.replace(/_/g, ' ')} · {spec.heygen.durationTargetSeconds}s target
          </p>
        </div>
        <Clapperboard className="h-5 w-5 text-[#8ddfff]" />
      </div>

      {videoUrl ? (
        <video src={videoUrl} controls className="mt-4 aspect-video w-full rounded-md border border-white/10 bg-black" />
      ) : (
        <div className="mt-4 rounded-md border border-[#49c8ff]/25 bg-[#49c8ff]/5 p-4">
          <div className="flex items-start gap-3">
            <PlayCircle className="mt-0.5 h-5 w-5 text-[#8ddfff]" />
            <div>
              <p className="text-sm font-black text-white">{status === 'demo' ? 'Demo video card' : 'No avatar video generated yet'}</p>
              <p className="mt-2 text-xs leading-5 text-slate-300">{spec.heygen.script}</p>
              {spec.heygen.includeCaptions ? <p className="mt-2 text-[10px] font-black uppercase tracking-wide text-[#8ddfff]">Captions requested</p> : null}
            </div>
          </div>
        </div>
      )}

      {message ? <p className="mt-3 rounded-md border border-white/10 bg-white/[0.03] px-3 py-2 text-xs text-slate-300">{message}</p> : null}

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={generate}
          disabled={!teacherMode || busy}
          className="inline-flex items-center gap-2 rounded-md bg-[#ffc43b] px-3 py-2 text-xs font-black text-[#061126] transition hover:bg-[#ffe08a] disabled:cursor-not-allowed disabled:opacity-45"
        >
          {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Wand2 className="h-3.5 w-3.5" />}
          Generate Avatar Explainer
        </button>
        <button
          type="button"
          onClick={checkStatus}
          disabled={!providerId || busy}
          className="rounded-md border border-white/10 px-3 py-2 text-xs font-black text-slate-200 transition hover:border-[#49c8ff]/60 hover:text-white disabled:cursor-not-allowed disabled:opacity-45"
        >
          Check Status
        </button>
      </div>
    </div>
  );
}
