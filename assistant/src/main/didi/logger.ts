import { EventEmitter } from "node:events";

/**
 * Раньше весь голосовой цикл писал прямо в console.log — этого достаточно
 * для CLI, но GUI (Electron-окно) не видит консоль процесса. Вместо того
 * чтобы протаскивать колбэк через каждый модуль, все важные строки идут
 * через этот общий emitter — main-процесс Electron подписывается один раз
 * и пересылает в renderer через IPC (см. src/main/index.ts).
 */
export const didiLog = new EventEmitter();

export type LogLevel = "info" | "warn" | "error";

export function log(message: string, level: LogLevel = "info"): void {
  const line = `[${new Date().toLocaleTimeString("ru-RU")}] ${message}`;
  if (level === "error") console.error(line);
  else if (level === "warn") console.warn(line);
  else console.log(line);
  didiLog.emit("line", { level, message, at: Date.now() });
}
