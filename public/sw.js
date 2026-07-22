/* YeahDays service worker — офлайн-кэш + управляемое обновление */
const CACHE = "yeahdays-v3";
const PRECACHE = [
  "/",
  "/today",
  "/calendar",
  "/progress",
  "/account",
  "/manifest.webmanifest",
  "/icon.svg",
  "/models/rigged_man.glb",
];

self.addEventListener("install", (event) => {
  // НЕ вызываем skipWaiting: новый воркер ждёт, пока пользователь сам
  // нажмёт «Обновить» или закроет/переоткроет приложение. Это защищает
  // открытую сессию от внезапной подмены кэша и ошибок ленивых чанков.
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(PRECACHE)));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))),
      )
      .then(() => self.clients.claim()),
  );
});

// Страница просит применить обновление немедленно.
self.addEventListener("message", (event) => {
  if (event.data === "SKIP_WAITING" || event.data?.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // навигации: сеть -> кэш -> корень
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(request, copy));
          return res;
        })
        .catch(() => caches.match(request).then((r) => r || caches.match("/"))),
    );
    return;
  }

  // прочее: stale-while-revalidate
  event.respondWith(
    caches.match(request).then((cached) => {
      const network = fetch(request)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(request, copy));
          return res;
        })
        .catch(() => cached);
      return cached || network;
    }),
  );
});
