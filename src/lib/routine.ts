/**
 * Недельный маршрут — личное расписание, привязанное к дню недели и часам.
 *
 * Колода из общего пула отвечает на «что бы сделать вообще». Маршрут отвечает
 * на «что у меня по плану прямо сейчас»: во вторник в 8 утра это Next.js, а не
 * случайная карточка. Таблица пользователя (его недельный план) закодирована
 * здесь как набор блоков.
 *
 * Ключевая механика — аналоги. У каждого рабочего блока есть главная задача и
 * один-два более лёгких варианта: «лень на 5–7 задач — сделай одну» или
 * «нет сил на пробежку — 10 минут растяжки». Человек всё равно двигается,
 * даже когда выложиться не может. Аналоги показываются в колоде под главной.
 *
 * Якоря (Завтрак, Обед, Сон, Отдых) видны в расписании как контекст дня, но
 * в колоду не идут: у обеда не бывает «аналога».
 *
 * Модуль чистый — только данные и поиск по ним; про стор и React не знает.
 * getDay(): 0 — воскресенье … 6 — суббота.
 */

import type { Action, CategoryKey, Difficulty, EnergyLevel, Impact, TimePreference } from "./domain";

const MON = 1,
  TUE = 2,
  WED = 3,
  THU = 4,
  FRI = 5,
  SAT = 6,
  SUN = 0;

const WEEKDAYS = [MON, TUE, WED, THU, FRI];

/** Компактный конструктор действия маршрута. impact по умолчанию высокий: это твой план, а не случайная идея. */
function A(
  id: string,
  title: string,
  why: string,
  category: CategoryKey,
  difficulty: Difficulty,
  duration: number,
  energy: EnergyLevel,
  timePreference: TimePreference,
  impact: Impact = 4,
): Action {
  return { id, title, why, category, difficulty, duration, energy, timePreference, impact, custom: false };
}

/* ────────────────────────  Аналоги (общие наборы)  ──────────────────────── */
/* Один набор переиспользуется всеми блоками похожего типа — чтобы «полегче»
   было осмысленным, а не выдуманным под каждую клетку таблицы. */

const CARDIO = [
  A("rt-a-cardio1", "Лёгкая пробежка 2 км", "Медленно, просто чтобы выйти и не потерять ритм", "fitness", 2, 15, "low", "any", 3),
  A("rt-a-cardio2", "Быстрая ходьба 25 минут", "Ноги двигаются — уже победа над диваном", "health", 1, 25, "low", "any", 2),
];
const STRENGTH_A = [
  A("rt-a-str1", "Отжимания 3×15", "Пять минут, а тело уже поработало", "fitness", 2, 10, "medium", "any", 3),
  A("rt-a-str2", "Планка 3×1 мин + 20 приседаний", "Короткий круг, если на полную тренировку нет сил", "fitness", 2, 10, "medium", "any", 3),
];
const CODE_A = [
  A("rt-a-code1", "Одна задача вместо пяти", "Одна закрытая задача лучше нуля идеальных", "learning", 2, 20, "medium", "any", 3),
  A("rt-a-code2", "Разобрать одно чужое решение", "Читать код — тоже учёба, и это легче писать с нуля", "learning", 2, 15, "low", "any", 3),
];
const LANG_A = [
  A("rt-a-lang1", "10 минут аудирования", "Уши привыкают к языку без усилий воли", "learning", 1, 10, "low", "any", 2),
  A("rt-a-lang2", "20 слов во флеш-карточках", "Микродоза лексики, которую не жалко втиснуть куда угодно", "learning", 1, 10, "low", "any", 2),
];
const PROJECT_A = [
  A("rt-a-proj1", "30 минут по проекту", "Полчаса фокуса сдвигают проект заметнее, чем кажется", "career", 2, 30, "medium", "any", 3),
  A("rt-a-proj2", "Закрыть одну мелкую задачу", "Маленький коммит держит проект живым", "career", 2, 15, "low", "any", 3),
];
const CONTENT_A = [
  A("rt-a-content1", "Набросать 3 идеи для контента", "Идеи — топливо; три штуки найдутся всегда", "creativity", 1, 10, "low", "any", 2),
  A("rt-a-content2", "Записать один черновой рилс", "Снято криво, но снято — это уже материал", "creativity", 2, 15, "medium", "any", 3),
];
const REFLECT_A = [
  A("rt-a-reflect1", "3 итога за сегодня", "Короткая отметка, чтобы день не растворился", "mindfulness", 1, 5, "low", "any", 2),
  A("rt-a-reflect2", "5 минут: что получилось за неделю", "Даже беглый разбор возвращает контроль", "mindfulness", 1, 5, "low", "any", 2),
];
const WALK_A = [
  A("rt-a-walk1", "10 минут растяжки", "Разгрузить спину после часов за столом", "health", 1, 10, "low", "any", 2),
  A("rt-a-walk2", "15-минутная прогулка", "Смена картинки и немного воздуха", "health", 1, 15, "low", "any", 2),
];
const SOCIAL_A = [
  A("rt-a-social1", "Позвонить близкому 10 минут", "Связь не поддерживается сама собой", "social", 1, 10, "low", "any", 2),
  A("rt-a-social2", "Написать другу — спросить, как дела", "Одно сообщение, а человеку приятно", "social", 1, 5, "low", "any", 2),
];
const READING_A = [
  A("rt-a-read1", "Прочитать 5 страниц", "Пять страниц в день — это книги за год", "learning", 1, 10, "low", "any", 2),
  A("rt-a-read2", "10 минут аудиокниги", "Читать необязательно глазами", "learning", 1, 10, "low", "any", 2),
];

