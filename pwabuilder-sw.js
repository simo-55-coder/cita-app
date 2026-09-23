// CVita Progressive Web App (Offline Service Worker)
// Cache First Strategy for all Assets, Styles, Scripts & HTML shell to prevent offline dark screen

const CACHE_NAME = 'cvita-offline-cache-v3';
const PRECACHE_ASSETS = [
  './',
  'index.html',
  'manifest.json',
  'pwa-logo-192.png',
  'pwa-logo-512.png',
];

// Install: precache critical assets and activate immediately
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      try {
        await cache.addAll(PRECACHE_ASSETS);
      } catch (err) {
        console.warn('[SW] Precache partial error:', err);
      }
    })
  );
});

// Activate: clean up older caches and claim clients immediately
self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.all([
      caches.keys().then((keys) =>
        Promise.all(
          keys.map((key) => {
            if (key !== CACHE_NAME) {
              return caches.delete(key);
            }
          })
        )
      ),
      self.clients.claim(),
    ])
  );
});

// Skip waiting message listener
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Fetch: Cache-First strategy with network fallback & background cache update
self.addEventListener('fetch', (event) => {
  const request = event.request;

  // Ignore non-GET and unsupported schemes (chrome-extension, etc.)
  if (request.method !== 'GET' || !request.url.startsWith('http')) {
    return;
  }

  // 1. Navigation requests (Opening the app / HTML page)
  if (request.mode === 'navigate') {
    event.respondWith(
      (async () => {
        try {
          // Try network with a fast timeout
          const networkPromise = fetch(request);
          const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Network timeout')), 2500)
          );
          const networkResponse = await Promise.race([networkPromise, timeoutPromise]);

          if (networkResponse && networkResponse.status === 200) {
            const cache = await caches.open(CACHE_NAME);
            cache.put(request, networkResponse.clone());
            return networkResponse;
          }
        } catch {
          // Network failed or offline - fall back to cached page
        }

        // Cache fallback: return exact match, or cached index.html, or root
        const cachedResponse =
          (await caches.match(request)) ||
          (await caches.match('index.html')) ||
          (await caches.match('./'));

        if (cachedResponse) {
          return cachedResponse;
        }

        // Final fallback: try fetching without timeout
        try {
          return await fetch(request);
        } catch {
          return new Response(
            '<!DOCTYPE html><html><head><meta charset="utf-8"><title>CVita Offline</title></head><body style="background:#703ED1;color:#fff;font-family:sans-serif;text-align:center;padding:50px;"><h2>CVita</h2><p>Please reload when connected.</p></body></html>',
            { headers: { 'Content-Type': 'text/html' } }
          );
        }
      })()
    );
    return;
  }

  // 2. Static Assets (JS, CSS, Images, Fonts, Icons) - Pure Cache-First Strategy
  event.respondWith(
    (async () => {
      const cached = await caches.match(request);
      if (cached) {
        // Return from cache immediately. Update cache in background for mutable files
        if (!request.url.includes('/assets/')) {
          fetch(request)
            .then((networkResp) => {
              if (networkResp && networkResp.status === 200) {
                caches.open(CACHE_NAME).then((cache) => cache.put(request, networkResp));
              }
            })
            .catch(() => {});
        }
        return cached;
      }

      // Not in cache, fetch from network and store in cache
      try {
        const networkResponse = await fetch(request);
        if (networkResponse && (networkResponse.status === 200 || networkResponse.status === 0)) {
          const cache = await caches.open(CACHE_NAME);
          cache.put(request, networkResponse.clone());
        }
        return networkResponse;
      } catch (error) {
        // Asset fetch failed and not in cache
        if (request.destination === 'image') {
          // Fallback to cached app icon if any image fails offline
          const fallbackIcon = await caches.match('pwa-logo-192.png');
          if (fallbackIcon) return fallbackIcon;
        }
        throw error;
      }
    })()
  );
});

