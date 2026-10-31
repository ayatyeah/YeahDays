#!/usr/bin/env node
/**
 * Перекладка «Историй» → MP4: сцены с постановкой (scene.stage) рисуются
 * покадрово тем же холстом, что в плеере (window.__storyStage.draw(t)),
 * и склеиваются с озвучкой сцен. 1920×1080, 30 кадров/с.
 *
 *   E2E_BASE=http://localhost:3120 node scripts/story-film.mjs <id истории> <сцена>[,<сцена>…] [файл.mp4]
 *
 * Нужен запущенный сайт на учебной базе: заходит временный пользователь
 * из e2e/harness.mjs (боевую базу харнесс не трогает). По умолчанию видео —
 * в ~/Видео/YeahGrind/stories/.
 *
 * FILM_STILLS="1,5.5,12" — вместо видео стоп-кадры в эти секунды каждой сцены
 * (JPEG рядом с файлом видео): проверить постановку, не рендеря всё.
 *
 * FILM_FRAMES=1 — вместо видео обычные кадры истории: по кадру на реплику (её
 * середина) в public/stories/<id>/frames/<кадр>.webp, 1280×720. Они нужны
 * обложке, списку историй и плееру там, где нет WebGL 2. Сцены «all» — все.
 */
import { spawn, execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, readFileSync, unlinkSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { chromium } from "playwright";
import { BASE, ROOT, cleanupUsers, newUser } from "../e2e/harness.mjs";

const [id, list, outArg] = process.argv.slice(2);
if (!id || !list) {
  console.error("node scripts/story-film.mjs <id истории> <сцена>[,<сцена>…] [файл.mp4]");
  process.exit(1);
}
const FPS = Number(process.env.FILM_FPS ?? 30);
const STILLS = process.env.FILM_STILLS?.split(",").map(Number);
const FRAMES = process.env.FILM_FRAMES === "1";
const timingsAll = JSON.parse(readFileSync(join(ROOT, "src/lib/stories/audio", `${id}.json`), "utf8"));
const scenes = list === "all" ? Object.keys(timingsAll) : list.split(",");
const out = outArg ?? join(process.env.HOME, "Видео/YeahGrind/stories", `${id}-${scenes.join("-")}.mp4`);
mkdirSync(dirname(out), { recursive: true });
const timings = JSON.parse(readFileSync(join(ROOT, "src/lib/stories/audio", `${id}.json`), "utf8"));
const order = Object.keys(timings);
// Кадры реплик — из сценария (src/lib/stories/*.ts с этим id; Node сам отбрасывает типы).
let story;
if (FRAMES) {
  const dir = join(ROOT, "src/lib/stories");
  const file = readdirSync(dir).find((f) => f.endsWith(".ts") && readFileSync(join(dir, f), "utf8").includes(`id: "${id}"`));
  story = Object.values(await import(join(dir, file))).find((v) => v?.id === id);
}

const user = await newUser();
// В браузере без окна WebGL — программный (SwiftShader): медленнее, но кадр тот же.
const browser = await chromium.launch({ args: ["--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"] });
const page = await (await browser.newContext({ baseURL: BASE, viewport: { width: 1280, height: 720 }, deviceScaleFactor: FRAMES ? 1 : 1.5, locale: "ru-RU" })).newPage();
page.on("pageerror", (e) => console.error("ошибка страницы:", e.message));
page.on("console", (m) => m.type() === "error" && console.error("консоль:", m.text()));
const step = (s) => console.log(`· ${s}`);
await page.goto("/login");
await page.fill('input[name="identifier"]', user.email);
await page.fill('input[name="password"]', user.password);
await page.click("button[type=submit]");
await page.waitForURL((u) => !u.pathname.startsWith("/login"), { timeout: 60_000 });
step("вход выполнен");
await page.goto(`/stories/${id}`);
const player = page.getByRole("dialog", { name: /История:/ });
await player.getByRole("button", { name: "▶ Смотреть" }).click({ timeout: 60_000 });
// Холст — на весь кадр, без интерфейса плеера.
// (только пока снимается сцена: иначе холст закрыл бы кнопку «Сцены»).
await page.addStyleTag({ content: ".film .story-canvas{position:fixed!important;inset:0!important;width:100vw!important;height:100vh!important;z-index:99999!important}" });
const film = (on) => page.evaluate((on) => document.documentElement.classList.toggle("film", on), on);

const video = `${out}.video.mp4`;
const ff = spawn("ffmpeg", ["-v", "error", "-y", "-f", "image2pipe", "-c:v", "mjpeg", "-r", String(FPS), "-i", "-", "-c:v", "libx264", "-preset", "medium", "-crf", "19", "-pix_fmt", "yuv420p", video], {
  stdio: ["pipe", "inherit", "inherit"],
});
const write = (buf) => new Promise((ok) => (ff.stdin.write(buf) ? ok() : ff.stdin.once("drain", ok)));

for (const scene of scenes) {
  const n = order.indexOf(scene) + 1;
  await player.getByRole("button", { name: "Сцены истории" }).click();
  await page.getByRole("dialog", { name: "Сцены" }).getByRole("button", { name: new RegExp(`^${n}\\. `) }).click();
  // Звук сцены не нужен — время задаёт рендер; иначе в конце сцены плеер ушёл бы к следующей.
  await page.waitForFunction(() => document.querySelector("audio")?.src.includes("/audio/"));
  await page.evaluate(() => document.querySelector("audio")?.pause());
  step(`сцена ${scene}: жду холст`);
  await page.waitForFunction((id) => window.__storyStage?.scene === id && window.__storyStage.ready(), scene, { timeout: 120_000 });
  await film(true);
  if (FRAMES) {
    const lines = story.scenes.find((s) => s.id === scene).lines;
    for (const [i, line] of lines.entries()) {
      const { start, end } = timings[scene].lines[i];
      const data = await page.evaluate((t) => {
        window.__storyStage.draw(t);
        return document.querySelector(".story-canvas").toDataURL("image/webp", 0.82);
      }, (start + end) / 2);
      const file = join(ROOT, "public/stories", id, "frames", `${line.frame}.webp`);
      mkdirSync(dirname(file), { recursive: true });
      writeFileSync(file, Buffer.from(data.slice(data.indexOf(",") + 1), "base64"));
    }
    console.log(`${scene}: кадров ${lines.length}`);
    await film(false);
    continue;
  }
  if (STILLS) {
    for (const t of STILLS) {
      const data = await page.evaluate((t) => {
        window.__storyStage.draw(t);
        return document.querySelector(".story-canvas").toDataURL("image/jpeg", 0.9);
      }, t);
      const file = out.replace(/\.mp4$/, `-${scene}-${t}.jpg`);
      writeFileSync(file, Buffer.from(data.slice(data.indexOf(",") + 1), "base64"));
      console.log(file);
    }
    await film(false);
    continue;
  }
  const frames = Math.round(timings[scene].duration * FPS);
  const started = Date.now();
  for (let i = 0; i < frames; i++) {
    const data = await page.evaluate((t) => {
      window.__storyStage.draw(t);
      return document.querySelector(".story-canvas").toDataURL("image/jpeg", 0.92);
    }, i / FPS);
    await write(Buffer.from(data.slice(data.indexOf(",") + 1), "base64"));
    if (i % (FPS * 5) === 0) process.stdout.write(`\r${scene}: ${(i / FPS).toFixed(0)} / ${timings[scene].duration.toFixed(0)} с`);
  }
  console.log(`\r${scene}: ${frames} кадров за ${((Date.now() - started) / 1000).toFixed(0)} с`);
  await film(false);
}
ff.stdin.end();
await new Promise((ok) => ff.on("close", ok));
await browser.close();
cleanupUsers();
if (STILLS || FRAMES) {
  if (existsSync(video)) unlinkSync(video);
  process.exit(0);
}

// Звук: озвучка сцен подряд.
const audio = scenes.map((s) => join(ROOT, "public/stories", id, "audio", `${s}.m4a`));
execFileSync("ffmpeg", [
  "-v", "error", "-y", "-i", video,
  ...audio.flatMap((a) => ["-i", a]),
  "-filter_complex", `${audio.map((_, i) => `[${i + 1}:a]`).join("")}concat=n=${audio.length}:v=0:a=1[a]`,
  "-map", "0:v", "-map", "[a]", "-c:v", "copy", "-c:a", "aac", "-b:a", "160k", "-shortest", out,
]);
unlinkSync(video);
console.log(`→ ${out}`);
