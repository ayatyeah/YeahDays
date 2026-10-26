/**
 * Конспект части — экранами для scroll-mode: листаешь вверх, как ленту.
 *
 * Экран — раздел конспекта (от «## заголовка» до следующего); длинный раздел
 * режется на экраны не длиннее PAGE_LINES — как можно меньше экранов и без
 * полупустых хвостов (см. split).
 * Вес блока — сколько примерно строк он займёт на телефоне (~42 знака в
 * строке; в таблице ширина делится на колонки, и ячейки переносятся сильнее).
 * Таблица, схема, картинка и вопрос с ответом не разрываются:
 * если такой блок сам больше экрана, он идёт отдельным экраном, и экран
 * прокручивается внутри.
 */

/** Сколько строк текста помещается на экран телефона под шапкой. */
export const PAGE_LINES = 22;

export interface NotePage {
  /** Заголовок раздела; у вводного куска до первого «##» — нет. */
  heading: string | null;
  /** Кусок разметки конспекта (без «## »-заголовка) — рисуется EventNotes. */
  text: string;
  /** «2/3», если раздел разрезан на экраны. */
  piece?: string;
}

const lines = (text: string, width: number) => Math.max(1, Math.ceil(text.length / width));

/** Сколько строк займёт блок разметки. */
function weight(block: string[]): number {
  const first = block[0];
  if (first.startsWith("|")) {
    const rows = block.filter((l) => !/^\|[\s\-:|]+\|$/.test(l.trim())).map((l) => l.trim().replace(/^\||\|$/g, "").split("|").map((c) => c.trim()));
    const width = 40 / Math.max(1, rows[0].length);
    return 1 + rows.reduce((n, cells) => n + 0.7 + Math.max(...cells.map((c) => lines(c, width))), 0);
  }
  if (first.startsWith("@diagram ")) return 12;
  if (first.startsWith("@demo ")) return 14;
  if (first.startsWith("![")) return 12;
  if (first.startsWith("?? ")) return 2.5 + lines(first, 40);
  if (first.startsWith("- ")) return 0.3 + lines(first, 38);
  if (first.startsWith("> ")) return 1.2 + lines(first, 36);
  if (first.startsWith("= ")) return 1 + lines(first, 34);
  return 0.6 + lines(first, 42);
}

/** Строки → неделимые блоки: таблица целиком, «?? вопрос» вместе с «?= ответом», остальное — по строке. */
function blocks(body: string[]): string[][] {
  const out: string[][] = [];
  for (const line of body) {
    const prev = out[out.length - 1];
    if (prev && line.startsWith("|") && prev[0].startsWith("|")) prev.push(line);
    else if (prev && line.startsWith("?= ") && prev[0].startsWith("?? ")) prev.push(line);
    else out.push([line]);
  }
  return out;
}

/**
 * Разрезать блоки подряд на экраны — как TeX разбивает абзац на строки:
 * каждый экран чего-то стоит (меньше экранов — лучше), недозаполненный —
 * дороже (без полупустых хвостов). Экран длиннее PAGE_LINES допустим, только
 * если в нём неделимый блок, который и сам больше экрана; к нему можно
 * приклеить мелочь до трети экрана, чтобы она не висела одна.
 */
function split<T>(items: T[], w: number[]): T[][] {
  const n = items.length;
  const PAGE = 3;
  const cost = (i: number, j: number): number => {
    let total = 0;
    let big = 0;
    for (let k = i; k < j; k++) {
      total += w[k];
      if (w[k] > PAGE_LINES) big = Math.max(big, w[k]);
    }
    if (total <= PAGE_LINES) return PAGE + ((PAGE_LINES - total) / PAGE_LINES) ** 2 * 10;
    if (j - i === 1) return PAGE;
    const rest = total - big;
    return big && rest <= PAGE_LINES / 3 ? PAGE + (rest / PAGE_LINES) * 5 : Infinity;
  };
  const best = new Array<number>(n + 1).fill(Infinity);
  const from = new Array<number>(n + 1).fill(0);
  best[0] = 0;
  for (let j = 1; j <= n; j++) {
    for (let i = 0; i < j; i++) {
      const value = best[i] + cost(i, j);
      if (value < best[j]) {
        best[j] = value;
        from[j] = i;
      }
    }
  }
  const out: T[][] = [];
  for (let j = n; j > 0; j = from[j]) out.unshift(items.slice(from[j], j));
  return out;
}

export function notePages(notes: string): NotePage[] {
  const sections: { heading: string | null; body: string[] }[] = [{ heading: null, body: [] }];
  for (const raw of notes.split("\n")) {
    const line = raw.trimEnd();
    if (!line.trim()) continue;
    if (line.startsWith("## ")) sections.push({ heading: line.slice(3).trim(), body: [] });
    else sections[sections.length - 1].body.push(line);
  }
  const pages: NotePage[] = [];
  for (const { heading, body } of sections) {
    if (!body.length) continue;
    const parts = blocks(body);
    const chunks = split(parts, parts.map(weight));
    chunks.forEach((chunk, i) =>
      pages.push({ heading, text: chunk.flat().join("\n"), piece: chunks.length > 1 ? `${i + 1}/${chunks.length}` : undefined }),
    );
  }
  return pages;
}
