import { mkdirSync } from 'node:fs';
import { test, check, newUser, session, openSection, openPlan, sql } from '../harness.mjs';
async function edit(page, title) {
 const sec = page.locator('[data-section="today"]');
 const first = sec.getByRole('button', { name: 'Добавить первое дело', exact: true });
 if (await first.isVisible()) await first.click();
 else await openPlan(sec);
 const more = sec.getByText('Добавить или изменить задачи', { exact: true });
 if (!(await sec.getByPlaceholder('Что нужно сделать?').isVisible())) await more.click();
 await sec.getByPlaceholder('Что нужно сделать?').fill(title);
 await sec.getByRole('button', { name: '+', exact: true }).click();
}
test('Качество: два устройства работают офлайн и сохраняют свои задачи', async () => {
 const user = await newUser();
 const a = await session({ user, serviceWorkers: 'block' });
 const b = await session({ user, serviceWorkers: 'block' });
 try {
   await openSection(a.page, '/today'); await openSection(b.page, '/today');
   // Wait for both durable checkpoints before disconnecting.
   for (const client of [a, b]) await client.page.waitForFunction(owner => !!localStorage.getItem(`yg-sync-v2:${owner}`), user.id);
   await a.context.setOffline(true); await b.context.setOffline(true);
   await edit(a.page, 'Offline phone'); await edit(b.page, 'Offline laptop');
   await a.context.setOffline(false); await b.context.setOffline(false);
   await a.page.waitForFunction(async () => {
     const { data } = await fetch('/api/state').then(r => r.json());
     return data?.todos?.some(t => t.title === 'Offline phone') && data?.todos?.some(t => t.title === 'Offline laptop');
   });
   check(true, 'обе задачи сохранились после восстановления сети');
   await a.page.reload({ waitUntil: 'networkidle' });
   await a.page.waitForFunction(() => {
     const state = JSON.parse(localStorage.getItem('yeahdays-store')).state;
     return state.todos.some(t => t.title === 'Offline phone') && state.todos.some(t => t.title === 'Offline laptop');
   });
   check(true, 'после перезагрузки обе задачи доступны на устройстве');
   let writes = 0;
   const count = req => { if (new URL(req.url()).pathname === '/api/state' && req.method() === 'PUT') writes++; };
   a.page.on('request', count);
   await a.page.waitForTimeout(3500);
   check(writes <= 1, 'подтверждённый снимок не вызывает бесконечные перезаписи');
   mkdirSync('artifacts/quality', { recursive: true });
   await a.page.locator('[data-section="today"] .flow-next').waitFor();
   await a.page.screenshot({ path: 'artifacts/quality/today-mobile.png' });
   await a.page.setViewportSize({ width: 1440, height: 1000 });
   await a.page.goto('/calendar', { waitUntil: 'networkidle' });
   check(await a.page.locator('.yg-sidebar [aria-current="page"]').innerText() === 'Сегодня', 'календарь относится к Сегодня на десктопе');
   await a.page.screenshot({ path: 'artifacts/quality/calendar-desktop.png' });
   for (const [locale, label] of [['en', 'Today'], ['kk', 'Бүгін']]) {
     await a.page.evaluate(locale => localStorage.setItem('yg-locale', JSON.stringify({ state: { locale }, version: 0 })), locale);
     await a.page.reload({ waitUntil: 'networkidle' });
     check((await a.page.locator('.yg-sidebar [aria-current="page"]').innerText()) === label, `навигация переведена: ${locale}`);
   }
   await a.page.goto('/today', { waitUntil: 'networkidle' });
   await a.page.screenshot({ path: 'artifacts/quality/today-kk-desktop.png' });
   check(await a.page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'нет горизонтального переполнения');
 } finally { await a.browser.close(); await b.browser.close(); }
});

test('Качество: повторение занятия планируется без повторного начисления XP', async () => {
 const user = await newUser();
 const profile = { xp: 50, coins: 20, owned: ['default'], equipped: 'default', skills: [{ id: 'review-skill', title: 'SQL basics', subject: { name: 'Databases', materials: '' }, goal: 'Understand joins', minutes: 15, createdAt: new Date().toISOString(), quests: [{ id: 'review-quest', title: 'LEFT JOIN', lesson: 'LEFT JOIN retains unmatched rows from the left table.', exercise: 'Explain the result of a LEFT JOIN.', rubric: 'left rows', boss: false, completed: true, attempts: 1, feedback: 'Correct: unmatched rows remain.', completedAt: new Date().toISOString() }] }] };
 sql(`INSERT INTO "LearningProfile" ("userId", data, revision, "updatedAt") VALUES ('${user.id}', '${JSON.stringify(profile)}'::jsonb, 1, now())`);
 const { page, browser } = await session({ user, serviceWorkers: 'block' });
 try {
   await page.goto('/learn?view=lesson&skill=review-skill&quest=review-quest', { waitUntil: 'networkidle' });
   await page.getByRole('button', { name: 'Повторить завтра', exact: true }).click();
   await page.getByText('Повторение добавлено в план на завтра.', { exact: true }).waitFor();
   await page.getByLabel('Воспроизведи решение без подсказки', { exact: true }).fill('The left rows remain even without a match.');
   await page.getByRole('button', { name: 'Сравнить с разбором', exact: true }).click();
   await page.getByRole('button', { name: 'Повторение выполнено', exact: true }).click();
   check(sql(`SELECT data->>'xp' FROM "LearningProfile" WHERE "userId"='${user.id}'`) === '50', 'повторение не начисляет XP повторно');
   await page.waitForFunction(async () => (await fetch('/api/state').then(r => r.json())).data?.todos?.some(t => t.note.includes('review-quest')));
   check(true, 'запланированное повторение сохранено на сервере');
   mkdirSync('artifacts/quality', { recursive: true });
   await page.screenshot({ path: 'artifacts/quality/lesson-review-mobile.png' });
 } finally { await browser.close(); }
});
