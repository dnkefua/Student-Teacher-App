'use client';

import React, { useState } from 'react';
import { Eye, Sparkles, Theater, Users } from 'lucide-react';

type CharacterId = 'katherina' | 'petruchio' | 'bianca' | 'lucentio';

const characters: {
  id: CharacterId;
  name: string;
  role: string;
  archetype: string;
  glyph: string;
  tint: string;
  bio: string;
  signature: string;
}[] = [
  {
    id: 'katherina',
    name: 'Katherina Minola',
    role: 'The "shrew"',
    archetype: 'Anti-hero · sharp-tongued elder daughter',
    glyph: '🗡️',
    tint: '#fda4af',
    bio:
      'Baptista\'s eldest daughter. Refuses the era\'s gender script. The play\'s title comes from the question of who is taming whom.',
    signature: '"I\'ll not be tied to hours, nor \'pointed times, / But learn my lessons as I please myself."',
  },
  {
    id: 'petruchio',
    name: 'Petruchio',
    role: 'The "tamer"',
    archetype: 'Trickster · fortune-hunter from Verona',
    glyph: '🎭',
    tint: '#ffe08a',
    bio:
      'Arrives in Padua to "wive it wealthily". Uses theatre as strategy — late to his wedding on purpose, weaponising spectacle.',
    signature: '"I am born to tame you, Kate, / And bring you from a wild Kate to a Kate / Conformable as other household Kates."',
  },
  {
    id: 'bianca',
    name: 'Bianca Minola',
    role: 'The "obedient" sister',
    archetype: 'The desired younger daughter',
    glyph: '🌸',
    tint: '#8ddfff',
    bio:
      'Outwardly docile, secretly strategic. In Act 3.1 she controls her tutors, reversing the lesson\'s power dynamic.',
    signature: '"I am no breeching scholar in the schools; / I\'ll not be tied to hours, nor \'pointed times."',
  },
  {
    id: 'lucentio',
    name: 'Lucentio',
    role: 'The disguised lover',
    archetype: 'Romantic hero in costume',
    glyph: '📜',
    tint: '#c084fc',
    bio:
      'Pretends to be a Latin tutor to win Bianca. His scenes are a comic mirror to Petruchio\'s — both men use deception, but with different stakes.',
    signature: '"I burn, I pine, I perish, Lucentio, / If I achieve not this young modest girl."',
  },
];

type Convention = {
  id: string;
  name: string;
  definition: string;
  example: string;
};

const conventions: Convention[] = [
  {
    id: 'dialogue',
    name: 'Dialogue',
    definition: 'Two or more characters speaking back and forth.',
    example: 'Petruchio and Katherina spar in Act 2.1 — every line answers the line before.',
  },
  {
    id: 'monologue',
    name: 'Monologue',
    definition: 'One character speaks at length to others on stage.',
    example: 'Katherina\'s closing speech in Act 5.2 is delivered TO the wedding guests.',
  },
  {
    id: 'soliloquy',
    name: 'Soliloquy',
    definition: 'A character speaks alone on stage, sharing their inner thoughts.',
    example: 'Petruchio\'s "Thus have I politicly begun my reign" speech (Act 4.1) — the audience hears the strategy.',
  },
  {
    id: 'aside',
    name: 'Aside',
    definition: 'A character speaks privately to the audience while others are on stage.',
    example: 'Tranio\'s asides during the disguise plot — the audience is in on the joke; the characters are not.',
  },
];

type MonologueLine = {
  text: string;
  subtext: string;
  technique: string;
  color: string;
};

const monologue: MonologueLine[] = [
  {
    text: '"Thus have I politicly begun my reign,"',
    subtext:
      'Petruchio frames his marriage as politics. He reveals to the audience that what looked like rude behaviour was, in fact, deliberate strategy.',
    technique: 'Dramatic irony',
    color: '#fda4af',
  },
  {
    text: '"And \'tis my hope to end successfully."',
    subtext: 'Hope, but in the language of conquest. The verb "end" implies a campaign, not a marriage.',
    technique: 'Extended metaphor',
    color: '#ffe08a',
  },
  {
    text: '"My falcon now is sharp and passing empty;"',
    subtext: 'Katherina is renamed as a hunting bird. The metaphor is troubling — and that is the point.',
    technique: 'Metaphor',
    color: '#8ddfff',
  },
  {
    text: '"And till she stoop she must not be full-gorged,"',
    subtext: 'Power is enforced through hunger. The audience is invited to question the cost of "taming".',
    technique: 'Allusion (falconry)',
    color: '#c084fc',
  },
  {
    text: '"For then she never looks upon her lure."',
    subtext: 'Conditional logic dressed as care. Petruchio justifies cruelty as method.',
    technique: 'Subtext',
    color: '#fdba74',
  },
];

