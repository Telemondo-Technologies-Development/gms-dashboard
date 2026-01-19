/*
 * Minimal no-op service worker.
 *
 * This file exists to prevent 404/NoResourceFoundException errors when a browser
 * tries to fetch /sw.js (often due to an old SW registration on the same origin).
 *
 * We intentionally do not cache or intercept requests.
 */

self.addEventListener('install', (event) => {
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim())
})

self.addEventListener('fetch', () => {
  // no-op
})
