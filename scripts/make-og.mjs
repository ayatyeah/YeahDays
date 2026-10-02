// Картинка для превью ссылки (og:image): 1200×630, логотип и слоган.
// Запуск: node scripts/make-og.mjs — результат в public/og.png.
import sharp from "sharp";

const W = 1200, H = 630;
const logo = await sharp("public/logo-white.png").resize({ height: 150 }).toBuffer();
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#17132b"/><stop offset="1" stop-color="#08080b"/>
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#g)"/>
  <text x="80" y="330" font-family="Inter, DejaVu Sans, sans-serif" font-size="92" font-weight="800" fill="#f4f4f5">YeahGrind</text>
  <text x="80" y="410" font-family="Inter, DejaVu Sans, sans-serif" font-size="42" fill="#c4b5fd">Одно действие в день</text>
  <text x="80" y="486" font-family="Inter, DejaVu Sans, sans-serif" font-size="30" fill="#8b8d98">План под твоё состояние · учёба · квизы · челленджи</text>
  <text x="80" y="566" font-family="Inter, DejaVu Sans, sans-serif" font-size="28" fill="#8b8d98">yeahgrind.site</text>
</svg>`;
await sharp(Buffer.from(svg)).composite([{ input: logo, left: 80, top: 70 }]).png().toFile("public/og.png");
console.log("public/og.png written");
