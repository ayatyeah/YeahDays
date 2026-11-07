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
