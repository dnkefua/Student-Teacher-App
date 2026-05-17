'use client';

import React, { useMemo, useState } from 'react';
import { BookOpen, Highlighter, Quote, Users } from 'lucide-react';

type BookId = 'catcf' | 'wonder';

type Annotation = {
  id: string;
  label: string;
  device: string;
  effect: string;
  color: string;
};

type Excerpt = {
  source: string;
  chapter: string;
  paragraphs: { text: string; annotationId?: string }[];
};

type Book = {
  id: BookId;
  title: string;
  author: string;
  year: string;
  nationality: string;
  blurb: string;
  themes: string[];
  coverPalette: { from: string; via: string; to: string; glyph: string; tint: string };
  excerpts: Excerpt[];
  annotations: Annotation[];
};

const books: Book[] = [
  {
    id: 'catcf',
    title: 'Charlie and the Chocolate Factory',
    author: 'Roald Dahl',
    year: '1964',
    nationality: 'British (b. Wales, 1916 – 1990)',
    blurb:
      'A poor boy wins a golden ticket to tour the most extraordinary chocolate factory in the world. Dahl uses sharp characterisation and moral contrast to ask what kindness, greed and family really mean.',
    themes: ['Family', 'Generosity', 'Greed', 'Imagination'],
    coverPalette: {
      from: '#3b1d0a',
      via: '#7a3b14',
      to: '#f5a623',
      glyph: '🍫',
      tint: '#ffe08a',
    },
    excerpts: [
      {
        source: 'Charlie and the Chocolate Factory',
        chapter: 'Chapter 6 — The First Two Finders',
        paragraphs: [
          {
            text:
              'On his way home, Charlie put his hand in his pocket and felt the small silver coin between his fingers. He had not spent a single penny of it. He was carrying it home, untouched, to his family.',
            annotationId: 'indirect-generosity',
          },
          {
            text:
              'When he reached the cottage, he gave the chocolate bar to Grandpa Joe, and Grandpa Joe broke it carefully into seven tiny pieces — one for each of them.',
            annotationId: 'symbol-sharing',
          },
          {
            text:
              '"Take a piece, my dear," whispered Grandpa Joe, pushing the smallest piece into Charlie\'s thin little hand. "You take it, Grandpa," said Charlie. "I had a whole bar to myself this morning."',
            annotationId: 'voice-selfless',
          },
        ],
      },
    ],
    annotations: [
      {
        id: 'indirect-generosity',
        label: 'Indirect characterisation',
        device: 'Action, not adjective',
        effect:
          'Dahl never writes "Charlie was selfless" — he shows it through the untouched coin. The reader infers the trait, which makes it stronger.',
        color: '#ffc43b',
      },
      {
        id: 'symbol-sharing',
        label: 'Symbol of scarcity',
        device: 'One bar · seven pieces',
        effect:
          'The chocolate becomes a symbol of the Bucket family\'s shared life. Scarcity is shown through arithmetic, not adjectives.',
        color: '#fb7185',
      },
      {
        id: 'voice-selfless',
        label: 'Voice of selflessness',
        device: 'Dialogue with subtext',
        effect:
          'Charlie\'s line carries the lie of "I had a whole bar to myself" — kind dishonesty. Subtext reveals character without telling.',
        color: '#49c8ff',
      },
    ],
  },
  {
    id: 'wonder',
    title: 'Wonder',
    author: 'R. J. Palacio',
    year: '2012',
    nationality: 'American (b. New York, 1963)',
    blurb:
      'August Pullman is ten years old and was born with a severe facial difference. Wonder rotates first-person narration across August, Via, Summer and Jack — asking the reader to choose kindness through perspective.',
    themes: ['Identity', 'Kindness', 'Family', 'Perspective'],
    coverPalette: {
      from: '#0b1d3a',
      via: '#1e3c72',
      to: '#7ec8ff',
      glyph: '👁',
      tint: '#8ddfff',
    },
    excerpts: [
      {
        source: 'Wonder',
        chapter: 'Part One · August — Ordinary',
        paragraphs: [
          {
            text:
              'I know I\'m not an ordinary ten-year-old kid. I mean, sure, I do ordinary things. I eat ice cream. I ride my bike. I play ball. I have an XBox. Stuff like that makes me ordinary. I guess. And I feel ordinary. Inside.',
            annotationId: 'first-person-direct',
          },
          {
            text:
              'But I know ordinary kids don\'t make other ordinary kids run away screaming in playgrounds. I know ordinary kids don\'t get stared at wherever they go.',
            annotationId: 'shift-tone',
          },
        ],
      },
      {
        source: 'Wonder',
        chapter: 'Part Two · Via — A Tour of the Galaxy',
        paragraphs: [
          {
            text:
              'August is the Sun. Me and Mom and Dad are planets orbiting the Sun. The rest of our family and friends are asteroids and comets floating around the planets orbiting the Sun. The only celestial body that doesn\'t orbit August the Sun is Daisy the dog, and that\'s only because to her little doggy eyes, August\'s face doesn\'t look very different from any other human\'s face.',
            annotationId: 'extended-metaphor',
          },
        ],
      },
    ],
    annotations: [
      {
        id: 'first-person-direct',
        label: 'First-person direct',
        device: 'Conversational voice',
        effect:
          'Auggie speaks straight to the reader. Short, list-like sentences pull us in before any description of his face — the reader meets him as a kid first.',
        color: '#8ddfff',
      },
      {
        id: 'shift-tone',
        label: 'Tonal pivot',
        device: 'But / contrast',
        effect:
          'The "But" reverses the paragraph\'s rhythm. Palacio uses sentence structure itself to enact the gap between how Auggie feels and how the world responds.',
        color: '#c084fc',
      },
      {
        id: 'extended-metaphor',
        label: 'Extended metaphor',
        device: 'Solar system as family',
        effect:
          'Via\'s narration positions August as the centre of every orbit — including hers. The metaphor carries the quiet weight of being the planet, not the sun.',
        color: '#fdba74',
      },
    ],
  },
];

