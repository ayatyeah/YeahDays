import assert from 'node:assert/strict';
import { mkdirSync, writeFileSync } from 'node:fs';
import { chromium } from 'playwright';
import { newUser, cleanupUsers, assertLocalDb } from '../e2e/harness.mjs';
const base = process.env.E2E_BASE || 'http://localhost:3100';
assert(['localhost', '127.0.0.1', '[::1]'].includes(new URL(base).hostname), 'account-creating checks require a local server');
assertLocalDb();
const out = 'artifacts/prime-workspace';
mkdirSync(out, { recursive: true });
const browser = await chromium.launch();
const checks = [];
const errors = [];
const context = await browser.newContext({ baseURL: base, viewport: { width: 1440, height: 1000 }, serviceWorkers: 'block' });
const page = await context.newPage();
page.setDefaultTimeout(15000);
page.on('pageerror', error => errors.push(error.message));
page.on('console', message => { if (message.type() === 'error' && /hydration|Minified React|Uncaught/i.test(message.text())) errors.push(message.text()); });
function check(name, value) { assert(value, name); checks.push(name); }
async function go(path) { await page.goto(path, { waitUntil: 'load' }); await page.waitForTimeout(450); }
async function shot(name) { await page.evaluate(() => document.fonts.ready); await page.waitForTimeout(350); await page.screenshot({ path: `${out}/${name}.png` }); }
async function login(target, user) {
  await target.goto('/login', { waitUntil: 'load' });
  await target.locator('[name=identifier]').fill(user.email);
  await target.locator('[name=password]').fill(user.password);
  await target.locator('button[type=submit]').click();
  await target.waitForURL(url => !url.pathname.startsWith('/login'));
}
try {
  check('private API requires authentication', (await context.request.get('/api/final-study')).status() === 401);
  await go('/app');
  check('private page redirects guests', ['/login', '/register'].includes(new URL(page.url()).pathname));
  const user = await newUser();
  await login(page, user);
  await go('/app');
  await page.getByRole('button', { name: 'Create my study plan', exact: true }).waitFor();
  check('five original courses and philosophy available', await page.locator('.p-folder').count() === 6);
  await shot('app-desktop');
  await page.getByRole('button', { name: 'Create my study plan', exact: true }).click();
  await page.locator('#study-goal').fill('Understand cloud storage choices');
  await page.locator('input[name=course]').first().check();
  await page.locator('input[name=mode][value=standard]').check();
  // A failed save must retain input and allow a real retry.
  await page.route('**/api/final-study', route => route.request().method() === 'POST' ? route.fulfill({ status: 503, json: { error: 'unavailable' } }) : route.continue());
  await page.locator('button[type=submit]').filter({ hasText: 'Create my study plan' }).click();
  await page.locator('.f-alert').waitFor();
  check('failed save retains goal', await page.locator('#study-goal').inputValue() === 'Understand cloud storage choices');
  await page.unroute('**/api/final-study');
  await page.locator('button[type=submit]').filter({ hasText: 'Create my study plan' }).click();
  await page.getByRole('link', { name: 'Continue learning', exact: true }).waitFor();
  checks.push('standard plan created after retry');
  const state = await (await context.request.get('/api/final-study')).json();
  check('nine tasks saved to account', state.study.tasks.length === 9);
  check('cross-origin write rejected', (await context.request.post('/api/final-study', { headers: { Origin: 'https://untrusted.invalid' }, data: { action: 'start', taskId: state.study.tasks[0].id } })).status() === 403);
  await page.getByRole('link', { name: 'Continue learning', exact: true }).click();
  await page.getByRole('button', { name: 'Start this task', exact: true }).click();
  await page.getByRole('button', { name: 'Mark complete', exact: true }).waitFor();
  await page.getByText('Add a reflection', { exact: false }).first().click();
  await page.getByPlaceholder('What did you try?', { exact: false }).fill('My private reflection from the Prime browser check.');
  await page.getByRole('button', { name: 'Save reflection', exact: true }).click();
  await page.waitForFunction(() => document.querySelector('.f-reflection-editor button')?.disabled);
  await page.getByRole('button', { name: 'Mark complete', exact: true }).click();
  await page.getByText('Task completed. 10 XP added to your progress.', { exact: true }).waitFor();
  await go('/progress');
  await page.getByText('My private reflection from the Prime browser check.', { exact: true }).waitFor();
  checks.push('task completion and private reflection persist');
  // Another account must not receive the first learner's plan or reflection.
  const second = await browser.newContext({ baseURL: base, serviceWorkers: 'block' });
  try {
    const otherPage = await second.newPage();
    await login(otherPage, await newUser());
    const otherState = await (await second.request.get('/api/final-study')).json();
    check('account isolation', otherState.study === null);
    check('owner diagnostics restricted', (await second.request.get('/api/owner/diagnostics')).status() === 403);
  } finally { await second.close(); }
  await go('/events/all');
  check('events remain available', await page.locator('.p-event-grid a').count() > 0);
  await shot('events');
  await go('/events/cloud-computing-endterm/notes');
  await page.locator('.g-note-paper').first().waitFor();
  await shot('reader-desktop');
  await page.getByRole('button', { name: 'Switch to dark theme', exact: true }).click();
  for (const width of [390, 320]) {
    await page.setViewportSize({ width, height: 844 });
    await page.locator('.p-inline-clean-toggle').click();
    check(`clean mode hides chrome ${width}`, !(await page.locator('.f-navigation-wrap').isVisible()) && !(await page.locator('.f-mobile-dock').isVisible()));
    const exit = await page.locator('.p-inline-clean-toggle').boundingBox();
    const language = await page.locator('.g-language-options').boundingBox();
    const translate = await page.locator('.g-translator-toggle').boundingBox();
    check(`clean controls fit ${width}`, exit.x >= 0 && exit.x + exit.width <= language.x + 1 && language.x + language.width <= translate.x + 1 && translate.x + translate.width <= width);
    await page.getByRole('button', { name: 'Русский', exact: true }).click();
    check(`Russian notes ${width}`, await page.locator('.g-note-paper [lang=ru]').count() > 0);
    await page.getByRole('button', { name: 'English', exact: true }).click();
    await shot(`reader-clean-dark-${width}`);
    await page.getByRole('button', { name: 'Translate a phrase', exact: true }).click();
    await page.locator('.g-translator').waitFor();
    check(`translator stays available ${width}`, await page.getByLabel('A word or short phrase').isVisible());
    await page.getByRole('button', { name: 'Close translator' }).click();
    await page.locator('.p-inline-clean-toggle').click();
    const nav = await page.locator('.f-mobile-dock').boundingBox();
    const assistant = await page.locator('.g-tutor-launch').boundingBox();
    check(`assistant above mobile nav ${width}`, assistant && nav && assistant.y + assistant.height + 10 <= nav.y);
    const overflow = await page.evaluate(() => [...document.querySelectorAll('main *')].map(el => ({ tag: el.tagName, class: el.className, width: el.getBoundingClientRect().width, right: el.getBoundingClientRect().right })).filter(el => el.right > innerWidth + 2 && el.width > innerWidth).slice(0, 12));
    if (overflow.length) console.log({ width, overflow });
    check(`notes have no horizontal overflow ${width}`, await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
  }
  await go('/app');
  await page.setViewportSize({ width: 390, height: 844 });
  await shot('app-mobile-dark');
  check('three mobile destinations', await page.locator('.f-mobile-dock a').count() === 3);
  for (const slug of ['research-methods', 'cloud-computing', 'computer-networks', 'computer-vision', 'project-management', 'philosophy']) {
    await go(`/events/${slug}-final`);
    await page.locator('.g-notes-articles .g-note-paper').first().waitFor();
    check(`${slug} final guide available`, await page.locator('#final-guide-title').isVisible());
    check(`${slug} source links available`, await page.locator('a[href^="https://lms.astanait.edu.kz/"]').count() > 1);
    check(`${slug} fits mobile`, await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
  }
  await shot('philosophy-final-mobile');
  for (const path of ['/events-data/yeahtrack-defense', '/events-data/computer-networks-endterm', '/events/computer-networks-endterm/question-bank.md', '/events/computer-networks-endterm/core-250.md', '/events/computer-networks-endterm/sample.pdf']) {
    check(`retired material unavailable ${path}`, (await context.request.get(path)).status() === 404);
  }
  await go('/events/cloud-computing-endterm');
  check('old cloud link opens final notebook', new URL(page.url()).pathname === '/events/cloud-computing-final');
  check('old exam bank entry removed', await page.getByRole('button', { name: 'Exam questions', exact: false }).count() === 0);
  check('no runtime errors', errors.length === 0);
  writeFileSync(`${out}/verification.json`, JSON.stringify({ checks, errors }, null, 2));
  console.log(JSON.stringify({ checks, errors }, null, 2));
} catch (error) {
  await shot('failure').catch(() => {});
  writeFileSync(`${out}/failure.txt`, `${error.stack}\n${await page.locator('body').innerText().catch(() => '')}`);
  throw error;
} finally { await browser.close(); cleanupUsers(); }
