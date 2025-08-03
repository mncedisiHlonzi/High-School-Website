const CACHE_NAME = "shengeza-cache-v1";
const urlsToCache = [
  "https://shengez.co.za/",
  "https://shengez.co.za/blog",
  "https://shengez.co.za/css/style.css",
  "https://shengez.co.za/icons/icon-192x192.png",
  "https://shengez.co.za/icons/icon-512x512.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
