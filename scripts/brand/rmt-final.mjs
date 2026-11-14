import sharp from 'sharp';
import { readFile } from 'node:fs/promises';
// Keep the original YeahGrind identity in every generated asset.
const logo = await readFile('public/logo.webp');
const og = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630"><rect width="1200" height="630" fill="#f6f8fc"/><circle cx="1070" cy="220" r="265" fill="#e9edff"/><circle cx="1130" cy="570" r="160" fill="#eae5fa"/><g font-family="DejaVu Sans, sans-serif" fill="#17213b"><text x="182" y="115" font-size="38" font-weight="bold">YeahGrind</text><text x="76" y="292" font-size="73" font-weight="bold" letter-spacing="-3">Make learning</text><text x="76" y="378" font-size="73" font-weight="bold" letter-spacing="-3">a practice.</text><text x="80" y="456" font-size="25" fill="#606b80">Choose a course. Take a small step. Make it yours.</text><text x="80" y="564" font-size="20" fill="#4858d6">yeahgrind.site</text></g></svg>`;
await sharp(Buffer.from(og)).composite([{input:await sharp(logo).resize({width:83}).toBuffer(),left:76,top:64},{input:await sharp(logo).resize({width:205}).toBuffer(),left:922,top:266}]).png().toFile('public/og-final.png');
for(const [w,h] of [[1320,2868],[1290,2796],[1284,2778],[1242,2688],[1206,2622],[1179,2556],[1170,2532],[1125,2436],[828,1792],[750,1334]]) {
 const s=Math.round(w*.22);
 const splash=`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><rect width="${w}" height="${h}" fill="#f6f8fc"/><text x="${w/2}" y="${h*.42+s+w*.09}" font-family="DejaVu Sans, sans-serif" font-size="${w*.06}" font-weight="bold" text-anchor="middle" fill="#17213b">YeahGrind</text></svg>`;
 await sharp(Buffer.from(splash)).composite([{input:await sharp(logo).resize({width:s}).toBuffer(),left:Math.round((w-s)/2),top:Math.round(h*.42)}]).png().toFile(`public/splash/${w}x${h}-final.png`);
}
