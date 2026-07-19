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
};

export default nextConfig;
