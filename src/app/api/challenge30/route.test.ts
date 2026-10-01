import { beforeEach, expect, it, vi } from "vitest";
import { defaultWindows } from "@/lib/challenge30";
type Row = { userId: string; data: unknown; revision: number; aiDay: string; aiCount: number; pendingId: string | null; pendingAt: Date | null };
const mocks = vi.hoisted(() => ({ auth: vi.fn(), recipe: vi.fn(), rate: vi.fn(), row: null as Row | null }));
vi.mock("@/auth", () => ({ auth: mocks.auth }));
vi.mock("@/lib/challenge30Ai", () => ({ createRecipe: mocks.recipe }));
vi.mock("@/lib/rateLimit", () => ({ rateLimit: mocks.rate }));
// One in-memory row stands in for the table; Prisma.JsonNull is stored as plain null.
vi.mock("@/lib/db", () => {
  const plain = (v: unknown) => v && typeof v === "object" && Object.keys(v).length === 0 && v.constructor !== Object ? null : v;
  const table = {
    findUnique: async () => mocks.row && structuredClone(mocks.row),
    upsert: async ({ create }: { create: { userId: string } }) => { mocks.row ??= { userId: create.userId, data: null, revision: 0, aiDay: "", aiCount: 0, pendingId: null, pendingAt: null }; return mocks.row; },
    update: async ({ data }: { data: Record<string, unknown> }) => {
      const { revision, ...rest } = data; if ("data" in rest) rest.data = plain(rest.data);
      Object.assign(mocks.row!, rest); if (revision) mocks.row!.revision++;
      return structuredClone(mocks.row!);
    },
    updateMany: async ({ where, data }: { where: { pendingId: string }; data: object }) => { if (mocks.row?.pendingId === where.pendingId) Object.assign(mocks.row, data); },
  };
  const prisma = { challenge30: table, $queryRaw: async () => [], $transaction: async (run: (tx: unknown) => unknown) => run(prisma) };
  return { prisma };
});
import { GET, POST } from "./route";

const brief = { level: "easy", goals: "Разобраться в Python и больше двигаться", baseline: "С нуля", preferences: "", timezone: "Asia/Almaty", windows: defaultWindows("easy") };
const steps = ["Шаг 1", "Шаг 2", "Шаг 3", "Шаг 4"];
const recipe = { title: "Месяц роста", summary: "Понемногу каждый день", activities: [{ title: "Python", kind: "study", weight: 3, steps }, { title: "Зарядка", kind: "sport", weight: 1, steps }] };
const post = (body: object) => POST(new Request("https://app.test/api/challenge30", { method: "POST", body: JSON.stringify(body) }));
const generate = (extra: object = {}) => post({ action: "generate", brief, consent: "challenge30-v1", revision: mocks.row?.revision ?? 0, ...extra });

beforeEach(() => {
  vi.resetAllMocks(); vi.unstubAllEnvs(); vi.stubEnv("OPENAI_API_KEY", "test"); mocks.row = null;
  mocks.auth.mockResolvedValue({ user: { id: "alice" } }); mocks.rate.mockReturnValue(true);
  mocks.recipe.mockResolvedValue({ recipe, tokens: 900 });
});

it("не пускает без входа и не тратит токены", async () => {
  mocks.auth.mockResolvedValue(null);
  expect((await GET()).status).toBe(401); expect((await generate()).status).toBe(401);
  expect(mocks.recipe).not.toHaveBeenCalled();
});
it("не обращается к ИИ без согласия, с неполной анкетой или при невозможном расписании", async () => {
  expect((await generate({ consent: undefined })).status).toBe(400);
  expect((await generate({ brief: { ...brief, goals: "мало" } })).status).toBe(400);
  expect((await generate({ brief: { ...brief, level: "hard" } })).status).toBe(400);
  expect(mocks.recipe).not.toHaveBeenCalled();
});
it("создаёт план одним вызовом ИИ, а старт, отметки и просмотр обходятся без него", async () => {
  const created = await generate(); expect(created.status).toBe(200);
  const { plan, revision, remaining } = await created.json();
  expect(plan.recipe.title).toBe("Месяц роста"); expect(plan.tokens).toBe(900); expect(remaining).toBe(1);
  const started = await (await post({ action: "start", offset: 0, revision, planId: plan.id })).json();
  const logged = await post({ action: "log", day: 0, blockId: "0:0", minutes: 45, revision: started.revision, planId: plan.id });
  expect(logged.status).toBe(200); expect((await logged.json()).plan.logs).toEqual({ "0:0": 45 });
  expect((await GET()).status).toBe(200);
  expect(mocks.recipe).toHaveBeenCalledTimes(1);
});
it("даёт не больше двух генераций в день, и неудачная попытка тоже считается", async () => {
  mocks.recipe.mockRejectedValueOnce(new Error("OpenAI is down"));
  const failed = await generate(); expect(failed.status).toBe(502); expect(await failed.text()).not.toContain("OpenAI is down");
  expect((await generate()).status).toBe(200);
  const third = await generate(); expect(third.status).toBe(400); expect((await third.json()).error).toMatch(/2 попытки/);
  expect(mocks.recipe).toHaveBeenCalledTimes(2);
});
it("не заменяет начатый челлендж новой генерацией и не принимает устаревшую вкладку", async () => {
  const { plan, revision } = await (await generate()).json();
  expect((await post({ action: "start", offset: 1, revision: revision - 1, planId: plan.id })).status).toBe(400);
  expect((await post({ action: "start", offset: 1, revision, planId: plan.id })).status).toBe(200);
  expect((await generate()).status).toBe(400);
  expect(mocks.recipe).toHaveBeenCalledTimes(1);
});
it("удаляет план только с подтверждением", async () => {
  const { revision } = await (await generate()).json();
  expect((await post({ action: "delete", revision })).status).toBe(400);
  const removed = await post({ action: "delete", confirm: true, revision }); expect(removed.status).toBe(200);
  expect((await removed.json()).plan).toBeNull();
});
it("останавливается на лимите запросов до любой работы с ИИ", async () => {
  mocks.rate.mockReturnValue(false);
  expect((await generate()).status).toBe(429); expect(mocks.recipe).not.toHaveBeenCalled();
});
