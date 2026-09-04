/**
 * Разовый импорт расписания пар в задачи аккаунта.
 *
 *   node scripts/import-schedule.mjs <userId>            # показать, без записи
 *   node scripts/import-schedule.mjs <userId> --apply    # записать
 *
 * Пары заводятся повторяющимися задачами (repeat: weekly), по одной на
 * БЛОК подряд идущих пар одного предмета, а не на каждый слот: 11:00–11:50
 * и 12:00–12:50 — это один поход на пару, а восемь задач в дне читать
 * невозможно.
 *
 * Идемпотентно: задача считается уже существующей по паре
 * "день недели + заголовок", повторный прогон ничего не продублирует.
 *
 * ВАЖНО про открытые вкладки: /api/state PUT из браузера переписывает
 * UserState.data ЦЕЛИКОМ. Если во время импорта открыто приложение и оно
 * сохранится после нас со своим (не знающим про новые задачи) снимком —
 * пары пропадут. Запись идёт тем же атомарным upsert с проверкой clientAt,
 * что и остальные серверные пути, так что чужая СТАРАЯ запись нас не
 * затрёт, но новую лучше не создавать: закрой вкладки приложения перед
 * запуском и обнови страницу после.
 */

import "dotenv/config";
import { PrismaClient } from "@prisma/client";

/** Понедельник недели, с которой расписание начинает действовать. */
const START_DATE = "2026-09-01";

/**
 * Расписание, 7 триместр 2026-2027. Снято с экранов LMS (Class schedule).
 * from/to — границы СКЛЕЕННОГО блока: если предмет идёт двумя-тремя
 * слотами подряд с перерывом 5-15 минут, это одна запись.
 */
const SCHEDULE = [
  // Понедельник
  { wd: 1, from: "11:00", to: "12:50", subj: "Project Management", type: "лекция", place: "онлайн", teacher: "Ибадильдин Н.А.", code: "PM43-EN-L64" },
  { wd: 1, from: "16:00", to: "17:50", subj: "Research Methods and Tools", type: "лекция", place: "C1.1.252L (Main)", teacher: "Орынбек Ә.С.", code: "RMT53-EN-L129" },
  { wd: 1, from: "19:00", to: "19:50", subj: "Research Methods and Tools", type: "практика", place: "C1.1.366P (Main)", teacher: "Нургалиев К.С.", code: "RMT53-EN-P294" },
  // Вторник
  { wd: 2, from: "13:05", to: "13:55", subj: "Computer Vision", type: "практика", place: "302P (Korkem)", teacher: "Қайырхан Н.А.", code: "CV53-EN-P83" },
  { wd: 2, from: "16:00", to: "16:50", subj: "Cloud Computing", type: "практика", place: "C1.1.232K (Main)", teacher: "Бакиева А.М.", code: "CC53-EN-P333" },
  { wd: 2, from: "17:00", to: "17:50", subj: "Computer Networks", type: "практика", place: "C1.2.223K (Main)", teacher: "Vacancy 3 - SIS V.", code: "CN52-EN-P50" },
  { wd: 2, from: "18:00", to: "19:50", subj: "Computer Networks", type: "практика", place: "C1.1.234P (Main)", teacher: "Vacancy 3 - SIS V.", code: "CN52-EN-P50" },
  // Среда
  { wd: 3, from: "13:05", to: "14:50", subj: "Cloud Computing", type: "лекция", place: "онлайн", teacher: "Amazon L.", code: "CC53-EN-L59" },
  { wd: 3, from: "15:00", to: "16:50", subj: "Project Management", type: "практика", place: "IEC-305 (IEC)", teacher: "Бикситова А.Т.", code: "PM43-EN-P72" },
  { wd: 3, from: "18:00", to: "19:50", subj: "Computer Vision", type: "лекция", place: "C1.3.370L (Main)", teacher: "Баймуканова Ж.", code: "CV53-EN-L47" },
  // Четверг
  { wd: 4, from: "12:00", to: "14:50", subj: "Philosophy", type: "лекция", place: "онлайн", teacher: "Абдина А.К.", code: "PHIL51-EN-L82" },
  { wd: 4, from: "16:00", to: "17:50", subj: "Computer Vision", type: "практика", place: "305K (Korkem)", teacher: "Қайырхан Н.А.", code: "CV53-EN-P83" },
  // Пятница
  { wd: 5, from: "12:00", to: "13:55", subj: "Philosophy", type: "практика", place: "103P (Korkem)", teacher: "Джубатчанова И.Т.", code: "PHIL51-EN-P423" },
  { wd: 5, from: "14:00", to: "15:50", subj: "Computer Networks", type: "лекция", place: "301L (Korkem)", teacher: "Vacancy 3 - SIS V.", code: "CN52-EN-L33" },
  { wd: 5, from: "16:00", to: "17:50", subj: "Cloud Computing", type: "практика", place: "307K (Korkem)", teacher: "Бакиева А.М.", code: "CC53-EN-P333" },
  { wd: 5, from: "18:00", to: "19:50", subj: "Research Methods and Tools", type: "практика", place: "106P (Korkem)", teacher: "Нургалиев К.С.", code: "RMT53-EN-P294" },
];

