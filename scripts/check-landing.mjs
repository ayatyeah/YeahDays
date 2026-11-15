import assert from 'node:assert/strict';
import { mkdirSync, writeFileSync } from 'node:fs';
import { chromium } from 'playwright';
const base = process.env.E2E_BASE || 'http://localhost:3100';
const out = 'artifacts/landing-prime';
const browser = await chromium.launch();
const results = [];
mkdirSync(out, { recursive: true });
try {
  const context = await browser.newContext({ baseURL: base, viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1, serviceWorkers: 'block' });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/', { waitUntil: 'load' });
  await page.locator('#hero-title').waitFor();
  await page.evaluate(() => document.fonts.ready);
  assert.equal(await page.locator('h1').count(), 1);
  assert.match(await page.locator('h1').innerText(), /Find your focus/);
  assert(!/RMT|Cloud Comp|Comp Net|Comp Vision|Project Management/.test(await page.locator('main').innerText()), 'landing describes benefits rather than named courses');
  for (const theme of ['light', 'dark']) {
    const toggle = page.getByRole('button', { name: `Switch to ${theme} theme`, exact: true });
    if (await toggle.isVisible()) await toggle.click();
    for (const width of [1440, 1280, 768, 390, 320]) {
      await page.setViewportSize({ width, height: width < 700 ? 844 : 1000 });
      await page.waitForTimeout(350);
      assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `horizontal overflow at ${width} ${theme}`);
      const cta = await page.locator('.p-hero-actions .f-button').boundingBox();
      assert(cta.x >= 0 && cta.x + cta.width <= width && cta.height >= 44, `CTA bounds at ${width}`);
      await page.screenshot({ path: `${out}/${theme}-${width}.png` });
      results.push({ theme, width, overflow: false, ctaHeight: cta.height });
    }
  }
  await page.getByRole('button', { name: 'Practise', exact: true }).click();
  await page.getByRole('heading', { name: 'Turn understanding into practice.', exact: true }).waitFor();
  assert.equal(await page.getByRole('button', { name: 'Practise', exact: true }).getAttribute('aria-pressed'), 'true');
  await page.getByRole('button', { name: 'Reflect', exact: true }).click();
  assert.equal(await page.getByRole('button', { name: 'Reflect', exact: true }).getAttribute('aria-pressed'), 'true');
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.locator('.p-hero-actions .p-text-link').click();
  await page.waitForURL('**/#features');
  await page.locator('#features').scrollIntoViewIfNeeded();
  await page.evaluate(() => window.scrollBy(0, 830));
  await page.waitForTimeout(400);
  assert.equal(await page.locator('.p-feature-book').count(), 5);
  assert.equal(await page.locator('.p-feature-book').first().evaluate(el => getComputedStyle(el).position), 'sticky');
  await page.screenshot({ path: `${out}/overlapping-books.png` });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  assert.notEqual(await page.locator('.p-feature-book').first().evaluate(el => getComputedStyle(el).position), 'sticky');
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  // A focused link must never be obscured behind another sticky book.
  await page.locator('.p-feature-book a').first().focus();
  await page.keyboard.press('Tab');
  assert.notEqual(await page.locator('.p-feature-book').first().evaluate(el => getComputedStyle(el).position), 'sticky');
  await page.locator('summary').filter({ hasText: 'Do I have to use AI?' }).click();
  await page.getByText('No. Choose a standard plan', { exact: false }).waitFor();
  await page.locator('.p-hero-actions .f-button').click();
  await page.waitForURL('**/register');
  assert.equal(errors.length, 0, errors.join('\n'));
  results.push({ notebookTabs: true, stickyStack: true, reducedMotion: true, keyboardAccess: true, registrationLink: true, browserErrors: errors });
  writeFileSync(`${out}/verification.json`, JSON.stringify(results, null, 2));
  console.log(JSON.stringify(results, null, 2));
} finally { await browser.close(); }