/* ────────────────────────  Блок маршрута  ──────────────────────── */

export interface RoutineBlock {
  id: string;
  /** дни недели (getDay): 0 — вс … 6 — сб */
  days: number[];
  /** час начала, включительно */
  start: number;
  /** час конца, НЕ включительно */
  end: number;
  /** текст для клетки расписания — дословно из таблицы пользователя */
  label: string;
  /** якорь дня (еда, сон, отдых): показываем в расписании, но не свайпаем */
  anchor?: boolean;
  /** главная задача блока — то, что по плану */
  main?: Action;
  /** более лёгкие варианты — «если лень» */
  analogs?: Action[];
}

/** Якорь — только подпись в расписании, без свайпа. */
function anchor(id: string, days: number[], start: number, end: number, label: string): RoutineBlock {
  return { id, days, start, end, label, anchor: true };
}

/** Рабочий блок — главная задача + аналоги. */
function work(
  id: string,
  days: number[],
  start: number,
  end: number,
  label: string,
  main: Action,
  analogs: Action[],
): RoutineBlock {
  return { id, days, start, end, label, main, analogs };
}

/* Главные задачи. Одна и та же задача переиспользуется в разные дни
   (одинаковый id — значит один и тот же трек истории и длительностей). */

const RUN_LONG = A("rt-run-long", "Бег 4–5 км", "Кардио, которое реально двигает выносливость", "fitness", 3, 30, "medium", "morning");
const RUN_TEMPO = A("rt-run-tempo", "Бег 3 км в темпе", "Короче, но быстрее — тренирует скорость", "fitness", 3, 25, "medium", "morning");
const PULLUPS = A("rt-pullups", "Турник + силовая", "Подтягивания и база — каркас тела", "fitness", 3, 30, "medium", "morning");
const STRENGTH = A("rt-strength", "Силовая", "Тяжёлая работа, от которой растёт сила", "fitness", 3, 35, "medium", "morning");
const WALK_STRETCH = A("rt-walk-stretch", "Прогулка + растяжка", "Мягкий день: восстановление вместо нагрузки", "health", 1, 25, "low", "morning", 3);
const SPORT_WALK = A("rt-sport-walk", "Спорт / прогулка", "Движение в выходной без плана и обязательств", "health", 2, 40, "low", "evening", 3);
const WALK = A("rt-walk", "Прогулка", "Просто выйти и пройтись — этого достаточно", "health", 1, 25, "low", "evening", 3);

