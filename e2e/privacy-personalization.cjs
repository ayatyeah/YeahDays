// Local release server: AUTH_SECRET=local-privacy-test-secret PUSH_SCHEDULER=off
// Uses one disposable database account; no paid AI requests or real notifications.
const { chromium } = require('playwright');
const { PrismaClient } = require('@prisma/client');
const { randomUUID } = require('node:crypto');
const assert = require('node:assert/strict');
(async () => {
  const db = new PrismaClient(); const id = 'qa-privacy-' + randomUUID(); let browser;
  try {
    await db.user.create({ data: { id, name: 'Privacy QA' } });
    const old = { id: 'old', title: 'Old task', date: '2026-09-28', done: true, doneDays: [], priority: 'normal', subtasks: [], createdAt: Date.now(), completedAt: Date.now() };
    await db.userState.create({ data: { userId: id, data: { todos: [old], plan: [] }, clientAt: new Date() } });
    browser = await chromium.launch(); const page = await browser.newPage({ viewport: { width: 390, height: 844 }, serviceWorkers: 'block' });
    const errors = []; page.on('pageerror', e => errors.push(e.message));
    const { encode } = await import('@auth/core/jwt');
    await page.context().addCookies([{ name: 'authjs.session-token', value: await encode({ secret: 'local-privacy-test-secret', salt: 'authjs.session-token', token: { id, sub: id, name: 'Privacy QA' } }), url: 'http://localhost:3121' }]);
    await page.route('**/api/**', async route => {
      const path = new URL(route.request().url()).pathname;
      if (['/api/personalization', '/api/account'].includes(path)) return route.continue();
      let data = { ok: true };
      if (path === '/api/auth/session') data = { user: { id, name: 'Privacy QA' }, expires: '2099-01-01T00:00:00Z' };
      if (path === '/api/state') data = { data: null, updatedAt: null };
      if (path === '/api/learning') data = { xp: 0, coins: 0, owned: ['default'], equipped: 'default', skills: [], revision: 0, available: false };
      await route.fulfill({ contentType: 'application/json', body: JSON.stringify(data) });
    });
    const post = body => page.request.post('http://localhost:3121/api/personalization', { data: body });
    let result = await (await post({ action: 'heartbeat', seconds: 99999 })).json();
    assert.equal(result.enabled, false); assert.equal(result.totals.seconds, 0);
    await page.goto('http://localhost:3121/personalization');
    await page.getByRole('checkbox').first().waitFor();
    assert.equal(await page.getByRole('checkbox').nth(1).isChecked(), false);
    await page.getByRole('checkbox').first().check();
    await page.getByRole('checkbox').nth(1).check();
    await page.getByRole('button', { name: 'Принять выбранные настройки' }).click();
    await page.getByRole('button', { name: 'Отключить и удалить статистику активности' }).waitFor();
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
    await db.userState.update({ where: { userId: id }, data: { data: { todos: [old, { ...old, id: 'new', title: 'New task' }], plan: [] } } });
    await Promise.all([post({ action: 'heartbeat', section: 'calendar', userId: 'somebody-else' }), post({ action: 'heartbeat', section: 'calendar' })]);
    result = await (await page.request.get('http://localhost:3121/api/personalization')).json();
    assert.equal(result.totals.tasks, 1); assert.ok(result.totals.seconds >= 15 && result.totals.seconds <= 30);
    await page.reload(); await page.getByRole('heading', { name: 'Достижения', exact: true }).waitFor();
    await page.screenshot({ path: '/tmp/personalization-mobile.png', fullPage: true });
    let exported;
    for (let attempt = 0; attempt < 3; attempt++) {
      const response = await page.request.get('http://localhost:3121/api/account');
      if (response.ok()) { exported = await response.json(); break; }
    }
    assert.ok(exported?.personalization, 'Account export must include personalization');
    assert.equal(exported.personalization.data.version, '2026-09-29'); assert.equal(exported.personalization.data.receipts.length, 1);
    await page.getByRole('button', { name: 'Отключить и удалить статистику активности' }).click();
    await page.getByRole('button', { name: 'Разрешить учёт активности' }).waitFor();
    result = await (await post({ action: 'heartbeat', section: 'today' })).json();
    assert.equal(result.enabled, false); assert.equal(result.totals.seconds, 0); assert.equal(result.totals.tasks, 0);
    assert.equal((await db.personalizationProfile.findUnique({ where: { userId: id } })).data.receipts.length, 2);
    assert.deepEqual(errors, []);
    console.log('PASS: real DB consent, opt-in default off, baseline, concurrent heartbeat deduplication, ownership, export, withdrawal, mobile UI.');
  } finally {
    if (browser) await browser.close();
    await db.user.deleteMany({ where: { id } });
    assert.equal(await db.personalizationProfile.count({ where: { userId: id } }), 0);
    await db.$disconnect(); console.log('Temporary QA account removed; activity cascade verified.');
  }
})().catch(e => { console.error(e.message); process.exitCode = 1; });
