/**
 * Команды, которые выполняются БЕЗ обращения к GPT — экономия токенов и
 * задержки для простых, полностью детерминированных случаев. Проверяются
 * ДО runConversationTurn; если совпало — GPT в этот раз не вызывается
 * вообще, ни на распознавание намерения, ни на инструменты.
 *
 * Пока набор маленький и осознанно жёсткий (нечёткое сравнение только по
 * стартовому слову) — расширять по мере того, какие конкретные команды
 * реально повторяются, а не гадать заранее.
 */

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

export function tryQuickCommand(text: string): QuickResult {
  if (STOP_WORDS.some((w) => firstWordMatches(text, w))) {
    return { handled: true, reply: "Остановился, сэр.", resetHistory: true };
  }
  return { handled: false };
}
