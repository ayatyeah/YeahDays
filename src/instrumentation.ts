/**
 * Next зовёт register() один раз при старте сервера. Здесь поднимаем
 * фоновые задачи, которым нужен живой процесс, — сейчас это таймер
 * уведомлений (см. lib/pushScheduler.ts). Только в Node-рантайме: в edge
 * нет ни таймеров надолго, ни Prisma.
 */
export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;
  const { startPushScheduler } = await import("@/lib/pushScheduler");
  startPushScheduler();
}
