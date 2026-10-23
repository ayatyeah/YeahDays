import { describe, expect, it } from "vitest";
import { hintLeaks, paragraphs, quoteInSource, topologicalOrder, validateMap, validateMcq, validateScript, validateUnit, words } from "./validate";
import { quotesRubric } from "./ai";
import { validDate } from "./service";
import { daysUntil } from "./pathway";

const skills = new Set(["s1", "s2"]);
const mcq = (over: Record<string, unknown> = {}) => ({
  skill: "s1",
  stem: "Что вернёт LEFT JOIN для студента без оценок?",
  options: ["Строку с NULL в полях оценки", "Ничего", "Ошибку", "Две строки"],
  answer: 0,
  explanation: "LEFT JOIN сохраняет все строки левой таблицы.",
  wrongWhy: ["Строка сохраняется.", "Ошибки нет.", "Дублей нет."],
  hints: ["Вспомни, какая таблица сохраняется целиком."],
  level: "easy",
  ...over,
});

describe("question checks", () => {
  it("drops hints that give the answer away but keeps the question", () => {
    const item = validateMcq(mcq({ hints: ["Ответ: строку с NULL в полях оценки", "Строка сохраняется, но поля оценки пустые — NULL", "Какая таблица сохраняется целиком?"] }), skills);
    expect(item.hints).toEqual(["Какая таблица сохраняется целиком?"]);
    expect(validateMcq(mcq({ hints: [] }), skills).hints).toEqual([]);
  });

  it("accepts a well-formed multiple-choice item", () => {
    expect(validateMcq(mcq(), skills)).toMatchObject({ kind: "mcq", answer: 0, level: "easy" });
  });

  it.each([
    ["three options", { options: ["a", "b", "c"] }],
    ["duplicate options", { options: ["Да", "да", "Нет", "Может"] }],
    ["answer key out of range", { answer: 4 }],
    ["missing distractor reasons", { wrongWhy: ["one"] }],
    ["unknown skill", { skill: "s9" }],
    ["'all of the above'", { options: ["Все перечисленные", "b", "c", "d"] }],
  ])("rejects %s", (_name, over) => {
    expect(() => validateMcq(mcq(over), skills)).toThrow();
  });
});

describe("skill map checks", () => {
  const map = (over: Record<string, unknown> = {}) => ({
    title: "SQL с нуля",
    skills: ["a", "b", "c", "d", "e"].map((key, i) => ({ key, name: `Навык ${key}`, description: "Описание навыка", prerequisites: i ? [["a", "b", "c", "d", "e"][i - 1]] : [] })),
    units: ["a", "b", "c", "d", "e"].map((key) => ({ title: `Юнит ${key}`, objective: "Понять тему", skills: [key], minutes: 3, weight: 0.6, sourceQuote: "" })),
    placement: ["a", "b", "c", "d", "e"].map((key) => mcq({ skill: key })),
    ...over,
  });

  it("accepts an acyclic map with a unit for every skill", () => {
    const result = validateMap(map());
    expect(result.skills).toHaveLength(5);
    expect(result.placement).toHaveLength(5);
    expect(topologicalOrder(result.skills)).toEqual(["a", "b", "c", "d", "e"]);
  });

  it("rejects cycles, too few skills and units outside 2–5 minutes", () => {
    const cyclic = map();
    (cyclic.skills as { prerequisites: string[] }[])[0].prerequisites = ["e"];
    expect(() => validateMap(cyclic)).toThrow(/корня|цикл/);
    expect(() => validateMap(map({ skills: (map().skills as unknown[]).slice(0, 4) }))).toThrow(/5–12/);
    const long = map();
    (long.units as { minutes: number }[])[0].minutes = 12;
    expect(() => validateMap(long)).toThrow(/2–5/);
  });

  it("keeps only source quotes that really occur in the material", () => {
    const source = "Оператор LEFT JOIN возвращает все строки левой таблицы, даже без пары.";
    const units = map().units as { sourceQuote: string }[];
    units.forEach((u, i) => (u.sourceQuote = i < 3 ? "LEFT JOIN возвращает все строки левой таблицы" : "выдуманная цитата из воздуха"));
    const result = validateMap(map({ units }), source);
    expect(result.units.filter((u) => u.sourceQuote)).toHaveLength(3);
    units.forEach((u) => (u.sourceQuote = "выдуманная цитата из воздуха"));
    expect(() => validateMap(map({ units }), source)).toThrow(/материал/);
    expect(quoteInSource("«LEFT JOIN»  возвращает все строки", source)).toBe(true);
  });
});

