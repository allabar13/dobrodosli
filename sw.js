"use strict";
// ── Сервис-воркер: офлайн-кэш ────────────────────────────────────────────
// Стратегия network-first: всегда сначала сеть (правки доезжают сразу),
// кэш — запасной вариант, чтобы приложение открывалось без интернета.
const CACHE = 'dobrodosli-v2';

self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== location.origin) return; // облако и шрифты не кэшируем
  e.respondWith(
    // cache:'no-cache' — мимо HTTP-кэша браузера с ревалидацией (ETag),
    // иначе после деплоя старый JS может залипнуть надолго.
    fetch(req, { cache: 'no-cache' }).then(res => {
      if (res.ok) {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(req, copy));
      }
      return res;
    }).catch(() => caches.match(req, { ignoreSearch: true }))
  );
});
