/**
 * Проверка всего, что пишет ИИ, до того как это увидит ученик.
 *
 * Карта навыков — граф без циклов (FR-08), юниты — одна цель, 2–5 минут,
 * ≤ 400 слов и цитата-источник из материала, если он был (FR-09). Вопрос
 * попадает в банк, только если проходит проверки схемы, ключа ответа и
 * дистракторов, а подсказки не выдают ответ (FR-25, FR-29). Сценарий видео —
 * 120–280 слов, каждое предложение ссылается на абзац юнита (FR-21).
 * Невалидное не чинится молча: бросаем PathValidationError, и вызов
 * повторяется или отдаёт понятную ошибку.
 */

export class PathValidationError extends Error {}

const str = (v: unknown, min: number, max: number): v is string => typeof v === "string" && v.trim().length >= min && v.length <= max;
const norm = (s: string) => s.toLocaleLowerCase().replace(/[«»"'`“”„]/g, "").replace(/\s+/g, " ").trim();
export const words = (s: string) => (s.match(/[\p{L}\p{N}][\p{L}\p{N}'’-]*/gu) ?? []).length;

export const LEVELS = ["easy", "medium", "hard"] as const;
export type Level = (typeof LEVELS)[number];

export interface McqItem {
  kind: "mcq";
  skill: string;
  stem: string;
  options: string[];
  answer: number;
  explanation: string;
  wrongWhy: string[];
  hints: string[];
  level: Level;
}

export interface OpenItem {
  kind: "open";
  skill: string;
  stem: string;
  rubric: string;
  hints: string[];
  level: Level;
}

export type BankItem = McqItem | OpenItem;

/** Вопрос с выбором: 4 разных варианта, ключ в диапазоне, объяснение для каждого неверного, подсказки без ответа. */
export function validateMcq(raw: unknown, skills: Set<string>): McqItem {
  const q = raw as Record<string, unknown>;
  if (!q || typeof q !== "object") throw new PathValidationError("вопрос не объект");
  if (!str(q.skill, 1, 40) || !skills.has(q.skill)) throw new PathValidationError("вопрос без навыка");
  if (!str(q.stem, 8, 500)) throw new PathValidationError("формулировка вопроса");
  const options = q.options;
  if (!Array.isArray(options) || options.length !== 4 || !options.every((o) => str(o, 1, 220))) throw new PathValidationError("нужно ровно 4 варианта");
  if (new Set(options.map((o) => norm(o as string))).size !== 4) throw new PathValidationError("варианты повторяются");
  if (options.some((o) => /^(все|ни один|all|none)( из)? (перечисленн|вышеперечисл|of the above)/i.test((o as string).trim()))) throw new PathValidationError("вариант «всё перечисленное»");
  if (!Number.isInteger(q.answer) || (q.answer as number) < 0 || (q.answer as number) > 3) throw new PathValidationError("ключ ответа вне диапазона");
  if (!str(q.explanation, 10, 900)) throw new PathValidationError("нет объяснения");
  if (!Array.isArray(q.wrongWhy) || q.wrongWhy.length !== 3 || !q.wrongWhy.every((w) => str(w, 5, 500))) throw new PathValidationError("нужно объяснение для каждого неверного варианта");
  const hints = checkHints(q.hints, [options[q.answer as number] as string]);
  const level = LEVELS.includes(q.level as Level) ? (q.level as Level) : "medium";
  return { kind: "mcq", skill: q.skill, stem: q.stem.trim(), options: (options as string[]).map((o) => o.trim()), answer: q.answer as number, explanation: q.explanation.trim(), wrongWhy: (q.wrongWhy as string[]).map((w) => w.trim()), hints, level };
}

const content = (s: string) => new Set(norm(s).split(/[^\p{L}\p{N}]+/u).filter((w) => w.length >= 4).map((w) => w.slice(0, 6)));

/** Выдаёт ли подсказка ответ: содержит его дословно или повторяет его значимые слова (≥ 2 и ≥ 40 %). */
export function hintLeaks(hint: string, secret: string) {
  const s = norm(secret);
  if (s.length >= 4 && norm(hint).includes(s)) return true;
  const key = content(secret);
  const said = content(hint);
  const shared = [...key].filter((w) => said.has(w)).length;
  return shared >= 2 && shared / Math.max(1, key.size) >= 0.4;
}

/**
 * Подсказки: до двух. Те, что выдают ответ, выбрасываются (FR-29), а вопрос
 * остаётся — без подсказок он тоже пригоден.
 */
function checkHints(raw: unknown, secrets: string[]) {
  if (!Array.isArray(raw)) throw new PathValidationError("нет списка подсказок");
  return (raw as unknown[])
    .filter((h): h is string => str(h, 5, 400))
    .map((h) => h.trim())
    .filter((h) => !secrets.some((secret) => hintLeaks(h, secret)))
    .slice(0, 2);
}

export function validateOpen(raw: unknown, skills: Set<string>): OpenItem {
  const q = raw as Record<string, unknown>;
  if (!q || typeof q !== "object") throw new PathValidationError("вопрос не объект");
  if (!str(q.skill, 1, 40) || !skills.has(q.skill)) throw new PathValidationError("вопрос без навыка");
  if (!str(q.stem, 8, 800)) throw new PathValidationError("формулировка задания");
  if (!str(q.rubric, 20, 2500)) throw new PathValidationError("нет критериев проверки");
  const hints = checkHints(q.hints, []);
  const level = LEVELS.includes(q.level as Level) ? (q.level as Level) : "medium";
  return { kind: "open", skill: q.skill, stem: q.stem.trim(), rubric: q.rubric.trim(), hints, level };
}

export interface MapSkill {
  key: string;
  name: string;
  description: string;
  prerequisites: string[];
}

export interface MapUnit {
  title: string;
  objective: string;
  skills: string[];
  minutes: number;
  weight: number;
  sourceQuote: string;
}

export interface SkillMap {
  title: string;
  skills: MapSkill[];
  units: MapUnit[];
  placement: McqItem[];
}

/** Порядок навыков, где каждая предпосылка раньше зависимого; null — в графе цикл. */
export function topologicalOrder(skills: { key: string; prerequisites: string[] }[]) {
  const byKey = new Map(skills.map((s) => [s.key, s]));
  const state = new Map<string, 1 | 2>();
  const order: string[] = [];
  const visit = (key: string): boolean => {
    if (state.get(key) === 2) return true;
    if (state.get(key) === 1) return false;
    state.set(key, 1);
    for (const p of byKey.get(key)?.prerequisites ?? []) if (!visit(p)) return false;
    state.set(key, 2);
    order.push(key);
    return true;
  };
  for (const s of skills) if (!visit(s.key)) return null;
  return order;
}

/** Есть ли цитата в материале (без учёта регистра, кавычек и пробелов). */
export function quoteInSource(quote: string, source: string) {
  const q = norm(quote);
  return q.length >= 12 && norm(source).includes(q);
}

/**
 * Карта навыков: 5–12 навыков без циклов, хотя бы один корень, у каждого
 * навыка есть юнит; юниты — 2–5 минут. Цитаты, которых нет в материале,
 * отбрасываются; если материал был, а подтвердилась меньше чем половина —
 * карта отклоняется: значит, ИИ опирался не на материал.
 */
export function validateMap(raw: unknown, source = ""): SkillMap {
  const m = raw as Record<string, unknown>;
  if (!m || typeof m !== "object" || !str(m.title, 3, 160)) throw new PathValidationError("нет названия цели");
  if (!Array.isArray(m.skills) || m.skills.length < 5 || m.skills.length > 12) throw new PathValidationError("нужно 5–12 навыков");
  const skills: MapSkill[] = m.skills.map((s: Record<string, unknown>) => {
    if (!s || !str(s.key, 1, 40) || !str(s.name, 2, 120) || !str(s.description, 5, 400) || !Array.isArray(s.prerequisites)) throw new PathValidationError("неполный навык");
    return { key: s.key.trim(), name: s.name.trim(), description: s.description.trim(), prerequisites: [...new Set((s.prerequisites as unknown[]).filter((p): p is string => typeof p === "string").map((p) => p.trim()))] };
  });
  const keys = new Set(skills.map((s) => s.key));
  if (keys.size !== skills.length) throw new PathValidationError("ключи навыков повторяются");
  if (new Set(skills.map((s) => norm(s.name))).size !== skills.length) throw new PathValidationError("названия навыков повторяются");
  for (const s of skills) {
    s.prerequisites = s.prerequisites.filter((p) => p !== s.key);
    if (s.prerequisites.some((p) => !keys.has(p))) throw new PathValidationError("ссылка на несуществующий навык");
  }
  if (!skills.some((s) => s.prerequisites.length === 0)) throw new PathValidationError("нет навыка-корня");
  if (!topologicalOrder(skills)) throw new PathValidationError("в карте навыков цикл");
  if (!Array.isArray(m.units) || m.units.length < skills.length || m.units.length > 24) throw new PathValidationError("юнитов меньше, чем навыков");
  const units: MapUnit[] = m.units.map((u: Record<string, unknown>) => {
    if (!u || !str(u.title, 3, 160) || !str(u.objective, 5, 300) || !Array.isArray(u.skills)) throw new PathValidationError("неполный юнит");
    const unitSkills = [...new Set((u.skills as unknown[]).filter((k): k is string => typeof k === "string" && keys.has(k)))];
    if (!unitSkills.length) throw new PathValidationError("юнит без навыка");
    const minutes = Math.round(Number(u.minutes));
    if (!(minutes >= 2 && minutes <= 5)) throw new PathValidationError("юнит должен занимать 2–5 минут");
    const weight = Number(u.weight);
    const quote = typeof u.sourceQuote === "string" ? u.sourceQuote.trim().slice(0, 300) : "";
    return { title: u.title.trim(), objective: u.objective.trim(), skills: unitSkills, minutes, weight: Number.isFinite(weight) ? Math.max(0, Math.min(1, weight)) : 0.5, sourceQuote: source && quoteInSource(quote, source) ? quote : "" };
  });
  const covered = new Set(units.flatMap((u) => u.skills));
  if (skills.some((s) => !covered.has(s.key))) throw new PathValidationError("у навыка нет юнита");
  if (source.trim() && units.filter((u) => u.sourceQuote).length * 2 < units.length) throw new PathValidationError("юниты не опираются на материал");
  if (!Array.isArray(m.placement)) throw new PathValidationError("нет стартового теста");
  const placement: McqItem[] = [];
  for (const item of m.placement) {
    try {
      placement.push(validateMcq({ ...(item as object), level: "medium" }, keys));
    } catch {
      /* невалидный вопрос стартового теста просто не попадает в банк */
    }
  }
  if (placement.length < Math.ceil(skills.length / 2)) throw new PathValidationError("слишком мало вопросов стартового теста");
  return { title: m.title.trim(), skills, units, placement };
}

export interface UnitContent {
  body: string;
  items: BankItem[];
}

/** Абзацы юнита — на них ссылаются предложения видео и «источники». */
export const paragraphs = (body: string) => body.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);

/**
 * Текст юнита: 80–400 слов, ≥ 2 абзацев. Банк: проходят только валидные
 * вопросы, тестовых должно остаться не меньше пяти (FR-25).
 */
export function validateUnit(raw: unknown, skills: Set<string>): UnitContent {
  const u = raw as Record<string, unknown>;
  if (!u || !str(u.body, 200, 4000)) throw new PathValidationError("нет текста юнита");
  const body = u.body.replace(/\r\n/g, "\n").trim();
  const count = words(body);
  if (count < 80 || count > 400) throw new PathValidationError(`в юните ${count} слов, нужно 80–400`);
  if (paragraphs(body).length < 2) throw new PathValidationError("юнит одним абзацем");
  const items: BankItem[] = [];
  for (const q of Array.isArray(u.questions) ? u.questions : []) {
    try {
      items.push(validateMcq(q, skills));
    } catch {
      /* отбрасываем */
    }
  }
  if (items.length < 5) throw new PathValidationError("меньше пяти валидных вопросов");
  if (u.open) {
    try {
      items.push(validateOpen(u.open, skills));
    } catch {
      /* открытый вопрос необязателен */
    }
  }
  return { body, items };
}

export const SCENE_KINDS = ["title", "points", "term", "example", "recap"] as const;
export type SceneKind = (typeof SCENE_KINDS)[number];

export interface ScriptSentence {
  text: string;
  /** номер абзаца юнита, на который опирается предложение */
  ref: number;
}

export interface ScriptScene {
  kind: SceneKind;
  heading: string;
  bullets: string[];
  sentences: ScriptSentence[];
}

export interface VideoScript {
  title: string;
  scenes: ScriptScene[];
}

/** Сценарий: 4–8 сцен, 120–280 слов, каждое предложение со ссылкой на существующий абзац. */
export function validateScript(raw: unknown, paragraphCount: number): VideoScript {
  const s = raw as Record<string, unknown>;
  if (!s || !str(s.title, 2, 120) || !Array.isArray(s.scenes) || s.scenes.length < 4 || s.scenes.length > 8) throw new PathValidationError("нужно 4–8 сцен");
  const scenes: ScriptScene[] = s.scenes.map((raw: Record<string, unknown>) => {
    if (!raw || !SCENE_KINDS.includes(raw.kind as SceneKind) || !str(raw.heading, 1, 80) || !Array.isArray(raw.bullets) || !Array.isArray(raw.sentences)) throw new PathValidationError("неполная сцена");
    const bullets = (raw.bullets as unknown[]).filter((b): b is string => str(b, 1, 90)).slice(0, 3).map((b) => b.trim());
    if (!raw.sentences.length || raw.sentences.length > 5) throw new PathValidationError("в сцене 1–5 предложений");
    const sentences = (raw.sentences as Record<string, unknown>[]).map((x) => {
      if (!x || !str(x.text, 3, 260) || !Number.isInteger(x.ref) || (x.ref as number) < 0 || (x.ref as number) >= paragraphCount) throw new PathValidationError("предложение без ссылки на абзац");
      return { text: x.text.trim(), ref: x.ref as number };
    });
    return { kind: raw.kind as SceneKind, heading: raw.heading.trim(), bullets, sentences };
  });
  const total = scenes.reduce((n, sc) => n + sc.sentences.reduce((m, x) => m + words(x.text), 0), 0);
  if (total < 120 || total > 280) throw new PathValidationError(`в сценарии ${total} слов, нужно 120–280`);
  return { title: s.title.trim(), scenes };
}
