/**
 * Команды, которые выполняются БЕЗ обращения к GPT — экономия токенов и
 * задержки для простых, полностью детерминированных случаев. Проверяются
 * ДО runConversationTurn; если совпало — GPT в этот раз не вызывается
 * вообще, ни на распознавание намерения, ни на инструменты.
 *
 * Набор расширяется по мере того, какие конкретные команды реально
 * повторяются, а не гадаем заранее.
 */
import { rememberFact, getTodayStatus } from "./yeahgrind.js";

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
    return await describeTodayTasks();
  }

  return { handled: false };
}

async function describeTodayTasks(): Promise<QuickResult> {
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
      return { handled: true, reply: "На сегодня задач нет." };
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

    return { handled: true, reply: `${lead}${spoken}.${tail}` };
  } catch (e) {
    console.warn("[quickCommands] getTodayStatus не прошёл:", e instanceof Error ? e.message : e);
    return { handled: true, reply: "Не получилось получить задачи с YeahGrind, попробуй чуть позже." };
  }
}
