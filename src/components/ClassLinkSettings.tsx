'use client';

import React, { useEffect, useState } from 'react';
import { Check, Copy, Link2, Trash2, Video } from 'lucide-react';

const STORAGE_KEY = 'eis-class-link';

/**
 * Compact settings card for the live-class link.
 *
 * Teachers paste a Zoom / Google Meet / Teams URL once; students see a
 * "Join live class" button on their dashboard until the teacher clears
 * it. Persists in localStorage so the link survives reloads without
 * needing a Firestore round-trip for the demo.
 */
export function ClassLinkSettings() {
  const [link, setLink] = useState('');
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) setLink(stored);
    } catch {
      /* ignore */
    }
  }, []);

  const save = () => {
    if (typeof window === 'undefined') return;
    try {
      const trimmed = link.trim();
      if (trimmed) window.localStorage.setItem(STORAGE_KEY, trimmed);
      else window.localStorage.removeItem(STORAGE_KEY);
      setSaved(true);
      setTimeout(() => setSaved(false), 1500);
    } catch {
      /* ignore */
    }
  };

  const clear = () => {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
    setLink('');
  };

  const copy = async () => {
    if (!link.trim()) return;
    try {
      await navigator.clipboard.writeText(link.trim());
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* ignore */
    }
  };

  return (
    <section className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl sm:p-5">
      <div className="mb-3 flex items-center gap-2">
        <Video className="h-4 w-4 text-slate-300" />
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300">
          Live class link
        </p>
      </div>
      <p className="text-xs leading-5 text-slate-400">
        Paste your Zoom / Google Meet / Teams URL — students will see a one-tap
        "Join live class" button on their dashboard until you clear it.
      </p>

      <div className="mt-3 flex flex-col items-stretch gap-2 sm:flex-row">
        <div className="relative min-w-0 flex-1">
          <Link2 className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-500" />
          <input
            type="url"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            placeholder="https://meet.google.com/abc-defg-hij"
            className="w-full rounded-md border border-white/10 bg-slate-950/60 py-2 pl-9 pr-3 text-xs text-white placeholder:text-slate-600 outline-none focus:border-sky-400"
          />
        </div>
        <button
          onClick={save}
          className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-md bg-sky-500 px-3 py-2 text-xs font-black text-white shadow-md transition hover:bg-sky-400"
        >
          {saved ? <Check className="h-3.5 w-3.5" /> : null}
          {saved ? 'Saved' : 'Save'}
        </button>
      </div>

      {link.trim() && (
        <div className="mt-2.5 flex items-center gap-1.5">
          <button
            onClick={copy}
            className="inline-flex items-center gap-1 rounded-md border border-white/10 bg-white/5 px-2 py-1 text-[10px] font-bold text-slate-300 hover:bg-white/10"
          >
            {copied ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
            {copied ? 'Copied' : 'Copy link'}
          </button>
          <button
            onClick={clear}
            className="inline-flex items-center gap-1 rounded-md border border-red-500/20 bg-red-500/10 px-2 py-1 text-[10px] font-bold text-red-300 hover:bg-red-500/20"
          >
            <Trash2 className="h-3 w-3" />
            Clear
          </button>
          <span className="ml-auto text-[10px] text-emerald-400">● Visible to students</span>
        </div>
      )}
    </section>
  );
}
