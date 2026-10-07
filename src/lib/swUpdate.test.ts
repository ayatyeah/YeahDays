import { describe, expect, it } from "vitest";
import { decideUpdate, swVersion } from "./swUpdate";

const sw = (v: string) => `https://yeahgrind.site/sw.js?v=${v}`;

describe("swVersion", () => {
  it("берёт id сборки из адреса воркера", () => {
    expect(swVersion(sw("41b812d0"))).toBe("41b812d0");
    expect(swVersion("https://yeahgrind.site/sw.js")).toBeNull();
    expect(swVersion(undefined)).toBeNull();
    expect(swVersion("not a url")).toBeNull();
  });
});

describe("decideUpdate", () => {
  it("та же сборка — плашки нет, даже если воркер ждёт", () => {
    expect(decideUpdate({ active: sw("aaa"), waiting: sw("aaa"), fresh: false })).toBe("ignore");
    expect(decideUpdate({ active: sw("aaa"), waiting: sw("aaa"), fresh: true })).toBe("ignore");
  });

  it("нет ожидающего или это первая установка — делать нечего", () => {
    expect(decideUpdate({ active: sw("aaa"), waiting: null, fresh: true })).toBe("ignore");
    expect(decideUpdate({ active: null, waiting: sw("bbb"), fresh: true })).toBe("ignore");
  });

  it("новая сборка на старте — применяем тихо, посреди работы — спрашиваем", () => {
    expect(decideUpdate({ active: sw("aaa"), waiting: sw("bbb"), fresh: true })).toBe("apply");
    expect(decideUpdate({ active: sw("aaa"), waiting: sw("bbb"), fresh: false })).toBe("announce");
  });
});
