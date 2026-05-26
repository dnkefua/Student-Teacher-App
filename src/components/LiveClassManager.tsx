'use client';

import React, { useMemo, useState, useSyncExternalStore } from 'react';
import {
  Calendar,
  Check,
  Clock,
  Copy,
  Link2,
  Plus,
  Send,
  Sparkles,
  Trash2,
  Users,
  Video,
  X,
} from 'lucide-react';
import {
  type LiveClassSession,
  buildSessionMailto,
  buildSessionUrl,
  createSession,
  deleteSession,
  listSessions,
  subscribe,
} from '@/lib/liveClass/liveClassStore';
import {
  type RosterStudent,
  listStudents,
  subscribe as subscribeRoster,
} from '@/lib/roster/rosterStore';

/**
 * Teacher's live-class scheduler.
 *
 * Replaces the previous simple class-link input with a full
 * session creator + roster integration:
 *
 *   1. CREATE — title, subject, date/time, duration, optional class
 *      label (e.g. "8A"), optional notes. Each session gets a unique
 *      token-based URL so links never collide and old ones expire.
 *   2. ATTACH — multi-select roster students for this session, or
 *      use the class label to broadcast to a whole class.
 *   3. SHARE — once created, the session card shows the link plus
 *      "Open in email" (mailto:) and "Copy link" actions. The mailto
 *      pre-fills subject + body with the date / time / link.
 *   4. JOIN — "Open class" button drops the teacher into the Virtual
 *      Classroom for this session.
 *
 * Sessions feed the new TeacherCalendar (separate tab) and the
 * student dashboard's "Join live class" pill (via the legacy
 * eis-class-link key, which we also write).
 */
export function LiveClassManager({
  onOpenClassroom,
}: {
  onOpenClassroom: () => void;
}) {
  const sessions = useSyncExternalStore(subscribe, listSessions, () => [] as LiveClassSession[]);
  const roster = useSyncExternalStore(subscribeRoster, listStudents, () => [] as RosterStudent[]);

  const [open, setOpen] = useState(false);

  return (
    <section className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl sm:p-5">
      <header className="mb-3 flex flex-wrap items-center gap-2">
        <Video className="h-4 w-4 text-sky-300" />
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300">
          Live class sessions
        </p>
        <span className="ml-auto rounded-full bg-sky-500/15 px-2 py-0.5 text-[10px] font-bold text-sky-300">
          {sessions.length} scheduled
        </span>
        <button
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-1.5 rounded-md bg-sky-500 px-2.5 py-1.5 text-[11px] font-black text-white shadow-md hover:bg-sky-400"
        >
          <Plus className="h-3.5 w-3.5" />
          Create
        </button>
      </header>

      {/* List */}
      {sessions.length === 0 ? (
        <p className="rounded-md border border-dashed border-white/10 px-3 py-4 text-center text-xs text-slate-400">
          No live classes scheduled yet. Hit Create to make a shareable join link.
        </p>
      ) : (
        <ul className="space-y-2">
          {sessions.map((s) => (
            <SessionRow
              key={s.id}
              session={s}
              roster={roster}
              onOpen={onOpenClassroom}
            />
          ))}
        </ul>
      )}

      {open && (
        <CreateSessionDialog
          roster={roster}
          onClose={() => setOpen(false)}
          onCreated={() => setOpen(false)}
        />
      )}
    </section>
  );
}

// ── Session row ─────────────────────────────────────────────────────

