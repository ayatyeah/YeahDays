import { beforeEach, expect, it, vi } from "vitest";
const m = vi.hoisted(() => {
  const task = { findMany: vi.fn(), findFirst: vi.fn(), create: vi.fn(), findUnique: vi.fn(), update: vi.fn(), deleteMany: vi.fn() };
  const prisma = {
    trackerTask: task,
    trackerMember: { findUnique: vi.fn(), findMany: vi.fn() },
    trackerComment: { groupBy: vi.fn() },
    $transaction: vi.fn(),
  };
  return { auth: vi.fn(), prisma };
});
vi.mock("@/auth", () => ({ auth: m.auth }));
vi.mock("@/lib/db", () => ({ prisma: m.prisma }));
import { GET, POST } from "./route";
import { DELETE, PATCH } from "./[key]/route";

const ctx = (key: string) => ({ params: Promise.resolve({ key }) });
const body = (data: object, method = "POST") => new Request("https://test/api/team/tasks", { method, body: JSON.stringify(data) });

beforeEach(() => {
  vi.resetAllMocks();
  process.env.OWNER_EMAIL = "Owner@Example.com";
  m.auth.mockResolvedValue({ user: { email: "owner@example.com", name: "Ayat" } });
  m.prisma.trackerMember.findUnique.mockResolvedValue(null);
  m.prisma.trackerMember.findMany.mockResolvedValue([]);
  m.prisma.trackerTask.findMany.mockResolvedValue([]);
  m.prisma.trackerComment.groupBy.mockResolvedValue([]);
  m.prisma.$transaction.mockImplementation(async (fn: (tx: typeof m.prisma) => unknown) => fn(m.prisma));
});

it("requires a session and team membership", async () => {
  m.auth.mockResolvedValue(null);
  expect((await GET()).status).toBe(401);
  m.auth.mockResolvedValue({ user: { email: "stranger@example.com" } });
  expect((await GET()).status).toBe(403);
  expect((await POST(body({ summary: "x" }))).status).toBe(403);
  expect(m.prisma.trackerTask.create).not.toHaveBeenCalled();
});

it("lets the owner and added members read the board", async () => {
  expect((await GET()).status).toBe(200);
  m.auth.mockResolvedValue({ user: { email: "yernar@example.com" } });
  m.prisma.trackerMember.findUnique.mockResolvedValue({ email: "yernar@example.com", name: "Yernar" });
  const res = await GET();
  expect(res.status).toBe(200);
  expect((await res.json()).me).toEqual({ email: "yernar@example.com", name: "Yernar", isOwner: false });
});

it("creates the next YG number and records who created it", async () => {
  m.prisma.trackerTask.findFirst.mockResolvedValue({ number: 56 });
  m.prisma.trackerTask.create.mockImplementation(async ({ data }: { data: object }) => data);
  const res = await POST(body({ summary: "Upgrade Prisma to 7", priority: "High" }));
  expect(res.status).toBe(201);
  const data = m.prisma.trackerTask.create.mock.calls[0][0].data;
  expect(data).toMatchObject({ number: 57, summary: "Upgrade Prisma to 7", priority: "High", createdBy: "Ayat" });
  expect(data.activity.create).toMatchObject({ actor: "Ayat", field: "created" });
});

it("rejects invalid fields before touching the database", async () => {
  expect((await POST(body({ summary: "x", state: "Doing" }))).status).toBe(400);
  expect((await POST(body({}))).status).toBe(400);
  expect(m.prisma.trackerTask.create).not.toHaveBeenCalled();
});

it("logs only changed fields on update", async () => {
  m.prisma.trackerTask.findUnique.mockResolvedValue({ number: 29, state: "Open", assignee: "Yernar" });
  m.prisma.trackerTask.update.mockImplementation(async ({ data }: { data: object }) => data);
  const res = await PATCH(body({ state: "In Progress", assignee: "Yernar" }, "PATCH"), ctx("YG-29"));
  expect(res.status).toBe(200);
  const data = m.prisma.trackerTask.update.mock.calls[0][0].data;
  expect(data.activity.create).toEqual([{ field: "state", fromValue: "Open", toValue: "In Progress", actor: "Ayat" }]);
});

it("returns 404 for unknown keys and lets only the owner delete", async () => {
  expect((await PATCH(body({ state: "Done" }, "PATCH"), ctx("DIP-3"))).status).toBe(404);
  m.auth.mockResolvedValue({ user: { email: "yernar@example.com" } });
  m.prisma.trackerMember.findUnique.mockResolvedValue({ email: "yernar@example.com", name: "Yernar" });
  expect((await DELETE(new Request("https://test"), ctx("YG-1"))).status).toBe(403);
  expect(m.prisma.trackerTask.deleteMany).not.toHaveBeenCalled();
});