const TS_TASKS = A("rt-ts-tasks", "TypeScript: 5–7 задач", "Практика бьёт пассивное чтение", "learning", 4, 60, "high", "morning");
const TS_THEORY = A("rt-ts-theory", "TypeScript: теория + 5 задач", "Теория закрепляется, только когда её тут же применяешь", "learning", 3, 45, "high", "morning");
const TS_DEBUG = A("rt-ts-debug", "TypeScript: разбор ошибок", "Свои ошибки — лучший учебник", "learning", 3, 45, "high", "morning");
const NEXT_PRACTICE = A("rt-next-practice", "Next.js: практика + UI", "Строишь интерфейс — понимаешь фреймворк", "learning", 3, 60, "high", "morning");
const REACT_PRACTICE = A("rt-react-practice", "React: практика", "Компоненты закрепляются руками, не глазами", "learning", 3, 60, "high", "afternoon");
const SQL = A("rt-sql", "PostgreSQL: SQL + БД", "База данных — фундамент любого бэкенда", "learning", 3, 60, "high", "morning");
const NEST = A("rt-nest", "Nest.js: backend", "Серверная архитектура на практике", "learning", 4, 60, "high", "morning");
const ARCH = A("rt-arch", "Архитектура + API", "Проектируешь систему, а не только пишешь код", "learning", 4, 60, "high", "afternoon");
const IELTS = A("rt-ielts", "IELTS: reading / listening", "Экзамен сдаётся регулярностью, а не рывком", "learning", 3, 45, "medium", "morning");
const ENGLISH = A("rt-english", "Английский", "Каждый день понемногу — и язык становится своим", "learning", 2, 40, "medium", "evening");
const READING = A("rt-reading", "Чтение", "Вечер книги вместо ленты новостей", "learning", 1, 30, "low", "evening", 3);

const PORTFOLIO = A("rt-portfolio", "Проекты / портфолио", "Портфолио — то, что говорит за тебя без резюме", "career", 3, 60, "medium", "morning");
const CLIENTS = A("rt-clients", "Клиентские сайты / CLICKI", "Реальные задачи и реальные деньги", "career", 3, 90, "high", "morning");
const NEXT_PROJ = A("rt-next-proj", "Next.js проект", "Свой продукт растёт из ежедневной работы над ним", "career", 4, 90, "high", "afternoon");
const BACKEND_PROJ = A("rt-backend-proj", "Backend проект", "Сервер — половина продукта", "career", 4, 90, "high", "afternoon");
const BRAND = A("rt-brand", "Личный бренд: YeahGrind / YeahDays", "Бренд копится по чуть-чуть и потом работает на тебя", "career", 3, 60, "medium", "afternoon");
const CLICKI = A("rt-clicki", "CLICKI / работа", "Основная работа — фундамент всего остального", "career", 3, 90, "medium", "evening");
const OWN_PROJ = A("rt-own-proj", "Свой проект", "Вечер на своё дело, а не только на чужое", "career", 4, 90, "high", "evening");

const UIUX = A("rt-uiux", "UI/UX + дизайн", "Продукт продаёт не код, а то, что видит человек", "creativity", 3, 60, "medium", "afternoon");
const CONTENT = A("rt-content", "Создание контента", "Контент — это охват, который не купишь", "creativity", 2, 45, "medium", "morning");
const TIKTOK = A("rt-tiktok", "Съёмка / монтаж TikTok", "Короткое видео — самый быстрый путь к аудитории", "creativity", 3, 60, "medium", "evening");
const CONTENT_EDIT = A("rt-content-edit", "Контент / монтаж", "Собрать снятое в готовое к публикации", "creativity", 3, 60, "medium", "evening");

