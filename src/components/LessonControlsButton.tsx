'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
  BookOpen,
  ChevronDown,
  Eye,
  MonitorPlay,
  Presentation,
  ScreenShare,
  Sparkles,
  X,
} from 'lucide-react';
import { ActiveLessonPanel, type ShareableLesson } from './ActiveLessonPanel';

/**
 * Floating teacher-only "Lesson controls" button for the Virtual
 * Classroom. Tucks every lesson / sharing action away into a single
 * popover so the live-class shell opens to a clean, full-bleed video
 * stage by default.
 *
 * Three actions inside the popover:
 *
 *   1. PICK A LESSON  — embeds the existing ActiveLessonPanel so the
 *      teacher can browse Maths / English / Science lessons and post
 *      one as the active lesson for the class.
 *   2. SHARE BROWSER  — calls navigator.mediaDevices.getDisplayMedia
 *      (the existing screen-share flow) so the teacher can share any
 *      browser tab / window / screen with the class.
 *   3. VIEW STUDENT SCREEN — sends a "screen request" system message
 *      to the class chat. The student must accept and share their
 *      screen. Honest about the limitation: real peer-to-peer screen
 *      transmission needs a signalling server, which isn't wired up
 *      yet — so the button posts the request, and a follow-up
 *      message tells the student to share their screen back.
 */
export function LessonControlsButton({
  onShareLesson,
  onShareAssignment,
  onAskAi,
  onOpenLessonPlayer,
  isAskingAi,
  onStartScreenShare,
  isScreenSharing,
  onRequestStudentScreen,
}: {
  onShareLesson: (lesson: ShareableLesson) => void;
  onShareAssignment: (lesson: ShareableLesson) => void;
  onAskAi: (lesson: ShareableLesson) => void;
  onOpenLessonPlayer?: () => void;
  isAskingAi: boolean;
  onStartScreenShare: () => void;
  isScreenSharing: boolean;
  onRequestStudentScreen: () => void;
}) {
  const [open, setOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  // Close on outside click / Escape.
  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (!popoverRef.current) return;
      if (!popoverRef.current.contains(e.target as Node)) setOpen(false);
    };
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleEsc);
    };
  }, [open]);

  return (
    <>
      {/* Trigger button — pinned bottom-left of the stage. */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="absolute bottom-4 left-4 z-30 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-sky-500 to-fuchsia-500 px-4 py-2.5 text-xs font-black uppercase tracking-widest text-white shadow-lg shadow-fuchsia-500/40 transition hover:scale-[1.03]"
        title="Lesson controls"
      >
        <Presentation className="h-4 w-4" />
        Lesson controls
        <ChevronDown className="h-3.5 w-3.5" />
      </button>

      {/* Backdrop + popover sheet */}
      {open && (
        <div className="absolute inset-0 z-40 flex items-stretch justify-start bg-black/50 backdrop-blur-sm">
          <div
            ref={popoverRef}
            className="relative my-auto ml-4 flex max-h-[88%] w-[min(28rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#070a12] text-white shadow-2xl"
          >
            <header className="flex shrink-0 items-center justify-between gap-2 border-b border-white/10 px-4 py-3">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-sky-300" />
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-300">
                  Lesson controls
                </p>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="rounded-md p-1 text-slate-400 hover:bg-white/10 hover:text-white"
                aria-label="Close lesson controls"
              >
                <X className="h-4 w-4" />
              </button>
            </header>

            <div className="flex-1 overflow-y-auto p-3 space-y-3">
              {/* Quick actions */}
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                <button
                  onClick={() => {
                    onStartScreenShare();
                    setOpen(false);
                  }}
                  className={`flex flex-col items-start gap-1 rounded-xl border p-3 text-left transition ${
                    isScreenSharing
                      ? 'border-emerald-400/40 bg-emerald-500/10 hover:bg-emerald-500/15'
                      : 'border-white/10 bg-white/5 hover:border-sky-400/40 hover:bg-white/10'
                  }`}
                >
                  <ScreenShare className="h-5 w-5 text-sky-300" />
                  <p className="text-sm font-black text-white">
                    {isScreenSharing ? 'Stop sharing browser' : 'Share my browser'}
                  </p>
                  <p className="text-[10px] text-slate-400">
                    Pick a tab, window or your whole screen.
                  </p>
                </button>

                <button
                  onClick={() => {
                    onRequestStudentScreen();
                    setOpen(false);
                  }}
                  className="flex flex-col items-start gap-1 rounded-xl border border-white/10 bg-white/5 p-3 text-left transition hover:border-fuchsia-400/40 hover:bg-white/10"
                >
                  <Eye className="h-5 w-5 text-fuchsia-300" />
                  <p className="text-sm font-black text-white">View a student's screen</p>
                  <p className="text-[10px] text-slate-400">
                    Asks the selected student to share their screen back to the class.
                  </p>
                </button>
              </div>

              {/* Pick a lesson */}
              <div className="rounded-xl border border-white/10 bg-white/[0.04] p-3">
                <div className="mb-2 flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-amber-300" />
                  <p className="text-[10px] font-black uppercase tracking-widest text-amber-200">
                    Pick a lesson to display
                  </p>
                </div>
                <ActiveLessonPanel
                  onShareLesson={(lesson) => {
                    onShareLesson(lesson);
                    setOpen(false);
                  }}
                  onShareAssignment={(lesson) => {
                    onShareAssignment(lesson);
                    setOpen(false);
                  }}
                  onAskAi={onAskAi}
                  onOpenLessonPlayer={
                    onOpenLessonPlayer
                      ? () => {
                          onOpenLessonPlayer();
                          setOpen(false);
                        }
                      : undefined
                  }
                  isAskingAi={isAskingAi}
                />
              </div>

              <p className="rounded-md border-l-4 border-sky-400 bg-sky-400/10 px-3 py-2 text-[11px] leading-5 text-sky-100">
                <MonitorPlay className="mr-1 inline h-3.5 w-3.5" />
                Tip: pick a lesson here, then switch the stage to{' '}
                <span className="font-bold">Lesson</span> in the top tabs to project it.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
