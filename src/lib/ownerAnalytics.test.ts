import { describe, expect, it } from "vitest";
import { blocksFor, defaultWindows, type Plan30 } from "./challenge30";
import { aiSummary, challengeSummary, dailyCounts } from "./ownerAnalytics";

const steps = ["Шаг 1", "Шаг 2", "Шаг 3", "Шаг 4"];
function plan(extra: Partial<Plan30> = {}): Plan30 {
  return {
    id: "p",
    brief: { level: "easy", goals: "Python", baseline: "С нуля", preferences: "", timezone: "Asia/Almaty", windows: defaultWindows("easy") },
    recipe: { title: "Месяц", summary: "Кратко", activities: [{ title: "Python", kind: "study", weight: 2, steps }, { title: "Чтение", kind: "personal", weight: 1, steps }] },
    createdAt: "2026-10-01T00:00:00Z", consentAt: "2026-10-01T00:00:00Z", startDate: null, logs: {}, tokens: 900,
    ...extra,
  };
}
const now = new Date("2026-10-10T06:00:00Z"); // 10 октября, 11:00 в Алматы

describe("dailyCounts", () => {
  it("раскладывает даты по дням владельца, а не по UTC", () => {
    // 20:30 UTC 9 октября — в Алматы уже 10-е.
    const counts = dailyCounts([new Date("2026-10-09T20:30:00Z"), new Date("2026-10-08T06:00:00Z"), new Date("2026-08-01T00:00:00Z")], 3, now);
    expect(counts).toEqual([{ day: "2026-10-08", count: 1 }, { day: "2026-10-09", count: 0 }, { day: "2026-10-10", count: 1 }]);
  });
});

describe("challengeSummary", () => {
  it("делит планы на черновики, идущие и завершённые и суммирует расход ИИ", () => {
    const running = plan({ startDate: "2026-10-09" });
    for (const b of blocksFor(running, 0)) running.logs[b.id] = b.minutes;
    const summary = challengeSummary([
      { data: plan(), aiDay: "2026-10-10", aiCount: 2 },
      { data: running, aiDay: "2026-10-09", aiCount: 1 },
      { data: plan({ startDate: "2026-09-01", brief: { ...plan().brief, level: "medium", windows: defaultWindows("medium") } }), aiDay: "", aiCount: 0 },
      { data: null, aiDay: "2026-10-10", aiCount: 1 },
    ], now);
    expect(summary).toEqual({ drafts: 1, running: 1, finished: 1, levels: { easy: 2, medium: 1, hard: 0 }, successDays: 1, hours: 3, tokens: 2700, generationsToday: 3 });
  });
  it("не падает на строке в незнакомом формате", () => {
    expect(challengeSummary([{ data: { brief: null }, aiDay: "", aiCount: 0 }, { data: plan(), aiDay: "", aiCount: 0 }], now).drafts).toBe(1);
  });
});

describe("aiSummary", () => {
  it("складывает вызовы и токены по функциям за сегодня, неделю и месяц", () => {
    const rows = [
      { day: "2026-10-10", feature: "chat", calls: 2, inputTokens: 100, outputTokens: 50 },
      { day: "2026-10-05", feature: "chat", calls: 1, inputTokens: 10, outputTokens: 5 },
      { day: "2026-09-20", feature: "chat", calls: 4, inputTokens: 400, outputTokens: 100 },
      { day: "2026-10-10", feature: "planner", calls: 1, inputTokens: 900, outputTokens: 300 },
    ];
    const summary = aiSummary(rows, now);
    expect(summary.find((f) => f.name === "ИИ-помощник")).toEqual({ name: "ИИ-помощник", today: { calls: 2, tokens: 150 }, week: { calls: 3, tokens: 165 }, month: { calls: 7, tokens: 665 } });
    expect(summary.find((f) => f.name === "Планировщик")!.today).toEqual({ calls: 1, tokens: 1200 });
    // Функция без вызовов всё равно в списке — с нулями, а не пропуском.
    expect(summary.find((f) => f.name === "Челлендж 30")!.month).toEqual({ calls: 0, tokens: 0 });
  });
});

