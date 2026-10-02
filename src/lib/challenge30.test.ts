import { describe, expect, it } from "vitest";
import { BREAK, ChallengeError, LEVELS, SESSION, blocksFor, defaultWindows, logBlock, parseBrief, parseRecipe, stats, successes, timeSlots, type Level, type Plan30 } from "./challenge30";

const activity = (title: string, kind: string, weight = 1) => ({ title, kind, weight, steps: ["Шаг недели 1", "Шаг недели 2", "Шаг недели 3", "Шаг недели 4"] });
const brief = (level: Level, windows = defaultWindows(level)) => ({ level, goals: "Разобраться в Python и больше двигаться", baseline: "С нуля", preferences: "", timezone: "Asia/Almaty", windows });
function plan(level: Level, activities = [activity("Python", "study", 3), activity("Английский", "study", 1), activity("Зарядка", "sport", 1)]): Plan30 {
  return { id: "p", brief: parseBrief(brief(level)), recipe: parseRecipe({ title: "Месяц роста", summary: "Понемногу каждый день", activities }), createdAt: "2026-10-01T00:00:00Z", consentAt: "2026-10-01T00:00:00Z", startDate: "2026-10-01", logs: {} };
}

describe("уровни", () => {
  it("лёгкий, средний и тяжёлый — это 3, 6 и 12 часов в день", () => {
    expect([LEVELS.easy.minutes, LEVELS.medium.minutes, LEVELS.hard.minutes]).toEqual([180, 360, 720]);
  });
  it.each(["easy", "medium", "hard"] as Level[])("%s: день набирает ровно норму целыми сессиями с перерывами", level => {
    for (let day = 0; day < 30; day++) {
      const blocks = blocksFor(plan(level), day);
      expect(blocks.reduce((n, b) => n + b.minutes, 0)).toBe(LEVELS[level].minutes);
      expect(blocks.every(b => b.minutes === SESSION)).toBe(true);
      expect(blocks.every((b, i) => i === 0 || b.start >= blocks[i - 1].start + blocks[i - 1].minutes + BREAK)).toBe(true);
    }
  });
  it("окна по умолчанию подходят своему уровню и оставляют 8 часов на сон", () => {
    for (const level of ["easy", "medium", "hard"] as Level[]) expect(() => parseBrief(brief(level))).not.toThrow();
  });
});

describe("свободные окна", () => {
  it("второе окно не съедает перерыв после предыдущего занятия", () => {
    const slots = timeSlots([{ start: 480, end: 525 }, { start: 530, end: 720 }], 90);
    expect(slots).toEqual([{ start: 480, minutes: 45 }, { start: 535, minutes: 45 }]);
  });
  it("не обещает норму, если времени не хватает", () => {
    expect(() => timeSlots([{ start: 600, end: 660 }], 180)).toThrow(ChallengeError);
    expect(() => parseBrief(brief("hard", defaultWindows("easy")))).toThrow(/не хватает свободного времени/);
  });
  it("отклоняет пересечения и день без сна", () => {
    const day = (list: { start: number; end: number }[]) => brief("easy", Array.from({ length: 7 }, () => list));
    expect(() => parseBrief(day([{ start: 600, end: 800 }, { start: 700, end: 900 }]))).toThrow(/пересекаются/);
    expect(() => parseBrief(day([{ start: 0, end: 240 }, { start: 1200, end: 1440 }]))).toThrow(/сна/);
  });
});

describe("расписание", () => {
  it("главная цель получает больше времени, чем поддерживающая", () => {
    const st = stats(plan("medium"));
    const [python, english] = st.activities;
    expect(python.planned).toBeGreaterThan(english.planned * 2);
    expect(st.activities.reduce((n, a) => n + a.planned, 0)).toBe(30 * 360);
  });
  it("спорт остаётся умеренным даже как главный приоритет: не больше 1–2 сессий в день и не подряд", () => {
    for (const level of ["easy", "hard"] as Level[]) {
      const p = plan(level, [activity("Бег", "sport", 3), activity("Чтение", "personal", 1)]);
      for (let day = 0; day < 30; day++) {
        const kinds = blocksFor(p, day).map(b => b.kind);
        expect(kinds.filter(k => k === "sport").length).toBeLessThanOrEqual(level === "easy" ? 1 : 2);
        expect(kinds.some((k, i) => k === "sport" && kinds[i - 1] === "sport")).toBe(false);
      }
    }
  });
  it("каждую неделю задание меняется, последняя неделя длится до 30 дня", () => {
    const p = plan("easy", [activity("Python", "study"), activity("Английский", "study")]);
    expect([0, 7, 14, 21, 29].map(day => blocksFor(p, day)[0].detail)).toEqual(["Шаг недели 1", "Шаг недели 2", "Шаг недели 3", "Шаг недели 4", "Шаг недели 4"]);
    expect(() => blocksFor(p, 30)).toThrow(ChallengeError);
  });
  it("не принимает план только из спорта или с неполными шагами", () => {
    expect(() => parseRecipe({ title: "Спорт", summary: "Только бег", activities: [activity("Бег", "sport"), activity("Плавание", "sport")] })).toThrow(/помимо спорта/);
    expect(() => parseRecipe({ title: "План", summary: "Кратко", activities: [activity("Python", "study"), { ...activity("Чтение", "personal"), steps: ["Один шаг"] }] })).toThrow(ChallengeError);
  });
});

