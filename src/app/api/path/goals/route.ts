/** GET — мои цели со сводкой; POST — новая цель: ИИ строит карту навыков и юниты. */
import { createGoal, listGoals, parseGoalInput } from "@/lib/path/service";
import { json, readBody, withUser } from "@/lib/path/http";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300;

export function GET() {
  return withUser(async (userId) => json({ goals: await listGoals(userId) }));
}

export function POST(req: Request) {
  return withUser(async (userId) => {
    const input = parseGoalInput(await readBody(req));
    return json({ id: await createGoal(userId, input) }, 201);
  }, true);
}
