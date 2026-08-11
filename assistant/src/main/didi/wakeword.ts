import { spawn, type ChildProcessWithoutNullStreams } from "node:child_process";
import { createInterface } from "node:readline";
import path from "node:path";
import electron from "electron";
import { log } from "./logger.js";

const { app } = electron;

/**
 * Путь к detect.py: в dev — рядом с исходниками (cwd = assistant/), в
 * упакованном приложении — резервная копия ВНЕ .asar (asarUnpack в
 * electron-builder.yml), потому что python.exe не умеет читать файлы
 * изнутри виртуальной asar-файловой системы, нужен настоящий путь на диске.
 */
function scriptPath(): string {
  return app.isPackaged
    ? path.join(process.resourcesPath, "app.asar.unpacked", "wakeword", "detect.py")
    : path.join(process.cwd(), "wakeword", "detect.py");
}

export interface WakewordDetector {
  /** Скормить один кадр (тот же формат, что пишет PvRecorder — Int16Array). Ничего не возвращает, срабатывание — через onWake. */
  feed(frame: Int16Array): void;
  onWake(cb: (score: number) => void): void;
  /** false — процесс неожиданно завершился (упал/убит) уже ПОСЛЕ успешного старта. voiceLoop.ts проверяет это, чтобы не кормить кадрами мёртвый пайп молча. */
  isAlive(): boolean;
  stop(): void;
}

/**
 * Пробует поднять локальный детектор (openWakeWord, Python-подпроцесс).
 * Если Python не найден, openwakeword не установлен или модель не
 * загрузилась — возвращает null за разумное время, а не висит и не роняет
 * процесс: вызывающий код (voiceLoop.ts) в этом случае переходит на старый
 * путь через Whisper. Локальный детектор — это опциональное усиление
 * приватности/экономии, а не обязательная зависимость.
 */
export async function tryStartLocalWakeword(): Promise<WakewordDetector | null> {
  const script = scriptPath();
  log(`[wakeword] пробую поднять локальный детектор: python "${script}"`);

  let child: ChildProcessWithoutNullStreams;
  try {
    child = spawn("python", [script], { stdio: ["pipe", "pipe", "pipe"] });
  } catch (e) {
    log(`[wakeword] не удалось запустить процесс: ${e instanceof Error ? e.message : e}`, "warn");
    return null;
  }

  const wakeCallbacks: Array<(score: number) => void> = [];
  const stderrLines: string[] = [];

  const ready = await new Promise<boolean>((resolve) => {
    const timeout = setTimeout(() => {
      log(
        `[wakeword] не дождалась READY за 15с (модель не загрузилась или python завис)${stderrLines.length ? " — последний stderr: " + stderrLines.at(-1) : ""}`,
        "warn",
      );
      resolve(false);
    }, 15_000); // загрузка ONNX-модели — не мгновенная

    child.on("error", (e) => {
      // сюда попадает в первую очередь ENOENT — "python" не нашёлся в PATH
      // именно в том окружении, в котором Electron был запущен (у GUI-
      // процесса, запущенного двойным кликом на ярлык, PATH может отличаться
      // от того, что видно из терминала при разработке).
      clearTimeout(timeout);
      log(`[wakeword] ошибка процесса: ${e.message}`, "warn");
      resolve(false);
    });

    const rl = createInterface({ input: child.stdout });
    rl.on("line", (line) => {
      const trimmed = line.trim();
      if (trimmed === "READY") {
        clearTimeout(timeout);
        resolve(true);
        return;
      }
      if (trimmed.startsWith("ERROR")) {
        log(`[wakeword] Python сообщил об ошибке: ${trimmed}`, "warn");
        clearTimeout(timeout);
        resolve(false);
        return;
      }
      if (trimmed.startsWith("WAKE")) {
        const score = Number(trimmed.split(" ")[1] ?? "0");
        for (const cb of wakeCallbacks) cb(score);
      }
    });

    child.stderr.on("data", (chunk: Buffer) => {
      const text = chunk.toString("utf8").trim();
      stderrLines.push(text);
      log(`[wakeword] stderr: ${text}`, "warn");
    });
  });

  if (!ready) {
    try {
      child.kill();
    } catch {
      // уже мог не запуститься вовсе
    }
    return null;
  }

  let alive = true;
  child.on("exit", (code, signal) => {
    alive = false;
    // code === null обычно значит "убит сигналом", не обычное завершение —
    // сама причина (segfault в onnxruntime, OOM, и т.п.) без stderr-вывода
    // от Python отсюда не видна, поэтому пишем всё, что есть.
    log(`[wakeword] процесс распознавания слова неожиданно завершился (код ${code}, сигнал ${signal})`, "error");
  });

  return {
    feed(frame: Int16Array) {
      if (!alive || !child.stdin.writable) return;
      const buf = Buffer.from(frame.buffer, frame.byteOffset, frame.byteLength);
      child.stdin.write(buf);
    },
    onWake(cb) {
      wakeCallbacks.push(cb);
    },
    isAlive() {
      return alive;
    },
    stop() {
      try {
        child.stdin.end();
        child.kill();
      } catch {
        // уже остановлен
      }
    },
  };
}