export function DramaStageLab() {
  const [activeId, setActiveId] = useState<CharacterId>('katherina');
  const [conventionId, setConventionId] = useState<string>('soliloquy');
  const [lineIdx, setLineIdx] = useState(0);

  const character = characters.find((c) => c.id === activeId) ?? characters[0];
  const convention = conventions.find((c) => c.id === conventionId) ?? conventions[0];
  const line = monologue[lineIdx];

  return (
    <section className="overflow-hidden rounded-lg border border-white/10 bg-[#050711] text-white">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 bg-[#071126] px-4 py-3">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#ffe08a]">Drama Stage Lab</p>
          <h2 className="text-lg font-black text-white">The Taming of the Shrew · character, convention, subtext</h2>
        </div>
        <p className="max-w-xl text-xs font-semibold leading-5 text-slate-300">
          Tap a character, then walk Petruchio&apos;s falconry soliloquy line-by-line — every line shows the technique AND the subtext.
        </p>
      </div>

      <div className="grid xl:grid-cols-[280px_minmax(0,1fr)_300px]">
        <aside className="border-r border-white/10 bg-[#071126] p-3">
          <p className="mb-2 text-[10px] font-black uppercase tracking-wide text-slate-400">Character roster</p>
          <ul className="space-y-2">
            {characters.map((c) => {
              const active = c.id === character.id;
              return (
                <li key={c.id}>
                  <button
                    type="button"
                    onClick={() => setActiveId(c.id)}
                    className="flex w-full items-center gap-3 rounded-md border p-2 text-left transition"
                    style={{
                      borderColor: active ? c.tint : 'rgba(255,255,255,.12)',
                      background: active ? 'rgba(255,255,255,.04)' : 'transparent',
                    }}
                  >
                    <span
                      className="grid h-12 w-12 shrink-0 place-items-center rounded-md text-2xl"
                      style={{ background: `linear-gradient(135deg, ${c.tint}66, #050711)` }}
                      aria-hidden
                    >
                      {c.glyph}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-xs font-black text-white">{c.name}</p>
                      <p className="truncate text-[11px] font-bold text-slate-300">{c.role}</p>
                      <p className="truncate text-[10px] font-semibold uppercase tracking-wide text-slate-500">{c.archetype}</p>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>

          <div className="mt-3 rounded-md border border-white/10 bg-white/[.03] p-3">
            <p className="text-[10px] font-black uppercase tracking-wide" style={{ color: character.tint }}>
              {character.name}
            </p>
            <p className="mt-1 text-[11px] leading-5 text-slate-300">{character.bio}</p>
            <p className="mt-2 border-l-2 pl-2 text-[11px] italic leading-5 text-slate-200" style={{ borderColor: character.tint }}>
              {character.signature}
            </p>
          </div>
        </aside>

        <div className="flex min-h-[460px] flex-col gap-3 border-r border-white/10 p-4">
          <div className="rounded-md border border-white/10 bg-[#0a0f1e] p-3">
            <div className="flex items-center gap-2">
              <Theater className="h-3.5 w-3.5 text-[#ffe08a]" />
              <p className="text-[10px] font-black uppercase tracking-wide text-[#ffe08a]">Stage diagram · Globe-style playing space</p>
            </div>
            <svg viewBox="0 0 320 130" className="mt-3 h-32 w-full" aria-hidden>
              <defs>
                <linearGradient id="floor" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#7c2d12" />
                  <stop offset="100%" stopColor="#1c1917" />
                </linearGradient>
              </defs>
              <rect x="10" y="10" width="300" height="110" fill="url(#floor)" stroke="#fcd34d" strokeWidth="1.5" rx="4" />
              <text x="160" y="25" textAnchor="middle" fontSize="9" fill="#fde68a" fontWeight="bold">UPSTAGE</text>
              <text x="160" y="115" textAnchor="middle" fontSize="9" fill="#fde68a" fontWeight="bold">DOWNSTAGE · audience</text>
              <text x="25" y="68" fontSize="8" fill="#fde68a" fontWeight="bold">SR</text>
              <text x="285" y="68" fontSize="8" fill="#fde68a" fontWeight="bold">SL</text>
              <circle cx="120" cy="80" r="10" fill="#fda4af" />
              <text x="120" y="83" textAnchor="middle" fontSize="9" fill="#020617" fontWeight="bold">K</text>
              <circle cx="200" cy="80" r="10" fill="#ffe08a" />
              <text x="200" y="83" textAnchor="middle" fontSize="9" fill="#020617" fontWeight="bold">P</text>
              <line x1="130" y1="80" x2="190" y2="80" stroke="#f1f5f9" strokeWidth="0.7" strokeDasharray="2 2" />
              <text x="160" y="74" textAnchor="middle" fontSize="7" fill="#f1f5f9">blocking · 2m apart</text>
            </svg>
            <p className="mt-1 text-[11px] leading-5 text-slate-400">
              Blocking shows the audience where power sits. Two metres between Katherina (K) and Petruchio (P) keeps the tension visible.
            </p>
          </div>

          <div className="flex-1 rounded-md border border-white/10 bg-[#0a0f1e] p-3">
            <div className="flex items-center gap-2">
              <Eye className="h-3.5 w-3.5 text-[#c084fc]" />
              <p className="text-[10px] font-black uppercase tracking-wide text-[#c084fc]">
                Petruchio · Act 4 Scene 1 soliloquy · click each line for subtext
              </p>
            </div>
            <div className="mt-2 space-y-1">
              {monologue.map((m, i) => {
                const active = i === lineIdx;
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setLineIdx(i)}
                    className="block w-full rounded-md p-2 text-left text-sm leading-7 transition"
                    style={{
                      background: active ? `${m.color}26` : 'transparent',
                      borderLeft: active ? `3px solid ${m.color}` : '3px solid rgba(255,255,255,.08)',
                      color: '#e2e8f0',
                    }}
                  >
                    <span className="mr-2 rounded-full px-2 py-0.5 text-[10px] font-black uppercase tracking-wide" style={{ background: `${m.color}33`, color: m.color }}>
                      {m.technique}
                    </span>
                    {m.text}
                  </button>
                );
              })}
            </div>
            <div className="mt-3 rounded-md border p-2" style={{ borderColor: `${line.color}55`, background: `${line.color}12` }}>
              <p className="text-[10px] font-black uppercase tracking-wide" style={{ color: line.color }}>Subtext</p>
              <p className="mt-1 text-xs leading-5 text-slate-200">{line.subtext}</p>
            </div>
          </div>
        </div>

        <aside className="flex flex-col gap-3 bg-[#071126] p-4">
          <div>
            <div className="flex items-center gap-2">
              <Users className="h-3.5 w-3.5 text-[#34d399]" />
              <p className="text-[10px] font-black uppercase tracking-wide text-[#34d399]">Convention spotter</p>
            </div>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {conventions.map((c) => {
                const active = c.id === convention.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setConventionId(c.id)}
                    className="rounded-md border px-2 py-1 text-[11px] font-black uppercase tracking-wide transition"
                    style={{
                      borderColor: active ? '#34d399' : 'rgba(255,255,255,.12)',
                      background: active ? 'rgba(52,211,153,.18)' : 'transparent',
                      color: active ? '#34d399' : '#cbd5e1',
                    }}
                  >
                    {c.name}
                  </button>
                );
              })}
            </div>
            <p className="mt-2 text-[11px] leading-5 text-slate-300">
              <span className="text-white">{convention.name} · </span>
              {convention.definition}
            </p>
            <p className="mt-2 rounded-md border border-white/10 bg-white/[.02] p-2 text-[11px] italic leading-5 text-slate-200">
              {convention.example}
            </p>
          </div>

          <div className="rounded-md border border-white/10 bg-white/[.03] p-3">
            <div className="flex items-center gap-2">
              <Sparkles className="h-3.5 w-3.5 text-[#ffe08a]" />
              <p className="text-[10px] font-black uppercase tracking-wide text-[#ffe08a]">WAGOLL · PETAL paragraph</p>
            </div>
            <p className="mt-2 text-[12px] leading-6 text-slate-200">
              <span className="text-white">Point.</span> Shakespeare uses Petruchio&apos;s falconry soliloquy to expose how power is dressed up as care.{' '}
              <span className="text-white">Evidence.</span> &quot;My falcon now is sharp and passing empty.&quot;{' '}
              <span className="text-white">Technique.</span> The extended metaphor renames Katherina as a hunting bird.{' '}
              <span className="text-white">Analysis.</span> Hunger is reframed as a method, which makes the audience question whether &quot;taming&quot; is care or control.{' '}
              <span className="text-white">Link.</span> The metaphor seeds the play&apos;s central question — who has actually been tamed?
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}
