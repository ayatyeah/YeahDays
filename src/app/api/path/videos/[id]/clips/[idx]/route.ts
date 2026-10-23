/**
 * Озвучка одной сцены (WAV). Safari проигрывает звук только с ответами на
 * Range-запросы, поэтому отдаём и частичное содержимое (206).
 */
import { clipFor } from "@/lib/path/video";
import { PathError } from "@/lib/path/service";
import { withUser } from "@/lib/path/http";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
type Ctx = { params: Promise<{ id: string; idx: string }> };

export async function GET(req: Request, { params }: Ctx) {
  const { id, idx } = await params;
  return withUser(async (userId) => {
    const n = Number(idx);
    if (!Number.isInteger(n) || n < 0 || n > 20) throw new PathError("Клип не найден", 404);
    const { data, mime } = await clipFor(userId, id, n);
    const headers = { "Content-Type": mime, "Accept-Ranges": "bytes", "Cache-Control": "private, max-age=86400" };
    const range = /^bytes=(\d*)-(\d*)$/.exec(req.headers.get("range") ?? "");
    if (!range) return new Response(new Uint8Array(data), { headers: { ...headers, "Content-Length": String(data.length) } });
    let start = range[1] ? Number(range[1]) : data.length - Number(range[2]);
    let end = range[1] && range[2] ? Number(range[2]) : data.length - 1;
    start = Math.max(0, start);
    end = Math.min(data.length - 1, end);
    if (start > end) return new Response(null, { status: 416, headers: { ...headers, "Content-Range": `bytes */${data.length}` } });
    return new Response(new Uint8Array(data.subarray(start, end + 1)), { status: 206, headers: { ...headers, "Content-Range": `bytes ${start}-${end}/${data.length}`, "Content-Length": String(end - start + 1) } });
  });
}
