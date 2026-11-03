import { test, check, newUser, session, openSection } from '../harness.mjs';

async function swipe(page, direction, kind = 'normal') {
  await page.evaluate(({ direction,kind }) => {
    const el = kind === 'input' ? document.querySelector('input') : document.querySelector('[data-testid="pm-real-question"] p');
    const x = direction === 'left' ? 280 : 90;
    const to = direction === 'left' ? 90 : 280;
    function event(type, cx, cy) {
      const touch = new Touch({ identifier:1,target:el,clientX:cx,clientY:cy });
      el.dispatchEvent(new TouchEvent(type,{ bubbles:true,cancelable:true,touches:type==='touchend'||type==='touchcancel'?[]:[touch],changedTouches:[touch] }));
    }
    event('touchstart',x,300);
    event('touchmove',to,kind==='vertical'?500:304);
    event(kind==='cancel'?'touchcancel':'touchend',to,kind==='vertical'?500:304);
  },{direction,kind});
}

test('История страниц: кнопки и свайпы везде',async () => {
  const user=await newUser();
  const {page,browser,errors}=await session({user,engine:'chromium',serviceWorkers:'block',initScript:"localStorage.setItem('yd-install-dismissed','1')"});
  const nav=page.getByRole('navigation',{name:'История страниц',exact:true});
  const back=nav.getByRole('button',{name:'Назад',exact:true});
  const forward=nav.getByRole('button',{name:'Вперёд',exact:true});
  try {
    await openSection(page,'/learn');
    check(await nav.isVisible(),'общие кнопки на Учёбе');
    await page.getByRole('link').filter({hasText:'Квиз 2 · Вопросы из реального теста'}).first().click();
    await page.getByTestId('pm-real-question').waitFor();
    check(await back.isEnabled(),'внутренняя ссылка добавлена в историю');
    check(await forward.isDisabled(),'на конце истории вперёд недоступно');
    await page.reload();
    await page.getByTestId('pm-real-question').waitFor();
    check(await back.isEnabled(),'история переживает перезагрузку');
    await swipe(page,'left','input');
    await swipe(page,'left','vertical');
    await swipe(page,'left','cancel');
    check(page.url().endsWith('/events/project-management-quiz-2-real'),'поля, вертикаль и отмена не вызывают переход');
    await swipe(page,'left');
    await page.waitForURL('**/learn');
    check(await forward.isEnabled(),'свайп влево возвращает назад');
    await page.waitForTimeout(450);
    await forward.click();
    await page.getByTestId('pm-real-question').waitFor();
    check(page.url().endsWith('/events/project-management-quiz-2-real'),'кнопка вперёд восстанавливает страницу');
    await page.waitForTimeout(450);
    await back.click();
    await page.waitForURL('**/learn');
    await page.waitForTimeout(450);
    // Exercise the same document gesture on a different page, outside the quiz.
    await page.locator('h1').first().evaluate(el => {
      const fire=(type,x) => {const t=new Touch({identifier:2,target:el,clientX:x,clientY:300});el.dispatchEvent(new TouchEvent(type,{bubbles:true,cancelable:true,touches:type==='touchend'?[]:[t],changedTouches:[t]}));};
      fire('touchstart',90);fire('touchmove',280);fire('touchend',280);
    });
    await page.getByTestId('pm-real-question').waitFor();
    check(page.url().endsWith('/events/project-management-quiz-2-real'),'свайп вправо идёт вперёд из другого раздела');
    const rect=await nav.boundingBox();
    check(rect.y===0 && rect.height>=44,'кнопки видны над полноэкранным квизом');
    await page.getByRole('link',{name:'← Учёба',exact:true}).click();
    await page.waitForURL('**/learn');
    check(await forward.isDisabled(),'новый переход обрезает ветку вперёд');
    await page.screenshot({path:'artifacts/pm-real-quiz/history-learn.png'});
    if (errors.length) console.log('Browser diagnostics:',errors);
    check(!errors.some(e=>/hydration|Minified React error|Uncaught|useInsertionEffect|Cannot update/i.test(e)),'нет ошибок React');
  } finally {await browser.close();}
});
