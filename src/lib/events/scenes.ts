/**
 * Нарезка конспекта на сцены «видео».
 *
 * Видео здесь — не файл, а проигрывание конспекта сценами прямо на сайте:
 * одна мысль на экране, переход, озвучка, схема. Так проще удержать
 * внимание, чем на полотне текста, и это бесплатно: голос — браузера,
 * картинки — те же схемы, что в конспекте.
 *
 * Конспекты на двух языках написаны строка в строку (это проверяет тест
 * содержимого), поэтому каждую строку можно показать парой: русское
 * объяснение крупно, английский оригинал рядом — термины остаются на
 * языке квиза.
 */

import type { Text } from "./types";

export type Scene =
  | { kind: "title"; ru: string; en: string }
  | { kind: "text"; ru: string; en: string }
  | { kind: "bullet"; ru: string; en: string; index: number; total: number }
  | { kind: "quote"; ru: string; en: string }
  | { kind: "code"; code: string }
  | { kind: "diagram"; name: string }
  | { kind: "table"; ru: string[][]; en: string[][] }
  | { kind: "question"; ru: string; en: string; answerRu: string; answerEn: string }
  | { kind: "image"; src: string; ru: string; en: string };

const cells = (line: string) => line.trim().replace(/^\||\|$/g, "").split("|").map((c) => c.trim());
const isRule = (line: string) => /^\|[\s\-:|]+\|$/.test(line.trim());
/** Убрать разметку жирного и курсива — на экране сцены текст и так крупный. */
export const strip = (s: string) => s.replace(/\*\*([^*]+)\*\*/g, "$1").replace(/\*([^*]+)\*/g, "$1").trim();

/** Сцены по конспекту части. Демонстрации пропускаются: их надо трогать руками, в видео они не живут. */
export function scenes(notes: Text, title: Text): Scene[] {
  const ru = notes.ru.split("\n"), en = notes.en.split("\n");
  const out: Scene[] = [{ kind: "title", ru: title.ru, en: title.en }];
  let bullets: { ru: string; en: string }[] = [];
  let table: { ru: string[][]; en: string[][] } | null = null;
  const flush = () => {
    if (bullets.length) {
      bullets.forEach((b, i) => out.push({ kind: "bullet", ru: b.ru, en: b.en, index: i + 1, total: bullets.length }));
      bullets = [];
    }
    if (table) {
      out.push({ kind: "table", ...table });
      table = null;
    }
  };
  for (let i = 0; i < en.length; i++) {
    const e = en[i], r = ru[i] ?? e;
    if (e.startsWith("- ")) { bullets.push({ ru: strip(r.slice(2)), en: strip(e.slice(2)) }); continue; }
    if (e.startsWith("|")) {
      if (!isRule(e)) { table ??= { ru: [], en: [] }; table.ru.push(cells(r).map(strip)); table.en.push(cells(e).map(strip)); }
      continue;
    }
    flush();
    if (e.startsWith("## ")) out.push({ kind: "title", ru: strip(r.slice(3)), en: strip(e.slice(3)) });
    else if (e.startsWith("> ")) out.push({ kind: "quote", ru: strip(r.slice(2)), en: strip(e.slice(2)) });
    else if (e.startsWith("= ")) out.push({ kind: "code", code: e.slice(2) });
    else if (e.startsWith("@diagram ")) out.push({ kind: "diagram", name: e.slice(9).trim() });
    else if (e.startsWith("?? ")) {
      const ans = en[i + 1]?.startsWith("?= ") ? { en: en[i + 1].slice(3), ru: (ru[i + 1] ?? en[i + 1]).slice(3) } : { en: "", ru: "" };
      out.push({ kind: "question", ru: strip(r.slice(3)), en: strip(e.slice(3)), answerRu: strip(ans.ru), answerEn: strip(ans.en) });
      i++;
    } else if (e.startsWith("![")) {
      const m = /^!\[([^\]]*)\]\(([^)]+)\)/.exec(e), mr = /^!\[([^\]]*)\]/.exec(r);
      if (m) out.push({ kind: "image", src: m[2], en: m[1], ru: mr?.[1] ?? m[1] });
    } else if (e.trim() && !e.startsWith("@")) {
      // Длинный абзац — по предложениям, чтобы на экране была одна мысль.
      const chunksEn = sentences(strip(e)), chunksRu = sentences(strip(r));
      if (chunksEn.length === chunksRu.length && chunksEn.length > 1) chunksEn.forEach((c, k) => out.push({ kind: "text", en: c, ru: chunksRu[k] }));
      else out.push({ kind: "text", ru: strip(r), en: strip(e) });
    }
  }
  flush();
  return out;
}

/** Разбить абзац на предложения, не ломая сокращения вроде «e.g.» и числа «192.168». */
export function sentences(text: string): string[] {
  const parts = text.split(/(?<=[.!?])\s+(?=[A-ZА-ЯЁ«"(])/).map((s) => s.trim()).filter(Boolean);
  const out: string[] = [];
  for (const piece of parts) {
    const prev = out[out.length - 1];
    if (prev && /(?:\b(?:e\.g|i\.e|etc|vs|т\.е|т\.д|напр)\.|\b[A-Za-z]\.)$/.test(prev)) out[out.length - 1] = `${prev} ${piece}`;
    else out.push(piece);
  }
  return out;
}

/** Что произносит голос за сцену: на каком языке и что именно. */
export function narration(scene: Scene, mode: "mix" | "ru" | "en"): { lang: "ru" | "en"; text: string }[] {
  const pick = (ru: string, en: string) => (mode === "en" ? [{ lang: "en" as const, text: en }] : mode === "ru" ? [{ lang: "ru" as const, text: ru }] : [{ lang: "ru" as const, text: ru }]);
  switch (scene.kind) {
    case "title":
      // В смешанном режиме заголовок звучит по-английски — это и есть термин, — и тут же по-русски.
      return mode === "mix" ? [{ lang: "en", text: scene.en }, { lang: "ru", text: scene.ru }] : pick(scene.ru, scene.en);
    case "text":
    case "bullet":
    case "quote":
      return pick(scene.ru, scene.en);
    case "question":
      return pick(scene.ru, scene.en);
    case "image":
      return pick(scene.ru, scene.en);
    case "table":
      return pick(mode === "en" ? "" : scene.ru.map((row) => row.join(", ")).slice(0, 4).join(". "), scene.en.map((row) => row.join(", ")).slice(0, 4).join(". "));
    default:
      return [];
  }
}

/** Сколько держать сцену без озвучки, мс: по длине текста, в разумных пределах. */
export function holdFor(scene: Scene): number {
  const len = scene.kind === "diagram" ? 240 : scene.kind === "code" ? scene.code.length * 2 : scene.kind === "table" ? scene.en.flat().join(" ").length : scene.kind === "question" ? scene.en.length + scene.answerEn.length : "en" in scene ? scene.en.length : 100;
  return Math.min(14000, Math.max(3500, 1800 + len * 45));
}
