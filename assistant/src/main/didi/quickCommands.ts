/**
 * Команды, которые выполняются БЕЗ обращения к GPT — экономия токенов и
 * задержки для простых, полностью детерминированных случаев. Проверяются
 * ДО runConversationTurn; если совпало — GPT в этот раз не вызывается
 * вообще, ни на распознавание намерения, ни на инструменты.
 *
 * Набор расширяется по мере того, какие конкретные команды реально
 * повторяются, а не гадаем заранее.
 */
import { rememberFact, getTodayStatus, addTodo, listDevices } from "./yeahgrind.js";
import { openApp, clickYandexWaveButton } from "./osControl.js";

interface QuickResult {
  handled: boolean;
  reply?: string;
  /** Команда обрывает текущий разговор — не тащить её и не тащиться самой в память следующего обращения. */
  resetHistory?: boolean;
}

function levenshtein(a: string, b: string): number {
  const dp: number[][] = Array.from({ length: a.length + 1 }, () => new Array(b.length + 1).fill(0));
  for (let i = 0; i <= a.length; i++) dp[i]![0] = i;
  for (let j = 0; j <= b.length; j++) dp[0]![j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      dp[i]![j] =
        a[i - 1] === b[j - 1]
          ? dp[i - 1]![j - 1]!
          : 1 + Math.min(dp[i - 1]![j]!, dp[i]![j - 1]!, dp[i - 1]![j - 1]!);
    }
  }
  return dp[a.length]![b.length]!;
}

/** Первое слово фразы достаточно близко к образцу — тот же допуск, что у кодового слова (2 правки). */
function firstWordMatches(text: string, sample: string, maxDistance = 1): boolean {
  const firstWord = text.trim().toLowerCase().split(/\s+/)[0] ?? "";
  return levenshtein(firstWord, sample) <= maxDistance;
}

const STOP_WORDS = ["стоп", "хватит", "отставить"];
const THANKS_WORDS = ["спасибо", "благодарю"];
const TIME_WORDS = ["который", "сколько"]; // "который час" / "сколько времени"
// "Гринд"/"грайнд" — Whisper слышит "Grind" по-разному; плюс обычные
// русские формулировки того же вопроса, необязательно с названием бренда.
const GRIND_RE = /гринд|грайнд|задачи на сегодня|план на сегодня|мои дела на сегодня/i;
const WAVE_RE = /мо(ю|я|ей)\s+волн|запусти\s+волну|включи\s+волну/i;
const DEVICES_RE = /список устройств|мои устройства|какие устройства|сколько.*устройств/i;

/** Склонение "устройство" под число — 1 устройство, 2-4 устройства, 5+ устройств. */
function pluralDevices(n: number): string {
  const m10 = n % 10;
  const m100 = n % 100;
  if (m10 === 1 && m100 !== 11) return "устройство";
  if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return "устройства";
  return "устройств";
}

/** "Список устройств" / "сколько у меня устройств" — читает вслух, на каких устройствах включены уведомления. */
async function describeDevices(): Promise<string> {
  try {
    const devices = await listDevices();
    const active = devices.filter((d) => d.enabled);
    if (active.length === 0) {
      return "Нет ни одного устройства с включёнными уведомлениями.";
    }
    const names = active.map((d) => d.label).join(", ");
    return `Уведомления включены на ${active.length} ${pluralDevices(active.length)}: ${names}.`;
  } catch (e) {
    console.warn("[quickCommands] listDevices не прошёл:", e instanceof Error ? e.message : e);
    return "Не получилось получить список устройств.";
  }
}

