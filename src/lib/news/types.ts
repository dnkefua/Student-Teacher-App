// News hub — shared types.
//
// A `NewsCountry` is a curated catalogue of free, openly-accessible
// sources for one African country: newspaper / online publications,
// embeddable YouTube live broadcasts, and a Google News RSS query the
// `/api/news` route uses to aggregate fresh headlines.

export type Language = 'en' | 'fr' | 'pt' | 'sw' | 'ar';

export type NewspaperSource = {
  id: string;
  name: string;
  /** Public homepage. Always opened in a new tab. */
  url: string;
  /** Optional logo URL (external https — Next/Image is bypassed). */
  logo?: string;
  language: Language;
  /** One-line description shown on the source card. */
  blurb?: string;
};

export type BroadcastStream = {
  id: string;
  name: string;
  language: Language;
  /** YouTube channel id (UC…) — used for `youtube.com/embed/live_stream?channel=…`. */
  youtubeChannelId?: string;
  /** YouTube channel handle URL fallback (link-out when no live broadcast). */
  channelUrl?: string;
  /** A specific video / playlist embed for canned daily-news playback. */
  embedUrl?: string;
  blurb?: string;
};

export type NewsCountry = {
  /** ISO 3166-1 alpha-2 country code (e.g. CM, NG, KE). */
  code: string;
  name: string;
  flag: string;
  /** Languages that have meaningful news coverage in this country. */
  languages: Language[];
  /** Default Google News RSS edition language (matches `hl=` and `ceid=`). */
  defaultLanguage: Language;
  newspapers: NewspaperSource[];
  broadcasts: BroadcastStream[];
};

export type NewsItem = {
  id: string;
  title: string;
  link: string;
  source?: string;
  publishedAt?: string;
  /** First image / favicon hint when present in the feed. */
  image?: string;
};

export type NewsFeedResponse = {
  country: string;
  language: Language;
  items: NewsItem[];
  fetchedAt: string;
  error?: string;
};
