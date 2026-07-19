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

const OUT_H = 780; // высота выходного изображения

// Порог «светлый пиксель» для заливки внешнего фона (+ его размытого края)
const BG_T = 224;
// Порог «почти чисто-белый» — только такие могут быть фоновым карманом
const POCKET_T = 243;

/**
 * Удаляем фон:
 *  1) заливкой от границ — внешний фон (сохраняя мягкий край);
 *  2) замкнутые чисто-белые «карманы» (подмышки, просветы) — только КРУПНЫЕ,
 *     чтобы не задеть мелкие белые детали (носки, бренд, блики).
 */
async function removeBg(inputPath) {
  const { data, info } = await sharp(inputPath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info;
  const px = width * height;

  const minC = new Uint8Array(px);
  for (let i = 0; i < px; i++) {
    const o = i * channels;
    let m = data[o];
    if (data[o + 1] < m) m = data[o + 1];
    if (data[o + 2] < m) m = data[o + 2];
    minC[i] = m;
  }

  const bg = new Uint8Array(px);
  const stack = [];

  // 1) внешний фон — заливка от границ
  const seed = (i) => {
    if (!bg[i] && minC[i] >= BG_T) {
      bg[i] = 1;
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

  // 2) замкнутые чисто-белые карманы (крупные -> фон)
  const MIN_POCKET = Math.max(2000, Math.round(px * 0.0018));
  const visited = new Uint8Array(px);
  for (let i = 0; i < px; i++) {
    if (visited[i] || bg[i] || minC[i] < POCKET_T) continue;
    const comp = [];
    const st = [i];
    visited[i] = 1;
    while (st.length) {
      const j = st.pop();
      comp.push(j);
      const x = j % width;
      const y = (j - x) / width;
      const n1 = j - 1,
        n2 = j + 1,
        n3 = j - width,
        n4 = j + width;
      if (x > 0 && !visited[n1] && !bg[n1] && minC[n1] >= POCKET_T) {
        visited[n1] = 1;
        st.push(n1);
      }
      if (x < width - 1 && !visited[n2] && !bg[n2] && minC[n2] >= POCKET_T) {
        visited[n2] = 1;
        st.push(n2);
      }
      if (y > 0 && !visited[n3] && !bg[n3] && minC[n3] >= POCKET_T) {
        visited[n3] = 1;
        st.push(n3);
      }
      if (y < height - 1 && !visited[n4] && !bg[n4] && minC[n4] >= POCKET_T) {
        visited[n4] = 1;
        st.push(n4);
      }
    }
    if (comp.length >= MIN_POCKET) {
      for (let k = 0; k < comp.length; k++) bg[comp[k]] = 1;
    }
  }

  // 3) прозрачность + мягкий край
  for (let i = 0; i < px; i++) {
    const o = i * channels;
    if (bg[i]) {
      data[o + 3] = 0;
      continue;
    }
    const x = i % width;
    const y = (i - x) / width;
    const border =
      (x > 0 && bg[i - 1]) ||
      (x < width - 1 && bg[i + 1]) ||
      (y > 0 && bg[i - width]) ||
      (y < height - 1 && bg[i + width]);
    if (border && minC[i] >= 205) {
      data[o + 3] = Math.round(((255 - minC[i]) / (255 - 205)) * 255);
    }
  }

  return sharp(data, { raw: { width, height, channels } }).png().toBuffer();
}

async function main() {
  for (const [srcName, slug] of MAP) {
    const cut = await removeBg(join(srcDir, srcName));
    const outPath = join(outDir, `${slug}.png`);
    await sharp(cut)
      .trim({ threshold: 12 })
      .resize({ height: OUT_H, withoutEnlargement: true })
      .png({ compressionLevel: 9 })
      .toFile(outPath);
    const meta = await sharp(outPath).metadata();
    console.log(`${slug}: ${meta.width}x${meta.height}`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
