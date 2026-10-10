/**
 * Куда пускают без входа. Регистрация обязательна везде, кроме витрины и
 * юридических страниц; /login и /register публичные, иначе войти неоткуда.
 *
 * Список один на двоих: proxy.ts проверяет вход на сервере, SessionGuard —
 * в браузере, когда раздел открыт из кэша service worker'а и сервер его не
 * видел. Разойдись они — вышедший из аккаунта застрял бы в приложении.
 */
export const PUBLIC_PATHS = new Set([
  "/",
  "/terms",
  "/privacy",
  "/login",
  "/login/lms",
  "/register",
  "/forgot-password",
]);

/**
 * Нужен ли вход на этом адресе.
 *
 * /invite/<код> открывают из чата люди без аккаунта: страница сама
 * предложит зарегистрироваться и вернёт обратно по callbackUrl.
 * /admin — своя дверь: туда пускают либо владельческий аккаунт, либо
 * логин с паролем консоли (см. lib/adminSession.ts), проверяет сама страница.
 * /events-data — статический JSON с содержимым ивентов (одинаковым у всех):
 * без входа переадресация на /login попала бы в кэш service worker'а вместо
 * данных, а сами конспекты и раньше лежали в открытых JS-файлах.
 */
export function needsLogin(pathname: string): boolean {
  return !(PUBLIC_PATHS.has(pathname) || pathname.startsWith("/invite/") || pathname.startsWith("/admin") || pathname.startsWith("/events-data/"));
}
