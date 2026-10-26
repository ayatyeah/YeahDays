/**
 * Ивенты раздела «Учёба» — общие для всех учебные программы: конспект
 * лекции по частям, квиз после каждой части, квиз по лекции и итоговый.
 *
 * Содержимое лежит в коде, а не в базе: его пишет автор, а не пользователь,
 * оно одинаково для всех, и так новый ивент — это обычный коммит без
 * миграций и без обращений к ИИ при открытии.
 */

export type Lang = "en" | "ru";
export type Text = Record<Lang, string>;

export interface Question {
  id: string;
  /** Вопрос и варианты — на языке самого экзамена, без перевода. */
  q: string;
  options: string[];
  /** Индекс верного варианта в `options` (до перемешивания). */
  answer: number;
  /** true — порядок вариантов не перемешивать (True / False). */
  fixed?: boolean;
  /** Почему ответ именно такой — показывается после выбора. */
  why: Text;
  /**
   * Почему не подходят остальные варианты — по одному на каждый неверный
   * вариант, в порядке `options` без верного. Есть у вопросов «разбора до
   * косточек»: там важно понять не только верный ответ, но и ловушки.
   */
  wrong?: Text[];
}

export interface Part {
  id: string;
  title: Text;
  /** Конспект в упрощённой разметке: «## », «- », «> », **жирный**. */
  notes: Text;
  questions: Question[];
  /**
   * «Разбор до косточек» — отдельный банк на 30–40 вопросов, покрывающий
   * часть целиком. Необязателен и в готовность не входит: это для тех, кому
   * легче учить, отвечая на вопросы, а не читая конспект.
   */
  deep?: Question[];
}

export interface Lecture {
  id: string;
  title: Text;
  /** Подпись в ленте «Твой маршрут» (2–3 слова); без неё берётся хвост названия после «—». */
  short?: Text;
  parts: Part[];
}

export interface StudyEvent {
  id: string;
  title: string;
  course: string;
  description: string;
  lectures: Lecture[];
  /** Сколько вопросов в квизе по части, по лекции и в итоговом. */
  counts: { part: number; lecture: number; final: number };
  /** Термины для карточек: термин на языке квиза, определение — на двух. */
  glossary?: Term[];
  /** Шпаргалка на одну страницу, в той же разметке, что и конспекты. */
  cheatSheet?: Text;
  /** Мини-игра по теме ивента (см. components/events/games). */
  game?: "networks";
  /**
   * Только по прямой ссылке: в списке ивентов не показывается. Для ивента
   * одной команды (подготовка к защите своего проекта) — другим он не нужен,
   * а имена и цифры проекта незачем показывать всем.
   */
  unlisted?: boolean;
  /** Что в карточках: термины (по умолчанию) или вопросы комиссии с ответами. */
  cards?: "terms" | "questions";
  /**
   * Пробные варианты экзамена с открытыми вопросами: ответ пишут в поле,
   * проверяет ИИ по критериям (api/study-events/grade). В готовность не идут.
   */
  mocks?: MockExam[];
  /** «case» — варианты в формате квиза-кейса (часть A тест, часть B открытые); иначе — мидтерм с открытыми вопросами. */
  mocksKind?: "case";
  /** Фаст-мод: всё главное коротко, чтобы подготовиться за часы (см. FastTrack). */
  fast?: FastTrack;
  /** Практикум к курсу: тренажёр расчётов, «Найди баг», песочница (см. components/events/VisionTrainer и др.). */
  practice?: "vision";
  /**
   * Настоящий тест с выбором ответа, к которому готовит ивент: тогда на карте
   * есть «Пробный тест» — столько же вопросов вперемешку со всех лекций, на
   * время, без подсказок по ходу, итог в баллах этого теста.
   */
  exam?: ExamFormat;
  /** Ролики-объяснения с персонажами и озвучкой (лента «Видео»). */
  videos?: ExplainerVideo[];
}

/**
 * Ролик-объяснение для ленты: диалог двух персонажей (маскот в костюмах ролей)
 * с озвучкой и картинкой на каждую реплику. Двое — потому что озвучка делается
 * одним запросом на ролик, а модель держит не больше двух голосов.
 */
export type CastRole = "mentor" | "student" | "scrum-master" | "product-owner" | "developer" | "sponsor" | "functional-manager" | "customer" | "tester" | "finance";

/** Позы персонажей — по картинке на каждую (public/cast/<роль>-<поза>.webp). */
export const CAST_POSES: Record<CastRole, readonly string[]> = {
  mentor: ["explain", "point", "think", "cheer"],
  student: ["ask", "confused", "aha", "write"],
  "scrum-master": ["talk", "react"],
  "product-owner": ["talk", "react"],
  developer: ["talk", "react"],
  sponsor: ["talk", "react"],
  "functional-manager": ["talk", "react"],
  customer: ["talk", "react"],
  tester: ["talk", "react"],
  finance: ["talk", "react"],
};

/** Что на экране во время реплики (остаётся до следующей картинки). */
export type VideoVisual =
  | { kind: "hook"; text: string }
  | { kind: "card"; term: string; meaning: string }
  | { kind: "formula"; lines: string[]; note?: string }
  | { kind: "diagram"; name: string }
  | { kind: "list"; title: string; items: string[]; mark?: number }
  | { kind: "compare"; left: { title: string; items: string[] }; right: { title: string; items: string[] } }
  | { kind: "example"; title: string; lines: string[] }
  | { kind: "trap"; wrong: string; right: string }
  | { kind: "quiz"; q: string; options: string[]; answer: number };

