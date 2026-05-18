'use client';

import React, { useState } from 'react';
import { Clapperboard, Info, Loader2, PlayCircle, ShieldCheck, Wand2 } from 'lucide-react';
import { createMockHeyGenAsset, saveCinematicAsset, updateCinematicAssetStatus } from '@/lib/cinematic/assetPipeline';
import type { CinematicAsset, CinematicLessonSpec } from '@/lib/cinematic/types';

type CreateResponse = {
  videoId: string;
  status: 'queued' | 'processing' | 'generated' | 'failed' | 'demo';
  videoUrl?: string | null;
  thumbnailUrl?: string | null;
  message?: string;
  source: 'heygen' | 'mock';
};

type ValidateResponse = {
  ok: boolean;
  source: 'heygen' | 'mock';
  message: string;
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
  const [assetId, setAssetId] = useState('');
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
      const saved = await saveCinematicAsset(asset);
      setAssetId(saved.id);
      onAssetSaved?.(saved);
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'HeyGen generation failed.');
      setStatus('failed');
    } finally {
      setBusy(false);
    }
  };

  const checkStatus = async () => {
    if (!providerId) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/heygen/video-status?videoId=${encodeURIComponent(providerId)}`);
      const data = (await res.json()) as CreateResponse;
      if (!res.ok) throw new Error(data.message ?? 'Could not check video status.');
      setStatus(data.status === 'generated' ? 'generated' : data.status);
      setVideoUrl(data.videoUrl ?? '');
      setMessage(data.message ?? `Video status: ${data.status}`);
      if (assetId) {
        await updateCinematicAssetStatus(assetId, {
          status: data.status === 'generated' ? 'ready' : data.status === 'demo' ? 'demo' : data.status,
          videoUrl: data.videoUrl ?? undefined,
          thumbnailUrl: data.thumbnailUrl ?? undefined,
          providerId,
        });
      }
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Video status check failed.');
    } finally {
      setBusy(false);
    }
  };

  const validateConnection = async () => {
    if (!teacherMode || busy) return;
    setBusy(true);
    setMessage(null);
    try {
      const res = await fetch('/api/heygen/validate');
      const data = (await res.json()) as ValidateResponse;
      if (!res.ok) throw new Error(data.message ?? 'HeyGen validation failed.');
      setMessage(data.message);
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'HeyGen validation failed.');
    } finally {
      setBusy(false);
    }
  };

  const statusLabel =
    status === 'generated'
      ? 'Generated'
      : status === 'queued'
        ? 'Queued in HeyGen'
        : status === 'processing'
          ? 'Processing in HeyGen'
          : status === 'failed'
            ? 'Failed'
            : status === 'demo'
              ? 'Demo (no HeyGen key)'
              : 'Not generated';

  return (
    <div className="rounded-lg border border-white/10 bg-[#061126] p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase tracking-wide text-[#ffc43b]">HeyGen avatar video</p>
          <p className="mt-1 text-[11px] uppercase tracking-wide text-slate-400">
            {spec.heygen.videoPurpose.replace(/_/g, ' ')} · {spec.heygen.durationTargetSeconds}s target
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`rounded-md border px-2 py-1 text-[10px] font-black uppercase tracking-wide ${
              status === 'generated'
                ? 'border-emerald-300/30 bg-emerald-300/10 text-emerald-200'
                : status === 'failed'
                  ? 'border-red-300/30 bg-red-300/10 text-red-100'
                  : status === 'demo'
                    ? 'border-[#ffc43b]/35 bg-[#ffc43b]/10 text-[#ffe08a]'
                    : 'border-white/15 bg-white/5 text-slate-200'
            }`}
          >
            {statusLabel}
          </span>
          <Clapperboard className="h-5 w-5 text-[#8ddfff]" />
        </div>
      </div>

      <div className="mt-3 flex items-start gap-2 rounded-md border border-white/10 bg-white/[0.03] px-3 py-2 text-[11px] leading-5 text-slate-300">
        <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#8ddfff]" />
        <p>
          HeyGen creates the avatar/video layer only. The interactive 3D lesson runs inside EIS Learning Studio.
        </p>
      </div>

      {videoUrl && status === 'generated' ? (
        <video src={videoUrl} controls className="mt-4 aspect-video w-full rounded-md border border-white/10 bg-black" />
      ) : (
        <div className="mt-4 rounded-md border border-[#49c8ff]/25 bg-[#49c8ff]/5 p-4">
          <div className="flex items-start gap-3">
            <PlayCircle className="mt-0.5 h-5 w-5 text-[#8ddfff]" />
            <div>
              <p className="text-sm font-black text-white">
                {status === 'demo'
                  ? 'Demo mode - no real HeyGen video was generated'
                  : status === 'queued' || status === 'processing'
                    ? 'Avatar video is being prepared in HeyGen'
                    : status === 'failed'
                      ? 'HeyGen could not generate this avatar video'
                      : 'No avatar video generated yet'}
              </p>
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
          {status === 'failed' ? 'Retry Avatar Explainer' : 'Generate Avatar Explainer'}
        </button>
        <button
          type="button"
          onClick={checkStatus}
          disabled={!providerId || busy}
          className="rounded-md border border-white/10 px-3 py-2 text-xs font-black text-slate-200 transition hover:border-[#49c8ff]/60 hover:text-white disabled:cursor-not-allowed disabled:opacity-45"
        >
          Check Status
        </button>
        <button
          type="button"
          onClick={validateConnection}
          disabled={!teacherMode || busy}
          className="inline-flex items-center gap-2 rounded-md border border-white/10 px-3 py-2 text-xs font-black text-slate-200 transition hover:border-emerald-300/60 hover:text-white disabled:cursor-not-allowed disabled:opacity-45"
        >
          <ShieldCheck className="h-3.5 w-3.5" />
          Validate HeyGen
        </button>
      </div>
    </div>
  );
}
