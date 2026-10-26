// Рендер роликов-объяснений в MP4 1080×1920 для соцсетей — на этой машине,
// не на сервере.
//
//   VIDEO_RENDER=1 next start/dev на локальной dev-базе, затем:
//   E2E_BASE=http://localhost:3121 node scripts/video-render.mjs project-management-test-2 [id…]
//
// Кадры снимает Chromium со страницы /render/explainer/<ивент>/<ролик>?zoom=N: часы
// страницы (Playwright clock) стоят, и каждый кадр двигаем на 1/30 с — так
// анимации идут ровно, сколько бы ни снимался кадр. Снимок — напрямую через
// CDP с optimizeForSpeed: ~36 мс на кадр против ~340 мс у page.screenshot
// (тот каждый раз ждёт «стабильности» страницы и перекодирует картинку). Звук — WAV из
// scripts/video-tts.mjs, склейка — ffmpeg. Готовое — ~/Видео/YeahGrind/<ивент>/.
// Уже отрендеренные ролики пропускаются, если не стали старше озвучки.
// RENDER_JOBS=3 — сколько роликов снимать параллельно (каждый в своей вкладке).
// RENDER_SIZE=1080|720 — высота кадра 1920 или 1280; 720 примерно вдвое быстрее.

import { spawn } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, statSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import { chromium } from "playwright";
import { cleanupUsers, newUser, session } from "../e2e/harness.mjs";

const EVENT = process.argv[2];
const ONLY = new Set(process.argv.slice(3));
if (!EVENT) {
  console.error("укажи ивент: node scripts/video-render.mjs project-management-test-2 [id…]");
  process.exit(2);
}
const FPS = 30;
const JOBS = Math.max(1, Number(process.env.RENDER_JOBS ?? 3));
// Сцена свёрстана под 360×640; окно — целевого размера, сцена увеличена CSS zoom,
// поэтому кадр рисуется сразу в полном разрешении и снимается без масштабирования.
const ZOOM = process.env.RENDER_SIZE === "720" ? 2 : 3;
const TIMINGS = {
  "project-management-test-2": "src/lib/events/projectManagement/videos/audio.json",
  "computer-networks-midterm": "src/lib/events/computerNetworks/videos/audio.json",
}[EVENT];
const OUT = join(homedir(), "Видео/YeahGrind", EVENT);
const WAV = join(homedir(), ".cache/yg-video/wav");
mkdirSync(OUT, { recursive: true });

const timings = JSON.parse(readFileSync(TIMINGS, "utf8"));
const ids = Object.keys(timings).filter((id) => !ONLY.size || ONLY.has(id));

// Вход один раз: забираем куки в контекст нужного размера (9:16, ×3 → 1080×1920).
const user = await newUser();
const login = await session({ user, engine: "chromium" });
const storageState = await login.context.storageState();
await login.browser.close();
const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: 360 * ZOOM, height: 640 * ZOOM }, deviceScaleFactor: 1, storageState, baseURL: process.env.E2E_BASE, locale: "ru-RU", serviceWorkers: "block" });

async function render(id) {
  const wav = join(WAV, `${id}.wav`);
  const mp4 = join(OUT, `${id}.mp4`);
  if (!existsSync(wav)) { console.log(`${id}: нет озвучки, пропуск`); return; }
  if (!ONLY.size && existsSync(mp4) && statSync(mp4).mtimeMs > statSync(wav).mtimeMs) return;
  const started = Date.now();
  const page = await context.newPage();
  try {
    await page.clock.install();
    await page.goto(`/render/explainer/${EVENT}/${id}?zoom=${ZOOM}`, { waitUntil: "load" });
    await page.waitForFunction(() => window.__explainerReady === true, null, { timeout: 60_000 });
    await page.clock.pauseAt(Date.now() + 1000);
    const cdp = await context.newCDPSession(page);
    const frames = Math.ceil((timings[id].duration + 0.8) * FPS);
    const ff = spawn("ffmpeg", ["-loglevel", "error", "-y", "-f", "image2pipe", "-framerate", String(FPS), "-c:v", "mjpeg", "-i", "-", "-i", wav,
      "-c:v", "libx264", "-preset", "medium", "-crf", "20", "-pix_fmt", "yuv420p", "-r", String(FPS), "-c:a", "aac", "-b:a", "128k", "-shortest", "-movflags", "+faststart", mp4], { stdio: ["pipe", "inherit", "inherit"] });
    const finished = new Promise((ok, fail) => ff.on("close", (code) => (code === 0 ? ok() : fail(new Error(`ffmpeg ${code}`)))));
    for (let f = 0; f < frames; f++) {
      await page.clock.runFor(1000 / FPS);
      const { data } = await cdp.send("Page.captureScreenshot", { format: "jpeg", quality: 88, optimizeForSpeed: true });
      const jpg = Buffer.from(data, "base64");
      if (!ff.stdin.write(jpg)) await new Promise((r) => ff.stdin.once("drain", r));
    }
    ff.stdin.end();
    await finished;
    console.log(`${id}: ✓ ${timings[id].duration.toFixed(0)} с ролика за ${((Date.now() - started) / 1000).toFixed(0)} с`);
  } finally {
    await page.close();
  }
}

try {
  const queue = [...ids];
  await Promise.all(Array.from({ length: JOBS }, async () => {
    for (let id = queue.shift(); id; id = queue.shift()) await render(id).catch((e) => console.log(`${id}: ✗ ${e.message}`));
  }));
} finally {
  await browser.close();
  cleanupUsers();
}
