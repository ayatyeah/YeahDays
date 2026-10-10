import { gunzipSync } from "node:zlib";
import { afterEach, expect, it, vi } from "vitest";
import { EVENTS, findEvent } from "./index";
import { EVENT_IDS, loadEvent } from "./client";
import { GET } from "@/app/events-data/[id]/route";

afterEach(() => vi.unstubAllGlobals());

it("у каждого ивента есть статический JSON для браузера — списки совпадают", () => {
  expect([...EVENT_IDS].sort()).toEqual(EVENTS.map((e) => e.id).sort());
});

it("браузер получает ровно тот ивент, что на сервере; неизвестный id — ничего", async () => {
  // fetch в браузере ходит в app/events-data/[id] — здесь зовём тот же обработчик напрямую
  vi.stubGlobal("fetch", async (u: string) => {
    const id = new URL(u, "http://app.test").pathname.split("/").pop()!;
    const res = await GET(new Request(new URL(u, "http://app.test")), { params: Promise.resolve({ id }) });
    if (!res.ok) return res;
    // браузер распаковывает gzip сам (Content-Encoding), здесь — вручную
    expect(res.headers.get("content-encoding")).toBe("gzip");
    return new Response(gunzipSync(Buffer.from(await res.arrayBuffer())), { headers: { "content-type": "application/json" } });
  });
  for (const e of EVENTS) expect(await loadEvent(e.id)).toEqual(JSON.parse(JSON.stringify(findEvent(e.id))));
  expect(await loadEvent("no-such-event")).toBeUndefined();
});
