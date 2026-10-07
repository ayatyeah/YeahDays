import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({ count: vi.fn() }));
vi.mock("@/lib/db", () => ({ prisma: { user: { count: mocks.count } } }));

import { newUserMessage, notifyNewUser, sendToOwner } from "./telegram";

describe("newUserMessage", () => {
  it("имя, почта, логин, способ, сколько всего и ссылка на консоль", () => {
    const text = newUserMessage({ name: "Аян", email: "a@b.kz", username: "aian" }, "google", 58, "https://yeahgrind.site");
    expect(text).toContain("Имя: Аян");
    expect(text).toContain("Почта: a@b.kz");
    expect(text).toContain("Логин: @aian");
    expect(text).toContain("Через: Google");
    expect(text).toContain("Всего пользователей: 58");
    expect(text).toContain('href="https://yeahgrind.site/admin"');
  });

  it("экранирует разметку: имя — это ввод пользователя", () => {
    const text = newUserMessage({ name: "<b>x</b> & co" }, "password", null, "https://yeahgrind.site");
    expect(text).toContain("Имя: &lt;b&gt;x&lt;/b&gt; &amp; co");
    expect(text).toContain("Через: логин и пароль");
    expect(text).not.toContain("Почта:");
    expect(text).not.toContain("Всего");
  });
});

describe("отправка", () => {
  const fetchMock = vi.fn();
  beforeEach(() => {
    vi.stubGlobal("fetch", fetchMock);
    fetchMock.mockReset();
    mocks.count.mockReset();
  });
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
  });

  it("без токена и чата ничего не шлёт и базу не трогает", async () => {
    vi.stubEnv("TELEGRAM_BOT_TOKEN", "");
    vi.stubEnv("TELEGRAM_CHAT_ID", "");
    await notifyNewUser({ name: "x" }, "google");
    expect(await sendToOwner("hi")).toBe(false);
    expect(fetchMock).not.toHaveBeenCalled();
    expect(mocks.count).not.toHaveBeenCalled();
  });

  it("с токеном шлёт sendMessage в чат владельца", async () => {
    vi.stubEnv("TELEGRAM_BOT_TOKEN", "123:abc");
    vi.stubEnv("TELEGRAM_CHAT_ID", "42");
    mocks.count.mockResolvedValue(7);
    fetchMock.mockResolvedValue(new Response("{}", { status: 200 }));
    await notifyNewUser({ name: "Аян", email: "a@b.kz" }, "lms-aitu");
    expect(fetchMock).toHaveBeenCalledOnce();
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("https://api.telegram.org/bot123:abc/sendMessage");
    const body = JSON.parse(init.body);
    expect(body.chat_id).toBe("42");
    expect(body.parse_mode).toBe("HTML");
    expect(body.text).toContain("Через: LMS AITU");
    expect(body.text).toContain("Всего пользователей: 7");
  });

  it("ошибка Telegram не роняет регистрацию", async () => {
    vi.stubEnv("TELEGRAM_BOT_TOKEN", "123:abc");
    vi.stubEnv("TELEGRAM_CHAT_ID", "42");
    mocks.count.mockRejectedValue(new Error("db down"));
    fetchMock.mockRejectedValue(new Error("network"));
    vi.spyOn(console, "error").mockImplementation(() => {});
    await expect(notifyNewUser({ name: "x" }, "google")).resolves.toBeUndefined();
  });
});
