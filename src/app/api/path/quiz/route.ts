/** POST — начать (или продолжить) проверку: стартовый тест, юнит или повторение. */
import { startQuiz } from "@/lib/path/quiz";
import { json, readBody, withUser } from "@/lib/path/http";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export function POST(req: Request) {
  return withUser(async (userId) => {
    const body = await readBody(req, 4000);
    return json(await startQuiz(userId, typeof body.goalId === "string" ? body.goalId : "", body));
  }, true);
}
