import { test, check, newUser, session, openSection } from '../harness.mjs';

test('Спринты ПМ: отдельная версия, необратимый ответ и продолжение', async () => {
  const user = await newUser();
  const { page, browser } = await session({ user, engine: 'chromium', serviceWorkers: 'block', initScript: "localStorage.setItem('yd-install-dismissed','1')" });
  try {
    await openSection(page, '/events/project-management-quiz-2-real');
    await page.getByTestId('pm-quiz-version').selectOption('sprints');
    const root = page.getByTestId('pm-sprints');
    await root.getByLabel('Количество вопросов').fill('2');
    await root.getByRole('button', { name: 'Начать спринт', exact: true }).click();
    const question = page.getByTestId('pm-sprint-question');
    const original = await question.locator('h2').innerText();
    const options = question.getByRole('button');
    check(await options.count() === 5, 'исходные пять вариантов');
    check(await root.getByRole('button', { name: 'Следующий →', exact: true }).isDisabled(), 'нельзя пропустить вопрос');
    await options.first().click();
    check(await options.evaluateAll(nodes => nodes.every(n => n.disabled)), 'первый выбор блокирует все варианты');
    check(!(await question.innerText()).includes('Правильный ответ'), 'правильный ответ скрыт до завершения');
    await page.reload({ waitUntil: 'networkidle' });
    await question.waitFor();
    check(await question.locator('h2').innerText() === original, 'вопрос сохранился после перезагрузки');
    check(await options.evaluateAll(nodes => nodes.every(n => n.disabled)), 'после перезагрузки нельзя перевыбрать');
    await page.getByTestId('pm-quiz-version').selectOption('learn');
    await page.getByTestId('pm-real-question').waitFor();
    check(await page.getByTestId('pm-real-question').getByRole('radio').count() === 5, 'старая версия доступна отдельно');
    await page.getByTestId('pm-quiz-version').selectOption('sprints');
    await question.waitFor();
    check(await question.locator('h2').innerText() === original, 'переключение версий сохраняет спринт');
    await root.getByRole('button', { name: 'Следующий →', exact: true }).click();
    const second = await question.locator('h2').innerText();
    check(second !== original, 'нет повторов внутри спринта');
    await root.getByRole('button', { name: '← Назад', exact: true }).click();
    check(await options.evaluateAll(nodes => nodes.every(n => n.disabled)), 'назад не снимает блокировку');
    await root.getByRole('button', { name: 'Следующий →', exact: true }).click();
    await options.nth(1).click();
    await root.getByRole('button', { name: 'Завершить спринт', exact: true }).click();
    const result = page.getByTestId('pm-sprint-result');
    check(await result.locator('details').count() === 2, 'после финиша доступны оба разбора');
    check((await result.innerText()).includes('Пройдено уникальных: 2 / 192'), 'общий охват учитывает оба вопроса');
    await result.getByRole('button', { name: 'Настроить следующий спринт' }).click();
    await root.getByLabel('Количество вопросов').fill('1');
    await root.getByRole('button', { name: 'Начать спринт', exact: true }).click();
    const next = await question.locator('h2').innerText();
    check(next !== original && next !== second, 'следующий спринт берёт непройденный вопрос');
    const footer = await root.locator('footer').boundingBox();
    check(footer.y + footer.height <= page.viewportSize().height + 1, 'кнопки помещаются на мобильном экране');
  } finally { await browser.close(); }
});
