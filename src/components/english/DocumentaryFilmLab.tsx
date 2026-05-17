'use client';

import React, { useState } from 'react';
import { Camera, Film, Mic, Play, Scale, Volume2 } from 'lucide-react';

type ShotType = 'Wide' | 'Medium' | 'Close-up' | 'ECU';
type SoundType = 'Diegetic' | 'Non-diegetic' | 'Voiceover';

const shotPalette: Record<ShotType, string> = {
  Wide: '#34d399',
  Medium: '#49c8ff',
  'Close-up': '#fdba74',
  ECU: '#fb7185',
};

const soundIcon: Record<SoundType, React.ComponentType<{ className?: string }>> = {
  Diegetic: Volume2,
  'Non-diegetic': Music as unknown as React.ComponentType<{ className?: string }>,
  Voiceover: Mic,
};

function Music({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path d="M9 18V5l12-2v13" />
      <circle cx="6" cy="18" r="3" />
      <circle cx="18" cy="16" r="3" />
    </svg>
  );
}

type Frame = {
  id: string;
  shot: ShotType;
  sound: SoundType;
  visual: string;
  audio: string;
  narration?: string;
  paletteGlyph: string;
  paletteFrom: string;
  paletteTo: string;
};

const initialFrames: Frame[] = [
  {
    id: 'f1',
    shot: 'Wide',
    sound: 'Diegetic',
    visual: 'Sunrise over the Empty Quarter. Sand dunes glow amber. A lone Arabian oryx grazes in the foreground.',
    audio: 'Wind through grasses. A single skylark.',
    paletteGlyph: '🏜️',
    paletteFrom: '#fbbf24',
    paletteTo: '#7c2d12',
  },
  {
    id: 'f2',
    shot: 'Medium',
    sound: 'Non-diegetic',
    visual: 'The camera tracks across a desert highway. A line of trucks rumbles past, kicking up dust.',
    audio: 'Low, rumbling bass score begins. The skylark vanishes.',
    paletteGlyph: '🛻',
    paletteFrom: '#475569',
    paletteTo: '#1e293b',
  },
  {
    id: 'f3',
    shot: 'ECU',
    sound: 'Voiceover',
    visual: 'Extreme close-up on the oryx\'s eye. Its lashes hold a film of dust. It does not blink.',
    audio: 'Score swells, then quiet.',
    narration: 'David Attenborough: "This is the choice we now hold in our hands."',
    paletteGlyph: '👁',
    paletteFrom: '#0c4a6e',
    paletteTo: '#020617',
  },
];

const daforest = [
  { letter: 'D', word: 'Direct address', example: '"You hold this planet in your hands."' },
  { letter: 'A', word: 'Alliteration', example: '"Beautiful, bountiful, breaking."' },
  { letter: 'F', word: 'Facts', example: '"In just 70 years, wildlife populations have fallen by 60%."' },
  { letter: 'O', word: 'Opinions', example: '"We have made a profound mistake."' },
  { letter: 'R', word: 'Rhetorical question', example: '"What will we leave behind?"' },
  { letter: 'E', word: 'Emotive language', example: '"The last of their kind."' },
  { letter: 'S', word: 'Statistics', example: '"One million species face extinction."' },
  { letter: 'T', word: 'Triples', example: '"Land, sea, and sky — all under pressure."' },
];

const attenboroughLines = [
  '"We need to learn how to work with nature rather than against it."',
  '"What we do in the next 20 years will determine the future for all life on Earth."',
  '"This is now our planet, run by humankind for humankind. There is little left for the rest of the living world."',
];

const debatePositions = [
  {
    id: 'traditionalist',
    label: 'Traditionalist',
    headline: 'The camera observes. It does not interfere.',
    argument:
      'Documentary truth depends on non-interference. The moment a crew rescues an animal, the film becomes propaganda, not observation.',
    tint: '#8ddfff',
  },
  {
    id: 'humanist',
    label: 'Humanist',
    headline: 'Climate change is OUR failure. Intervention is a moral duty.',
    argument:
      'If the catastrophe is human-made, refusing to act when we can is not "objectivity" — it is complicity. Filmmakers have an ethical obligation.',
    tint: '#fda4af',
  },
];

const letterScaffold = [
  { id: 'greeting', label: 'Greeting', tip: '"Your Highness," — formal, respectful, single line.' },
  { id: 'context', label: 'Context', tip: 'Reference the documentary and the specific scene that moved you.' },
  { id: 'evidence', label: 'Evidence', tip: 'Pair a statistic with a personal observation from the UAE.' },
  { id: 'recommendation', label: 'Recommendation', tip: 'One concrete action. Avoid abstract pleas.' },
  { id: 'sign-off', label: 'Sign-off', tip: '"Yours respectfully," + full name + Year 8.' },
];

