/* YeahGrind service worker — офлайн-кэш, обновление, push-уведомления */

/**
 * Версия кэша берётся из ?v= в адресе регистрации, который подставляет
 * приложение из id сборки. Раньше версия правилась руками — про неё
 * забывали, и пользователи месяцами сидели на старом бандле, считая, что
 * у них свежая версия. Теперь каждая сборка = новый кэш и новый воркер.
 */
const BUILD =
  new URL(self.location.href).searchParams.get("v") || "dev";
const CACHE = `yeahdays-${BUILD}`;
const PRECACHE = [
  "/",
  "/app",
  "/today",
  "/calendar",
  "/progress",
  "/account",
  "/manifest.webmanifest",
  "/favicon.png",
  "/logo.png",
  "/logo-white.png",
  "/characters/slim.png",
  "/characters/fit.png",
  "/characters/jacked.png",
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

/* ────────────────────────  Push-уведомления  ──────────────────────── */

self.addEventListener("push", (event) => {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch {
    data = { title: "YeahGrind", body: event.data ? event.data.text() : "" };
  }

  const title = data.title || "YeahGrind";
  event.waitUntil(
    self.registration.showNotification(title, {
      body: data.body || "",
      icon: "/logo.png",
      badge: "/favicon.png",
      tag: data.tag || "yeahdays",
      renotify: false,
      data: { url: data.url || "/app" },
    }),
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const target = event.notification.data?.url || "/app";

  // если приложение уже открыто — фокусируем вкладку, а не плодим новые
  event.waitUntil(
    self.clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clients) => {
        for (const client of clients) {
          if ("focus" in client) {
            client.navigate?.(target);
            return client.focus();
          }
        }
        return self.clients.openWindow(target);
      }),
  );
});

/* ────────────────────────  Кэш  ──────────────────────── */

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // API никогда не кэшируем: /api/state — это синк аккаунта, и stale-ответ
  // из кэша воркера отдавал устаревший снимок (аккаунт «не обновлялся» при
  // входе). Пусть идут в сеть напрямую; свой HTTP-кэш у них есть.
  if (url.pathname.startsWith("/api/")) return;

  // навигации: сеть -> кэш -> корень
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(request, copy));
          return res;
        })
        .catch(() => caches.match(request).then((r) => r || caches.match("/app"))),
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