function SessionRow({
  session,
  roster,
  onOpen,
}: {
  session: LiveClassSession;
  roster: RosterStudent[];
  onOpen: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const [opened, setOpened] = useState(false);
  const startMs = new Date(session.startsAt).getTime();
  const endMs = startMs + session.durationMin * 60_000;
  const now = Date.now();
  const live = now >= startMs && now <= endMs;
  const past = now > endMs;

  const url = buildSessionUrl(session);
  const recipients = roster
    .filter((r) => session.studentIds.includes(r.id))
    .map((r) => r.email);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* ignore */
    }
  };

  const sendMail = () => {
    if (recipients.length === 0) {
      window.alert('No students attached to this session yet — add some first.');
      return;
    }
    window.location.href = buildSessionMailto(session, recipients);
    setOpened(true);
    setTimeout(() => setOpened(false), 2000);
  };

  return (
    <li className="rounded-xl border border-white/10 bg-slate-950/40 p-3">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-black text-white">{session.title}</p>
          <p className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-slate-400">
            <span className="inline-flex items-center gap-1" suppressHydrationWarning>
              <Clock className="h-3 w-3" />
              {new Date(session.startsAt).toLocaleString(undefined, {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
            <span>· {session.durationMin} min</span>
            {session.classLabel && <span>· {session.classLabel}</span>}
            {session.studentIds.length > 0 && (
              <span className="inline-flex items-center gap-1">
                <Users className="h-3 w-3" /> {session.studentIds.length}
              </span>
            )}
          </p>
        </div>
        <span
          className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-black uppercase tracking-wider ${
            live
              ? 'bg-emerald-500 text-emerald-950'
              : past
                ? 'bg-slate-500/20 text-slate-400'
                : 'bg-amber-500/15 text-amber-300'
          }`}
        >
          {live ? '● Live' : past ? 'Past' : 'Upcoming'}
        </span>
      </div>

      <div className="mt-2 break-all rounded-md bg-slate-950/70 px-2 py-1.5 font-mono text-[10px] text-slate-300">
        {url}
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-1.5">
        <button
          onClick={onOpen}
          className="inline-flex items-center gap-1.5 rounded-md bg-emerald-500 px-2.5 py-1.5 text-[11px] font-black text-emerald-950 shadow-md hover:bg-emerald-400"
        >
          <Video className="h-3.5 w-3.5" />
          Open class
        </button>
        <button
          onClick={sendMail}
          className="inline-flex items-center gap-1.5 rounded-md bg-sky-500 px-2.5 py-1.5 text-[11px] font-black text-white shadow-md hover:bg-sky-400"
        >
          {opened ? <Check className="h-3.5 w-3.5" /> : <Send className="h-3.5 w-3.5" />}
          {opened ? 'Opened' : 'Email students'}
        </button>
        <button
          onClick={copy}
          className="inline-flex items-center gap-1.5 rounded-md border border-white/15 bg-white/5 px-2.5 py-1.5 text-[11px] font-bold text-slate-200 hover:bg-white/10"
        >
          {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
          {copied ? 'Copied' : 'Copy link'}
        </button>
        <button
          onClick={() => {
            if (confirm(`Delete "${session.title}"?`)) deleteSession(session.id);
          }}
          className="ml-auto rounded-md p-1.5 text-slate-500 hover:bg-red-500/15 hover:text-red-400"
          title="Delete session"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
    </li>
  );
}

// ── Create dialog ──────────────────────────────────────────────────

function CreateSessionDialog({
  roster,
  onClose,
  onCreated,
}: {
  roster: RosterStudent[];
  onClose: () => void;
  onCreated: () => void;
}) {
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState<'math' | 'english' | 'science'>('math');
  const [classLabel, setClassLabel] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [time, setTime] = useState('09:00');
  const [duration, setDuration] = useState(45);
  const [studentIds, setStudentIds] = useState<Set<string>>(new Set());
  const [notes, setNotes] = useState('');

  const toggle = (id: string) =>
    setStudentIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const canCreate = title.trim().length > 0 && date && time && duration > 0;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canCreate) return;
    createSession({
      title: title.trim(),
      subject,
      startsAt: new Date(`${date}T${time}`).toISOString(),
      durationMin: duration,
      studentIds: Array.from(studentIds),
      classLabel: classLabel.trim() || undefined,
      notes: notes.trim() || undefined,
    });
    onCreated();
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4 backdrop-blur-sm">
      <form
        onSubmit={submit}
        className="relative flex max-h-[90dvh] w-[min(36rem,100%)] flex-col overflow-hidden rounded-2xl border border-white/15 bg-[#070a12] text-white shadow-2xl"
      >
        <header className="flex shrink-0 items-center justify-between gap-2 border-b border-white/10 px-5 py-3">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-sky-300" />
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-300">
              Schedule live class
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1 text-slate-400 hover:bg-white/10 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          <label className="block text-[10px] font-bold uppercase tracking-wide text-slate-400">
            Title
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Maths · Solving linear equations"
              className="mt-1 w-full rounded-md border border-white/10 bg-slate-950 px-3 py-2 text-sm normal-case text-white outline-none focus:border-sky-400"
              autoFocus
            />
          </label>

          <div className="grid gap-2 sm:grid-cols-2">
            <label className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
              Subject
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value as 'math' | 'english' | 'science')}
                className="mt-1 w-full rounded-md border border-white/10 bg-slate-950 px-3 py-2 text-sm normal-case text-white outline-none focus:border-sky-400"
              >
                <option value="math">Mathematics</option>
                <option value="english">English</option>
                <option value="science">Science</option>
              </select>
            </label>
            <label className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
              Class label <span className="font-normal text-slate-500">(optional)</span>
              <input
                type="text"
                value={classLabel}
                onChange={(e) => setClassLabel(e.target.value)}
                placeholder="8A"
                className="mt-1 w-full rounded-md border border-white/10 bg-slate-950 px-3 py-2 text-sm normal-case text-white outline-none focus:border-sky-400"
              />
            </label>
          </div>

          <div className="grid gap-2 sm:grid-cols-3">
            <label className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
              Date
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="mt-1 w-full rounded-md border border-white/10 bg-slate-950 px-3 py-2 text-sm normal-case text-white outline-none focus:border-sky-400"
              />
            </label>
            <label className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
              Time
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="mt-1 w-full rounded-md border border-white/10 bg-slate-950 px-3 py-2 text-sm normal-case text-white outline-none focus:border-sky-400"
              />
            </label>
            <label className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
              Duration (min)
              <input
                type="number"
                min={5}
                max={240}
                value={duration}
                onChange={(e) => setDuration(parseInt(e.target.value, 10) || 0)}
                className="mt-1 w-full rounded-md border border-white/10 bg-slate-950 px-3 py-2 text-sm normal-case text-white outline-none focus:border-sky-400"
              />
            </label>
          </div>

          <label className="block text-[10px] font-bold uppercase tracking-wide text-slate-400">
            Notes <span className="font-normal text-slate-500">(optional)</span>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              placeholder="Anything students should read or prepare before class."
              className="mt-1 w-full resize-none rounded-md border border-white/10 bg-slate-950 px-3 py-2 text-sm normal-case text-white outline-none focus:border-sky-400"
            />
          </label>

          {/* Roster picker */}
          <div>
            <p className="mb-1 flex items-center gap-2 text-[10px] font-bold uppercase tracking-wide text-slate-400">
              <Users className="h-3 w-3" /> Add students ({studentIds.size} selected)
            </p>
            {roster.length === 0 ? (
              <p className="rounded-md border border-dashed border-white/10 p-3 text-center text-[11px] text-slate-500">
                No students in your roster yet — invite them from "My Students" first, then come back to attach.
              </p>
            ) : (
              <div className="max-h-40 space-y-1 overflow-y-auto rounded-md border border-white/10 bg-slate-950 p-2">
                {roster.map((s) => {
                  const checked = studentIds.has(s.id);
                  return (
                    <label
                      key={s.id}
                      className={`flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-xs transition ${
                        checked ? 'bg-sky-500/15 text-white' : 'text-slate-300 hover:bg-white/5'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggle(s.id)}
                        className="h-3.5 w-3.5"
                      />
                      <span className="flex-1 truncate">{s.name}</span>
                      <span className="text-[9px] text-slate-500">{s.email}</span>
                    </label>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <footer className="flex shrink-0 items-center justify-end gap-2 border-t border-white/10 px-4 py-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-bold text-slate-200 hover:bg-white/10"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!canCreate}
            className="inline-flex items-center gap-1.5 rounded-md bg-sky-500 px-4 py-1.5 text-xs font-black text-white shadow-md transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:bg-slate-500"
          >
            <Link2 className="h-3.5 w-3.5" />
            Create link
          </button>
        </footer>
      </form>
    </div>
  );
}
