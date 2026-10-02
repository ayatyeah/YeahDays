import { describe, expect, it } from "vitest";
import { safeCallbackUrl } from "./fastSignIn";

describe("адрес возврата после входа", () => {
  it("пропускает пути внутри сайта вместе с параметрами", () => {
    expect(safeCallbackUrl("/progress")).toBe("/progress");
    expect(safeCallbackUrl("/community?post=abc")).toBe("/community?post=abc");
    expect(safeCallbackUrl("/oauth/authorize?client_id=1&redirect_uri=https%3A%2F%2Fa.b")).toBe("/oauth/authorize?client_id=1&redirect_uri=https%3A%2F%2Fa.b");
  });
  it("не уводит на чужой сайт — полная загрузка страницы превратила бы такую ссылку в ловушку", () => {
    for (const bad of ["https://evil.example", "//evil.example", "/\\evil.example", "javascript:alert(1)", "", null, undefined]) {
      expect(safeCallbackUrl(bad)).toBe("/app");
    }
  });
});
