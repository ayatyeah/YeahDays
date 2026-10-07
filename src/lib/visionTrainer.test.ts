import { describe, expect, it } from "vitest";
import { checkField, generate, parseNumber, TRAINER_KINDS, type TrainerKind } from "./visionTrainer";

const kinds = TRAINER_KINDS.map((k) => k.kind);
const seeds = Array.from({ length: 300 }, (_, i) => i * 7919 + 13);

describe("генераторы", () => {
  it.each(kinds)("%s: на сотнях seed задача корректна и верный ответ проходит проверку", (kind) => {
    for (const seed of seeds) {
      const t = generate(kind as TrainerKind, seed);
      expect(t.prompt.length).toBeGreaterThan(20);
      expect(t.steps.length).toBeGreaterThan(20);
      expect(t.fields.length).toBeGreaterThan(0);
      for (const f of t.fields) {
        expect(Number.isFinite(f.answer), `${kind}/${seed}/${f.id}`).toBe(true);
        if (f.type === "choice") expect(f.answer).toBeLessThan(f.options!.length);
        expect(checkField(f, String(f.answer)), `${kind}/${seed}/${f.id}`).toBe(true);
      }
      expect(t.prompt + t.steps).not.toMatch(/NaN|undefined|Infinity/);
    }
  });

  it("тот же seed — та же задача", () => {
    for (const kind of kinds) expect(generate(kind as TrainerKind, 42)).toEqual(generate(kind as TrainerKind, 42));
  });

  it("Wx + b: максимум единственный — предсказание однозначно", () => {
    for (const seed of seeds) {
      const t = generate("linear", seed);
      const s = t.fields.filter((f) => f.id.startsWith("s")).map((f) => f.answer);
      expect(s.filter((v) => v === Math.max(...s)).length).toBe(1);
      expect(t.fields.find((f) => f.id === "pred")!.answer).toBe(s.indexOf(Math.max(...s)));
    }
  });

  it("таблица оценок: одна-две ошибки, accuracy сходится с предсказаниями", () => {
    for (const seed of seeds) {
      const t = generate("argmax", seed);
      const acc = t.fields.find((f) => f.id === "acc")!.answer;
      const images = t.fields.length - 1;
      const correct = Math.round((acc / 100) * images);
      expect(images - correct).toBeGreaterThanOrEqual(1);
      expect(images - correct).toBeLessThanOrEqual(2);
    }
  });

  it("свёртка и разбиение: только целые числа", () => {
    for (const seed of seeds) {
      for (const f of generate("conv", seed).fields) expect(Number.isInteger(f.answer)).toBe(true);
      for (const f of generate("split", seed).fields) expect(Number.isInteger(f.answer)).toBe(true);
    }
  });

  it("форма после resize — (height, width): ширина идёт вторым", () => {
    const t = generate("shape", 7);
    const m = /cv2\.resize\(img, \((\d+), (\d+)\)\)/.exec(t.prompt)!;
    if (!/crop|\[/.test(t.prompt.split("\n").slice(3).join(""))) {
      expect(t.fields.find((f) => f.id === "w")!.answer).toBe(Number(m[1]));
      expect(t.fields.find((f) => f.id === "h")!.answer).toBe(Number(m[2]));
    }
  });
});

describe("проверка ответа", () => {
  it("понимает запятую, проценты, длинный минус и пробелы в тысячах", () => {
    expect(parseNumber("0,13")).toBe(0.13);
    expect(parseNumber("75%")).toBe(75);
    expect(parseNumber("−2")).toBe(-2);
    expect(parseNumber("1 600")).toBe(1600);
    expect(parseNumber("abc")).toBeNull();
    expect(parseNumber("")).toBeNull();
  });

  it("допуск: softmax до сотых, целые — точно", () => {
    expect(checkField({ id: "p", label: "", type: "number", answer: 0.13, tol: 0.011 }, "0.14")).toBe(true);
    expect(checkField({ id: "p", label: "", type: "number", answer: 0.13, tol: 0.011 }, "0.15")).toBe(false);
    expect(checkField({ id: "s", label: "", type: "number", answer: -2, tol: 0 }, "-3")).toBe(false);
    expect(checkField({ id: "c", label: "", type: "choice", answer: 1, options: ["a", "b"] }, "1")).toBe(true);
  });
});
