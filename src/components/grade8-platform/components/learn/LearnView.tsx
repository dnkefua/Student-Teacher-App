import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { UnitId, SubjectId, ConceptDef } from '../../types';
import { scienceTheoryData } from '../../data/scienceTheory';
import { englishTheoryData } from '../../data/englishTheory';
import { mathTheoryData } from '../../data/mathTheory';
import { BookOpen, Calculator, Type, Focus, CheckCircle2, Zap, Maximize2, Lightbulb, PlayCircle } from 'lucide-react';
import ImageModal from '../ImageModal';
import { ReadAloud } from './ReadAloud';

// Lazy-load each interactive lab so the bundle only pulls them in when the
// student lands on a concept that uses one.
const MediaAdvertisementLab = dynamic(
  () => import('@/components/english/MediaAdvertisementLab').then((m) => m.MediaAdvertisementLab),
  { ssr: false, loading: () => <div className="p-8 text-center text-sm text-slate-500">Loading advertising lab…</div> },
);

// 3D States of Matter (R3F particle model) — never SSR because the Canvas
// needs a real browser context.
const ParticleModel3D = dynamic(
  () => import('@/components/grade8-platform/components/labs/ParticleModel3D').then((m) => m.ParticleModel3D),
  { ssr: false, loading: () => <div className="p-8 text-center text-sm text-slate-500">Loading 3D particle lab…</div> },
);
const Cell3DLab = dynamic(
  () => import('@/components/grade8-platform/components/labs/Cell3DLab').then((m) => m.Cell3DLab),
  { ssr: false, loading: () => <div className="p-8 text-center text-sm text-slate-500">Loading 3D cell lab…</div> },
);
const ChemicalReactionLab = dynamic(
  () => import('@/components/grade8-platform/components/labs/ChemicalReactionLab').then((m) => m.ChemicalReactionLabComponent),
  { ssr: false, loading: () => <div className="p-8 text-center text-sm text-slate-500">Loading reaction lab…</div> },
);
const CircuitLab = dynamic(
  () => import('@/components/grade8-platform/components/labs/CircuitLab').then((m) => m.CircuitLab),
  { ssr: false, loading: () => <div className="p-8 text-center text-sm text-slate-500">Loading circuit lab…</div> },
);
const ForcesMotionLab = dynamic(
  () => import('@/components/grade8-platform/components/labs/ForcesMotionLab').then((m) => m.ForcesMotionLab),
  { ssr: false, loading: () => <div className="p-8 text-center text-sm text-slate-500">Loading forces lab…</div> },
);
const EcosystemLab = dynamic(
  () => import('@/components/grade8-platform/components/labs/EcosystemLab').then((m) => m.EcosystemLab),
  { ssr: false, loading: () => <div className="p-8 text-center text-sm text-slate-500">Loading ecosystem sim…</div> },
);

/**
 * Normalise a videoUrl (full URL / shortlink / bare YouTube id / generic
 * iframe src) into a safe iframe src. Returns null if the value cannot be
 * understood — the caller then skips the video block.
 */