describe("activitySummary", () => {
  const day = (seconds: number, extra: object = {}) => ({ seconds, visits: 1, tasks: 0, actions: 0, quests: 0, sections: { today: seconds }, ...extra });
  it("считает активных по дням, время по разделам и выполненное — только у тех, кто разрешил учёт", async () => {
    const { activitySummary } = await import("./ownerAnalytics");
    const summary = activitySummary([
      { enabled: true, days: { "2026-10-10": day(600, { tasks: 2, sections: { today: 300, learn: 300 } }), "2026-10-09": day(300) } },
      { enabled: true, days: { "2026-10-10": day(1200, { quests: 1, sections: { learn: 1200 } }) } },
      { enabled: false, days: { "2026-10-10": day(9999) } },
    ], 7, now);
    expect(summary.tracked).toBe(2);
    expect(summary.daily.at(-1)).toEqual({ day: "2026-10-10", active: 2, minutes: 30 });
    expect(summary.daily.at(-2)).toEqual({ day: "2026-10-09", active: 1, minutes: 5 });
    expect(summary.activeWeek).toBe(2);
    expect(summary.minutesPerActiveDay).toBe(12); // 35 минут на 3 человеко-дня
    expect(summary.done).toEqual({ tasks: 2, actions: 0, quests: 1 });
    expect(summary.sections[0]).toEqual({ name: "Учёба", minutes: 25, percent: 71 });
  });
  it("удержание считает от первого активного дня и не судит тех, чьё окно ещё не закончилось", async () => {
    const { activitySummary } = await import("./ownerAnalytics");
    const summary = activitySummary([
      { enabled: true, days: { "2026-09-01": day(60), "2026-09-02": day(60), "2026-09-20": day(60) } }, // вернулся и назавтра, и позже
      { enabled: true, days: { "2026-09-01": day(60), "2026-09-05": day(60) } },                         // только в первую неделю
      { enabled: true, days: { "2026-09-01": day(60) } },                                                // не вернулся
      { enabled: true, days: { "2026-10-10": day(60) } },                                                // начал сегодня — в расчёт не входит
    ], 30, now);
    const [nextDay, week, month] = summary.retention;
    expect(nextDay).toMatchObject({ eligible: 3, returned: 1, percent: 33 });
    expect(week).toMatchObject({ eligible: 3, returned: 2, percent: 67 });
    expect(month).toMatchObject({ eligible: 3, returned: 1, percent: 33 });
  });
});

describe("funnel и посещения", () => {
  it("воронка даёт долю от зарегистрированных и от предыдущего шага", async () => {
    const { funnel } = await import("./ownerAnalytics");
    expect(funnel([{ name: "Регистрация", count: 200 }, { name: "Онбординг", count: 150 }, { name: "Первое дело", count: 60 }])).toEqual([
      { name: "Регистрация", count: 200, percent: 100, fromPrevious: null },
      { name: "Онбординг", count: 150, percent: 75, fromPrevious: 75 },
      { name: "Первое дело", count: 60, percent: 30, fromPrevious: 40 },
    ]);
  });
  it("посещения сводятся по дням и разделам, а путь страницы — к разделу", async () => {
    const { sectionOf, visitSummary, visitorHash } = await import("./visits");
    expect(sectionOf("/events/research-methods-quiz-1")).toBe("/events");
    expect(sectionOf("/community?profile=abc")).toBe("/community");
    expect(sectionOf("/invite/xyz")).toBe("/invite");
    expect(sectionOf("/какой-то/мусор")).toBe("other");
    // Один и тот же человек в разные дни — разные хеши, и адрес из хеша не читается.
    expect(visitorHash("2026-10-10", "1.2.3.4", "UA")).not.toBe(visitorHash("2026-10-11", "1.2.3.4", "UA"));
    expect(visitorHash("2026-10-10", "1.2.3.4", "UA")).not.toContain("1.2.3.4");
    const summary = visitSummary(
      [{ day: "2026-10-10", path: "/today", views: 5 }, { day: "2026-10-10", path: "/", views: 3 }, { day: "2026-10-09", path: "/today", views: 2 }],
      [{ day: "2026-10-10", authed: true }, { day: "2026-10-10", authed: false }, { day: "2026-10-09", authed: true }],
      7, now,
    );
    expect(summary.today).toEqual({ day: "2026-10-10", visitors: 2, signedIn: 1, views: 8 });
    expect(summary.week).toEqual({ visitors: 3, views: 10 });
    expect(summary.sections[0]).toEqual({ path: "/today", name: "Сегодня", views: 7 });
  });
});
