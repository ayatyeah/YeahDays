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
  "/favicon-v3.png",
  "/icon-192-v3.png",
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
  event.waitUntil(fillShell());
});

/**
 * Положить в кэш оболочку приложения — то, чего там ещё нет.
 *
 * Ответ после редиректа не берём. Воркер обычно ставится с витрины, когда
 * человек ещё не вошёл: на /today и остальные разделы сервер отвечает
 * переадресацией на /login, и раньше под адресом раздела в кэш ложилась
 * страница входа. Стоило сети подтормозить после входа — воркер отдавал её
 * вместо раздела, и человек снова видел форму входа, пока не перезагрузит.
 * Разделы докладываются сюда позже, когда приложение открыто уже после
 * входа (сообщение PRECACHE из ServiceWorkerRegister).
 */
async function fillShell() {
  const cache = await caches.open(SHELL);
  // addAll падает целиком, если хоть один адрес отдал не 200; кладём по
  // одному, чтобы единственная неудача не оставила приложение без кэша
  await Promise.all(
    PRECACHE.map(async (url) => {
      try {
        if (await cache.match(url)) return;
        const res = await fetch(new Request(url, { cache: "reload" }));
        if (res.ok && !res.redirected) await cache.put(url, res);
      } catch {
        /* нет сети — докладём в следующий раз */
      }
    }),
  );
}

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
  if (event.data?.type === "PRECACHE") {
    event.waitUntil(fillShell());
  }
  // Выход из аккаунта: без копий разделов следующий запуск пойдёт на сервер
  // и сразу получит вход, а не мелькнёт приложением прошлого человека.
  // После входа их снова доложит PRECACHE.
  if (event.data?.type === "FORGET_SHELL") {
    event.waitUntil(
      caches.open(SHELL).then(async (cache) => {
        const keys = await cache.keys();
        await Promise.all(
          keys
            .filter((req) => INSTANT.has(new URL(req.url).pathname))
            .map((req) => cache.delete(req)),
        );
      }),
    );
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
 * Разделы-оболочки. Их HTML статичный и одинаковый у всех: данные
 * аккаунта приходят уже в браузере. Поэтому копию из кэша отдаём сразу,
 * а не после сети — иначе на каждом запуске PWA человек секунды смотрит
 * на белый экран, пока телефон заново поднимает соединение с сервером.
 * Вход проверяет SessionGuard в браузере: копия из кэша сервер минует.
 */
const INSTANT = new Set(["/app", "/today", "/calendar", "/progress", "/account", "/settings"]);

/** Обновить копию раздела в фоне — к следующему запуску она будет свежей. */
async function refresh(event, cache, path) {
  try {
    // Safari не отдаёт preload, если на навигацию уже ответили кэшем: промис
    // висит вечно. Ждём его недолго, дальше — обычный запрос.
    const preload = await Promise.race([
      event.preloadResponse,
      new Promise((resolve) => setTimeout(resolve, 2000)),
    ]);
    const res = preload || (await fetch(event.request.url, { cache: "no-store" }));
    // переадресация на вход (кончилась сессия) сюда не попадает: у неё
    // redirected, а без следования за ней — ok false
    if (res && res.ok && !res.redirected) await cache.put(path, res);
  } catch {
    /* нет сети — останется прежняя копия */
  }
}

/**
 * Навигация: оболочка — из кэша сразу; остальное — сеть с ограничением по
 * времени → кэш → офлайн-страница.
 *
 * Таймаут принципиален. Без него в метро или при «есть сеть, но нет
 * интернета» приложение висит белым экраном до тайм-аута ОС, хотя рабочая
 * копия лежит в кэше в паре миллисекунд.
 */
async function navigate(event) {
  const cache = await caches.open(SHELL);
  const path = new URL(event.request.url).pathname;

  if (INSTANT.has(path)) {
    const cached = await cache.match(path);
    if (cached && !cached.redirected) {
      event.waitUntil(refresh(event, cache, path));
      return cached;
    }
  }

  try {
    // preload тоже под таймаутом: раньше его ждали сколько угодно
    const fresh = await Promise.race([
      (async () => (await event.preloadResponse) || fetch(event.request))(),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("slow-network")), 3500),
      ),
    ]);
    if (fresh && fresh.ok) {
      cache.put(event.request, fresh.clone()).catch(() => {});
    }
    return fresh;
  } catch {
    const cached =
      (await cache.match(event.request)) ||
      (await cache.match(new URL(event.request.url).pathname)) ||
      (await cache.match("/app"));
    // Ответ «после редиректа» браузер для перехода по ссылке не примет — такой мог остаться от прежней версии воркера.
    const usable = cached && !cached.redirected ? cached : null;
    return usable || (await cache.match("/offline")) || Response.error();
  }
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // API никогда не кэшируем: /api/state — это синк аккаунта, и ответ из
  // кэша отдавал устаревший снимок («аккаунт не обновляется» при входе).
  const authPage = url.pathname === "/login" || url.pathname.startsWith("/login/") || url.pathname === "/register";
  if (url.pathname.startsWith("/api/") || authPage) {
    if (request.mode === "navigate") {
      // Preload has already sent this request. Ignoring it replays OAuth's
      // single-use code and Microsoft rejects the second exchange (invalid_grant).
      // Never cache auth responses or retry a failed preload automatically.
      event.respondWith((async () => (await event.preloadResponse) || fetch(request))());
    }
    return;
  }

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
      icon: "/icon-192-v3.png",
      badge: "/favicon-v3.png",
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
