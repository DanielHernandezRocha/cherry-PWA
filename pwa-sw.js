const CACHE_NAME = "cherry-pwa-1.0";
const urlsToCache = [
  "/",
  "index.html",
  "offline.html",
  "css/style.css",
  "js/main.js",
  "https://cdn-icons-png.flaticon.com/512/686/686351.png"
];

self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener("fetch", e => {
  e.respondWith(
    caches.match(e.request).then(response => {
      return response || fetch(e.request);
    }).catch(() => caches.match("offline.html"))
  );
});