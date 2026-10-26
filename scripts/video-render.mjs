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
// (тот каждый раз ждёт «стабильности» страницы и перекодирует картинку). Звук — голос
// из WAV scripts/video-tts.mjs и фоновая музыка (scripts/video-audio.mjs), склейка — ffmpeg.
// Готовое — ~/Видео/YeahGrind/<ивент>/.
// Кадр снимается, только если сцена изменилась: всё движение в плеере — inline-стили
// от времени ролика, так что та же разметка — та же картинка, и в ролик идёт
// прошлый снимок. Между репликами кадр стоит, поэтому снимков в 5–8 раз меньше кадров.
// Уже отрендеренные ролики пропускаются, если не стали старше озвучки.
// RENDER_JOBS=4 — сколько роликов снимать параллельно, каждый в своём Chromium:
// вкладки одного браузера рисуют через общий процесс, и он упирается в одно ядро.
// RENDER_SIZE=1080|720 — высота кадра 1920 или 1280; 720 примерно вдвое быстрее.

import { spawn } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, rmSync, statSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import { chromium } from "playwright";
import { cleanupUsers, newUser, session } from "../e2e/harness.mjs";
import { mixArgs } from "./video-audio.mjs";

const EVENT = process.argv[2];
const ONLY = new Set(process.argv.slice(3));
if (!EVENT) {
  console.error("укажи ивент: node scripts/video-render.mjs project-management-test-2 [id…]");
  process.exit(2);
}
const FPS = 30;
const JOBS = Math.max(1, Number(process.env.RENDER_JOBS ?? 4));
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

// ffmpeg ждёт кадры из трубы: если вкладка упала или рендер прервали, он висит
// вечно и держит ~0,7 ГБ. Поэтому все кодировщики гасим при любом выходе.
const encoders = new Set();
process.on("exit", () => { for (const ff of encoders) ff.kill("SIGKILL"); });
for (const sig of ["SIGINT", "SIGTERM"]) process.on(sig, () => process.exit(130));
const ids = Object.keys(timings).filter((id) => !ONLY.size || ONLY.has(id));

// Вход один раз: забираем куки в контекст нужного размера (9:16, ×3 → 1080×1920).
const user = await newUser();
const login = await session({ user, engine: "chromium" });
const storageState = await login.context.storageState();
await login.browser.close();
const browsers = new Set();
async function launch() {
  const browser = await chromium.launch();
  browsers.add(browser);
  browser.on("disconnected", () => browsers.delete(browser));
  return browser.newContext({ viewport: { width: 360 * ZOOM, height: 640 * ZOOM }, deviceScaleFactor: 1, storageState, baseURL: process.env.E2E_BASE, locale: "ru-RU", serviceWorkers: "block" });
}

