import { execFile } from "node:child_process";
import { mkdtemp, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { PvRecorder } from "@picovoice/pvrecorder-node";
import { config } from "./config.js";

/** Стандарт для распознавания речи 16-бит моно — то же, чем раньше пользовался Porcupine. */
const FRAME_LENGTH = 512;
const SAMPLE_RATE = 16000;

/** Сколько подряд тихих кадров считать концом фразы (кадр ≈ 32мс на 16кГц/512). */
const SILENCE_FRAMES_TO_STOP = 24; // ≈ 0.75с — компромисс: короче режет слова на вдохе
/** Не даём микрофону слушать одну фразу вечно. */
const MAX_UTTERANCE_FRAMES = 400; // ≈ 12.5с
/** Подряд громких кадров, чтобы считать это НАЧАЛОМ речи, а не щелчком/шорохом комнаты. */
const SPEECH_START_FRAMES = 4; // ≈ 128мс
/** Короче этого — не полноценная фраза, а обрывок шума; в Whisper не отправляем. */
const MIN_UTTERANCE_SAMPLES = SAMPLE_RATE * 1.0; // 1с

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

/** Проигрывает WAV синхронно (блокирует до конца звука) через встроенный SoundPlayer. */
export async function playWav(wav: Buffer): Promise<void> {
  const dir = await mkdtemp(path.join(tmpdir(), "didi-"));
  const file = path.join(dir, "out.wav");
  await writeFile(file, wav);
  const psPath = file.replace(/'/g, "''");
  await new Promise<void>((resolve, reject) => {
    execFile(
      "powershell.exe",
      ["-NoProfile", "-Command", `(New-Object Media.SoundPlayer '${psPath}').PlaySync()`],
      (err) => (err ? reject(err) : resolve()),
    );
  }).finally(() => rm(dir, { recursive: true, force: true }).catch(() => {}));
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
  silenceThreshold = Math.min(Math.max(median * 2.5, 350), 700);
  console.log(`[audio] фоновый шум (медиана) ≈${median.toFixed(0)}, порог тишины выставлен на ${silenceThreshold.toFixed(0)}`);
}

export function createRecorder(): PvRecorder {
  const recorder = new PvRecorder(FRAME_LENGTH, config.audioDeviceIndex);
  recorder.start();
  console.log(`[audio] слушаю через "${recorder.getSelectedDevice()}"…`);
  return recorder;
}

/** Печатать уровень звука, пока ждём начала фразы. WAKEWORD_DEBUG=0 — выключить. */
const DEBUG = process.env.WAKEWORD_DEBUG !== "0";
const DEBUG_EVERY_N_FRAMES = 8; // 8 * 32мс ≈ 0.25с

/**
 * Ждёт начала речи (несколько громких кадров подряд — не единичный щелчок).
 * Без ограничения по времени: это отдельная фаза от самой записи, иначе
 * "жду речь" и "пишу фразу" делят один и тот же лимит кадров, и если не
 * успеть заговорить за ~12.5с, функция тихо возвращает пусто и всё
 * по новой — выглядит как "не отвечает", хотя на самом деле просто ждала
 * не в то окно.
 */
async function waitForSpeechStart(recorder: PvRecorder): Promise<void> {
  let loudStreak = 0;
  let frameCount = 0;
  for (;;) {
    const frame = await recorder.read();
    const level = rms(frame);
    const loud = level >= silenceThreshold;
    loudStreak = loud ? loudStreak + 1 : 0;

    frameCount++;
    if (DEBUG && frameCount % DEBUG_EVERY_N_FRAMES === 0) {
      const bar = "#".repeat(Math.min(50, Math.floor(level / 50)));
      console.log(`[level] ${level.toFixed(0).padStart(5)} ${bar.padEnd(50)} порог=${silenceThreshold.toFixed(0)}`);
    }

    if (loudStreak >= SPEECH_START_FRAMES) {
      if (DEBUG) console.log(`[audio] речь началась (уровень ${level.toFixed(0)}), пишу…`);
      return;
    }
  }
}

/**
 * Пишет фразу от начала (уже обнаруженного) до тишины и возвращает WAV.
 * null — если получился обрывок короче MIN_UTTERANCE_SAMPLES: отправлять
 * такое в Whisper бессмысленно, он либо ничего не разберёт, либо ответит
 * ошибкой формата.
 *
 * Используется и для ожидания кодовой фразы, и для записи команды — в
 * STT-детекции это одна и та же операция: "дождись и запиши следующую
 * фразу целиком", а распознаёт её вызывающий код (index.ts).
 */
export async function recordUntilSilence(recorder: PvRecorder): Promise<Buffer | null> {
  await waitForSpeechStart(recorder);

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
  if (collected.length < MIN_UTTERANCE_SAMPLES) {
    if (DEBUG) console.log(`[audio] обрывок ${seconds}с — короче 0.5с, отбрасываю`);
    return null;
  }
  if (DEBUG) console.log(`[audio] записано ${seconds}с, распознаю…`);
  return pcmToWav(Int16Array.from(collected), SAMPLE_RATE);
}

/** Как recordUntilSilence, но без null — по-тихому переслушивает, если поймало только шум. */
export async function recordSpeech(recorder: PvRecorder): Promise<Buffer> {
  for (;;) {
    const wav = await recordUntilSilence(recorder);
    if (wav) return wav;
  }
}
