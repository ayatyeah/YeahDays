/**
 * Команды, которые выполняются БЕЗ обращения к GPT — экономия токенов и
 * задержки для простых, полностью детерминированных случаев. Проверяются
 * ДО runConversationTurn; если совпало — GPT в этот раз не вызывается
 * вообще, ни на распознавание намерения, ни на инструменты.
 *
 * Набор расширяется по мере того, какие конкретные команды реально
 * повторяются, а не гадаем заранее.
 */
import { rememberFact, getTodayStatus, addTodo, setMood, listDevices } from "./yeahgrind.js";
import { openApp, clickYandexWaveButton, mediaControl } from "./osControl.js";
import { playSuitUpTheme } from "./audio.js";
import { suitUpMusicPath } from "./config.js";

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
 *
 * Имя — ровно ОДНО слово сразу после "протокол", не весь остаток фразы:
 * живой случай — сказали "Протокол утро. Протокол утро." (повторили на
 * всякий случай, не были уверены, что услышали) — со старой версией (брала
 * всё до конца строки) имя протокола получилось "утро. протокол утро",
 * которое не совпало ни с одним ключом в PROTOCOLS.
 */
function extractProtocolName(text: string): string | null {
  const words = text.trim().split(/\s+/);
  const firstWord = (words[0] ?? "").toLowerCase().replace(/[.,!?]+$/, "");
  if (levenshtein(firstWord, "протокол") > 2) return null;
  const second = (words[1] ?? "").toLowerCase().replace(/[.,!?]+$/, "");
  return second.length > 0 ? second : null;
}

/**
 * Именованные voice-макросы: одна команда запускает сразу несколько
 * действий подряд. Список расширяется по мере того, какие протоколы
 * реально нужны — как и остальные quick-команды, без обращения к GPT
 * (детерминированная последовательность, не рассуждение).
 */
