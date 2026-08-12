import { heartbeat } from "./yeahgrind.js";

const HEARTBEAT_INTERVAL_MS = 15_000;

/** true — можно откликаться на кодовое слово. Пульт из панели в браузере читается сюда. */
let enabled = true;

export function isEnabled(): boolean {
  return enabled;
}

/**
 * Обновить локальный флаг сразу, не дожидаясь ближайшего heartbeat (до
 * 15с). Кнопка "Включить" в приложении сообщает об этом серверу (см.
 * bridge.ts::setEnabled), но без этого вызова локальная копия здесь
 * узнавала бы о смене состояния только на следующем тике — кодовое
 * слово в этом окне ловилось, а команда молча дропалась как "на паузе".
 */
export function setLocalEnabled(value: boolean): void {
  enabled = value;
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
