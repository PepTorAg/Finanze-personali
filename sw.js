const CACHE_NAME = 'picciuli-v1';
const urlsToCache = [
  '/Finanze-personali/',
  '/Finanze-personali/index.html',
  '/Finanze-personali/icons/manifest.json',
  '/Finanze-personali/icons/favicon.ico',
  '/Finanze-personali/icons/favicon-32x32.png',
  '/Finanze-personali/icons/favicon-16x16.png',
  '/Finanze-personali/icons/apple-icon-180x180.png',
  '/Finanze-personali/icons/icon-512x512.png',
  '/Finanze-personali/icons/android-icon-192x192.png',
  '/Finanze-personali/icons/icon-144x144.png',
  '/Finanze-personali/icons/icon-96x96.png',
  '/Finanze-personali/icons/ms-icon-150x150.png',
  '/Finanze-personali/icons/browserconfig.xml'
];

// Installazione: cache delle risorse essenziali
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Caching files during install');
        return cache.addAll(urlsToCache);
      })
      .catch(err => console.error('Errore in install:', err))
  );
  self.skipWaiting(); // forza l’attivazione immediata del nuovo SW
});

// Attivazione: pulizia delle vecchie cache
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(name => {
          if (name !== CACHE_NAME) {
            console.log('Rimuovo cache obsoleta:', name);
            return caches.delete(name);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Intercettazione delle richieste: strategia stale-while-revalidate
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      const fetchPromise = fetch(event.request)
        .then(networkResponse => {
          // Aggiorna la cache con la risposta ottenuta dalla rete
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, networkResponse.clone());
          });
          return networkResponse;
        })
        .catch(() => {
          // Se il fetch fallisce, restituisce la risposta dalla cache (se disponibile)
          return response;
        });
      // Ritorna subito la risposta in cache se disponibile, altrimenti attende il fetch
      return response || fetchPromise;
    })
  );
});