const DAYPLAN = A("rt-dayplan", "План дня", "Пять минут утром экономят час метаний потом", "discipline", 1, 10, "low", "morning", 3);
const WEEK_REVIEW = A("rt-week-review", "Разбор недели", "Неделя без разбора повторяет свои же ошибки", "mindfulness", 2, 20, "low", "afternoon");
const FAMILY = A("rt-family", "Время с семьёй", "Близкие — то, ради чего всё остальное", "social", 1, 30, "low", "evening", 3);

/* ────────────────────────  Расписание недели  ──────────────────────── */
/* Дословно повторяет таблицу пользователя. Рабочие блоки несут аналоги. */

export const ROUTINE: RoutineBlock[] = [
  // 06–07 — утренний блок
  work("b-mon-6", [MON], 6, 7, "Бег 4–5 км", RUN_LONG, CARDIO),
  work("b-tue-6", [TUE], 6, 7, "Турник + силовая", PULLUPS, STRENGTH_A),
  work("b-wed-6", [WED], 6, 7, "TypeScript теория + 5 задач", TS_THEORY, CODE_A),
  work("b-thu-6", [THU], 6, 7, "Бег 3 км (темп)", RUN_TEMPO, CARDIO),
  work("b-fri-6", [FRI], 6, 7, "Силовая", STRENGTH, STRENGTH_A),
  work("b-sat-6", [SAT], 6, 7, "Проекты / портфолио", PORTFOLIO, PROJECT_A),
  work("b-sun-6", [SUN], 6, 7, "Прогулка + растяжка", WALK_STRETCH, WALK_A),

  // 07–08 — завтрак и утренние дела
  work("b-mon-7", [MON], 7, 8, "Завтрак + план дня", DAYPLAN, REFLECT_A),
  anchor("b-tue-7", [TUE], 7, 8, "Завтрак"),
  work("b-wed-7", [WED], 7, 8, "IELTS (reading / listening)", IELTS, LANG_A),
  anchor("b-thu-7", [THU], 7, 8, "Завтрак + восстановление"),
  anchor("b-fri-7", [FRI], 7, 8, "Завтрак"),
  work("b-sat-7", [SAT], 7, 8, "Создание контента", CONTENT, CONTENT_A),
  work("b-sun-7", [SUN], 7, 8, "IELTS", IELTS, LANG_A),

  // 08–12 — главный учебный блок
  work("b-mon-8", [MON], 8, 12, "TypeScript 5–7 задач", TS_TASKS, CODE_A),
  work("b-tue-8", [TUE], 8, 12, "Next.js практика + UI", NEXT_PRACTICE, CODE_A),
  work("b-wed-8", [WED], 8, 12, "TypeScript разбор ошибок", TS_DEBUG, CODE_A),
  work("b-thu-8", [THU], 8, 12, "PostgreSQL SQL + БД", SQL, CODE_A),
  work("b-fri-8", [FRI], 8, 12, "Nest.js backend", NEST, CODE_A),
  work("b-sat-8", [SAT], 8, 12, "Клиентские сайты / CLICKI", CLIENTS, PROJECT_A),
  work("b-sun-8", [SUN], 8, 12, "IELTS подготовка", IELTS, LANG_A),

  // 12–13 — обед
  anchor("b-lunch", [MON, TUE, WED, THU, FRI, SAT, SUN], 12, 13, "Обед"),

  // 13–17 — дневной блок
  work("b-mon-13", [MON], 13, 17, "Next.js проект", NEXT_PROJ, PROJECT_A),
  work("b-tue-13", [TUE], 13, 17, "UI/UX + дизайн", UIUX, CONTENT_A),
  work("b-wed-13", [WED], 13, 17, "React практика", REACT_PRACTICE, CODE_A),
  work("b-thu-13", [THU], 13, 17, "Backend проект", BACKEND_PROJ, PROJECT_A),
  work("b-fri-13", [FRI], 13, 17, "Архитектура + API", ARCH, CODE_A),
  work("b-sat-13", [SAT], 13, 17, "Личный бренд YeahGrind / YeahDays", BRAND, PROJECT_A),
  work("b-sun-13", [SUN], 13, 17, "Разбор недели + отдых", WEEK_REVIEW, REFLECT_A),

  // 17–18 — отдых / движение
  anchor("b-rest", WEEKDAYS, 17, 18, "Отдых"),
  work("b-sat-17", [SAT], 17, 18, "Спорт / прогулка", SPORT_WALK, WALK_A),
  work("b-sun-17", [SUN], 17, 18, "Прогулка", WALK, WALK_A),

  // 18–20 — вечерний рабочий блок
  work("b-mon-18", [MON], 18, 20, "CLICKI / работа", CLICKI, PROJECT_A),
  work("b-tue-18", [TUE], 18, 20, "CLICKI / работа", CLICKI, PROJECT_A),
  work("b-wed-18", [WED], 18, 20, "Свой проект", OWN_PROJ, PROJECT_A),
  work("b-thu-18", [THU], 18, 20, "CLICKI / работа", CLICKI, PROJECT_A),
  work("b-fri-18", [FRI], 18, 20, "Свой проект", OWN_PROJ, PROJECT_A),
  work("b-sat-18", [SAT], 18, 20, "Съёмка / монтаж TikTok", TIKTOK, CONTENT_A),
  work("b-sun-18", [SUN], 18, 20, "Семья", FAMILY, SOCIAL_A),

  // 20–22 — вечер
  work("b-mon-20", [MON], 20, 22, "Английский", ENGLISH, LANG_A),
  work("b-tue-20", [TUE], 20, 22, "Английский", ENGLISH, LANG_A),
  work("b-wed-20", [WED], 20, 22, "Английский", ENGLISH, LANG_A),
  work("b-thu-20", [THU], 20, 22, "Английский", ENGLISH, LANG_A),
  work("b-fri-20", [FRI], 20, 22, "Английский", ENGLISH, LANG_A),
  work("b-sat-20", [SAT], 20, 22, "Контент / монтаж", CONTENT_EDIT, CONTENT_A),
  work("b-sun-20", [SUN], 20, 22, "Чтение", READING, READING_A),

  // 22:30 — сон
  anchor("b-sleep", [MON, TUE, WED, THU, FRI, SAT, SUN], 22, 24, "Сон"),
];

