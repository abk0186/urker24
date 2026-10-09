// Уркер 24 — минимальный service worker: только оболочка сайта (HTML/CSS/JS/иконки).
// Всё со своего домена — «сначала сеть», кэш только как запасной вариант без интернета.
// Запросы к Supabase и другим доменам НЕ перехватываются и НЕ кэшируются. Админка не кэшируется.
const CACHE = 'urker-shell-v2';
const SHELL = ['/', '/index.html', '/manifest.webmanifest', '/icon-192.png', '/icon-512.png', '/apple-touch-icon.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).catch(() => {}).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request; if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;                 // Supabase, YouTube, WhatsApp и т.п. — мимо
  if (url.pathname.startsWith('/admin')) return;                   // админка — всегда из сети
  if (url.pathname === '/config.js') return;                       // настройки — всегда свежие, мимо SW
  if (!/(\.(html|css|js|png|jpg|webmanifest)|\/)$/.test(url.pathname)) return;
  e.respondWith(fetch(req).then(res => {
    if (res.ok && res.type === 'basic') { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); }
    return res;
  }).catch(() => caches.match(req).then(r => r || caches.match(req, {ignoreSearch: true}))
    .then(r => r || (req.mode === 'navigate' ? caches.match('/') : Response.error()))));
});
