import { heartbeat } from "./yeahgrind.js";

const HEARTBEAT_INTERVAL_MS = 15_000;

/** true — можно откликаться на кодовое слово. Пульт из панели в браузере читается сюда. */
let enabled = true;

export function isEnabled(): boolean {
  return enabled;
}

/** Стучится в /api/assistant/heartbeat, пока процесс жив — панель судит online/offline по свежести. */
export function startPresenceLoop(): void {
  const tick = async () => {
    try {
      const res = await heartbeat();
      enabled = res.enabled;
    } catch (e) {
      console.warn("[presence] heartbeat не прошёл:", e instanceof Error ? e.message : e);
    }
  };
  void tick();
  setInterval(tick, HEARTBEAT_INTERVAL_MS);
}
