/** Protocol 2: independent offline edits, deletion, server revisions. */
import { BASE, check, newUser, session, test } from "../harness.mjs";
const task = id => ({ id, title: id, date: "2026-11-01", priority: "normal", subtasks: [], done: false, doneDays: [], createdAt: 1, completedAt: null });
async function read(page) { return page.evaluate(async () => (await fetch('/api/state')).json()); }
async function put(page, base, data) {
 return page.evaluate(async ({ base, data }) => {
   const response = await fetch('/api/state', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ protocol: 2, data: { customActions: [], quests: [], challenges: [], plan: [], ...data }, base: base.data, baseRevision: base.revision }) });
   if (!response.ok) throw new Error(`state ${response.status}`);
   return response.json();
 }, { base, data });
}
test("Синхронизация: два офлайн-снимка объединяются без потери задач", async () => {
 const user = await newUser({ state: { todos: [task('a'), task('b')] } });
 const first = await session({ user });
 // Use a second authenticated request context without mounting a competing UI poller.
 const second = await first.browser.newContext({ storageState: await first.context.storageState(), baseURL: BASE });
 const page = await second.newPage(); await page.goto('/privacy');
 try {
   const base = await read(first.page);
   const a = { ...base.data, updatedAt: 9999999999999, todos: [{ ...task('a'), done: true }, task('b'), task('phone')] };
   const b = { ...base.data, updatedAt: 0, todos: [task('a'), { ...task('b'), title: 'Edited on laptop' }, task('laptop')] };
   await put(first.page, base, a); const result = await put(page, base, b);
   check(result.data.todos.length === 4, 'новые задачи обоих устройств сохранены');
   check(result.data.todos.find(t => t.id === 'a').done, 'выполнение с телефона сохранено');
   check(result.data.todos.find(t => t.id === 'b').title === 'Edited on laptop', 'правка ноутбука сохранена');
   check(result.revision > base.revision, 'версия назначена сервером');
   const unchanged = await page.evaluate(async revision => (await fetch(`/api/state?revision=${revision}`)).json(), result.revision);
   check(unchanged.unchanged, 'опрос по серверной версии не передаёт снимок повторно');
   const deleted = await put(page, result, { ...result.data, todos: result.data.todos.filter(t => t.id !== 'a') });
   const stale = await put(page, result, { ...result.data, todos: result.data.todos.map(t => t.id === 'a' ? { ...t, title: 'Stale edit' } : t) });
   check(!stale.data.todos.some(t => t.id === 'a'), 'удалённая задача не воскресла');
   check(stale.revision > deleted.revision, 'конкурирующие записи сериализованы');
 } finally { await second.close(); await first.browser.close(); }
});
test("Синхронизация: старый протокол требует обновления приложения", async () => {
 const user = await newUser(); const { page, browser } = await session({ user });
 try {
   const status = await page.evaluate(async () => (await fetch('/api/state', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ data: { updatedAt: Date.now() } }) })).status);
   check(status === 409, 'старый клиент не перезаписывает прогресс');
 } finally { await browser.close(); }
});
