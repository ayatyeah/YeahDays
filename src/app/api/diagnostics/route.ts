import { NextResponse } from "next/server";
import { clientIp, rateLimit } from "@/lib/rateLimit";
import { recordSignal } from "@/lib/diagnostics";
export async function POST(req: Request) {
  if (!rateLimit(`diagnostics:${clientIp(req)}`, 30, 60000)) return new NextResponse(null, { status: 429 });
  const reader = req.body?.getReader();
  if (!reader) return new NextResponse(null, { status: 400 });
  let size = 0; const chunks: Uint8Array[] = [];
  try {
    for (;;) { const { done, value } = await reader.read(); if (done) break; size += value.length; if (size > 4096) { await reader.cancel(); return new NextResponse(null, { status: 413 }); } chunks.push(value); }
    const body = JSON.parse(Buffer.concat(chunks).toString("utf8"));
    if (!Array.isArray(body.events) || body.events.length > 10) return new NextResponse(null, { status: 400 });
    for (const event of body.events) await recordSignal(event, body.build);
    return new NextResponse(null, { status: 204 });
  } catch { return new NextResponse(null, { status: 400 }); }
}
