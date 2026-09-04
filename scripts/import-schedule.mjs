/**
 * Разовый импорт недельного каркаса в задачи аккаунта: пары из LMS и
 * личная утренняя рутина.
 *
 *   node scripts/import-schedule.mjs <userId>            # показать, без записи
 *   node scripts/import-schedule.mjs <userId> --apply    # записать
 *
 * Пары заводятся повторяющимися задачами по дню недели, по одной на БЛОК
 * подряд идущих пар одного предмета, а не на слот: 11:00-11:50 и
 * 12:00-12:50 — это один поход на пару, а восемь задач в дне читать
 * невозможно. Расписание снято с экранов LMS Class schedule и вшито сюда:
 * машиночитаемого источника нет, в календарь Moodle пары не попадают
 * вовсе (оттуда приходят только дедлайны, см. /api/cron/lms-sync).
 *
 * Утро описано ДВУМЯ наборами через день: беговой и обычный. Якоря
 * подобраны так, что наборы дополняют друг друга без дыр и наложений —
 * 4 сентября обычное утро, 5-го беговое, дальше чередуется.
 *
 * Идемпотентно: задача считается существующей по паре "повтор + заголовок",
 * повторный прогон ничего не продублирует.
 *
 * ВАЖНО про открытые вкладки: /api/state PUT из браузера переписывает
 * UserState.data ЦЕЛИКОМ. Запись идёт тем же атомарным upsert с проверкой
 * clientAt, что и остальные серверные пути, так что чужая СТАРАЯ запись
 * нас не затрёт — но новую лучше не создавать: закрой приложение перед
 * запуском и обнови страницу после.
 */

import "dotenv/config";
import { PrismaClient } from "@prisma/client";

/** Понедельник недели, с которой действует расписание пар. */
const TERM_START = "2026-09-01";
/** Ближайший БЕГОВОЙ день — якорь чередования. */
const RUN_ANCHOR = "2026-09-05";
/** Ближайший ОБЫЧНЫЙ день — второй якорь, ровно в противофазе. */
const PLAIN_ANCHOR = "2026-09-04";

const weekly = (wd) => ({ anchor: TERM_START, repeat: { kind: "weekly", weekday: wd } });
const daily = () => ({ anchor: PLAIN_ANCHOR, repeat: { kind: "daily" } });
const runDay = () => ({ anchor: RUN_ANCHOR, repeat: { kind: "everyOther" } });
const plainDay = () => ({ anchor: PLAIN_ANCHOR, repeat: { kind: "everyOther" } });

/** Пары, 7 триместр 2026-2027. from/to — границы склеенного блока. */
const PAIRS = [
  { wd: 1, from: "11:00", to: "12:50", subj: "Project Management", type: "лекция", place: "онлайн", teacher: "Ибадильдин Н.А.", code: "PM43-EN-L64" },
  { wd: 1, from: "16:00", to: "17:50", subj: "Research Methods and Tools", type: "лекция", place: "C1.1.252L (Main)", teacher: "Орынбек Ә.С.", code: "RMT53-EN-L129" },
  { wd: 1, from: "19:00", to: "19:50", subj: "Research Methods and Tools", type: "практика", place: "C1.1.366P (Main)", teacher: "Нургалиев К.С.", code: "RMT53-EN-P294" },
  { wd: 2, from: "13:05", to: "13:55", subj: "Computer Vision", type: "практика", place: "302P (Korkem)", teacher: "Қайырхан Н.А.", code: "CV53-EN-P83" },
  { wd: 2, from: "16:00", to: "16:50", subj: "Cloud Computing", type: "практика", place: "C1.1.232K (Main)", teacher: "Бакиева А.М.", code: "CC53-EN-P333" },
  { wd: 2, from: "17:00", to: "17:50", subj: "Computer Networks", type: "практика", place: "C1.2.223K (Main)", teacher: "Vacancy 3 - SIS V.", code: "CN52-EN-P50" },
  { wd: 2, from: "18:00", to: "19:50", subj: "Computer Networks", type: "практика", place: "C1.1.234P (Main)", teacher: "Vacancy 3 - SIS V.", code: "CN52-EN-P50" },
  { wd: 3, from: "13:05", to: "14:50", subj: "Cloud Computing", type: "лекция", place: "онлайн", teacher: "Amazon L.", code: "CC53-EN-L59" },
  { wd: 3, from: "15:00", to: "16:50", subj: "Project Management", type: "практика", place: "IEC-305 (IEC)", teacher: "Бикситова А.Т.", code: "PM43-EN-P72" },
  { wd: 3, from: "18:00", to: "19:50", subj: "Computer Vision", type: "лекция", place: "C1.3.370L (Main)", teacher: "Баймуканова Ж.", code: "CV53-EN-L47" },
  { wd: 4, from: "12:00", to: "14:50", subj: "Philosophy", type: "лекция", place: "онлайн", teacher: "Абдина А.К.", code: "PHIL51-EN-L82" },
  { wd: 4, from: "16:00", to: "17:50", subj: "Computer Vision", type: "практика", place: "305K (Korkem)", teacher: "Қайырхан Н.А.", code: "CV53-EN-P83" },
  { wd: 5, from: "12:00", to: "13:55", subj: "Philosophy", type: "практика", place: "103P (Korkem)", teacher: "Джубатчанова И.Т.", code: "PHIL51-EN-P423" },
  { wd: 5, from: "14:00", to: "15:50", subj: "Computer Networks", type: "лекция", place: "301L (Korkem)", teacher: "Vacancy 3 - SIS V.", code: "CN52-EN-L33" },
  { wd: 5, from: "16:00", to: "17:50", subj: "Cloud Computing", type: "практика", place: "307K (Korkem)", teacher: "Бакиева А.М.", code: "CC53-EN-P333" },
  { wd: 5, from: "18:00", to: "19:50", subj: "Research Methods and Tools", type: "практика", place: "106P (Korkem)", teacher: "Нургалиев К.С.", code: "RMT53-EN-P294" },
];

