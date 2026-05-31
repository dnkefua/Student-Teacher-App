'use client';

import React, { useEffect, useMemo, useState } from 'react';
import {
  AlertCircle,
  ExternalLink,
  Globe,
  Loader2,
  Newspaper,
  RefreshCw,
  Search,
  Tv,
} from 'lucide-react';
import { COUNTRIES, getCountryByCode } from '@/lib/news/countries';
import type {
  BroadcastStream,
  Language,
  NewsFeedResponse,
  NewsItem,
  NewspaperSource,
  NewsCountry,
} from '@/lib/news/types';

/**
 * NewsHub.
 *
 * One-stop news consumption surface for African countries. Each country
 * exposes three layers:
 *
 *   1. Live broadcasts — embeddable YouTube `live_stream` iframes for
 *      the country's public + private TV channels. When a channel
 *      isn't live YouTube renders its standard fallback card, and we
 *      always also link to the channel directly.
 *
 *   2. Newspapers / online publications — direct link-outs to free,
 *      no-paywall outlets. Curated per country in `lib/news/countries.ts`.
 *
 *   3. Aggregated headlines — Google News RSS results fetched through
 *      `/api/news` (server-side because the RSS endpoint is CORS-blocked).
 *
 * The hub starts on Cameroon and remembers the user's last pick in
 * localStorage so reopening the tab returns them where they left off.
 */

const LANG_LABEL: Record<Language, string> = {
  en: 'English',
  fr: 'Français',
  pt: 'Português',
  sw: 'Kiswahili',
  ar: 'العربية',
};

const STORAGE_KEY = 'eis-news-country';

function buildLiveEmbedUrl(channelId: string): string {
  // `live_stream` channel param shows the current live broadcast for
  // that channel, falling back to YouTube's "channel isn't live" card.
  return `https://www.youtube.com/embed/live_stream?channel=${encodeURIComponent(channelId)}&autoplay=0`;
}

