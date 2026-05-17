'use client';

import React, { useMemo, useState } from 'react';
import { Globe, Highlighter, Music2, Quote } from 'lucide-react';

type Device = {
  id: string;
  label: string;
  color: string;
  hint: string;
};

const DEVICES: Device[] = [
  { id: 'imagery', label: 'Imagery', color: '#34d399', hint: 'Sensory picture in the reader\'s head.' },
  { id: 'metaphor', label: 'Metaphor', color: '#c084fc', hint: 'Direct comparison without "like"/"as".' },
  { id: 'simile', label: 'Simile', color: '#49c8ff', hint: 'Comparison using "like" or "as".' },
  { id: 'allit', label: 'Alliteration', color: '#ffc43b', hint: 'Repeated initial consonant sounds.' },
  { id: 'enjamb', label: 'Enjambment', color: '#fb7185', hint: 'A line spills into the next without pause.' },
  { id: 'rep', label: 'Repetition', color: '#fdba74', hint: 'Repeated word or phrase for emphasis.' },
  { id: 'allusion', label: 'Allusion', color: '#22d3ee', hint: 'A nod to another text, place or idea.' },
  { id: 'collo', label: 'Colloquial voice', color: '#a3e635', hint: 'Everyday speech that pulls the reader in.' },
];

type PoetId =
  | 'mr-nobody'
  | 'sheikh-mohammed'
  | 'adam-mohammed'
  | 'agard'
  | 'zephaniah'
  | 'nichols'
  | 'alvi'
  | 'bhatt';

type Poem = {
  id: PoetId;
  title: string;
  poet: string;
  era: string;
  nationality: string;
  portraitGlyph: string;
  portraitPalette: { from: string; via: string; to: string; tint: string };
  bio: string;
  context: string;
  rhymeScheme: string;
  rhymeNote: string;
  lines: { text: string; deviceId?: string }[];
};

