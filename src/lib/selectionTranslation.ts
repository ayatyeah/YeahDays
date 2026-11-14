/** Public translation API; runs in the reader's browser, never through Gemini. */
const cache = new Map<string, { text: string; expires: number }>();
const DAY = 24 * 60 * 60 * 1000;

export async function translateSelection(text: string, language: string, signal?: AbortSignal): Promise<string> {
  const source = language.toLowerCase().split('-')[0];
  const target = source === 'ru' ? 'en' : 'ru';
  if (!text.trim()) throw new Error('Select a word or phrase first.');
  if (new TextEncoder().encode(text).length > 500) throw new Error('This passage is too long. Select a word or short phrase.');
  const from = ['ru', 'en', 'kk', 'de', 'fr', 'es', 'it', 'tr', 'zh'].includes(source) ? source : 'en';
  const key = `${from}>${target}:${text}`;
  const cached = cache.get(key);
  if (cached && cached.expires > Date.now()) return cached.text;
  const params = new URLSearchParams({ q: text, langpair: `${from}|${target}` });
  const response = await fetch(`https://api.mymemory.translated.net/get?${params}`, {
    credentials: 'omit', referrerPolicy: 'no-referrer',
    signal: signal ? AbortSignal.any([signal, AbortSignal.timeout(12000)]) : AbortSignal.timeout(12000),
  });
  if (response.status === 429) throw new Error('The translation limit has been reached. Please try again later.');
  if (!response.ok) throw new Error('Translation is temporarily unavailable. Please try again.');
  const body = await response.json();
  if (body.quotaFinished || Number(body.responseStatus) === 429 || Number(body.responseStatus) === 403) throw new Error('The translation limit has been reached. Please try again later.');
  if (Number(body.responseStatus) !== 200 || typeof body.responseData?.translatedText !== 'string' || !body.responseData.translatedText.trim()) throw new Error('This passage could not be translated. Please try again.');
  const entities: Record<string, string> = { amp: '&', quot: '"', apos: "'", lt: '<', gt: '>' };
  const decode = (value: string): string => value.replace(/&(#x[0-9a-f]+|#\d+|amp|quot|apos|lt|gt);/gi, (all: string, code: string) => {
    if (!code.startsWith('#')) return entities[code.toLowerCase()] || all;
    const n = code[1].toLowerCase() === 'x' ? parseInt(code.slice(2), 16) : Number(code.slice(1));
    return n > 0 && n <= 0x10ffff ? String.fromCodePoint(n) : all;
  });
  const normalize = (value: string) => value.normalize('NFKC').toLowerCase().replace(/\s+/g, ' ').replace(/^[\s\p{P}]+|[\s\p{P}]+$/gu, '');
  const original = normalize(text);
  const isTranslation = (value: string) => (target === 'en' ? /[a-z]/i.test(value) && !/[а-яё]/i.test(value) : /[а-яё]/i.test(value)) && normalize(value) !== original;
  let translated = decode(body.responseData.translatedText);
  // MyMemory can rank an untranslated memory entry above its actual translation.
  // Accept an alternative only for the same whole phrase, never a fuzzy neighbour.
  if (!isTranslation(translated)) {
    const matches = (Array.isArray(body.matches) ? body.matches : []) as { segment?: unknown; translation?: unknown; match?: unknown }[];
    const alternative = matches.filter((match) => typeof match.segment === 'string' && normalize(decode(match.segment)) === original && typeof match.translation === 'string' && Number(match.match) >= 0.75 && isTranslation(decode(match.translation)))
      .sort((a, b) => Number(b.match) - Number(a.match))[0];
    if (!alternative || typeof alternative.translation !== 'string') throw new Error(`No ${target === 'en' ? 'English' : 'Russian'} translation was found. Try a fuller phrase.`);
    translated = decode(alternative.translation);
  }
  if (cache.size >= 200) cache.delete(cache.keys().next().value!);
  cache.set(key, { text: translated, expires: Date.now() + DAY });
  return translated;
}