const DAYS = ["", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница"];
const minutes = (t) => {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
};
const makeId = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
const titleOf = (c) => `${c.subj} — ${c.type}, ${c.place}`;

const [userId, ...flags] = process.argv.slice(2);
const apply = flags.includes("--apply");

if (!userId) {
  console.error("Использование: node scripts/import-schedule.mjs <userId> [--apply]");
  process.exit(1);
}

const prisma = new PrismaClient();

try {
  const row = await prisma.userState.findUnique({ where: { userId } });
  const data = row?.data ?? {};
  const todos = Array.isArray(data.todos) ? data.todos : [];

  const existing = new Set(
    todos
      .filter((t) => t.repeat?.kind === "weekly")
      .map((t) => `${t.repeat.weekday}|${String(t.title).trim().toLowerCase()}`),
  );

  const now = Date.now();
  const fresh = [];

  for (const c of SCHEDULE) {
    const title = titleOf(c);
    if (existing.has(`${c.wd}|${title.toLowerCase()}`)) continue;
    const [hour, minute] = c.from.split(":").map(Number);
    fresh.push({
      id: makeId(),
      title,
      note: `${c.teacher} · ${c.code} · ${c.from}–${c.to}`,
      date: START_DATE,
      hour,
      minute,
      duration: minutes(c.to) - minutes(c.from),
      priority: "normal",
      subtasks: [],
      repeat: { kind: "weekly", weekday: c.wd },
      done: false,
      doneDays: [],
      createdAt: now,
      completedAt: null,
    });
  }

  console.log(`Задач в аккаунте сейчас: ${todos.length}`);
  console.log(`Пар в расписании: ${SCHEDULE.length}, из них новых: ${fresh.length}\n`);

  let lastDay = 0;
  for (const t of fresh) {
    if (t.repeat.weekday !== lastDay) {
      lastDay = t.repeat.weekday;
      console.log(DAYS[lastDay] + ":");
    }
    const end = minutes(`${t.hour}:${t.minute}`) + t.duration;
    const endStr = `${String(Math.floor(end / 60)).padStart(2, "0")}:${String(end % 60).padStart(2, "0")}`;
    console.log(
      `  ${String(t.hour).padStart(2, "0")}:${String(t.minute).padStart(2, "0")}–${endStr}` +
        `  ${String(t.duration).padStart(3)}м  ${t.title}`,
    );
  }

  if (fresh.length === 0) {
    console.log("\nВсё уже на месте — писать нечего.");
  } else if (!apply) {
    console.log(`\nЭто предпросмотр. Чтобы записать — добавь --apply.`);
  } else {
    const next = { ...data, todos: [...fresh, ...todos], updatedAt: now };
    // Тот же атомарный upsert с проверкой clientAt, что и в
    // src/lib/userState.ts: чужая более свежая запись нас не пустит,
    // вместо того чтобы молча её затереть.
    const affected = await prisma.$executeRaw`
      INSERT INTO "UserState" ("userId", "data", "clientAt", "updatedAt")
      VALUES (${userId}, ${JSON.stringify(next)}::jsonb, ${new Date(now)}, now())
      ON CONFLICT ("userId") DO UPDATE
        SET "data" = EXCLUDED."data", "clientAt" = EXCLUDED."clientAt", "updatedAt" = now()
        WHERE "UserState"."clientAt" <= EXCLUDED."clientAt"
    `;
    console.log(
      affected > 0
        ? `\nЗаписано. Добавлено ${fresh.length}, всего задач стало ${next.todos.length}.`
        : "\nОТКЛОНЕНО: на сервере состояние новее нашего. Закрой вкладки приложения и повтори.",
    );
  }
} finally {
  await prisma.$disconnect();
}
