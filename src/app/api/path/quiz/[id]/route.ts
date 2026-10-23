/** POST answer — ответ на текущий вопрос (идемпотентно по key); POST hint — следующая подсказка. */
import { answer, hint } from "@/lib/path/quiz";
import { PathError } from "@/lib/path/service";
import { json, readBody, withUser } from "@/lib/path/http";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 120;
type Ctx = { params: Promise<{ id: string }> };

export async function POST(req: Request, { params }: Ctx) {
  const { id } = await params;
  return withUser(async (userId) => {
    const body = await readBody(req, 20_000);
    if (body.action === "answer") return json(await answer(userId, id, body));
    if (body.action === "hint") return json(await hint(userId, id, body.questionId));
    throw new PathError("Неизвестное действие", 422);
  }, true);
}
