import { describe, expect, it } from "vitest";
import { EVENTS } from "./index";
import { notePages, PAGE_LINES } from "./notePages";

const body = (notes: string) => notes.split("\n").map((l) => l.trimEnd()).filter((l) => l.trim() && !l.startsWith("## "));

describe("scroll-mode: конспект экранами", () => {
  it("раздел — экран; вводный кусок — без заголовка; пустой раздел пропускается", () => {
    const pages = notePages("Вводная строка.\n## Альфа\n- один\n- два\n## Пустой\n## Бета\n> главное");
    expect(pages.map((p) => p.heading)).toEqual([null, "Альфа", "Бета"]);
    expect(pages[1].text).toBe("- один\n- два");
    expect(pages.every((p) => !p.piece)).toBe(true);
  });

  it("длинный раздел режется на экраны, таблица и вопрос с ответом не разрываются", () => {
    const long = Array.from({ length: 40 }, (_, i) => `- пункт номер ${i} с объяснением, которое занимает почти целую строку текста`).join("\n");
    const table = ["| A | B |", "|---|---|", ...Array.from({ length: 6 }, (_, i) => `| ${i} | x |`)].join("\n");
    const pages = notePages(`## Длинный\n${long}\n${table}\n?? Вопрос?\n?= Ответ`);
    expect(pages.length).toBeGreaterThan(2);
    expect(pages.map((p) => p.piece)).toEqual(pages.map((_, i) => `${i + 1}/${pages.length}`));
    expect(pages.filter((p) => p.text.includes("| A | B |"))).toHaveLength(1);
    expect(pages.find((p) => p.text.includes("| A | B |"))!.text).toContain("| 5 | x |");
    expect(pages.find((p) => p.text.includes("?? Вопрос?"))!.text).toContain("?= Ответ");
  });

  it("настоящие конспекты: ничего не теряется и не дублируется, экраны разумной длины", () => {
    let pagesTotal = 0;
    for (const event of EVENTS) {
      for (const lecture of event.lectures) {
        for (const part of lecture.parts) {
          for (const lang of ["en", "ru"] as const) {
            const pages = notePages(part.notes[lang]);
            expect(pages.flatMap((p) => p.text.split("\n")), `${part.id} ${lang}`).toEqual(body(part.notes[lang]));
            pagesTotal += pages.length;
            // Длиннее экрана бывает только один неделимый блок (большая таблица или схема).
            for (const p of pages) {
              const rows = p.text.split("\n");
              if (rows.length > 1 && !rows[0].startsWith("|")) expect(rows.length, `${part.id} ${lang} ${p.heading}`).toBeLessThan(PAGE_LINES * 2);
            }
          }
        }
      }
    }
    expect(pagesTotal).toBeGreaterThan(100);
  });
});
