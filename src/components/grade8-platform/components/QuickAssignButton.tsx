'use client';

import React, { useEffect, useState } from 'react';
import { GraduationCap, Check, Calendar } from 'lucide-react';
import type { SubjectId, UnitId } from '../types';
import { createAssignment, type AssignmentKind } from '../data/assignmentStore';

/**
 * Compact "Assign to student" pill that sits next to a single curriculum
 * item (a practice question, an asset, an exam, a worked example).
 *
 * Clicking it opens a tiny popover with the only fields a teacher
 * actually needs in the moment — assignment title and due date — and
 * posts the item to the existing assignmentStore. Defaults are
 * chosen so the teacher can post in two clicks: hit the button, hit
 * "Post".
 *
 * Why a popover and not just a one-tap post?
 *   The original ask was a small clickable button — but with no due
 *   date a "submitted on time" badge becomes meaningless. The
 *   popover keeps the surface tiny (one input + one date + post)
 *   while still capturing the date.
 */
export function QuickAssignButton({
  refId,
  label,
  subject,
  unit,
  kind = 'exercise',
  defaultTitle,
}: {
  refId: string;
  label: string;
  subject: SubjectId;
  unit: UnitId;
  kind?: AssignmentKind;
  defaultTitle?: string;
}) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(defaultTitle ?? label.slice(0, 80));
  const [dueAt, setDueAt] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d.toISOString().slice(0, 10);
  });
  const [posted, setPosted] = useState(false);

  // Close on outside click — sentinel handler attached only while open
  useEffect(() => {
    if (!open) return;
    const onDocClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('[data-quick-assign]')) setOpen(false);
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, [open]);

  const post = (e: React.FormEvent) => {
    e.preventDefault();
    const final = title.trim() || label.slice(0, 80);
    createAssignment({
      title: final,
      kind,
      subject,
      unit,
      items: [{ refId, label }],
      dueAt,
      createdBy: 'teacher',
    });
    setPosted(true);
    // Auto-close after a short success flash so the teacher sees the
    // green tick and the popover gets out of the way.
    setTimeout(() => {
      setPosted(false);
      setOpen(false);
    }, 1500);
  };

  return (
    <div className="relative" data-quick-assign>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setOpen((v) => !v);
        }}
        className={`group inline-flex shrink-0 items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-[11px] font-bold transition ${
          open
            ? 'border-blue-400 bg-blue-50 text-blue-700'
            : 'border-slate-200 bg-white text-slate-600 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700'
        }`}
        title="Assign to student"
        aria-expanded={open}
      >
        <GraduationCap className="h-3.5 w-3.5" />
        <span>Assign</span>
      </button>

      {open && (
        <form
          onSubmit={post}
          onClick={(e) => e.stopPropagation()}
          className="absolute right-0 top-[calc(100%+4px)] z-50 w-72 rounded-xl border border-slate-200 bg-white p-3 shadow-2xl"
        >
          {posted ? (
            <div className="flex flex-col items-center gap-2 py-4">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-emerald-100">
                <Check className="h-5 w-5 text-emerald-600" />
              </span>
              <p className="text-sm font-bold text-emerald-700">Assignment posted</p>
              <p className="text-[11px] text-slate-500">Students will see it instantly</p>
            </div>
          ) : (
            <>
              <p className="mb-2 text-[10px] font-black uppercase tracking-widest text-slate-500">
                Assign · {kind}
              </p>
              <label className="block text-[10px] font-bold uppercase tracking-wide text-slate-500">
                Title
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="mt-1 w-full rounded-md border border-slate-300 px-2 py-1.5 text-xs normal-case text-slate-800 outline-none focus:border-blue-500"
                  placeholder={label.slice(0, 60)}
                />
              </label>
              <label className="mt-2 block text-[10px] font-bold uppercase tracking-wide text-slate-500">
                <span className="inline-flex items-center gap-1">
                  <Calendar className="h-3 w-3" /> Due
                </span>
                <input
                  type="date"
                  value={dueAt}
                  onChange={(e) => setDueAt(e.target.value)}
                  className="mt-1 w-full rounded-md border border-slate-300 px-2 py-1.5 text-xs normal-case text-slate-800 outline-none focus:border-blue-500"
                />
              </label>
              <p className="mt-2 truncate rounded-md bg-slate-50 px-2 py-1.5 text-[10px] text-slate-500">
                Item: {label}
              </p>
              <div className="mt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="flex-1 rounded-md border border-slate-200 px-2 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-md bg-blue-600 px-2 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-blue-700"
                >
                  Post
                </button>
              </div>
            </>
          )}
        </form>
      )}
    </div>
  );
}
