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
