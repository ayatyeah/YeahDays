import { describe, it, expect, beforeEach, vi } from "vitest";
import { enqueue, flushQueue, queueSize } from "./eventQueue";
import type { TrackedEvent } from "./api";

/** Минимальный localStorage для node-окружения. */
function installStorage() {
  const store = new Map<string, string>();
  const mock = {
    getItem: (k: string) => store.get(k) ?? null,
    setItem: (k: string, v: string) => void store.set(k, v),
    removeItem: (k: string) => void store.delete(k),
    clear: () => store.clear(),
  };
  vi.stubGlobal("window", { localStorage: mock });
  vi.stubGlobal("localStorage", mock);
  return mock;
}

const ev = (actionId: string): TrackedEvent => ({
  type: "accept",
  actionId,
  at: 1_700_000_000_000,
});

describe("офлайн-очередь событий", () => {
  beforeEach(() => {
    installStorage();
    localStorage.clear();
  });

  it("копит события, пока их не отправили", () => {
    enqueue(ev("a1"));
    enqueue(ev("a2"));
    expect(queueSize()).toBe(2);
  });

  it("после успешной отправки очередь пустеет", async () => {
    enqueue(ev("a1"));
    enqueue(ev("a2"));
    const sent = await flushQueue(async () => true);
    expect(sent).toBe(2);
    expect(queueSize()).toBe(0);
  });

  it("при ошибке сети события НЕ теряются", async () => {
    enqueue(ev("a1"));
    const sent = await flushQueue(async () => {
      throw new Error("offline");
    });
    expect(sent).toBe(0);
    expect(queueSize()).toBe(1);
  });

  it("сервер ответил отказом — событие остаётся до следующей попытки", async () => {
    enqueue(ev("a1"));
    await flushQueue(async () => false);
    expect(queueSize()).toBe(1);

    await flushQueue(async () => true);
    expect(queueSize()).toBe(0);
  });

  it("события, добавленные во время отправки, не пропадают", async () => {
    enqueue(ev("a1"));
    await flushQueue(async () => {
      enqueue(ev("во-время-отправки"));
      return true;
    });
    expect(queueSize()).toBe(1);
  });

  it("отправляет полезную нагрузку без внутреннего qid", async () => {
    enqueue(ev("a1"));
    let payload: TrackedEvent[] = [];
    await flushQueue(async (events) => {
      payload = events;
      return true;
    });
    expect(payload).toHaveLength(1);
    expect(payload[0]).not.toHaveProperty("qid");
    expect(payload[0].actionId).toBe("a1");
  });

  it("переживает мусор в хранилище", () => {
    localStorage.setItem("yd-event-queue", "{не json");
    expect(queueSize()).toBe(0);
    enqueue(ev("a1"));
    expect(queueSize()).toBe(1);
  });
});
