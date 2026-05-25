'use client';

import { useEffect } from 'react';

/**
 * Service-worker cleanup component.
 *
 * Earlier versions of this app shipped a network-first SW that cached
 * the app shell. On every deploy, returning users with the old SW were
 * occasionally served stale HTML referencing chunks that no longer
 * existed → "Application error: a client-side exception has occurred".
 *
 * This component no longer REGISTERS a new SW. Instead it actively
 * removes any leftover ones so existing users get unstuck. The
 * accompanying public/sw.js is also a self-destroying stub that
 * unregisters itself the moment a stale client re-fetches it.
 *
 * If we ever need offline support back, that's a separate, opt-in
 * decision — and we should bump the cache name on EVERY deploy.
 */
export function ServiceWorkerRegister() {
  useEffect(() => {
    if (typeof navigator === 'undefined' || !('serviceWorker' in navigator)) return;
    navigator.serviceWorker
      .getRegistrations()
      .then((regs) => Promise.all(regs.map((r) => r.unregister())))
      .catch(() => undefined);
    if ('caches' in window) {
      caches
        .keys()
        .then((keys) => Promise.all(keys.map((k) => caches.delete(k))))
        .catch(() => undefined);
    }
  }, []);

  return null;
}