describe("unit and script checks", () => {
  const body = Array.from({ length: 3 }, (_, i) => `Абзац ${i + 1}. ${"Слово ".repeat(40).trim()}.`).join("\n\n");

  it("requires 80–400 words, several paragraphs and at least five valid questions", () => {
    const ok = validateUnit({ body, questions: Array.from({ length: 6 }, () => mcq()), open: { skill: "s1", stem: "Объясни своими словами разницу", rubric: "Должно быть указано, что LEFT JOIN сохраняет строки", hints: ["Сравни с INNER JOIN"], level: "hard" } }, skills);
    expect(ok.items.filter((i) => i.kind === "mcq")).toHaveLength(6);
    expect(ok.items.at(-1)?.kind).toBe("open");
    expect(() => validateUnit({ body, questions: [mcq(), mcq({ answer: 9 })] }, skills)).toThrow(/пяти/);
    expect(() => validateUnit({ body: "Слово ".repeat(500), questions: [] }, skills)).toThrow();
    expect(paragraphs(body)).toHaveLength(3);
    expect(words("LEFT JOIN — это соединение")).toBe(4);
  });

  it("accepts a grounded 120–280 word script and rejects dangling references", () => {
    const sentence = (ref: number) => ({ text: "Это предложение из восьми слов про соединение таблиц.", ref });
    const scenes = Array.from({ length: 5 }, () => ({ kind: "points", heading: "Тема", bullets: ["пункт"], sentences: [sentence(0), sentence(1), sentence(2), sentence(0)] }));
    expect(validateScript({ title: "Видео", scenes }, 3).scenes).toHaveLength(5);
    expect(() => validateScript({ title: "Видео", scenes: scenes.map((s) => ({ ...s, sentences: [sentence(5), ...s.sentences.slice(1)] })) }, 3)).toThrow(/абзац/);
    expect(() => validateScript({ title: "Видео", scenes: scenes.slice(0, 4).map((s) => ({ ...s, sentences: [sentence(0)] })) }, 3)).toThrow(/120–280/);
  });
});

describe("guards found in review", () => {
  it("accepts only real calendar dates", () => {
    expect(validDate("2026-10-24")).toBe(true);
    expect(validDate("2026-13-01")).toBe(false);
    expect(validDate("2026-02-30")).toBe(false);
    expect(daysUntil("2026-13-01", "2026-10-22")).toBeNull();
  });

  it("detects hints that paraphrase the answer with its key words", () => {
    expect(hintLeaks("Это уникальный идентификатор каждой строки", "Уникальный идентификатор строки таблицы")).toBe(true);
    expect(hintLeaks("Вспомни, что делает ключ в таблице", "Уникальный идентификатор строки таблицы")).toBe(false);
  });

  it("notices grader feedback that quotes the hidden rubric", () => {
    const rubric = "Ответ должен содержать определение WHERE и HAVING, порядок их применения и пример запроса с HAVING по сгруппированным данным.";
    expect(quotesRubric("Вот критерии: ответ должен содержать определение WHERE и HAVING, порядок их применения", rubric)).toBe(true);
    expect(quotesRubric("Хорошо объяснён порядок фильтрации; добавь пример запроса.", rubric)).toBe(false);
  });
});
