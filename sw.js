const CACHE_NAME = 'picciuli-v1';
const ASSETS = [
  '/Finanze-personali/',
  '/Finanze-personali/index.html',
  '/Finanze-personali/icons/icon-512x512.png',
  '/Finanze-personali/icons/favicon.ico',
  '/Finanze-personali/css/styles.css',
  '/Finanze-personali/js/app.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(ASSETS))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => response || fetch(event.request))
  );
});
