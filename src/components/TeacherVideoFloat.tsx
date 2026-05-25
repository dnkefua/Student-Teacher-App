'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Maximize2, Minimize2, X, GripHorizontal, Mic, MicOff } from 'lucide-react';

/**
 * Floating teacher-video tile that lives on TOP of the stage area.
 *
 * Behaviour
 * - Floating PiP card the teacher (or any viewer) can drag anywhere
 *   inside the stage area.
 * - When MAXIMIZED, the card fills the entire stage area edge-to-edge
 *   to show the teacher on a big screen — the teacher controls this
 *   from the card's title bar.
 * - When the teacher toggles maximize / hide, the choice is broadcast
 *   via localStorage event so every connected student window
 *   immediately follows. This is good enough for the demo; a real
 *   multi-user implementation would use Firestore / a websocket.
 *
 * Layout
 * - The container that hosts this component must be relative.
 * - The PiP card is absolute-positioned with `right-4 bottom-4` by
 *   default; once dragged it snaps to wherever the user releases it.
 *
 * Students can hide it locally (X button) but cannot maximize for the
 * teacher — the teacher-only controls are gated on the `mode` prop.
 */

const STATE_KEY = 'eis-teacher-video-state';
const STATE_EVENT = 'eis-teacher-video-state-changed';

type SharedState = {
  /** Teacher broadcasts this; students follow. */
  maximized: boolean;
  /** Teacher hid the floating box. */
  hidden: boolean;
};

const defaultShared: SharedState = { maximized: false, hidden: false };

function readShared(): SharedState {
  if (typeof window === 'undefined') return defaultShared;
  try {
    const raw = window.localStorage.getItem(STATE_KEY);
    if (!raw) return defaultShared;
    const p = JSON.parse(raw);
    return {
      maximized: typeof p.maximized === 'boolean' ? p.maximized : false,
      hidden: typeof p.hidden === 'boolean' ? p.hidden : false,
    };
  } catch {
    return defaultShared;
  }
}

function writeShared(next: SharedState) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STATE_KEY, JSON.stringify(next));
  window.dispatchEvent(new CustomEvent(STATE_EVENT));
}

export function TeacherVideoFloat({
  videoRef,
  isMuted = false,
  isVideoOff = false,
  mode = 'teacher',
  label = 'Teacher',
}: {
  /** Ref pointing at the <video> element that already has the local stream. */
  videoRef: React.RefObject<HTMLVideoElement | null>;
  isMuted?: boolean;
  isVideoOff?: boolean;
  mode?: 'teacher' | 'student';
  label?: string;
}) {
  const isTeacher = mode === 'teacher';

  // Shared (broadcast) state.
  const [shared, setShared] = useState<SharedState>(() => readShared());

  // Position (local — each viewer can drag their PiP wherever).
  const [pos, setPos] = useState({ x: 16, y: 16 }); // distance from bottom-right
  const draggingRef = useRef<{ startX: number; startY: number; baseX: number; baseY: number } | null>(null);

  // The internal <video> for this floating box is a MIRROR of the
  // upstream stream. We attach the same srcObject so both videos play
  // the same feed without duplicating MediaStream listeners.
  const localVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const onChange = () => setShared(readShared());
    window.addEventListener(STATE_EVENT, onChange);
    window.addEventListener('storage', onChange);
    return () => {
      window.removeEventListener(STATE_EVENT, onChange);
      window.removeEventListener('storage', onChange);
    };
  }, []);

  // Mirror the upstream stream into our local video element.
  useEffect(() => {
    const upstream = videoRef.current?.srcObject;
    if (localVideoRef.current && upstream) {
      localVideoRef.current.srcObject = upstream as MediaStream;
    }
  });

  if (shared.hidden) {
    // Teacher hid the floating tile. Give the teacher a tiny "Show" pill
    // bottom-right; students see nothing.
    if (!isTeacher) return null;
    return (
      <button
        onClick={() => writeShared({ ...shared, hidden: false })}
        className="absolute bottom-4 right-4 z-40 inline-flex items-center gap-1.5 rounded-full bg-slate-900/80 px-3 py-1.5 text-xs font-bold text-white shadow-lg backdrop-blur hover:bg-slate-900"
      >
        Show my video
      </button>
    );
  }

  // Drag handlers (only the teacher gets a drag handle; students can drag
  // their copy too because it doesn't change the broadcast state).
  const onPointerDown = (e: React.PointerEvent) => {
    if (shared.maximized) return;
    (e.target as Element).setPointerCapture(e.pointerId);
    draggingRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      baseX: pos.x,
      baseY: pos.y,
    };
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!draggingRef.current) return;
    const dx = e.clientX - draggingRef.current.startX;
    const dy = e.clientY - draggingRef.current.startY;
    setPos({
      x: Math.max(8, draggingRef.current.baseX - dx),
      y: Math.max(8, draggingRef.current.baseY - dy),
    });
  };
  const onPointerUp = (e: React.PointerEvent) => {
    (e.target as Element).releasePointerCapture(e.pointerId);
    draggingRef.current = null;
  };

  const containerStyle: React.CSSProperties = shared.maximized
    ? { position: 'absolute', inset: 0, zIndex: 40 }
    : {
        position: 'absolute',
        right: `${pos.x}px`,
        bottom: `${pos.y}px`,
        zIndex: 40,
        width: '18rem',
        height: '12rem',
      };

  return (
    <div
      style={containerStyle}
      className={`overflow-hidden rounded-xl border border-white/20 bg-black shadow-2xl ${
        shared.maximized ? 'rounded-none' : ''
      }`}
    >
      {/* Title bar */}
      <div
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        className={`flex items-center justify-between gap-2 bg-slate-950/80 px-2 py-1.5 backdrop-blur ${
          !shared.maximized ? 'cursor-grab active:cursor-grabbing' : ''
        }`}
      >
        <div className="flex min-w-0 items-center gap-1.5 text-white">
          {!shared.maximized && <GripHorizontal className="h-3.5 w-3.5 text-slate-400" />}
          <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
          {isMuted && <MicOff className="h-3 w-3 text-red-400" />}
          {!isMuted && shared.maximized && <Mic className="h-3 w-3 text-emerald-400" />}
        </div>
        <div className="flex items-center gap-0.5">
          {isTeacher && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                writeShared({ ...shared, maximized: !shared.maximized });
              }}
              className="grid h-6 w-6 place-items-center rounded text-slate-300 hover:bg-white/10 hover:text-white"
              title={shared.maximized ? 'Minimize my video' : 'Maximize to full stage'}
            >
              {shared.maximized ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
            </button>
          )}
          {isTeacher && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                writeShared({ maximized: false, hidden: true });
              }}
              className="grid h-6 w-6 place-items-center rounded text-slate-300 hover:bg-red-500/30 hover:text-white"
              title="Hide my video for the class"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Video area */}
      <div className="relative h-[calc(100%-32px)] w-full bg-black">
        {isVideoOff ? (
          <div className="grid h-full w-full place-items-center">
            <div className="grid h-14 w-14 place-items-center rounded-full bg-indigo-600 text-2xl font-black text-white">
              {label.charAt(0)}
            </div>
          </div>
        ) : (
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            className="h-full w-full object-cover"
          />
        )}
      </div>
    </div>
  );
}
