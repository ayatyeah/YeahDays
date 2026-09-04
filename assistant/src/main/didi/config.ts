import dotenv from "dotenv";
import path from "node:path";
// Именованный импорт из "electron" ломает статический разбор экспортов у
// ESM-загрузчика Node (electron — синтетический модуль, не обычный CJS-
// файл на диске) — падает ещё на связывании модулей, до всякого кода.
// Дефолтный импорт + деструктуризация в рантайме обходит это.
import electron from "electron";
const { app } = electron;

/**
 * В CLI-версии .env лежал рядом с package.json и грузился неявно
 * (`import "dotenv/config"`). Теперь это Electron-приложение — рабочая
 * директория установленного .exe не гарантирована и часто не для записи
 * (Program Files), поэтому конфиг для УСТАНОВЛЕННОЙ версии живёт в
 * userData (обычно %APPDATA%/ДиДи) — там же его редактирует Settings-панель.
 * В dev-режиме (npm run dev, не упаковано) читаем assistant/.env как раньше,
 * чтобы не заставлять переносить уже заполненный файл.
 */
export const envPath = app.isPackaged
  ? path.join(app.getPath("userData"), ".env")
  : path.join(process.cwd(), ".env");

dotenv.config({ path: envPath });

/**
 * Музыка для протоколов ("Протокол Пятница" и т.д., см. quickCommands.ts) —
 * авторский трек, не наш, поэтому НЕ лежит в репозитории и НЕ пакуется в
 * инсталлятор (electron-builder.yml не содержит его в extraResources) —
 * иначе публичный .exe на GitHub Releases распространял бы чужую музыку.
 * Файл кладётся вручную рядом с .env: assets/suit-up.mp3 в dev-режиме,
 * userData/suit-up.mp3 в собранном приложении. Нет файла — протокол просто
 * промолчит музыкой, остальное отработает как обычно (см. audio.ts::playSuitUpTheme).
 */
export const suitUpMusicPath = app.isPackaged
  ? path.join(app.getPath("userData"), "suit-up.mp3")
  : path.join(process.cwd(), "assets", "suit-up.mp3");

function optional(name: string): string {
  return (process.env[name] ?? "").trim();
}

export const config = {
  openaiApiKey: optional("OPENAI_API_KEY"),
  // gpt-5-mini: сильнее gpt-4.1-mini на reasoning-бенчмарках (AIME, GPQA,
  // HMMT, Humanity's Last Exam) и empirически подтверждён рабочим с
  // web_search в Responses API (см. openai.ts::chatStep) — прежний выбор
  // gpt-4.1-mini был основан на неполном списке моделей из доков, реальный
  // прямой вызов API это опроверг.
  chatModel: process.env.OPENAI_CHAT_MODEL ?? "gpt-5-mini",
  transcribeModel: process.env.OPENAI_TRANSCRIBE_MODEL ?? "gpt-4o-mini-transcribe",
  ttsModel: process.env.OPENAI_TTS_MODEL ?? "gpt-4o-mini-tts",
  // shimmer — женский голос у OpenAI TTS, мягче/тише nova (та описана как
  // "яркий, живой" — на живом тесте оказалась жёстче, чем нужно):
  // https://platform.openai.com/docs/guides/text-to-speech
  ttsVoice: process.env.OPENAI_TTS_VOICE ?? "shimmer",

  yeahgrindBaseUrl: (process.env.YEAHGRIND_BASE_URL || "http://localhost:3000").replace(/\/+$/, ""),
  yeahgrindUserId: optional("YEAHGRIND_USER_ID"),
  assistantSecret: optional("ASSISTANT_SECRET"),

  /** каталог микрофона (см. вкладку "Настройки" в приложении) — -1: системный по умолчанию */
  audioDeviceIndex: Number(process.env.AUDIO_DEVICE_INDEX ?? "-1"),

  /** лог всех выполненных OS-команд и удалений — для аудита задним числом */
  logFile: process.env.DIDI_LOG_FILE ?? "didi-actions.log",

  envPath,
};

/** Минимум, без которого голосовой цикл и связь с YeahGrind не имеют смысла запускать. */
export function isConfigured(): boolean {
  return !!(config.openaiApiKey && config.yeahgrindUserId && config.assistantSecret);
}
