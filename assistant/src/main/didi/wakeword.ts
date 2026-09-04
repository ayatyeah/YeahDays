import { spawn, type ChildProcessWithoutNullStreams } from "node:child_process";
import { createInterface } from "node:readline";
import path from "node:path";
import electron from "electron";
import { log } from "./logger.js";

const { app } = electron;

/**
 * Путь к vosk_detect.py: в dev — рядом с исходниками (cwd = assistant/), в
 * упакованном приложении — резервная копия ВНЕ .asar (asarUnpack в
 * electron-builder.yml), потому что python.exe не умеет читать файлы
 * изнутри виртуальной asar-файловой системы, нужен настоящий путь на диске.
 * Модель (wakeword/vosk-model-ru/) лежит рядом со скриптом по той же причине.
 */
function scriptPath(): string {
  return app.isPackaged
    ? path.join(process.resourcesPath, "app.asar.unpacked", "wakeword", "vosk_detect.py")
    : path.join(process.cwd(), "wakeword", "vosk_detect.py");
}

export interface WakewordDetector {
  /** Скормить один кадр (тот же формат, что пишет PvRecorder — Int16Array). Ничего не возвращает, срабатывание — через onWake. */
  feed(frame: Int16Array): void;
  /** text — распознанный кусок речи, из-за которого сработало (для лога, не для логики). */
  onWake(cb: (text: string) => void): void;
  /** false — процесс неожиданно завершился (упал/убит) уже ПОСЛЕ успешного старта. voiceLoop.ts проверяет это, чтобы не кормить кадрами мёртвый пайп молча. */
  isAlive(): boolean;
  stop(): void;
}

/**
 * Пробует поднять локальный детектор кодового слова (Vosk с ограниченной
 * грамматикой, Python-подпроцесс — см. wakeword/vosk_detect.py). Раньше тут
 * был openWakeWord, но его единственная готовая модель заточена под "hey
 * jarvis" и не подходит для "СалемАй"; своя ONNX-модель не обучена — это
 * отдельная задача (синтетические сэмплы, тренировка, Linux-only пайплайн).
 * Vosk с грамматикой — компромисс без обучения: список из нескольких слов
 * жёстко ограничивает то, что модель вообще может "услышать" (см. GRAMMAR
 * в vosk_detect.py), что и убирает путаницу коротких слов, характерную
 * для открытого словаря Whisper.
 *
 * Если Python не найден, vosk не установлен или модель не загрузилась —
 * возвращает null за разумное время, а не висит и не роняет процесс:
 * вызывающий код (voiceLoop.ts) в этом случае переходит на Whisper.
 */
export async function tryStartLocalWakeword(): Promise<WakewordDetector | null> {
  const script = scriptPath();
  const isWindows = process.platform === "win32";
  const [cmd, args] = isWindows ? ["py", ["-3.13", script]] : ["python3", [script]];
  log(`[wakeword] пробую поднять локальный детектор: ${cmd} ${args.join(" ")}`);

  // "python" в PATH на Windows нередко резолвится в 0-байтовый alias-стаб
  // Microsoft Store (AppData\Local\Microsoft\WindowsApps\python.exe) — он
  // молча зависает без единой строки в stdout/stderr, если его запускает
  // GUI-процесс без консоли (ровно наш случай: Electron main). Настоящий
  // py-лаунчер (C:\Windows\py.exe, обычный exe, не Store-алиас) с явной
  // версией эту проблему обходит; -3.13 — конкретно та установка, где
  // стоят vosk/onnxruntime (см. `py -0`). На Linux/macOS такого алиас-стаба
  // нет — обычный "python3" из PATH достаточен. Если ни лаунчера, ни этой
  // версии нет, ниже сработает штатный child.on("error") с ENOENT и тихим
  // откатом на Whisper — как и раньше для машин без Python вовсе.
  //
  // PYTHONIOENCODING=utf-8 — без этого Python на Windows пишет в pipe
  // системной кодировкой консоли (не UTF-8), и кириллица в WAKE-строках
  // превращается в мусор на стороне Node.
  let child: ChildProcessWithoutNullStreams;
  try {
    child = spawn(cmd, args, {
      stdio: ["pipe", "pipe", "pipe"],
      env: { ...process.env, PYTHONIOENCODING: "utf-8" },
    });
  } catch (e) {
    log(`[wakeword] не удалось запустить процесс: ${e instanceof Error ? e.message : e}`, "warn");
    return null;
  }

  const wakeCallbacks: Array<(text: string) => void> = [];
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
    }, 15_000); // загрузка модели — не мгновенная

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
        const text = trimmed.slice("WAKE".length).trim();
        for (const cb of wakeCallbacks) cb(text);
      }
    });

    child.stderr.on("data", (chunk: Buffer) => {
      const text = chunk.toString("utf8").trim();
      // Vosk сам по себе многословный на stderr (загрузка модели, служебные
      // WARNING про слова вне словаря грамматики — ожидаемо, не поломка) —
      // в живой журнал такое не пишем, только копим на случай реальной
      // ошибки старта (см. таймаут выше).
      stderrLines.push(text);
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
  let stoppedByUs = false;
  child.on("exit", (code, signal) => {
    alive = false;
    if (stoppedByUs) {
      // Сами остановили (кнопка "Выключить") — это не поломка, писать
      // как error было вводящим в заблуждение: выглядело так, будто
      // процесс упал сам по себе, ровно в момент штатного выключения.
      log("[wakeword] процесс распознавания слова остановлен.");
      return;
    }
    // code === null обычно значит "убит сигналом", не обычное завершение —
    // сама причина без stderr-вывода от Python отсюда не видна, поэтому
    // ничего больше сказать не можем.
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
      stoppedByUs = true;
      try {
        child.stdin.end();
        child.kill();
      } catch {
        // уже остановлен
      }
    },
  };
}
