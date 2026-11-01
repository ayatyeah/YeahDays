import { prisma } from "./db";
import { safeSignal } from "./diagnosticsSchema";
import { rateLimit } from "./rateLimit";
let nextCleanup = 0;
export async function recordSignal(input: unknown, clientBuild?: unknown) {
  const signal = safeSignal(input);
  if (!signal || !rateLimit("diagnostics:global", 600, 60_000)) return;
  const currentBuild = process.env.NEXT_PUBLIC_BUILD_ID || "dev";
  const build = clientBuild === undefined || clientBuild === currentBuild ? currentBuild : "previous";
  const hour = new Date(); hour.setUTCMinutes(0, 0, 0);
  const key = { hour, build, ...signal };
  try {
    await prisma.runtimeSignal.upsert({ where: { hour_build_route_kind_code_status_duration: key }, create: key, update: { count: { increment: 1 } } });
    if (Date.now() >= nextCleanup) {
      nextCleanup = Date.now() + 3600000;
      await prisma.runtimeSignal.deleteMany({ where: { hour: { lt: new Date(Date.now() - 30 * 86400000) } } });
    }
  } catch { console.error("Operational diagnostics could not be recorded"); }
}
