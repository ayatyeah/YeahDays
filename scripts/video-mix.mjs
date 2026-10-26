// Пересвести звук уже озвученных роликов — голос и фоновая музыка
// (scripts/video-audio.mjs), без новой озвучки и без нового рендера картинки:
//
//   node scripts/video-mix.mjs projectManagement [id…]
//
// - public/events/<папка>/video/<id>.m4a — звук для приложения;
// - ~/Видео/YeahGrind/<ивент>/<id>.mp4, если уже отрендерен, — картинка та же
//   (копируется как есть), звуковая дорожка — новая.

import { execFile } from "node:child_process";
import { existsSync, readFileSync, renameSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import { promisify } from "node:util";
import { mixArgs } from "./video-audio.mjs";

const run = promisify(execFile);
const EVENT_DIR = process.argv[2] ?? "";
const ONLY = new Set(process.argv.slice(3));
const EVENT = { projectManagement: ["project-management-test-2", "pm"], computerNetworks: ["computer-networks-midterm", "cn"] }[EVENT_DIR];
if (!EVENT) {
  console.error("укажи ивент: node scripts/video-mix.mjs projectManagement|computerNetworks [id…]");
  process.exit(2);
}
const [eventId, folder] = EVENT;
const WAV = join(homedir(), ".cache/yg-video/wav");
const MP4 = join(homedir(), "Видео/YeahGrind", eventId);
const ids = Object.keys(JSON.parse(readFileSync(join("src/lib/events", EVENT_DIR, "videos/audio.json"), "utf8"))).filter((id) => !ONLY.size || ONLY.has(id));

async function mix(id) {
  const wav = join(WAV, `${id}.wav`);
  if (!existsSync(wav)) return console.log(`${id}: нет WAV, пропуск`);
  await run("ffmpeg", mixArgs({ id, wav, out: join("public/events", folder, "video", `${id}.m4a`) }));
  const mp4 = join(MP4, `${id}.mp4`);
  if (existsSync(mp4)) {
    const tmp = join(MP4, `.${id}.remix.mp4`);
    await run("ffmpeg", mixArgs({ id, wav, out: tmp, stereo: true, extraInputs: ["-i", mp4], extraMaps: ["-map", "0:v", "-c:v", "copy"] }));
    renameSync(tmp, mp4);
  }
  console.log(`${id}: ✓${existsSync(mp4) ? " + MP4" : ""}`);
}

const queue = [...ids];
await Promise.all(Array.from({ length: 4 }, async () => {
  for (let id = queue.shift(); id; id = queue.shift()) await mix(id).catch((e) => console.log(`${id}: ✗ ${e.message.split("\n")[0]}`));
}));