export function DocumentaryFilmLab() {
  const [frames, setFrames] = useState<Frame[]>(initialFrames);
  const [activeFrameId, setActiveFrameId] = useState(initialFrames[0].id);
  const [debateId, setDebateId] = useState<string>(debatePositions[0].id);

  const activeFrame = frames.find((f) => f.id === activeFrameId) ?? frames[0];
  const debate = debatePositions.find((p) => p.id === debateId) ?? debatePositions[0];

  const updateFrame = (id: string, patch: Partial<Frame>) =>
    setFrames((prev) => prev.map((f) => (f.id === id ? { ...f, ...patch } : f)));

  const SoundIcon = soundIcon[activeFrame.sound];

  return (
    <section className="overflow-hidden rounded-lg border border-white/10 bg-[#050711] text-white">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 bg-[#071126] px-4 py-3">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#8ddfff]">Documentary Film Lab</p>
          <h2 className="text-lg font-black text-white">Our Planet · storyboard, sound, persuasion</h2>
        </div>
        <p className="max-w-xl text-xs font-semibold leading-5 text-slate-300">
          Tap a frame to edit shot type and sound. Then build a DAFOREST-driven response to camera.
        </p>
      </div>

      <div className="grid xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="flex flex-col gap-3 p-4">
          <div className="rounded-md border border-white/10 bg-[#0a0f1e] p-3">
            <div className="flex items-center gap-2">
              <Film className="h-3.5 w-3.5 text-[#8ddfff]" />
              <p className="text-[10px] font-black uppercase tracking-wide text-[#8ddfff]">Six-frame storyboard · sustainability scene</p>
            </div>

            <div className="mt-3 grid gap-2 md:grid-cols-3">
              {frames.map((frame) => {
                const active = frame.id === activeFrame.id;
                return (
                  <button
                    key={frame.id}
                    type="button"
                    onClick={() => setActiveFrameId(frame.id)}
                    className="overflow-hidden rounded-md border text-left transition"
                    style={{
                      borderColor: active ? shotPalette[frame.shot] : 'rgba(255,255,255,.12)',
                      boxShadow: active ? `0 0 24px ${shotPalette[frame.shot]}33` : 'none',
                    }}
                  >
                    <div
                      className="grid h-28 place-items-center text-4xl"
                      style={{
                        background: `linear-gradient(135deg, ${frame.paletteFrom}, ${frame.paletteTo})`,
                      }}
                      aria-hidden
                    >
                      {frame.paletteGlyph}
                    </div>
                    <div className="space-y-1 p-2 text-[11px]">
                      <p className="font-black text-white">
                        <span style={{ color: shotPalette[frame.shot] }}>{frame.shot}</span> · {frame.sound}
                      </p>
                      <p className="line-clamp-2 text-slate-300">{frame.visual}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <div className="rounded-md border border-white/10 bg-[#0a0f1e] p-3">
              <div className="flex items-center gap-2">
                <Camera className="h-3.5 w-3.5 text-[#fdba74]" />
                <p className="text-[10px] font-black uppercase tracking-wide text-[#fdba74]">Shot type</p>
              </div>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {(Object.keys(shotPalette) as ShotType[]).map((shot) => (
                  <button
                    key={shot}
                    type="button"
                    onClick={() => updateFrame(activeFrame.id, { shot })}
                    className="rounded-md border px-2 py-1 text-[11px] font-black uppercase tracking-wide transition"
                    style={{
                      borderColor: activeFrame.shot === shot ? shotPalette[shot] : 'rgba(255,255,255,.12)',
                      background: activeFrame.shot === shot ? `${shotPalette[shot]}22` : 'transparent',
                      color: activeFrame.shot === shot ? shotPalette[shot] : '#cbd5e1',
                    }}
                  >
                    {shot}
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-md border border-white/10 bg-[#0a0f1e] p-3">
              <div className="flex items-center gap-2">
                <SoundIcon className="h-3.5 w-3.5 text-[#c084fc]" />
                <p className="text-[10px] font-black uppercase tracking-wide text-[#c084fc]">Sound layer</p>
              </div>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {(['Diegetic', 'Non-diegetic', 'Voiceover'] as SoundType[]).map((sound) => (
                  <button
                    key={sound}
                    type="button"
                    onClick={() => updateFrame(activeFrame.id, { sound })}
                    className="rounded-md border px-2 py-1 text-[11px] font-black uppercase tracking-wide transition"
                    style={{
                      borderColor: activeFrame.sound === sound ? '#c084fc' : 'rgba(255,255,255,.12)',
                      background: activeFrame.sound === sound ? 'rgba(192,132,252,.18)' : 'transparent',
                      color: activeFrame.sound === sound ? '#c084fc' : '#cbd5e1',
                    }}
                  >
                    {sound}
                  </button>
                ))}
              </div>
              <p className="mt-2 text-[11px] leading-5 text-slate-400">
                Diegetic = sound inside the scene (wind, footsteps). Non-diegetic = added by the editor (score). Voiceover = narration the characters cannot hear.
              </p>
            </div>
          </div>

          <div className="rounded-md border border-white/10 bg-[#0a0f1e] p-3">
            <p className="text-[10px] font-black uppercase tracking-wide text-slate-400">Frame {frames.findIndex((f) => f.id === activeFrame.id) + 1}</p>
            <textarea
              value={activeFrame.visual}
              onChange={(e) => updateFrame(activeFrame.id, { visual: e.target.value })}
              rows={2}
              className="mt-2 w-full rounded-md border border-white/10 bg-[#050711] p-2 text-sm leading-6 text-white focus:border-white/30 focus:outline-none"
              placeholder="Describe what the camera sees."
            />
            <textarea
              value={activeFrame.audio}
              onChange={(e) => updateFrame(activeFrame.id, { audio: e.target.value })}
              rows={2}
              className="mt-2 w-full rounded-md border border-white/10 bg-[#050711] p-2 text-sm leading-6 text-white focus:border-white/30 focus:outline-none"
              placeholder="Describe the sound layer."
            />
            {activeFrame.sound === 'Voiceover' && (
              <textarea
                value={activeFrame.narration ?? ''}
                onChange={(e) => updateFrame(activeFrame.id, { narration: e.target.value })}
                rows={2}
                className="mt-2 w-full rounded-md border border-white/10 bg-[#050711] p-2 text-sm leading-6 text-white focus:border-white/30 focus:outline-none"
                placeholder="Voiceover line (DAFOREST-driven)."
              />
            )}
          </div>
        </div>

        <aside className="flex flex-col gap-3 border-l border-white/10 bg-[#071126] p-4">
          <div>
            <div className="flex items-center gap-2">
              <Play className="h-3.5 w-3.5 text-[#ffe08a]" />
              <p className="text-[10px] font-black uppercase tracking-wide text-[#ffe08a]">Attenborough quote bank</p>
            </div>
            <ul className="mt-2 space-y-1.5">
              {attenboroughLines.map((line) => (
                <li key={line} className="text-[12px] italic leading-5 text-slate-200">
                  {line}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <Mic className="h-3.5 w-3.5 text-[#34d399]" />
              <p className="text-[10px] font-black uppercase tracking-wide text-[#34d399]">DAFOREST decoder</p>
            </div>
            <div className="mt-2 grid grid-cols-2 gap-1.5">
              {daforest.map((d) => (
                <div key={d.letter} className="rounded-md border border-white/10 bg-white/[.02] p-2">
                  <p className="text-[10px] font-black uppercase tracking-wide text-[#34d399]">
                    {d.letter} · {d.word}
                  </p>
                  <p className="mt-1 text-[11px] leading-4 text-slate-300">{d.example}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <Scale className="h-3.5 w-3.5 text-[#fda4af]" />
              <p className="text-[10px] font-black uppercase tracking-wide text-[#fda4af]">Debate · observe or act?</p>
            </div>
            <div className="mt-2 flex gap-1.5">
              {debatePositions.map((p) => {
                const active = p.id === debate.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setDebateId(p.id)}
                    className="flex-1 rounded-md border px-2 py-1.5 text-[11px] font-black uppercase tracking-wide transition"
                    style={{
                      borderColor: active ? p.tint : 'rgba(255,255,255,.12)',
                      background: active ? `${p.tint}22` : 'transparent',
                      color: active ? p.tint : '#cbd5e1',
                    }}
                  >
                    {p.label}
                  </button>
                );
              })}
            </div>
            <p className="mt-2 text-xs font-black" style={{ color: debate.tint }}>
              {debate.headline}
            </p>
            <p className="mt-1 text-[11px] leading-5 text-slate-300">{debate.argument}</p>
          </div>

          <div>
            <p className="text-[10px] font-black uppercase tracking-wide text-slate-400">Letter scaffold</p>
            <ol className="mt-2 space-y-1.5">
              {letterScaffold.map((s, i) => (
                <li key={s.id} className="flex gap-2 text-[11px] leading-5 text-slate-300">
                  <span className="mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full bg-white/10 text-[9px] font-black text-white">
                    {i + 1}
                  </span>
                  <span>
                    <span className="text-white">{s.label}.</span> {s.tip}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </aside>
      </div>
    </section>
  );
}
