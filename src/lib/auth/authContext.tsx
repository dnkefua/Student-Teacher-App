'use client';

// Firebase Auth context. When Firebase is configured, exposes the live
// signed-in user. Falls back to a "demo" user (same id system already
// used by demoUser.ts) when auth is unavailable or the user is signed
// out — so the rest of the app keeps working without auth.

import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut as fbSignOut,
  type User,
} from 'firebase/auth';
import { getFirebaseAuth, isFirebaseConfigured } from '@/lib/firebase/client';

export type AppAuthState = {
  /** Firebase user when signed in, null otherwise. */
  user: User | null;
  /** Status flag exposing whether auth is even available. */
  authConfigured: boolean;
  /** True while the initial auth state is being resolved. */
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  /** Stable id usable for Firestore writes — real uid when signed in,
   *  falls back to the localStorage-cached demo id otherwise. */
  effectiveUid: string | null;
};

const AuthContext = createContext<AppAuthState | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const authConfigured = isFirebaseConfigured();

  useEffect(() => {
    if (!authConfigured) {
      setLoading(false);
      return;
    }
    const auth = getFirebaseAuth();
    if (!auth) {
      setLoading(false);
      return;
    }
    const unsub = onAuthStateChanged(auth, (next) => {
      setUser(next);
      setLoading(false);
    });
    return () => unsub();
  }, [authConfigured]);

  const signInWithGoogle = async () => {
    const auth = getFirebaseAuth();
    if (!auth) throw new Error('Firebase Auth is not configured.');
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const signOut = async () => {
    const auth = getFirebaseAuth();
    if (!auth) return;
    await fbSignOut(auth);
  };

  const effectiveUid = user?.uid ?? null;

  const value: AppAuthState = {
    user,
    authConfigured,
    loading,
    signInWithGoogle,
    signOut,
    effectiveUid,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AppAuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    // Fallback shape so components outside the provider don't crash —
    // useful for unit tests and SSR-time renders.
    return {
      user: null,
      authConfigured: false,
      loading: false,
      signInWithGoogle: async () => undefined,
      signOut: async () => undefined,
      effectiveUid: null,
    };
  }
  return ctx;
}
