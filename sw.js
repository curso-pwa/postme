self.addEventListener('install', (event) => {
  console.info('[SW] Install ...');
});
self.addEventListener('activate', async (event) => {
  console.info('[SW] Activate ...');
});
self.addEventListener('fetch', (event) => {
  console.info('[SW] Fetch ...');
});