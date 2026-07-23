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

  // sw.js нельзя кэшировать надолго — иначе браузер до суток не заметит
  // новый воркер и обновление не прилетит. no-cache = всегда перепроверять.
  async headers() {
    return [
      {
        source: "/sw.js",
        headers: [
          { key: "Cache-Control", value: "no-cache, no-store, must-revalidate" },
          { key: "Service-Worker-Allowed", value: "/" },
        ],
      },
    ];
  },
};

export default nextConfig;
