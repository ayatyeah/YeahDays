import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { needsLogin } from "@/lib/publicPaths";

/**
 * Регистрация обязательна везде, кроме витрины и юридических страниц —
 * список и исключения в lib/publicPaths.ts (его же читает SessionGuard в
 * браузере). Видна ли навигация — отдельный список MARKETING в Shell.tsx.
 *
 * Файл называется proxy.ts, а не middleware.ts — в Next.js 16 конвенция
 * переименована (см. npx @next/codemod middleware-to-proxy).
 */
export default auth((req) => {
  const { pathname } = req.nextUrl;
  if (req.auth || !needsLogin(pathname)) return;

  const url = new URL("/login", req.nextUrl.origin);
  // pathname один без search — раньше терял query (?client_id=...&redirect_uri=...
  // у /oauth/authorize), после логина человек попадал на страницу без единого
  // параметра.
  url.searchParams.set("callbackUrl", pathname + req.nextUrl.search);
  return NextResponse.redirect(url);
});

export const config = {
  // Всё, кроме /api/*, служебных путей Next и файлов со статикой
  // (расширение в пути — иконки, manifest, sw.js и т.п.).
  // events-data — статический JSON ивентов, вход не нужен (см. lib/publicPaths)
  matcher: ["/((?!api|_next/static|_next/image|events-data|.*\\..*).*)"],
};
