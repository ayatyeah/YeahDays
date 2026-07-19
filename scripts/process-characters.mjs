import sharp from "sharp";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { mkdirSync } from "node:fs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const srcDir = join(root, "assets", "characters");
const outDir = join(root, "public", "characters");
mkdirSync(outDir, { recursive: true });

// исходник (рус. имя) -> выходной слаг
const MAP = [
  ["слимбой.png", "slim-base"],
  ["слимбой в слиме.png", "slim-slim"],
  ["слимбой в оверсайзе.png", "slim-oversize"],
  ["слимбой модный.png", "slim-fashion"],
  ["эстет.png", "esthete-base"],
  ["эстет на классике.png", "esthete-classic"],
  ["эстет на спортивном.png", "esthete-sport"],
  ["эстет на спортивном 2.png", "esthete-sport2"],
  ["качок.png", "jacked-base"],
  ["качок в костьюме.png", "jacked-suit"],
  ["качок в обтягивающей футболке.png", "jacked-tshirt"],
  ["качок в оверсайзе.png", "jacked-oversize"],
  ["качок в рубашке и широких штанах.png", "jacked-shirt"],
  ["качок модный.png", "jacked-fashion"],
];

// Пиксель считается фоном, если он достаточно светлый (близок к белому).
const BG_T = 224;
// Высота выходного изображения (сохраняем пропорции).
const OUT_H = 780;

/**
 * Удаляем фон заливкой от границ: прозрачным становится только белое,
 * СВЯЗАННОЕ с краем кадра. Внутренние светлые детали (носки, кроссовки,
 * светлая ткань) сохраняются, т.к. окружены тёмной обводкой.
 */
async function removeBg(inputPath) {
  const { data, info } = await sharp(inputPath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info;
  const px = width * height;
  const isBg = new Uint8Array(px);
  const stack = [];

  const light = (i) => {
    const o = i * channels;
    return Math.min(data[o], data[o + 1], data[o + 2]) >= BG_T;
  };
  const seed = (i) => {
    if (!isBg[i] && light(i)) {
      isBg[i] = 1;
      stack.push(i);
    }
  };

  for (let x = 0; x < width; x++) {
    seed(x);
    seed((height - 1) * width + x);
  }
  for (let y = 0; y < height; y++) {
    seed(y * width);
    seed(y * width + width - 1);
  }

  while (stack.length) {
    const i = stack.pop();
    const x = i % width;
    const y = (i - x) / width;
    if (x > 0) seed(i - 1);
    if (x < width - 1) seed(i + 1);
    if (y > 0) seed(i - width);
    if (y < height - 1) seed(i + width);
  }

  // фон -> прозрачный; лёгкий feather по краю (полупрозрачность светлых
  // пикселей, граничащих с фоном) убирает рваную обводку
  for (let i = 0; i < px; i++) {
    const o = i * channels;
    if (isBg[i]) {
      data[o + 3] = 0;
      continue;
    }
    const x = i % width;
    const y = (i - x) / width;
    const border =
      (x > 0 && isBg[i - 1]) ||
      (x < width - 1 && isBg[i + 1]) ||
      (y > 0 && isBg[i - width]) ||
      (y < height - 1 && isBg[i + width]);
    if (border) {
      const minC = Math.min(data[o], data[o + 1], data[o + 2]);
      if (minC >= 205) data[o + 3] = Math.round(((255 - minC) / (255 - 205)) * 255);
    }
  }

  return sharp(data, { raw: { width, height, channels } }).png().toBuffer();
}

async function main() {
  const dims = {};
  for (const [srcName, slug] of MAP) {
    const cut = await removeBg(join(srcDir, srcName));
    const outPath = join(outDir, `${slug}.png`);
    await sharp(cut)
      .trim({ threshold: 12 })
      .resize({ height: OUT_H, withoutEnlargement: true })
      .png({ compressionLevel: 9 })
      .toFile(outPath);
    const meta = await sharp(outPath).metadata();
    dims[slug] = { w: meta.width, h: meta.height };
    console.log(`${slug}: ${meta.width}x${meta.height}`);
  }
  console.log("\nAspect ratios (w/h):");
  for (const [slug, d] of Object.entries(dims)) {
    console.log(`  ${slug}: ${(d.w / d.h).toFixed(3)}`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