const empathyMap = [
  {
    element: 'What the world sees',
    auggie: 'Physical difference; struggle; the face that makes children run.',
    via: 'Quiet sister; "fine"; the planet, never the sun.',
    reflection: 'Worth is not the same as visibility — both children carry weight the other does not see.',
  },
  {
    element: 'Narrative voice',
    auggie: 'External pressure described from inside Auggie — the reader feels every stare.',
    via: 'Internal monologue. The reader hears the cost of being "the well one".',
    reflection: 'Palacio rotates the lens so the reader has to choose perspective consciously.',
  },
  {
    element: 'Hidden truth',
    auggie: '"I feel ordinary. Inside." — interior life refuses the label "extraordinary".',
    via: 'Love and resentment co-exist. Family is never one feeling.',
    reflection: 'Multiple narrators reveal the same family from incompatible angles — and both are true.',
  },
];

export function NovelStudyLab() {
  const [activeBookId, setActiveBookId] = useState<BookId>('catcf');
  const [annotationId, setAnnotationId] = useState<string | null>(null);

  const activeBook = useMemo(() => books.find((b) => b.id === activeBookId) ?? books[0], [activeBookId]);
  const annotation =
    activeBook.annotations.find((a) => a.id === annotationId) ?? activeBook.annotations[0];

  return (
    <section className="overflow-hidden rounded-lg border border-white/10 bg-[#050711] text-white">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 bg-[#071126] px-4 py-3">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#ffe08a]">Novel Study Lab</p>
          <h2 className="text-lg font-black text-white">Charlie & Wonder · close reading and character craft</h2>
        </div>
        <p className="max-w-xl text-xs font-semibold leading-5 text-slate-300">
          Pick a novel, tap a highlighted paragraph to reveal the technique and audience effect, then compare narrators with the Empathy Map below.
        </p>
      </div>

      <div className="grid xl:grid-cols-[260px_minmax(0,1fr)_320px]">
        <aside className="flex flex-col gap-2 border-r border-white/10 bg-[#071126] p-4">
          {books.map((book) => {
            const active = book.id === activeBook.id;
            return (
              <button
                key={book.id}
                type="button"
                onClick={() => {
                  setActiveBookId(book.id);
                  setAnnotationId(book.annotations[0]?.id ?? null);
                }}
                className="flex flex-col items-stretch overflow-hidden rounded-lg border text-left transition"
                style={{
                  borderColor: active ? book.coverPalette.tint : 'rgba(255,255,255,.12)',
                  background: active ? 'rgba(255,255,255,.04)' : 'transparent',
                  boxShadow: active ? `0 0 24px ${book.coverPalette.tint}33` : 'none',
                }}
              >
                <div
                  className="grid h-32 place-items-center text-5xl"
                  style={{
                    background: `linear-gradient(135deg, ${book.coverPalette.from}, ${book.coverPalette.via}, ${book.coverPalette.to})`,
                  }}
                  aria-hidden
                >
                  <span>{book.coverPalette.glyph}</span>
                </div>
                <div className="p-3">
                  <p className="text-[10px] font-black uppercase tracking-wide text-slate-400">{book.year}</p>
                  <p className="text-sm font-black text-white">{book.title}</p>
                  <p className="text-[11px] font-bold text-slate-300">{book.author}</p>
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">{book.nationality}</p>
                </div>
              </button>
            );
          })}
        </aside>

        <div className="flex min-h-[460px] flex-col gap-3 border-r border-white/10 p-4">
          <div className="rounded-md border border-white/10 bg-white/[.03] p-3">
            <p className="text-[10px] font-black uppercase tracking-wide text-slate-400">About the book</p>
            <p className="mt-1 text-sm leading-6 text-slate-200">{activeBook.blurb}</p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {activeBook.themes.map((t) => (
                <span
                  key={t}
                  className="rounded-full border px-2 py-0.5 text-[10px] font-black uppercase tracking-wide"
                  style={{ borderColor: `${activeBook.coverPalette.tint}55`, color: activeBook.coverPalette.tint }}
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          {activeBook.excerpts.map((excerpt) => (
            <div key={excerpt.chapter} className="rounded-md border border-white/10 bg-[#0a0f1e] p-3">
              <p className="text-[10px] font-black uppercase tracking-wide text-slate-400">
                {excerpt.source} · {excerpt.chapter}
              </p>
              <div className="mt-2 space-y-2">
                {excerpt.paragraphs.map((p, idx) => {
                  const an = p.annotationId
                    ? activeBook.annotations.find((a) => a.id === p.annotationId)
                    : undefined;
                  const active = an && annotation.id === an.id;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => an && setAnnotationId(an.id)}
                      className="block w-full rounded-md p-2 text-left text-sm leading-7 transition"
                      style={{
                        background: an ? `${an.color}${active ? '26' : '12'}` : 'transparent',
                        borderLeft: an ? `3px solid ${an.color}` : '3px solid transparent',
                        color: '#e2e8f0',
                      }}
                    >
                      {an && (
                        <span
                          className="mr-2 rounded-full px-2 py-0.5 text-[10px] font-black uppercase tracking-wide"
                          style={{ background: `${an.color}33`, color: an.color }}
                        >
                          {an.label}
                        </span>
                      )}
                      {p.text}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <aside className="flex flex-col justify-between gap-3 bg-[#071126] p-4">
          <div>
            <div className="flex items-center gap-2">
              <Highlighter className="h-4 w-4 text-[#ffc43b]" />
              <p className="text-xs font-black uppercase tracking-wide text-[#ffc43b]">Selected technique</p>
            </div>
            <h3 className="mt-3 text-xl font-black text-white">{annotation.device}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-300">{annotation.effect}</p>

            <div className="mt-5 space-y-2">
              {activeBook.annotations.map((a) => (
                <button
                  key={a.id}
                  type="button"
                  onClick={() => setAnnotationId(a.id)}
                  className="w-full border-l-4 py-2 pl-3 text-left text-sm font-bold transition"
                  style={{
                    borderColor: annotation.id === a.id ? a.color : 'rgba(255,255,255,.12)',
                    color: annotation.id === a.id ? '#fff' : '#94a3b8',
                  }}
                >
                  {a.label}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-md border border-white/10 bg-white/[.03] p-3">
            <div className="flex items-center gap-2">
              <Quote className="h-3.5 w-3.5 text-[#c084fc]" />
              <p className="text-[10px] font-black uppercase tracking-wide text-[#c084fc]">PETAL sentence stem</p>
            </div>
            <p className="mt-2 text-xs leading-5 text-slate-300">
              <span className="text-white">{activeBook.author}</span> uses {annotation.device.toLowerCase()} to{' '}
              <span className="italic">[verb the effect]</span>, which makes the reader{' '}
              <span className="italic">[response]</span>.
            </p>
          </div>
        </aside>
      </div>

      <div className="border-t border-white/10 bg-[#071126] p-4">
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-[#8ddfff]" />
          <p className="text-xs font-black uppercase tracking-wide text-[#8ddfff]">Empathy Map · Auggie vs Via (MYP Criterion B · Perspective)</p>
        </div>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[640px] border-separate border-spacing-0 text-left text-xs">
            <thead>
              <tr className="text-[10px] font-black uppercase tracking-wide text-slate-400">
                <th className="rounded-tl-md border border-white/10 bg-white/[.03] px-3 py-2">Element</th>
                <th className="border border-white/10 bg-white/[.03] px-3 py-2 text-[#8ddfff]">August (Auggie)</th>
                <th className="border border-white/10 bg-white/[.03] px-3 py-2 text-[#c084fc]">Via</th>
                <th className="rounded-tr-md border border-white/10 bg-white/[.03] px-3 py-2 text-[#ffe08a]">Reader reflection</th>
              </tr>
            </thead>
            <tbody>
              {empathyMap.map((row) => (
                <tr key={row.element} className="text-slate-200">
                  <td className="border border-white/10 px-3 py-2 font-bold text-white">{row.element}</td>
                  <td className="border border-white/10 px-3 py-2 leading-5">{row.auggie}</td>
                  <td className="border border-white/10 px-3 py-2 leading-5">{row.via}</td>
                  <td className="border border-white/10 px-3 py-2 leading-5">{row.reflection}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-[11px] italic text-slate-400">
          <BookOpen className="mr-1 inline h-3 w-3" />
          Use the map to plan a comparative PETAL: pick one element row, quote both narrators, then write the reflection in your own words.
        </p>
      </div>
    </section>
  );
}
