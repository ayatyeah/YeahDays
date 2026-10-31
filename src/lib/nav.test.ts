import { describe, expect, it } from "vitest";
import { navKeyForTab, swipeTarget } from "./nav";

describe("нижнее меню и свайп", () => {
  it("колода и календарь подсвечивают «Сегодня»", () => {
    expect(navKeyForTab("home")).toBe("today");
    expect(navKeyForTab("calendar")).toBe("today");
    expect(navKeyForTab("progress")).toBe("progress");
  });

  it("свайп идёт по порядку меню, страницы — переходом", () => {
    expect(swipeTarget("today", 1)).toEqual({ href: "/learn" });
    expect(swipeTarget("today", -1)).toBeNull();
    expect(swipeTarget("progress", -1)).toEqual({ href: "/community" });
    expect(swipeTarget("progress", 1)).toEqual({ tab: "account" });
    expect(swipeTarget("account", -1)).toEqual({ tab: "progress" });
    expect(swipeTarget("account", 1)).toBeNull();
  });

  it("с подэкранов «Сегодня» свайпа между разделами нет", () => {
    expect(swipeTarget("home", 1)).toBeNull();
    expect(swipeTarget("calendar", -1)).toBeNull();
  });
});
