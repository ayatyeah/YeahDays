/** GET ?code= — что за цель по приглашению; POST { code } или { postId } — присоединиться. */
import { join, joinPreview, joinViaShare, PathError } from "@/lib/path/service";
import { json, readBody, withUser } from "@/lib/path/http";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export function GET(req: Request) {
  return withUser(async () => json(await joinPreview(new URL(req.url).searchParams.get("code") ?? "")));
}

export function POST(req: Request) {
  return withUser(async (userId) => {
    const body = await readBody(req, 2000);
    if (typeof body.code === "string" && body.code) return json({ goalId: await join(userId, body.code) });
    if (typeof body.postId === "string" && body.postId) return json({ goalId: (await joinViaShare(userId, body.postId)).goalId });
    throw new PathError("Нет приглашения", 422);
  }, true);
}
