import { speak } from "./openai.js";
import { playWav } from "./audio.js";

/** Озвучить текст и дождаться конца воспроизведения. */
export async function say(text: string): Promise<void> {
  console.log(`[ДиДи] ${text}`);
  const wav = await speak(text);
  await playWav(wav);
}
