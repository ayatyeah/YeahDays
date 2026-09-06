/* YeahGrind service worker — офлайн, кэш, уведомления.
 *
 * Версия кэша берётся из ?v= в адресе регистрации (id сборки). Каждая
 * сборка = новый кэш и новый воркер, поэтому пользователь не может залипнуть
 * на старом бандле, а руками версию правит никто и никогда не забывает.
 */

const BUILD = new URL(self.location.href).searchParams.get("v") || "dev";

/** Оболочка приложения: HTML разделов и то, без чего экран не соберётся. */
const SHELL = `yg-shell-${BUILD}`;
/** Неизменяемые ассеты сборки (/_next/static/**) — живут между версиями. */
const STATIC = "yg-static";
/** Картинки и иконки — тоже переживают деплой. */
const MEDIA = "yg-media";

const PRECACHE = [
  "/app",
  "/today",
  "/calendar",
  "/progress",
  "/account",
  "/settings",
  "/offline",
  "/manifest.webmanifest",
  "/favicon.png",
  "/icon-192.png",
  "/logo.webp",
  "/logo-white.webp",
  "/characters/slim.webp",
  "/characters/fit.webp",
  "/characters/jacked.webp",
];

/** Сколько записей держим в рантайм-кэшах, чтобы не съесть квоту устройства. */
const LIMITS = { [STATIC]: 160, [MEDIA]: 80 };

/* ────────────────────────  Жизненный цикл  ──────────────────────── */

self.addEventListener("install", (event) => {
  // НЕ вызываем skipWaiting: новый воркер ждёт, пока пользователь сам нажмёт
  // «Обновить» или переоткроет приложение. Подмена кэша под открытой сессией
  // ломает ленивые чанки — экран падает в белое на ровном месте.
  event.waitUntil(
    caches.open(SHELL).then((cache) =>
      // addAll падает целиком, если хоть один адрес отдал не 200; кладём по
      // одному, чтобы единственная неудача не оставила приложение без кэша
      Promise.all(
        PRECACHE.map((url) =>
          cache.add(new Request(url, { cache: "reload" })).catch(() => {}),
        ),
      ),
    ),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      // Навигационный preload: браузер начинает запрос страницы параллельно
      // со стартом воркера, а не после него. На холодном старте это заметные
      // сотни миллисекунд.
      if (self.registration.navigationPreload) {
        await self.registration.navigationPreload.enable().catch(() => {});
      }
      const keys = await caches.keys();
      await Promise.all(
        keys
          .filter((k) => k.startsWith("yg-shell-") && k !== SHELL)
          .map((k) => caches.delete(k)),
      );
      // старые кэши прошлой схемы именования
      await Promise.all(
        keys.filter((k) => k.startsWith("yeahdays-")).map((k) => caches.delete(k)),
      );
      await self.clients.claim();
    })(),
  );
});

self.addEventListener("message", (event) => {
  if (event.data === "SKIP_WAITING" || event.data?.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

/* ────────────────────────  Кэш  ──────────────────────── */

/** Подрезаем кэш по количеству записей: FIFO, самые старые уходят первыми. */
async function trim(cacheName) {
  const limit = LIMITS[cacheName];
  if (!limit) return;
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  if (keys.length <= limit) return;
  await Promise.all(keys.slice(0, keys.length - limit).map((k) => cache.delete(k)));
}

async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  const hit = await cache.match(request);
  if (hit) return hit;
  const res = await fetch(request);
  if (res.ok && res.type === "basic") {
    await cache.put(request, res.clone());
    trim(cacheName);
  }
  return res;
}

async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const hit = await cache.match(request);
  const network = fetch(request)
    .then((res) => {
      if (res.ok && res.type === "basic") {
        cache.put(request, res.clone()).then(() => trim(cacheName));
      }
      return res;
    })
    .catch(() => hit);
  return hit || network;
}

/**
 * Навигация: сеть с ограничением по времени → кэш → офлайн-страница.
 *
 * Таймаут принципиален. Без него в метро или при «есть сеть, но нет
 * интернета» приложение висит белым экраном до тайм-аута ОС, хотя рабочая
 * копия лежит в кэше в паре миллисекунд.
 */
async function navigate(event) {
  const cache = await caches.open(SHELL);

  try {
    const preload = await event.preloadResponse;
    const fresh =
      preload ||
      (await Promise.race([
        fetch(event.request),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error("slow-network")), 3500),
        ),
      ]));
    if (fresh && fresh.ok) {
      cache.put(event.request, fresh.clone()).catch(() => {});
    }
    return fresh;
  } catch {
    const cached =
      (await cache.match(event.request)) ||
      (await cache.match(new URL(event.request.url).pathname)) ||
      (await cache.match("/app"));
    return cached || (await cache.match("/offline")) || Response.error();
  }
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // API никогда не кэшируем: /api/state — это синк аккаунта, и ответ из
  // кэша отдавал устаревший снимок («аккаунт не обновляется» при входе).
  if (url.pathname.startsWith("/api/")) return;

  // RSC-пейлоады тоже мимо: закэшированный кусок дерева от прошлой сборки
  // ломает гидратацию куда неприятнее, чем лишний запрос.
  if (url.searchParams.has("_rsc") || request.headers.get("RSC") === "1") {
    return;
  }

  if (request.mode === "navigate") {
    event.respondWith(navigate(event));
    return;
  }

  // Сборочные ассеты неизменяемы по контракту Next — только кэш.
  if (url.pathname.startsWith("/_next/static/")) {
    event.respondWith(cacheFirst(request, STATIC));
    return;
  }

  if (
    request.destination === "image" ||
    request.destination === "font" ||
    url.pathname.startsWith("/_next/image")
  ) {
    event.respondWith(staleWhileRevalidate(request, MEDIA));
    return;
  }

  event.respondWith(staleWhileRevalidate(request, SHELL));
});

