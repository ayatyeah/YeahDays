import { mkdirSync } from 'node:fs';
import { test, check, newUser, session, openSection } from '../harness.mjs';

test('Прайм: реальные задачи, прогресс и мобильная навигация', async () => {
  const day = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Almaty' });
  const todo = (id, title, done = false) => ({ id, title, date: day, priority: 'normal', done, doneDays: [], repeat: null, note: '', subtasks: [], createdAt: Date.now(), duration: 25 });
  const user = await newUser({ state: { todos: [todo('prime-read', 'Прочитать 10 страниц', true), todo('prime-sql', 'Разобраться с SQL JOIN'), todo('prime-walk', 'Прогуляться 20 минут')] } });
  const { page, browser, errors } = await session({ user, serviceWorkers: 'block', initScript: "localStorage.setItem('yd-install-dismissed', '1')" });
  try {
    await openSection(page, '/today');
    await page.locator('.prime-hero h2').getByText('Разобраться с SQL JOIN', { exact: true }).waitFor();
    check((await page.locator('.prime-day-count').innerText()).includes('1 из 3'), 'счётчик показывает реальные выполненные задачи');
    check(await page.locator('.yg-bottom-nav button').count() === 4, 'четыре основных раздела');
    mkdirSync('artifacts/prime', { recursive: true });
    for (const width of [390, 320, 1440]) {
      await page.setViewportSize({ width, height: width === 1440 ? 1000 : 844 });
      await page.screenshot({ path: `artifacts/prime/today-${width}.png` });
      check(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `экран ${width}px не переполняется`);
    }
    await page.setViewportSize({ width: 390, height: 844 });
    for (const [locale, title] of [['en', 'Today'], ['kk', 'Бүгін'], ['ru', 'Сегодня']]) {
      await page.evaluate(locale => localStorage.setItem('yg-locale', JSON.stringify({ state: { locale }, version: 0 })), locale);
      await page.reload({ waitUntil: 'networkidle' });
      await page.locator('.prime-title-row h1').getByText(title, { exact: true }).waitFor();
      check(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `новый экран помещается на языке ${locale}`);
      await page.screenshot({ path: `artifacts/prime/today-${locale}.png` });
    }
    await page.locator('.prime-hero .flow-primary').click();
    await page.locator('#flow-task').getByRole('button', { name: 'Дело выполнено', exact: true }).click();
    await page.waitForFunction(() => document.querySelector('.prime-day-count')?.textContent.includes('2 из 3'));
    check(true, 'главное действие завершает задачу и обновляет прогресс');
    await page.waitForFunction(async () => (await fetch('/api/state').then(r => r.json())).data?.todos?.find(t => t.id === 'prime-sql')?.done);
    check(true, 'выполнение сохранено на сервере');
    await page.locator('.prime-learning').click();
    await page.waitForURL('**/learn');
    check(true, 'учебная карточка открывает учёбу');
    await page.locator('.yg-bottom-nav button').first().click();
    await page.waitForURL('**/today');
    await page.locator('.prime-community').click();
    await page.waitForURL('**/community');
    check(true, 'сообщество доступно после изменения навигации');
    check(!errors.some(e => /hydration|Minified React error|Uncaught/i.test(e)), 'нет ошибок React');
  } finally { await browser.close(); }
});
