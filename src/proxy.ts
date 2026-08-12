import { NextResponse } from "next/server";
import { auth } from "@/auth";

/**
 * Регистрация обязательна везде, кроме витрины и юридических страниц —
 * см. тот же список MARKETING в Shell.tsx (там он про то, видна ли
 * навигация; здесь — про то, нужен ли вход вообще). /login и /register
 * само собой публичные, иначе войти будет неоткуда.
 *
 * Файл называется proxy.ts, а не middleware.ts — в Next.js 16 конвенция
 * переименована (см. npx @next/codemod middleware-to-proxy).
 */
const PUBLIC_PATHS = new Set(["/", "/terms", "/privacy", "/login", "/register"]);

export default auth((req) => {
  const { pathname } = req.nextUrl;
  if (req.auth || PUBLIC_PATHS.has(pathname)) return;

  const url = new URL("/login", req.nextUrl.origin);
  url.searchParams.set("callbackUrl", pathname);
  return NextResponse.redirect(url);
});

export const config = {
  // Всё, кроме /api/*, служебных путей Next и файлов со статикой
  // (расширение в пути — иконки, manifest, sw.js и т.п.).
  matcher: ["/((?!api|_next/static|_next/image|.*\\..*).*)"],
};
