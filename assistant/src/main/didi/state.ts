import { EventEmitter } from "node:events";

/**
 * То же самое, что logger.ts делает для текстовых строк, но для текущей
 * фазы голосового цикла — рендерер подписывается через IPC и рисует по
 * ней живой индикатор (см. src/renderer/src/components/Orb.tsx), а не
 * парсит текст живого журнала.
 */
export type DidiState = "idle" | "listening" | "thinking" | "speaking";

export const didiState = new EventEmitter();

let current: DidiState = "idle";

export function setState(state: DidiState): void {
  if (state === current) return;
  current = state;
  didiState.emit("change", state);
}

export function getState(): DidiState {
  return current;
}
