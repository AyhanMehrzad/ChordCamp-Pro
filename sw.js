// ChordCamp Pro - High Performance Offline Service Worker with Auto-Update
const CACHE_VERSION = 'v4.0.0';
const CACHE_NAME = `chordcamp-pro-${CACHE_VERSION}`;

const OFFLINE_URLS = [
  './',
  './index.html',
  './manifest.json',
  './css/styles.css',
  './js/chords-data.js',
  './js/scales-data.js',
  './js/audio.js',
  './js/chords.js',
  './js/fretboard.js',
  './js/drills.js',
  './js/metronome.js',
  './js/tuner.js',
  './js/app.js',
  './assets/icon-192.png',
  './assets/icon-512.png',
  './assets/icon-maskable.png',
  './assets/logo.png',
  './assets/logo.svg',
  './assets/ChordCamp.ico'
];

// Install: pre-cache all assets and immediately activate
self.addEventListener('install', (event) => {
  console.log(`[ChordCamp SW] Installing ${CACHE_NAME}...`);
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(OFFLINE_URLS).catch((err) => {
        console.warn('[ChordCamp SW] Cache addAll warning (non-fatal):', err);
      });
    }).then(() => self.skipWaiting())
  );
});

// Activate: purge any old caches from previous versions
self.addEventListener('activate', (event) => {
  console.log(`[ChordCamp SW] Activating ${CACHE_NAME}...`);
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((k) => {
          if (k !== CACHE_NAME) {
            console.log('[ChordCamp SW] Deleting outdated cache:', k);
            return caches.delete(k);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Strategy:
// 1. Navigation (index.html): Network-First (with quick timeout) -> ensures online users get updates immediately!
// 2. Static Assets (CSS/JS/images): Stale-While-Revalidate -> instant offline load + background update.
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // 1. Navigation requests (HTML page): Network-First with Cache Fallback
  if (event.request.mode === 'navigate' || url.pathname.endsWith('index.html') || url.pathname.endsWith('/')) {
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const copy = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          }
          return networkResponse;
        })
        .catch(() => {
          // Offline fallback
          return caches.match('./index.html').then((cached) => {
            return cached || caches.match('./');
          });
        })
    );
    return;
  }

  // 2. Static Assets: Stale-While-Revalidate
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const copy = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
        }
        return networkResponse;
      }).catch(() => {
        // Offline: network failed, ignore
      });

      return cachedResponse || fetchPromise;
    })
  );
});

// Listen for message events (e.g. from in-app "Check for Updates" button)
self.addEventListener('message', (event) => {
  if (!event.data) return;

  if (event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }

  if (event.data.action === 'clearCache') {
    caches.keys().then((keys) => {
      return Promise.all(keys.map(k => caches.delete(k)));
    }).then(() => {
      if (event.ports && event.ports[0]) {
        event.ports[0].postMessage({ status: 'cleared' });
      }
    });
  }
});
