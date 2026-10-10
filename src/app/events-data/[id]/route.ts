import { gzipSync } from "node:zlib";
import { EVENTS, findEvent } from "@/lib/events";

/**
 * Содержимое ивента как статический JSON — собирается при сборке для каждого
 * ивента (lib/events/client.ts грузит его в браузере).
 *
 * Почему не JS-чанк: контент — это мегабайты строк, и как модуль браузер его
 * разбирает и компилирует; JSON.parse того же объёма в разы быстрее, а на
 * телефоне это сотни миллисекунд при каждом открытии ивента.
 */
export const dynamic = "force-static";

export function generateStaticParams() {
  return EVENTS.map((e) => ({ id: e.id }));
}

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const event = findEvent((await params).id);
  if (!event) return new Response("Not found", { status: 404 });
  // Сжимаем сами: готовые ответы обработчиков Next отдаёт без сжатия, а
  // это ~2 МБ на Cloud против ~0,5 МБ в gzip. gzip понимают все браузеры.
  return new Response(gzipSync(JSON.stringify(event)), {
    headers: { "Content-Type": "application/json; charset=utf-8", "Content-Encoding": "gzip" },
  });
}
