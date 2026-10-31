// Кадры «Истории» → webp для приложения, плюс список поз к каждому кадру.
//
//   node scripts/story-frames.mjs pm-l4-quickbite ~/.cache/yg-stories/pm-l4/frames
//
// Исходники — PNG из генерации (по 2 МБ), в приложении — webp шириной
// 1280 px (≈100 КБ): кадр на телефоне меньше, а плеер ведёт по нему
// камеру с увеличением до 1,12 — запас по резкости есть.
//
// Позы: к кадру <id>.png Codex рисует <id>-2.png и <id>-3.png — тот же
// кадр, но персонажи в другой позе и с другой эмоцией. Плеер сменяет их по
// ходу реплики, и герои двигаются. Сколько поз у кадра — в
// src/lib/stories/poses/<id истории>.json.

import { mkdirSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";

const [id, src] = process.argv.slice(2);
if (!id || !src) throw new Error("node scripts/story-frames.mjs <id истории> <папка с PNG>");
const out = join("public/stories", id, "frames");
mkdirSync(out, { recursive: true });
const files = readdirSync(src).filter((f) => f.endsWith(".png")).sort();
for (const file of files) {
  await sharp(join(src, file)).resize({ width: 1280, withoutEnlargement: true }).webp({ quality: 78 }).toFile(join(out, file.replace(/\.png$/, ".webp")));
}
const poses = {};
for (const file of files) {
  const m = /^(.+)-(\d)\.png$/.exec(file);
  if (m && files.includes(`${m[1]}.png`)) poses[m[1]] = Math.max(poses[m[1]] ?? 0, Number(m[2]) - 1);
}
mkdirSync("src/lib/stories/poses", { recursive: true });
writeFileSync(join("src/lib/stories/poses", `${id}.json`), JSON.stringify(Object.fromEntries(Object.entries(poses).sort()), null, 1) + "\n");
console.log(`кадров: ${files.length} → ${out}; кадров с позами: ${Object.keys(poses).length}`);