function timeAgo(iso?: string): string {
  if (!iso) return '';
  const d = new Date(iso).getTime();
  if (Number.isNaN(d)) return '';
  const diff = Math.max(0, Date.now() - d);
  const minutes = Math.round(diff / 60_000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} hr ago`;
  const days = Math.round(hours / 24);
  if (days < 7) return `${days} day${days === 1 ? '' : 's'} ago`;
  return new Date(iso).toLocaleDateString();
}

export function NewsHub() {
  const [countryCode, setCountryCode] = useState<string>('CM');
  const [search, setSearch] = useState('');
  const [language, setLanguage] = useState<Language>('fr');
  const [feed, setFeed] = useState<NewsFeedResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [topicQuery, setTopicQuery] = useState('');

  // Restore last-selected country.
  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored && getCountryByCode(stored)) setCountryCode(stored.toUpperCase());
    } catch {
      /* ignore */
    }
  }, []);

  const country: NewsCountry = useMemo(
    () => getCountryByCode(countryCode) ?? COUNTRIES[0],
    [countryCode],
  );

  // Reset language to the country default whenever the country changes.
  useEffect(() => {
    setLanguage(country.defaultLanguage);
  }, [country]);

  // Fetch the Google-News-backed feed via our server route.
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    const params = new URLSearchParams({
      country: country.code,
      lang: language,
    });
    if (topicQuery.trim()) params.set('q', topicQuery.trim());
    fetch(`/api/news?${params.toString()}`)
      .then((r) => r.json())
      .then((data: NewsFeedResponse) => {
        if (!cancelled) setFeed(data);
      })
      .catch(() => {
        if (!cancelled)
          setFeed({
            country: country.code,
            language,
            items: [],
            fetchedAt: new Date().toISOString(),
            error: 'Could not reach /api/news',
          });
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [country.code, language, topicQuery]);

  const onPickCountry = (code: string) => {
    setCountryCode(code);
    try {
      window.localStorage.setItem(STORAGE_KEY, code);
    } catch {
      /* ignore */
    }
  };

  const filteredCountries = useMemo(() => {
    if (!search.trim()) return COUNTRIES;
    const q = search.trim().toLowerCase();
    return COUNTRIES.filter(
      (c) => c.name.toLowerCase().includes(q) || c.code.toLowerCase().includes(q),
    );
  }, [search]);

  return (
    <div className="mx-auto max-w-6xl space-y-5">
      <header className="rounded-2xl border border-white/10 bg-gradient-to-br from-sky-500/10 via-emerald-500/10 to-amber-500/10 p-5 backdrop-blur-xl">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/60">
              African newsroom
            </p>
            <h1 className="mt-0.5 flex items-center gap-2 text-2xl font-black text-white sm:text-3xl">
              <Globe className="h-7 w-7 text-sky-300" />
              News & live broadcasts
            </h1>
            <p className="mt-1 text-xs text-slate-300">
              Free newspapers, public-broadcast streams and aggregated headlines from across the continent — starting with Cameroon.
            </p>
          </div>
          <div className="flex items-center gap-3 self-start sm:self-center">
            <span className="text-4xl leading-none" aria-hidden>{country.flag}</span>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-white/60">Showing</p>
              <p className="truncate text-base font-black text-white">{country.name}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Country picker — pill list + search */}
      <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur-xl">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <p className="text-[10px] font-black uppercase tracking-widest text-white/60">
            Choose a country
          </p>
          <div className="relative ml-auto">
            <Search className="absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-500" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search…"
              className="w-44 rounded-md border border-white/10 bg-slate-950 py-1.5 pl-7 pr-2 text-xs text-white outline-none placeholder:text-slate-500 focus:border-sky-400"
            />
          </div>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {filteredCountries.map((c) => {
            const active = c.code === country.code;
            return (
              <button
                key={c.code}
                onClick={() => onPickCountry(c.code)}
                className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-bold transition ${
                  active
                    ? 'border-sky-400 bg-sky-500/20 text-white shadow-md shadow-sky-500/10'
                    : 'border-white/10 bg-white/5 text-slate-300 hover:border-white/30 hover:text-white'
                }`}
              >
                <span aria-hidden>{c.flag}</span>
                {c.name}
              </button>
            );
          })}
        </div>
      </section>

      {/* Live broadcasts */}
      <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur-xl">
        <div className="mb-3 flex items-center gap-2">
          <Tv className="h-4 w-4 text-rose-300" />
          <p className="text-[10px] font-black uppercase tracking-widest text-rose-200">
            Live broadcasts & news channels
          </p>
        </div>
        {country.broadcasts.length === 0 ? (
          <p className="rounded-md border border-dashed border-white/10 px-3 py-6 text-center text-xs text-slate-500">
            No verified broadcasters configured for {country.name} yet — newspapers and aggregated headlines below.
          </p>
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            {country.broadcasts.map((b) => (
              <BroadcastCard key={b.id} stream={b} />
            ))}
          </div>
        )}
      </section>

      {/* Newspapers */}
      <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur-xl">
        <div className="mb-3 flex items-center gap-2">
          <Newspaper className="h-4 w-4 text-amber-300" />
          <p className="text-[10px] font-black uppercase tracking-widest text-amber-200">
            Newspapers & online publications
          </p>
        </div>
        {country.newspapers.length === 0 ? (
          <p className="rounded-md border border-dashed border-white/10 px-3 py-6 text-center text-xs text-slate-500">
            No newspapers listed for {country.name} yet.
          </p>
        ) : (
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {country.newspapers.map((paper) => (
              <NewspaperCard key={paper.id} paper={paper} />
            ))}
          </div>
        )}
      </section>

      {/* Aggregated headlines */}
      <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur-xl">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <Search className="h-4 w-4 text-sky-300" />
          <p className="text-[10px] font-black uppercase tracking-widest text-sky-200">
            Latest headlines · Google News
          </p>
          <div className="ml-auto flex flex-wrap items-center gap-1.5">
            {country.languages.length > 1 && (
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as Language)}
                className="rounded-md border border-white/10 bg-slate-950 px-2 py-1 text-[11px] text-white outline-none focus:border-sky-400"
              >
                {country.languages.map((lng) => (
                  <option key={lng} value={lng}>{LANG_LABEL[lng]}</option>
                ))}
              </select>
            )}
            <input
              type="search"
              value={topicQuery}
              onChange={(e) => setTopicQuery(e.target.value)}
              placeholder="Filter by topic"
              className="w-40 rounded-md border border-white/10 bg-slate-950 px-2 py-1 text-[11px] text-white outline-none placeholder:text-slate-500 focus:border-sky-400"
            />
            <button
              onClick={() => setTopicQuery((q) => q + '')}
              className="inline-flex items-center gap-1 rounded-md border border-white/10 bg-white/5 px-2 py-1 text-[11px] font-bold text-slate-200 hover:bg-white/10"
              title="Reload feed"
            >
              <RefreshCw className={`h-3 w-3 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {loading && !feed?.items.length ? (
          <div className="grid place-items-center px-3 py-10 text-xs text-slate-400">
            <Loader2 className="h-5 w-5 animate-spin text-sky-300" />
          </div>
        ) : feed?.error ? (
          <div className="flex items-start gap-2 rounded-md border border-rose-400/30 bg-rose-500/10 p-3 text-xs text-rose-200">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <p>
              Couldn&apos;t load headlines: {feed.error}. Try a different language or open the
              newspaper sites above directly.
            </p>
          </div>
        ) : feed?.items.length ? (
          <ul className="grid gap-2 sm:grid-cols-2">
            {feed.items.map((item) => (
              <HeadlineCard key={item.id} item={item} />
            ))}
          </ul>
        ) : (
          <p className="rounded-md border border-dashed border-white/10 px-3 py-6 text-center text-xs text-slate-500">
            No headlines returned. Try a different filter or language.
          </p>
        )}

        <p className="mt-3 text-[10px] text-slate-500">
          Headlines aggregated from Google News · refreshed {timeAgo(feed?.fetchedAt) || 'just now'} · all links open at the publisher.
        </p>
      </section>
    </div>
  );
}

/* ─── Cards ─────────────────────────────────────────────────────────── */

function BroadcastCard({ stream }: { stream: BroadcastStream }) {
  const embedUrl =
    stream.embedUrl ??
    (stream.youtubeChannelId ? buildLiveEmbedUrl(stream.youtubeChannelId) : null);

  return (
    <article className="overflow-hidden rounded-xl border border-white/10 bg-slate-950/50">
      <div className="relative aspect-video bg-black">
        {embedUrl ? (
          <iframe
            src={embedUrl}
            title={`${stream.name} — live broadcast`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
            className="absolute inset-0 h-full w-full"
            loading="lazy"
          />
        ) : (
          <div className="absolute inset-0 grid place-items-center text-center">
            <div>
              <Tv className="mx-auto h-8 w-8 text-slate-500" />
              <p className="mt-2 text-xs text-slate-400">No embed available — open the channel</p>
            </div>
          </div>
        )}
      </div>
      <div className="flex items-start justify-between gap-3 p-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-black text-white">{stream.name}</p>
          {stream.blurb && <p className="mt-0.5 text-[11px] text-slate-400">{stream.blurb}</p>}
          <p className="mt-1 text-[10px] uppercase tracking-widest text-slate-500">
            {LANG_LABEL[stream.language]}
          </p>
        </div>
        {stream.channelUrl && (
          <a
            href={stream.channelUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 items-center gap-1 rounded-md border border-white/15 bg-white/5 px-2 py-1 text-[10px] font-black uppercase tracking-widest text-white hover:bg-white/10"
          >
            Channel <ExternalLink className="h-3 w-3" />
          </a>
        )}
      </div>
    </article>
  );
}

function NewspaperCard({ paper }: { paper: NewspaperSource }) {
  return (
    <a
      href={paper.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-start justify-between gap-3 rounded-xl border border-white/10 bg-slate-950/40 p-3 hover:border-white/30 hover:bg-slate-950/70"
    >
      <div className="min-w-0">
        <p className="truncate text-sm font-bold text-white group-hover:text-sky-200">{paper.name}</p>
        {paper.blurb && <p className="mt-0.5 text-[11px] leading-5 text-slate-400">{paper.blurb}</p>}
        <p className="mt-1 text-[10px] uppercase tracking-widest text-slate-500">{LANG_LABEL[paper.language]}</p>
      </div>
      <ExternalLink className="mt-0.5 h-4 w-4 shrink-0 text-slate-500 group-hover:text-sky-300" />
    </a>
  );
}

function HeadlineCard({ item }: { item: NewsItem }) {
  return (
    <li className="flex h-full flex-col rounded-xl border border-white/10 bg-slate-950/40 p-3 transition hover:border-white/30 hover:bg-slate-950/70">
      <a
        href={item.link}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm font-bold leading-snug text-white hover:text-sky-200"
      >
        {item.title}
      </a>
      <div className="mt-auto flex items-center justify-between gap-2 pt-2 text-[10px] text-slate-500">
        <span className="truncate">{item.source ?? 'Google News'}</span>
        <span className="shrink-0">{timeAgo(item.publishedAt)}</span>
      </div>
    </li>
  );
}