describe("отметки и аналитика", () => {
  const now = new Date("2026-10-02T06:00:00Z"); // 2 октября в Алматы — второй день
  it("день зачитывается только за полную норму, повтор отметки не удваивает минуты", () => {
    const p = plan("easy");
    for (const b of blocksFor(p, 1)) { logBlock(p, 1, b.id, 45, now); logBlock(p, 1, b.id, 45, now); }
    expect(successes(p)).toBe(1);
    logBlock(p, 1, "1:0", 30, now);
    expect(successes(p)).toBe(0);
    expect(stats(p).total).toBe(165);
  });
  it("отмечать можно только сегодня и вчера, и не больше длины занятия", () => {
    const p = plan("easy");
    expect(() => logBlock(p, 2, "2:0", 45, now)).toThrow(/сегодня или вчера/);
    expect(() => logBlock(p, 1, "1:0", 46, now)).toThrow(/в пределах занятия/);
    expect(() => logBlock({ ...p, startDate: null }, 0, "0:0", 45, now)).toThrow(/начни/);
    expect(() => logBlock(p, 0, "0:0", 45, new Date("2026-10-04T06:00:00Z"))).toThrow(/сегодня или вчера/);
  });
  it("считает лучшую серию и время по каждому занятию", () => {
    const p = plan("easy");
    for (const day of [0, 1, 3]) for (const b of blocksFor(p, day)) p.logs[b.id] = b.minutes;
    const st = stats(p);
    expect(st.successes).toBe(3); expect(st.streak).toBe(2); expect(st.total).toBe(540);
    expect(st.activities.reduce((n, a) => n + a.done, 0)).toBe(540);
  });
});

describe("окна из расписания", () => {
  it("вырезает занятое время и оставляет окна, в которые помещается норма", async () => {
    const { windowsFromBusy } = await import("./challenge30");
    // Пары с 9:00 до 15:00 каждый день.
    const busy = Array.from({ length: 7 }, () => [{ start: 540, end: 900 }]);
    const windows = windowsFromBusy(busy, "easy");
    for (const day of windows) {
      expect(day.every((w) => w.end <= 540 - 10 || w.start >= 900 + 10)).toBe(true);
      expect(() => timeSlots(day, LEVELS.easy.minutes)).not.toThrow();
    }
    expect(() => parseBrief(brief("easy", windows))).not.toThrow();
  });
  it("если день забит и норма не помещается, оставляет окна уровня по умолчанию", async () => {
    const { windowsFromBusy } = await import("./challenge30");
    const full = Array.from({ length: 7 }, () => [{ start: 7 * 60, end: 23 * 60 }]);
    expect(windowsFromBusy(full, "medium")).toEqual(defaultWindows("medium"));
    // Свободного времени много, но 12 часов с перерывами не влезают в остаток дня.
    const morning = Array.from({ length: 7 }, () => [{ start: 7 * 60, end: 13 * 60 }]);
    expect(windowsFromBusy(morning, "hard")).toEqual(defaultWindows("hard"));
  });
});

describe("недельный пересмотр", () => {
  it("доступен после полной недели и не чаще раза в семь дней", async () => {
    const { reviewAllowed } = await import("./challenge30");
    const p = plan("easy");
    expect([0, 5, 6, 13, 27, 28].map((d) => reviewAllowed(p, d))).toEqual([false, false, true, true, true, false]);
    p.review = { day: 6, summary: "ок" };
    expect([7, 12, 13].map((d) => reviewAllowed(p, d))).toEqual([false, false, true]);
    expect(reviewAllowed({ ...p, startDate: null, review: undefined }, 10)).toBe(false);
  });
  it("не переписывает прошлое: отмеченные блоки остаются при своих занятиях, новые доли действуют с завтра", async () => {
    const { applyReview, weekSummary } = await import("./challenge30");
    const p = plan("medium");
    for (let day = 0; day <= 6; day++) for (const b of blocksFor(p, day)) p.logs[b.id] = b.minutes;
    const before = Array.from({ length: 7 }, (_, d) => blocksFor(p, d).map((b) => b.title));
    const tomorrow = blocksFor(p, 7).map((b) => b.title);
    const week = weekSummary(p, 6);
    expect(week.reduce((n, a) => n + a.done, 0)).toBe(7 * 360);

    applyReview(p, 6, { summary: "Английского больше", activities: [
      { weight: 1, steps: ["x1", "x2", "x3", "x4"] }, { weight: 3, steps: ["y1", "y2", "y3", "y4"] }, { weight: 1, steps: ["z1", "z2", "z3", "z4"] },
    ] });
    expect(Array.from({ length: 7 }, (_, d) => blocksFor(p, d).map((b) => b.title))).toEqual(before);
    expect(blocksFor(p, 7).map((b) => b.title)).not.toEqual(tomorrow);
    // Задание прошедшей первой недели прежнее, со второй — новое.
    expect(p.recipe.activities[0].steps[0]).toBe("Шаг недели 1");
    expect(p.recipe.activities[0].steps[1]).toBe("x2");
    // Норма дня и аналитика по-прежнему сходятся.
    expect(blocksFor(p, 20).reduce((n, b) => n + b.minutes, 0)).toBe(360);
    expect(stats(p).total).toBe(7 * 360);
    expect(p.review).toEqual({ day: 6, summary: "Английского больше" });
  });
  it("не принимает пересмотр с другим числом занятий", async () => {
    const { parseReview } = await import("./challenge30");
    expect(() => parseReview({ summary: "нормально", activities: [{ weight: 1, steps: ["a1b", "a2b", "a3b", "a4b"] }] }, 3)).toThrow(ChallengeError);
  });
});
