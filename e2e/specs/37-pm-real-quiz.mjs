import { mkdirSync } from 'node:fs';
import { test, check, newUser, session, openSection } from '../harness.mjs';

test('Реальный квиз ПМ: варианты, разборы, конспекты и сохранение', async () => {
  const user = await newUser();
  const { page, browser, errors } = await session({ user, engine: 'chromium', serviceWorkers: 'block', initScript: "localStorage.setItem('yd-install-dismissed','1')" });
  const root = page.getByTestId('pm-real-quiz');
  try {
    await openSection(page, '/learn');
    check(await page.getByRole('link').filter({ hasText: 'Квиз 2 · Вопросы из реального теста' }).count() > 0, 'отдельная карточка в Учёбе');
    await openSection(page, '/events/project-management-test-2');
    await page.getByRole('link').filter({ hasText: 'Квиз 2 · Вопросы из реального теста' }).click();
    await root.waitFor();
    const question = page.getByTestId('pm-real-question');
    await question.getByRole('radio').first().waitFor();
    check(await question.getByRole('radio').count() === 5, 'оригинальные A–E');
    check(await page.getByTestId('pm-real-explanation').count() === 0, 'ответ скрыт до проверки');
    await question.getByRole('radio').nth(2).check();
    await question.getByRole('button', { name: 'Проверить ответ', exact: true }).click();
    check((await page.getByTestId('pm-real-explanation').innerText()).includes('Есть ошибка. Ответ: A'), 'проверяется по лекции, а не пометкам на фото');
    await page.reload();
    await question.getByRole('radio').first().waitFor();
    check(await question.getByRole('radio').nth(2).isChecked(), 'проверенный ответ сохранён');
    await root.getByLabel('Вариант теста', { exact: true }).selectOption('4');
    check((await root.innerText()).includes('Отсутствуют №28, 29, 30, 31, 32, 38, 39, 40, 41, 42, 48, 49, 50'), 'пробелы источников видны');
    await root.getByLabel('Вариант теста', { exact: true }).selectOption('unknown');
    check((await root.innerText()).includes('По фильтрам: 18 вопросов'), 'неизвестные страницы отдельно');
    await root.getByLabel('Вариант теста', { exact: true }).selectOption('5');
    check((await root.innerText()).includes('По фильтрам: 46 вопросов'), 'неподтверждённый вариант 5 включает найденный вопрос 50');
    await root.getByLabel('Вариант теста', { exact: true }).selectOption('all');
    await root.getByLabel('Показать', { exact: true }).selectOption('errors');
    check((await root.innerText()).includes('По фильтрам: 1 вопросов'), 'фильтр ошибок исключает пропуски');
    await question.getByRole('button', { name: 'Решить ещё раз', exact: true }).click();
    check((await root.innerText()).includes('По этим фильтрам вопросов нет'), 'повторный ответ очищает текущую ошибку');
    await root.getByRole('button', { name: 'Краткий конспект', exact: true }).click();
    check(await root.locator('section[id^="note-"]').count() === 15, '15 тем краткого конспекта');
    await root.getByRole('button', { name: 'Развёрнутый конспект', exact: true }).click();
    check((await root.innerText()).includes('12 месяцев / SPI 0,8 = 15 месяцев'), 'развёрнутый расчёт по исходному сценарию');
    await root.locator('#note-evm').getByRole('button', { name: 'В1 · №18 →', exact: true }).click();
    check((await question.innerText()).includes('Вариант 1 · №18'), 'переход из конспекта к оригинальному вопросу');
    await question.getByRole('button', { name: 'Показать разбор без ответа', exact: true }).click();
    check((await page.getByTestId('pm-real-explanation').innerText()).includes('без зачёта ответа'), 'просмотр не засчитывается как решение');
    await question.getByText(/Сверить оригинал/).click();
    const photo = question.locator('img').first();
    await photo.waitFor();
    await page.waitForFunction(() => { const img = document.querySelector('[data-testid="pm-real-question"] img'); return img?.complete && img.naturalWidth > 0; });
    check(await photo.evaluate(img => img.complete && img.naturalWidth > 0), 'исходное фото загружается');
    mkdirSync('artifacts/pm-real-quiz', { recursive: true });
    for (const width of [320,390,1440]) {
      await page.setViewportSize({ width, height:900 });
      check(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `нет горизонтального переполнения ${width}`);
      await page.screenshot({ path: `artifacts/pm-real-quiz/questions-${width}.png` });
    }
    await root.getByRole('button', { name:'Источники', exact:true }).click();
    check(await root.locator('details').count() === 41, 'все 41 фото доступны');
    await root.getByRole('button', { name:'Развёрнутый конспект', exact:true }).click();
    await page.setViewportSize({ width:390,height:900 });
    await page.screenshot({ path:'artifacts/pm-real-quiz/notes-390.png' });
    check(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'конспект помещается на мобильном экране');
    check(!errors.some(e => /hydration|Minified React error|Uncaught/i.test(e)), 'нет ошибок React');
  } finally { await browser.close(); }
});
