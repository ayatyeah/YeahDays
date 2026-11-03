import { test, check, newUser, session, openSection } from '../harness.mjs';

test('Квиз ПМ: назад из конспекта восстанавливает вопрос', async () => {
  const user=await newUser();
  const {page,browser,errors}=await session({user,engine:'chromium',serviceWorkers:'block',initScript:"localStorage.setItem('yd-install-dismissed','1')"});
  const root=page.getByTestId('pm-real-quiz');
  const question=page.getByTestId('pm-real-question');
  const history=page.getByRole('navigation',{name:'История страниц',exact:true});
  try {
    await openSection(page,'/events/project-management-quiz-2-real');
    await question.waitFor();
    await page.getByTestId('pm-quiz-filters').locator(':scope > summary').click();
    await root.getByLabel('Вариант теста',{exact:true}).selectOption('4');
    await root.getByText('Перейти к номеру вопроса',{exact:true}).click();
    await root.getByRole('button',{name:'Вариант 4, вопрос 18',exact:true}).click();
    await question.getByRole('radio').nth(2).check();
    await root.getByRole('button',{name:'Краткий конспект',exact:true}).click();
    check(page.url().includes('pmView=brief'),'конспект — отдельная запись истории');
    await root.getByRole('navigation',{name:'Оглавление конспекта'}).getByRole('link').last().click();
    check(!new URL(page.url()).hash,'оглавление не добавляет лишний шаг назад');
    await history.getByRole('button',{name:'Назад',exact:true}).click();
    await question.waitFor();
    check((await question.innerText()).includes('Вариант 4 · №18'),'возвращается исходный вопрос');
    check(await question.getByRole('radio').nth(2).isChecked(),'непроверенный выбор сохранён');
    await page.waitForTimeout(450);
    await history.getByRole('button',{name:'Вперёд',exact:true}).click();
    await root.locator('#note-evm').waitFor();
    check(await question.count()===0,'вперёд снова открывает конспект');
    await page.reload();
    await root.locator('#note-evm').waitFor();
    await history.getByRole('button',{name:'Назад',exact:true}).click();
    await question.waitFor();
    check((await question.innerText()).includes('Вариант 4 · №18'),'назад работает после перезагрузки конспекта');
    check(await question.getByRole('radio').nth(2).isChecked(),'черновик восстановлен после перезагрузки');
    await page.getByTestId('pm-quiz-controls').getByRole('button',{name:'Проверить ответ',exact:true}).click();
    await page.getByTestId('pm-real-explanation').locator(':scope > summary').click();
    await question.getByRole('button',{name:/Разобраться:/}).first().click();
    await root.locator('#note-evm').waitFor();
    await page.waitForTimeout(450);
    await history.getByRole('button',{name:'Назад',exact:true}).click();
    await question.waitFor();
    check((await question.innerText()).includes('Вариант 4 · №18'),'тематическая ссылка тоже возвращает к тому же вопросу');
    check(await question.getByRole('radio').nth(2).isDisabled(),'проверенный результат сохранён');
    await page.reload();
    await question.waitFor();
    check((await question.innerText()).includes('Вариант 4 · №18'),'обычная перезагрузка сохраняет позицию');
    // A fresh route visit has no quiz history snapshot and resumes from the account's saved view.
    await openSection(page,'/learn');
    await openSection(page,'/events/project-management-quiz-2-real');
    await question.waitFor();
    check((await question.innerText()).includes('Вариант 4 · №18'),'возвращение из другого раздела сохраняет позицию');
    check(!errors.some(e=>/hydration|Minified React error|Uncaught|useInsertionEffect|Cannot update/i.test(e)),'нет ошибок React');
  } finally {await browser.close();}
});
