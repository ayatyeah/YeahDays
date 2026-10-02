/**
 * Обезличенный счётчик посещений для владельца: сколько раз открывали
 * раздел и сколько разных посетителей было за день.
 *
 * Без cookie и без идентификатора человека. Посетитель дня — это хеш от
 * адреса и браузера с солью, которая меняется каждый день: из хеша нельзя
 * получить IP, и один и тот же человек сегодня и завтра — разные строки.
 * Сам адрес нигде не сохраняется. Это отвечает на вопрос «сколько людей
 * зашло и что смотрели», не отвечая на вопрос «кто именно».
 */

import { createHash } from "node:crypto";

/** Разделы, которые считаем. Всё остальное сводится к «other» — в таблицу нельзя записать произвольную строку. */
const SECTIONS = [
  "/", "/login", "/register", "/forgot-password", "/terms", "/privacy",
  "/app", "/today", "/calendar", "/progress", "/account", "/settings", "/manage",
  "/learn", "/events", "/challenge30", "/shop", "/chat", "/community", "/personalization",
];

/** «/events/research-methods-quiz-1» → «/events»: считаем разделы, а не отдельные страницы. */
export function sectionOf(pathname: string): string {
  const clean = "/" + (pathname.split("?")[0].split("/")[1] ?? "");
  if (pathname.startsWith("/invite/")) return "/invite";
  return SECTIONS.includes(clean) ? clean : "other";
}

export function visitorHash(day: string, ip: string, userAgent: string): string {
  const salt = process.env.AUTH_SECRET ?? "yeahgrind-dev-secret";
  return createHash("sha256").update(`${salt}|${day}|${ip}|${userAgent}`).digest("base64url").slice(0, 22);
}

type VisitRow = { day: string; path: string; views: number };
type VisitorRow = { day: string; authed: boolean };

const SECTION_NAMES: Record<string, string> = {
  "/": "Лендинг", "/login": "Вход", "/register": "Регистрация", "/forgot-password": "Восстановление пароля",
  "/terms": "Условия", "/privacy": "Политика", "/app": "Колода", "/today": "Сегодня", "/calendar": "Календарь",
  "/progress": "Прогресс", "/account": "Профиль", "/settings": "Настройки", "/manage": "Управление",
  "/learn": "Учёба", "/events": "Ивенты", "/challenge30": "Челлендж 30", "/shop": "Магазин", "/chat": "ИИ-помощник",
  "/community": "Сообщество", "/personalization": "Мой ритм", "/invite": "Приглашение", other: "Прочее",
};

/** Сводка посещений за `days` дней: по дням и по разделам. */
export function visitSummary(visits: VisitRow[], visitors: VisitorRow[], days: number, now = new Date()) {
  const dayKey = (back: number) => new Date(now.getTime() - back * 86_400_000).toISOString().slice(0, 10);
  const range = Array.from({ length: days }, (_, i) => dayKey(days - 1 - i));
  const daily = range.map((day) => {
    const mine = visitors.filter((v) => v.day === day);
    return { day, visitors: mine.length, signedIn: mine.filter((v) => v.authed).length, views: visits.filter((v) => v.day === day).reduce((n, v) => n + v.views, 0) };
  });
  const inRange = visits.filter((v) => v.day >= range[0]);
  const byPath = new Map<string, number>();
  for (const v of inRange) byPath.set(v.path, (byPath.get(v.path) ?? 0) + v.views);
  const sum = (list: typeof daily) => ({ visitors: list.reduce((n, d) => n + d.visitors, 0), views: list.reduce((n, d) => n + d.views, 0) });
  return {
    daily,
    today: daily[daily.length - 1],
    // «Посетителей за неделю» — сумма по дням: один человек в разные дни считается заново, это цена отказа от слежки.
    week: sum(daily.slice(-7)),
    month: sum(daily),
    sections: [...byPath.entries()].sort((a, b) => b[1] - a[1]).map(([path, views]) => ({ path, name: SECTION_NAMES[path] ?? path, views })),
  };
}
