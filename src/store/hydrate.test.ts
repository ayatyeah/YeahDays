import { describe, expect, it } from "vitest";
import { useUserStore, type SyncData } from "./useUserStore";

describe("снимок аккаунта с сервера", () => {
  it("без поля seenLevel не оставляет его пустым — иначе всплывает поздравление с уровнем, которого не было", () => {
    const before = useUserStore.getState().seenLevel;
    useUserStore.getState().hydrateFromRemote({ name: "Тест", onboarded: true, todos: [], plan: [], updatedAt: 1 } as unknown as SyncData);
    expect(useUserStore.getState().seenLevel).toBe(before);
    expect(useUserStore.getState().name).toBe("Тест");
  });
  it("с полем seenLevel берёт значение из снимка", () => {
    useUserStore.getState().hydrateFromRemote({ name: "Тест", seenLevel: 7, todos: [], plan: [], updatedAt: 2 } as unknown as SyncData);
    expect(useUserStore.getState().seenLevel).toBe(7);
  });
});
