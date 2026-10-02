import { describe, expect, it } from "vitest";
import { createTranslator } from "./translate";
import en from "./dict/en.json";
import kk from "./dict/kk.json";
import keys from "./keys.json";

const t = createTranslator({
  "Сегодня": "Today",
  "из": "of",
  "Вопрос": "Question",
  "дн.": "d",
  "Осталось {0} дн.": "{0} d left",
  "Знаю {0} из {1}": "Know {0} of {1}",
  "{0} · уровень {1}": "{0} · level {1}",
  "Лёгкий": "Easy",
  "{0} {1}": "{1} {0}",
});

describe("перевод строки по словарю", () => {
  it("переводит точное совпадение и сохраняет пробелы по краям — они часть вёрстки", () => {
    expect(t("Сегодня")).toBe("Today");
    expect(t("Вопрос ")).toBe("Question ");
    expect(t(" из ")).toBe(" of ");
    expect(t("\n  Сегодня\n")).toBe("\n  Today\n");
  });

  it("не трогает текст без кириллицы и незнакомые строки", () => {
    expect(t("42")).toBeNull();
    expect(t("Python")).toBeNull();
    // Заметка пользователя не совпадает ни с одной строкой интерфейса.
    expect(t("Купить молоко и позвонить маме")).toBeNull();
  });

  it("подставляет значения в образцы и переводит сами значения, если они есть в словаре", () => {
    expect(t("Осталось 3 дн.")).toBe("3 d left");
    expect(t("Знаю 5 из 33")).toBe("Know 5 of 33");
    expect(t("Аят · уровень 7")).toBe("Аят · level 7");
    expect(t("Лёгкий · уровень 2")).toBe("Easy · level 2");
  });

  it("образец из одних подстановок игнорируется — иначе он совпадал бы с любой строкой", () => {
    expect(t("какая-то фраза")).toBeNull();
  });
});

describe("словари", () => {
  const patterns = (keys as string[]).filter((k) => /\{\d\}/.test(k));
  for (const [name, dict] of [["en", en], ["kk", kk]] as const) {
    it(`${name}: переведено не меньше 97% строк интерфейса`, () => {
      const translated = (keys as string[]).filter((k) => typeof (dict as Record<string, string>)[k] === "string" && (dict as Record<string, string>)[k].trim());
      expect(translated.length / keys.length).toBeGreaterThan(0.97);
    });
    it(`${name}: подстановки {n} не потеряны и не выдуманы`, () => {
      const slots = (s: string) => [...s.matchAll(/\{\d\}/g)].map((m) => m[0]).sort().join();
      const broken = patterns.filter((k) => (dict as Record<string, string>)[k] && slots((dict as Record<string, string>)[k]) !== slots(k));
      expect(broken).toEqual([]);
    });
  }
  it("en: в английском переводе не осталось кириллицы", () => {
    const leftovers = Object.entries(en as Record<string, string>).filter(([, v]) => /[А-Яа-яЁё]/.test(v)).map(([k]) => k);
    expect(leftovers).toEqual([]);
  });
});
