'use client';

import React, { useMemo, useState } from 'react';
import {
  BadgeCheck,
  Box,
  CheckCircle2,
  ClipboardList,
  ImageIcon,
  Loader2,
  MousePointerClick,
  Play,
  Sparkles,
  Video,
} from 'lucide-react';
import type { CinematicLearningPack } from '@/lib/cinematic/learningPack';

type StudioVideoResult = {
  videoId?: string;
  status?: 'queued' | 'processing' | 'generated' | 'failed' | 'demo';
  videoUrl?: string | null;
  thumbnailUrl?: string | null;
  message?: string;
  source?: 'heygen' | 'mock';
};

type Props = {
  pack: CinematicLearningPack;
  accent?: string;
  isTeacher?: boolean;
};

export function CinematicLearningPackPanel({ pack, accent = '#49c8ff', isTeacher = true }: Props) {
  const [status, setStatus] = useState<'idle' | 'pending' | 'done' | 'error'>('idle');
  const [message, setMessage] = useState<string | null>(null);
  const [videoId, setVideoId] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [assigned, setAssigned] = useState(false);

  const totalMarks = useMemo(
    () => pack.assignmentQuestions.reduce((sum, question) => sum + question.marks, 0),
    [pack.assignmentQuestions],
  );

  const createVideo = async () => {
    if (status === 'pending') return;
    setStatus('pending');
    setMessage(null);
    try {
      const res = await fetch('/api/heygen/create-lesson-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lessonId: pack.id,
          title: pack.videoTitle,
          script: pack.heyGenScript.slice(0, 5000),
          avatarStyle: `${pack.subject}_cinematic_teacher`,
          voiceStyle: 'clear_warm_teacher',
          aspectRatio: '16:9',
          includeCaptions: true,
          videoPurpose: 'cinematic_learning_pack',
        }),
      });
      const data = (await res.json()) as StudioVideoResult;
      if (!res.ok) throw new Error(publicStudioVideoMessage(data, 'Could not create studio video.'));
      setVideoId(data.videoId ?? null);
      setVideoUrl(data.videoUrl ?? null);
      setStatus('done');
      setMessage(publicStudioVideoMessage(data, data.videoUrl ? 'Studio video is ready.' : 'Studio video request saved. Preview remains visible until the playable file is ready.'));
    } catch (err) {
      setStatus('error');
      setMessage(err instanceof Error ? sanitiseVendorMessage(err.message) : 'Could not create studio video.');
    }
  };

  return (
    <section className="overflow-hidden rounded-lg border border-white/10 bg-[#050711] text-white">
      <div className="border-b border-white/10 bg-white/[0.03] p-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <div
              className="inline-flex items-center gap-2 rounded-md border px-2.5 py-1.5 text-[10px] font-black uppercase tracking-wide"
              style={{ borderColor: `${accent}55`, background: `${accent}16`, color: accent }}
            >
              <Sparkles className="h-3.5 w-3.5" />
              Cinematic learning pack
            </div>
            <h2 className="mt-3 text-xl font-black sm:text-2xl">{pack.title}</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-300">
              Visual stage, interactive model, worked examples, and assignment questions for this subtopic.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-md border border-white/10 bg-white/5 px-2.5 py-1.5 text-[10px] font-black uppercase tracking-wide text-slate-200">
              {pack.assignmentQuestions.length} assignable questions
            </span>
            <span className="rounded-md border border-white/10 bg-white/5 px-2.5 py-1.5 text-[10px] font-black uppercase tracking-wide text-slate-200">
              {totalMarks} marks
            </span>
          </div>
        </div>
      </div>

      <CinematicMediaStage
        pack={pack}
        accent={accent}
        status={status}
        videoId={videoId}
        videoUrl={videoUrl}
        message={message}
        onCreateVideo={createVideo}
      />

      <div className="grid gap-3 p-4 xl:grid-cols-[0.95fr_1.05fr]">
        <div className="space-y-3">
          <PackCard title="Cinematic video sequence" icon={Video} accent={accent}>
            <div className="mt-3 rounded-md border border-white/10 bg-white/[0.03] p-3">
              <p className="text-[10px] font-black uppercase tracking-wide text-slate-500">Scene sequence</p>
              <p className="mt-1 text-sm font-bold text-white">{pack.videoTitle}</p>
              <div className="mt-3 grid gap-2 sm:grid-cols-3">
                {pack.visualBriefs.slice(0, 3).map((brief, index) => (
                  <div key={brief} className="min-h-24 rounded-md border border-white/10 bg-black/25 p-2">
                    <span className="grid h-8 w-8 place-items-center rounded-md text-xs font-black text-[#061126]" style={{ background: accent }}>
                      {index + 1}
                    </span>
                    <p className="mt-2 line-clamp-3 text-[11px] font-semibold leading-4 text-slate-300">{brief}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <button
                onClick={createVideo}
                disabled={status === 'pending'}
                className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-xs font-black text-[#061126] transition disabled:cursor-wait disabled:opacity-70"
                style={{ background: accent }}
              >
                {status === 'pending' ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Play className="h-3.5 w-3.5" />}
                Generate Studio Video
              </button>
              {videoId ? (
                <span className="rounded-md border border-white/10 px-2 py-1 text-[10px] font-black uppercase tracking-wide text-slate-300">
                  {videoId.startsWith('mock') ? 'Preview render' : 'Render queued'}
                </span>
              ) : null}
            </div>
            {message ? (
              <p
                className="mt-3 rounded-md border p-2 text-xs leading-5"
                style={{
                  borderColor: status === 'error' ? 'rgba(248,113,113,.35)' : `${accent}44`,
                  background: status === 'error' ? 'rgba(248,113,113,.1)' : `${accent}12`,
                }}
              >
                {message}
              </p>
            ) : null}
          </PackCard>

          <PackCard title="Interactive 3D or image model" icon={Box} accent={accent}>
            <p className="text-sm leading-6 text-slate-300">{pack.threeDModelBrief}</p>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {pack.interactionTasks.map((task, index) => (
                <div key={task} className="rounded-md border border-white/10 bg-white/[0.03] p-3">
                  <p className="text-[10px] font-black uppercase tracking-wide" style={{ color: accent }}>
                    Interaction {index + 1}
                  </p>
                  <p className="mt-1 text-xs leading-5 text-slate-300">{task}</p>
                </div>
              ))}
            </div>
          </PackCard>
        </div>

        <div className="space-y-3">
          <PackCard title="Generated visual assets" icon={ImageIcon} accent={accent}>
            <VisualAssetGallery pack={pack} accent={accent} />
          </PackCard>

          <PackCard title="Worked examples with solutions" icon={CheckCircle2} accent={accent}>
            <div className="space-y-2">
              {pack.workedExamples.map((example, index) => (
                <details key={`${example.prompt}-${index}`} className="rounded-md border border-white/10 bg-white/[0.03] p-3">
                  <summary className="cursor-pointer text-sm font-black text-white">
                    Example {index + 1}: {example.prompt}
                  </summary>
                  <ol className="mt-2 space-y-1">
                    {example.steps.map((step, stepIndex) => (
                      <li key={step} className="flex gap-2 text-xs leading-5 text-slate-300">
                        <span style={{ color: accent }}>{stepIndex + 1}.</span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ol>
                  <p className="mt-2 rounded-md bg-white p-2 text-xs font-bold text-slate-950">Answer: {example.answer}</p>
                </details>
              ))}
            </div>
          </PackCard>
        </div>
      </div>

      <div className="border-t border-white/10 p-4">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <div>
            <p className="text-[10px] font-black uppercase tracking-wide" style={{ color: accent }}>
              Assignment pack
            </p>
            <h3 className="text-lg font-black">10 image/model-based questions</h3>
          </div>
          {isTeacher ? (
            <button
              onClick={() => setAssigned(true)}
              className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/[0.03] px-3 py-2 text-xs font-black text-slate-200 transition hover:border-white/30 hover:text-white"
            >
              {assigned ? <BadgeCheck className="h-3.5 w-3.5 text-emerald-300" /> : <ClipboardList className="h-3.5 w-3.5" />}
              {assigned ? 'Pack ready to assign' : 'Mark assign-ready'}
            </button>
          ) : null}
        </div>
        <div className="grid gap-2 md:grid-cols-2">
          {pack.assignmentQuestions.map((question, index) => (
            <article key={question.id} className="rounded-md border border-white/10 bg-white/[0.03] p-3">
              <div className="flex items-start justify-between gap-3">
                <p className="text-sm font-bold leading-5 text-white">
                  <span style={{ color: accent }}>Q{index + 1}.</span> {question.question}
                </p>
                <span className="shrink-0 rounded-md border border-white/10 px-2 py-0.5 text-[10px] font-black uppercase tracking-wide text-slate-400">
                  {question.marks} marks
                </span>
              </div>
              <p className="mt-2 flex items-center gap-1.5 text-[11px] font-bold text-slate-400">
                <MousePointerClick className="h-3 w-3" />
                {question.visualCue}
              </p>
              <details className="mt-2">
                <summary className="cursor-pointer text-[11px] font-black uppercase tracking-wide text-slate-300">
                  Solution and rubric
                </summary>
                <p className="mt-2 text-xs leading-5 text-slate-300">
                  <span className="font-black text-white">Expected answer: </span>
                  {question.expectedAnswer}
                </p>
                <p className="mt-1 text-xs leading-5 text-slate-400">
                  <span className="font-black text-white">Rubric: </span>
                  {question.rubric}
                </p>
              </details>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function PackCard({
  title,
  icon: Icon,
  accent,
  children,
}: {
  title: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  accent: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-lg border border-white/10 bg-white/[0.025] p-4">
      <div className="mb-3 flex items-center gap-2">
        <span className="grid h-8 w-8 place-items-center rounded-md" style={{ background: `${accent}22`, color: accent }}>
          <Icon className="h-4 w-4" />
        </span>
        <h3 className="text-sm font-black uppercase tracking-wide text-white">{title}</h3>
      </div>
      {children}
    </section>
  );
}

function sanitiseVendorMessage(message: string): string {
  return message
    .replace(/HeyGen/gi, 'Studio video')
    .replace(/HEYGEN_/g, 'VIDEO_')
    .replace(/avatar\/video layer/gi, 'cinematic video layer')
    .replace(/avatar video/gi, 'lesson video')
    .replace(/avatar/gi, 'presenter');
}

function publicStudioVideoMessage(data: StudioVideoResult, fallback: string): string {
  if (data.status === 'failed') {
    return sanitiseVendorMessage(data.message ?? 'Video request failed. Check presenter, voice, plan access, and credits.');
  }
  if (data.status === 'demo' || data.source === 'mock') {
    return 'Preview render saved. A playable studio video appears here when production rendering is configured and complete.';
  }
  return sanitiseVendorMessage(data.message ?? fallback);
}

function CinematicMediaStage({
  pack,
  accent,
  status,
  videoId,
  videoUrl,
  message,
  onCreateVideo,
}: {
  pack: CinematicLearningPack;
  accent: string;
  status: 'idle' | 'pending' | 'done' | 'error';
  videoId: string | null;
  videoUrl: string | null;
  message: string | null;
  onCreateVideo: () => void;
}) {
  return (
    <section className="grid gap-4 border-b border-white/10 bg-black/30 p-4 xl:grid-cols-[1.45fr_0.55fr]">
      <div className="overflow-hidden rounded-lg border border-white/10 bg-slate-950">
        <div className="relative aspect-video min-h-72">
          {videoUrl ? (
            <video
              src={videoUrl}
              controls
              playsInline
              className="h-full w-full bg-black object-cover"
            />
          ) : (
            <TopicVisual pack={pack} accent={accent} />
          )}
          <div className="absolute left-3 top-3 flex flex-wrap gap-2">
            <span className="rounded-md border border-white/15 bg-black/50 px-2 py-1 text-[10px] font-black uppercase tracking-wide text-white backdrop-blur">
              HD 16:9 cinematic stage
            </span>
            <span
              className="rounded-md border px-2 py-1 text-[10px] font-black uppercase tracking-wide backdrop-blur"
              style={{ borderColor: `${accent}66`, background: `${accent}22`, color: accent }}
            >
              Interactive visual preview
            </span>
          </div>
          <div className="absolute bottom-3 left-3 right-3 rounded-md border border-white/10 bg-black/55 p-3 backdrop-blur">
            <p className="text-xs font-black uppercase tracking-wide" style={{ color: accent }}>
              {pack.topic}
            </p>
            <p className="mt-1 line-clamp-2 text-sm font-semibold text-white">{pack.threeDModelBrief}</p>
          </div>
        </div>
      </div>

      <aside className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
        <p className="text-[10px] font-black uppercase tracking-wide" style={{ color: accent }}>
          Cinematic stage
        </p>
        <h3 className="mt-2 text-xl font-black text-white">Video, images, and 3D first</h3>
        <div className="mt-4 grid gap-2">
          {[
            'HD lesson video',
            'Generated image/diagram set',
            'Interactive 3D or simulation model',
            'Visual assignment questions',
          ].map((item) => (
            <div key={item} className="flex items-center gap-2 rounded-md border border-white/10 bg-white/[0.03] p-2">
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: accent }} />
              <span className="text-xs font-bold text-slate-200">{item}</span>
            </div>
          ))}
        </div>
        <button
          onClick={onCreateVideo}
          disabled={status === 'pending'}
          className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-md px-3 py-3 text-xs font-black uppercase tracking-wide text-[#061126] transition disabled:cursor-wait disabled:opacity-70"
          style={{ background: accent }}
        >
          {status === 'pending' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
          {videoUrl ? 'Regenerate HD Video' : 'Generate HD Video'}
        </button>
        {videoId ? (
          <p className="mt-2 rounded-md border border-white/10 bg-black/20 p-2 text-[11px] font-bold text-slate-300">
            {videoId.startsWith('mock') ? 'Preview render saved. Final playback appears here when the studio render returns a video file.' : 'Render queued. Check again soon for playback.'}
          </p>
        ) : null}
        {message ? (
          <p className="mt-2 rounded-md border border-white/10 bg-black/20 p-2 text-[11px] leading-5 text-slate-300">{message}</p>
        ) : null}
      </aside>
    </section>
  );
}

function TopicVisual({ pack, accent }: { pack: CinematicLearningPack; accent: string }) {
  const lower = `${pack.topic} ${pack.title} ${pack.threeDModelBrief}`.toLowerCase();
  const src = visualAssetSrc(pack, lower);
  if (src) {
    // SVGs are local generated learning assets; next/image optimisation is unnecessary here.
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={`${pack.topic} visual learning asset`} className="h-full w-full object-cover" />;
  }
  return <GenericCinematicVisual accent={accent} title={pack.topic} />;
}

function visualAssetSrc(pack: CinematicLearningPack, lower?: string): string {
  const text = lower ?? `${pack.topic} ${pack.title} ${pack.threeDModelBrief}`.toLowerCase();
  if (text.includes('cell')) return '/cinematic/cell-comparison.svg';
  if (text.includes('food') || text.includes('ecosystem')) return '/cinematic/food-web.svg';
  if (text.includes('particle') || text.includes('solid') || text.includes('liquid') || text.includes('gas')) return '/cinematic/particle-model.svg';
  if (pack.subject === 'mathematics') return '/cinematic/math-model.svg';
  if (pack.subject === 'english') return '/cinematic/english-visual-text.svg';
  return '';
}

function CellVisual({ accent }: { accent: string }) {
  return (
    <div className="relative h-full overflow-hidden bg-[radial-gradient(circle_at_20%_15%,rgba(52,211,153,.28),transparent_34%),radial-gradient(circle_at_80%_30%,rgba(125,211,252,.24),transparent_30%),linear-gradient(135deg,#03140f,#071126)]">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.05)_1px,transparent_1px)] bg-[size:44px_44px]" />
      <div className="absolute left-[7%] top-[18%] h-[52%] w-[35%] rounded-[42%] border border-sky-200/60 bg-sky-400/15 shadow-[0_0_55px_rgba(56,189,248,.26)]">
        <span className="absolute left-[38%] top-[34%] h-20 w-20 rounded-full bg-purple-300 shadow-[0_0_26px_rgba(216,180,254,.55)]" />
        <span className="absolute left-[18%] top-[58%] h-8 w-14 rounded-full bg-rose-300" />
        <span className="absolute right-[20%] top-[25%] h-7 w-12 rounded-full bg-rose-300" />
        <span className="absolute bottom-5 left-1/2 -translate-x-1/2 text-xs font-black uppercase tracking-wide text-sky-100">Animal cell</span>
      </div>
      <div className="absolute right-[7%] top-[16%] h-[58%] w-[38%] rounded-xl border-4 border-emerald-300/80 bg-emerald-300/10 shadow-[0_0_65px_rgba(52,211,153,.3)]">
        <div className="absolute inset-5 rounded-lg border border-sky-200/50 bg-sky-300/10" />
        <span className="absolute left-[35%] top-[28%] h-24 w-32 rounded-[45%] bg-cyan-200/70 shadow-[0_0_30px_rgba(125,211,252,.55)]" />
        <span className="absolute left-[15%] top-[18%] h-8 w-14 rounded-full bg-emerald-400" />
        <span className="absolute right-[16%] top-[54%] h-8 w-14 rounded-full bg-emerald-400" />
        <span className="absolute bottom-5 left-1/2 -translate-x-1/2 text-xs font-black uppercase tracking-wide text-emerald-100">Plant cell</span>
      </div>
      <PulseDot left="49%" top="35%" color={accent} label="Compare shapes" />
    </div>
  );
}

function FoodWebVisual({ accent }: { accent: string }) {
  const nodes = [
    ['Sun', '50%', '8%', '#fde68a'],
    ['Grass', '20%', '67%', '#34d399'],
    ['Seeds', '42%', '72%', '#86efac'],
    ['Rabbit', '32%', '46%', '#fdba74'],
    ['Mouse', '56%', '50%', '#fcd34d'],
    ['Fox', '48%', '26%', '#fb7185'],
    ['Eagle', '76%', '25%', '#93c5fd'],
    ['Fungi', '73%', '72%', '#c084fc'],
  ];
  return (
    <div className="relative h-full overflow-hidden bg-[radial-gradient(circle_at_50%_8%,rgba(253,230,138,.25),transparent_24%),linear-gradient(135deg,#052e1a,#071126_60%,#1c1207)]">
      <div className="absolute inset-0 opacity-60 bg-[linear-gradient(120deg,transparent_0_46%,rgba(255,255,255,.1)_47%,transparent_48%_100%)] bg-[size:80px_80px]" />
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 56" preserveAspectRatio="none">
        {[
          ['50,8', '20,67'], ['20,67', '32,46'], ['32,46', '48,26'],
          ['42,72', '56,50'], ['56,50', '76,25'], ['48,26', '73,72'],
          ['76,25', '73,72'], ['73,72', '20,67'],
        ].map(([a, b]) => {
          const [x1, y1] = a.split(',');
          const [x2, y2] = b.split(',');
          return <line key={`${a}-${b}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke={accent} strokeWidth="0.35" opacity="0.75" />;
        })}
      </svg>
      {nodes.map(([label, left, top, color]) => (
        <div
          key={label}
          className="absolute grid h-16 w-20 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-lg border text-center text-xs font-black text-white shadow-xl"
          style={{ left, top, borderColor: `${color}aa`, background: `${color}22` }}
        >
          <span className="h-5 w-5 rounded-full" style={{ background: color }} />
          {label}
        </div>
      ))}
    </div>
  );
}

function ParticleVisual({ accent }: { accent: string }) {
  return (
    <div className="relative grid h-full grid-cols-3 gap-3 overflow-hidden bg-slate-950 p-8">
      {['Solid', 'Liquid', 'Gas'].map((state, group) => (
        <div key={state} className="relative overflow-hidden rounded-lg border border-white/10 bg-white/[0.03]">
          {Array.from({ length: group === 2 ? 18 : 28 }, (_, index) => (
            <span
              key={index}
              className="absolute h-3 w-3 rounded-full"
              style={{
                left: `${group === 0 ? 22 + (index % 5) * 13 : (index * 37) % 86}%`,
                top: `${group === 0 ? 24 + Math.floor(index / 5) * 10 : (index * 23) % 82}%`,
                background: group === 0 ? accent : group === 1 ? '#38bdf8' : '#facc15',
                boxShadow: `0 0 16px ${group === 0 ? accent : '#38bdf8'}`,
              }}
            />
          ))}
          <p className="absolute bottom-4 left-0 right-0 text-center text-sm font-black uppercase tracking-wide text-white">{state}</p>
        </div>
      ))}
    </div>
  );
}

function MathVisual({ accent }: { accent: string }) {
  return (
    <div className="relative h-full overflow-hidden bg-[linear-gradient(135deg,#050711,#081a35)]">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.07)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.07)_1px,transparent_1px)] bg-[size:42px_42px]" />
      <svg className="absolute inset-8 h-[calc(100%-64px)] w-[calc(100%-64px)]" viewBox="0 0 600 310">
        <path d="M60 250H540M90 285V40" stroke="rgba(255,255,255,.65)" strokeWidth="6" strokeLinecap="round" />
        <path d="M95 235C180 215 205 110 300 130S425 70 510 50" fill="none" stroke={accent} strokeWidth="10" strokeLinecap="round" />
        <circle cx="300" cy="130" r="18" fill="#facc15" />
        <path d="M300 130H405V82" stroke="#38bdf8" strokeWidth="6" fill="none" strokeLinecap="round" />
      </svg>
      <div className="absolute bottom-5 left-5 rounded-lg border border-white/10 bg-black/45 p-4 backdrop-blur">
        <p className="text-xs font-black uppercase tracking-wide" style={{ color: accent }}>Interactive maths model</p>
        <p className="mt-1 text-sm font-bold text-white">Visual first, then symbolic solution.</p>
      </div>
    </div>
  );
}

function EnglishVisual({ accent }: { accent: string }) {
  return (
    <div className="relative h-full overflow-hidden bg-[linear-gradient(135deg,#1a0a36,#050711)] p-8">
      <div className="grid h-full grid-cols-[0.85fr_1.15fr] gap-5">
        <div className="rounded-lg border border-white/10 bg-white p-5 text-slate-950 shadow-2xl">
          <div className="h-24 rounded-md" style={{ background: `linear-gradient(135deg, ${accent}, #facc15)` }} />
          <p className="mt-4 text-2xl font-black">Visual Text</p>
          <p className="mt-2 text-sm font-bold text-slate-600">Image, layout, slogan, audience.</p>
        </div>
        <div className="space-y-3">
          {['Technique', 'Evidence', 'Effect', 'Audience'].map((label, index) => (
            <div key={label} className="rounded-md border border-white/10 bg-white/[0.08] p-4">
              <p className="text-xs font-black uppercase tracking-wide" style={{ color: accent }}>{index + 1}. {label}</p>
              <div className="mt-2 h-2 rounded-full bg-white/20">
                <div className="h-full rounded-full" style={{ width: `${45 + index * 12}%`, background: accent }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function GenericCinematicVisual({ accent, title }: { accent: string; title: string }) {
  return (
    <div className="relative grid h-full place-items-center overflow-hidden bg-slate-950">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_35%_30%,rgba(73,200,255,.26),transparent_35%),radial-gradient(circle_at_70%_65%,rgba(250,204,21,.2),transparent_32%)]" />
      <div className="relative rounded-lg border border-white/10 bg-white/[0.06] p-8 text-center">
        <p className="text-xs font-black uppercase tracking-wide" style={{ color: accent }}>Generated cinematic scene</p>
        <p className="mt-2 text-3xl font-black text-white">{title}</p>
      </div>
    </div>
  );
}

function PulseDot({ left, top, color, label }: { left: string; top: string; color: string; label: string }) {
  return (
    <div className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left, top }}>
      <span className="absolute h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-40 motion-safe:animate-ping" style={{ background: color }} />
      <span className="relative rounded-md border border-white/15 bg-black/55 px-2 py-1 text-[10px] font-black uppercase tracking-wide text-white backdrop-blur">
        {label}
      </span>
    </div>
  );
}

function VisualAssetGallery({ pack, accent }: { pack: CinematicLearningPack; accent: string }) {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {pack.visualBriefs.slice(0, 3).map((brief, index) => (
        <div key={brief} className="overflow-hidden rounded-lg border border-white/10 bg-slate-950">
          <div className="relative aspect-video">
            {index === 0 ? <TopicVisual pack={pack} accent={accent} /> : (
              // SVGs are local generated learning assets; next/image optimisation is unnecessary here.
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={visualAssetSrc(pack) || '/cinematic/particle-model.svg'}
                alt={`${pack.topic} generated image ${index + 1}`}
                className="h-full w-full object-cover"
              />
            )}
          </div>
          <div className="p-3">
            <p className="text-[10px] font-black uppercase tracking-wide" style={{ color: accent }}>
              Image {index + 1}
            </p>
            <p className="mt-1 line-clamp-3 text-xs leading-5 text-slate-300">{brief}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
