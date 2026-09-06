import type { NextConfig } from "next";

/**
 * Id сборки. Уезжает в ?v= при регистрации service worker: каждая сборка
 * получает свой кэш, поэтому пользователи не залипают на старом бандле.
 * В dev остаётся стабильным, чтобы воркер не пересоздавался на каждый шаг.
 */
const BUILD_ID =
  process.env.RAILWAY_GIT_COMMIT_SHA?.slice(0, 8) ??
  (process.env.NODE_ENV === "production"
    ? Date.now().toString(36)
    : "dev");

const nextConfig: NextConfig = {
  reactStrictMode: true,

  // Круглая кнопка «N» dev-режима сидит в левом нижнем углу страницы — и на
  // телефонной ширине садится ровно на первый пункт нижней навигации,
  // закрывая «Главную». В проде её нет, в dev она только мешает: ошибки
  // всё равно всплывают оверлеем, статус компиляции виден в терминале.
  devIndicators: false,

  // Заголовок с версией Next — бесплатная подсказка тому, кто ищет
  // уязвимости под конкретный релиз. Пользы от него нет никакой.
  poweredByHeader: false,

  env: {
    NEXT_PUBLIC_BUILD_ID: BUILD_ID,
  },

  // Next 16 встроенный тайп-чек пока несовместим с нативным TypeScript 7
  // (падает на детекте пакета). Проверяем типы отдельно: `npm run typecheck`
  // (tsc --noEmit проходит чисто). Так сборка не падает, а типобезопасность
  // сохраняется через CI/локальный скрипт.
  typescript: {
    ignoreBuildErrors: true,
  },

  experimental: {
    /**
     * Точечные импорты вместо целых пакетов. framer-motion и lucide-подобные
     * библиотеки тянут за собой весь индекс, даже если нужен один компонент;
     * на телефоне это лишние сотни килобайт разбора JS в самый неудачный
     * момент — при первом запуске.
     */
    optimizePackageImports: ["framer-motion", "zustand"],
  },

  async headers() {
    return [
      {
        // sw.js нельзя кэшировать надолго — иначе браузер до суток не заметит
        // новый воркер и обновление не прилетит. no-cache = всегда перепроверять.
        source: "/sw.js",
        headers: [
          { key: "Cache-Control", value: "no-cache, no-store, must-revalidate" },
          { key: "Service-Worker-Allowed", value: "/" },
        ],
      },
      {
        // Манифест меняется редко, но не «никогда»: сутки кэша + фоновая
        // ревалидация — компромисс между установкой без задержки и тем,
        // чтобы новые ярлыки доезжали до уже установленного приложения.
        source: "/manifest.webmanifest",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400, stale-while-revalidate=604800",
          },
          { key: "Content-Type", value: "application/manifest+json" },
        ],
      },
      // Иконки, лого и картинки персонажа: имена файлов стабильные, а
      // содержимое меняется раз в полгода — держим в кэше долго, но с
      // фоновой ревалидацией. Перечислены явно, без regex в source:
      // синтаксис шаблонов у Next менялся между мажорами, а простые пути
      // работают одинаково во всех версиях.
      ...[
        "/icon-192.png",
        "/icon-512.png",
        "/icon-maskable-512.png",
        "/apple-icon.png",
        "/favicon.png",
        "/logo.png",
        "/logo-white.png",
        "/characters/:path*",
        "/shots/:path*",
      ].map((source) => ({
        source,
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=604800, stale-while-revalidate=2592000",
          },
        ],
      })),
      {
        // Базовая гигиена заголовков. Ничего экзотического — только то, что
        // не может сломать работающее приложение.
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-DNS-Prefetch-Control", value: "on" },
        ],
      },
    ];
  },
};

export default nextConfig;
