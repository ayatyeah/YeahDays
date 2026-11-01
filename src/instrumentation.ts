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
  const { startResearchRetention } = await import("@/lib/researchRetention");
  startResearchRetention();
}

export async function onRequestError(_error: unknown, request: { path: string }) {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;
  const { recordSignal } = await import("@/lib/diagnostics");
  await recordSignal({ kind: "server_error", route: request.path, code: "error", status: 500 });
}
