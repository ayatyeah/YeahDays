/** A failed HTTP response must never mark a guest migration as complete. */
export async function linkAccount(deviceId: string, signal?: AbortSignal): Promise<number> {
  const response = await fetch("/api/link", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ deviceId }), signal: signal ? AbortSignal.any([signal, AbortSignal.timeout(20_000)]) : AbortSignal.timeout(20_000) });
  const data = await response.json();
  if (!response.ok || data.ok !== true || typeof data.moved !== "number") throw new Error("Account transfer failed");
  return data.moved;
}
