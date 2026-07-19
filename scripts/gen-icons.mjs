import sharp from "sharp";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const svg = readFileSync(join(root, "public", "icon.svg"));
const out = (name) => join(root, "public", name);

async function main() {
  await sharp(svg).resize(192, 192).png().toFile(out("icon-192.png"));
  await sharp(svg).resize(512, 512).png().toFile(out("icon-512.png"));

  // maskable: контент в безопасной зоне на сплошном фоне (без прозрачных углов)
  const inner = await sharp(svg).resize(360, 360).png().toBuffer();
  await sharp({
    create: {
      width: 512,
      height: 512,
      channels: 4,
      background: "#0a0a0c",
    },
  })
    .composite([{ input: inner, gravity: "center" }])
    .png()
    .toFile(out("icon-maskable-512.png"));

  // apple touch icon
  await sharp(svg).resize(180, 180).png().toFile(out("apple-icon.png"));

  console.log("icons generated");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
