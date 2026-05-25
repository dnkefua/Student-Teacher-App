/**
 * Teacher's student roster + invite tokens.
 *
 * Single localStorage record holds two things:
 *
 *   • `students`   — every student ever invited or joined (idempotent by
 *                    email, lower-cased).
 *   • `invites`    — outstanding invite tokens with the email they were
 *                    issued to.
 *
 * When a student opens an `/?invite=<token>` link, the app calls
 * acceptInvite(token, role) which:
 *   1. Finds the invite by token.
 *   2. Updates the matching student's status → 'joined' + joinedAt.
 *   3. Marks the invite consumed.
 *   4. Returns the student so the caller can display a welcome.
 *
 * No Firebase here — the demo runs entirely client-side. The same API
 * shape will swap to Firestore when the school wants cross-device sync.
 */

const STORAGE_KEY = 'eis-roster-v1';
const EVENT_NAME = 'eis-roster-changed';

export type RosterStudent = {
  id: string;
  email: string;
  /** Display name. Defaults to the email local-part until the student fills it in. */
  name: string;
  status: 'invited' | 'joined';
  invitedAt: string;
  joinedAt?: string;
  /** True when the teacher pulls this student into the active live class. */
  inLiveClass?: boolean;
};

export type Invite = {
  token: string;
  email: string;
  createdAt: string;
  consumedAt?: string;
};

type Store = { students: RosterStudent[]; invites: Invite[] };
const empty: Store = { students: [], invites: [] };

// Cached, stable snapshots for useSyncExternalStore consumers. React
// requires the getSnapshot function to return a referentially-stable
// value until the store actually changes — otherwise the reconciler
// loops and throws "Maximum update depth exceeded", which on the
// client surfaces as the dreaded "Application error: a client-side
// exception has occurred".
let cachedStudents: RosterStudent[] = [];
let cachedInvites: Invite[] = [];
let cacheLoaded = false;

function refreshCache() {
  const s = read();
  cachedStudents = s.students
    .slice()
    .sort((a, b) => a.invitedAt.localeCompare(b.invitedAt));
  cachedInvites = s.invites.slice();
  cacheLoaded = true;
}

function read(): Store {
  if (typeof window === 'undefined') return empty;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return empty;
    const p = JSON.parse(raw);
    return {
      students: Array.isArray(p.students) ? p.students : [],
      invites: Array.isArray(p.invites) ? p.invites : [],
    };
  } catch {
    return empty;
  }
}

function write(store: Store) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  // Refresh the snapshot cache BEFORE firing the change event so listeners
  // synchronously read the new data from the cached references.
  refreshCache();
  window.dispatchEvent(new CustomEvent(EVENT_NAME));
}

// ── short, URL-safe token (no extra dep) ─────────────────────────────
function token(): string {
  const t = Date.now().toString(36);
  const r = Math.random().toString(36).slice(2, 10);
  return `${t}${r}`;
}

function emailToName(email: string): string {
  const local = email.split('@')[0] || email;
  return local
    .replace(/[._-]+/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

// ── Public API ───────────────────────────────────────────────────────

export function listStudents(): RosterStudent[] {
  if (!cacheLoaded) refreshCache();
  return cachedStudents;
}

export function listInvites(): Invite[] {
  if (!cacheLoaded) refreshCache();
  return cachedInvites;
}

/**
 * Create-or-refresh an invite for `email`. If the email already has an
 * outstanding student record we don't duplicate — we just issue a fresh
 * token they can use to re-join.
 */
export function inviteStudent(emailRaw: string): { student: RosterStudent; invite: Invite } | { error: string } {
  const email = emailRaw.trim().toLowerCase();
  if (!email) return { error: 'Email is empty.' };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { error: 'That doesn\'t look like a valid email.' };

  const store = read();
  let student = store.students.find((s) => s.email === email);
  if (!student) {
    student = {
      id: `student-${token()}`,
      email,
      name: emailToName(email),
      status: 'invited',
      invitedAt: new Date().toISOString(),
    };
    store.students = [student, ...store.students];
  }
  const invite: Invite = {
    token: token(),
    email,
    createdAt: new Date().toISOString(),
  };
  store.invites = [invite, ...store.invites];
  write(store);
  return { student, invite };
}

/**
 * Build the absolute URL the teacher pastes into an email.
 * Falls back to a relative URL when called server-side.
 */
export function buildInviteUrl(invite: Invite): string {
  if (typeof window === 'undefined') return `/?invite=${invite.token}`;
  const u = new URL(window.location.origin);
  u.pathname = '/';
  u.searchParams.set('invite', invite.token);
  return u.toString();
}

/**
 * Compose a friendly `mailto:` link that opens the teacher's email
 * client with a pre-filled subject + body containing the invite URL.
 */
export function buildMailtoUrl(invite: Invite, teacherName?: string): string {
  const url = buildInviteUrl(invite);
  const subject = encodeURIComponent('You\'re invited to the EIS Learning Studio');
  const body = encodeURIComponent(
    `Hi,\n\n${teacherName ? `${teacherName} has invited` : 'You\'ve been invited'} you to join the EIS Learning Studio.\n\n` +
      `Click this link to open your student dashboard:\n${url}\n\n` +
      `Once you open the link, your account will be activated and you'll see your assignments, lessons and live classes automatically.\n\n` +
      `See you in class!`,
  );
  return `mailto:${invite.email}?subject=${subject}&body=${body}`;
}

/**
 * Consume an invite token (called when the student lands on the invite
 * URL). Marks the student joined; returns null if the token is unknown
 * or already consumed.
 */
export function acceptInvite(token: string): RosterStudent | null {
  if (!token) return null;
  const store = read();
  const invite = store.invites.find((i) => i.token === token);
  if (!invite) return null;
  if (invite.consumedAt) {
    // Already consumed — but still return the student so refreshes work.
    return store.students.find((s) => s.email === invite.email) || null;
  }
  invite.consumedAt = new Date().toISOString();
  const student = store.students.find((s) => s.email === invite.email);
  if (student) {
    student.status = 'joined';
    student.joinedAt = new Date().toISOString();
  }
  write(store);
  return student || null;
}

/**
 * Pull / drop a student into the current live class. Stored on the
 * roster record so the VirtualClassroom can display them.
 */
export function setInLiveClass(studentId: string, inLive: boolean) {
  const store = read();
  const s = store.students.find((x) => x.id === studentId);
  if (!s) return;
  s.inLiveClass = inLive;
  write(store);
}

export function removeStudent(studentId: string) {
  const store = read();
  store.students = store.students.filter((s) => s.id !== studentId);
  // Drop any outstanding invites for that email too.
  const removed = store.students.find((s) => s.id === studentId);
  if (removed) {
    store.invites = store.invites.filter((i) => i.email !== removed.email);
  }
  write(store);
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