/* ────────────────────────  Поиск по маршруту  ──────────────────────── */

/** Все блоки этого дня недели, по возрастанию времени (для расписания). */
export function routineForDay(weekday: number): RoutineBlock[] {
  return ROUTINE.filter((b) => b.days.includes(weekday)).sort((a, b) => a.start - b.start);
}

/** Подпись расписания для конкретного часа, либо null. */
export function routineLabelAt(weekday: number, hour: number): string | null {
  const b = ROUTINE.find((x) => x.days.includes(weekday) && hour >= x.start && hour < x.end);
  return b ? b.label : null;
}

/**
 * Текущий рабочий блок — то, что по плану прямо сейчас. Якоря и пустые
 * промежутки дают null (колоде нечего предлагать «по плану» — покажет пул).
 */
export function currentRoutineBlock(date = new Date()): RoutineBlock | null {
  const weekday = date.getDay();
  const hour = date.getHours();
  const b = ROUTINE.find(
    (x) => !x.anchor && x.main && x.days.includes(weekday) && hour >= x.start && hour < x.end,
  );
  return b ?? null;
}

/** Русское название дня недели (getDay). */
export const DAY_NAME: Record<number, string> = {
  0: "воскресенье",
  1: "понедельник",
  2: "вторник",
  3: "среда",
  4: "четверг",
  5: "пятница",
  6: "суббота",
};
