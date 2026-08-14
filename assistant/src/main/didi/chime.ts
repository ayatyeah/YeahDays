import { pcmToWav } from "./audio.js";

/**
 * Короткая мягкая мелодия "думаю" — синтезируется прямо в коде (без
 * внешнего аудиофайла: не нужно тащить его через electron-builder
 * extraResources/asarUnpack, см. config.ts::envPath для аналогичной боли
 * с путями в упакованном приложении). Три ноты мажорного трезвучия
 * внахлёст (легато), с мягкой атакой и колокольным затуханием — не
 * тестовый сигнал, а что-то похожее на настоящий короткий перезвон.
 *
 * Не могу сам на слух проверить, как это звучит — если резковато или
 * невпопад, поправить проще всего числа в NOTES/PEAK_AMP ниже.
 */
const SAMPLE_RATE = 24000;
const NOTES = [
  { freq: 523.25, start: 0.0 }, // C5
  { freq: 659.25, start: 0.25 }, // E5
  { freq: 783.99, start: 0.5 }, // G5
  { freq: 1046.5, start: 0.75 }, // C6
  { freq: 783.99, start: 1.05 }, // G5 — возврат вниз, чтобы не просто уезжало вверх, а звучало как законченная фраза
];
const NOTE_DURATION = 1.1;
const PEAK_AMP = 0.16; // тихо и мягко, не сигнал тревоги

function renderNote(freq: number, dur: number, sampleRate: number): Float32Array {
  const n = Math.round(dur * sampleRate);
  const out = new Float32Array(n);
  const attack = Math.min(0.02, dur * 0.15);
  for (let i = 0; i < n; i++) {
    const t = i / sampleRate;
    const attackEnv = t < attack ? t / attack : 1;
    const decayEnv = Math.exp(-3.2 * (t / dur)); // колокольное затухание
    const env = attackEnv * decayEnv;
    // Тихая вторая гармоника — чистый синус звучит слишком стерильно/как тест-сигнал.
    const wave = Math.sin(2 * Math.PI * freq * t) + Math.sin(2 * Math.PI * freq * 2 * t) * 0.22;
    out[i] = wave * env * PEAK_AMP;
  }
  return out;
}

function renderChimeFloat(): Float32Array {
  const totalDur = Math.max(...NOTES.map((n) => n.start)) + NOTE_DURATION;
  const mix = new Float32Array(Math.round(totalDur * SAMPLE_RATE));
  for (const note of NOTES) {
    const samples = renderNote(note.freq, NOTE_DURATION, SAMPLE_RATE);
    const startIdx = Math.round(note.start * SAMPLE_RATE);
    for (let i = 0; i < samples.length && startIdx + i < mix.length; i++) {
      mix[startIdx + i] = (mix[startIdx + i] ?? 0) + samples[i]!;
    }
  }
  return mix;
}

let cached: Buffer | null = null;

/** WAV-буфер мелодии "думаю" — считается один раз и кешируется, дальше просто переиспользуется. */
export function getThinkingChime(): Buffer {
  if (!cached) {
    const float = renderChimeFloat();
    const pcm = new Int16Array(float.length);
    for (let i = 0; i < float.length; i++) {
      pcm[i] = Math.round(Math.max(-1, Math.min(1, float[i]!)) * 32767);
    }
    cached = pcmToWav(pcm, SAMPLE_RATE);
  }
  return cached;
}
