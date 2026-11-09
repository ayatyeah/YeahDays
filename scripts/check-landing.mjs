import assert from 'node:assert/strict';
import { mkdirSync, writeFileSync } from 'node:fs';
import { chromium } from 'playwright';
const base = process.env.E2E_BASE || 'http://localhost:3100';
const browser = await chromium.launch();
const results = [];
mkdirSync('artifacts/landing-prime', { recursive: true });
try {
  const context = await browser.newContext({ baseURL: base, viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1, serviceWorkers: 'block' });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/', { waitUntil: 'networkidle' });
  await page.locator('#prime-hero-title').waitFor();
  const consent = page.getByRole('button', { name: 'Принять', exact: true });
  await consent.waitFor();
  await consent.click();
  await consent.waitFor({ state: 'hidden' });
  assert.equal(await page.locator('h1').count(), 1);
  assert.equal(await page.locator('h1').getAttribute('aria-label'), 'YEAH GRIND');
  for (const width of [1440, 1280, 768, 390, 320]) {
    await page.setViewportSize({ width, height: width < 700 ? 844 : 1000 });
    await page.waitForTimeout(180);
    if (await consent.isVisible()) await consent.click();
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `horizontal overflow at ${width}`);
    const heroHeading = await page.locator('#prime-hero-title').boundingBox();
    const copyHeading = await page.getByRole('heading', { name: 'Не идеальнее. Чуть лучше.', exact: true }).boundingBox();
    assert(heroHeading.y + heroHeading.height <= copyHeading.y, `headline overlaps copy at ${width}`);
    if (width < 700) {
      const card = await page.getByRole('region', { name: 'Демо приложения', exact: true }).boundingBox();
      assert(card.y + card.height <= copyHeading.y, `demo overlaps copy at ${width}`);
    }
    const cta = page.getByRole('link', { name: 'Начать свой путь', exact: false }).first();
    const box = await cta.boundingBox();
    assert(box.x >= 0 && box.x + box.width <= width && box.height >= 44, `CTA bounds at ${width}`);
    await page.screenshot({ path: `artifacts/landing-prime/landing-${width}.png` });
    results.push({ width, overflow: false, ctaHeight: box.height });
  }
  const demo = page.getByRole('region', { name: 'Демо приложения', exact: true });
  await demo.getByRole('button', { name: 'Попробовать в демо', exact: false }).click();
  await demo.getByRole('status').getByText('Готово! +14 XP в демо', { exact: true }).waitFor();
  await demo.getByRole('button', { name: 'Ещё одно действие', exact: false }).click();
  await demo.getByRole('heading', { name: 'Выйди на прогулку', exact: true }).waitFor();
  await page.getByRole('button', { name: 'Открыть меню', exact: true }).click();
  const menu = page.getByRole('navigation', { name: 'Мобильная навигация', exact: true });
  await menu.getByRole('link', { name: 'Как это работает', exact: false }).click();
  await page.waitForURL('**/#how');
  assert.equal(await menu.count(), 0);
  for (const [locale, label] of [['en', 'Start your journey'], ['kk', 'Өз жолыңды баста']]) {
    await page.evaluate(locale => localStorage.setItem('yg-locale', JSON.stringify({ state: { locale }, version: 0 })), locale);
    await page.goto('/', { waitUntil: 'networkidle' });
    await page.getByRole('link', { name: label, exact: false }).first().waitFor();
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `overflow ${locale}`);
    await page.screenshot({ path: `artifacts/landing-prime/landing-${locale}.png` });
  }
  await page.getByRole('link', { name: 'Өз жолыңды баста', exact: false }).first().click();
  await page.waitForURL(url => ['/login', '/register', '/today'].includes(url.pathname));
  assert.equal(errors.length, 0, errors.join('\n'));
  results.push({ demo: 'passed', navigation: 'passed', locales: ['ru','en','kk'], browserErrors: errors });
  writeFileSync('artifacts/landing-prime/verification.json', JSON.stringify(results, null, 2));
  console.log(JSON.stringify(results, null, 2));
} finally { await browser.close(); }
