import { describe, it, expect } from "vitest";
import {
  recommend,
  progressionStates,
  adaptiveShift,
  emptyHistory,
  MASTERY_THRESHOLD,
  type HistorySignals,
  type RecommendationContext,
} from "./recommendation";
import { ACTION_POOL } from "./actionPool";
import { DEFAULT_GOALS, type Action } from "./domain";

/** Базовый контекст: полный пул, средние настройки. */
function ctx(over: Partial<RecommendationContext> = {}): RecommendationContext {
  return {
    pool: ACTION_POOL,
    goals: { ...DEFAULT_GOALS },
    mood: { energy: "medium", minutes: 30 },
    history: emptyHistory(),
    excludeIds: [],
    now: Date.UTC(2026, 6, 23, 9, 0, 0),
    slot: "morning",
    ...over,
  };
}

/** Отметить действие выполненным n раз. */
function complete(h: HistorySignals, id: string, n: number): HistorySignals {
  return { ...h, completed: { ...h.completed, [id]: n } };
}

const ladderSteps = (id: string): Action[] =>
  ACTION_POOL.filter((a) => a.progression?.id === id).sort(
    (x, y) => x.progression!.step - y.progression!.step,
  );

describe("прогрессии", () => {
  it("на старте открыта только первая ступень каждой лестницы", () => {
    const st = progressionStates(ACTION_POOL, emptyHistory());
    expect(st.size).toBeGreaterThan(0);
    for (const [, s] of st) {
      expect(s.unlocked).toBe(1);
      expect(s.mastered).toBe(0);
    }
  });

  it("следующая ступень открывается только после MASTERY_THRESHOLD повторов", () => {
    const steps = ladderSteps("pushups");
    const first = steps[0].id;

    const notYet = progressionStates(
      ACTION_POOL,
      complete(emptyHistory(), first, MASTERY_THRESHOLD - 1),
    ).get("pushups")!;
    expect(notYet.unlocked).toBe(1);

    const now = progressionStates(
      ACTION_POOL,
      complete(emptyHistory(), first, MASTERY_THRESHOLD),
    ).get("pushups")!;
    expect(now.unlocked).toBe(2);
    expect(now.mastered).toBe(1);
  });

  it("не открывает ступень выше максимальной", () => {
    const steps = ladderSteps("pushups");
    let h = emptyHistory();
    for (const s of steps) h = complete(h, s.id, MASTERY_THRESHOLD);
    const st = progressionStates(ACTION_POOL, h).get("pushups")!;
    expect(st.unlocked).toBe(st.max);
  });

  it("колода не содержит незаработанных ступеней", () => {
    const deck = recommend(ctx(), 60);
    for (const { action } of deck) {
      if (!action.progression) continue;
      expect(action.progression.step).toBeLessThanOrEqual(1);
    }
  });

  it("освоив ступень, пользователь видит следующую", () => {
    const steps = ladderSteps("pushups");
    const history = complete(emptyHistory(), steps[0].id, MASTERY_THRESHOLD);
    const deck = recommend(ctx({ history }), ACTION_POOL.length);
    const ids = deck.map((d) => d.action.id);

    expect(ids).toContain(steps[1].id); // вторая открылась
    expect(ids).not.toContain(steps[2].id); // третья ещё нет
  });

  it("новая ступень объясняется человеку", () => {
    const steps = ladderSteps("plank");
    const history = complete(emptyHistory(), steps[0].id, MASTERY_THRESHOLD);
    const deck = recommend(ctx({ history }), ACTION_POOL.length);
    const next = deck.find((d) => d.action.id === steps[1].id);
    expect(next?.reason).toMatch(/ступень/i);
  });
});

describe("адаптивная сложность", () => {
  it("молчит, пока мало данных", () => {
    const h = emptyHistory();
    h.categoryCompletion = { fitness: { taken: 3, done: 3 } } as never;
    expect(adaptiveShift(h)).toBe(0);
  });

  it("поднимает планку тому, кто стабильно закрывает взятое", () => {
    const h = emptyHistory();
    h.categoryCompletion = { fitness: { taken: 10, done: 9 } } as never;
    expect(adaptiveShift(h)).toBeGreaterThan(0);
  });

  it("снижает планку тому, кто систематически сливает", () => {
    const h = emptyHistory();
    h.categoryCompletion = { fitness: { taken: 10, done: 2 } } as never;
    expect(adaptiveShift(h)).toBeLessThan(0);
  });
});