export interface VideoLine {
  /** Кто говорит: A или B из cast ролика. */
  who: "A" | "B";
  pose: string;
  /** Реплика: по-русски, термины и формулы — по-английски латиницей. */
  text: string;
  show?: VideoVisual;
}

export interface ExplainerVideo {
  /** «pm-l4-p2-v1». */
  id: string;
  /** Часть лекции, к которой ролик: «pm-l4-p2». */
  partId: string;
  title: Text;
  cast: { A: CastRole; B: CastRole };
  lines: VideoLine[];
  /** Озвучка (scripts/video-tts.mjs): файл, длительность и начало каждой реплики, с. */
  audio?: { src: string; duration: number; starts: number[] };
}

export interface ExamFormat {
  /** «MCQ Test 2». */
  name: string;
  questions: number;
  minutes: number;
  /** Сколько баллов курса даёт тест целиком. */
  points: number;
}

/**
 * Подпункт задания пробного экзамена («a) [6 pts] …»).
 *
 * Критерии и эталон живут только здесь, в коде: сервер берёт их по id, а не
 * из запроса, — человек не может подсунуть ИИ свои «критерии».
 */
export interface ExamTask {
  /** Уникален в ивенте: «v3-q2-b». */
  id: string;
  /** Буква подпункта: «a», «b»… */
  label: string;
  points: number;
  /** Формулировка на языке экзамена, в разметке конспекта (код — строками «= »). */
  prompt: string;
  /** За что дают баллы: по пункту на строку, с баллами («2 pts — …»); сумма = points. */
  rubric: string[];
  /** Эталонный ответ: en — как написал бы сильный студент, ru — разбор по-русски. */
  answer: Text;
  /**
   * Тестовый подпункт (часть A квиза с выбором ответа): варианты и индекс
   * верного. Проверяется сразу на устройстве, без ИИ; rubric может быть
   * пустым, а в answer — объяснение, почему верен именно этот вариант.
   */
  options?: string[];
  correct?: number;
}

export interface ExamQuestion {
  /** «v3-q2». */
  id: string;
  /** «Question 2 — Image Classification». */
  title: string;
  /** Открытый вопрос (объясни, предложи, спорь) или задача с расчётом/кодом. */
  kind?: "question" | "task";
  points: number;
  /** Условие перед подпунктами (сценарий, таблица, код) в разметке конспекта; может быть пустым. */
  context: string;
  tasks: ExamTask[];
}

export interface MockExam {
  /** «v3». */
  id: string;
  title: Text;
  minutes: number;
  /** Сколько баллов во всём варианте; по умолчанию 100 (у квизов бывает 10). */
  total?: number;
  /** Откуда вариант: «Sample from the instructor», «Based on a real variant», «New». */
  source: Text;
  questions: ExamQuestion[];
}

/**
 * Фаст-мод: подготовка за несколько часов. Только то, что спрашивают:
 * короткие блоки «знать наизусть», ловушки и шаблоны ответов, у каждого
 * блока — сколько минут на него нужно. Разметка — как у конспектов.
 */
export interface FastTrack {
  /** Сколько часов на всё, если идти подряд. */
  hours: number;
  /** Одна-две фразы: как пользоваться и что делать после. */
  intro: Text;
  sections: { id: string; title: Text; minutes: number; notes: Text }[];
}

export interface Term {
  term: string;
  def: Text;
}

export type Draft = Omit<Question, "id">;

/**
 * Вопрос с выбором. Верный вариант пишется первым — так в содержимом нельзя
 * ошибиться индексом; на экране варианты всегда перемешиваются.
 */
export function q(question: string, correct: string, wrong: string[], en: string, ru: string): Draft {
  return { q: question, options: [correct, ...wrong], answer: 0, why: { en, ru } };
}

/** Утверждение «верно / неверно»; порядок True, False привычный и не меняется. */
export function tf(statement: string, truth: boolean, en: string, ru: string): Draft {
  return { q: statement, options: ["True", "False"], answer: truth ? 0 : 1, fixed: true, why: { en, ru } };
}

export function part(id: string, title: Text, notes: Text, drafts: Draft[], deep?: Draft[]): Part {
  return {
    id, title, notes,
    questions: drafts.map((d, i) => ({ ...d, id: `${id}-${i + 1}` })),
    ...(deep ? { deep: deep.map((d, i) => ({ ...d, id: `${id}-deep-${i + 1}` })) } : {}),
  };
}

/** Неверный вариант с объяснением, почему он не подходит. */
export type Trap = [option: string, en: string, ru: string];

/**
 * Вопрос с разбором каждого варианта: верный — первым, затем ловушки с
 * объяснениями. Для банков «до косточек».
 */
export function qx(question: string, correct: string, traps: Trap[], en: string, ru: string): Draft {
  return {
    q: question,
    options: [correct, ...traps.map((t) => t[0])],
    answer: 0,
    why: { en, ru },
    wrong: traps.map((t) => ({ en: t[1], ru: t[2] })),
  };
}

/** «Верно / неверно» с объяснением, почему противоположный ответ — ошибка. */
export function tfx(statement: string, truth: boolean, en: string, ru: string, otherEn: string, otherRu: string): Draft {
  return { q: statement, options: ["True", "False"], answer: truth ? 0 : 1, fixed: true, why: { en, ru }, wrong: [{ en: otherEn, ru: otherRu }] };
}
