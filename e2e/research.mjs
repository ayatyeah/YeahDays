// DATABASE_URL=postgresql://.../research_test AUTH_SECRET=... E2E_BASE=http://localhost:3109 node e2e/research.mjs
// Server must use the same DB/secret, RESEARCH_ENABLED=true, valid contact/delete date.
import assert from 'node:assert/strict';
import { PrismaClient } from '@prisma/client';
import { encode } from 'next-auth/jwt';
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';
const url = new URL(process.env.DATABASE_URL || 'https://invalid');
const base = process.env.E2E_BASE || 'http://localhost:3109';
assert(['localhost', '127.0.0.1'].includes(url.hostname) && /test/.test(url.pathname), 'Use an isolated local test database');
assert(['localhost', '127.0.0.1'].includes(new URL(base).hostname));
assert(process.env.AUTH_SECRET, 'Provide the test server AUTH_SECRET');
const db = new PrismaClient();
const browser = await chromium.launch({ headless: true });
const ids = [];
async function account(owner = false) {
  const user = await db.user.create({ data: { email: owner ? 'research-owner@test.local' : `research-${crypto.randomUUID()}@test.local`, name: 'Test' } }); ids.push(user.id);
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const token = await encode({ secret: process.env.AUTH_SECRET, salt: 'authjs.session-token', token: { id: user.id, sub: user.id, email: user.email, name: user.name } });
  await context.addCookies([{ name: 'authjs.session-token', value: token, url: base, httpOnly: true }]);
  return { user, context, page: await context.newPage() };
}
async function post(context, body) {
  const r = await context.request.post(`${base}/api/research`, { data: body });
  assert.equal(r.status(), 200, await r.text()); return r.json();
}
try {
  const anon = await browser.newContext();
  assert.equal((await anon.request.get(`${base}/api/research`)).status(), 401);
  const a = await account();
  await a.page.goto(`${base}/research`);
  await a.page.getByRole('heading', { name: 'Перед началом' }).waitFor();
  for (const checkbox of await a.page.getByRole('checkbox').all()) await checkbox.check();
  await a.page.getByRole('button', { name: 'Начать участие', exact: true }).click();
  await a.page.getByText('0 очков', { exact: true }).waitFor();
  await a.page.getByRole('button', { name: 'Открыть и начать', exact: true }).first().click();
  await a.page.getByRole('button', { name: 'Завершить', exact: true }).click();
  await a.page.getByText('10 очков', { exact: true }).waitFor();
  await Promise.all(Array.from({ length: 3 }, () => post(a.context, { action: 'complete', taskId: 'w1-plan' })));
  let row = await db.researchParticipant.findUniqueOrThrow({ where: { userId: a.user.id } });
  assert.equal(row.data.events.filter(e => e.event_type === 'task_complete').length, 1);
  assert.equal((await a.context.request.post(`${base}/api/research`, { data: { action: 'complete', taskId: 'w2-plan' } })).status(), 400);
  const b = await account();
  const enrollment = { action: 'enroll', version: 'assignment3-v1', adult: true, notDeveloper: true, consent: true, aiConsent: true };
  const second = await post(b.context, { ...enrollment, condition: row.condition });
  assert.notEqual(second.participant.condition, row.condition);
  const standard = row.condition === 'A' ? a : b;
  const feedback = await standard.context.request.post(`${base}/api/research/feedback`);
  assert.equal(feedback.status(), 200); assert.equal((await feedback.json()).source, 'standard');
  assert.equal((await a.context.request.get(`${base}/api/owner/research`)).status(), 403);
  // Simulate week four only in this isolated pilot database.
  await db.researchParticipant.update({ where: { userId: a.user.id }, data: { enrolledAt: new Date(Date.now() - 22 * 86400000) } });
  await a.page.reload();
  await a.page.getByRole('button', { name: 'Отправить ответы' }).waitFor();
  for (const textbox of await a.page.getByRole('textbox').all()) await textbox.fill('Neutral test feedback');
  await a.page.getByRole('button', { name: 'Отправить ответы' }).click();
  await a.page.getByText('Ответы сохранены. Спасибо!').waitFor();
  assert(await a.page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
  mkdirSync('artifacts/research', { recursive: true });
  await a.page.screenshot({ path: 'artifacts/research/mobile.png', fullPage: true });
  await a.page.setViewportSize({ width: 1440, height: 1000 });
  await a.page.screenshot({ path: 'artifacts/research/desktop.png', fullPage: true });
  const owner = await account(true);
  const exp = await owner.context.request.get(`${base}/api/owner/research`);
  assert.equal(exp.status(), 200); const text = await exp.text();
  assert(!text.includes(a.user.id)); assert(!text.includes(a.user.email)); assert(!text.includes('Neutral test feedback'));
  const interviews = await owner.context.request.get(`${base}/api/owner/research?dataset=interviews`);
  assert((await interviews.text()).includes('Neutral test feedback'));
  await db.researchParticipant.update({ where: { userId: b.user.id }, data: { pilot: true } });
  const filtered = await (await owner.context.request.get(`${base}/api/owner/research`)).json();
  assert(!filtered.participants.some(p => p.participant_id === second.participant.participantId));
  const own = await a.context.request.get(`${base}/api/account`);
  assert.equal(own.status(), 200); assert.equal((await own.json()).research.participantId, row.participantId);
  await post(a.context, { action: 'withdraw' });
  row = await db.researchParticipant.findUniqueOrThrow({ where: { userId: a.user.id } });
  assert(row.withdrawnAt); assert(row.data.consentInformation.deleteAt); assert.deepEqual(row.data.events, []); assert.equal(row.data.interview, null);
  assert.equal((await a.context.request.post(`${base}/api/research`, { data: { action: 'start', taskId: 'w1-review' } })).status(), 400);
  assert((await post(a.context, enrollment)).participant.withdrawnAt);
  const withdrawnExport = await (await owner.context.request.get(`${base}/api/owner/research`)).json();
  assert.deepEqual(withdrawnExport.participants.find(p => p.participant_id === row.participantId).weeks, []);
  console.log('PASS: browser consent/task/interview, persisted events, deduplication, assignment, authorization, exports, withdrawal and responsive widths');
} finally {
  await browser.close(); await db.user.deleteMany({ where: { id: { in: ids } } }); await db.$disconnect();
}
