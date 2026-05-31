/**
 * News aggregation endpoint.
 *
 * Returns a JSON list of fresh headlines for a given country via Google News
 * RSS — a free, no-auth, CORS-blocked source we proxy here. Client components
 * cannot fetch the RSS directly because the browser blocks cross-origin XML
 * responses, so this route does the fetch + parse server-side and hands the
 * client a clean `NewsItem[]`.
 *
 * Query parameters:
 *   ?country=CM            ISO 3166-1 alpha-2 code (required). Selects the
 *                          Google News country edition (`gl=` and `ceid=`).
 *   ?lang=en|fr|pt|sw|ar   Language. Defaults to `en`. Selects `hl=` and the
 *                          language half of `ceid=`.
 *   ?q=<query>             Optional override of the country-name query.
 *                          Useful for a topic feed: `?country=CM&q=education`.
 *
 * Caching: marked `force-dynamic` so each tab change pulls fresh headlines.
 * The Edge runtime keeps cold-start latency low (~50ms) for the global
 * audience this hub targets.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getCountryByCode } from '@/lib/news/countries';
import type { NewsFeedResponse, NewsItem, Language } from '@/lib/news/types';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

const VALID_LANGS: Language[] = ['en', 'fr', 'pt', 'sw', 'ar'];

/** Decode the small set of HTML entities Google News emits in titles. */
function decodeEntities(input: string): string {
  return input
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/&nbsp;/g, ' ');
}

/** Strip XML tags but keep inner text. */
function stripTags(input: string): string {
  return input.replace(/<[^>]+>/g, '').trim();
}

/** Pull the inner text of a tag using a non-greedy regex. */
function takeTag(xml: string, tag: string): string | undefined {
  const m = xml.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i'));
  return m ? m[1] : undefined;
}

function parseRss(xml: string): NewsItem[] {
  const items: NewsItem[] = [];
  // Iterate <item>…</item> blocks. Regex is bounded by `<item>` to a
  // matching `</item>` — Google News RSS doesn't nest items so this is safe.
  const itemRe = /<item>([\s\S]*?)<\/item>/g;
  let match: RegExpExecArray | null;
  let idx = 0;
  while ((match = itemRe.exec(xml)) !== null) {
    const block = match[1];
    const rawTitle = takeTag(block, 'title') ?? '';
    const link = takeTag(block, 'link') ?? '';
    const pubDate = takeTag(block, 'pubDate');
    const source = takeTag(block, 'source');
    const description = takeTag(block, 'description') ?? '';
    // The Google News description embeds the first thumbnail in
    // `<img src="…">`. Extract it as a friendly hint.
    const imgMatch = description.match(/<img[^>]+src=["']([^"']+)["']/i);
    items.push({
      id: `gn-${idx++}-${match.index}`,
      title: decodeEntities(stripTags(rawTitle)),
      link: stripTags(link),
      source: source ? decodeEntities(stripTags(source)) : undefined,
      publishedAt: pubDate?.trim(),
      image: imgMatch?.[1],
    });
  }
  return items;
}

export async function GET(req: NextRequest): Promise<NextResponse> {
  const url = new URL(req.url);
  const countryCode = (url.searchParams.get('country') ?? '').toUpperCase();
  const langParam = (url.searchParams.get('lang') ?? '').toLowerCase() as Language;
  const queryOverride = url.searchParams.get('q');

  const country = getCountryByCode(countryCode);
  if (!country) {
    return NextResponse.json(
      {
        country: countryCode,
        language: 'en',
        items: [],
        fetchedAt: new Date().toISOString(),
        error: `Unknown country code "${countryCode}".`,
      } satisfies NewsFeedResponse,
      { status: 400 },
    );
  }

  const language: Language = VALID_LANGS.includes(langParam)
    ? langParam
    : country.defaultLanguage;
  const query = queryOverride?.trim() || country.name;
  const hl = `${language}-${country.code}`;
  const ceid = `${country.code}:${language}`;
  const rssUrl =
    `https://news.google.com/rss/search?q=${encodeURIComponent(query)}` +
    `&hl=${encodeURIComponent(hl)}` +
    `&gl=${encodeURIComponent(country.code)}` +
    `&ceid=${encodeURIComponent(ceid)}`;

  try {
    const res = await fetch(rssUrl, {
      // 10-minute fetch timeout via AbortController would be nicer but
      // edge runtime fetches abort on platform-level timeouts already.
      headers: { 'User-Agent': 'EIS-Learning-Studio/1.0 (+news-hub)' },
      cache: 'no-store',
    });
    if (!res.ok) {
      return NextResponse.json(
        {
          country: country.code,
          language,
          items: [],
          fetchedAt: new Date().toISOString(),
          error: `Google News returned ${res.status}`,
        } satisfies NewsFeedResponse,
        { status: 502 },
      );
    }
    const xml = await res.text();
    const items = parseRss(xml).slice(0, 30);
    return NextResponse.json(
      {
        country: country.code,
        language,
        items,
        fetchedAt: new Date().toISOString(),
      } satisfies NewsFeedResponse,
      { status: 200 },
    );
  } catch (err) {
    return NextResponse.json(
      {
        country: country.code,
        language,
        items: [],
        fetchedAt: new Date().toISOString(),
        error: err instanceof Error ? err.message : 'Unknown fetch error',
      } satisfies NewsFeedResponse,
      { status: 502 },
    );
  }
}
