import "dotenv/config";

/**
 * Все обязательные переменные проверяются на старте — лучше упасть сразу
 * с понятной ошибкой, чем на первом голосовом запросе через полминуты.
 */
function required(name: string): string {
  const v = process.env[name];
  if (!v) {
    throw new Error(
      `Не задана переменная окружения ${name}. Смотри assistant/.env.example.`,
    );
  }
  return v;
}

export const config = {
  openaiApiKey: required("OPENAI_API_KEY"),
  chatModel: process.env.OPENAI_CHAT_MODEL ?? "gpt-5.5",
  transcribeModel: process.env.OPENAI_TRANSCRIBE_MODEL ?? "gpt-4o-mini-transcribe",
  ttsModel: process.env.OPENAI_TTS_MODEL ?? "gpt-4o-mini-tts",
  ttsVoice: process.env.OPENAI_TTS_VOICE ?? "alloy",

  yeahgrindBaseUrl: (process.env.YEAHGRIND_BASE_URL ?? "http://localhost:3000").replace(
    /\/+$/,
    "",
  ),
  yeahgrindUserId: required("YEAHGRIND_USER_ID"),
  assistantSecret: required("ASSISTANT_SECRET"),

  /** каталог микрофона (см. `npm run devices` из pvrecorder) — -1: системный по умолчанию */
  audioDeviceIndex: Number(process.env.AUDIO_DEVICE_INDEX ?? "-1"),

  /** лог всех выполненных OS-команд и удалений — для аудита задним числом */
  logFile: process.env.DIDI_LOG_FILE ?? "didi-actions.log",
};
