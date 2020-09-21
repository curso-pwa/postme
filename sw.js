const CACHE_NAME_CORE = 'cache-v1';
const CACHE_FILES_CORE = [
  'src/images/icons/icon-144x144.png',
  'src/css/app.css',
  'src/images/computer.jpg',
  'src/js/app.js',
  'index.html',
  '/'
];
const CACHE_NAME_DYNAMIC = 'dynamic-v1';

const CACHE_NAME_INMUTABLE = 'inmutable-v1';
const CACHE_FILES_INMUTABLE = [
  'https://fonts.googleapis.com/icon?family=Material+Icons',
  'https://code.getmdl.io/1.3.0/material.brown-orange.min.css',
  'https://code.getmdl.io/1.3.0/material.min.js',
  'https://fonts.gstatic.com/s/roboto/v20/KFOmCnqEu92Fr1Mu4mxK.woff2',
  'https://fonts.gstatic.com/s/materialicons/v55/flUhRq6tzZclQEJ-Vdg-IuiaDsNc.woff2',
  'https://unpkg.com/pwacompat'
];

self.addEventListener('install', (event) => {
  const guardandoCache = caches.open(CACHE_NAME_CORE)
    .then(cache => cache.addAll(CACHE_FILES_CORE))
    .catch(err => console.error(err.message));
  const guardandoCacheInmutable = caches.open(CACHE_NAME_INMUTABLE)
    .then(cache => cache.addAll(CACHE_FILES_INMUTABLE))
    .catch(err => console.error(err.message));
  self.skipWaiting();
  event.waitUntil(Promise.all([guardandoCache, guardandoCacheInmutable]));
});
self.addEventListener('activate', (event) => {
  console.info('[SW]: Archivos exitosamente guardados...');
});
self.addEventListener('fetch', (event)=> {

  if(!(event.request.url.indexOf('http') === 0)){
    return;
  }

  // Primera estrategia: Solo cache
  // const soloCache = caches.match(event.request);
  // event.respondWith(soloCache);
  
  // Segunda estrategia: Solo red
  // const soloRed = fetch(event.request);
  // event.respondWith(soloRed);

  // Tercera Estrategia: Cache pidiendo ayuda a la red
  // const cacheAyudaRed = caches.match(event.request)
  //   .then(page => page || fetch(event.request));
  // event.respondWith(cacheAyudaRed);

  // Cuarta estrategia: Red pidiendo ayuda al cache
  // OK = 200, 201 , 301
  // ERROR = 400, 401, 500

  // const respuesta = new Response('Esta es la parte que fallo');

  // const redAyudaCache = fetch(event.request)
  //   .then(page => page)
  //   .catch(murioInternet => {
  //     return caches.match(event.request)
  //       .then(archivoBuscado => archivoBuscado.status !== 200)
  //       .catch(archivo => respuesta);
  //   });
  // event.respondWith(redAyudaCache);


  // Estrategia final: Caché luego red
  const cacheLuegoRed = caches.open(CACHE_NAME_DYNAMIC)
    .then(cache => {
      return fetch(event.request)
        .then(response => {
          cache.put(event.request, response.clone());
          return response;
        })
    });
  event.respondWith(cacheLuegoRed);

});

self.addEventListener('sync', (event) => {
  console.log('----------------------------------');
  console.log(event);
  console.log('-----------------------------------');
});

self.addEventListener('push', (event) => {
  console.error(event);
});