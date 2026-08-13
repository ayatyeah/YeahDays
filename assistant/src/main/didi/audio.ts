import { spawn, type ChildProcessWithoutNullStreams } from "node:child_process";
import { createInterface } from "node:readline";
import { mkdtemp, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { PvRecorder } from "@picovoice/pvrecorder-node";
import { config } from "./config.js";
import { log } from "./logger.js";

/** Стандарт для распознавания речи 16-бит моно — то же, чем раньше пользовался Porcupine. */
const FRAME_LENGTH = 512;
const SAMPLE_RATE = 16000;

/** Сколько подряд тихих кадров считать концом фразы (кадр ≈ 32мс на 16кГц/512). */
const SILENCE_FRAMES_TO_STOP = 24; // ≈ 0.75с — компромисс: короче режет слова на вдохе
/** Не даём микрофону слушать одну фразу вечно. */
const MAX_UTTERANCE_FRAMES = 400; // ≈ 12.5с
/** Подряд громких кадров, чтобы считать это НАЧАЛОМ речи, а не щелчком/шорохом комнаты. */
const SPEECH_START_FRAMES = 4; // ≈ 128мс
/**
 * Короче этого — не полноценная фраза, а обрывок шума; в Whisper не
 * отправляем. 1с по умолчанию — для фонового прослушивания (ждём кодовое
 * слово или ищем его через STT), где короткие щелчки — почти всегда не
 * речь. Для записи КОМАНДЫ после уже сработавшего кодового слова
 * recordUntilSilence зовут с меньшим значением (voiceLoop.ts) — там
 * контекст уже установлен, это заведомо попытка что-то сказать, а не шум,
 * и короткая команда вроде "стоп" не должна отбрасываться как обрывок.
 */
const MIN_UTTERANCE_SECONDS_DEFAULT = 1.0;

function rms(frame: Int16Array): number {
  let sum = 0;
  for (const s of frame) sum += s * s;
  return Math.sqrt(sum / frame.length);
}

/** Минимальный WAV-writer: моно PCM16, без внешних зависимостей. */
function pcmToWav(samples: Int16Array, sampleRate: number): Buffer {
  const dataSize = samples.length * 2;
  const buf = Buffer.alloc(44 + dataSize);
  buf.write("RIFF", 0);
  buf.writeUInt32LE(36 + dataSize, 4);
  buf.write("WAVE", 8);
  buf.write("fmt ", 12);
  buf.writeUInt32LE(16, 16);
  buf.writeUInt16LE(1, 20); // PCM
  buf.writeUInt16LE(1, 22); // mono
  buf.writeUInt32LE(sampleRate, 24);
  buf.writeUInt32LE(sampleRate * 2, 28); // byte rate
  buf.writeUInt16LE(2, 32); // block align
  buf.writeUInt16LE(16, 34); // bits per sample
  buf.write("data", 36);
  buf.writeUInt32LE(dataSize, 40);
  Buffer.from(samples.buffer, samples.byteOffset, samples.byteLength).copy(buf, 44);
  return buf;
}

/**
 * Проигрывает WAV синхронно (блокирует до конца звука) через встроенный
 * SoundPlayer — тот, что назначен ПО УМОЛЧАНИЮ в Windows (динамик/наушники,
 * что бы ни было default playback device). Если PlaySync() отрабатывает
 * без ошибки, но звука не слышно на практике — самое частое реальное
 * объяснение снаружи этого кода: не тот default-девайс в Windows, звук
 * приглушён в микшере громкости конкретно для этого процесса, либо просто
 * физически выключены колонки/наушники — SoundPlayer этого никак не видит
 * и не может сообщить как ошибку.
 *
 * Раньше на КАЖДЫЙ вызов запускался новый powershell.exe — старт самого
 * процесса (инициализация .NET CLR) стоит реальные ~150-400мс, и это
 * платилось на каждое озвученное предложение (см. voice.ts::startStreamingSpeech,
 * там playWav зовётся по разу на предложение). Держим один-единственный
 * powershell.exe живым на весь голосовой цикл и гоняем через его stdin/stdout
 * пути к файлам построчно — сам механизм воспроизведения (SoundPlayer.PlaySync)
 * не меняется, меняется только то, что процесс не пересоздаётся заново.
 */
let player: ChildProcessWithoutNullStreams | null = null;
let playerOut: ReturnType<typeof createInterface> | null = null;
const pending: Array<(err: Error | null) => void> = [];

/** Скрипт живёт в стеке PowerShell весь голосовой цикл: читает путь построчно из stdin, проигрывает, печатает маркер. */
const PLAYER_SCRIPT = [
  "$ErrorActionPreference = 'SilentlyContinue'",
  "while ($true) {",
  "  $line = [Console]::In.ReadLine()",
  "  if ($null -eq $line) { break }",
  "  try {",
  "    (New-Object Media.SoundPlayer $line).PlaySync()",
  "    [Console]::Out.WriteLine('__DONE__')",
  "  } catch {",
  "    [Console]::Out.WriteLine('__ERR__')",
  "  }",
  "}",
].join("; ");

function ensurePlayer(): ChildProcessWithoutNullStreams {
  if (player && player.exitCode === null && !player.killed) return player;

  const proc = spawn("powershell.exe", ["-NoProfile", "-NonInteractive", "-Command", PLAYER_SCRIPT], {
    stdio: ["pipe", "pipe", "pipe"],
    windowsHide: true,
  });
  player = proc;
  playerOut = createInterface({ input: proc.stdout });
  playerOut.on("line", (line) => {
    const resolve = pending.shift();
    if (!resolve) return;
    resolve(line === "__DONE__" ? null : new Error("SoundPlayer вернул ошибку"));
  });
  proc.on("exit", () => {
    // Процесс упал сам (не мы его останавливали) — не оставляем висящие
    // ожидания зависшими: следующий playWav() просто пересоздаст процесс.
    if (player === proc) player = null;
    while (pending.length) pending.shift()!(new Error("плеер завершился раньше ответа"));
  });
  return proc;
}

/** Останавливает постоянный процесс-плеер — звать при выключении голосового цикла, чтобы не плодить висящие powershell.exe. */
export function stopPlayer(): void {
  playerOut?.close();
  playerOut = null;
  player?.stdin.end();
  player?.kill();
  player = null;
  while (pending.length) pending.shift()!(new Error("плеер остановлен"));
}

export async function playWav(wav: Buffer): Promise<void> {
  if (wav.length < 100) {
    log(`[audio] подозрительно маленький WAV на воспроизведение (${wav.length} байт) — TTS мог вернуть пустышку`, "warn");
  }
  const dir = await mkdtemp(path.join(tmpdir(), "didi-"));
  const file = path.join(dir, "out.wav");
  await writeFile(file, wav);
  try {
    const proc = ensurePlayer();
    await new Promise<void>((resolve, reject) => {
      pending.push((err) => (err ? reject(err) : resolve()));
      proc.stdin.write(file + "\n");
    });
  } finally {
    await rm(dir, { recursive: true, force: true }).catch(() => {});
  }
}

/** Порог тишины — калибруется под комнату при старте, см. calibrateSilenceThreshold(). */
let silenceThreshold = 350;

/**
 * Меряет фоновый шум комнаты ~2с и поднимает порог тишины над ним с
 * запасом. Без этого порог, подобранный один раз, "плывёт" при смене
 * микрофона/громкости входа: если пользователь потом поднимет громкость
 * в Windows (например, чтобы ДиДи вообще слышала), тот же порог начинает
 * ловить обычный шум комнаты как "начало фразы" — короткие обрывки почти
 * тишины летят в Whisper и тот отвечает "audio corrupted or unsupported".
 *
 * Медиана, а не среднее — один случайный громкий кадр (стук, скрип
 * стула) в момент калибровки не должен задирать порог выше реальной
 * речи. Верхний потолок — по той же причине: если калибровка всё равно
 * попала на шумный момент, лучше ложные срабатывания, чем ДиДи, которая
 * не может услышать вообще ничего.
 */
export async function calibrateSilenceThreshold(recorder: PvRecorder): Promise<void> {
  const samples: number[] = [];
  for (let i = 0; i < 60; i++) {
    samples.push(rms(await recorder.read()));
  }
  samples.sort((a, b) => a - b);
  const median = samples[Math.floor(samples.length / 2)]!;
  // Потолок 700 был занижен под тихую комнату времён первой калибровки —
  // в реально шумной комнате (медиана шума ощутимо выше 700 сама по себе)
  // порог тишины оказывался НИЖЕ фонового шума: обычный шум комнаты сам
  // по себе не давал детектору тишины сработать, запись обрывалась
  // ненадёжно, Whisper получал огрызки — прямая причина "не расслышала".
  // 3500 — с большим запасом под шумные комнаты, нижний пол (350) не трогаем.
  silenceThreshold = Math.min(Math.max(median * 2.5, 350), 3500);
  log(`[audio] фоновый шум (медиана) ≈${median.toFixed(0)}, порог тишины выставлен на ${silenceThreshold.toFixed(0)}`);
}

export function createRecorder(): PvRecorder {
  const recorder = new PvRecorder(FRAME_LENGTH, config.audioDeviceIndex);
  recorder.start();
  log(`[audio] слушаю через "${recorder.getSelectedDevice()}"…`);
  return recorder;
}

/** Печатать уровень звука, пока ждём начала фразы. WAKEWORD_DEBUG=0 — выключить. */
const DEBUG = process.env.WAKEWORD_DEBUG !== "0";
const DEBUG_EVERY_N_FRAMES = 8; // 8 * 32мс ≈ 0.25с

/**
 * Ждёт начала речи (несколько громких кадров подряд — не единичный щелчок).
 * Без timeoutMs — без ограничения по времени вообще (так слушает фоновый
 * цикл в ожидании кодового слова: это отдельная фаза от самой записи,
 * иначе "жду речь" и "пишу фразу" делят один лимит кадров, и если не
 * успеть заговорить за ~12.5с, функция тихо возвращает пусто и всё по
 * новой — выглядит как "не отвечает"). С timeoutMs — специально для
 * "сказали только кодовое слово, ждём команду": если в этот раз никто
 * ничего не говорит, не висеть вечно, а тихо вернуться к фоновому
 * прослушиванию — раньше здесь ждала бесконечно.
 */
async function waitForSpeechStart(recorder: PvRecorder, timeoutMs?: number): Promise<boolean> {
  let loudStreak = 0;
  let frameCount = 0;
  const deadline = timeoutMs != null ? Date.now() + timeoutMs : Infinity;
  for (;;) {
    if (Date.now() > deadline) return false;

    const frame = await recorder.read();
    const level = rms(frame);
    const loud = level >= silenceThreshold;
    loudStreak = loud ? loudStreak + 1 : 0;

    frameCount++;
    if (DEBUG && frameCount % DEBUG_EVERY_N_FRAMES === 0) {
      log(`[level] ${level.toFixed(0).padStart(5)} порог=${silenceThreshold.toFixed(0)}`);
    }

    if (loudStreak >= SPEECH_START_FRAMES) {
      if (DEBUG) log(`[audio] речь началась (уровень ${level.toFixed(0)}), пишу…`);
      return true;
    }
  }
}

/**
 * Пишет фразу от начала (уже обнаруженного) до тишины и возвращает WAV.
 * null — если получился обрывок короче minUtteranceSeconds (отправлять
 * такое в Whisper бессмысленно) ИЛИ если задан timeoutMs и речь вообще не
 * началась за это время.
 *
 * Используется и для ожидания кодовой фразы (без таймаута), и для записи
 * команды после неё (с таймаутом) — в STT-детекции это одна и та же
 * операция: "дождись и запиши следующую фразу целиком", а распознаёт её
 * вызывающий код (voiceLoop.ts).
 */
export async function recordUntilSilence(
  recorder: PvRecorder,
  timeoutMs?: number,
  minUtteranceSeconds = MIN_UTTERANCE_SECONDS_DEFAULT,
): Promise<Buffer | null> {
  const started = await waitForSpeechStart(recorder, timeoutMs);
  if (!started) return null; // таймаут ожидания начала речи — не фраза, не ошибка

  const collected: number[] = [];
  let silentFrames = 0;

  for (let i = 0; i < MAX_UTTERANCE_FRAMES; i++) {
    const frame = await recorder.read();
    collected.push(...frame);
    if (rms(frame) >= silenceThreshold) {
      silentFrames = 0;
    } else {
      silentFrames++;
      if (silentFrames >= SILENCE_FRAMES_TO_STOP) break;
    }
  }

  const seconds = (collected.length / SAMPLE_RATE).toFixed(2);
  const minSamples = SAMPLE_RATE * minUtteranceSeconds;
  if (collected.length < minSamples) {
    if (DEBUG) log(`[audio] обрывок ${seconds}с — короче ${minUtteranceSeconds}с, отбрасываю`);
    return null;
  }
  if (DEBUG) log(`[audio] записано ${seconds}с, распознаю…`);
  return pcmToWav(Int16Array.from(collected), SAMPLE_RATE);
}

/** Как recordUntilSilence, но без null — по-тихому переслушивает, если поймало только шум. */
export async function recordSpeech(recorder: PvRecorder): Promise<Buffer> {
  for (;;) {
    const wav = await recordUntilSilence(recorder);
    if (wav) return wav;
  }
}
