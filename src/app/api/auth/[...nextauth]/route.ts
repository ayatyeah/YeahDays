import type { NextRequest } from "next/server";
import { handlers } from "@/auth";

/**
 * ВРЕМЕННАЯ ДИАГНОСТИКА входа через Google. Убрать, когда починим.
 *
 * Что уже проверено и исключено: AUTH_SECRET на Railway совпадает с
 * локальным (сверен kid у JWE-куки), AUTH_GOOGLE_ID верный, секрет верный
 * (Google на неверный отвечает invalid_client, а нам отвечает
 * invalid_grant — то есть аутентификация клиента ПРОХОДИТ), часы сервера
 * не расходятся, реплика одна, service worker /api/ не трогает, версии
 * @auth/core и oauth4webapi не менялись.
 *
 * По исключению в обмене кода остаётся один непроверенный вход —
 * code_verifier из PKCE-куки. Он же объясняет вторую ошибку в логах
 * (InvalidCheck: pkceCodeVerifier value could not be parsed). Логируем,
 * доезжает ли кука до колбэка и каким именем.
 *
 * Значения кук НЕ пишем — только имена: в значениях секреты.
 */
function logCallback(req: NextRequest) {
  const url = new URL(req.url);
  if (!url.pathname.includes("/callback/")) return;

  const raw = req.headers.get("cookie") ?? "";
  const names = raw
    .split(";")
    .map((c) => c.trim().split("=")[0])
    .filter(Boolean);

  const pkce = names.find((n) => n.includes("pkce"));
  const state = names.find((n) => n.includes("state"));

  console.log("[diag] callback", {
    path: url.pathname,
    proto: req.headers.get("x-forwarded-proto"),
    host: req.headers.get("x-forwarded-host") ?? req.headers.get("host"),
    hasCode: url.searchParams.has("code"),
    hasState: url.searchParams.has("state"),
    // Главное: пришла ли PKCE-кука и под каким именем (с префиксом
    // __Secure- или без — от этого зависит соль расшифровки).
    pkceCookie: pkce ?? "ОТСУТСТВУЕТ",
    stateCookie: state ?? "ОТСУТСТВУЕТ",
    cookieNames: names,
  });
}

const { GET: authGET, POST: authPOST } = handlers;

export async function GET(req: NextRequest) {
  logCallback(req);
  return authGET(req);
}

export async function POST(req: NextRequest) {
  logCallback(req);
  return authPOST(req);
}
