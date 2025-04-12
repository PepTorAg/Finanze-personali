const CACHE_NAME = 'picciuli-v3';
const ASSETS = [
  '/Finanze-personali/',
  '/Finanze-personali/index.html',
  '/Finanze-personali/icons/*',
  '/Finanze-personali/manifest.json'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS))
  );
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request)
      .then(response => response || fetch(e.request))
  );
});
