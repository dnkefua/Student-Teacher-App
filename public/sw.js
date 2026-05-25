/**
 * Self-destroying service worker.
 *
 * Earlier versions of this SW cached the entire app shell. When Next.js
 * shipped new JS chunks with fresh hashes, returning clients with the
 * old SW were served stale HTML that referenced new chunk URLs that
 * didn't exist yet, producing
 *
 *     Application error: a client-side exception has occurred
 *
 * on the deployed site. To kill that footgun for every existing client
 * we replace the SW with one that:
 *
 *   1. Deletes EVERY cache it can see.
 *   2. Tells all open clients to reload so they pick up the live
 *      network HTML and chunks.
 *   3. Unregisters itself so the browser stops trying to use it.
 *
 * New visitors won't pick this SW up at all because
 * ServiceWorkerRegister no longer calls register() in production.
 */

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      try {
        // 1. Blow away every cache this origin has.
        const keys = await caches.keys();
        await Promise.all(keys.map((k) => caches.delete(k)));
        // 2. Force every open tab to reload — they'll come back without
        //    a SW intercepting their requests.
        const clients = await self.clients.matchAll({ type: 'window' });
        for (const client of clients) {
          try {
            client.navigate(client.url);
          } catch {
            /* ignore — some browsers reject navigate() across origins */
          }
        }
        // 3. Unregister this worker so the browser stops using it.
        await self.registration.unregister();
      } catch {
        /* ignore — best-effort cleanup */
      }
    })(),
  );
});

// Pass every fetch straight through to the network. No interception,
// no caching, no fallback. This keeps users productive while the
// activate handler is unregistering us.
self.addEventListener('fetch', () => {
  /* no-op */
});
