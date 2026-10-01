import { Fragment, type ReactNode } from "react";

/** **жирный** и *курсив* внутри строки; остальное — как есть. */
function inline(text: string): ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g).map((piece, i) => {
    if (piece.startsWith("**") && piece.endsWith("**")) return <strong key={i}>{piece.slice(2, -2)}</strong>;
    if (piece.startsWith("*") && piece.endsWith("*") && piece.length > 2) return <em key={i}>{piece.slice(1, -1)}</em>;
    return <Fragment key={i}>{piece}</Fragment>;
  });
}

/**
 * Конспект части лекции.
 *
 * Разметка намеренно крошечная («## » заголовок, «- » пункт, «> » главная
 * мысль, «= » поисковый запрос): конспекты пишутся прямо в коде на двух
 * языках, и полноценный Markdown-парсер ради пяти видов строк — лишняя
 * зависимость в бандле.
 */
export default function EventNotes({ text, lang }: { text: string; lang: string }) {
  const blocks: ReactNode[] = [];
  let list: string[] = [];
  const flush = () => {
    if (!list.length) return;
    blocks.push(
      <ul key={`l${blocks.length}`} className="list-disc space-y-2 pl-5">
        {list.map((item, i) => <li key={i}>{inline(item)}</li>)}
      </ul>,
    );
    list = [];
  };

  for (const line of text.split("\n")) {
    if (line.startsWith("- ")) {
      list.push(line.slice(2));
      continue;
    }
    flush();
    const key = blocks.length;
    if (line.startsWith("## ")) blocks.push(<h3 key={key} className="pt-3 text-lg font-bold">{line.slice(3)}</h3>);
    else if (line.startsWith("> ")) blocks.push(<blockquote key={key} className="rounded-2xl border-l-4 border-violet-400 bg-violet-500/10 px-4 py-3 font-medium">{inline(line.slice(2))}</blockquote>);
    else if (line.startsWith("= ")) blocks.push(<pre key={key} className="whitespace-pre-wrap break-words rounded-2xl bg-[var(--color-surface-2)] px-4 py-3 font-mono text-[13px]">{line.slice(2)}</pre>);
    else if (line.trim()) blocks.push(<p key={key}>{inline(line)}</p>);
  }
  flush();

  return <div lang={lang} className="space-y-3 text-[15px] leading-relaxed">{blocks}</div>;
}
