import { describe, expect, it } from "vitest";
import { EVENTS } from "./index";
import { steps } from "./engine";
import { DIAGRAM_NAMES } from "@/components/events/NotesDiagram";

/**
 * Требования к содержимому — для каждого ивента в списке, а не только для
 * первого: новый ивент пишется вручную и большим объёмом, и ошибиться в
 * нём (пустое объяснение, разъехавшийся перевод, ответ, который выдаёт
 * себя длиной) проще всего.
 */
describe.each(EVENTS.map((e) => [e.id, e] as const))("содержимое ивента %s", (_id, event) => {
  const all = event.lectures.flatMap((l) => l.parts.flatMap((p) => p.questions));

  it("у каждого вопроса свой id, варианты не повторяются, есть объяснение на двух языках", () => {
    expect(new Set(all.map((q) => q.id)).size).toBe(all.length);
    for (const q of all) {
      expect(q.options.length, q.id).toBeGreaterThanOrEqual(2);
      expect(new Set(q.options).size, q.id).toBe(q.options.length);
      expect(q.options[q.answer], q.id).toBeTruthy();
      expect(q.why.en.length, q.id).toBeGreaterThan(10);
      expect(q.why.ru.length, q.id).toBeGreaterThan(10);
      // Варианты перемешиваются, поэтому «оба варианта выше» и «все перечисленные» теряют смысл.
      for (const o of q.options) expect(/\b(both a and b|all of the above|none of the above)\b/i.test(o), `${q.id}: ${o}`).toBe(false);
    }
  });

  it("у каждой части есть конспект на английском и русском с одинаковой структурой", () => {
    const kind = (l: string) => (l.startsWith("## ") ? "h" : l.startsWith("- ") ? "b" : l.startsWith("> ") ? "q" : l.startsWith("= ") ? "c" : l.startsWith("|") ? "t" : l.startsWith("@") ? "d" : l.startsWith("![") ? "i" : l.startsWith("?? ") ? "Q" : l.startsWith("?= ") ? "A" : l.trim() ? "p" : "_");
    const shape = (text: string) => text.split("\n").map(kind).join("");
    for (const lecture of event.lectures) {
      for (const p of lecture.parts) {
        expect(p.notes.en.length, p.id).toBeGreaterThan(400);
        expect(shape(p.notes.ru), p.id).toBe(shape(p.notes.en));
        // Строки с командами и числами («= …») одинаковы в обоих языках: их вводят как есть.
        const code = (text: string) => text.split("\n").filter((l) => l.startsWith("= "));
        expect(code(p.notes.ru), p.id).toEqual(code(p.notes.en));
        // Схемы и демонстрации — те же самые, иллюстрации — те же файлы (подписи переводятся).
        const embeds = (text: string) => text.split("\n").filter((l) => l.startsWith("@")).concat(text.split("\n").filter((l) => l.startsWith("![")).map((l) => l.replace(/^!\[[^\]]*\]/, "")));
        expect(embeds(p.notes.ru), p.id).toEqual(embeds(p.notes.en));
        for (const l of p.notes.en.split("\n")) {
          if (l.startsWith("@diagram ")) expect(DIAGRAM_NAMES, `${p.id}: ${l}`).toContain(l.slice(9).trim());
          if (l.startsWith("@demo ")) expect(["binary", "encapsulation", "cable"], `${p.id}: ${l}`).toContain(l.slice(6).trim());
        }
        // За вопросом самопроверки сразу идёт ответ, и наоборот.
        const lines = p.notes.en.split("\n");
        lines.forEach((l, i) => {
          if (l.startsWith("?? ")) expect(lines[i + 1]?.startsWith("?= "), `${p.id}: ${l}`).toBe(true);
          if (l.startsWith("?= ")) expect(lines[i - 1]?.startsWith("?? "), `${p.id}: ${l}`).toBe(true);
        });
      }
    }
  });

  it("банка хватает на квизы нужного размера: 5–10 по части, 15–20 по лекции, 40–50 итоговый", () => {
    const list = steps(event);
    for (const s of list.filter((s) => s.kind === "part")) expect(s.count, s.id).toBeGreaterThanOrEqual(5), expect(s.count).toBeLessThanOrEqual(10);
    for (const s of list.filter((s) => s.kind === "lecture")) expect(s.count, s.id).toBeGreaterThanOrEqual(15), expect(s.count).toBeLessThanOrEqual(20);
    const final = list.at(-1)!;
    expect(final.count).toBeGreaterThanOrEqual(40);
    expect(final.count).toBeLessThanOrEqual(50);
  });

  it("верный ответ не выдаёт себя длиной", () => {
    const choice = all.filter((q) => !q.fixed);
    const longest = choice.filter((q) => q.options.every((o, i) => i === q.answer || o.length < q.options[q.answer].length));
    const shortest = choice.filter((q) => q.options.every((o, i) => i === q.answer || o.length > q.options[q.answer].length));
    expect(longest.length / choice.length).toBeLessThan(0.33);
    expect(shortest.length / choice.length).toBeLessThan(0.4);
  });

  it("шпаргалка и карточки: перевод той же длины, термины не повторяются", () => {
    if (event.cheatSheet) {
      expect(event.cheatSheet.en.length).toBeGreaterThan(800);
      expect(event.cheatSheet.ru.split("\n").length).toBe(event.cheatSheet.en.split("\n").length);
    }
    if (event.glossary) {
      expect(event.glossary.length).toBeGreaterThanOrEqual(30);
      expect(new Set(event.glossary.map((t) => t.term)).size).toBe(event.glossary.length);
    }
  });
});

it("id вопросов и шагов не пересекаются между ивентами — прогресс одного не попадёт в другой", () => {
  const ids = EVENTS.flatMap((e) => steps(e).map((s) => s.id));
  expect(new Set(ids).size).toBe(ids.length);
});
