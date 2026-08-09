import { execFile } from "node:child_process";
import { mkdtemp, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { Porcupine } from "@picovoice/porcupine-node";
import { PvRecorder } from "@picovoice/pvrecorder-node";
import { config } from "./config.js";

/** Сколько подряд тихих кадров считать концом фразы (кадр Porcupine ≈ 32мс на 16кГц/512). */
const SILENCE_FRAMES_TO_STOP = 38; // ≈ 1.2с
/** Жёсткий потолок на одну команду — не даём микрофону слушать вечно. */
const MAX_COMMAND_FRAMES = 400; // ≈ 12.5с
/** Порог амплитуды, ниже которого кадр считается тишиной (Int16 диапазон ±32768). */
const SILENCE_RMS_THRESHOLD = 350;

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

/**
 * Держит микрофон открытым и слушает кодовое слово. На каждое срабатывание
 * вызывает onWake, которому передаётся функция recordCommand — записать
 * следующую фразу (окончание определяется тишиной).
 */
export async function runWakeLoop(onWake: (recordCommand: () => Promise<Buffer>) => Promise<void>) {
  const porcupine = new Porcupine(
    config.picovoiceAccessKey,
    [config.keywordPath],
    [0.6],
  );
  const recorder = new PvRecorder(porcupine.frameLength, config.audioDeviceIndex);
  recorder.start();
  console.log(`[audio] слушаю через "${recorder.getSelectedDevice()}"…`);

  const recordCommand = async (): Promise<Buffer> => {
    const collected: number[] = [];
    let silentFrames = 0;
    for (let i = 0; i < MAX_COMMAND_FRAMES; i++) {
      const frame = await recorder.read();
      collected.push(...frame);
      if (rms(frame) < SILENCE_RMS_THRESHOLD) {
        silentFrames++;
        if (silentFrames >= SILENCE_FRAMES_TO_STOP && collected.length > frame.length * 5) {
          break;
        }
      } else {
        silentFrames = 0;
      }
    }
    return pcmToWav(Int16Array.from(collected), porcupine.sampleRate);
  };

  try {
    for (;;) {
      const frame = await recorder.read();
      const keywordIndex = porcupine.process(frame);
      if (keywordIndex !== -1) {
        await onWake(recordCommand);
      }
    }
  } finally {
    recorder.stop();
    recorder.release();
    porcupine.release();
  }
}
