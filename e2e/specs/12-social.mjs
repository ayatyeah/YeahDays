/**
 * Сообщество как соцсеть, единое согласие и счётчик посещений.
 *
 * Здесь важнее всего границы: без своего профиля ленту можно читать, но
 * нельзя действовать; чужой прогресс и посты не появляются там, где их
 * не должно быть; одно согласие действительно заменяет несколько.
 */

import { check, newUser, openSection, session, sql, test } from "../harness.mjs";

const tabs = (page) => page.getByRole("group", { name: "Разделы сообщества" });
const publish = (user) => sql(`insert into "CommunityProfile"("userId", published, "updatedAt") values ('${user.id}', true, now() at time zone 'utc') on conflict ("userId") do update set published = true`);
const seedPost = (user, text) => {
  const id = `e2e-post-${user.id.slice(0, 8)}-${Math.random().toString(36).slice(2, 8)}`;
  sql(`insert into "SocialPost"(id, "userId", text, "createdAt") values ('${id}', '${user.id}', '${text}', now() at time zone 'utc')`);
  return id;
};

test("Сообщество: создаю профиль одним нажатием, публикую пост — другой человек лайкает, комментирует и подписывается", async () => {
  const author = await newUser();
  const reader = await newUser();
  publish(reader);

  const a = await session({ user: author });
  await openSection(a.page, "/community");
  await a.page.getByRole("heading", { name: "Создай профиль в сообществе" }).waitFor({ timeout: 15_000 });
  check((await a.page.getByLabel("Новый пост").count()) === 0, "пока профиля нет, писать посты нельзя");

  await a.page.getByRole("button", { name: "Создать профиль" }).tap();
  await a.page.getByLabel("Новый пост").waitFor({ timeout: 10_000 });
  check(sql(`select published from "CommunityProfile" where "userId" = '${author.id}'`) === "t", "профиль создан одним нажатием");

  const text = `Разобрал булев поиск ${Date.now()}`;
  await a.page.getByLabel("Новый пост").fill(text);
  await a.page.getByRole("button", { name: "Опубликовать" }).tap();
  await a.page.getByText(text).waitFor({ timeout: 10_000 });
  check(true, "пост появился в ленте автора");

  const r = await session({ user: reader });
  await openSection(r.page, "/community");
  await r.page.getByText(text).waitFor({ timeout: 15_000 });
  check(true, "другой человек видит пост в ленте «Все»");

  const card = r.page.locator("article", { hasText: text });
  await card.getByRole("button", { name: "Нравится" }).tap();
  await card.getByRole("button", { name: "Убрать лайк" }).waitFor({ timeout: 10_000 });
  await card.getByRole("button", { name: /Комментарии/ }).tap();
  await card.getByLabel("Комментарий").fill("Спасибо, пригодилось");
  await card.getByRole("button", { name: "Отправить" }).tap();
  await card.getByText("Спасибо, пригодилось").waitFor({ timeout: 10_000 });
  check(sql(`select count(*) from "SocialLike" where "userId" = '${reader.id}'`) === "1", "лайк сохранён");
  check(sql(`select count(*) from "SocialPost" where "userId" = '${reader.id}' and "parentId" is not null`) === "1", "комментарий сохранён");

  // Профиль автора из ленты → подписка.
  await card.getByRole("button", { name: author.name, exact: true }).tap();
  await r.page.getByRole("button", { name: "Подписаться" }).last().tap();
  await r.page.getByRole("button", { name: "Вы подписаны" }).last().waitFor({ timeout: 10_000 });
  check(sql(`select count(*) from "Follow" where "followerId" = '${reader.id}' and "followingId" = '${author.id}'`) === "1", "подписка сохранена");

  // У автора выросли счётчики.
  await a.page.reload({ waitUntil: "networkidle" });
  await tabs(a.page).getByRole("button", { name: "Профиль" }).tap();
  const mine = (await a.page.locator("section", { hasText: "подписчиков" }).first().innerText()).replace(/\s+/g, " ");
  check(/1 постов/.test(mine) && /1 подписчиков/.test(mine), `в профиле автора один пост и один подписчик (увидел: ${mine.slice(0, 90)})`);

  await a.browser.close();
  await r.browser.close();
});

test("Сообщество: без профиля ленту читать можно, а лайкнуть нельзя; заблокированного не видно", async () => {
  const author = await newUser();
  const blockedAuthor = await newUser();
  const guest = await newUser();
  publish(author);
  publish(blockedAuthor);
  seedPost(author, "Пост от автора с профилем");
  seedPost(blockedAuthor, "Пост заблокированного человека");
  sql(`insert into "CommunityProfile"("userId", blocked, "updatedAt") values ('${guest.id}', array['${blockedAuthor.id}'], now() at time zone 'utc')`);

  const { browser, page } = await session({ user: guest });
  await openSection(page, "/community");
  await page.getByText("Пост от автора с профилем").waitFor({ timeout: 15_000 });
  check(true, "человек без профиля видит ленту");
  check(!(await page.locator("body").innerText()).includes("Пост заблокированного человека"), "поста заблокированного в ленте нет");

  await page.locator("article", { hasText: "Пост от автора с профилем" }).getByRole("button", { name: "Нравится" }).tap();
  await page.getByText(/создай профиль/i).first().waitFor({ timeout: 10_000 });
  check(sql(`select count(*) from "SocialLike" where "userId" = '${guest.id}'`) === "0", "лайк без профиля не засчитан — человека просят создать профиль");

  // В поиске людей гостя без профиля нет, а автор — есть.
  await tabs(page).getByRole("button", { name: "Люди" }).tap();
  await page.getByLabel("Поиск людей по имени").fill(author.name);
  await page.getByRole("button", { name: `Профиль: ${author.name}` }).first().waitFor({ timeout: 10_000 });
  check(true, "человек с профилем находится по имени");
  await browser.close();
});

