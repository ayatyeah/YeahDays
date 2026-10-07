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

  it("банка хватает на квизы нужного размера: по части 5–10 (или вся часть, до 20), 15–20 по лекции, 40–50 итоговый", () => {
    const list = steps(event);
    // Квиз по части — либо выборка 5–10, либо весь банк части целиком (до 20 вопросов), как в облачном ивенте.
    for (const s of list.filter((s) => s.kind === "part")) expect(s.count, s.id).toBeGreaterThanOrEqual(5), expect(s.count).toBeLessThanOrEqual(event.counts.part > 10 ? 20 : 10);
    if (event.counts.part > 10) for (const l of event.lectures) for (const p of l.parts) expect(p.questions.length, `${p.id}: банк части должен быть ровно квизом`).toBe(event.counts.part);
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

  it("банки «до косточек»: 30–40 вопросов, у каждого неверного варианта — своё объяснение, ответ не выдаёт себя длиной", () => {
    for (const lecture of event.lectures) for (const p of lecture.parts) {
      if (!p.deep) continue;
      expect(p.deep.length, p.id).toBeGreaterThanOrEqual(30);
      expect(p.deep.length, p.id).toBeLessThanOrEqual(40);
      expect(new Set(p.deep.map((q) => q.q.trim().toLowerCase())).size, `${p.id}: повторяющиеся вопросы`).toBe(p.deep.length);
      for (const q of p.deep) {
        expect(new Set(q.options).size, q.id).toBe(q.options.length);
        expect(q.wrong, q.id).toHaveLength(q.options.length - 1);
        for (const w of q.wrong!) { expect(w.en.length, q.id).toBeGreaterThan(6); expect(w.ru.length, q.id).toBeGreaterThan(6); }
        expect(q.why.en.length, q.id).toBeGreaterThan(10);
        for (const o of q.options) expect(/\b(both a and b|all of the above|none of the above)\b/i.test(o), `${q.id}: ${o}`).toBe(false);
      }
      const choice = p.deep.filter((q) => !q.fixed);
      const longest = choice.filter((q) => q.options.every((o, i) => i === q.answer || o.length < q.options[q.answer].length));
      expect(longest.length / choice.length, `${p.id}: верный ответ слишком часто самый длинный`).toBeLessThan(0.34);
      expect(p.deep.filter((q) => q.fixed).length, `${p.id}: слишком много «верно/неверно»`).toBeLessThanOrEqual(4);
    }
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

  it("пробные экзамены: баллы сходятся, у каждого подпункта критерии и эталон, id не повторяются", () => {
    const ids = new Set<string>();
    for (const exam of event.mocks ?? []) {
      expect(exam.questions.reduce((n, q) => n + q.points, 0), `${exam.id}: сумма баллов`).toBe(100);
      for (const q of exam.questions) {
        expect(q.tasks.reduce((n, t) => n + t.points, 0), `${q.id}: подпункты дают баллы задания`).toBe(q.points);
        for (const t of q.tasks) {
          expect(ids.has(t.id), `${t.id} повторяется`).toBe(false);
          ids.add(t.id);
          expect(t.prompt.trim().length, `${t.id}: формулировка`).toBeGreaterThan(10);
          expect(t.rubric.length, `${t.id}: критерии`).toBeGreaterThanOrEqual(2);
          // «2 pts — …», «0.5 pts — …»: сумма по критериям = баллы подпункта, иначе ИИ не из чего ставить оценку
          const sum = t.rubric.reduce((n, r) => n + Number(/^(\d+(?:\.\d+)?)\s*pts?\b/.exec(r)?.[1] ?? NaN), 0);
          expect(sum, `${t.id}: критерии в сумме`).toBe(t.points);
          expect(t.answer.en.trim().length, `${t.id}: эталон EN`).toBeGreaterThan(10);
          expect(t.answer.ru.trim().length, `${t.id}: разбор RU`).toBeGreaterThan(10);
          expect(t.prompt + t.answer.en + t.answer.ru).not.toMatch(/\$\{|`/);
        }
      }
    }
  });
});

it("id вопросов и шагов не пересекаются между ивентами — прогресс одного не попадёт в другой", () => {
  const ids = EVENTS.flatMap((e) => steps(e).map((s) => s.id));
  expect(new Set(ids).size).toBe(ids.length);
});
