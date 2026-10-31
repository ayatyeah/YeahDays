// Кадры «Истории» → webp для приложения.
//
//   node scripts/story-frames.mjs pm-l4-quickbite ~/.cache/yg-stories/pm-l4/frames
//
// Исходники — PNG из генерации (по 2 МБ), в приложении — webp шириной
// 1280 px (≈100–200 КБ): кадр на телефоне меньше, а плеер ведёт по нему
// камеру с увеличением до 1,12 — запас по резкости есть.

import { mkdirSync, readdirSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";

const [id, src] = process.argv.slice(2);
if (!id || !src) throw new Error("node scripts/story-frames.mjs <id истории> <папка с PNG>");
const out = join("public/stories", id, "frames");
mkdirSync(out, { recursive: true });
let n = 0;
for (const file of readdirSync(src).filter((f) => f.endsWith(".png")).sort()) {
  await sharp(join(src, file)).resize({ width: 1280, withoutEnlargement: true }).webp({ quality: 78 }).toFile(join(out, file.replace(/\.png$/, ".webp")));
  n++;
}
console.log(`кадров: ${n} → ${out}`);
