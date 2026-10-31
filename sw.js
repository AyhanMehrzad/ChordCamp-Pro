// ChordCamp Pro - 100% Offline Service Worker (Cache-First Strategy)
const CACHE_NAME = 'chordcamp-pro-v2';

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
  './js/app.js',
  './assets/logo.svg',
  './assets/icon-192.png',
  './assets/icon-512.png'
];

// Install: pre-cache all assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[ChordCamp SW] Pre-caching offline app shell...');
      return cache.addAll(OFFLINE_URLS).catch((err) => {
        console.warn('[ChordCamp SW] Cache.addAll non-fatal warning:', err);
      });
    }).then(() => self.skipWaiting())
  );
});

// Activate: cleanup old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((k) => {
          if (k !== CACHE_NAME) {
            console.log('[ChordCamp SW] Removing old cache:', k);
            return caches.delete(k);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch: Cache-First (instant offline loading) with network fallback
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).then((networkResponse) => {
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
          return networkResponse;
        }
        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });
        return networkResponse;
      }).catch(() => {
        // If network fails (offline), return cached index.html for navigation
        if (event.request.mode === 'navigate') {
          return caches.match('./index.html');
        }
      });
    })
  );
});