test("Команды: открытую команду видно в поиске и в неё можно вступить без приглашения, закрытую — нет", async () => {
  const owner = await newUser();
  const student = await newUser();
  for (const [id, name, open] of [["e2e-open-" + owner.id.slice(0, 8), "Готовимся к Networks", true], ["e2e-closed-" + owner.id.slice(0, 8), "Тайный кружок", false]]) {
    sql(`insert into "StudyTeam"(id, "ownerId", name, subject, invite, open, about, "createdAt") values ('${id}', '${owner.id}', '${name}', 'Computer Networks', '${id}-invite', ${open}, 'Разбираем лабораторные', now() at time zone 'utc')`);
    sql(`insert into "StudyMember"("teamId", "userId", "joinedAt") values ('${id}', '${owner.id}', now() at time zone 'utc')`);
  }

  const { browser, page } = await session({ user: student });
  await openSection(page, "/community");
  await tabs(page).getByRole("button", { name: "Команды" }).tap();
  await page.getByText("Готовимся к Networks").waitFor({ timeout: 15_000 });
  check(!(await page.locator("body").innerText()).includes("Тайный кружок"), "закрытой команды в поиске нет");

  await page.getByRole("button", { name: "Вступить", exact: true }).first().tap();
  await page.getByText(/Открытая команда · 2 участников/).waitFor({ timeout: 15_000 });
  check(sql(`select count(*) from "StudyMember" where "userId" = '${student.id}'`) === "1", "вступление без приглашения сработало и открыло команду");

  // Закрытая команда не пускает и напрямую через API.
  const denied = await page.request.post("/api/community", { data: { action: "joinOpen", teamId: "e2e-closed-" + owner.id.slice(0, 8) } });
  check(denied.status() === 403, "в закрытую команду без приглашения не попасть даже запросом напрямую");
  await browser.close();
});

test("Согласие: одно нажатие принимает политику, ИИ и учёт активности — челлендж больше не спрашивает", async () => {
  const user = await newUser();
  const { browser, page } = await session({ user });
  await openSection(page, "/challenge30");
  check((await page.getByText(/Разрешаю отправить цели/).count()) === 1, "до общего согласия челлендж спрашивает разрешение сам");

  await openSection(page, "/personalization");
  await page.getByRole("button", { name: "Принять всё и продолжить" }).tap();
  await page.getByText("Передача данных в ИИ: разрешена").waitFor({ timeout: 10_000 });
  const stored = JSON.parse(sql(`select data from "PersonalizationProfile" where "userId" = '${user.id}'`));
  check(stored.ai === true && stored.enabled === true && stored.receipts.at(-1).ai === true, "одно нажатие сохранило и политику, и ИИ, и учёт активности — с отметкой о согласии");
  check(!(await page.locator("body").innerText()).includes("Обновлена политика конфиденциальности"), "баннер о новой политике исчез");

  await openSection(page, "/challenge30");
  await page.getByText(/по твоему общему согласию на ИИ/).waitFor({ timeout: 10_000 });
  check((await page.getByText(/Разрешаю отправить цели/).count()) === 0, "в челлендже отдельной галочки больше нет");

  // Любую часть можно отключить отдельно.
  await openSection(page, "/personalization");
  await page.getByRole("button", { name: "Выключить", exact: true }).tap();
  await page.getByText("Передача данных в ИИ: выключена").waitFor({ timeout: 10_000 });
  const after = JSON.parse(sql(`select data from "PersonalizationProfile" where "userId" = '${user.id}'`));
  check(after.ai === false && after.enabled === true, "ИИ выключен отдельно, учёт активности остался");
  await browser.close();
});

test("Посещения: открытый раздел попадает в счётчик, а сам посетитель — только обезличенным хешем", async () => {
  const before = Number(sql(`select coalesce(sum(views), 0) from "SiteVisit" where path = '/learn'`));
  const user = await newUser();
  const { browser, context, page } = await session({ user });
  await openSection(page, "/learn");
  await page.waitForTimeout(1500);
  const after = Number(sql(`select coalesce(sum(views), 0) from "SiteVisit" where path = '/learn'`));
  check(after > before, "просмотр раздела «Учёба» посчитан");
  const visitor = sql(`select hash, authed from "SiteVisitor" order by day desc limit 1`);
  check(/^[\w-]{22}\|t$/.test(visitor), `посетитель записан хешем и отметкой «вошёл», без адреса и имени (увидел: ${visitor})`);
  const cookies = (await context.cookies()).map((c) => c.name).filter((n) => !/authjs|next-auth/.test(n));
  check(cookies.length === 0, `счётчик не ставит своих cookie (лишние: ${cookies.join(", ") || "нет"})`);
  await browser.close();
});