async function render(context, id) {
  const wav = join(WAV, `${id}.wav`);
  const mp4 = join(OUT, `${id}.mp4`);
  const silent = join(OUT, `.${id}.video.mp4`);
  if (!existsSync(wav)) { console.log(`${id}: нет озвучки, пропуск`); return; }
  if (!ONLY.size && existsSync(mp4) && statSync(mp4).mtimeMs > statSync(wav).mtimeMs) return;
  const started = Date.now();
  const page = await context.newPage();
  let ff = null;
  try {
    await page.clock.install();
    await page.goto(`/render/explainer/${EVENT}/${id}?zoom=${ZOOM}`, { waitUntil: "load" });
    await page.waitForFunction(() => window.__explainerReady === true, null, { timeout: 60_000 });
    // От времени самой страницы: под нагрузкой её часы и Date.now() здесь расходятся.
    await page.clock.pauseAt((await page.evaluate(() => Date.now())) + 5000);
    await page.evaluate(() => window.__explainerStart());
    const cdp = await context.newCDPSession(page);
    const frames = Math.ceil((timings[id].duration + 0.8) * FPS);
    // Сначала только картинка: со звуком на входе ffmpeg, пока кадры идут медленно,
    // держал ~0,7 ГБ вместо ~0,3, а роликов кодируется сразу несколько. Звук — потом, без перекодирования видео.
    // veryfast: кадры большей частью повторяются, и medium тратил половину процессора на их сжатие.
    ff = spawn("ffmpeg", ["-loglevel", "error", "-y", "-f", "image2pipe", "-framerate", String(FPS), "-c:v", "mjpeg", "-i", "-",
      "-c:v", "libx264", "-preset", "veryfast", "-crf", "20", "-threads", "2", "-pix_fmt", "yuv420p", "-r", String(FPS), silent], { stdio: ["pipe", "inherit", "inherit"] });
    encoders.add(ff);
    ff.stdin.on("error", () => {}); // ffmpeg упал — причину покажет finished
    const finished = new Promise((ok, fail) => ff.on("close", (code) => (code === 0 ? ok() : fail(new Error(`ffmpeg ${code}`)))));
    finished.catch(() => {}); // если кадры оборвались раньше, ffmpeg гасим сами — без «необработанной» ошибки
    let jpg = null;
    let still = 0;
    let shots = 0;
    for (let f = 0; f < frames; f++) {
      // Часы шагают целыми миллисекундами: runFor(33.33) идёт как 34 мс, и картинка
      // уходила вперёд звука на секунду к концу минуты. Шаг — от точного времени кадра.
      await page.clock.runFor(Math.round(((f + 1) * 1000) / FPS) - Math.round((f * 1000) / FPS));
      const same = await page.evaluate(() => {
        const html = document.querySelector("[data-render-stage]")?.innerHTML;
        const prev = window.__lastFrame;
        window.__lastFrame = html;
        return html === prev;
      });
      still = same ? still + 1 : 0;
      // Пару кадров после изменения и раз в полсекунды снимаем всё равно: картинка
      // (персонаж, шрифт) может дорисоваться на кадр позже разметки.
      if (!jpg || still < 3 || f % 15 === 0) {
        const { data } = await cdp.send("Page.captureScreenshot", { format: "jpeg", quality: 88, optimizeForSpeed: true });
        jpg = Buffer.from(data, "base64");
        shots++;
      }
      if (!ff.stdin.write(jpg)) await new Promise((r) => ff.stdin.once("drain", r));
    }
    ff.stdin.end();
    await finished;
    encoders.delete(ff);
    ff = null;
    const mux = spawn("ffmpeg", mixArgs({ id, wav, out: mp4, stereo: true, extraInputs: ["-i", silent], extraMaps: ["-map", "0:v", "-c:v", "copy"] }), { stdio: "inherit" });
    const status = await new Promise((done) => mux.on("close", done));
    rmSync(silent, { force: true });
    if (status !== 0) throw new Error(`ffmpeg (звук) ${status}`);
    console.log(`${id}: ✓ ${timings[id].duration.toFixed(0)} с ролика за ${((Date.now() - started) / 1000).toFixed(0)} с, снимков ${shots} из ${frames}`);
  } catch (e) {
    if (ff) {
      ff.kill("SIGKILL");
      encoders.delete(ff);
      rmSync(silent, { force: true });
    }
    rmSync(mp4, { force: true }); // недописанный ролик иначе сочли бы готовым
    throw e;
  } finally {
    await page.close().catch(() => {});
  }
}

try {
  const queue = [...ids];
  const retried = new Set();
  await Promise.all(Array.from({ length: JOBS }, async () => {
    let context = await launch();
    for (let id = queue.shift(); id; id = queue.shift()) {
      try {
        await render(context, id);
      } catch (e) {
        // Упал браузер — поднимаем новый и даём ролику ещё одну попытку.
        const dead = !context.browser()?.isConnected();
        console.log(`${id}: ✗ ${e.message.split("\n")[0]}${dead ? " — перезапуск браузера" : ""}`);
        if (dead) context = await launch();
        if (!retried.has(id)) {
          retried.add(id);
          queue.push(id);
        }
      }
    }
    await context.browser()?.close();
  }));
} finally {
  await Promise.all([...browsers].map((b) => b.close().catch(() => {})));
  cleanupUsers();
}
