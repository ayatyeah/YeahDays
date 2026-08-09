import { transcribeWav } from "./openai.js";
import { say } from "./voice.js";

/**
 * \b — граница ASCII \w, кириллица в \w не входит: /\bда\b/.test("да") ===
 * false ВСЕГДА (проверено вживую на живом тесте — подтверждение отвечало
 * "отменено" даже на явное "да"). Вместо \b — lookbehind/lookahead против
 * букв кириллицы и латиницы, ведёт себя как настоящая граница слова и для
 * кириллицы тоже. Экспортируются — тот же критерий да/нет использует
 * текстовый чат (chat.ts).
 */
export const NEGATIVE = /(?<![а-яёa-z])(нет|не\s+надо|не\s+нужно|не\s+делай|отмена|стоп|отставить)(?![а-яёa-z])/i;
export const POSITIVE = /(?<![а-яёa-z])(да|ага|угу|давай|конечно|подтвержда|точно|верно)(?![а-яёa-z])/i;

/**
 * Голосовое подтверждение перед необратимым действием. По умолчанию — отказ:
 * если ответ неразборчив или неоднозначен, действие НЕ выполняется. Ложное
 * "нет" стоит переспросить; ложное "да" может стоить файла.
 */
export async function confirmVoice(
  question: string,
  recordCommand: () => Promise<Buffer>,
): Promise<boolean> {
  await say(`${question} Скажи да или нет.`);
  const wav = await recordCommand();
  const text = (await transcribeWav(wav)).toLowerCase();
  console.log(`[confirm] услышал: "${text}"`);
  if (NEGATIVE.test(text)) return false;
  if (POSITIVE.test(text)) return true;
  return false;
}