/**
 * Утро и то, что до пар.
 *
 * Английский стоит только во вторник и среду: в эти дни первая пара в
 * 13:05 и час свободен. В понедельник пара в 11:00, в четверг и пятницу в
 * 12:00 — там это время занято.
 */
const ROUTINE = [
  // Беговое утро: дольше на улице, из-за чего Flutter ужимается до часа.
  { ...runDay(), from: "06:30", to: "08:00", title: "Турник, брусья, бег 5 км", note: "Беговой день" },
  { ...runDay(), from: "08:00", to: "09:00", title: "Душ и завтрак", note: "Беговой день" },
  { ...runDay(), from: "09:00", to: "10:00", title: "Flutter / Dart", note: "Беговой день — на разработку остаётся час" },

  // Обычное утро.
  { ...plainDay(), from: "06:30", to: "07:20", title: "Турник, отжимания, улица", note: "Обычный день" },
  { ...plainDay(), from: "07:20", to: "07:40", title: "Душ, привести себя в порядок", note: "Обычный день" },
  { ...plainDay(), from: "07:40", to: "08:10", title: "Завтрак", note: "Обычный день" },
  { ...plainDay(), from: "08:10", to: "10:00", title: "Flutter / Dart — задачи дня и разработка", note: "Обычный день — главный блок, 1 ч 50 м" },

  // Общее для обоих утр.
  { ...daily(), from: "10:00", to: "11:00", title: "Дом, рабочее место, медитация, дыхание" },

  // Английский — только когда первая пара в 13:05.
  { ...weekly(2), from: "11:00", to: "12:00", title: "Английский" },
  { ...weekly(3), from: "11:00", to: "12:00", title: "Английский" },
];

const DAY_LABEL = ["", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница"];
const minutes = (t) => {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
};
const hhmm = (total) =>
  `${String(Math.floor(total / 60)).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
const makeId = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

/** Ключ идемпотентности: чем задача повторяется + как называется. */
const keyOf = (repeat, title) =>
  `${repeat.kind}:${repeat.weekday ?? ""}|${String(title).trim().toLowerCase()}`;

/** Оба набора приводим к одной форме — дальше код не различает их. */
function allItems() {
  const fromPairs = PAIRS.map((c) => ({
    ...weekly(c.wd),
    from: c.from,
    to: c.to,
    title: `${c.subj} — ${c.type}, ${c.place}`,
    note: `${c.teacher} · ${c.code} · ${c.from}–${c.to}`,
  }));
  return [...fromPairs, ...ROUTINE];
}

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
    todos.filter((t) => t.repeat).map((t) => keyOf(t.repeat, t.title)),
  );

  const now = Date.now();
  const fresh = [];

  for (const item of allItems()) {
    if (existing.has(keyOf(item.repeat, item.title))) continue;
    const [hour, minute] = item.from.split(":").map(Number);
    fresh.push({
      id: makeId(),
      title: item.title,
      note: item.note,
      date: item.anchor,
      hour,
      minute,
      duration: minutes(item.to) - minutes(item.from),
      priority: "normal",
      subtasks: [],
      repeat: item.repeat,
      done: false,
      doneDays: [],
      createdAt: now,
      completedAt: null,
    });
  }

  console.log(`Задач в аккаунте сейчас: ${todos.length}`);
  console.log(`В наборе: ${allItems().length}, из них новых: ${fresh.length}\n`);

  for (const t of fresh) {
    const when =
      t.repeat.kind === "weekly"
        ? DAY_LABEL[t.repeat.weekday] || `дн. ${t.repeat.weekday}`
        : t.repeat.kind === "everyOther"
          ? `через день от ${t.date}`
          : t.repeat.kind;
    const start = t.hour * 60 + t.minute;
    console.log(
      `  ${hhmm(start)}–${hhmm(start + t.duration)}  ${String(t.duration).padStart(3)}м  ` +
        `${when.padEnd(24)}  ${t.title}`,
    );
  }

  if (fresh.length === 0) {
    console.log("\nВсё уже на месте — писать нечего.");
  } else if (!apply) {
    console.log("\nЭто предпросмотр. Чтобы записать — добавь --apply.");
  } else {
    const next = { ...data, todos: [...fresh, ...todos], updatedAt: now };
    // Тот же атомарный upsert с проверкой clientAt, что и в
    // src/lib/userState.ts: более свежая чужая запись не будет затёрта
    // молча — скрипт скажет, что его отклонили.
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
        : "\nОТКЛОНЕНО: на сервере состояние новее нашего. Закрой приложение и повтори.",
    );
  }
} finally {
  await prisma.$disconnect();
}
