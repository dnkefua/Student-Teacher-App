'use client';

import React, { useMemo, useState } from 'react';
import { ArrowRight, ExternalLink, Highlighter, PenLine, Scale } from 'lucide-react';

type AdId = 'us-mcvalue' | 'uae-ramadan';

type Callout = {
  id: string;
  label: string;
  device: string;
  effect: string;
  x: number;
  y: number;
  w: number;
  h: number;
  arrow: 'left' | 'right' | 'down';
};

type RealAd = {
  id: AdId;
  market: string;
  title: string;
  sourceUrl: string;
  imageUrl: string;
  focus: string;
  comparison: string;
  callouts: Callout[];
};

const realAds: RealAd[] = [
  {
    id: 'us-mcvalue',
    market: 'United States',
    title: '$5 Meal Deal',
    sourceUrl: 'https://www.mcdonalds.com/us/en-us/deals.html',
    imageUrl: 'https://s7d1.scene7.com/is/image/mcdonalds/ROD_Meal_Deal%3A3-column-desktop?resmode=sharp2',
    focus: 'Price, abundance, choice and instant product desire.',
    comparison:
      'The US advert uses a large price anchor, close-up food photography and choice language. It persuades through saving money, appetite and immediacy.',
    callouts: [
      {
        id: 'headline',
        label: 'Price anchor',
        device: 'Large value claim',
        effect: 'The oversized $5 offer makes value the first thing the audience sees.',
        x: 4,
        y: 6,
        w: 38,
        h: 28,
        arrow: 'right',
      },
      {
        id: 'product',
        label: 'Product image',
        device: 'Close-up food photography',
        effect: 'The large meal image creates desire before students even read the copy.',
        x: 23,
        y: 44,
        w: 54,
        h: 42,
        arrow: 'left',
      },
      {
        id: 'reward',
        label: 'Choice hook',
        device: 'Imperative choice language',
        effect: 'The phrase invites the audience to imagine controlling the order.',
        x: 68,
        y: 74,
        w: 27,
        h: 13,
        arrow: 'left',
      },
    ],
  },
  {
    id: 'uae-ramadan',
    market: 'UAE',
    title: 'Rediscover Ramadan',
    sourceUrl: 'https://www.mcdonalds.com/ae/en-ae/rediscover-ramadan.html',
    imageUrl: 'https://s7d1.scene7.com/is/image/mcdonalds/mcd-affinity-1160x520-en%3Ahero-desktop?resmode=sharp2',
    focus: 'Kindness, family, sharing and cultural connection during Ramadan.',
    comparison:
      'The UAE advert shifts persuasion away from price and towards shared values. The campaign localises the brand through Ramadan, family and generosity.',
    callouts: [
      {
        id: 'ramadan',
        label: 'Cultural context',
        device: 'Ramadan setting',
        effect: 'The advert connects the brand to a meaningful local season and shared social values.',
        x: 4,
        y: 8,
        w: 35,
        h: 20,
        arrow: 'right',
      },
      {
        id: 'people',
        label: 'Human appeal',
        device: 'Family / community imagery',
        effect: 'People in the image make the message emotional rather than transactional.',
        x: 44,
        y: 24,
        w: 42,
        h: 45,
        arrow: 'left',
      },
      {
        id: 'kindness',
        label: 'Value language',
        device: 'Abstract noun appeal',
        effect: 'Words such as kindness and sharing persuade by linking the brand to moral feeling.',
        x: 9,
        y: 64,
        w: 40,
        h: 18,
        arrow: 'down',
      },
    ],
  },
];

type RhetoricRow = {
  component: 'Headline' | 'Visuals / Colour' | 'Call to action';
  observation: { us: string; uae: string };
  appeal: { us: string; uae: string };
  function: string;
};

const rhetoricAnalyzer: RhetoricRow[] = [
  {
    component: 'Headline',
    observation: {
      us: '"$5 Meal Deal" — large yellow type, dollar sign first.',
      uae: '"Rediscover Ramadan" — soft serif, white on warm gold.',
    },
    appeal: {
      us: 'Logos · value as a numeric promise.',
      uae: 'Pathos · invitation to a shared cultural memory.',
    },
    function:
      'A headline either solves a problem ("save money") or names a feeling ("rediscover"). Same brand, opposite hook.',
  },
  {
    component: 'Visuals / Colour',
    observation: {
      us: 'Saturated red and yellow. Product photography dominates the frame.',
      uae: 'Warm dusk palette. People in the foreground, brand mark in the corner.',
    },
    appeal: {
      us: 'Pathos / hyperbole · appetite manufactured by colour.',
      uae: 'Ethos · the brand earns trust by stepping back for the people.',
    },
    function:
      'Colour is a mood setter: high-contrast for impulse, warm low-saturation for connection. The audience reads colour before words.',
  },
  {
    component: 'Call to action',
    observation: {
      us: '"Get yours now." Imperative, present tense.',
      uae: '"Share kindness this Ramadan." Imperative softened by abstract noun.',
    },
    appeal: {
      us: 'Modal urgency · "must / will" energy without the auxiliary.',
      uae: 'Ethos · the action is moral, not commercial.',
    },
    function:
      'Imperatives carry power. A US CTA tells the audience to buy; a UAE CTA tells the audience to BE — the brand benefits by association.',
  },
];

