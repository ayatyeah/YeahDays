import sharp from "sharp";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { readFileSync } from "node:fs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const input = join(root, "assets", "YeahDays logo.png");
const inputWhite = join(root, "assets", "yeahdays черный.png"); // белый логотип на тёмном фоне
const pub = join(root, "public");
const DARK = { r: 8, g: 8, b: 11 }; // фон приложения #08080b

/**
 * Разностный ключ: серый фон логотипа делаем прозрачным. Альфа растёт с
 * удалением цвета пикселя от фонового серого — неоновое свечение сохраняется
 * как мягкий полупрозрачный ореол (на тёмном фоне выглядит как неон).
 */
async function keyOut(D_LOW = 14, D_HIGH = 74) {
  const { data, info } = await sharp(input)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;
  const px = width * height;

  let rs = 0, gs = 0, bs = 0, n = 0;
  const sample = (x, y) => {
    const o = (y * width + x) * channels;
    rs += data[o]; gs += data[o + 1]; bs += data[o + 2]; n++;
  };
  for (let x = 0; x < width; x += 4) { sample(x, 0); sample(x, height - 1); }
  for (let y = 0; y < height; y += 4) { sample(0, y); sample(width - 1, y); }
  const bg = { r: rs / n, g: gs / n, b: bs / n };

  const out = Buffer.alloc(px * 4);
  for (let i = 0; i < px; i++) {
    const o = i * channels;
    const r = data[o], g = data[o + 1], b = data[o + 2];
    const d = Math.sqrt((r - bg.r) ** 2 + (g - bg.g) ** 2 + (b - bg.b) ** 2);
    let a = (d - D_LOW) / (D_HIGH - D_LOW);
    a = a < 0 ? 0 : a > 1 ? 1 : a;
    const q = i * 4;
    out[q] = r; out[q + 1] = g; out[q + 2] = b; out[q + 3] = Math.round(a * 255);
  }
  return sharp(out, { raw: { width, height, channels: 4 } }).png().toBuffer();
}

/**
 * Белый логотип на тёмном фоне → белый глиф на прозрачности.
 * Ключ по яркости: белый глиф непрозрачен, тёмный фон и мягкая тень —
 * прозрачны. Тусклая декоративная «искра» отсекается высоким порогом.
 */
async function keyOutWhite() {
  const { data, info } = await sharp(inputWhite)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;
  const px = width * height;
  const L_LOW = 150; // ниже — фон/тень/искра (прозрачно)
  const L_HIGH = 212; // выше — глиф (непрозрачно)
  const out = Buffer.alloc(px * 4);
  for (let i = 0; i < px; i++) {
    const o = i * channels;
    const lum = 0.299 * data[o] + 0.587 * data[o + 1] + 0.114 * data[o + 2];
    let a = (lum - L_LOW) / (L_HIGH - L_LOW);
    a = a < 0 ? 0 : a > 1 ? 1 : a;
    const q = i * 4;
    out[q] = 255; out[q + 1] = 255; out[q + 2] = 255;
    out[q + 3] = Math.round(a * 255);
  }
  return sharp(out, { raw: { width, height, channels: 4 } }).png().toBuffer();
}

async function main() {
  // Белая версия — из настоящего белого логотипа (реальные формы «YD»).
  const white = await keyOutWhite();
  const whiteTrim = await sharp(white).trim({ threshold: 10 }).png().toBuffer();
  await sharp(whiteTrim)
    .resize({ width: 512, withoutEnlargement: true })
    .png({ compressionLevel: 9 })
    .toFile(join(pub, "logo-white.png"));

  // ── Чёткий цветной «YD»: форма из белого логотипа + фирменный градиент ──
  // Светящийся исходник мутнеет при уменьшении, поэтому и логотип в
  // интерфейсе, и иконки строим из чёткой формы. Свечение добавляем в CSS.
  const wMeta = await sharp(whiteTrim).metadata();
  const grad = Buffer.from(
    `<svg width="${wMeta.width}" height="${wMeta.height}" xmlns="http://www.w3.org/2000/svg">
       <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
         <stop offset="0" stop-color="#ffcf3a"/>
         <stop offset="0.35" stop-color="#ff7a3d"/>
         <stop offset="0.55" stop-color="#f9506b"/>
         <stop offset="0.72" stop-color="#d24be6"/>
         <stop offset="1" stop-color="#3b6bff"/>
       </linearGradient></defs>
       <rect width="100%" height="100%" fill="url(#g)"/>
     </svg>`,
  );
  // маска dest-in: оставляем градиент только в форме «YD»
  const crispTrim = await sharp(grad)
    .composite([{ input: whiteTrim, blend: "dest-in" }])
    .png()
    .toBuffer();

  // Цветной логотип для интерфейса — чёткая градиентная «YD».
  await sharp(crispTrim)
    .resize({ width: 512, withoutEnlargement: true })
    .png({ compressionLevel: 9 })
    .toFile(join(pub, "logo.png"));

  const bgSquare = (size) => ({
    create: { width: size, height: size, channels: 4, background: DARK },
  });
  const iconFrom = async (size, coverage, out) => {
    const inner = Math.round(size * coverage);
    const logo = await sharp(crispTrim)
      .resize(inner, inner, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .toBuffer();
    await sharp(bgSquare(size))
      .composite([{ input: logo, gravity: "center" }])
      .png({ compressionLevel: 9 })
      .toFile(join(pub, out));
  };
  await iconFrom(512, 0.78, "icon-512.png");
  await iconFrom(192, 0.8, "icon-192.png");
  await iconFrom(180, 0.8, "apple-icon.png");
  await iconFrom(512, 0.64, "icon-maskable-512.png");
  await iconFrom(64, 0.9, "favicon.png");

  const m = await sharp(join(pub, "logo.png")).metadata();
  console.log(`logo.png: ${m.width}x${m.height}`);
  console.log("done: logo.png, logo-white.png, icons");
}

main().catch((e) => { console.error(e); process.exit(1); });
