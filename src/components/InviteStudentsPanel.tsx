'use client';

import React, { useState, useSyncExternalStore } from 'react';
import {
  Check,
  Copy,
  GraduationCap,
  Mail,
  Send,
  Trash2,
  UserPlus,
  Users,
} from 'lucide-react';
import {
  type Invite,
  type RosterStudent,
  buildInviteUrl,
  buildMailtoUrl,
  inviteStudent,
  listInvites,
  listStudents,
  removeStudent,
  subscribe,
} from '@/lib/roster/rosterStore';

/**
 * Teacher's class roster panel.
 *
 * Two interlocking pieces:
 *   1. INVITE FORM — teacher pastes a student's school email, clicks
 *      Invite, the panel generates a unique link, opens the user's
 *      email client via mailto: with a pre-filled subject + body, and
 *      ALSO shows a copy-to-clipboard fallback for systems without a
 *      default mail handler.
 *   2. STUDENT LIST — every student ever invited, with a status pill
 *      (Invited / Joined), their email, and a Remove button.
 *
 * The roster is consumed by VirtualClassroom (replaces the fake demo
 * students) and by the LandingPage invite-redirect logic.
 */
export function InviteStudentsPanel() {
  // Subscribe to the roster store so this panel updates the second a
  // student opens their invite link in another tab.
  const students = useSyncExternalStore(subscribe, listStudents, () => [] as RosterStudent[]);
  const invites = useSyncExternalStore(subscribe, listInvites, () => [] as Invite[]);

  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [lastInvite, setLastInvite] = useState<Invite | null>(null);
  const [copied, setCopied] = useState(false);
  const [opened, setOpened] = useState(false);

  const onInvite = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setCopied(false);
    setOpened(false);
    const result = inviteStudent(email);
    if ('error' in result) {
      setError(result.error);
      return;
    }
    setLastInvite(result.invite);
    setEmail('');
  };

  const sendMail = () => {
    if (!lastInvite) return;
    window.location.href = buildMailtoUrl(lastInvite);
    setOpened(true);
    setTimeout(() => setOpened(false), 2000);
  };

  const copyLink = async () => {
    if (!lastInvite) return;
    try {
      await navigator.clipboard.writeText(buildInviteUrl(lastInvite));
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* ignore */
    }
  };

  const joinedCount = students.filter((s) => s.status === 'joined').length;
  const invitedCount = students.length - joinedCount;
  const pendingInvitesForLast = lastInvite
    ? invites.find((i) => i.token === lastInvite.token)
    : null;

  return (
    <section className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl sm:p-5">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <Users className="h-4 w-4 text-slate-300" />
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300">My students</p>
        <span className="ml-auto rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-bold text-emerald-300">
          {joinedCount} joined · {invitedCount} pending
        </span>
      </div>

      {/* Invite form */}
      <form onSubmit={onInvite} className="flex flex-col items-stretch gap-2 sm:flex-row">
        <div className="relative min-w-0 flex-1">
          <Mail className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-500" />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="student@eis.ae"
            className="w-full rounded-md border border-white/10 bg-slate-950/60 py-2 pl-9 pr-3 text-xs text-white placeholder:text-slate-600 outline-none focus:border-sky-400"
          />
        </div>
        <button
          type="submit"
          className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-md bg-sky-500 px-3 py-2 text-xs font-black text-white shadow-md transition hover:bg-sky-400"
        >
          <UserPlus className="h-3.5 w-3.5" />
          Invite
        </button>
      </form>
      {error && (
        <p className="mt-2 rounded-md bg-red-500/15 px-2.5 py-1.5 text-[11px] font-bold text-red-300">
          {error}
        </p>
      )}

      {/* Last invite — actions */}
      {lastInvite && pendingInvitesForLast && !pendingInvitesForLast.consumedAt && (
        <div className="mt-3 rounded-xl border border-sky-400/30 bg-sky-400/5 p-3">
          <p className="text-[10px] font-black uppercase tracking-widest text-sky-200">
            Invite ready for {lastInvite.email}
          </p>
          <p className="mt-1 break-all rounded-md bg-slate-950/70 px-2 py-1.5 font-mono text-[10px] text-slate-300">
            {buildInviteUrl(lastInvite)}
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            <button
              onClick={sendMail}
              className="inline-flex items-center gap-1.5 rounded-md bg-sky-500 px-2.5 py-1.5 text-[11px] font-black text-white shadow-md hover:bg-sky-400"
            >
              {opened ? <Check className="h-3.5 w-3.5" /> : <Send className="h-3.5 w-3.5" />}
              {opened ? 'Opened' : 'Open in email'}
            </button>
            <button
              onClick={copyLink}
              className="inline-flex items-center gap-1.5 rounded-md border border-white/15 bg-white/5 px-2.5 py-1.5 text-[11px] font-bold text-slate-200 hover:bg-white/10"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
              {copied ? 'Copied' : 'Copy link'}
            </button>
            <span className="text-[10px] text-slate-400">
              Opens in the teacher's default mail client with the invite pre-filled.
            </span>
          </div>
        </div>
      )}

      {/* Student list */}
      <div className="mt-4">
        {students.length === 0 ? (
          <p className="rounded-md border border-dashed border-white/10 px-3 py-4 text-center text-xs text-slate-400">
            No students yet. Invite one above to get started.
          </p>
        ) : (
          <ul className="space-y-1.5">
            {students.map((s) => (
              <li
                key={s.id}
                className="flex items-center gap-2 rounded-md border border-white/10 bg-slate-950/40 px-2.5 py-2"
              >
                <span
                  className={`grid h-7 w-7 shrink-0 place-items-center rounded-full text-[10px] font-black ${
                    s.status === 'joined' ? 'bg-emerald-500 text-emerald-950' : 'bg-amber-500 text-amber-950'
                  }`}
                  title={s.status === 'joined' ? 'Has opened the invite link' : 'Invite sent, not yet opened'}
                >
                  {s.name.charAt(0).toUpperCase()}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-bold text-white">{s.name}</p>
                  <p className="truncate text-[10px] text-slate-400">{s.email}</p>
                </div>
                <span
                  className={`shrink-0 rounded-full px-2 py-0.5 text-[9px] font-black uppercase tracking-wider ${
                    s.status === 'joined'
                      ? 'bg-emerald-500/15 text-emerald-300'
                      : 'bg-amber-500/15 text-amber-300'
                  }`}
                >
                  {s.status === 'joined' ? <><GraduationCap className="mr-0.5 inline h-2.5 w-2.5" /> Joined</> : 'Invited'}
                </span>
                <button
                  onClick={() => removeStudent(s.id)}
                  className="rounded-md p-1 text-slate-500 hover:bg-red-500/15 hover:text-red-400"
                  title="Remove from roster"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