const comparisonFrames = [
  'The US advert persuades through value and convenience, whereas the UAE advert persuades through culture and shared feeling.',
  'Both adverts use visual appeal, but the US image foregrounds the product while the UAE image foregrounds people and context.',
  'The UAE campaign localises a global brand by connecting it to Ramadan, kindness and sharing.',
];

export function MediaAdvertisementLab({ compact = false }: { compact?: boolean }) {
  const [activeAdId, setActiveAdId] = useState<AdId>('us-mcvalue');
  const [activeCalloutId, setActiveCalloutId] = useState('headline');
  const [frame, setFrame] = useState(comparisonFrames[0]);
  const activeAd = useMemo(() => realAds.find((ad) => ad.id === activeAdId) ?? realAds[0], [activeAdId]);
  const activeCallout = activeAd.callouts.find((callout) => callout.id === activeCalloutId) ?? activeAd.callouts[0];

  const changeAd = (id: AdId) => {
    const next = realAds.find((ad) => ad.id === id) ?? realAds[0];
    setActiveAdId(id);
    setActiveCalloutId(next.callouts[0].id);
  };

  return (
    <section className="overflow-hidden rounded-lg border border-white/10 bg-[#050711] text-white">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 bg-[#071126] px-4 py-3">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#ffe08a]">Real advert analysis</p>
          <h2 className="text-lg font-black text-white">McDonald&apos;s US vs UAE persuasive devices</h2>
        </div>
        <p className="max-w-xl text-xs font-semibold leading-5 text-slate-300">
          Select a highlighted area to see the device, effect and comparison sentence students can use in PETAL writing.
        </p>
      </div>
      <div className={`grid ${compact ? 'min-h-[520px]' : 'min-h-[620px]'} xl:grid-cols-[minmax(0,1fr)_320px]`}>
        <div className={`relative ${compact ? 'min-h-[480px]' : 'min-h-[560px]'} bg-black`}>
          <img
            src={activeAd.imageUrl}
            alt={`${activeAd.market} McDonald's advert: ${activeAd.title}`}
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/45 via-transparent to-black/25" />

          <div className="absolute left-4 top-4 flex flex-wrap gap-2">
            {realAds.map((ad) => (
              <button
                key={ad.id}
                type="button"
                onClick={() => changeAd(ad.id)}
                className={`rounded-md px-3 py-2 text-xs font-black uppercase tracking-wide backdrop-blur ${
                  activeAd.id === ad.id ? 'bg-[#ffc43b] text-[#061126]' : 'border border-white/25 bg-black/35 text-white'
                }`}
              >
                {ad.market}
              </button>
            ))}
          </div>

          <div className="absolute bottom-4 left-4 max-w-xl pr-4">
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#ffe08a]">{activeAd.market}</p>
            <h2 className="mt-1 text-3xl font-black leading-tight sm:text-4xl">{activeAd.title}</h2>
            <p className="mt-2 max-w-lg text-sm font-semibold leading-6 text-white/90">{activeAd.focus}</p>
          </div>

          {activeAd.callouts.map((callout) => {
            const active = activeCallout.id === callout.id;
            return (
              <button
                key={callout.id}
                type="button"
                onClick={() => setActiveCalloutId(callout.id)}
                className={`absolute rounded-sm border-2 transition ${
                  active ? 'border-[#ffc43b] bg-[#ffc43b]/10 shadow-[0_0_26px_rgba(255,196,59,.55)]' : 'border-white/55 bg-black/5 hover:border-white'
                }`}
                style={{ left: `${callout.x}%`, top: `${callout.y}%`, width: `${callout.w}%`, height: `${callout.h}%` }}
                aria-label={callout.label}
              >
                <span
                  className={`absolute flex items-center gap-1 whitespace-nowrap rounded-full px-2 py-1 text-[10px] font-black uppercase tracking-wide ${
                    active ? 'bg-[#ffc43b] text-[#061126]' : 'bg-black/70 text-white'
                  } ${callout.arrow === 'left' ? '-left-2 top-1/2 -translate-x-full -translate-y-1/2' : callout.arrow === 'right' ? '-right-2 top-1/2 -translate-y-1/2 translate-x-full' : 'left-1/2 top-full mt-2 -translate-x-1/2'}`}
                >
                  <ArrowRight className={`h-3 w-3 ${callout.arrow === 'left' ? 'rotate-180' : callout.arrow === 'down' ? 'rotate-90' : ''}`} />
                  {callout.label}
                </span>
              </button>
            );
          })}
        </div>

        <aside className="flex flex-col justify-between border-l border-white/10 bg-[#071126] p-4">
          <div>
            <div className="flex items-center gap-2">
              <Highlighter className="h-4 w-4 text-[#ffc43b]" />
              <p className="text-xs font-black uppercase tracking-wide text-[#ffc43b]">Selected device</p>
            </div>
            <h3 className="mt-3 text-xl font-black text-white">{activeCallout.device}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-300">{activeCallout.effect}</p>

            <div className="mt-5 space-y-2">
              {activeAd.callouts.map((callout) => (
                <button
                  key={callout.id}
                  type="button"
                  onClick={() => setActiveCalloutId(callout.id)}
                  className={`w-full border-l-4 py-2 pl-3 text-left text-sm font-bold transition ${
                    activeCallout.id === callout.id ? 'border-[#ffc43b] text-white' : 'border-white/15 text-slate-400 hover:border-white/40 hover:text-white'
                  }`}
                >
                  {callout.label}
                </button>
              ))}
            </div>

            <div className="mt-6">
              <div className="flex items-center gap-2">
                <PenLine className="h-4 w-4 text-[#8ddfff]" />
                <p className="text-xs font-black uppercase tracking-wide text-[#8ddfff]">Write the comparison</p>
              </div>
              <select
                value={frame}
                onChange={(event) => setFrame(event.target.value)}
                className="mt-3 w-full rounded-md border border-white/10 bg-[#050711] px-3 py-2 text-sm text-white outline-none focus:border-[#8ddfff]"
              >
                {comparisonFrames.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
              <p className="mt-3 text-sm leading-6 text-slate-300">{frame}</p>
            </div>
          </div>

          <div className="mt-6 grid gap-2">
            <a
              href={activeAd.sourceUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-md border border-white/15 px-3 py-2 text-xs font-black uppercase tracking-wide text-slate-200 hover:border-white/40 hover:text-white"
            >
              Source advert
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </aside>
      </div>

      <div className="border-t border-white/10 bg-[#071126] p-4">
        <div className="flex items-center gap-2">
          <Scale className="h-4 w-4 text-[#8ddfff]" />
          <p className="text-xs font-black uppercase tracking-wide text-[#8ddfff]">
            MYP Rhetoric Analyzer · Ethos · Pathos · Logos
          </p>
        </div>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[820px] border-separate border-spacing-0 text-left text-xs">
            <thead>
              <tr className="text-[10px] font-black uppercase tracking-wide text-slate-400">
                <th className="rounded-tl-md border border-white/10 bg-white/[.03] px-3 py-2">Component</th>
                <th className="border border-white/10 bg-white/[.03] px-3 py-2 text-[#ffe08a]">Observation (US)</th>
                <th className="border border-white/10 bg-white/[.03] px-3 py-2 text-[#fda4af]">Observation (UAE)</th>
                <th className="border border-white/10 bg-white/[.03] px-3 py-2 text-[#c084fc]">Primary appeal</th>
                <th className="rounded-tr-md border border-white/10 bg-white/[.03] px-3 py-2 text-[#8ddfff]">Function / impact</th>
              </tr>
            </thead>
            <tbody>
              {rhetoricAnalyzer.map((row) => (
                <tr key={row.component} className="text-slate-200">
                  <td className="border border-white/10 px-3 py-2 font-bold text-white">{row.component}</td>
                  <td className="border border-white/10 px-3 py-2 leading-5">{row.observation.us}</td>
                  <td className="border border-white/10 px-3 py-2 leading-5">{row.observation.uae}</td>
                  <td className="border border-white/10 px-3 py-2 leading-5">
                    <span className="block text-[#ffe08a]">US · {row.appeal.us}</span>
                    <span className="mt-1 block text-[#fda4af]">UAE · {row.appeal.uae}</span>
                  </td>
                  <td className="border border-white/10 px-3 py-2 leading-5">{row.function}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-[11px] italic text-slate-400">
          Use the chart in pairs: one student observes, the other names the appeal. A strong PETAL sentence names the device, places it in the image, and explains audience effect.
        </p>
      </div>
    </section>
  );
}
