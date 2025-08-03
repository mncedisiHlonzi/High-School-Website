const CACHE_NAME = 'shengeza-cache-v1';
const OFFLINE_URL = '/offline.html'; // Use relative path (more reliable)

const ASSETS_TO_CACHE = [
  '/', // homepage
  '/offline.html',
  '/css/style.css',
  '/js/script.js',
  '/js/swiper-bundle.min.js',
  '/Images/favicon/site.webmanifest.json',
  '/Images/favicon/android-chrome-192x192.png',
  '/Images/favicon/android-chrome-512x512.png',
  '/Images/favicon/maskable-icon.png'
];

// Install Service Worker and Cache Assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS_TO_CACHE))
  );
  self.skipWaiting();
});

// Activate: Clean old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(key => {
        if (key !== CACHE_NAME) return caches.delete(key);
      }))
    )
  );
  self.clients.claim();
});

// Fetch: Serve from cache or fallback
self.addEventListener('fetch', event => {
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .catch(() => caches.match(OFFLINE_URL))
    );
  } else {
    event.respondWith(
      caches.match(event.request).then(response => {
        return response || fetch(event.request);
      })
    );
  }
});
