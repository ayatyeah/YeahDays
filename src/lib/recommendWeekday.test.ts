import { describe, it, expect } from "vitest";
import { recommend, emptyHistory } from "@/lib/recommendation";
import { DEFAULT_GOALS, DEFAULT_MOOD, type Action } from "@/lib/domain";

/** Минимальное действие — движку нужны только поля для скоринга. */
function action(id: string, weekdays?: number[]): Action {
  return {
    id,
    title: id,
    why: "",
    category: "learning",
    difficulty: 2,
    duration: 30,
    energy: "medium",
    timePreference: "any",
    impact: 3,
    custom: true,
    ...(weekdays ? { weekdays } : {}),
  };
}

function deckIds(pool: Action[], ctx: { weekday?: number; now?: number }) {
  return recommend(
    {
      pool,
      goals: DEFAULT_GOALS,
      mood: DEFAULT_MOOD,
      history: emptyHistory(),
      excludeIds: [],
      ...ctx,
    },
    12,
  ).map((s) => s.action.id);
}

const SUNDAY = 0;
const MONDAY = 1;

describe("фильтр по дню недели", () => {
  const pool = [action("free"), action("sunday-only", [SUNDAY]), action("mon-wed", [1, 3])];

  it("в воскресенье: свободные + воскресные, без понедельничных", () => {
    const ids = deckIds(pool, { weekday: SUNDAY });
    expect(ids).toContain("free");
    expect(ids).toContain("sunday-only");
    expect(ids).not.toContain("mon-wed");
  });

  it("в понедельник: свободные + пн/ср, без воскресных", () => {
    const ids = deckIds(pool, { weekday: MONDAY });
    expect(ids).toContain("free");
    expect(ids).toContain("mon-wed");
    expect(ids).not.toContain("sunday-only");
  });

  it("во вторник привязанные к пн/ср не показываются — фильтр жёсткий, не вес", () => {
    expect(deckIds(pool, { weekday: 2 })).not.toContain("mon-wed");
  });

  it("пустой список дней равен «любой день»", () => {
    expect(deckIds([action("empty-days", [])], { weekday: 5 })).toContain("empty-days");
  });

  it("без weekday в контексте день берётся из now", () => {
    // 6 сентября 2026 — воскресенье; полдень UTC, чтобы локальная зона
    // раннера не перекинула дату через полночь.
    const noonSunday = Date.UTC(2026, 8, 6, 12);
    const ids = deckIds(pool, { now: noonSunday });
    expect(ids).toContain("sunday-only");
    expect(ids).not.toContain("mon-wed");
  });

  it("явный weekday важнее now — клиент знает свой день, сервер в UTC нет", () => {
    const noonSunday = Date.UTC(2026, 8, 6, 12);
    const ids = deckIds(pool, { now: noonSunday, weekday: MONDAY });
    expect(ids).toContain("mon-wed");
    expect(ids).not.toContain("sunday-only");
  });
});