/* ────────────────────────  Уведомления  ──────────────────────── */

/**
 * Кнопки в уведомлении зависят от того, о чём оно.
 *
 * Про активную задачу — «Сделал» и «+10 минут»: человек закрывает дело, не
 * открывая приложение, и это единственный способ, которым напоминание
 * экономит время, а не отнимает его.
 */
function actionsFor(data) {
  if (data.kind === "task" && data.taskId) {
    return [
      { action: "complete", title: "Сделал" },
      { action: "snooze", title: "+10 мин" },
    ];
  }
  if (data.kind === "todo") {
    return [{ action: "snooze", title: "+10 мин" }];
  }
  return [];
}

self.addEventListener("push", (event) => {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch {
    data = { title: "YeahGrind", body: event.data ? event.data.text() : "" };
  }

  const title = data.title || "YeahGrind";
  const tag = data.tag || "yeahgrind";

  event.waitUntil(
    self.registration.showNotification(title, {
      body: data.body || "",
      icon: "/icon-192.png",
      badge: "/favicon.png",
      tag,
      // renotify true осмысленно только с тем же тегом: обновление статуса
      // задачи должно заменять прошлое уведомление, а не копиться стопкой
      renotify: Boolean(data.kind === "task"),
      requireInteraction: data.kind === "task",
      vibrate: data.kind === "task" ? [18, 40, 18] : [12],
      timestamp: Date.now(),
      actions: actionsFor(data),
      data: {
        url: data.url || "/app",
        key: tag,
        kind: data.kind || "day",
        taskId: data.taskId || null,
      },
    }),
  );
});

/** Открытые вкладки приложения, если они есть. */
async function appClients() {
  return self.clients.matchAll({ type: "window", includeUncontrolled: true });
}

self.addEventListener("notificationclick", (event) => {
  const data = event.notification.data || {};
  const action = event.action;
  event.notification.close();

  event.waitUntil(
    (async () => {
      const clients = await appClients();

      // «Сделал» и «+10 минут» обрабатывает приложение: только оно знает
      // состояние плана. Если открытых вкладок нет — уводим в приложение с
      // параметром, и оно закроет задачу сразу после гидратации.
      if (action === "complete" || action === "snooze") {
        if (clients.length > 0) {
          for (const client of clients) {
            client.postMessage({
              type: "YD_NOTIFY_ACTION",
              action,
              taskId: data.taskId,
              key: data.key,
            });
          }
          if (action === "complete") await clients[0].focus().catch(() => {});
          return;
        }
        if (action === "complete" && data.taskId) {
          await self.clients.openWindow(
            `/app?do=complete&task=${encodeURIComponent(data.taskId)}`,
          );
        }
        return;
      }

      const target = data.url || "/app";
      for (const client of clients) {
        if ("focus" in client) {
          client.navigate?.(target);
          return client.focus();
        }
      }
      return self.clients.openWindow(target);
    })(),
  );
});

/* ────────────────────────  Фоновая синхронизация  ──────────────────────── */

/**
 * Сеть вернулась — просим приложение выгрузить накопленную офлайн-очередь
 * событий. Сама очередь живёт в приложении: воркер только будит его.
 */
self.addEventListener("sync", (event) => {
  if (event.tag !== "yd-flush-events") return;
  event.waitUntil(
    appClients().then((clients) => {
      for (const client of clients) {
        client.postMessage({ type: "YD_FLUSH_EVENTS" });
      }
    }),
  );
});

/** Раз в сутки подогреваем оболочку, чтобы офлайн-запуск был свежим. */
self.addEventListener("periodicsync", (event) => {
  if (event.tag !== "yd-refresh-shell") return;
  event.waitUntil(
    caches.open(SHELL).then((cache) =>
      Promise.all(
        ["/app", "/today", "/offline"].map((url) =>
          cache.add(new Request(url, { cache: "reload" })).catch(() => {}),
        ),
      ),
    ),
  );
});