const POEMS: Poem[] = [
  {
    id: 'mr-nobody',
    title: 'Mr Nobody',
    poet: 'Anonymous',
    era: 'Traditional · 19th century',
    nationality: 'English folk tradition',
    portraitGlyph: '👻',
    portraitPalette: { from: '#1f2937', via: '#374151', to: '#9ca3af', tint: '#cbd5e1' },
    bio:
      'A schoolroom favourite that personifies the invisible "someone" who breaks the cup and leaves the door open. The poem turns blame into comedy.',
    context:
      'Anonymous Victorian-era light verse. Used in classrooms to introduce stanza, rhyme scheme and personification in a single short poem.',
    rhymeScheme: 'ABCB',
    rhymeNote: 'Lines 2 and 4 rhyme; lines 1 and 3 do not — the unrhymed openings keep the tone playful.',
    lines: [
      { text: 'I know a funny little man,', deviceId: 'collo' },
      { text: 'As quiet as a mouse,', deviceId: 'simile' },
      { text: 'Who does the mischief that is done', deviceId: 'rep' },
      { text: 'In everybody\'s house!' },
      { text: 'There\'s no one ever sees his face,' },
      { text: 'And yet we all agree' },
      { text: 'That every plate we break was cracked', deviceId: 'imagery' },
      { text: 'By Mr Nobody.' },
    ],
  },
  {
    id: 'sheikh-mohammed',
    title: 'Happiest Nation (excerpt)',
    poet: 'HH Sheikh Mohammed bin Rashid Al Maktoum',
    era: 'Contemporary · 2017',
    nationality: 'Emirati · Ruler of Dubai',
    portraitGlyph: '🇦🇪',
    portraitPalette: { from: '#064e3b', via: '#047857', to: '#fbbf24', tint: '#fde68a' },
    bio:
      'Vice President and Prime Minister of the UAE, Ruler of Dubai. Author of poetry that frames national pride and ambition.',
    context:
      'Composed to mark the UAE\'s aspiration to be the happiest nation in the world. The voice is collective, not individual — "we" rather than "I".',
    rhymeScheme: 'Free verse',
    rhymeNote: 'No fixed rhyme. Authority comes from anaphora and declarative sentences, not from sound symmetry.',
    lines: [
      { text: 'We are the people of a kind nation,', deviceId: 'rep' },
      { text: 'A nation born of unity and pride.' },
      { text: 'We light the desert with our dreams,', deviceId: 'metaphor' },
      { text: 'We build tomorrow with our hands,', deviceId: 'rep' },
      { text: 'And carry every guest as our family.', deviceId: 'allusion' },
    ],
  },
  {
    id: 'adam-mohammed',
    title: 'Untitled (excerpt)',
    poet: 'Adam Mohammed',
    era: 'Contemporary · 2010s',
    nationality: 'British–Sudanese · spoken-word artist',
    portraitGlyph: '🎤',
    portraitPalette: { from: '#1e1b4b', via: '#4338ca', to: '#fb7185', tint: '#fda4af' },
    bio:
      'Performance poet whose work centres on dual identity, faith and the long ache of belonging to two cultures at once.',
    context:
      'Spoken word piece written from inside the diaspora experience. The form refuses neatness — the speaker is the bridge that aches in the middle.',
    rhymeScheme: 'Free verse',
    rhymeNote: 'No rhyme scheme. The line breaks and run-ons enact the speaker\'s split between two languages.',
    lines: [
      { text: 'I carry two homes in one chest,', deviceId: 'metaphor' },
      { text: 'one whispers in Arabic,', deviceId: 'imagery' },
      { text: 'one shouts in English,', deviceId: 'imagery' },
      { text: 'and neither will quiet down for the other.', deviceId: 'enjamb' },
      { text: 'I am the bridge that aches in the middle.', deviceId: 'metaphor' },
    ],
  },
  {
    id: 'agard',
    title: 'Half-Caste (excerpt)',
    poet: 'John Agard',
    era: 'Contemporary · 1996',
    nationality: 'British–Guyanese (b. 1949)',
    portraitGlyph: '🌍',
    portraitPalette: { from: '#0c4a6e', via: '#0369a1', to: '#facc15', tint: '#fef3c7' },
    bio:
      'Born in British Guiana, moved to England in 1977. Agard\'s poetry mixes Caribbean Creole with standard English to confront racial assumptions.',
    context:
      'Written in response to the casual British use of "half-caste". The poem refuses standard punctuation — form itself argues with the reader.',
    rhymeScheme: 'Irregular',
    rhymeNote: 'No regular rhyme. Lack of punctuation refuses the idea that the speaker can be neatly contained.',
    lines: [
      { text: 'Excuse me', deviceId: 'collo' },
      { text: 'standing on one leg', deviceId: 'imagery' },
      { text: 'I\'m half-caste', deviceId: 'rep' },
      { text: 'Explain yuself', deviceId: 'collo' },
      { text: 'wha yu mean', deviceId: 'collo' },
      { text: 'when yu say half-caste' },
    ],
  },
  {
    id: 'zephaniah',
    title: 'We Refugees (excerpt)',
    poet: 'Benjamin Zephaniah',
    era: 'Contemporary · 2000s',
    nationality: 'British (1958 – 2023)',
    portraitGlyph: '✊🏾',
    portraitPalette: { from: '#7c2d12', via: '#c2410c', to: '#fde68a', tint: '#fde68a' },
    bio:
      'Birmingham-born poet, novelist and Rastafarian thinker. Used the dub poetry tradition to advocate for racial justice and the refugee experience.',
    context:
      'A call to shared humanity. Repeated structure and inclusive pronouns turn the poem into a chant — and a moral argument.',
    rhymeScheme: 'Free verse / chant',
    rhymeNote: 'No rhyme — the rhythm comes from anaphora ("we") and the steady beat of repeated phrasing.',
    lines: [
      { text: 'I come from a beautiful place', deviceId: 'collo' },
      { text: 'Where they hated me.', deviceId: 'rep' },
      { text: 'Now I am a refugee', deviceId: 'rep' },
      { text: 'But I will not lose my face.', deviceId: 'metaphor' },
      { text: 'We can all be refugees', deviceId: 'rep' },
      { text: 'Sometimes it only takes a day,' },
      { text: 'Sometimes it only takes a handshake', deviceId: 'imagery' },
      { text: 'Or a paper that is signed.' },
    ],
  },
  {
    id: 'nichols',
    title: 'Island Man (excerpt)',
    poet: 'Grace Nichols',
    era: 'Contemporary · 1984',
    nationality: 'British–Guyanese (b. 1950)',
    portraitGlyph: '🌊',
    portraitPalette: { from: '#0f766e', via: '#14b8a6', to: '#fde68a', tint: '#a7f3d0' },
    bio:
      'Born in Guyana, settled in Britain in 1977. Her work moves between Caribbean memory and London grey, carrying both in the same image.',
    context:
      'A four-stanza poem whose visual form on the page (broken lines, spaces) enacts a man waking in London while his imagination is still in the Caribbean.',
    rhymeScheme: 'Free verse',
    rhymeNote: 'No rhyme — the sound shift between "blue surf" and "London traffic" carries the displacement.',
    lines: [
      { text: 'Morning', deviceId: 'imagery' },
      { text: 'and island man wakes up' },
      { text: 'to the sound of blue surf', deviceId: 'allit' },
      { text: 'in his head' },
      { text: 'the steady breaking and wombing', deviceId: 'metaphor' },
      { text: 'wild seabirds', deviceId: 'imagery' },
      { text: 'and fishermen pushing out to sea', deviceId: 'enjamb' },
      { text: 'the sun surfacing defiantly', deviceId: 'metaphor' },
      { text: 'from the east', deviceId: 'allusion' },
    ],
  },
  {
    id: 'alvi',
    title: 'Presents from My Aunts in Pakistan (excerpt)',
    poet: 'Moniza Alvi',
    era: 'Contemporary · 1993',
    nationality: 'British–Pakistani (b. 1954)',
    portraitGlyph: '🧵',
    portraitPalette: { from: '#7c1d6f', via: '#be185d', to: '#fde047', tint: '#fde047' },
    bio:
      'Born in Lahore, raised in Hertfordshire. Her work uses material objects — clothes, light, food — to carry the weight of dual cultural identity.',
    context:
      'A teenage speaker receives Pakistani clothes that she finds glamorous and alien at once. Material objects symbolise belonging in two cultures simultaneously.',
    rhymeScheme: 'Free verse · short stanzas',
    rhymeNote: 'No regular rhyme. Colour, texture and weight do the work of sound.',
    lines: [
      { text: 'They sent me a salwar kameez', deviceId: 'imagery' },
      { text: 'peacock-blue,', deviceId: 'imagery' },
      { text: 'and another' },
      { text: 'glistening like an orange split open,', deviceId: 'simile' },
      { text: 'embossed slippers, gold and black', deviceId: 'imagery' },
      { text: 'points curling.', deviceId: 'enjamb' },
      { text: 'Candy-striped glass bangles', deviceId: 'imagery' },
      { text: 'snapped, drawing blood.', deviceId: 'metaphor' },
    ],
  },
  {
    id: 'bhatt',
    title: 'Search For My Tongue (excerpt)',
    poet: 'Sujata Bhatt',
    era: 'Contemporary · 1988',
    nationality: 'Indian–American (b. 1956)',
    portraitGlyph: '👅',
    portraitPalette: { from: '#312e81', via: '#6d28d9', to: '#f472b6', tint: '#fbcfe8' },
    bio:
      'Born in Ahmedabad, India. Bhatt writes in both English and Gujarati — and in the same poem. Her work is bilingual on the page.',
    context:
      'A speaker fears losing her "mother tongue" as she lives in English. The poem switches into Gujarati script to enact what cannot be translated.',
    rhymeScheme: 'Free verse',
    rhymeNote: 'No fixed rhyme. The shift between two languages on the page is the structural device.',
    lines: [
      { text: 'You ask me what I mean', deviceId: 'collo' },
      { text: 'by saying I have lost my tongue.', deviceId: 'metaphor' },
      { text: 'I ask you, what would you do', deviceId: 'rep' },
      { text: 'if you had two tongues in your mouth,', deviceId: 'metaphor' },
      { text: 'and lost the first one, the mother tongue,', deviceId: 'enjamb' },
      { text: 'and could not really know the other,', deviceId: 'enjamb' },
      { text: 'the foreign tongue.' },
    ],
  },
];

