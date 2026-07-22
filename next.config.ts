import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

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
