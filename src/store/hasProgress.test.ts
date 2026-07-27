import { describe, it, expect } from "vitest";
import { hasProgress, type SyncData } from "./useUserStore";

/**
 * hasProgress решает исход входа на свежем устройстве: пустой локальный стор
 * (только онбординг) НЕ должен затирать аккаунт с реальной историей. Поэтому
 * ключевой случай — «онбординг прошёл, но работы нет» → false.
 */

function snap(over: Partial<SyncData> = {}): Partial<SyncData> {
  return {
    plan: [],
    todos: [],
    challenges: [],
    quests: [],
    history: { completed: {} } as SyncData["history"],
    ...over,
  };
}

describe("реальный прогресс в снимке", () => {
  it("после одного онбординга прогресса нет", () => {
    // именно этот случай ломал синк: свежий updatedAt, но работать не начинали
    expect(hasProgress(snap())).toBe(false);
  });

  it("закрытое действие — это прогресс", () => {
    expect(
      hasProgress(snap({ plan: [{ completed: true } as never] })),
    ).toBe(true);
  });

  it("взятое, но не закрытое действие прогрессом не считается", () => {
    // иначе «взял на другом устройстве и не сделал» перебивал бы аккаунт
    expect(
      hasProgress(snap({ plan: [{ completed: false } as never] })),
    ).toBe(false);
  });

  it("своя задача — это прогресс", () => {
    expect(hasProgress(snap({ todos: [{ id: "t1" } as never] }))).toBe(true);
  });

  it("заведённый челлендж — это прогресс", () => {
    expect(hasProgress(snap({ challenges: [{ id: "c1" } as never] }))).toBe(true);
  });

  it("история выполнений — это прогресс", () => {
    expect(
      hasProgress(snap({ history: { completed: { a1: 2 } } as unknown as SyncData["history"] })),
    ).toBe(true);
  });

  it("пустая история выполнений — не прогресс", () => {
    expect(
      hasProgress(snap({ history: { completed: { a1: 0 } } as unknown as SyncData["history"] })),
    ).toBe(false);
  });
});
