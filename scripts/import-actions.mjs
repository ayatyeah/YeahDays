/**
 * Заполнить колоду своими действиями под расписание.
 *
 *   node scripts/import-actions.mjs <userId>            # показать, без записи
 *   node scripts/import-actions.mjs <userId> --apply    # записать
 *
 * Зачем. У аккаунта выключен встроенный набор (useOwnActionsOnly), и колода
 * собирается только из своих действий — а их ноль, главная пустая. Пул ниже
 * собран под реальную неделю: пары 11:00–19:50 по будням, расписанное утро
 * до 11:00, свободные окна — понедельник 12:50–16:00, четверг с 17:50,
 * вечера после 19:50, выходные с 11:00. И под приоритеты профиля: сила и
 * интеллект по 0.7 — отсюда крен в тренировки и Flutter.
 *
 * Действие ≠ задача. Расписание (пары, утро) уже лежит в todos и здесь НЕ
 * дублируется. Колода — то, из чего выбирают на свободное окно; движок
 * показывает 12 лучших под текущий момент и ротирует по времени суток,
 * целям и свежести. Пул больше двенадцати — это норма.
 *
 * Идемпотентно по id. createdAt проставляется как лишнее поле: по нему
 * серверная защита (src/lib/mergeServerTodos.ts) отличает «клиент не видел»
 * от «клиент удалил» и не даёт устаревшей вкладке стереть колоду.
 *
 * ВАЖНО: --apply только ПОСЛЕ того, как на Railway задеплоена защита
 * customActions в mergeServerTodos. До этого первый же push из открытой
 * вкладки сотрёт всё записанное — ровно так пропало расписание.
 */

import "dotenv/config";
import { PrismaClient } from "@prisma/client";

// difficulty/impact 1..5, energy low|medium|high, time morning|afternoon|evening|any
const A = (id, title, why, category, duration, { d = 2, i = 3, e = "medium", t = "any" } = {}) => ({
  id: `custom-${id}`, title, why, category, duration,
  difficulty: d, impact: i, energy: e, timePreference: t, custom: true,
});

const POOL = [
  // ── Flutter / Dart — единственный фокус по программированию на 2–3 месяца ──
  A("flutter-feature", "Flutter: закрыть одну фичу приложения",
    "Понедельник 12:50–16:00 и выходные — единственные окна на глубокую работу", "learning", 90, { d: 4, i: 5, e: "high", t: "afternoon" }),
  A("flutter-45", "Flutter: 45 минут над реальной задачей",
    "Вечером сил на большее нет, но 45 минут держат проект живым", "learning", 45, { d: 3, i: 4, e: "medium", t: "evening" }),
  A("flutter-2h", "Flutter: два часа над приложением",
    "Выходные — единственное место, где помещается длинный заход", "learning", 120, { d: 4, i: 5, e: "high", t: "any" }),
  A("flutter-bug", "Flutter: разобрать один баг из списка",
    "Маленький, закрытый, с видимым результатом", "learning", 30, { d: 2, i: 3, e: "medium", t: "any" }),

  // ── Учёба по пяти курсам — под пары, а не вместо них ──
  A("cv-lecture", "Computer Vision: разобрать последнюю лекцию",
    "Практика по CV во вторник и четверг — без разбора лекции она проходит впустую", "learning", 45, { d: 3, i: 4, e: "medium", t: "afternoon" }),
  A("networks-notes", "Computer Networks: конспект к практике",
    "Три практики подряд во вторник — идти на них без конспекта дорого", "learning", 40, { d: 3, i: 4, e: "medium", t: "evening" }),
  A("cloud-chapter", "Cloud Computing: прочитать главу",
    "Лекция в среду онлайн — легко прослушать мимо, чтение это страхует", "learning", 40, { d: 2, i: 3, e: "medium", t: "any" }),
  A("philosophy-text", "Философия: текст к семинару",
    "Практика в пятницу с утра — читать надо до, а не в пятничном вечере после восьми часов пар", "learning", 40, { d: 2, i: 3, e: "low", t: "evening" }),
  A("pm-prep", "Project Management: материал к практике",
    "Практика в среду на IEC — с переездом; готовиться заранее", "learning", 35, { d: 2, i: 3, e: "medium", t: "any" }),
  A("rmt-draft", "Research Methods: набросок раздела работы",
    "Пишется кусками, иначе перед сдачей будет одна ночь", "learning", 45, { d: 3, i: 4, e: "medium", t: "evening" }),
  A("review-next", "Повторить материал к ближайшей паре",
    "20 минут перед парой дают больше, чем час после", "learning", 20, { d: 1, i: 3, e: "low", t: "any" }),

  // ── Английский — сверх вторника и среды ──
  A("english-words", "Английский: 20 слов и повтор старых",
    "Два часа в неделю — мало; короткие добавки в любой день это лечат", "learning", 25, { d: 2, i: 3, e: "low", t: "any" }),
  A("english-listen", "Английский: 20 минут на слух",
    "Подкаст или видео без субтитров — то, чего не даёт учебник", "learning", 20, { d: 1, i: 2, e: "low", t: "evening" }),

  // ── Сила и тело — сверх утреннего турника ──
  A("core-15", "Планка и пресс 15 минут",
    "Утро — турник и бег, а корпус остаётся без нагрузки", "fitness", 15, { d: 2, i: 3, e: "medium", t: "evening" }),
  A("stretch-10", "Растяжка 10 минут",
    "После турника и бега без растяжки к среде забиты плечи и икры", "fitness", 10, { d: 1, i: 2, e: "low", t: "morning" }),
  A("walk-campus", "Прогулка 30 минут между парами",
    "Понедельник 17:50–19:00 — мёртвый час на кампусе, лучше ходить, чем сидеть", "fitness", 30, { d: 1, i: 2, e: "low", t: "afternoon" }),
  A("long-workout", "Длинная тренировка 60 минут",
    "В будни на неё нет окна — выходные", "fitness", 60, { d: 4, i: 4, e: "high", t: "any" }),
  A("extra-set", "Дополнительный подход на турнике",
    "Один подход сверх плана — дёшево, а сила растёт от объёма", "fitness", 10, { d: 2, i: 2, e: "medium", t: "any" }),

  // ── Здоровье — под подъём в 06:30 ──
  A("sleep-23", "Лечь до 23:00",
    "Подъём в 06:30 четыре дня из пяти после 19:50 — сон единственное, что это держит", "health", 5, { d: 2, i: 5, e: "low", t: "evening" }),
  A("no-screen", "Без экрана последние 30 минут",
    "Иначе «лечь до 23» превращается в «лечь в 00:30»", "health", 30, { d: 3, i: 4, e: "low", t: "evening" }),
  A("water", "Два литра воды за день",
    "Бег через день и восемь часов пар — обезвоживание бьёт по голове первым", "health", 5, { d: 1, i: 3, e: "low", t: "any" }),

  // ── Дисциплина — под переезды между кампусами ──
  A("pack-tomorrow", "Собрать рюкзак и одежду на завтра",
    "Korkem, Main и IEC — три кампуса, утром на сборы времени нет", "discipline", 10, { d: 1, i: 3, e: "low", t: "evening" }),
  A("plan-tomorrow", "Расписать завтрашний день по часам",
    "15 минут вечером экономят час утром", "discipline", 15, { d: 1, i: 4, e: "low", t: "evening" }),
  A("check-moodle", "Проверить Moodle: новые задания",
    "Дедлайны приедут сами через синк, но открытые задания в LMS видно только руками", "career", 10, { d: 1, i: 3, e: "low", t: "any" }),

  // ── Осознанность и остальное — понемногу ──
  A("day-review", "5 минут: что сделано за день",
    "Без этого неделя сливается в одно пятно", "mindfulness", 5, { d: 1, i: 3, e: "low", t: "evening" }),
  A("own-hour", "Час на что-то своё вне учёбы",
    "Иначе всё расписание — про чужие требования", "creativity", 60, { d: 2, i: 3, e: "medium", t: "any" }),
  A("groupmates", "Написать одногруппникам про задания",
    "Дешевле узнать заранее, чем выяснять на паре", "social", 10, { d: 1, i: 2, e: "low", t: "any" }),
  A("spending", "Разобрать расходы за неделю",
    "Раз в неделю, на выходных — чтобы не всплыло в конце месяца", "money", 15, { d: 1, i: 2, e: "low", t: "any" }),
];

