// Curated catalogue of African news sources, country-by-country.
//
// Coverage philosophy:
//   - Every entry must be freely accessible (no paywall) and legal to
//     link to. We never re-host content — newspapers open in a new tab,
//     broadcasts embed YouTube's public live-stream player.
//   - YouTube channel IDs power the embeddable `live_stream` iframe.
//     When a channel isn't live the iframe renders YouTube's standard
//     "no broadcast" card — that's the expected fallback. We always
//     also surface `channelUrl` so users can open the channel directly.
//   - Cameroon is the launch country and is the most fully populated.
//     Other countries ship with at least one anchor newspaper + one
//     broadcaster. Contributions welcome.

import type { NewsCountry } from './types';

export const COUNTRIES: NewsCountry[] = [
  // ───────────── Cameroon ─────────────
  {
    code: 'CM',
    name: 'Cameroon',
    flag: '🇨🇲',
    languages: ['fr', 'en'],
    defaultLanguage: 'fr',
    newspapers: [
      {
        id: 'cm-cameroon-tribune',
        name: 'Cameroon Tribune',
        url: 'https://www.cameroon-tribune.cm/',
        language: 'fr',
        blurb: 'State-owned daily of record — politics, government, economy.',
      },
      {
        id: 'cm-journal-du-cameroun',
        name: 'Journal du Cameroun',
        url: 'https://www.journalducameroun.com/',
        language: 'fr',
        blurb: 'Bilingual independent digital newsroom.',
      },
      {
        id: 'cm-business-in-cameroon',
        name: 'Business in Cameroon',
        url: 'https://www.businessincameroon.com/',
        language: 'en',
        blurb: 'Economy, finance and industry coverage.',
      },
      {
        id: 'cm-crtv',
        name: 'CRTV',
        url: 'https://www.crtv.cm/',
        language: 'en',
        blurb: 'Cameroon Radio Television — national public broadcaster.',
      },
      {
        id: 'cm-237online',
        name: '237online',
        url: 'https://www.237online.com/',
        language: 'fr',
        blurb: 'Aggregator of Cameroonian press headlines.',
      },
      {
        id: 'cm-le-jour',
        name: 'Le Jour',
        url: 'https://lejour.cm/',
        language: 'fr',
        blurb: 'Independent national daily.',
      },
      {
        id: 'cm-cameroon-news-agency',
        name: 'Cameroon News Agency',
        url: 'https://cameroonnewsagency.com/',
        language: 'en',
        blurb: 'Anglophone-focused independent newsroom.',
      },
      {
        id: 'cm-investir-au-cameroun',
        name: 'Investir au Cameroun',
        url: 'https://www.investiraucameroun.com/',
        language: 'fr',
        blurb: 'Économie, investissement et industrie.',
      },
    ],
    broadcasts: [
      {
        id: 'cm-crtv-web',
        name: 'CRTV Web',
        language: 'fr',
        youtubeChannelId: 'UC8d5_2OQYBxAhRMjSwcRDDA',
        channelUrl: 'https://www.youtube.com/@CRTVweb',
        blurb: 'Public broadcaster — bilingual news, prime-time bulletin.',
      },
      {
        id: 'cm-equinoxe-tv',
        name: 'Equinoxe TV',
        language: 'fr',
        channelUrl: 'https://www.youtube.com/@EquinoxeTV',
        blurb: 'Private broadcaster — flagship 8 p.m. bulletin.',
      },
      {
        id: 'cm-canal2-international',
        name: 'Canal 2 International',
        language: 'fr',
        channelUrl: 'https://www.youtube.com/@Canal2International',
        blurb: '24-hour bilingual news and current affairs.',
      },
      {
        id: 'cm-stv',
        name: 'STV Cameroon',
        language: 'fr',
        channelUrl: 'https://www.youtube.com/@stvcameroon',
        blurb: 'Spectrum Television — news and analysis.',
      },
      {
        id: 'cm-vision4',
        name: 'Vision 4',
        language: 'fr',
        channelUrl: 'https://www.youtube.com/@Vision4Television',
        blurb: 'National news and talk shows.',
      },
    ],
  },

  // ───────────── Nigeria ─────────────
  {
    code: 'NG',
    name: 'Nigeria',
    flag: '🇳🇬',
    languages: ['en'],
    defaultLanguage: 'en',
    newspapers: [
      { id: 'ng-punch', name: 'The Punch', url: 'https://punchng.com/', language: 'en', blurb: 'High-circulation independent daily.' },
      { id: 'ng-premium-times', name: 'Premium Times', url: 'https://www.premiumtimesng.com/', language: 'en', blurb: 'Investigative journalism.' },
      { id: 'ng-vanguard', name: 'Vanguard', url: 'https://www.vanguardngr.com/', language: 'en', blurb: 'National daily — politics & economy.' },
      { id: 'ng-thisday', name: 'ThisDay', url: 'https://www.thisdaylive.com/', language: 'en', blurb: 'Business, politics, analysis.' },
      { id: 'ng-guardian', name: 'The Guardian Nigeria', url: 'https://guardian.ng/', language: 'en' },
    ],
    broadcasts: [
      { id: 'ng-channels', name: 'Channels Television', language: 'en', channelUrl: 'https://www.youtube.com/@channelstelevision', blurb: 'Independent 24-hour news.' },
      { id: 'ng-arise', name: 'Arise News', language: 'en', channelUrl: 'https://www.youtube.com/@arisenews', blurb: 'International Nigerian news network.' },
      { id: 'ng-tvc', name: 'TVC News', language: 'en', channelUrl: 'https://www.youtube.com/@TVCNewsNigeria' },
      { id: 'ng-nta', name: 'NTA Network', language: 'en', channelUrl: 'https://www.youtube.com/@NTANetwork', blurb: 'Public broadcaster.' },
    ],
  },

  // ───────────── Kenya ─────────────
  {
    code: 'KE',
    name: 'Kenya',
    flag: '🇰🇪',
    languages: ['en', 'sw'],
    defaultLanguage: 'en',
    newspapers: [
      { id: 'ke-daily-nation', name: 'Daily Nation', url: 'https://nation.africa/kenya', language: 'en', blurb: 'Largest East African daily.' },
      { id: 'ke-standard', name: 'The Standard', url: 'https://www.standardmedia.co.ke/', language: 'en' },
      { id: 'ke-star', name: 'The Star', url: 'https://www.the-star.co.ke/', language: 'en' },
      { id: 'ke-citizen', name: 'Citizen Digital', url: 'https://www.citizen.digital/', language: 'en' },
    ],
    broadcasts: [
      { id: 'ke-citizen-tv', name: 'Citizen TV', language: 'en', channelUrl: 'https://www.youtube.com/@citizentvkenya' },
      { id: 'ke-ntv', name: 'NTV Kenya', language: 'en', channelUrl: 'https://www.youtube.com/@NTVKenya' },
      { id: 'ke-ktn', name: 'KTN News', language: 'en', channelUrl: 'https://www.youtube.com/@KTNNewsKenya' },
      { id: 'ke-k24', name: 'K24 TV', language: 'en', channelUrl: 'https://www.youtube.com/@K24Tv' },
    ],
  },

  // ───────────── South Africa ─────────────
  {
    code: 'ZA',
    name: 'South Africa',
    flag: '🇿🇦',
    languages: ['en'],
    defaultLanguage: 'en',
    newspapers: [
      { id: 'za-news24', name: 'News24', url: 'https://www.news24.com/', language: 'en' },
      { id: 'za-iol', name: 'IOL', url: 'https://www.iol.co.za/', language: 'en' },
      { id: 'za-mg', name: 'Mail & Guardian', url: 'https://mg.co.za/', language: 'en', blurb: 'Investigative weekly.' },
      { id: 'za-dm', name: 'Daily Maverick', url: 'https://www.dailymaverick.co.za/', language: 'en' },
    ],
    broadcasts: [
      { id: 'za-sabc', name: 'SABC News', language: 'en', channelUrl: 'https://www.youtube.com/@SABCNews', blurb: 'Public broadcaster.' },
      { id: 'za-enca', name: 'eNCA', language: 'en', channelUrl: 'https://www.youtube.com/@eNCAnews' },
      { id: 'za-newzroom', name: 'Newzroom Afrika', language: 'en', channelUrl: 'https://www.youtube.com/@NewzroomAfrika405' },
    ],
  },

  // ───────────── Ghana ─────────────
  {
    code: 'GH',
    name: 'Ghana',
    flag: '🇬🇭',
    languages: ['en'],
    defaultLanguage: 'en',
    newspapers: [
      { id: 'gh-graphic', name: 'Daily Graphic', url: 'https://www.graphic.com.gh/', language: 'en', blurb: 'State-owned daily of record.' },
      { id: 'gh-citi', name: 'Citi Newsroom', url: 'https://citinewsroom.com/', language: 'en' },
      { id: 'gh-myjoy', name: 'MyJoyOnline', url: 'https://www.myjoyonline.com/', language: 'en' },
    ],
    broadcasts: [
      { id: 'gh-gtv', name: 'GTV (GBC)', language: 'en', channelUrl: 'https://www.youtube.com/@GhanaBroadcastingCorporation', blurb: 'Public broadcaster.' },
      { id: 'gh-joynews', name: 'JoyNews', language: 'en', channelUrl: 'https://www.youtube.com/@JoyNews' },
      { id: 'gh-gh-one', name: 'GhOne TV', language: 'en', channelUrl: 'https://www.youtube.com/@GhOneTV' },
    ],
  },

  // ───────────── Egypt ─────────────
  {
    code: 'EG',
    name: 'Egypt',
    flag: '🇪🇬',
    languages: ['ar', 'en'],
    defaultLanguage: 'en',
    newspapers: [
      { id: 'eg-ahram', name: 'Al-Ahram', url: 'https://english.ahram.org.eg/', language: 'en', blurb: 'Daily of record (English edition).' },
      { id: 'eg-egypt-today', name: 'Egypt Today', url: 'https://www.egypttoday.com/', language: 'en' },
      { id: 'eg-mada-masr', name: 'Mada Masr', url: 'https://www.madamasr.com/en/', language: 'en', blurb: 'Independent investigative journalism.' },
    ],
    broadcasts: [
      { id: 'eg-nile-tv', name: 'Nile TV International', language: 'en', channelUrl: 'https://www.youtube.com/@NileTVInt' },
      { id: 'eg-extranews', name: 'Extra News', language: 'ar', channelUrl: 'https://www.youtube.com/@ExtraNewsEG' },
    ],
  },

  // ───────────── Morocco ─────────────
  {
    code: 'MA',
    name: 'Morocco',
    flag: '🇲🇦',
    languages: ['fr', 'ar'],
    defaultLanguage: 'fr',
    newspapers: [
      { id: 'ma-le360', name: 'Le360', url: 'https://fr.le360.ma/', language: 'fr' },
      { id: 'ma-tel-quel', name: 'TelQuel', url: 'https://telquel.ma/', language: 'fr' },
      { id: 'ma-hespress', name: 'Hespress EN', url: 'https://en.hespress.com/', language: 'en' },
    ],
    broadcasts: [
      { id: 'ma-2m', name: '2M', language: 'fr', channelUrl: 'https://www.youtube.com/@2MMaroc' },
      { id: 'ma-medi1', name: 'Medi1 TV', language: 'fr', channelUrl: 'https://www.youtube.com/@Medi1TV' },
    ],
  },

  // ───────────── Senegal ─────────────
  {
    code: 'SN',
    name: 'Senegal',
    flag: '🇸🇳',
    languages: ['fr'],
    defaultLanguage: 'fr',
    newspapers: [
      { id: 'sn-le-soleil', name: 'Le Soleil', url: 'https://lesoleil.sn/', language: 'fr', blurb: 'Quotidien national.' },
      { id: 'sn-seneweb', name: 'Seneweb', url: 'https://www.seneweb.com/', language: 'fr' },
    ],
    broadcasts: [
      { id: 'sn-rts', name: 'RTS1', language: 'fr', channelUrl: 'https://www.youtube.com/@RTS1' },
      { id: 'sn-tfm', name: 'TFM', language: 'fr', channelUrl: 'https://www.youtube.com/@tfmofficiel' },
    ],
  },

  // ───────────── Côte d'Ivoire ─────────────
  {
    code: 'CI',
    name: "Côte d'Ivoire",
    flag: '🇨🇮',
    languages: ['fr'],
    defaultLanguage: 'fr',
    newspapers: [
      { id: 'ci-fraternite-matin', name: 'Fraternité Matin', url: 'https://www.fratmat.info/', language: 'fr', blurb: 'Quotidien gouvernemental.' },
      { id: 'ci-abidjan-net', name: 'Abidjan.net', url: 'https://news.abidjan.net/', language: 'fr' },
    ],
    broadcasts: [
      { id: 'ci-rti', name: 'RTI Officiel', language: 'fr', channelUrl: 'https://www.youtube.com/@RTIOfficiel', blurb: 'Diffuseur public.' },
      { id: 'ci-7info', name: '7info', language: 'fr', channelUrl: 'https://www.youtube.com/@7info' },
    ],
  },

  // ───────────── Ethiopia ─────────────
  {
    code: 'ET',
    name: 'Ethiopia',
    flag: '🇪🇹',
    languages: ['en'],
    defaultLanguage: 'en',
    newspapers: [
      { id: 'et-reporter', name: 'The Reporter Ethiopia', url: 'https://www.thereporterethiopia.com/', language: 'en' },
      { id: 'et-addis-standard', name: 'Addis Standard', url: 'https://addisstandard.com/', language: 'en' },
    ],
    broadcasts: [
      { id: 'et-ebc', name: 'EBC News', language: 'en', channelUrl: 'https://www.youtube.com/@ebcnews', blurb: 'Ethiopian Broadcasting Corporation.' },
    ],
  },

  // ───────────── Tanzania ─────────────
  {
    code: 'TZ',
    name: 'Tanzania',
    flag: '🇹🇿',
    languages: ['en', 'sw'],
    defaultLanguage: 'en',
    newspapers: [
      { id: 'tz-daily-news', name: 'Daily News', url: 'https://dailynews.co.tz/', language: 'en' },
      { id: 'tz-citizen', name: 'The Citizen', url: 'https://www.thecitizen.co.tz/', language: 'en' },
    ],
    broadcasts: [
      { id: 'tz-tbc', name: 'TBC1', language: 'sw', channelUrl: 'https://www.youtube.com/@tbconline' },
    ],
  },

  // ───────────── Uganda ─────────────
  {
    code: 'UG',
    name: 'Uganda',
    flag: '🇺🇬',
    languages: ['en'],
    defaultLanguage: 'en',
    newspapers: [
      { id: 'ug-monitor', name: 'Daily Monitor', url: 'https://www.monitor.co.ug/', language: 'en' },
      { id: 'ug-new-vision', name: 'New Vision', url: 'https://www.newvision.co.ug/', language: 'en' },
    ],
    broadcasts: [
      { id: 'ug-ntv', name: 'NTV Uganda', language: 'en', channelUrl: 'https://www.youtube.com/@NTVUganda' },
      { id: 'ug-nbs', name: 'NBS Television', language: 'en', channelUrl: 'https://www.youtube.com/@NBSTVUganda' },
    ],
  },

  // ───────────── Rwanda ─────────────
  {
    code: 'RW',
    name: 'Rwanda',
    flag: '🇷🇼',
    languages: ['en'],
    defaultLanguage: 'en',
    newspapers: [
      { id: 'rw-new-times', name: 'The New Times', url: 'https://www.newtimes.co.rw/', language: 'en' },
    ],
    broadcasts: [
      { id: 'rw-rbatv', name: 'RBA TV', language: 'en', channelUrl: 'https://www.youtube.com/@RBATV', blurb: 'Public broadcaster.' },
    ],
  },

  // ───────────── DR Congo ─────────────
  {
    code: 'CD',
    name: 'DR Congo',
    flag: '🇨🇩',
    languages: ['fr'],
    defaultLanguage: 'fr',
    newspapers: [
      { id: 'cd-radio-okapi', name: 'Radio Okapi', url: 'https://www.radiookapi.net/', language: 'fr', blurb: 'UN-backed national radio.' },
      { id: 'cd-actualite-cd', name: 'Actualité.cd', url: 'https://actualite.cd/', language: 'fr' },
    ],
    broadcasts: [
      { id: 'cd-rtnc', name: 'RTNC', language: 'fr', channelUrl: 'https://www.youtube.com/@RTNCKINSHASA' },
    ],
  },

  // ───────────── Algeria ─────────────
  {
    code: 'DZ',
    name: 'Algeria',
    flag: '🇩🇿',
    languages: ['fr', 'ar'],
    defaultLanguage: 'fr',
    newspapers: [
      { id: 'dz-el-watan', name: 'El Watan', url: 'https://www.elwatan-dz.com/', language: 'fr' },
      { id: 'dz-tsa', name: 'TSA Algérie', url: 'https://www.tsa-algerie.com/', language: 'fr' },
    ],
    broadcasts: [
      { id: 'dz-ennahar', name: 'Ennahar TV', language: 'ar', channelUrl: 'https://www.youtube.com/@EnnaharTVOfficiel' },
    ],
  },

  // ───────────── Tunisia ─────────────
  {
    code: 'TN',
    name: 'Tunisia',
    flag: '🇹🇳',
    languages: ['fr', 'ar'],
    defaultLanguage: 'fr',
    newspapers: [
      { id: 'tn-la-presse', name: 'La Presse de Tunisie', url: 'https://lapresse.tn/', language: 'fr' },
      { id: 'tn-businessnews', name: 'Business News', url: 'https://www.businessnews.com.tn/', language: 'fr' },
    ],
    broadcasts: [
      { id: 'tn-watania', name: 'Watania 1', language: 'ar', channelUrl: 'https://www.youtube.com/@watanya1' },
    ],
  },

  // ───────────── Angola ─────────────
  {
    code: 'AO',
    name: 'Angola',
    flag: '🇦🇴',
    languages: ['pt'],
    defaultLanguage: 'pt',
    newspapers: [
      { id: 'ao-jornal-de-angola', name: 'Jornal de Angola', url: 'https://www.jornaldeangola.ao/', language: 'pt' },
    ],
    broadcasts: [
      { id: 'ao-tpa', name: 'TPA Online', language: 'pt', channelUrl: 'https://www.youtube.com/@TPAOnline', blurb: 'Public broadcaster.' },
    ],
  },

  // ───────────── Mozambique ─────────────
  {
    code: 'MZ',
    name: 'Mozambique',
    flag: '🇲🇿',
    languages: ['pt'],
    defaultLanguage: 'pt',
    newspapers: [
      { id: 'mz-noticias', name: 'Notícias', url: 'https://www.jornalnoticias.co.mz/', language: 'pt' },
    ],
    broadcasts: [
      { id: 'mz-tvm', name: 'TVM', language: 'pt', channelUrl: 'https://www.youtube.com/@TVMmocambique' },
    ],
  },

  // ───────────── Zimbabwe ─────────────
  {
    code: 'ZW',
    name: 'Zimbabwe',
    flag: '🇿🇼',
    languages: ['en'],
    defaultLanguage: 'en',
    newspapers: [
      { id: 'zw-herald', name: 'The Herald', url: 'https://www.herald.co.zw/', language: 'en' },
      { id: 'zw-newsday', name: 'NewsDay Zimbabwe', url: 'https://www.newsday.co.zw/', language: 'en' },
    ],
    broadcasts: [
      { id: 'zw-zbc', name: 'ZBC News', language: 'en', channelUrl: 'https://www.youtube.com/@zbcnewsonline' },
    ],
  },

  // ───────────── Zambia ─────────────
  {
    code: 'ZM',
    name: 'Zambia',
    flag: '🇿🇲',
    languages: ['en'],
    defaultLanguage: 'en',
    newspapers: [
      { id: 'zm-lusaka-times', name: 'Lusaka Times', url: 'https://www.lusakatimes.com/', language: 'en' },
    ],
    broadcasts: [
      { id: 'zm-znbc', name: 'ZNBC TV1', language: 'en', channelUrl: 'https://www.youtube.com/@znbcdigital' },
    ],
  },

  // ───────────── Botswana ─────────────
  {
    code: 'BW',
    name: 'Botswana',
    flag: '🇧🇼',
    languages: ['en'],
    defaultLanguage: 'en',
    newspapers: [
      { id: 'bw-mmegi', name: 'Mmegi Online', url: 'https://www.mmegi.bw/', language: 'en' },
    ],
    broadcasts: [
      { id: 'bw-btv', name: 'Btv News', language: 'en', channelUrl: 'https://www.youtube.com/@BtvNewsOnline' },
    ],
  },

  // ───────────── Namibia ─────────────
  {
    code: 'NA',
    name: 'Namibia',
    flag: '🇳🇦',
    languages: ['en'],
    defaultLanguage: 'en',
    newspapers: [
      { id: 'na-the-namibian', name: 'The Namibian', url: 'https://www.namibian.com.na/', language: 'en' },
    ],
    broadcasts: [
      { id: 'na-nbc', name: 'NBC Digital News', language: 'en', channelUrl: 'https://www.youtube.com/@NBCDigitalNewsNamibia' },
    ],
  },

  // ───────────── Mali / Burkina / Niger (Sahel) ─────────────
  {
    code: 'ML',
    name: 'Mali',
    flag: '🇲🇱',
    languages: ['fr'],
    defaultLanguage: 'fr',
    newspapers: [
      { id: 'ml-essor', name: "L'Essor", url: 'https://www.lessor.ml/', language: 'fr' },
      { id: 'ml-maliweb', name: 'Maliweb', url: 'https://www.maliweb.net/', language: 'fr' },
    ],
    broadcasts: [
      { id: 'ml-ortm', name: 'ORTM', language: 'fr', channelUrl: 'https://www.youtube.com/@ortmofficiel' },
    ],
  },
  {
    code: 'BF',
    name: 'Burkina Faso',
    flag: '🇧🇫',
    languages: ['fr'],
    defaultLanguage: 'fr',
    newspapers: [
      { id: 'bf-lefaso', name: 'Lefaso.net', url: 'https://lefaso.net/', language: 'fr' },
    ],
    broadcasts: [
      { id: 'bf-rtb', name: 'RTB Officiel', language: 'fr', channelUrl: 'https://www.youtube.com/@RTBOfficiel' },
    ],
  },
  {
    code: 'NE',
    name: 'Niger',
    flag: '🇳🇪',
    languages: ['fr'],
    defaultLanguage: 'fr',
    newspapers: [
      { id: 'ne-actuniger', name: 'ActuNiger', url: 'https://www.actuniger.com/', language: 'fr' },
    ],
    broadcasts: [
      { id: 'ne-tele-sahel', name: 'Télé Sahel', language: 'fr', channelUrl: 'https://www.youtube.com/@TeleSahel' },
    ],
  },

  // ───────────── Liberia, Sierra Leone, Gambia ─────────────
  {
    code: 'LR',
    name: 'Liberia',
    flag: '🇱🇷',
    languages: ['en'],
    defaultLanguage: 'en',
    newspapers: [
      { id: 'lr-front-page-africa', name: 'FrontPage Africa', url: 'https://frontpageafricaonline.com/', language: 'en' },
    ],
    broadcasts: [],
  },
  {
    code: 'SL',
    name: 'Sierra Leone',
    flag: '🇸🇱',
    languages: ['en'],
    defaultLanguage: 'en',
    newspapers: [
      { id: 'sl-awoko', name: 'Awoko Newspaper', url: 'https://awokonewspaper.sl/', language: 'en' },
    ],
    broadcasts: [],
  },
  {
    code: 'GM',
    name: 'Gambia',
    flag: '🇬🇲',
    languages: ['en'],
    defaultLanguage: 'en',
    newspapers: [
      { id: 'gm-the-point', name: 'The Point', url: 'https://thepoint.gm/', language: 'en' },
    ],
    broadcasts: [],
  },

  // ───────────── Sudan / South Sudan ─────────────
  {
    code: 'SD',
    name: 'Sudan',
    flag: '🇸🇩',
    languages: ['en', 'ar'],
    defaultLanguage: 'en',
    newspapers: [
      { id: 'sd-sudan-tribune', name: 'Sudan Tribune', url: 'https://sudantribune.com/', language: 'en' },
    ],
    broadcasts: [],
  },
  {
    code: 'SS',
    name: 'South Sudan',
    flag: '🇸🇸',
    languages: ['en'],
    defaultLanguage: 'en',
    newspapers: [
      { id: 'ss-eye-radio', name: 'Eye Radio', url: 'https://www.eyeradio.org/', language: 'en' },
    ],
    broadcasts: [],
  },
];

export function getCountryByCode(code: string): NewsCountry | undefined {
  return COUNTRIES.find((c) => c.code === code.toUpperCase());
}
