import { check, newUser, openSection, session, test } from "../harness.mjs";

test("CN endterm: materials, full bank, multiple answers and saved exam", async () => {
  const user = await newUser();
  const { browser, page } = await session({user, engine:"chromium"});
  try {
    await openSection(page,"/events");
    await page.locator('a[href="/events/computer-networks-endterm"]').click();
    await page.getByRole("button",{name:"Открыть подготовку к эндке"}).click();
    await page.getByRole("heading",{name:"Лекции 5–10 · оригиналы PDF"}).waitFor();
    check(await page.locator('a[href$=".pdf"]').count()===6,"all six lecture PDFs linked");
    const pdf=await page.request.get("/events/computer-networks-endterm/lecture-6.pdf");
    check(pdf.ok() && pdf.headers()["content-type"].includes("pdf"),"lecture 6 PDF available");
    await page.getByRole("button",{name:"Подробные конспекты",exact:true}).click();
    await page.locator("summary").filter({hasText:"Модуль 11"}).click();
    check((await page.locator("details[open]").innerText()).length>1000,"detailed IPv4 notes render");
    await page.getByRole("button",{name:"Банк вопросов",exact:true}).click();
    await page.getByLabel("Только 250 вопросов модулей 8–16").check();
    await page.getByRole("status").filter({hasText:"Найдено: 250"}).waitFor();
    await page.getByLabel("Поиск",{exact:true}).fill("E200");
    await page.getByText("Найдено: 1 · страница 1 / 1").waitFor();
    await page.getByText("Показать ответ и объяснение",{exact:true}).click();
    check((await page.locator("details[open]").innerText()).includes("Transport layer"),"bank answer revealed");
    await page.getByRole("button",{name:"Пробная эндка",exact:true}).click();
    await page.getByRole("button",{name:"Начать новый вариант"}).click();
    await page.locator('input[type="radio"]').first().check();
    await page.locator('input[type="checkbox"]').first().check();
    await page.locator("textarea").first().fill("My saved open response");
    check(await page.locator("article").count()===30,"30 questions with five written responses");
    check(await page.locator("textarea").count()===5,"five open questions");
    await page.screenshot({path:"e2e/.out/cn-endterm-mobile.png",fullPage:false});
    await page.reload();
    await page.getByRole("button",{name:"Открыть подготовку к эндке"}).click();
    await page.getByRole("button",{name:"Пробная эндка",exact:true}).click();
    await page.getByRole("button",{name:"Завершить и показать разбор"}).waitFor();
    check(await page.locator("textarea").first().inputValue()==="My saved open response","open response restored");
    check(await page.locator('input[type="radio"]:checked').count()===1,"MCQ restored");
    await page.getByRole("button",{name:"Завершить и показать разбор"}).click();
    await page.getByText(/Результат автопроверки:/).waitFor();
    check(await page.locator("textarea:disabled").count()===5,"submitted responses locked");
    check(await page.getByText("Эталон для самопроверки:",{exact:true}).count()===5,"open model answers shown");
    check(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),"no mobile horizontal overflow");
    await page.getByRole("button",{name:"Начать новый вариант"}).click();
    await page.evaluate(() => {
      const key=Object.keys(localStorage).find(k=>k.startsWith("yg:cn-endterm:v1:"));
      const saved=JSON.parse(localStorage.getItem(key));
      saved.deadline=Date.now()-1000;
      localStorage.setItem(key,JSON.stringify(saved));
    });
    await page.reload();
    await page.getByRole("button",{name:"Открыть подготовку к эндке"}).click();
    await page.getByRole("button",{name:"Пробная эндка",exact:true}).click();
    await page.getByText("Результат автопроверки: 0 / 80").waitFor();
    check(await page.locator("textarea:disabled").count()===5,"expired attempt automatically locked after reopening");
    await page.setViewportSize({width:1280,height:900});
    await page.getByRole("button",{name:"Лекции и материалы",exact:true}).click();
    await page.screenshot({path:"e2e/.out/cn-endterm-desktop.png",fullPage:true});
  } finally { await browser.close(); }
});

test("CN endterm: full and short lecture notes in RU and EN", async () => {
  const user = await newUser();
  const { browser, page } = await session({user, engine:"chromium"});
  try {
    await openSection(page,"/events/computer-networks-endterm");
    await page.getByRole("button",{name:"Начать с первой части",exact:true}).click();
    const notes=page.getByTestId("lecture-notes");
    const language=page.getByRole("group",{name:"Язык конспекта",exact:true});
    const length=page.getByRole("group",{name:"Объём конспекта",exact:true});
    await notes.waitFor();
    check(await notes.getAttribute("data-notes-version")==="full","full notes selected by default");
    for(const lang of ["RU","EN"]){
      await language.getByRole("button",{name:lang,exact:true}).click();
      await length.getByRole("button",{name:"Полный конспект",exact:true}).click();
      const full=await notes.innerText();
      check(full.length>1800 && await notes.locator("table").count()===1,`${lang}: full explanation and header comparison table`);
      await length.getByRole("button",{name:"Краткий конспект",exact:true}).click();
      check((await notes.innerText()).length<full.length/2,`${lang}: concise version is shorter`);
      check(await language.getByRole("button",{name:lang,exact:true}).getAttribute("aria-pressed")==="true",`${lang}: length switch preserves language`);
    }
    await length.getByRole("button",{name:"Полный конспект",exact:true}).click();
    await page.screenshot({path:"e2e/.out/cn-full-en.png",fullPage:true});
    await page.reload();
    await page.getByRole("button",{name:"Начать с первой части",exact:true}).click();
    check(await notes.getAttribute("data-notes-version")==="full","selected length restored");
    await language.getByRole("button",{name:"RU",exact:true}).click();
    await page.setViewportSize({width:1280,height:900});
    await page.screenshot({path:"e2e/.out/cn-full-ru.png",fullPage:true});
    check(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),"no horizontal overflow");
    for(let i=0;i<2;i++) await page.getByRole("button",{name:/Следующая часть/}).click();
    await notes.locator("pre").first().waitFor();
    check(await notes.locator("pre").count()===2,"IOS and SSH commands render as two code blocks");
    check((await notes.locator("pre").first().innerText()).includes("no shutdown"),"IOS command formatting preserved");
  } finally { await browser.close(); }
});
