
// Kill-switch Service Worker.
// Sostituisce qualsiasi SW precedente: pulisce tutte le cache, si de-registra
// e forza un reload pulito delle finestre aperte. Non intercetta pi\u00f9 nulla.
self.addEventListener('install', (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    try {
      await self.clients.claim();
      const names = await caches.keys();
      await Promise.all(names.map((n) => caches.delete(n)));
      const clients = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
      await Promise.all(clients.map((c) => {
        try {
          const url = new URL(c.url);
          url.searchParams.set('sw-cleanup', Date.now().toString());
          return c.navigate(url.toString());
        } catch (_) {
          return Promise.resolve();
        }
      }));
      await self.registration.unregister();
    } catch (e) {
      // best effort
    }
  })());
});
