import sharp from "sharp";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const input = join(root, "yeahbuddy.png");
const output = join(root, "public", "buddy.png");

async function main() {
  const { data, info } = await sharp(input)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info; // channels === 4
  const px = width * height;

  // Убираем белый фон: чем «белее» пиксель, тем прозрачнее.
  // Мягкий переход по краям (feather) убирает рваную обводку.
  const T_OPAQUE = 226; // minC <= этого -> полностью виден
  const T_CLEAR = 246; // minC >= этого -> полностью прозрачен
  for (let i = 0; i < px; i++) {
    const o = i * channels;
    const r = data[o];
    const g = data[o + 1];
    const b = data[o + 2];
    const minC = Math.min(r, g, b);
    let a;
    if (minC >= T_CLEAR) a = 0;
    else if (minC <= T_OPAQUE) a = 255;
    else a = Math.round(((T_CLEAR - minC) / (T_CLEAR - T_OPAQUE)) * 255);
    data[o + 3] = a;
  }

  const cut = await sharp(data, { raw: { width, height, channels } })
    .png()
    .toBuffer();

  // Обрезаем прозрачные поля и сохраняем.
  await sharp(cut).trim({ threshold: 10 }).png().toFile(output);

  const meta = await sharp(output).metadata();
  console.log(`buddy.png: ${meta.width}x${meta.height}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
