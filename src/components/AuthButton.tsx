'use client';

import React, { useState } from 'react';
import { LogIn, LogOut, ShieldCheck, UserRound } from 'lucide-react';
import { useAuth } from '@/lib/auth/authContext';

export function AuthButton({ compact }: { compact?: boolean }) {
  const { user, authConfigured, signInWithGoogle, signOut, loading } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  if (!authConfigured) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-md border border-[#ffc43b]/30 bg-[#ffc43b]/10 px-2.5 py-1.5 text-[10px] font-black uppercase tracking-wide text-[#ffe08a]">
        <ShieldCheck className="h-3 w-3" />
        Demo mode
      </span>
    );
  }

  if (loading) {
    return <span className="text-[10px] font-bold uppercase tracking-wide text-slate-400">Checking auth…</span>;
  }

  if (user) {
    return (
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-md border border-emerald-300/30 bg-emerald-300/10 px-2.5 py-1.5 text-[10px] font-black uppercase tracking-wide text-emerald-200">
          <UserRound className="h-3 w-3" />
          {compact ? 'Signed in' : (user.displayName ?? user.email ?? 'Signed in')}
        </span>
        <button
          onClick={async () => {
            setBusy(true);
            try { await signOut(); } finally { setBusy(false); }
          }}
          disabled={busy}
          className="inline-flex items-center gap-1 rounded-md border border-white/15 px-2 py-1 text-[10px] font-black uppercase tracking-wide text-slate-300 transition hover:border-white/40 hover:text-white"
        >
          <LogOut className="h-3 w-3" />
          Sign out
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        onClick={async () => {
          setError(null);
          setBusy(true);
          try {
            await signInWithGoogle();
          } catch (err) {
            setError(err instanceof Error ? err.message : 'Sign-in failed.');
          } finally {
            setBusy(false);
          }
        }}
        disabled={busy}
        className="inline-flex items-center gap-1.5 rounded-md bg-[#49c8ff] px-3 py-1.5 text-[11px] font-black uppercase tracking-wide text-[#061126] transition hover:bg-[#8ddfff] disabled:opacity-60"
      >
        <LogIn className="h-3 w-3" />
        Sign in with Google
      </button>
      {error ? <p className="max-w-[220px] text-right text-[10px] text-[#fb7185]">{error}</p> : null}
    </div>
  );
}
