const CACHE = 'naplex-study-v4';
const FILES = ['./', './index.html', './styles.css', './content.js', './extra-content.js', './audit-data.js', './content-audit.md', './practice-core.js', './app.js', './sync-core.js', './sync.js', './manifest.webmanifest', './icon.svg', './icon-192.png', './icon-512.png'];
const FIREBASE_FILES = ['firebase-app.js','firebase-auth.js','firebase-firestore.js'].map(file => 'https://www.gstatic.com/firebasejs/11.10.0/' + file);
self.addEventListener('install', event => event.waitUntil(caches.open(CACHE).then(async cache => {
  await cache.addAll(FILES);
  // These are optional for installation; if online, cache them before the first offline reopening.
  await Promise.allSettled(FIREBASE_FILES.map(file => cache.add(file)));
}).then(() => self.skipWaiting())));
self.addEventListener('activate', event => event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key.startsWith('naplex-study-') && key !== CACHE).map(key => caches.delete(key)))).then(() => self.clients.claim())));
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  if (event.request.method !== 'GET') return;
  if (url.origin !== self.location.origin) {
    // Cache only the pinned, public Firebase SDK so a previously signed-in user can reopen offline.
    if (url.origin !== 'https://www.gstatic.com' || !url.pathname.startsWith('/firebasejs/11.10.0/')) return;
    event.respondWith(fetch(event.request).then(response => {
      if (response.ok) caches.open(CACHE).then(cache => cache.put(event.request, response.clone()));
      return response;
    }).catch(() => caches.match(event.request).then(hit => hit || Response.error())));
    return;
  }
  event.respondWith(fetch(event.request).then(response => {
    if (response.ok) caches.open(CACHE).then(cache => cache.put(event.request, response.clone()));
    return response;
  }).catch(() => caches.match(event.request).then(hit => hit || (event.request.mode === 'navigate' ? caches.match('./index.html') : Response.error()))));
});