const [userId, ...flags] = process.argv.slice(2);
const apply = flags.includes("--apply");
if (!userId) {
  console.error("Использование: node scripts/import-actions.mjs <userId> [--apply]");
  process.exit(1);
}

const prisma = new PrismaClient();
try {
  const row = await prisma.userState.findUnique({ where: { userId } });
  const data = row?.data ?? {};
  const existing = Array.isArray(data.customActions) ? data.customActions : [];
  const have = new Set(existing.map((a) => a.id));

  const now = Date.now();
  const fresh = POOL.filter((a) => !have.has(a.id)).map((a) => ({ ...a, createdAt: now }));

  console.log(`Своих действий сейчас: ${existing.length}`);
  console.log(`В пуле: ${POOL.length}, из них новых: ${fresh.length}`);
  console.log(`useOwnActionsOnly: ${data.useOwnActionsOnly}\n`);

  const byTime = { morning: [], afternoon: [], evening: [], any: [] };
  for (const a of fresh) byTime[a.timePreference].push(a);
  for (const [t, list] of Object.entries(byTime)) {
    if (!list.length) continue;
    console.log(`${t}:`);
    for (const a of list) console.log(`  ${String(a.duration).padStart(3)}м  ${a.category.padEnd(11)} ${a.title}`);
  }

  if (fresh.length === 0) {
    console.log("\nВсё уже на месте — писать нечего.");
  } else if (!apply) {
    console.log("\nЭто предпросмотр. Чтобы записать — добавь --apply.");
  } else {
    const next = { ...data, customActions: [...fresh, ...existing], updatedAt: now };
    // Тот же атомарный upsert с проверкой clientAt, что и в
    // src/lib/userState.ts — более свежая чужая запись не будет затёрта.
    const affected = await prisma.$executeRaw`
      INSERT INTO "UserState" ("userId", "data", "clientAt", "updatedAt")
      VALUES (${userId}, ${JSON.stringify(next)}::jsonb, ${new Date(now)}, now())
      ON CONFLICT ("userId") DO UPDATE
        SET "data" = EXCLUDED."data", "clientAt" = EXCLUDED."clientAt", "updatedAt" = now()
        WHERE "UserState"."clientAt" <= EXCLUDED."clientAt"
    `;
    console.log(
      affected > 0
        ? `\nЗаписано. Добавлено ${fresh.length}, всего своих действий ${next.customActions.length}.`
        : "\nОТКЛОНЕНО: на сервере состояние новее нашего. Закрой приложение и повтори.",
    );
  }
} finally {
  await prisma.$disconnect();
}