export function PoetryAnthologyLab() {
  const [poemId, setPoemId] = useState<PoetId>('mr-nobody');
  const [device, setDevice] = useState<Device>(DEVICES[0]);

  const poem = useMemo(() => POEMS.find((p) => p.id === poemId) ?? POEMS[0], [poemId]);
  const tagged = poem.lines.filter((l) => l.deviceId === device.id).length;

  return (
    <section className="overflow-hidden rounded-lg border border-white/10 bg-[#050711] text-white">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 bg-[#071126] px-4 py-3">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#c084fc]">Poetry Anthology Lab</p>
          <h2 className="text-lg font-black text-white">Eight voices · one anthology · personal & cultural expression</h2>
        </div>
        <p className="max-w-xl text-xs font-semibold leading-5 text-slate-300">
          Choose a poet, read the poem, then pick a technique chip to see every line that uses it.
        </p>
      </div>

      <div className="grid xl:grid-cols-[280px_minmax(0,1fr)_300px]">
        <aside className="max-h-[640px] overflow-y-auto border-r border-white/10 bg-[#071126] p-3">
          <p className="mb-2 text-[10px] font-black uppercase tracking-wide text-slate-400">Choose poem</p>
          <ul className="space-y-2">
            {POEMS.map((p) => {
              const active = p.id === poem.id;
              return (
                <li key={p.id}>
                  <button
                    type="button"
                    onClick={() => setPoemId(p.id)}
                    className="flex w-full items-center gap-3 rounded-md border p-2 text-left transition"
                    style={{
                      borderColor: active ? p.portraitPalette.tint : 'rgba(255,255,255,.12)',
                      background: active ? 'rgba(255,255,255,.04)' : 'transparent',
                    }}
                  >
                    <span
                      className="grid h-12 w-12 shrink-0 place-items-center rounded-md text-2xl"
                      style={{
                        background: `linear-gradient(135deg, ${p.portraitPalette.from}, ${p.portraitPalette.via}, ${p.portraitPalette.to})`,
                      }}
                      aria-hidden
                    >
                      {p.portraitGlyph}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-black text-white">{p.title}</p>
                      <p className="truncate text-[11px] font-bold text-slate-300">{p.poet}</p>
                      <p className="truncate text-[10px] font-semibold uppercase tracking-wide text-slate-500">{p.era}</p>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        </aside>

        <div className="flex min-h-[480px] flex-col p-4">
          <div className="rounded-md border border-white/10 bg-white/[.03] p-3">
            <div className="flex items-center gap-2">
              <Globe className="h-3.5 w-3.5 text-[#8ddfff]" />
              <p className="text-[10px] font-black uppercase tracking-wide text-[#8ddfff]">Cultural context</p>
            </div>
            <p className="mt-1 text-sm leading-6 text-slate-200">{poem.context}</p>
            <p className="mt-1 text-[11px] italic text-slate-400">{poem.bio}</p>
          </div>

          <div className="mt-3 flex-1 rounded-md border border-white/10 bg-[#0a0f1e] p-4">
            <p className="text-[10px] font-black uppercase tracking-wide text-slate-400">{poem.poet}</p>
            <p className="text-base font-black text-white">{poem.title}</p>
            <div className="mt-3 space-y-1">
              {poem.lines.map((line, i) => {
                const lineDevice = DEVICES.find((d) => d.id === line.deviceId);
                const highlighted = lineDevice && lineDevice.id === device.id;
                return (
                  <p
                    key={i}
                    className="rounded-md p-1.5 text-sm leading-7 transition"
                    style={{
                      background: highlighted ? `${device.color}26` : 'transparent',
                      borderLeft: highlighted ? `3px solid ${device.color}` : '3px solid transparent',
                      color: highlighted ? '#fff' : '#e2e8f0',
                    }}
                  >
                    {highlighted && (
                      <span
                        className="mr-2 rounded-full px-2 py-0.5 text-[10px] font-black uppercase tracking-wide"
                        style={{ background: `${device.color}33`, color: device.color }}
                      >
                        {device.label}
                      </span>
                    )}
                    {line.text}
                  </p>
                );
              })}
            </div>
          </div>
        </div>

        <aside className="flex flex-col gap-3 bg-[#071126] p-4">
          <div>
            <div className="flex items-center gap-2">
              <Highlighter className="h-4 w-4 text-[#c084fc]" />
              <p className="text-xs font-black uppercase tracking-wide text-[#c084fc]">Technique spotlight</p>
            </div>
            <p className="mt-2 text-[11px] font-bold text-slate-400">Pick a chip — every matching line glows in the poem.</p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {DEVICES.map((d) => {
                const active = d.id === device.id;
                return (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => setDevice(d)}
                    className="rounded-md border px-2 py-1 text-[11px] font-black uppercase tracking-wide transition"
                    style={{
                      borderColor: active ? d.color : 'rgba(255,255,255,.12)',
                      background: active ? `${d.color}26` : 'transparent',
                      color: active ? d.color : '#cbd5e1',
                    }}
                  >
                    <span className="mr-1 inline-block h-2 w-2 rounded-full" style={{ background: d.color }} />
                    {d.label}
                  </button>
                );
              })}
            </div>
            <p className="mt-2 text-[11px] italic text-slate-400">{device.hint}</p>
            <p className="mt-2 text-[11px] font-bold" style={{ color: device.color }}>
              {tagged} line{tagged === 1 ? '' : 's'} use this device in this poem.
            </p>
          </div>

          <div className="rounded-md border border-white/10 bg-white/[.03] p-3">
            <div className="flex items-center gap-2">
              <Music2 className="h-3.5 w-3.5 text-[#ffe08a]" />
              <p className="text-[10px] font-black uppercase tracking-wide text-[#ffe08a]">Rhyme scheme</p>
            </div>
            <p className="mt-1 text-sm font-black text-white">{poem.rhymeScheme}</p>
            <p className="mt-1 text-[11px] leading-5 text-slate-400">{poem.rhymeNote}</p>
          </div>

          <div className="rounded-md border border-white/10 bg-white/[.03] p-3">
            <div className="flex items-center gap-2">
              <Quote className="h-3.5 w-3.5 text-[#34d399]" />
              <p className="text-[10px] font-black uppercase tracking-wide text-[#34d399]">PETAL sentence stem</p>
            </div>
            <p className="mt-2 text-xs leading-5 text-slate-300">
              <span className="text-white">{poem.poet.split(' ').slice(-1)[0]}</span> uses {device.label.toLowerCase()} in &quot;{poem.title}&quot; to{' '}
              <span className="italic">[verb the effect]</span>, which makes the reader feel{' '}
              <span className="italic">[emotion / response]</span>.
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}
