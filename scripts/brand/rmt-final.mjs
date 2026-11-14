import sharp from 'sharp';
import { writeFile } from 'node:fs/promises';
const mark = `<rect width="512" height="512" rx="132" fill="#4858d6"/><path d="M124 148h63l48 136 46-136h63l-85 217c-20 49-46 67-91 67h-29v-53h26c22 0 33-10 41-31Z" fill="white"/><circle cx="366" cy="327" r="26" fill="#b9efd9"/>`;
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">${mark}</svg>`;
await writeFile('public/brand/yeahgrind.svg', svg);
for (const [name, size] of [['favicon',64],['icon-192',192],['icon-512',512],['apple-icon',180]]) await sharp(Buffer.from(svg)).resize(size,size).png().toFile(`public/${name}-v4.png`);
await sharp({create:{width:512,height:512,channels:4,background:'#4858d6'}}).composite([{input:await sharp(Buffer.from(svg)).resize(384,384).png().toBuffer()}]).png().toFile('public/icon-maskable-512-v4.png');
const og = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630"><rect width="1200" height="630" fill="#f6f8fc"/><circle cx="1070" cy="220" r="265" fill="#e9edff"/><circle cx="1130" cy="570" r="160" fill="#d5f4e8"/><g transform="translate(76 65) scale(.14)">${mark}</g><g font-family="DejaVu Sans, sans-serif" fill="#17213b"><text x="166" y="114" font-size="38" font-weight="bold">YeahGrind</text><text x="76" y="292" font-size="73" font-weight="bold" letter-spacing="-3">Make learning</text><text x="76" y="378" font-size="73" font-weight="bold" letter-spacing="-3">a practice.</text><text x="80" y="456" font-size="25" fill="#606b80">Your goal. Your study plan. Your next small win.</text><text x="80" y="564" font-size="20" fill="#4858d6">yeahgrind.site</text></g><g transform="translate(947 265) scale(.30)">${mark}</g></svg>`;
await writeFile('public/brand/social.svg',og);
await sharp(Buffer.from(og)).png().toFile('public/og-final.png');
for(const [w,h] of [[1320,2868],[1290,2796],[1284,2778],[1242,2688],[1206,2622],[1179,2556],[1170,2532],[1125,2436],[828,1792],[750,1334]]) {
 const s=w*.20;
 const splash=`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><rect width="${w}" height="${h}" fill="#f6f8fc"/><g transform="translate(${(w-s)/2} ${h*.42}) scale(${s/512})">${mark}</g><text x="${w/2}" y="${h*.42+s+w*.10}" font-family="DejaVu Sans, sans-serif" font-size="${w*.06}" font-weight="bold" text-anchor="middle" fill="#17213b">YeahGrind</text></svg>`;
 await sharp(Buffer.from(splash)).png().toFile(`public/splash/${w}x${h}-final.png`);
}
