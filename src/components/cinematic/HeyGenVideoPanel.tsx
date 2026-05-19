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

function sanitiseVendorMessage(message: string): string {
  return message
    .replace(/HeyGen/gi, 'Studio video')
    .replace(/HEYGEN_/g, 'VIDEO_')
    .replace(/avatar\/video layer/gi, 'cinematic video layer')
    .replace(/avatar video/gi, 'lesson video')
    .replace(/avatar/gi, 'presenter');
}

function publicCreateMessage(data: CreateResponse): string {
  if (data.status === 'failed') {
    return sanitiseVendorMessage(data.message ?? 'Video request failed. Check presenter, voice, plan access, and credits.');
  }
  if (data.status === 'demo' || data.source === 'mock') {
    return 'Preview render saved. A playable studio video appears when production rendering is configured and complete.';
  }
  return data.videoUrl ? 'Studio video is ready.' : 'Studio video request queued. Check status until playback is ready.';
}

function studioPreviewSrc(spec: CinematicLessonSpec): string {
  const text = `${spec.title} ${spec.topic} ${spec.concept} ${spec.sceneType}`.toLowerCase();
  if (text.includes('cell')) return '/cinematic/cell-comparison.svg';
  if (text.includes('food') || text.includes('ecosystem')) return '/cinematic/food-web.svg';
  if (text.includes('particle') || text.includes('solid') || text.includes('liquid') || text.includes('gas')) return '/cinematic/particle-model.svg';
  if (spec.subject === 'mathematics') return '/cinematic/math-model.svg';
  if (spec.subject === 'english') return '/cinematic/english-visual-text.svg';
  return '/cinematic/particle-model.svg';
}

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
      if (!res.ok) throw new Error(sanitiseVendorMessage(data.message ?? 'Could not create studio video.'));
      setProviderId(data.videoId);
      setStatus(data.status === 'demo' ? 'demo' : 'queued');
      setVideoUrl(data.videoUrl ?? '');
      setMessage(publicCreateMessage(data));
      const asset = createMockHeyGenAsset({
        lessonId: spec.id,
        subject: spec.subject,
        title: sanitiseVendorMessage(spec.heygen.title),
        script: sanitiseVendorMessage(spec.heygen.script),
        purpose: spec.heygen.videoPurpose,
        providerId: data.videoId,
        videoUrl: data.videoUrl,
        status: data.status === 'demo' ? 'demo' : 'queued',
      });
      const saved = await saveCinematicAsset(asset);
      setAssetId(saved.id);
      onAssetSaved?.(saved);
    } catch (err) {
      setMessage(err instanceof Error ? sanitiseVendorMessage(err.message) : 'Studio video generation failed.');
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
      setMessage(publicCreateMessage(data));
      if (assetId) {
        await updateCinematicAssetStatus(assetId, {
          status: data.status === 'generated' ? 'ready' : data.status === 'demo' ? 'demo' : data.status,
          videoUrl: data.videoUrl ?? undefined,
          thumbnailUrl: data.thumbnailUrl ?? undefined,
          providerId,
        });
      }
    } catch (err) {
      setMessage(err instanceof Error ? sanitiseVendorMessage(err.message) : 'Video status check failed.');
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
      if (!res.ok) throw new Error(sanitiseVendorMessage(data.message ?? 'Video setup validation failed.'));
      setMessage(data.ok ? 'Studio video setup is reachable. Run a short render test before class.' : 'Studio video is in preview mode. Add production video credentials to enable final renders.');
    } catch (err) {
      setMessage(err instanceof Error ? sanitiseVendorMessage(err.message) : 'Video setup validation failed.');
    } finally {
      setBusy(false);
    }
  };

  const statusLabel =
    status === 'generated'
      ? 'Generated'
      : status === 'queued'
        ? 'Queued'
        : status === 'processing'
          ? 'Rendering'
          : status === 'failed'
            ? 'Failed'
            : status === 'demo'
              ? 'Preview mode'
              : 'Not generated';

  return (
    <div className="rounded-lg border border-white/10 bg-[#061126] p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase tracking-wide text-[#ffc43b]">Cinematic lesson video</p>
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
          The video appears here when rendering is complete. The interactive 3D lesson stays live inside EIS Learning Studio.
        </p>
      </div>

      {videoUrl && status === 'generated' ? (
        <video src={videoUrl} controls className="mt-4 aspect-video w-full rounded-md border border-white/10 bg-black" />
      ) : (
        <div className="mt-4 rounded-md border border-[#49c8ff]/25 bg-[#49c8ff]/5 p-4">
          <div className="mb-3 overflow-hidden rounded-md border border-white/10 bg-black">
            {/* Local generated lesson assets make the video slot visual even before a final render URL exists. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={studioPreviewSrc(spec)} alt={`${spec.topic} cinematic preview`} className="aspect-video w-full object-cover" />
          </div>
          <div className="flex items-start gap-3">
            <PlayCircle className="mt-0.5 h-5 w-5 text-[#8ddfff]" />
            <div>
              <p className="text-sm font-black text-white">
                {status === 'demo'
                  ? 'Preview mode - no final video file yet'
                  : status === 'queued' || status === 'processing'
                    ? 'Lesson video is rendering'
                    : status === 'failed'
                      ? 'The studio could not generate this video'
                      : 'No lesson video generated yet'}
              </p>
              <p className="mt-2 line-clamp-3 text-xs leading-5 text-slate-300">{sanitiseVendorMessage(spec.heygen.script)}</p>
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
          {status === 'failed' ? 'Retry Lesson Video' : 'Generate Lesson Video'}
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
          Validate Video Setup
        </button>
      </div>
    </div>
  );
}
