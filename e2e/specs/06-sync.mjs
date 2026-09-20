/**
 * Синхронизация между устройствами.
 *
 * Самая тихая часть приложения: пока она работает, её не замечают, а когда
 * ломается — человек видит просто «мои задачи не появились на ноутбуке» и
 * не понимает почему. Поэтому здесь проверяется не интерфейс, а сам
 * договор: снимок доезжает до сервера, второе устройство его забирает, и
 * более старый снимок не затирает свежий.
 */

import { check, newUser, session, sql, test } from "../harness.mjs";

/** PUT /api/state прямо из страницы — с её куками сессии. */
function putState(page, data) {
  return page.evaluate(async (body) => {
    const res = await fetch("/api/state", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data: body }),
    });
    return res.json();
  }, data);
}

test("Синхронизация: снимок доезжает до сервера без сдвига времени", async () => {
  // Регрессия: время записи уходило в базу в зоне сервера базы, а читалось
  // как UTC. На базе не в UTC запись «уезжала в будущее», и следующая
  // правка отбивалась как устаревшая — синхронизация замолкала совсем.
  const user = await newUser();
  const { browser, page } = await session({ user });
  const t = Date.now();

  const first = await putState(page, { name: "первый", todos: [], plan: [], updatedAt: t });
  check(first.applied === true, "первый снимок принят");
  const stored = Math.round(
    Number(sql(`select extract(epoch from "clientAt")*1000 from "UserState" where "userId"='${user.id}'`)),
  );
  check(
    Math.abs(stored - t) < 1000,
    `время записи совпадает с отправленным (расхождение ${stored - t} мс)`,
  );

  const second = await putState(page, { name: "второй", todos: [], plan: [], updatedAt: t + 1000 });
  check(second.applied === true, "следующая правка тоже принимается");
  check(
    sql(`select data->>'name' from "UserState" where "userId"='${user.id}'`) === "второй",
    "на сервере лежит последняя правка",
  );
  await browser.close();
});

test("Синхронизация: старый снимок не затирает свежий", async () => {
  const user = await newUser();
  const { browser, page } = await session({ user });
  const t = Date.now();

  await putState(page, { name: "свежий", todos: [], plan: [], updatedAt: t });
  const stale = await putState(page, { name: "древний", todos: [], plan: [], updatedAt: t - 60_000 });
  check(stale.applied === false, "опоздавший снимок отклонён");
  check(
    sql(`select data->>'name' from "UserState" where "userId"='${user.id}'`) === "свежий",
    "данные на сервере остались свежими",
  );
  check(stale.data?.name === "свежий", "в ответ пришёл серверный снимок, чтобы клиент догнался");
  await browser.close();
});

test("Синхронизация: второе устройство забирает изменения первого", async () => {
  const user = await newUser();
  const first = await session({ user });
  const t = Date.now();
  await putState(first.page, {
    name: "Тест",
    todos: [
      {
        id: "sync-1",
        title: "Задача с телефона",
        date: new Date().toISOString().slice(0, 10),
        priority: "normal",
        subtasks: [],
        done: false,
        doneDays: [],
        createdAt: t,
        completedAt: null,
      },
    ],
    plan: [],
    updatedAt: t,
  });

  const second = await session({ user });
  const pulled = await second.page.evaluate(
    async (since) => (await fetch(`/api/state?since=${since}`)).json(),
    t - 5000,
  );
  check(
    pulled.data?.todos?.[0]?.title === "Задача с телефона",
    "второе устройство видит задачу, созданную на первом",
  );

  const nothingNew = await second.page.evaluate(
    async (since) => (await fetch(`/api/state?since=${since}`)).json(),
    t,
  );
  check(nothingNew.unchanged === true, "повторный запрос не тянет те же данные заново");
  await first.browser.close();
  await second.browser.close();
});
