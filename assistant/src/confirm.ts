import { transcribeWav } from "./openai.js";
import { say } from "./voice.js";

const NEGATIVE = /\b(нет|не\s+надо|не\s+нужно|не\s+делай|отмена|стоп|отставить)\b/i;
const POSITIVE = /\b(да|ага|угу|давай|конечно|подтвержда|точно|верно)\b/i;

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
