/**
 * Учёт расхода ИИ по функциям — только счётчики за день: сколько вызовов и
 * токенов ушло на чат, планировщик, «ИИ-подготовку», челлендж.
 *
 * Зачем: ИИ — единственная статья расходов, растущая с числом людей, а
 * раньше её было видно только в кабинете OpenAI одной суммой. Здесь нет ни
 * пользователя, ни текста запроса — по записи нельзя понять, кто и о чём
 * спрашивал.
 */

export type AiFeature = "chat" | "planner" | "learning" | "challenge30" | "grade";

interface Usage {
  input_tokens?: number;
  output_tokens?: number;
}

/**
 * Записать вызов. Никогда не бросает и не задерживает ответ человеку:
 * потерянная строка статистики лучше, чем упавший из-за неё запрос.
 */
export function recordAiUsage(feature: AiFeature, usage: Usage | undefined): void {
  // В тестах базы нет, а .env разработчика может смотреть в боевую.
  if (process.env.NODE_ENV === "test") return;
  const input = Number(usage?.input_tokens) || 0;
  const output = Number(usage?.output_tokens) || 0;
  const day = new Date().toISOString().slice(0, 10);
  void import("@/lib/db")
    .then(({ prisma }) =>
      prisma.aiUsage.upsert({
        where: { day_feature: { day, feature } },
        create: { day, feature, calls: 1, inputTokens: input, outputTokens: output },
        update: { calls: { increment: 1 }, inputTokens: { increment: input }, outputTokens: { increment: output } },
      }),
    )
    .catch(() => {});
}
