import { Fragment, type ReactNode } from "react";
import CheckQuestion from "@/components/events/CheckQuestion";
import NotesDemo from "@/components/events/NotesDemo";
import NotesDiagram from "@/components/events/NotesDiagram";
import NotesImage from "@/components/events/NotesImage";

/** **жирный** и *курсив* внутри строки; остальное — как есть. */
export function inline(text: string): ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g).map((piece, i) => {
    if (piece.startsWith("**") && piece.endsWith("**")) return <strong key={i}>{piece.slice(2, -2)}</strong>;
    if (piece.startsWith("*") && piece.endsWith("*") && piece.length > 2) return <em key={i}>{piece.slice(1, -1)}</em>;
    return <Fragment key={i}>{piece}</Fragment>;
  });
}

/** Строка таблицы «| a | b |» → ячейки. */
const cells = (line: string) => line.trim().replace(/^\||\|$/g, "").split("|").map((c) => c.trim());
const isRule = (line: string) => /^\|[\s\-:|]+\|$/.test(line.trim());

/**
 * Конспект части лекции.
 *
 * Разметка намеренно крошечная: конспекты пишутся прямо в коде на двух
 * языках, и полноценный Markdown-парсер ради десятка видов строк — лишняя
 * зависимость в бандле. Виды строк:
 * - «## » заголовок, «- » пункт, «> » главная мысль, «= » команда или пример;
 * - «| a | b |» строка таблицы (первая — шапка, «|---|» пропускается);
 * - «@diagram имя» схема, «@demo имя» интерактивная демонстрация;
 * - «![подпись](/путь.webp)» иллюстрация;
 * - «?? вопрос» и следом «?= ответ» — вопрос для самопроверки.
 */
export default function EventNotes({ text, lang }: { text: string; lang: string }) {
  const blocks: ReactNode[] = [];
  let list: string[] = [];
  let table: string[][] = [];
  let question: string | null = null;

  const flushList = () => {
    if (!list.length) return;
    blocks.push(
      <ul key={`l${blocks.length}`} className="list-disc space-y-2 pl-5">
        {list.map((item, i) => <li key={i}>{inline(item)}</li>)}
      </ul>,
    );
    list = [];
  };
  const flushTable = () => {
    if (!table.length) return;
    const [head, ...rows] = table;
    blocks.push(
      <div key={`t${blocks.length}`} className="-mx-1 overflow-x-auto">
        <table className="w-full border-collapse text-[14px]">
          <thead>
            <tr>{head.map((h, i) => <th key={i} className="border-b-2 border-[var(--color-border-strong)] px-2 py-2 text-left font-semibold">{inline(h)}</th>)}</tr>
          </thead>
          <tbody>
            {rows.map((row, r) => (
              <tr key={r} className="odd:bg-[var(--color-surface-2)]/60">
                {row.map((c, i) => <td key={i} className="border-b border-[var(--color-border)] px-2 py-2 align-top">{inline(c)}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>,
    );
    table = [];
  };

  for (const line of text.split("\n")) {
    if (line.startsWith("- ")) { flushTable(); list.push(line.slice(2)); continue; }
    if (line.startsWith("|")) { flushList(); if (!isRule(line)) table.push(cells(line)); continue; }
    flushList();
    flushTable();
    const key = blocks.length;
    if (line.startsWith("?? ")) { question = line.slice(3); continue; }
    if (line.startsWith("?= ")) {
      if (question) blocks.push(<CheckQuestion key={key} question={question} answer={line.slice(3)} lang={lang} />);
      question = null;
      continue;
    }
    if (line.startsWith("## ")) blocks.push(<h3 key={key} className="pt-3 text-lg font-bold">{line.slice(3)}</h3>);
    else if (line.startsWith("> ")) blocks.push(<blockquote key={key} className="rounded-2xl border-l-4 border-violet-400 bg-violet-500/10 px-4 py-3 font-medium">{inline(line.slice(2))}</blockquote>);
    else if (line.startsWith("= ")) blocks.push(<pre key={key} className="whitespace-pre-wrap break-words rounded-2xl bg-[var(--color-surface-2)] px-4 py-3 font-mono text-[13px]">{line.slice(2)}</pre>);
    else if (line.startsWith("@diagram ")) blocks.push(<NotesDiagram key={key} name={line.slice(9).trim()} lang={lang} />);
    else if (line.startsWith("@demo ")) blocks.push(<NotesDemo key={key} name={line.slice(6).trim()} lang={lang} />);
    else if (line.startsWith("![")) {
      const m = /^!\[([^\]]*)\]\(([^)]+)\)/.exec(line);
      if (m) blocks.push(<NotesImage key={key} alt={m[1]} src={m[2]} />);
    }
    else if (line.trim()) blocks.push(<p key={key}>{inline(line)}</p>);
  }
  flushList();
  flushTable();

  return <div lang={lang} className="space-y-3 text-[15px] leading-relaxed">{blocks}</div>;
}
