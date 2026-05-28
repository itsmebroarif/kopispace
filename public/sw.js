/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

const CACHE_NAME = 'kopispace-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json'
];

// Installation: Cache App Shell
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('KopiSpace Service Worker: Shell assets cached successfully.');
        return cache.addAll(ASSETS_TO_CACHE);
      })
      .then(() => self.skipWaiting())
  );
});

// Cache activation
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            console.log('KopiSpace Service Worker: Cleared stale client cache.', cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

// Fetch Interceptor: Network-first fallback to Cache
self.addEventListener('fetch', event => {
  // Only handle standard http/https schemes (avoid browser extensions)
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then(response => {
        // If solid response, clone and cache it dynamically!
        if (response.status === 200) {
          const resClone = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, resClone);
          });
        }
        return response;
      })
      .catch(() => {
        // Fallback to cache resource if network offline!
        return caches.match(event.request);
      })
  );
});
