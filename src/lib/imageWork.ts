/** One image pipeline per process; waiting uploads stay streamed rather than
 * buffering and decoding several full camera images at the same time. */
export class ImageBusyError extends Error {
  constructor() { super("Сервер обрабатывает другие фото. Повтори через несколько секунд."); }
}
type Gate = { running: boolean; waiting: (() => void)[] };
const shared = globalThis as typeof globalThis & { __ygImageGate?: Gate };
const gate = shared.__ygImageGate ??= { running: false, waiting: [] };
export async function withImageWork<T>(work: () => Promise<T>): Promise<T> {
  if (gate.running) {
    if (gate.waiting.length >= 4) throw new ImageBusyError();
    await new Promise<void>(resolve => gate.waiting.push(resolve));
  } else gate.running = true;
  try { return await work(); }
  finally {
    const next = gate.waiting.shift();
    if (next) next(); // transfer the occupied slot without opening a race
    else gate.running = false;
  }
}
