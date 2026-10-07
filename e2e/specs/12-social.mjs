/**
 * Сообщество как соцсеть, единое согласие и счётчик посещений.
 *
 * Здесь важнее всего границы. Профиль в сообществе — это сам аккаунт:
 * отдельно создавать его не нужно, но участником человек становится, только
 * приняв действующую политику. Без неё ленту можно читать, а действовать
 * нельзя; скрывший себя пропадает из ленты и поиска вместе с фото; чужой
 * прогресс и посты не появляются там, где их не должно быть.
 */

import sharp from "sharp";
import { check, newUser, openSection, session, sql, test } from "../harness.mjs";

const tabs = (page) => page.getByRole("navigation", { name: "Разделы сообщества" });

/** Участник сообщества: newUser по умолчанию уже принял действующую политику. */
const member = () => newUser();
const seedPost = (user, text) => {
  const id = `e2e-post-${user.id.slice(0, 8)}-${Math.random().toString(36).slice(2, 8)}`;
  sql(`insert into "SocialPost"(id, "userId", text, "createdAt") values ('${id}', '${user.id}', '${text}', now() at time zone 'utc')`);
  return id;
};
/** Снимок «с телефона»: крупнее лимита сервера и с EXIF, чтобы проверить уменьшение и чистку метаданных. */
const photo = async (name, color) => ({
  name,
  mimeType: "image/jpeg",
  buffer: await sharp({ create: { width: 2400, height: 1800, channels: 3, background: color } }).withExif({ IFD0: { Make: "E2E-Camera", Model: "Secret-Phone" } }).jpeg().toBuffer(),
});

