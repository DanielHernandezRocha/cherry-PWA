const CACHE_NAME = "cherry-pwa-1.0";
const GH_REPO = "/cherry-PWA"; // ← exactamente como aparece en la URL

const urlsToCache = [
  `${GH_REPO}/`,
  `${GH_REPO}/index.html`,
  `${GH_REPO}/offline.html`,
  `${GH_REPO}/css/style.css`,
  `${GH_REPO}/js/main.js`,
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
    }).catch(() => caches.match(`${GH_REPO}/offline.html`))
  );
});
