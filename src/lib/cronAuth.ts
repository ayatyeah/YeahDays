/**
 * Проверка секрета крона. Без неё эндпоинт, рассылающий уведомления всем
 * подписчикам, — открытая кнопка спама. Нет секрета в env — закрыто для всех.
 */
export function cronAuthorized(req: Request): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  const header =
    req.headers.get("authorization") ?? req.headers.get("x-cron-secret") ?? "";
  return header === `Bearer ${secret}` || header === secret;
}
