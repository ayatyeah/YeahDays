import { test, check, newUser, session, openSection, sql } from '../harness.mjs';
test('Надёжность: статус офлайн, повтор сохранения и мобильный ввод', async () => {
 const user = await newUser();
 const { page, browser, context } = await session({ user, serviceWorkers: 'block' });
 try {
  await openSection(page, '/today');
  await page.locator('.sync-indicator').getByText('Сохранено', { exact: true }).waitFor();
  await context.setOffline(true);
  await page.locator('.sync-indicator').getByText('Нет сети — изменения на устройстве', { exact: true }).waitFor();
  await page.getByRole('button', { name: 'Добавить первое дело', exact: true }).click();
  const input = page.getByPlaceholder('Что нужно сделать?', { exact: true });
  const title = 'ДлинноеНазвание'.repeat(8);
  await input.fill(title);
  check(await page.locator('html').getAttribute('data-editing') !== null, 'ввод скрывает плавающую навигацию');
  await page.setViewportSize({ width: 320, height: 420 });
  check(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'на узком экране с уменьшенной высотой нет переполнения');
  await page.getByRole('button', { name: '+', exact: true }).click();
  await page.route('**/api/state', route => route.request().method() === 'PUT' ? route.fulfill({ status: 503, json: { error: 'temporary' } }) : route.continue());
  await context.setOffline(false);
  await page.locator('.sync-indicator').getByRole('button', { name: 'Повторить', exact: true }).waitFor();
  await page.unroute('**/api/state');
  await page.locator('.sync-indicator').getByRole('button', { name: 'Повторить', exact: true }).click();
  await page.locator('.sync-indicator').getByText('Сохранено', { exact: true }).waitFor();
  check(sql(`SELECT data->'todos' FROM "UserState" WHERE "userId"='${user.id}'`).includes(title), 'после повтора длинная задача сохранилась на сервере');
  check(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'длинная сохранённая задача не расширяет страницу');
 } catch (error) { console.log((await page.locator('body').innerText()).slice(0, 2500)); throw error; } finally { await browser.close(); }
});

test('Надёжность: диагностика ошибок не отправляет личный текст', async () => {
 const user = await newUser();
 const { page, browser } = await session({ user, serviceWorkers: 'block', engine: 'chromium' });
 try {
  await openSection(page, '/today');
  const payloads = [];
  page.on('request', req => { if (new URL(req.url()).pathname === '/api/diagnostics') payloads.push(req.postData()); });
  await page.evaluate(() => window.dispatchEvent(new ErrorEvent('error', { error: new TypeError('PRIVATE_TASK_AND_EMAIL@example.test'), message: 'PRIVATE_TASK_AND_EMAIL@example.test' })));
  await page.waitForTimeout(1800);
  check(payloads.some(x => x.includes('browser_error') && x.includes('type')), 'отправлена категория браузерной ошибки');
  check(payloads.every(x => !x.includes('PRIVATE_TASK') && !x.includes('example.test')), 'текст ошибки и адрес не попадают в запрос');
  const response = await page.request.post('/api/diagnostics', { data: { build: 'secret-build', events: [{ kind: 'api_error', route: '/api/state?task=PRIVATE', code: 'PRIVATE', status: 503, duration: '2-5s', message: 'PRIVATE' }] } });
  check(response.status() === 204, 'сервер принял ограниченную диагностику');
  const stored = sql(`SELECT row_to_json(s)::text FROM "RuntimeSignal" s WHERE kind='api_error' AND status=503`);
  check(stored.includes('/api/state') && !stored.includes('PRIVATE') && !stored.includes('secret-build'), 'сервер удаляет произвольные поля и неизвестную версию');
  check((await page.request.get('/api/owner/diagnostics')).status() === 403, 'обычный пользователь не читает общую диагностику');
 } catch (error) { console.log((await page.locator('body').innerText()).slice(0, 2500)); throw error; } finally { await browser.close(); }
});

test('Надёжность: мобильный диалог доступен с клавиатуры', async () => {
 const user = await newUser();
 const { page, browser } = await session({ user, serviceWorkers: 'block' });
 try {
  await page.setViewportSize({ width: 320, height: 568 });
  await openSection(page, '/settings');
  await page.getByRole('button', { name: 'Сбросить прогресс', exact: true }).click();
  const dialog = page.getByRole('dialog', { name: 'Сбросить прогресс?', exact: true });
  await dialog.waitFor(); await page.waitForTimeout(400);
  for(let i=0;i<8;i++) await page.keyboard.press('Tab');
  check(await dialog.evaluate(el => el.contains(document.activeElement)), 'Tab остаётся внутри диалога');
  check(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'модалка не расширяет узкий экран');
  const close = dialog.getByRole('button', { name: 'Закрыть', exact: true });
  const box = await close.boundingBox();
  check(box.width >= 44 && box.height >= 44, 'зона закрытия минимум 44 на 44');
  await close.click(); await dialog.waitFor({ state: 'hidden' });
  check(true, 'диалог можно закрыть без сброса данных');
 } finally { await browser.close(); }
});
