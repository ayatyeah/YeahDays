import { describe, it, expect } from "vitest";
import {
  personalDuration,
  durationInsight,
  isPlausible,
  addSample,
  SAMPLE_CAP,
} from "./durations";

describe("правдоподобность замера", () => {
  it("принимает замер рядом с оценкой пула", () => {
    expect(isPlausible(12, 15)).toBe(true);
    expect(isPlausible(25, 15)).toBe(true);
  });

  it("отбрасывает «взял утром — сделал вечером»", () => {
    // 11 часов на задачу в 15 минут — это отложил, а не делал
    expect(isPlausible(11 * 60, 15)).toBe(false);
  });

  it("отбрасывает мгновенные нажатия", () => {
    // человек взял и сразу ткнул «сделал» — измерения тут нет
    expect(isPlausible(0.1, 15)).toBe(false);
  });

  it("не ломается на мусорных числах", () => {
    expect(isPlausible(NaN, 15)).toBe(false);
    expect(isPlausible(Infinity, 15)).toBe(false);
  });
});

describe("личная длительность", () => {
  it("без замеров возвращает оценку пула", () => {
    // важнее всего: новый пользователь получает ровно старое поведение
    expect(personalDuration(15, undefined)).toBe(15);
    expect(personalDuration(15, [])).toBe(15);
  });

  it("один замер сдвигает оценку, но не заменяет её", () => {
    const d = personalDuration(15, [8]);
    expect(d).toBeLessThan(15); // сдвинулась в сторону замера
    expect(d).toBeGreaterThan(9); // но не прыгнула на него целиком
  });

  it("с накоплением замеров сходится к реальному времени", () => {
    const few = personalDuration(15, [8, 8]);
    const many = personalDuration(15, [8, 8, 8, 8, 8, 8, 8, 8, 8]);
    expect(many).toBeLessThan(few);
    expect(many).toBeLessThanOrEqual(10);
  });

  it("один забытый замер не перекашивает оценку", () => {
    // четыре честных замера и один «вспомнил через 5 часов»
    const d = personalDuration(15, [14, 15, 16, 15, 300]);
    expect(d).toBeGreaterThan(12);
    expect(d).toBeLessThan(18);
  });

  it("никогда не уходит в ноль или отрицательные минуты", () => {
    expect(personalDuration(5, [0.5, 0.5, 0.5, 0.5])).toBeGreaterThanOrEqual(1);
  });
});

describe("хранение замеров", () => {
  it("переводит миллисекунды в минуты", () => {
    expect(addSample([], 10 * 60_000)).toEqual([10]);
  });

  it("хранит только последние SAMPLE_CAP замеров", () => {
    let s: number[] = [];
    for (let i = 0; i < SAMPLE_CAP + 8; i++) s = addSample(s, 60_000);
    expect(s.length).toBe(SAMPLE_CAP);
  });
});

describe("подсказка в интерфейсе", () => {
  it("молчит, пока расхождение незаметное", () => {
    expect(durationInsight(15, [15, 16, 15])).toBeNull();
  });

  it("сообщает, когда человек стабильно быстрее", () => {
    const i = durationInsight(15, [7, 8, 7, 8, 7, 8, 7, 8]);
    expect(i?.faster).toBe(true);
    expect(i!.personal).toBeLessThan(15);
  });

  it("сообщает и когда стабильно дольше", () => {
    const i = durationInsight(10, [25, 24, 26, 25, 24, 26, 25, 24]);
    expect(i?.faster).toBe(false);
    expect(i!.personal).toBeGreaterThan(10);
  });
});
