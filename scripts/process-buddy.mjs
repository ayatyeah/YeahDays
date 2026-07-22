import sharp from "sharp";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { mkdirSync } from "node:fs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const srcDir = join(root, "assets", "characters");
const outDir = join(root, "public", "characters");
mkdirSync(outDir, { recursive: true });

const STAGES = ["slim", "fit", "jacked"];
const OUT_H = 760;

/**
 * У slim/jacked фон — СВЕТЛАЯ шахматка, чисто снимается порогом яркости
 * (per-pixel: и края мягкие, и карманы между рук/ног уходят сами).
 * У fit тёмные квадраты шахматки по яркости почти как фигура, поэтому
 * там — заливка от границ (по связности), а фигуру держит её обводка.
 */
const CFG = {
  slim: { method: "lum", low: 138, high: 180 },
  jacked: { method: "lum", low: 135, high: 184 },
  fit: { method: "flood", bgMin: 88, seed: 150 },
};

function keyByLum(data, lum, px, channels, low, high) {
  for (let i = 0; i < px; i++) {
    let a = (high - lum[i]) / (high - low);
    a = a < 0 ? 0 : a > 1 ? 1 : a;
    data[i * channels + 3] = Math.round(a * 255);
  }
}

function keyByFlood(data, lum, width, height, channels, bgMin, seed) {
  const px = width * height;
  const isBg = new Uint8Array(px);
  const stack = [];
  const push = (i) => {
    if (!isBg[i] && lum[i] > bgMin) {
      isBg[i] = 1;
      stack.push(i);
    }
  };
  const flood = () => {
    while (stack.length) {
      const i = stack.pop();
      const x = i % width;
      const y = (i - x) / width;
      if (x > 0) push(i - 1);
      if (x < width - 1) push(i + 1);
      if (y > 0) push(i - width);
      if (y < height - 1) push(i + width);
    }
  };
  for (let x = 0; x < width; x++) {
    push(x);
    push((height - 1) * width + x);
  }
  for (let y = 0; y < height; y++) {
    push(y * width);
    push(y * width + width - 1);
  }
  flood();
  for (let i = 0; i < px; i++) {
    if (!isBg[i] && lum[i] > seed) {
      push(i);
      flood();
    }
  }
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
    if (border && lum[i] > 120) {
      const a = (186 - lum[i]) / (186 - 120);
      data[o + 3] = Math.round(Math.max(0, Math.min(1, a)) * 255);
    } else {
      data[o + 3] = 255;
    }
  }
}

async function process(stage) {
  const cfg = CFG[stage];
  const src = join(srcDir, `${stage}.png`);
  const { data, info } = await sharp(src)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;
  const px = width * height;

  const lum = new Float32Array(px);
  for (let i = 0; i < px; i++) {
    const o = i * channels;
    lum[i] = 0.299 * data[o] + 0.587 * data[o + 1] + 0.114 * data[o + 2];
  }

  if (cfg.method === "lum") {
    keyByLum(data, lum, px, channels, cfg.low, cfg.high);
  } else {
    keyByFlood(data, lum, width, height, channels, cfg.bgMin, cfg.seed);
  }

  const cleaned = await sharp(data, { raw: { width, height, channels } })
    .png()
    .toBuffer();

  await sharp(cleaned)
    .trim({ threshold: 10 })
    .resize({ height: OUT_H, withoutEnlargement: true })
    .png({ compressionLevel: 9 })
    .toFile(join(outDir, `${stage}.png`));

  const m = await sharp(join(outDir, `${stage}.png`)).metadata();
  console.log(`${stage}: ${m.width}x${m.height}`);
}

async function main() {
  for (const s of STAGES) await process(s);
  console.log("done");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