test("Сообщество: публикую пост с фото под своим аккаунтом — другой человек лайкает, комментирует и подписывается, я вижу это в активности", async () => {
  const author = await member();
  const reader = await member();

  const a = await session({ user: author });
  await openSection(a.page, "/community");
  await a.page.getByLabel("Новый пост").waitFor({ timeout: 15_000 });
  check((await a.page.getByText(/Создай профиль|Создать профиль/).count()) === 0, "отдельный профиль создавать не нужно — писать можно сразу");

  await a.page.getByLabel("Выбрать фото", { exact: true }).setInputFiles([await photo("one.jpg", "#7c3aed"), await photo("two.jpg", "#0ea5e9")]);
  await a.page.getByAltText("Прикреплённое фото").nth(1).waitFor({ timeout: 20_000 });
  const text = `Разобрал булев поиск ${Date.now()}`;
  await a.page.getByLabel("Новый пост").fill(text);
  await a.page.getByRole("button", { name: "Опубликовать" }).tap();
  const mine = a.page.locator("article", { hasText: text });
  await mine.waitFor({ timeout: 15_000 });
  const stored = sql(`select count(*), min(mime), max(width), max(height) from "SocialMedia" m join "SocialPost" p on p.id = m."postId" where p."userId" = '${author.id}'`);
  check(stored === "2|image/webp|1440|1080", `два фото сохранены уменьшенными и перекодированными (увидел: ${stored})`);
  const loaded = await mine.getByAltText("Фото 1 из 2").evaluate((img) => img.decode().then(() => img.naturalWidth));
  check(loaded > 0, "фото в ленте действительно загрузилось");
  const bytes = await (await a.page.request.get(await mine.getByAltText("Фото 1 из 2").getAttribute("src"))).body();
  check(!bytes.includes("Secret-Phone"), "метаданные снимка (модель телефона) в сохранённом фото не остались");
  // Сервер чистит метаданные сам, а не полагается на браузер: шлём исходный файл напрямую.
  const raw = await photo("raw.jpg", "#22c55e");
  check(raw.buffer.includes("Secret-Phone"), "в исходном снимке метаданные есть");
  const direct = await (await a.page.request.post("/api/media?kind=post", { data: raw.buffer, headers: { "Content-Type": "image/jpeg" } })).json();
  check(!(await (await a.page.request.get(direct.src)).body()).includes("Secret-Phone"), "после сервера метаданных в файле нет, даже если браузер их не убрал");
  check((await a.page.request.post("/api/media?kind=post", { data: Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10"><rect width="10" height="10"/></svg>'), headers: { "Content-Type": "image/svg+xml" } })).status() === 400, "не-фото сервер не принимает");

  const r = await session({ user: reader });
  await openSection(r.page, "/community");
  const card = r.page.locator("article", { hasText: text });
  await card.waitFor({ timeout: 15_000 });
  check(true, "другой человек видит пост в ленте «Все»");

  await card.getByRole("button", { name: "Нравится" }).tap();
  await card.getByRole("button", { name: "Убрать лайк" }).waitFor({ timeout: 10_000 });
  await card.getByLabel("Комментарий", { exact: true }).fill("Спасибо, пригодилось");
  await card.getByRole("button", { name: "Отправить", exact: true }).tap();
  await card.getByText("Спасибо, пригодилось").waitFor({ timeout: 10_000 });
  check(sql(`select count(*) from "SocialLike" where "userId" = '${reader.id}'`) === "1", "лайк сохранён");
  check(sql(`select count(*) from "SocialPost" where "userId" = '${reader.id}' and "parentId" is not null`) === "1", "комментарий сохранён");

  // Профиль автора из ленты → подписка.
  await card.getByRole("button", { name: author.name, exact: true }).first().tap();
  await r.page.getByRole("button", { name: "Подписаться" }).last().tap();
  await r.page.getByRole("button", { name: "Вы подписаны" }).last().waitFor({ timeout: 10_000 });
  check(sql(`select count(*) from "Follow" where "followerId" = '${reader.id}' and "followingId" = '${author.id}'`) === "1", "подписка сохранена");

  // У автора — отметка о новом, три события в «Активности» и счётчики в профиле.
  await a.page.reload({ waitUntil: "networkidle" });
  await tabs(a.page).getByRole("button", { name: /Активность.*есть новое/ }).tap();
  const activity = a.page.locator("section", { hasText: reader.name }).first();
  await activity.waitFor({ timeout: 10_000 });
  const seen = (await activity.innerText()).replace(/\s+/g, " ");
  check(/подписался/.test(seen) && /оценил/.test(seen) && /Спасибо, пригодилось/.test(seen), `в активности — подписка, лайк и комментарий (увидел: ${seen.slice(0, 160)})`);

  await tabs(a.page).getByRole("button", { name: "Профиль" }).tap();
  const head = (await a.page.locator("header", { hasText: "подписчики" }).first().innerText()).replace(/\s+/g, " ");
  check(/1 посты/.test(head) && /1 подписчики/.test(head), `в профиле автора один пост и один подписчик (увидел: ${head.slice(0, 90)})`);
  check((await a.page.getByRole("button", { name: `Открыть пост: ${author.name}` }).count()) === 1, "пост виден в сетке профиля");

  // Своё фото профиля вместо персонажа.
  await a.page.getByLabel("Выбрать фото профиля").setInputFiles(await photo("me.jpg", "#f97316"));
  await a.page.getByRole("button", { name: "Вернуть персонажа" }).waitFor({ timeout: 20_000 });
  const avatar = sql(`select m.kind, m.width, m.height from "CommunityProfile" c join "SocialMedia" m on m.id = c."avatarId" where c."userId" = '${author.id}'`);
  check(avatar === "avatar|512|512", `фото профиля сохранено квадратом 512×512 (увидел: ${avatar})`);

  await a.browser.close();
  await r.browser.close();
});

test("Сообщество: без принятой политики ленту читать можно, а лайкнуть нельзя; заблокированного и скрытого не видно", async () => {
  const author = await member();
  const blockedAuthor = await member();
  const hiddenAuthor = await member();
  const guest = await newUser({ policy: false });
  seedPost(author, "Пост от участника сообщества");
  seedPost(blockedAuthor, "Пост заблокированного человека");
  seedPost(hiddenAuthor, "Пост скрытого человека");
  sql(`insert into "CommunityProfile"("userId", hidden, "updatedAt") values ('${hiddenAuthor.id}', true, now() at time zone 'utc')`);
  sql(`insert into "CommunityProfile"("userId", blocked, "updatedAt") values ('${guest.id}', array['${blockedAuthor.id}'], now() at time zone 'utc')`);

  const { browser, page } = await session({ user: guest });
  await openSection(page, "/community");
  await page.getByText("Пост от участника сообщества").waitFor({ timeout: 15_000 });
  check(true, "не принявший политику видит ленту");
  const body = await page.locator("body").innerText();
  check(!body.includes("Пост заблокированного человека"), "поста заблокированного в ленте нет");
  check(!body.includes("Пост скрытого человека"), "поста скрывшего себя человека в ленте нет");
  check((await page.getByLabel("Новый пост").count()) === 0 && body.includes("Осталось одно нажатие"), "вместо формы поста — одна кнопка «Принять политику»");

  await page.locator("article", { hasText: "Пост от участника сообщества" }).getByRole("button", { name: "Нравится" }).tap();
  await page.getByRole("alert").filter({ hasText: /прими политику/ }).waitFor({ timeout: 10_000 });
  const denied = await page.request.post("/api/community", { data: { action: "follow", userId: author.id } });
  check(denied.status() === 403 && sql(`select count(*) from "SocialLike" where "userId" = '${guest.id}'`) === "0", "лайк и подписка без принятой политики не засчитаны");

  // В поиске — только участники: автор находится, скрытого нет, профиль скрытого закрыт и напрямую.
  await tabs(page).getByRole("button", { name: "Поиск" }).tap();
  await page.getByLabel("Поиск людей по имени").fill(author.name);
  await page.getByRole("button", { name: `Профиль: ${author.name}` }).first().waitFor({ timeout: 10_000 });
  const found = await (await page.request.get("/api/community?people=" + encodeURIComponent("Тест"))).json();
  const ids = found.people.map((p) => p.userId);
  check(ids.includes(author.id) && !ids.includes(hiddenAuthor.id) && !ids.includes(blockedAuthor.id), "в поиске есть участник и нет скрытого и заблокированного");
  check((await page.request.get("/api/community?profile=" + hiddenAuthor.id)).status() === 404, "профиль скрытого человека не открывается и по прямой ссылке");

  // Сам гость никому не виден, пока не принял политику.
  const other = await session({ user: author });
  check((await other.page.request.get("/api/community?profile=" + guest.id)).status() === 404, "не принявший политику никому в сообществе не показывается");
  await other.browser.close();
  await browser.close();
});

test("Сообщество: принял политику одной кнопкой — можно публиковать; «Скрыть меня» убирает из ленты", async () => {
  const user = await newUser({ policy: false });
  const viewer = await member();
  const { browser, page } = await session({ user });
  await openSection(page, "/community");
  await page.getByRole("link", { name: "Принять политику" }).tap();
  await page.getByRole("button", { name: "Принять всё и продолжить" }).tap();
  await page.getByText("Передача данных в ИИ: разрешена").waitFor({ timeout: 10_000 });

  await openSection(page, "/community");
  await page.getByLabel("Новый пост").waitFor({ timeout: 15_000 });
  const text = `Первый пост ${Date.now()}`;
  await page.getByLabel("Новый пост").fill(text);
  await page.getByRole("button", { name: "Опубликовать" }).tap();
  await page.locator("article", { hasText: text }).waitFor({ timeout: 10_000 });

  const v = await session({ user: viewer });
  const visible = async () => (await (await v.page.request.get("/api/community?feed=all")).json()).posts.some((p) => p.text === text);
  check(await visible(), "после принятия политики пост виден другим");

  await tabs(page).getByRole("button", { name: "Профиль" }).tap();
  await page.getByRole("button", { name: "Скрыть меня из сообщества" }).tap();
  await page.getByRole("button", { name: "Показать меня в сообществе" }).waitFor({ timeout: 10_000 });
  check(!(await visible()), "скрыл себя — пост пропал из чужой ленты");
  check((await v.page.request.get("/api/community?profile=" + user.id)).status() === 404, "и профиль закрылся");
  const post = await page.request.post("/api/community", { data: { action: "socialPost", text: "Пока скрыт" } });
  check(post.status() === 403, "скрытый может только читать — пост не принимается");

  await page.getByRole("button", { name: "Показать меня в сообществе" }).tap();
  await page.getByRole("button", { name: "Скрыть меня из сообщества" }).waitFor({ timeout: 10_000 });
  check(await visible(), "вернул видимость — пост снова в ленте, ничего не удалилось");
  await v.browser.close();
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
  const user = await newUser({ policy: false });
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
