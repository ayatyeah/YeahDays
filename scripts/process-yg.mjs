// Обработка нового логотипа YG в набор ассетов.
// Иконки — цветной квадрат как есть; логотипы шапки — с вырезанным чёрным
// фоном (alpha по яркости) и обрезкой полей.
//
// Запуск: node scripts/process-yg.mjs
import sharp from "sharp";

const COLOR = "src_yg_color.png";
const WHITE = "src_yg_white.png";

// 1) Иконки приложения — чёрный квадрат тут уместен, просто ресайз.
const ICONS = {
  "public/favicon.png": 128,
  "public/icon-192.png": 192,
  "public/icon-512.png": 512,
  "public/apple-icon.png": 180,
  "public/icon-maskable-512.png": 512,
};
for (const [out, size] of Object.entries(ICONS)) {
  await sharp(COLOR).resize(size, size, { fit: "cover" }).png().toFile(out);
  console.log("icon", out, size);
}

// 2) Логотип шапки — рядом с текстом, поэтому чёрный фон в прозрачность.
//    alpha по максимуму канала: метка яркая → непрозрачна, чёрный фон → 0.
//    Мягкий порог убирает и лёгкое свечение вокруг, и оставляет чистый край.
async function keyed(src, out) {
  const { data, info } = await sharp(src)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const lo = 26,
    hi = 58;
  for (let i = 0; i < data.length; i += 4) {
    const m = Math.max(data[i], data[i + 1], data[i + 2]);
    let a = (m - lo) / (hi - lo);
    a = a < 0 ? 0 : a > 1 ? 1 : a;
    data[i + 3] = Math.round(a * 255);
  }
  await sharp(data, {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
    .trim() // срезать прозрачные поля вокруг метки
    .png()
    .toFile(out);
  console.log("logo", out);
}
await keyed(COLOR, "public/logo.png");
await keyed(WHITE, "public/logo-white.png");

console.log("done");