/**
 * Десктопное приложение Яндекс Музыки, не браузер — пробовали браузер
 * (Firefox), но там окно ненадёжно для автоматизации: одно и то же окно
 * может держать несколько вкладок, а поиск и подъём нужного окна в фокус
 * из фонового процесса ломался по-разному на каждом заходе (то заголовок
 * менялся при переключении вкладки, то клик попадал в другое окно того же
 * процесса). У десктоп-приложения своё отдельное окно/процесс — проверено
 * вживую дважды подряд, срабатывает надёжно. У приложения зарегистрирован
 * свой URI-протокол (HKCU\Software\Classes\yandexmusic, ведёт на
 * "...\YandexMusic\Яндекс Музыка.exe" "%1") — открываем/поднимаем им окно,
 * а реальный запуск воспроизведения — клик по плитке "Моя волна" (см.
 * osControl.ts::clickYandexWaveButton, сам URI трек не запускает). Клик —
 * в фоне, не блокирует быстрый голосовой ответ: приложению нужно время
 * отрисоваться после навигации по ссылке.
 */
async function runMyWave(): Promise<string> {
  const result = await openApp("yandexmusic://music.yandex.ru/my/wave");
  if (result.startsWith("Не получилось")) {
    return "Не получилось запустить Яндекс Музыку — проверь, что приложение установлено.";
  }
  void clickWaveAfterLaunch();
  return "Запускаю Мою волну.";
}

async function clickWaveAfterLaunch(): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 2000));
  try {
    await clickYandexWaveButton();
  } catch (e) {
    console.warn("[quickCommands] clickYandexWaveButton не прошёл:", e instanceof Error ? e.message : e);
  }
}

/**
 * "Запомни ..." / "Запомни про меня, что ..." — текст, идущий после
 * триггера и необязательных "про меня"/"что", целиком уходит в БД как
 * есть, без разбора GPT. Первое слово сверяется нечётко (та же логика,
 * что и для кодового слова), а не строго "запомни" — но обрезаем сам
 * префикс только в ожидаемых формах, остальное не трогаем.
 */
function extractRememberContent(text: string): string | null {
  const trimmed = text.trim();
  const firstWord = (trimmed.split(/\s+/)[0] ?? "").toLowerCase().replace(/[.,!?]+$/, "");
  if (levenshtein(firstWord, "запомни") > 1) return null;

  const rest = trimmed.slice(firstWord.length).trim();
  const content = rest.replace(/^(про\s+меня\s*)?[,:]?\s*(что\s+)?/i, "").trim();
  return content.length > 0 ? content : null;
}

/**
 * "Протокол <имя>" — именованный набор действий, выполняется целиком без
 * GPT (см. PROTOCOLS ниже). Первое слово сверяется нечётко, как и у
 * "запомни" — Whisper не всегда точен на редком слове.
 */
function extractProtocolName(text: string): string | null {
  const trimmed = text.trim();
  const firstWord = (trimmed.split(/\s+/)[0] ?? "").toLowerCase().replace(/[.,!?]+$/, "");
  if (levenshtein(firstWord, "протокол") > 2) return null;
  const rest = trimmed
    .slice(firstWord.length)
    .trim()
    .toLowerCase()
    .replace(/[.,!?]+$/, "");
  return rest.length > 0 ? rest : null;
}

/**
 * Именованные voice-макросы: одна команда запускает сразу несколько
 * действий подряд. Список расширяется по мере того, какие протоколы
 * реально нужны — как и остальные quick-команды, без обращения к GPT
 * (детерминированная последовательность, не рассуждение).
 */
const PROTOCOLS: Record<string, () => Promise<string>> = {
  пятница: runFridayProtocol,
};

function matchProtocol(name: string): (() => Promise<string>) | null {
  for (const key of Object.keys(PROTOCOLS)) {
    if (levenshtein(name, key) <= 2) return PROTOCOLS[key]!;
  }
  return null;
}

/**
 * VS Code + Яндекс Музыка (Моя волна) + отметка начала работы в YeahGrind
 * (задача "Начало работы" на текущий час — своего отдельного "таймера" в
 * YeahGrind ещё нет, это ближайший существующий эквивалент, который сразу
 * виден в браузере) + задачи на сегодня вслух.
 */
