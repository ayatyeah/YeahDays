/**
 * Ивент «Подготовка к мидтерму» по Computer Networks и его игры.
 *
 * Квиз здесь проверяется только на ход (как в 10-events): содержимое и
 * правила покрыты юнит-тестами. А вот игры тест проходит честно — сам
 * считает верный ответ по тому, что видит на экране, так же, как считал бы
 * студент: по ряду весов 128…1 и по таблице MAC-адресов.
 */

import { check, newUser, openSection, session, test } from "../harness.mjs";

const EVENT = "/events/computer-networks-midterm";
const WEIGHTS = [128, 64, 32, 16, 8, 4, 2, 1];

test("Сети: ивент есть в списке, конспект читается и переводится, квиз по части проходится", async () => {
  const user = await newUser();
  const { browser, page } = await session({ user });
  await openSection(page, "/events");
  await page.getByRole("link", { name: /Подготовка к мидтерму/ }).tap();
  await page.getByText("Готовность к квизу").waitFor({ timeout: 15_000 });
  const map = await page.locator("body").innerText();
  check(map.includes("Lecture 4") && map.includes("Beyond the slides"), "в маршруте четыре лекции и блок «сверх слайдов»");

  await page.getByRole("button", { name: "Начать с первой части" }).tap();
  await page.getByRole("heading", { name: "Network components and types of networks" }).waitFor({ timeout: 10_000 });
  await page.getByRole("button", { name: "Перевести на русский" }).tap();
  await page.getByText("Хосты, клиенты и серверы").waitFor({ timeout: 10_000 });
  check(true, "конспект первой части переводится на русский");
  const body = await page.locator("body").innerText();
  check(body.includes("Подключение") && body.includes("Арендованная линия"), "в конспекте есть таблица подключений");
  check((await page.locator("figure svg").count()) >= 2, "в конспекте есть схемы");
  await page.getByRole("button", { name: "Показать ответ" }).first().tap();
  await page.getByText(/Экстранет — он для людей из другой организации/).waitFor({ timeout: 10_000 });
  await page.getByRole("button", { name: "Знал" }).first().tap();
  check(true, "вопрос для самопроверки раскрывает ответ, и его можно отметить");

  await page.getByRole("button", { name: /Начать квиз по этой части · 8 вопросов/ }).tap();
  for (let i = 1; i <= 8; i++) {
    await page.getByText(`Вопрос ${i} из 8`).waitFor({ timeout: 10_000 });
    await page.locator("section button[lang=en]").first().tap();
    await page.getByRole("status").filter({ hasText: /Верно|Неверно/ }).waitFor({ timeout: 10_000 });
    await page.getByRole("button", { name: i === 8 ? "Завершить квиз" : "Дальше", exact: true }).tap();
  }
  await page.getByText(/из 8/).first().waitFor({ timeout: 10_000 });
  check(true, "квиз из восьми вопросов пройден до результата");
  await browser.close();
});

test("Сети: игра «Ты — коммутатор» — по таблице MAC-адресов отправляю все 12 кадров верно", async () => {
  const user = await newUser();
  const { browser, page } = await session({ user });
  await openSection(page, EVENT);
  await page.getByRole("button", { name: "Открыть игры" }).tap();
  await page.getByRole("button", { name: /Ты — коммутатор/ }).tap();

  const reasons = new Set();
  for (let n = 1; n <= 12; n++) {
    await page.getByText(new RegExp(`Кадр\\s*${n}\\s*из 12`)).waitFor({ timeout: 10_000 });
    // Читаем экран, как игрок: кадр и текущую таблицу.
    const seen = await page.evaluate(() => {
      const dd = [...document.querySelectorAll("dl dd.font-mono")].map((e) => e.textContent.trim());
      const inPort = Number(document.querySelector("section p.uppercase span")?.textContent);
      const table = Object.fromEntries([...document.querySelectorAll("section ul.font-mono li")].map((li) => [li.children[0].textContent, Number(li.children[1].textContent.replace("Fa0/", ""))]));
      return { src: dd[0], dst: dd[1], inPort, table };
    });
    const others = [1, 2, 3, 4].filter((p) => p !== seen.inPort);
    let ports;
    if (seen.dst === "FF:FF") { ports = others; reasons.add("broadcast"); }
    else if (!(seen.dst in seen.table)) { ports = others; reasons.add("unknown"); }
    else if (seen.table[seen.dst] === seen.inPort) { ports = []; reasons.add("same-port"); }
    else { ports = [seen.table[seen.dst]]; reasons.add("known"); }

    for (const port of ports) await page.getByRole("button", { name: `Порт ${port}`, exact: true }).tap();
    await page.getByRole("button", { name: ports.length ? "Отправить в выбранные порты" : "Никуда не отправлять" }).tap();
    const verdict = page.getByRole("status").filter({ hasText: /Верно|Не так/ });
    await verdict.waitFor({ timeout: 10_000 });
    const text = await verdict.innerText();
    if (!text.startsWith("Верно")) check(false, `кадр ${n}: ${seen.src} → ${seen.dst} из порта ${seen.inPort}, отправил в [${ports}] — игра считает иначе: ${text.slice(0, 140)}`);
    await page.getByRole("button", { name: n === 12 ? "Итог" : "Следующий кадр", exact: true }).tap();
  }
  check(reasons.size === 4, `за игру встретились все четыре случая: ${[...reasons].join(", ")}`);
  await page.getByText("Смена окончена").waitFor({ timeout: 10_000 });
  const result = (await page.locator("section").filter({ hasText: "Смена окончена" }).innerText()).replace(/\s+/g, " ");
  check(/12 \/ 12/.test(result) && result.includes("Новый рекорд!"), `итог 12 из 12 и новый рекорд (увидел: ${result.slice(0, 120)})`);

  await page.getByRole("button", { name: "К играм" }).tap();
  await page.getByText(/Рекорд:\s*12\s*из 12/).waitFor({ timeout: 10_000 });
  check(true, "рекорд сохранён и показан в списке игр");
  await browser.close();
});

