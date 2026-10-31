#!/usr/bin/env node
/**
 * Губы в такт голосу для перекладки «Историй»: громкость озвучки сцены
 * 30 раз в секунду, цифрой 0–9 (0 — тишина, 9 — самое громкое в реплике).
 *
 *   node scripts/story-lipsync.mjs <id истории>
 *
 * Берёт готовые m4a сцен из public/stories/<id>/audio (там и музыка, но она
 * на 20+ LU тише голоса, а рот открывается только у говорящего и только
 * в пределах его реплики) и время реплик из src/lib/stories/audio/<id>.json.
 * Громкость нормируется по каждой реплике: тихий шёпот и крик одинаково
 * открывают рот. Пишет src/lib/stories/lipsync/<id>.json — { сцена: "0013…" }.
 */
import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const FPS = 30;
const RATE = 8000;

const id = process.argv[2];
if (!id) {
  console.error("node scripts/story-lipsync.mjs <id истории>");
  process.exit(1);
}
const timings = JSON.parse(readFileSync(join(ROOT, "src/lib/stories/audio", `${id}.json`), "utf8"));
const out = {};
for (const [scene, timing] of Object.entries(timings)) {
  const file = join(ROOT, "public/stories", id, "audio", `${scene}.m4a`);
  const raw = execFileSync("ffmpeg", ["-v", "error", "-i", file, "-ac", "1", "-ar", String(RATE), "-af", "highpass=f=120,lowpass=f=3500", "-f", "f32le", "-"], {
    maxBuffer: 1 << 28,
  });
  const pcm = new Float32Array(raw.buffer, raw.byteOffset, raw.byteLength / 4);
  const n = Math.ceil((pcm.length / RATE) * FPS);
  const rms = new Float32Array(n);
  const win = RATE / FPS;
  for (let i = 0; i < n; i++) {
    let s = 0;
    const a = Math.floor(i * win);
    const b = Math.min(pcm.length, Math.floor((i + 1) * win));
    for (let j = a; j < b; j++) s += pcm[j] * pcm[j];
    rms[i] = Math.sqrt(s / Math.max(1, b - a));
  }
  const level = new Array(n).fill(0);
  for (const line of timing.lines) {
    if (line.silent) continue;
    const a = Math.max(0, Math.floor(line.start * FPS));
    const b = Math.min(n, Math.ceil(line.end * FPS));
    const vals = Array.from(rms.slice(a, b)).sort((x, y) => x - y);
    const peak = vals[Math.floor(vals.length * 0.95)] || 1e-6;
    const floor = vals[Math.floor(vals.length * 0.12)] || 0;
    for (let i = a; i < b; i++) level[i] = Math.max(0, Math.min(9, Math.round(((rms[i] - floor) / Math.max(1e-6, peak - floor)) * 9)));
  }
  out[scene] = level.join("");
  console.log(`${scene}: ${(n / FPS).toFixed(1)} с`);
}
const dst = join(ROOT, "src/lib/stories/lipsync", `${id}.json`);
mkdirSync(dirname(dst), { recursive: true });
writeFileSync(dst, JSON.stringify(out) + "\n");
console.log(`→ ${dst.slice(ROOT.length + 1)}`);