const PROTOCOLS: Record<string, () => Promise<string>> = {
  пятница: runFridayProtocol,
  утро: runMorningProtocol,
  фокус: runFocusProtocol,
  тренировка: runWorkoutProtocol,
  отбой: runWindDownProtocol,
  обед: runLunchProtocol,
  встреча: runMeetingProtocol,
  отдых: runRelaxProtocol,
  спринт: runSprintProtocol,
  финиш: runFinishProtocol,
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

/** Начало дня без привязки к рабочим инструментам — в отличие от «Пятницы», не трогает VS Code/музыку. */
async function runMorningProtocol(): Promise<string> {
  let moodNote: string;
  try {
    await setMood("medium", 30);
    moodNote = "Отметила бодрое утро.";
  } catch (e) {
    console.warn("[quickCommands] setMood (протокол утро) не прошёл:", e instanceof Error ? e.message : e);
    moodNote = "Настроение отметить не получилось.";
  }
  let workNote: string;
  try {
    await addTodo({ title: "Начало дня", hour: new Date().getHours() });
    workNote = "Отметила начало дня.";
  } catch (e) {
    console.warn("[quickCommands] addTodo (протокол утро) не прошёл:", e instanceof Error ? e.message : e);
    workNote = "Не получилось отметить начало дня.";
  }
  const tasks = await todayTasksSummary();
  return `Протокол «Утро». ${moodNote} ${workNote} ${tasks}`;
}

/** Глубокая работа: глушим звук, поднимаем редактор, ставим таймированную сессию. */
async function runFocusProtocol(): Promise<string> {
  const muteNote = await mediaControl("mute").catch(() => "Не получилось приглушить звук.");
  const vscode = await openApp("Code");
  let taskNote: string;
  try {
    await addTodo({ title: "Фокус-сессия", hour: new Date().getHours(), duration: 50 });
    taskNote = "Поставила фокус-сессию на 50 минут.";
  } catch (e) {
    console.warn("[quickCommands] addTodo (протокол фокус) не прошёл:", e instanceof Error ? e.message : e);
    taskNote = "Не получилось поставить фокус-сессию.";
  }
  return `Протокол «Фокус». ${muteNote}. ${vscode}. ${taskNote}`;
}

/** Энергичная музыка + высокий приоритет — тренировка не должна теряться среди обычных задач. */
async function runWorkoutProtocol(): Promise<string> {
  const music = await runMyWave();
  let moodNote: string;
  try {
    await setMood("high", 30);
    moodNote = "Настроение — на максимум.";
  } catch (e) {
    console.warn("[quickCommands] setMood (протокол тренировка) не прошёл:", e instanceof Error ? e.message : e);
    moodNote = "Настроение отметить не получилось.";
  }
  let taskNote: string;
  try {
    await addTodo({ title: "Тренировка", hour: new Date().getHours(), duration: 45, priority: "high" });
    taskNote = "Записала тренировку.";
  } catch (e) {
    console.warn("[quickCommands] addTodo (протокол тренировка) не прошёл:", e instanceof Error ? e.message : e);
    taskNote = "Не получилось записать тренировку.";
  }
  return `Протокол «Тренировка». ${music}. ${moodNote} ${taskNote}`;
}

/** Конец дня: тише звук, итог по задачам, настроение на низкий тонус — для сна, не для бодрости. */
async function runWindDownProtocol(): Promise<string> {
  await mediaControl("volume_down", 6).catch(() => undefined);
  const tasks = await todayTasksSummary();
  let moodNote: string;
  try {
    await setMood("low", 0);
    moodNote = "Отметила спокойный вечер.";
  } catch (e) {
    console.warn("[quickCommands] setMood (протокол отбой) не прошёл:", e instanceof Error ? e.message : e);
    moodNote = "";
  }
  return `Протокол «Отбой». Убавила громкость. ${tasks} ${moodNote} Спокойной ночи.`;
}

/** Перерыв на обед — отмечает паузу и сразу говорит, что ждёт после неё. */
async function runLunchProtocol(): Promise<string> {
  let taskNote: string;
  try {
    await addTodo({ title: "Обед", hour: new Date().getHours(), duration: 30 });
    taskNote = "Отметила обеденный перерыв.";
  } catch (e) {
    console.warn("[quickCommands] addTodo (протокол обед) не прошёл:", e instanceof Error ? e.message : e);
    taskNote = "Не получилось отметить перерыв.";
  }
  const tasks = await todayTasksSummary();
  return `Протокол «Обед». ${taskNote} Приятного аппетита. После перерыва: ${tasks}`;
}

/** Перед созвоном — глушим звук и отмечаем встречу в плане. */
async function runMeetingProtocol(): Promise<string> {
  const muteNote = await mediaControl("mute").catch(() => "Не получилось приглушить звук.");
  let taskNote: string;
  try {
    await addTodo({ title: "Встреча", hour: new Date().getHours(), duration: 30 });
    taskNote = "Отметила встречу.";
  } catch (e) {
    console.warn("[quickCommands] addTodo (протокол встреча) не прошёл:", e instanceof Error ? e.message : e);
    taskNote = "Не получилось отметить встречу.";
  }
  return `Протокол «Встреча». ${muteNote}. ${taskNote} Удачи.`;
}

/** Игра/отдых — никаких рабочих напоминаний вслух, только отметка в план. */
async function runRelaxProtocol(): Promise<string> {
  const steam = await openApp("steam://open/main");
  let taskNote: string;
  try {
    await addTodo({ title: "Отдых", hour: new Date().getHours() });
    taskNote = "Отметила время отдыха.";
  } catch (e) {
    console.warn("[quickCommands] addTodo (протокол отдых) не прошёл:", e instanceof Error ? e.message : e);
    taskNote = "";
  }
  return `Протокол «Отдых». ${steam}. ${taskNote} Отдыхай на здоровье.`;
}

/** Долгая сессия под высоким приоритетом — тяжелее «Фокуса»: длиннее и с приглушённым звуком сразу. */
async function runSprintProtocol(): Promise<string> {
  const vscode = await openApp("Code");
  await mediaControl("mute").catch(() => undefined);
  let taskNote: string;
  try {
    await addTodo({ title: "Спринт", hour: new Date().getHours(), duration: 90, priority: "high" });
    taskNote = "Поставила спринт на полтора часа.";
  } catch (e) {
    console.warn("[quickCommands] addTodo (протокол спринт) не прошёл:", e instanceof Error ? e.message : e);
    taskNote = "Не получилось поставить спринт.";
  }
  return `Протокол «Спринт». ${vscode}. Звук приглушила. ${taskNote} Погнали.`;
}

/** Итог дня — без новых действий, только честная сводка по закрытым задачам. */
async function runFinishProtocol(): Promise<string> {
  try {
    const status = await getTodayStatus();
    const items = [...status.todos.map((t) => t.done), ...status.plan.map((p) => p.completed)];
    const total = items.length;
    const done = items.filter(Boolean).length;
    const closing =
      total === 0
        ? "Сегодня без задач — тоже нормально."
        : done === total
          ? `Все ${total} закрыты. Чистый день.`
          : `Закрыто ${done} из ${total}.`;
    return `Протокол «Финиш». ${closing} До завтра.`;
  } catch (e) {
    console.warn("[quickCommands] getTodayStatus (протокол финиш) не прошёл:", e instanceof Error ? e.message : e);
    return "Протокол «Финиш». Не получилось подвести итог дня, но день всё равно закончен. До завтра.";
  }
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
      // Iron Man vibe: музыка стартует сразу и играет фоном, пока протокол
      // выполняет свои шаги и отвечает голосом — не блокирует и не ждёт.
      playSuitUpTheme(suitUpMusicPath);
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