test("Сети: игра «Двоичный спринт» — набираю числа битами и читаю двоичную запись, очки растут", async () => {
  const user = await newUser();
  const { browser, page } = await session({ user });
  await openSection(page, EVENT);
  await page.getByRole("button", { name: "Открыть игры" }).tap();
  await page.getByRole("button", { name: /Двоичный спринт/ }).tap();
  await page.getByRole("button", { name: /Старт/ }).tap();

  let solved = 0;
  for (let i = 0; i < 6; i++) {
    const round = await page.evaluate(() => {
      const shown = document.querySelector("section p.font-mono")?.textContent.trim() ?? "";
      return { shown, build: !!document.querySelector('[role=group][aria-label="Биты октета"], [role=group][aria-label="Bits of the octet"]') };
    });
    const clean = round.shown.replace(/\s/g, "");
    const value = clean.startsWith("0x") ? parseInt(clean.slice(2), 16) : round.build ? Number(clean) : parseInt(clean, 2);
    if (round.build) {
      for (const w of WEIGHTS) if (value & w) await page.getByRole("button", { name: String(w), exact: true }).tap();
    } else {
      await page.getByRole("button", { name: String(value), exact: true }).tap();
    }
    solved++;
    await page.getByText(new RegExp(`Серия:\\s*${solved}`)).waitFor({ timeout: 10_000 });
  }
  const score = Number((await page.getByText(/Очки:/).innerText()).replace(/\D/g, ""));
  // 10 + 12 + 14 + 16 + 18 + 20: серия без ошибок прибавляет по два очка.
  check(score === 90, `шесть верных ответов подряд дали 90 очков (увидел: ${score})`);
  await browser.close();
});

test("Сети: видео по части — сцены идут одна за другой, озвучка на двух языках, конспект копируется", async () => {
  const user = await newUser();
  // Синтезатор подменяем: ловим, что и на каком языке произносится, и сами завершаем реплики.
  const init = () => {
    const spoken = []; window.__spoken = spoken;
    const voices = [{ name: "Google US English", lang: "en-US" }, { name: "Google русский", lang: "ru-RU" }];
    window.SpeechSynthesisUtterance = function (text) { this.text = text; this.rate = 1; };
    Object.defineProperty(window, "speechSynthesis", { configurable: true, value: { getVoices: () => voices, addEventListener() {}, removeEventListener() {}, cancel() { this.current = null; }, pause() {}, resume() {},
      speak(u) { spoken.push({ text: u.text.slice(0, 40), lang: u.lang }); this.current = u; } } });
    window.__finish = () => { const u = window.speechSynthesis.current; window.speechSynthesis.current = null; u?.onend?.(); };
  };
  const { browser, page, context } = await session({ user, initScript: init });
  await context.grantPermissions(["clipboard-read", "clipboard-write"]).catch(() => {});
  await openSection(page, EVENT);
  await page.getByRole("button", { name: "Начать с первой части" }).tap();

  await page.getByRole("button", { name: "Скопировать конспект" }).tap();
  await page.getByRole("button", { name: /Скопировано|Не удалось скопировать/ }).waitFor({ timeout: 5000 });
  check(true, "кнопка копирования отвечает");

  await page.getByRole("button", { name: "▶ Смотреть как видео" }).tap();
  await page.getByText("1 / ").waitFor({ timeout: 10_000 });
  await page.getByText("Музыка: выкл").or(page.getByText("Музыка: вкл")).first().waitFor();
  // Первая сцена — заголовок: в смешанном режиме сначала английский, потом русский.
  await page.waitForFunction(() => window.__spoken.length >= 1, null, { timeout: 10_000 });
  await page.evaluate(() => window.__finish());
  await page.waitForFunction(() => window.__spoken.length >= 2, null, { timeout: 10_000 });
  const first = await page.evaluate(() => window.__spoken.slice(0, 2));
  check(first[0].lang === "en-US" && first[1].lang === "ru-RU", `заголовок звучит сначала по-английски, затем по-русски (${first.map((s) => s.lang).join(" → ")})`);
  await page.evaluate(() => window.__finish());
  await page.getByText("2 / ").waitFor({ timeout: 10_000 });
  check(true, "после озвучки сцена сменяется следующей");
  // Пауза останавливает смену сцен; «Дальше» листает вручную.
  await page.getByRole("button", { name: "Пауза" }).tap();
  await page.getByRole("button", { name: "Дальше" }).tap();
  await page.getByText("3 / ").waitFor({ timeout: 10_000 });
  await page.getByRole("button", { name: "English" }).tap();
  await page.getByRole("button", { name: "Играть" }).tap();
  await page.waitForFunction((n) => window.__spoken.length > n, 3, { timeout: 10_000 });
  const last = await page.evaluate(() => window.__spoken.at(-1));
  check(last.lang === "en-US", `в режиме English озвучка идёт по-английски (${last.lang})`);
  await page.screenshot({ path: "e2e/.out/video-scene.png" });
  await browser.close();
});
