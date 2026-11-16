// Repackage approved v5 artwork; never redraw or overwrite original assets.
import sharp from 'sharp';
import { fileURLToPath } from 'node:url';
import { resolve, dirname } from 'node:path';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const source = resolve(root, 'public/logo-oyu-v5.png');
const dest = name => resolve(root, 'public', name);
await sharp(source).resize({ width: 512, withoutEnlargement: true }).webp({ quality: 92, alphaQuality: 100 }).toFile(dest('logo-oyu-v5.webp'));
async function icon(size, scale, name, opaque = false) {
  const box = Math.floor(size * scale);
  const artwork = await sharp(source).resize({ width: box, height: box, fit: 'inside' }).png().toBuffer();
  await sharp({ create: { width: size, height: size, channels: 4, background: opaque ? '#f6f8fc' : { r: 0, g: 0, b: 0, alpha: 0 } } })
    .composite([{ input: artwork, gravity: 'centre' }]).png().toFile(dest(name));
}
await icon(64, .92, 'favicon-oyu-v5.png');
await icon(180, .84, 'apple-icon-oyu-v5.png', true);
await icon(192, .90, 'icon-192-oyu-v5.png');
await icon(512, .90, 'icon-512-oyu-v5.png');
// A .56 square fits wholly within the maskable safe circle (diameter .8).
await icon(512, .56, 'icon-maskable-512-oyu-v5.png', true);
for (const [name, size] of [['favicon-oyu-v5.png',64],['apple-icon-oyu-v5.png',180],['icon-192-oyu-v5.png',192],['icon-512-oyu-v5.png',512],['icon-maskable-512-oyu-v5.png',512]]) {
  const m = await sharp(dest(name)).metadata();
  if (m.width !== size || m.height !== size) throw new Error(`Invalid icon dimensions: ${name}`);
  console.log(`${name}: ${size}×${size}`);
}