async function runFridayProtocol(): Promise<string> {
  const vscode = await openApp("Code");
  const music = await runMyWave();

  let workNote: string;
  try {
    await addTodo({ title: "Начало работы", hour: new Date().getHours() });
    workNote = "Отметила начало работы в YeahGrind.";
  } catch (e) {
    console.warn("[quickCommands] addTodo (протокол) не прошёл:", e instanceof Error ? e.message : e);
    workNote = "Не получилось отметить начало работы в YeahGrind.";
  }

  const tasks = await todayTasksSummary();
  return `Протокол «Пятница». ${vscode}. ${music}. ${workNote} ${tasks}`;
}

export async function tryQuickCommand(text: string): Promise<QuickResult> {
  if (STOP_WORDS.some((w) => firstWordMatches(text, w))) {
    return { handled: true, reply: "Остановился, сэр.", resetHistory: true };
  }

  const remember = extractRememberContent(text);
  if (remember !== null) {
    try {
      await rememberFact(remember);
      return { handled: true, reply: "Запомнила." };
    } catch (e) {
      console.warn("[quickCommands] rememberFact не прошёл:", e instanceof Error ? e.message : e);
      return { handled: true, reply: "Не получилось запомнить, попробуй ещё раз." };
    }
  }

  if (THANKS_WORDS.some((w) => firstWordMatches(text, w))) {
    return { handled: true, reply: "Всегда пожалуйста." };
  }

  if (TIME_WORDS.some((w) => firstWordMatches(text, w)) && /час|врем/i.test(text)) {
    const now = new Date();
    const hh = String(now.getHours()).padStart(2, "0");
    const mm = String(now.getMinutes()).padStart(2, "0");
    return { handled: true, reply: `Сейчас ${hh}:${mm}.` };
  }

  if (GRIND_RE.test(text)) {
    return { handled: true, reply: await todayTasksSummary() };
  }

  if (WAVE_RE.test(text)) {
    return { handled: true, reply: await runMyWave() };
  }

  if (DEVICES_RE.test(text)) {
    return { handled: true, reply: await describeDevices() };
  }

  const protocolName = extractProtocolName(text);
  if (protocolName !== null) {
    const protocol = matchProtocol(protocolName);
    if (protocol) {
      try {
        return { handled: true, reply: await protocol() };
      } catch (e) {
        console.warn("[quickCommands] протокол упал:", e instanceof Error ? e.message : e);
        return { handled: true, reply: "Протокол сорвался на середине, извини." };
      }
    }
    return {
      handled: true,
      reply: `Не знаю протокол «${protocolName}». Есть: ${Object.keys(PROTOCOLS).join(", ")}.`,
    };
  }

  return { handled: false };
}

/** Текст для голоса: задачи на сегодня (todos + план), просроченные — вперёд, готовые — отдельно посчитаны. */
export async function todayTasksSummary(): Promise<string> {
  try {
    const status = await getTodayStatus();
    const items = [
      ...status.todos
        .slice()
        .sort((a, b) => (a.hour ?? 99) - (b.hour ?? 99))
        .map((t) => ({ title: t.title, hour: t.hour, done: t.done })),
      ...status.plan.map((p) => ({ title: p.title, hour: null as number | null, done: p.completed })),
    ];

    if (items.length === 0) {
      return "На сегодня задач нет.";
    }

    const pending = items.filter((i) => !i.done);
    const doneCount = items.length - pending.length;
    const toSay = pending.length > 0 ? pending : items;
    const spoken = toSay.map((i) => (i.hour !== null ? `в ${i.hour} часов ${i.title}` : i.title)).join(", ");
    const lead =
      pending.length > 0
        ? `На сегодня осталось ${pending.length}: `
        : `Все ${items.length} задач на сегодня выполнены: `;
    const tail = doneCount > 0 && pending.length > 0 ? ` Ещё ${doneCount} уже закрыто.` : "";

    return `${lead}${spoken}.${tail}`;
  } catch (e) {
    console.warn("[quickCommands] getTodayStatus не прошёл:", e instanceof Error ? e.message : e);
    return "Не получилось получить задачи с YeahGrind, попробуй чуть позже.";
  }
}
