/**
 * Live-class session store.
 *
 * Each session is a scheduled online class with a unique token. The
 * teacher creates one, attaches students (by roster id) or a class
 * label (e.g. "8A"), and the platform generates a shareable URL of
 * the form
 *
 *     https://your-app.example/?session=<token>
 *
 * Anyone landing on that URL jumps straight into the Virtual
 * Classroom — students locked to student view, the teacher in
 * teacher view.
 *
 * Sessions persist in localStorage. The cached snapshot is stable
 * for useSyncExternalStore consumers.
 */

const STORAGE_KEY = 'eis-live-sessions-v1';
const EVENT_NAME = 'eis-live-sessions-changed';

export type LiveClassSession = {
  id: string;
  /** Short URL-safe token used in the share link. */
  token: string;
  title: string;
  subject?: 'math' | 'english' | 'science';
  /** ISO datetime. */
  startsAt: string;
  /** Minutes. */
  durationMin: number;
  /** Roster student ids invited to this session. */
  studentIds: string[];
  /** Optional class label like "8A" — for whole-class invites. */
  classLabel?: string;
  notes?: string;
  createdAt: string;
};

function read(): LiveClassSession[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

let cached: LiveClassSession[] = [];
let cacheLoaded = false;

function refreshCache() {
  cached = read()
    .slice()
    .sort((a, b) => a.startsAt.localeCompare(b.startsAt));
  cacheLoaded = true;
}

function write(next: LiveClassSession[]) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  refreshCache();
  window.dispatchEvent(new CustomEvent(EVENT_NAME));
}

function token(): string {
  const t = Date.now().toString(36);
  const r = Math.random().toString(36).slice(2, 10);
  return `${t}${r}`;
}

// ── Public API ───────────────────────────────────────────────────────

export function listSessions(): LiveClassSession[] {
  if (!cacheLoaded) refreshCache();
  return cached;
}

export function listUpcoming(): LiveClassSession[] {
  const now = Date.now();
  return listSessions().filter((s) => {
    const end = new Date(s.startsAt).getTime() + s.durationMin * 60_000;
    return end >= now;
  });
}

export function listPast(): LiveClassSession[] {
  const now = Date.now();
  return listSessions().filter((s) => {
    const end = new Date(s.startsAt).getTime() + s.durationMin * 60_000;
    return end < now;
  });
}

export function createSession(input: Omit<LiveClassSession, 'id' | 'token' | 'createdAt'>): LiveClassSession {
  const session: LiveClassSession = {
    ...input,
    id: `session-${token()}`,
    token: token(),
    createdAt: new Date().toISOString(),
  };
  const all = read();
  all.unshift(session);
  write(all);
  // Mirror to the legacy eis-class-link key so existing StudentDashboard
  // "Join live class" pills keep working out of the box.
  try {
    window.localStorage.setItem('eis-class-link', buildSessionUrl(session));
  } catch {
    /* ignore */
  }
  return session;
}

export function deleteSession(id: string) {
  write(read().filter((s) => s.id !== id));
}

export function getSession(token: string): LiveClassSession | undefined {
  return listSessions().find((s) => s.token === token);
}

/**
 * Build the absolute URL students click to join. Resolution order:
 *
 *   1. `NEXT_PUBLIC_PUBLIC_URL` — explicit env override. Use this for
 *      production so teachers running the app on `localhost:3000`
 *      still generate `https://your-app.example/?session=…` links
 *      that remote students can actually open.
 *   2. `window.location.origin` — the page the teacher is on. Works
 *      out of the box when the dev host *is* the student host (LAN
 *      demo, single-machine sessions).
 *   3. Relative `/` — SSR fallback only.
 */
function publicOrigin(): string | null {
  const env = process.env.NEXT_PUBLIC_PUBLIC_URL?.trim();
  if (env) return env.replace(/\/+$/, '');
  if (typeof window !== 'undefined') return window.location.origin;
  return null;
}

export function buildSessionUrl(session: LiveClassSession): string {
  const origin = publicOrigin();
  if (!origin) return `/?session=${session.token}`;
  const u = new URL(origin);
  u.pathname = '/';
  u.searchParams.set('session', session.token);
  return u.toString();
}

/** Compose a friendly mailto: that opens the teacher's email client. */
export function buildSessionMailto(
  session: LiveClassSession,
  recipients: string[],
  teacherName?: string,
): string {
  const url = buildSessionUrl(session);
  const subject = encodeURIComponent(`Live class: ${session.title}`);
  const when = new Date(session.startsAt).toLocaleString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
  const body = encodeURIComponent(
    `Hi,\n\n${teacherName ? teacherName : 'Your teacher'} has scheduled a live class:\n\n` +
      `   ${session.title}\n` +
      `   ${when} · ${session.durationMin} minutes\n\n` +
      `Click this link to join when class begins:\n${url}\n\n` +
      (session.notes ? `Notes from your teacher:\n${session.notes}\n\n` : '') +
      `See you in class!`,
  );
  return `mailto:${recipients.join(',')}?subject=${subject}&body=${body}`;
}

/** Plain-text invite message reused by all share channels (mailto,
 *  WhatsApp, SMS, copy-to-clipboard). Single source of truth so the
 *  wording stays consistent. */
export function buildSessionMessage(session: LiveClassSession, teacherName?: string): string {
  const url = buildSessionUrl(session);
  const when = new Date(session.startsAt).toLocaleString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
  return (
    `${teacherName ? teacherName : 'Your teacher'} has scheduled a live class:\n\n` +
    `   ${session.title}\n` +
    `   ${when} · ${session.durationMin} minutes\n\n` +
    `Tap to join when class begins:\n${url}` +
    (session.notes ? `\n\nNotes: ${session.notes}` : '')
  );
}

/** WhatsApp share URL — opens WhatsApp Web or the installed app. */
export function buildSessionWhatsAppUrl(session: LiveClassSession, teacherName?: string): string {
  const body = encodeURIComponent(buildSessionMessage(session, teacherName));
  return `https://wa.me/?text=${body}`;
}

/** SMS deep link. Mobile-only on iOS/Android; harmless on desktop. */
export function buildSessionSmsUrl(session: LiveClassSession, teacherName?: string): string {
  const body = encodeURIComponent(buildSessionMessage(session, teacherName));
  // `?` vs `&` body separator differs by platform; iOS accepts both.
  return `sms:?&body=${body}`;
}

/** Returns true if the session is happening right now (start … start+duration). */
export function isSessionLive(session: LiveClassSession): boolean {
  const start = new Date(session.startsAt).getTime();
  const end = start + session.durationMin * 60_000;
  const now = Date.now();
  return now >= start && now <= end;
}

/** Returns true within 15 minutes BEFORE start — used to enable the
 *  "Join class" button for students just before the bell rings. */
export function isSessionJoinable(session: LiveClassSession): boolean {
  const start = new Date(session.startsAt).getTime();
  const end = start + session.durationMin * 60_000;
  const now = Date.now();
  return now >= start - 15 * 60_000 && now <= end;
}

export function subscribe(listener: () => void): () => void {
  if (typeof window === 'undefined') return () => undefined;
  const handler = () => listener();
  window.addEventListener(EVENT_NAME, handler);
  window.addEventListener('storage', handler);
  return () => {
    window.removeEventListener(EVENT_NAME, handler);
    window.removeEventListener('storage', handler);
  };
}
