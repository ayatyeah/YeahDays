import { mkdirSync } from 'node:fs';
import { test, check, newUser, session, openSection } from '../harness.mjs';

test('Квиз ПМ: отдельный вариант, сохранение, сдача и таймер', async () => {
  const user=await newUser();
  const {page,browser,errors}=await session({user,serviceWorkers:'block',initScript:"localStorage.setItem('yd-install-dismissed','1')"});
  const open=async()=>{
    await openSection(page,'/events/project-management-test-2');
    await page.getByRole('button',{name:'Открыть Квиз 2',exact:true}).click();
    await page.getByTestId('pm-quiz2').waitFor();
  };
  try {
    await open();
    check(await page.getByRole('heading',{name:'ПРАКТИКА ПО ЛЕКЦИЯМ 4–8',exact:true}).count()===1,'отдельный экран с заданным названием');
    await page.getByRole('button',{name:'Начать 60 минут',exact:true}).click();
    await page.getByTestId('quiz2-question').waitFor();
    check(await page.getByRole('radio').count()===5,'пять вариантов A–E');
    check(await page.getByTestId('quiz2-review').count()===0,'разбор скрыт до сдачи');
    await page.getByRole('radio').nth(2).check();
    await page.getByText('Перейти к вопросу · 1 / 50',{exact:true}).click();
    await page.getByRole('button',{name:'Вопрос 50, без ответа',exact:true}).click();
    check((await page.getByTestId('quiz2-question').innerText()).includes('Вопрос 50 из 50'),'сетка ведёт к любому вопросу');
    await page.getByRole('button',{name:'Вопрос 1, отвечен',exact:true}).click();
    await page.getByText('Перейти к вопросу · 1 / 50',{exact:true}).click();
    await page.getByRole('button',{name:'Дальше →',exact:true}).click();
    await page.getByRole('radio').nth(1).check();
    await page.getByRole('button',{name:'← Назад',exact:true}).click();
    check(await page.getByRole('radio').nth(2).isChecked(),'можно вернуться к ответу');
    await page.reload(); await page.getByRole('button',{name:'Открыть Квиз 2',exact:true}).click();
    await page.getByTestId('quiz2-question').waitFor();
    check(await page.getByRole('radio').nth(2).isChecked(),'ответ сохранён после перезагрузки');
    mkdirSync('artifacts/pm-quiz2',{recursive:true});
    for(const width of [320,390,1440]) {
      await page.setViewportSize({width,height:900});
      check(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`без переполнения ${width}px`);
      await page.screenshot({path:`artifacts/pm-quiz2/quiz-${width}.png`});
    }
    await page.getByRole('button',{name:'Сдать квиз',exact:true}).click();
    await page.getByRole('button',{name:'Продолжить решать',exact:true}).click();
    check(await page.getByTestId('quiz2-result').count()===0,'отмена сдачи сохраняет попытку открытой');
    await page.getByRole('button',{name:'Сдать квиз',exact:true}).click();
    await page.getByRole('button',{name:'Подтвердить сдачу',exact:true}).click();
    await page.getByTestId('quiz2-result').waitFor();
    check(await page.getByTestId('quiz2-review').count()===50,'после сдачи доступны разборы всех 50 вопросов');
    check(await page.getByRole('radio').count()===0,'сданные ответы нельзя изменить');
    await page.getByRole('button',{name:'Пройти заново',exact:true}).click();
    check(await page.getByRole('radio').nth(2).isChecked()===false,'повторная попытка начинается без старых ответов');
    await page.evaluate(userId=>{
      const key=`yg-pm-quiz2:v1:${userId}`;
      const a=JSON.parse(localStorage.getItem(key));
      a.startedAt=Date.now()-3600000-1000; a.deadline=a.startedAt+3600000;
      localStorage.setItem(key,JSON.stringify(a));
    },user.id);
    await page.reload(); await page.getByRole('button',{name:'Открыть Квиз 2',exact:true}).click();
    await page.getByTestId('quiz2-result').waitFor();
    check((await page.getByTestId('quiz2-result').innerText()).includes('автоматически'),'просроченная попытка автоматически сдаётся после возвращения');
    check(!errors.some(e=>/hydration|Minified React error|Uncaught/i.test(e)),'нет ошибок React');
  } finally { await browser.close(); }
});