describe("подбор под состояние", () => {
  it("при малом бюджете не предлагает длинное", () => {
    const deck = recommend(
      ctx({ mood: { energy: "medium", minutes: 10 } }),
      10,
    );
    const avg =
      deck.reduce((s, d) => s + d.action.duration, 0) / Math.max(deck.length, 1);
    expect(avg).toBeLessThan(30);
  });

  it("при нехватке сил не выносит тяжёлое наверх", () => {
    const deck = recommend(ctx({ mood: { energy: "low", minutes: 30 } }), 8);
    const heavy = deck.filter((d) => d.action.energy === "high");
    expect(heavy.length).toBe(0);
  });

  it("уважает приоритеты пользователя", () => {
    const deck = recommend(
      ctx({
        goals: { strength: 1, intelligence: 0, wealth: 0, stability: 0 },
      }),
      10,
    );
    const strengthish = deck.filter((d) =>
      ["fitness", "health"].includes(d.action.category),
    );
    expect(strengthish.length).toBeGreaterThanOrEqual(5);
  });

  it("не предлагает уже взятое сегодня", () => {
    const first = recommend(ctx(), 3);
    const exclude = first.map((d) => d.action.id);
    const deck = recommend(ctx({ excludeIds: exclude }), 10);
    for (const id of exclude) {
      expect(deck.map((d) => d.action.id)).not.toContain(id);
    }
  });

  it("свежесть опускает только что показанное", () => {
    const now = Date.UTC(2026, 6, 23, 9, 0, 0);
    const target = ACTION_POOL[0];
    const history = {
      ...emptyHistory(),
      lastSeen: { [target.id]: now - 60_000 },
    };
    const withSeen = recommend(ctx({ history, now }), ACTION_POOL.length);
    const withoutSeen = recommend(ctx({ now }), ACTION_POOL.length);

    const rank = (deck: ReturnType<typeof recommend>) =>
      deck.findIndex((d) => d.action.id === target.id);

    expect(rank(withSeen)).toBeGreaterThan(rank(withoutSeen));
  });
});

describe("личные длительности", () => {
  /** Действие, которое НЕ влезает в 10 минут по оценке пула. */
  const longish = ACTION_POOL.find(
    (a) => a.duration >= 20 && a.duration <= 40 && !a.progression,
  )!;

  it("замеры делают длинное действие доступным при малом бюджете", () => {
    const mood = { energy: "medium", minutes: 10 } as const;
    const rank = (h: HistorySignals) =>
      recommend(ctx({ mood, history: h }), ACTION_POOL.length).findIndex(
        (d) => d.action.id === longish.id,
      );

    // человек стабильно закрывает это действие за 7 минут
    const fast = { ...emptyHistory() };
    fast.durations = { [longish.id]: [7, 7, 8, 7, 7, 8, 7, 7] };

    expect(rank(fast)).toBeLessThan(rank(emptyHistory()));
  });

  it("пустые замеры не меняют выдачу", () => {
    // защита новых пользователей: пока данных нет, движок обязан
    // вести себя ровно как до появления личных длительностей
    const withEmpty = { ...emptyHistory(), durations: {} };
    const a = recommend(ctx({ history: withEmpty }), 20).map((d) => d.action.id);
    const b = recommend(ctx(), 20).map((d) => d.action.id);
    expect(a).toEqual(b);
  });
});

describe("здоровье контента", () => {
  it("id действий уникальны", () => {
    const ids = ACTION_POOL.map((a) => a.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("в каждой категории есть и лёгкий вход, и серьёзный вызов", () => {
    const byCat = new Map<string, Action[]>();
    for (const a of ACTION_POOL) {
      byCat.set(a.category, [...(byCat.get(a.category) ?? []), a]);
    }
    expect(byCat.size).toBe(9);
    for (const [cat, list] of byCat) {
      const min = Math.min(...list.map((a) => a.difficulty));
      const max = Math.max(...list.map((a) => a.difficulty));
      expect(min, `${cat}: нет лёгкого входа`).toBeLessThanOrEqual(2);
      expect(max, `${cat}: нет вызова`).toBeGreaterThanOrEqual(3);
    }
  });

  it("ступени лестниц идут подряд с 1 и усложняются", () => {
    const ladders = new Map<string, Action[]>();
    for (const a of ACTION_POOL) {
      if (!a.progression) continue;
      ladders.set(a.progression.id, [
        ...(ladders.get(a.progression.id) ?? []),
        a,
      ]);
    }
    expect(ladders.size).toBeGreaterThanOrEqual(10);
    for (const [id, steps] of ladders) {
      steps.sort((x, y) => x.progression!.step - y.progression!.step);
      steps.forEach((s, i) => {
        expect(s.progression!.step, `${id}: разрыв в ступенях`).toBe(i + 1);
      });
      const first = steps[0];
      const last = steps[steps.length - 1];
      expect(last.difficulty, `${id}: не усложняется`).toBeGreaterThan(
        first.difficulty,
      );
    }
  });

  it("в пуле нет действий «на весь день»", () => {
    // Колода обещает «сделай сейчас». Обязательство на сутки нельзя ни
    // начать, ни закрыть в моменте, и оно врёт движку про длительность:
    // «День без сахара» с duration=5 пролезал в бюджет десяти минут.
    // «за день» намеренно НЕ ловим: «записать расходы за день» — это
    // пятиминутное действие, где «за день» относится к расходам,
    // а не к длительности.
    const whole = /(^|\s)День без|весь день|до полудня|в одно и то же время/i;
    for (const a of ACTION_POOL) {
      expect(whole.test(a.title), `«${a.title}» — обязательство на весь день`).toBe(
        false,
      );
    }
  });

  it("у каждого действия есть внятное «зачем»", () => {
    for (const a of ACTION_POOL) {
      expect(a.why.length, `${a.id}: пустое why`).toBeGreaterThan(10);
      expect(a.title.length).toBeGreaterThan(3);
      expect(a.duration).toBeGreaterThan(0);
    }
  });
});
