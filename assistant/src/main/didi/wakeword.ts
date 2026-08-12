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
  log(`[wakeword] пробую поднять локальный детектор: py -3.13 "${script}"`);

  // "python" в PATH на Windows нередко резолвится в 0-байтовый alias-стаб
  // Microsoft Store (AppData\Local\Microsoft\WindowsApps\python.exe) — он
  // молча зависает без единой строки в stdout/stderr, если его запускает
  // GUI-процесс без консоли (ровно наш случай: Electron main). Настоящий
  // py-лаунчер (C:\Windows\py.exe, обычный exe, не Store-алиас) с явной
  // версией эту проблему обходит; -3.13 — конкретно та установка, где
  // стоят openwakeword/onnxruntime (см. `py -0`). Если лаунчера или этой
  // версии нет, ниже сработает штатный child.on("error") с ENOENT и
  // тихим откатом на Whisper — как и раньше для машин без Python вовсе.
  let child: ChildProcessWithoutNullStreams;
  try {
    child = spawn("py", ["-3.13", script], { stdio: ["pipe", "pipe", "pipe"] });
  } catch (e) {
    log(`[wakeword] не удалось запустить процесс: ${e instanceof Error ? e.message : e}`, "warn");
    return null;
  }

  const wakeCallbacks: Array<(score: number) => void> = [];
  const stderrLines: string[] = [];

  // once(), а не on() — и снимается явно ниже сразу после READY, иначе
  // остался бы висеть и задвоился бы с постоянным обработчиком "упал
  // ПОСЛЕ старта" (тот вешается только когда ready === true), выдавая
  // неверный текст ("до READY") на самом деле для более позднего краша.
  let earlyExit: (code: number | null, signal: NodeJS.Signals | null) => void = () => {};

  const ready = await new Promise<boolean>((resolve) => {
    const timeout = setTimeout(() => {
      log(
        `[wakeword] не дождалась READY за 15с (модель не загрузилась или python завис)${stderrLines.length ? " — последний stderr: " + stderrLines.at(-1) : ""}`,
        "warn",
      );
      resolve(false);
    }, 15_000); // загрузка ONNX-модели — не мгновенная

    child.on("error", (e) => {
      // сюда попадает в первую очередь ENOENT — "py" не нашёлся в PATH
      // именно в том окружении, в котором Electron был запущен (у GUI-
      // процесса, запущенного двойным кликом на ярлык, PATH может отличаться
      // от того, что видно из терминала при разработке).
      clearTimeout(timeout);
      log(`[wakeword] ошибка процесса: ${e.message}`, "warn");
      resolve(false);
    });

    // Регистрируем ДО получения READY, а не только после (как раньше) —
    // если процесс упадёт ещё во время загрузки модели, раньше это тихо
    // тонуло в общем таймауте 15с ("не дождалась READY") без объяснения
    // причины; теперь видно явно и сразу.
    earlyExit = (code, signal) => {
      clearTimeout(timeout);
      log(`[wakeword] процесс завершился до READY (код ${code}, сигнал ${signal})`, "warn");
      resolve(false);
    };
    child.once("exit", earlyExit);

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

  child.removeListener("exit", earlyExit);

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
