import { readFileSync } from 'node:fs';
import { messages } from '../../src/i18n/messages.ts';
import { test, check, newUser, session, openSection, sql } from '../harness.mjs';
for (const locale of ['ru', 'en', 'kk']) test(`Языки: вход, первая задача, выполнение, повторение и настройки (${locale})`, async () => {
 const dictionary = locale === 'ru' ? {} : JSON.parse(readFileSync(new URL(`../../src/i18n/dict/${locale}.json`, import.meta.url)));
 const tx = text => dictionary[text] || text;
 const t = key => messages[locale][key];
 const user = await newUser({ state: { name: 'Alex' } });
 const profile = { xp: 50, coins: 20, owned: ['default'], equipped: 'default', skills: [{ id: 'locale-skill', title: 'SQL basics', subject: { name: 'Databases', materials: '' }, goal: 'Understand joins', minutes: 15, createdAt: new Date().toISOString(), quests: [{ id: 'locale-quest', title: 'LEFT JOIN', lesson: 'LEFT JOIN retains unmatched left rows.', exercise: 'Explain LEFT JOIN.', rubric: 'left rows', boss: false, completed: true, attempts: 1, feedback: 'Correct: unmatched rows remain.' }] }] };
 sql(`INSERT INTO "LearningProfile" ("userId", data, revision, "updatedAt") VALUES ('${user.id}', '${JSON.stringify(profile)}'::jsonb, 1, now())`);
 const { page, browser } = await session({ user, serviceWorkers: 'block', initScript: `localStorage.setItem('yg-locale', ${JSON.stringify(JSON.stringify({ state: { locale }, version: 0 }))})` });
 try {
  await openSection(page, '/today');
  await page.getByRole('button', { name: t('flow.add'), exact: true }).click();
  await page.getByPlaceholder(tx('Что нужно сделать?'), { exact: true }).fill('My own task');
  await page.getByRole('button', { name: '+', exact: true }).click();
  await page.getByRole('button', { name: tx('выполнить'), exact: true }).click();
  await page.waitForFunction(async () => (await fetch('/api/state').then(r => r.json())).data?.todos?.some(t => t.title === 'My own task' && t.done));
  check(true, 'создание и выполнение сохранились; личный текст не изменился');
  await openSection(page, '/learn?view=lesson&skill=locale-skill&quest=locale-quest');
  await page.getByRole('button', { name: t('review.plan'), exact: true }).click();
  await page.getByText(t('review.saved'), { exact: true }).waitFor();
  await page.getByLabel(t('review.recall'), { exact: true }).fill('All left rows remain.');
  await page.getByRole('button', { name: t('review.compare'), exact: true }).click();
  await page.getByRole('button', { name: t('review.finish'), exact: true }).click();
  await page.getByText(t('review.finished'), { exact: true }).waitFor();
  check(true, 'результат занятия и следующий шаг переведены');
  await openSection(page, '/settings');
  await page.getByRole('button', { name: tx('Сбросить прогресс'), exact: true }).click();
  const dialog = page.getByRole('dialog', { name: tx('Сбросить прогресс?'), exact: true });
  await dialog.getByRole('button', { name: tx('Отмена'), exact: true }).click();
  check(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'настройки и диалог помещаются на мобильном экране');
 } finally { await browser.close(); }
});
