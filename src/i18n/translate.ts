/**
 * Перевод строки интерфейса по словарю «русский текст → перевод».
 *
 * Словарь ключуется самой русской строкой, поэтому компоненты остаются
 * нетронутыми, а непереведённое просто остаётся по-русски — пустого места
 * или ключа вида `settings.title` человек не увидит никогда.
 *
 * Ключи с {0}, {1} — образцы для строк с подставленными значениями
 * («Осталось 3 дн.»): значение вырезается, фраза переводится, значение
 * возвращается на место (и само переводится, если оно есть в словаре).
 */

export type Dictionary = Record<string, string>;
export type Translate = (text: string) => string | null;

const CYRILLIC = /[А-Яа-яЁё]/;
const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export function createTranslator(dictionary: Dictionary): Translate {
  const patterns = Object.keys(dictionary)
    .filter((key) => /\{\d\}/.test(key))
    // Образец из одних подстановок («{0} {1}») совпадал бы с чем угодно.
    .filter((key) => CYRILLIC.test(key.replace(/\{\d\}/g, "")))
    .map((key) => ({
      re: new RegExp("^" + escape(key).replace(/\\\{\d\\\}/g, "(.+?)") + "$"),
      slots: [...key.matchAll(/\{(\d)\}/g)].map((m) => Number(m[1])),
      to: dictionary[key],
      // Чем больше в образце собственного текста, тем он точнее — проверяем первым.
      weight: key.replace(/\{\d\}/g, "").length,
    }))
    .sort((a, b) => b.weight - a.weight);
  const cache = new Map<string, string | null>();

  function core(text: string): string | null {
    const exact = dictionary[text];
    if (exact) return exact;
    for (const pattern of patterns) {
      const match = pattern.re.exec(text);
      if (!match) continue;
      const values: Record<number, string> = {};
      pattern.slots.forEach((slot, i) => {
        values[slot] = match[i + 1];
      });
      return pattern.to.replace(/\{(\d)\}/g, (_, n) => {
        const value = values[Number(n)] ?? "";
        return (CYRILLIC.test(value) ? core(value) : null) ?? value;
      });
    }
    return null;
  }

  return (text) => {
    if (!CYRILLIC.test(text)) return null;
    const cached = cache.get(text);
    if (cached !== undefined) return cached;
    // Пробелы по краям — часть вёрстки («Вопрос » + число): сохраняем их.
    const [, lead, body, tail] = /^(\s*)([\s\S]*?)(\s*)$/.exec(text)!;
    const translated = core(body.replace(/\s+/g, " "));
    const result = translated === null ? null : lead + translated + tail;
    if (cache.size < 5000) cache.set(text, result);
    return result;
  };
}
