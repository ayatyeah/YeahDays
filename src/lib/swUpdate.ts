/**
 * Что делать, когда браузер скачал новый service worker.
 *
 * Версия воркера — id сборки в его адресе (`/sw.js?v=<commit>`, см.
 * next.config). Раньше плашку «Обновить» показывал любой ожидающий воркер,
 * а «Позже» жило до закрытия страницы. iPhone почти не закрывает PWA
 * насовсем, ожидающий воркер так и висел — и плашка встречала человека на
 * каждом запуске, хотя ничего нового он не получал.
 *
 * Теперь:
 *  - та же сборка, что уже работает, — ничего не объявляем (ignore);
 *  - обновление ждало к запуску, а человек ещё ничего не нажал, — тихо
 *    применяем (apply): страница перезагрузится на старте, это незаметно;
 *  - новая версия пришла посреди работы — показываем «Обновить» (announce):
 *    перезагрузка под руками сбила бы набранный текст.
 */

export type UpdateAction = "ignore" | "apply" | "announce";

/** Id сборки из адреса воркера; null — если адреса нет или в нём нет ?v=. */
export function swVersion(scriptURL: string | null | undefined): string | null {
  if (!scriptURL) return null;
  try {
    return new URL(scriptURL).searchParams.get("v");
  } catch {
    return null;
  }
}

export function decideUpdate({ active, waiting, fresh }: { active: string | null | undefined; waiting: string | null | undefined; fresh: boolean }): UpdateAction {
  const was = swVersion(active);
  const next = swVersion(waiting);
  if (!waiting) return "ignore";
  // нечего обновлять: та же сборка (или первая установка — её подхватит сам браузер)
  if (!active || (was !== null && was === next)) return "ignore";
  return fresh ? "apply" : "announce";
}