function toEmbedSrc(raw: string): string | null {
  const value = raw.trim();
  if (!value) return null;
  // Bare 11-char YouTube id (most common case for hand-authored data).
  if (/^[A-Za-z0-9_-]{11}$/.test(value)) {
    return `https://www.youtube-nocookie.com/embed/${value}?rel=0&modestbranding=1`;
  }
  // Standard YouTube watch URL.
  const watchMatch = value.match(/youtube\.com\/watch\?[^#]*v=([A-Za-z0-9_-]{11})/);
  if (watchMatch) {
    return `https://www.youtube-nocookie.com/embed/${watchMatch[1]}?rel=0&modestbranding=1`;
  }
  // youtu.be short URL.
  const shortMatch = value.match(/youtu\.be\/([A-Za-z0-9_-]{11})/);
  if (shortMatch) {
    return `https://www.youtube-nocookie.com/embed/${shortMatch[1]}?rel=0&modestbranding=1`;
  }
  // Already an embed URL or other iframe-safe src (Vimeo etc.) — pass through.
  if (/^https?:\/\//.test(value)) return value;
  return null;
}

/**
 * Registry of available interactive labs. The data only stores a short id;
 * the LearnView dispatches that id to the right React component here.
 */
const INTERACTIVE_LABS: Record<NonNullable<ConceptDef['interactiveLab']>, React.ComponentType> = {
  'mcdonalds-ads': MediaAdvertisementLab,
  'states-of-matter': ParticleModel3D,
  'cell-3d': Cell3DLab,
  'chemical-reaction': ChemicalReactionLab,
  'electric-circuit': CircuitLab,
  'forces-motion': ForcesMotionLab,
  'ecosystem-simulation': EcosystemLab,
};

export function LearnView({ unit, subject }: { unit: UnitId, subject?: SubjectId }) {
  const [modalImage, setModalImage] = useState<{url: string, caption?: string} | null>(null);

  // Pick the theory data set for the active subject.
  const concepts: ConceptDef[] | undefined =
    subject === 'science' ? scienceTheoryData[unit] :
    subject === 'english' ? englishTheoryData[unit] :
    subject === 'math' ? mathTheoryData[unit] :
    undefined;

  if (!subject) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center text-slate-500 min-h-[50vh]">
        <BookOpen className="w-16 h-16 mb-4 opacity-50 text-blue-500" />
        <h3 className="text-xl font-bold text-slate-800 mb-2">Pick a subject</h3>
        <p>Choose Maths, Science or English from the sidebar to read its core concepts.</p>
      </div>
    );
  }

  if (!concepts || concepts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center text-slate-500 min-h-[50vh]">
        <BookOpen className="w-16 h-16 mb-4 opacity-50" />
        <p>No theory concepts available for this unit yet.</p>
      </div>
    );
  }

  return (
    <>
    <ImageModal 
      isOpen={!!modalImage}
      onClose={() => setModalImage(null)}
      imageUrl={modalImage?.url || ''}
      caption={modalImage?.caption}
      theme={{ solidBg: 'bg-emerald-600', text: 'text-emerald-600' }}
    />
    <div className="max-w-5xl mx-auto space-y-12 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <header className="mb-10 text-center">
        <h1 className="text-3xl font-sans font-bold tracking-tight text-slate-900 mb-3 flex items-center justify-center gap-3">
          <Focus className="w-8 h-8 text-emerald-500" />
          Learn Core Concepts
        </h1>
        <p className="text-lg text-slate-600 font-medium">
          Master the definitions, relationships, and formulas before tackling the problems.
        </p>
      </header>

      {concepts.map((concept, index) => (
        <section key={index} className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
          
          <div className="bg-slate-900 px-8 py-6 text-white border-b border-slate-800 flex flex-wrap items-center justify-between gap-4">
            <h2 className="min-w-0 flex-1 text-2xl font-bold font-sans tracking-tight">{concept.title}</h2>
            {/* Concatenate description + paragraphs + key ideas so the
                listener hears the whole concept in one pass. */}
            <ReadAloud
              label="Listen to concept"
              text={[
                concept.title,
                concept.description,
                ...(concept.paragraphs ?? []),
                ...(concept.keyIdeas ? ['Key ideas:', ...concept.keyIdeas] : []),
              ].join('. ')}
            />
          </div>

          <div className="p-8 space-y-8">
            <div className="prose prose-slate max-w-none text-lg text-slate-700 leading-relaxed font-medium">
              <p>{concept.description}</p>
              {concept.paragraphs?.map((para, pi) => (
                <p key={pi} className="mt-3 text-base leading-7 font-normal">
                  {para}
                </p>
              ))}
            </div>

            {concept.videoUrl && (() => {
              const embed = toEmbedSrc(concept.videoUrl);
              if (!embed) return null;
              return (
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-900 shadow-md">
                  <div className="flex items-center gap-2 px-4 py-2.5 text-white">
                    <PlayCircle className="h-4 w-4 text-rose-400" />
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-300">
                      Watch this explainer
                    </p>
                  </div>
                  <div className="relative w-full" style={{ aspectRatio: '16 / 9' }}>
                    <iframe
                      src={embed}
                      title={`${concept.title} — explainer video`}
                      className="absolute inset-0 h-full w-full"
                      loading="lazy"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      referrerPolicy="strict-origin-when-cross-origin"
                      allowFullScreen
                    />
                  </div>
                </div>
              );
            })()}

            {concept.keyIdeas && concept.keyIdeas.length > 0 && (
              <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-5">
                <h3 className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-amber-800">
                  <Lightbulb className="h-4 w-4 text-amber-500" />
                  Key Ideas
                </h3>
                <ul className="space-y-2">
                  {concept.keyIdeas.map((idea, ki) => (
                    <li key={ki} className="flex gap-2 text-sm leading-6 text-amber-900">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
                      <span>{idea}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {concept.interactiveLab && INTERACTIVE_LABS[concept.interactiveLab] && (
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 overflow-hidden">
                <h3 className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-slate-500">
                  <Focus className="h-4 w-4 text-purple-500" />
                  Interactive Lab
                </h3>
                {React.createElement(INTERACTIVE_LABS[concept.interactiveLab])}
              </div>
            )}

            {/* Media/Diagrams Section */}
            {concept.media && concept.media.length > 0 && (
              <div className="mt-8 mb-8">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
                  <Focus className="w-4 h-4 text-rose-500" />
                  Labeled Diagrams
                </h3>
                <div className={`grid grid-cols-1 ${concept.media.length > 1 ? 'md:grid-cols-2' : ''} gap-6`}>
                  {concept.media.map((mediaItem, i) => (
                    <div key={i} className="bg-slate-50 rounded-2xl p-4 border border-slate-200 flex flex-col group">
                      <div className="flex-1 rounded-xl overflow-hidden bg-white flex items-center justify-center min-h-[250px] p-4 border border-slate-100 shadow-sm relative w-full group/image">
                        {mediaItem.type === 'image' ? (
                          <>
                           <img 
                            src={mediaItem.url} 
                            alt={mediaItem.caption} 
                            referrerPolicy="no-referrer"
                            className="w-full h-full min-h-[300px] object-contain transition-transform duration-500 group-hover:scale-[1.02]" 
                          />
                          <button 
                            onClick={() => setModalImage({ url: mediaItem.url, caption: mediaItem.caption })}
                            className="absolute bottom-4 right-4 p-2 bg-slate-900/40 hover:bg-slate-900/60 text-white rounded-lg backdrop-blur-sm opacity-0 group-hover/image:opacity-100 transition-all shadow-sm"
                            aria-label="Expand image"
                          >
                            <Maximize2 className="w-5 h-5" />
                          </button>
                          </>
                        ) : mediaItem.type === 'video' ? (
                          <iframe 
                            src={mediaItem.url} 
                            title={mediaItem.caption} 
                            frameBorder="0" 
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                            allowFullScreen
                            className="w-full h-[300px] rounded-lg border border-slate-100"
                          />
                        ) : null}
                      </div>
                      <div className="mt-4 text-sm font-medium text-slate-600 text-center leading-relaxed">
                        {mediaItem.caption}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className={`grid ${(concept.vocabulary && concept.vocabulary.length > 0) && (concept.formulas && concept.formulas.length > 0) ? 'lg:grid-cols-2' : 'grid-cols-1'} gap-8 mt-8`}>
              
              {/* Vocabulary Section */}
              {concept.vocabulary && concept.vocabulary.length > 0 && (
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
                    <Type className="w-4 h-4 text-emerald-500" />
                    Key Definitions
                  </h3>
                  <div className="space-y-4">
                    {concept.vocabulary.map((vocab, i) => (
                      <div key={i} className="bg-emerald-50/50 rounded-2xl p-5 border border-emerald-100/50 hover:bg-emerald-50 transition-colors">
                        <h4 className="font-bold text-emerald-800 text-lg mb-1 flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                          {vocab.term}
                        </h4>
                        <p className="text-sm text-slate-700 font-medium mb-3">{vocab.definition}</p>
                        {vocab.example && (
                          <div className="bg-white rounded-xl p-3 text-xs font-semibold text-slate-500 border border-emerald-100 flex items-start gap-2">
                            <Zap className="w-4 h-4 text-emerald-400 shrink-0" />
                            <span><span className="text-emerald-600">Example:</span> {vocab.example}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Formulas Section */}
              {concept.formulas && concept.formulas.length > 0 && (
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
                    <Calculator className="w-4 h-4 text-cyan-500" />
                    How to Calculate
                  </h3>
                  <div className="space-y-4">
                    {concept.formulas.map((formula, i) => (
                      <div key={i} className="bg-slate-900 rounded-2xl overflow-hidden shadow-md border border-slate-800">
                        <div className="bg-slate-800/50 px-5 py-3 border-b border-slate-700/50">
                          <h4 className="font-bold text-cyan-400 text-sm">{formula.name}</h4>
                        </div>
                        <div className="p-5">
                          <div className="font-mono text-base font-bold text-white bg-black/50 p-4 rounded-xl border border-white/5 mb-4 text-center overflow-x-auto">
                            {formula.equation}
                          </div>
                          <p className="text-sm text-slate-400 mb-5 leading-relaxed">
                            {formula.explanation}
                          </p>
                          
                          {formula.stepByStep && (
                            <div className="space-y-3">
                              <h5 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Step-by-Step Focus</h5>
                              {formula.stepByStep.map((step, idx) => (
                                <div key={idx} className="flex items-start gap-3">
                                  <div className="shrink-0 w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-[10px] font-bold mt-0.5">
                                    {idx + 1}
                                  </div>
                                  <div className="text-sm text-slate-300">
                                    {step.replace(/^Step \d+: /, '')}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>
        </section>
      ))}

    </div>
    </>
  );
}
