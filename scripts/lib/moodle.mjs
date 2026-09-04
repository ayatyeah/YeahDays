/**
 * Перевод событий календаря Moodle в задачи YeahGrind.
 *
 * Отделено от разбора формата (scripts/lib/ical.mjs) намеренно: RFC 5545 —
 * стандарт и меняться не будет, а вот как именно называть задачу и что
 * считать дедлайном — продуктовое решение, которое захочется покрутить.
 */

import { partsInZone } from "./ical.mjs";

/** Часовой пояс, в котором живут дедлайны. Moodle отдаёт время в UTC. */
export const DEFAULT_ZONE = "Asia/Almaty";

const pad = (n) => String(n).padStart(2, "0");

/**
 * Название курса из CATEGORIES. В AITU курс подписан как
 * "Computer Vision | Kaiyrkhan Nurym" — фамилия преподавателя в заголовке
 * задачи только занимает место, режем всё после вертикальной черты.
 */
export function courseName(categories) {
  const raw = categories?.[0] ?? "";
  return raw.split("|")[0].trim();
}

/**
 * Заголовок задачи. Курс впереди, потому что в списке дел на день
 * "Assignment 1 is due" без предмета не говорит ничего, а предмет —
 * первое, за что цепляется глаз.
 */
export function todoTitle(event) {
  const course = courseName(event.categories);
  const summary = (event.summary || "Без названия").trim();
  return course ? `${course}: ${summary}` : summary;
}

/**
 * Событие → тело для POST /api/integrations/add-todo.
 *
 * Возвращает null для события без разобранного DTSTART — задача без даты
 * роутом всё равно не примется (date обязателен).
 *
 * ВАЖНО про зону: Moodle пишет DTSTART в UTC, а день задачи мы обязаны
 * взять по местному времени. Дедлайн 4 сентября 02:00 в Алматы — это
 * 3 сентября 21:00 UTC, и наивное чтение UTC-даты уронило бы задачу на
 * предыдущий день. Поэтому дата и час считаются строго из partsInZone().
 */
export function eventToTodo(event, { zone = DEFAULT_ZONE, priority = "high" } = {}) {
  if (!event.start) return null;

  const local = partsInZone(event.start.utcMs, zone);
  const date = `${local.year}-${pad(local.month)}-${pad(local.day)}`;

  const todo = { title: todoTitle(event), date, priority };

  // Событие на весь день времени не несёт — час не проставляем, иначе
  // задача без реального времени притворится назначенной на полночь.
  //
  // minute заполняем, хотя /api/integrations/add-todo его сейчас НЕ
  // принимает и молча отбросит (в самом типе Todo поле есть). Держим его
  // здесь, чтобы предпросмотр показывал настоящее время дедлайна — 23:59,
  // а не округлённые 23:00: врать в выводе хуже, чем терять минуты в БД.
  if (!event.start.allDay) {
    todo.hour = local.hour;
    todo.minute = local.minute;
  }

  // У дедлайна DTEND совпадает с DTSTART — длительности нет. Ненулевой
  // интервал (пара, экзамен) переводим в минуты.
  if (event.end && !event.start.allDay) {
    const minutes = Math.round((event.end.utcMs - event.start.utcMs) / 60000);
    if (minutes > 0) todo.duration = minutes;
  }

  return todo;
}

/**
 * Весь календарь → задачи, с отброшенными дублями по UID.
 *
 * Дедупликация здесь — не перестраховка: /api/integrations/add-todo
 * безусловно добавляет задачу в начало списка и ничего не сверяет, так
 * что повторный запуск импорта размножит каждый дедлайн.
 */
export function eventsToTodos(events, options = {}) {
  const seen = new Set();
  const todos = [];

  for (const event of events) {
    const todo = eventToTodo(event, options);
    if (!todo) continue;

    const key = event.uid || `${todo.title}@${todo.date}`;
    if (seen.has(key)) continue;
    seen.add(key);

    todos.push({ uid: key, todo });
  }

  return todos;
}
