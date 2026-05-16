'use client';

import React, { useSyncExternalStore } from 'react';
import { ChevronDown, Users } from 'lucide-react';
import {
  DEFAULT_DEMO_CLASSES,
  loadActiveClass,
  setActiveClass,
  subscribeActiveClass,
  type ClassMeta,
} from '@/lib/activeClass';

let cached: ClassMeta | null = null;
function invalidate() { cached = null; }
function subscribe(cb: () => void): () => void {
  return subscribeActiveClass(() => { invalidate(); cb(); });
}
function getSnapshot(): ClassMeta {
  if (!cached) cached = loadActiveClass();
  return cached;
}
const getServerSnapshot = () => DEFAULT_DEMO_CLASSES[0];

export function ClassPicker({ compact }: { compact?: boolean }) {
  const active = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [open, setOpen] = React.useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="inline-flex items-center gap-2 rounded-md border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-black uppercase tracking-wide text-slate-200 transition hover:border-white/40 hover:text-white"
      >
        <Users className="h-3.5 w-3.5 text-[#8ddfff]" />
        {compact ? active.name : `Class · ${active.name}`}
        {active.size ? <span className="text-[10px] font-bold opacity-70">· {active.size}</span> : null}
        <ChevronDown className="h-3 w-3 opacity-70" />
      </button>

      {open ? (
        <>
          <button
            className="fixed inset-0 z-30 cursor-default"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <div className="absolute right-0 z-40 mt-1 w-56 rounded-md border border-white/10 bg-[#050711] p-1.5 shadow-xl">
            {DEFAULT_DEMO_CLASSES.map((c) => {
              const isActive = c.id === active.id;
              return (
                <button
                  key={c.id}
                  onClick={() => {
                    setActiveClass(c);
                    setOpen(false);
                  }}
                  className="flex w-full items-center justify-between gap-2 rounded-md px-2 py-1.5 text-left text-xs font-bold transition hover:bg-white/10"
                  style={{
                    background: isActive ? 'rgba(73,200,255,.12)' : 'transparent',
                    color: isActive ? '#8ddfff' : '#e2e8f0',
                  }}
                >
                  <span>{c.name}</span>
                  {c.size ? <span className="text-[10px] opacity-70">{c.size} students</span> : null}
                </button>
              );
            })}
          </div>
        </>
      ) : null}
    </div>
  );
}
