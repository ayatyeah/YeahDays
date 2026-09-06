import { describe, it, expect } from "vitest";
import { mergeServerTodos } from "@/lib/mergeServerTodos";

const SNAPSHOT_AT = 1_000_000;

function todo(id: string, createdAt: number) {
  return { id, title: id, createdAt };
}

describe("mergeServerTodos", () => {
  it("возвращает задачу, созданную на сервере ПОСЛЕ снимка клиента", () => {
    // Ровно случай LMS-крона: дедлайн записан, пока вкладка была закрыта.
    const incoming = { todos: [todo("своя", 500)], updatedAt: SNAPSHOT_AT };
    const existing = { todos: [todo("своя", 500), todo("дедлайн", SNAPSHOT_AT + 10)] };

    const r = mergeServerTodos(incoming, existing, SNAPSHOT_AT);
    expect(r.restored).toBe(1);
    expect((r.data as { todos: { id: string }[] }).todos.map((t) => t.id)).toEqual([
      "дедлайн",
      "своя",
    ]);
  });

  it("НЕ воскрешает задачу, созданную до снимка — это осознанное удаление", () => {
    const incoming = { todos: [], updatedAt: SNAPSHOT_AT };
    const existing = { todos: [todo("удалённая", SNAPSHOT_AT - 10)] };

    const r = mergeServerTodos(incoming, existing, SNAPSHOT_AT);
    expect(r.restored).toBe(0);
    expect((r.data as { todos: unknown[] }).todos).toEqual([]);
  });

  it("не дублирует задачу, которая уже есть у клиента", () => {
    const incoming = { todos: [todo("дедлайн", SNAPSHOT_AT + 10)], updatedAt: SNAPSHOT_AT };
    const existing = { todos: [todo("дедлайн", SNAPSHOT_AT + 10)] };

    const r = mergeServerTodos(incoming, existing, SNAPSHOT_AT);
    expect(r.restored).toBe(0);
    expect((r.data as { todos: unknown[] }).todos).toHaveLength(1);
  });

  it("задачу без createdAt не трогает — судить не о чем", () => {
    const incoming = { todos: [], updatedAt: SNAPSHOT_AT };
    const existing = { todos: [{ id: "древняя", title: "x" }] };

    expect(mergeServerTodos(incoming, existing, SNAPSHOT_AT).restored).toBe(0);
  });

  it("пустой сервер ничего не добавляет", () => {
    const incoming = { todos: [todo("своя", 500)], updatedAt: SNAPSHOT_AT };
    expect(mergeServerTodos(incoming, null, SNAPSHOT_AT).restored).toBe(0);
    expect(mergeServerTodos(incoming, {}, SNAPSHOT_AT).restored).toBe(0);
  });

  it("остальные поля блоба не трогает", () => {
    const incoming = { todos: [], plan: [1, 2], history: { x: 1 }, updatedAt: SNAPSHOT_AT };
    const existing = { todos: [todo("новая", SNAPSHOT_AT + 5)] };

    const r = mergeServerTodos(incoming, existing, SNAPSHOT_AT) as {
      data: Record<string, unknown>;
    };
    expect(r.data.plan).toEqual([1, 2]);
    expect(r.data.history).toEqual({ x: 1 });
    expect(r.data.updatedAt).toBe(SNAPSHOT_AT);
  });

  it("мусор вместо блоба не роняет запись", () => {
    expect(mergeServerTodos(null, { todos: [todo("a", 9e9)] }, SNAPSHOT_AT).restored).toBe(0);
  });
});

describe("mergeServerTodos: customActions", () => {
  function action(id: string, createdAt?: number) {
    return createdAt === undefined ? { id, title: id } : { id, title: id, createdAt };
  }

  it("возвращает действие колоды, записанное на сервере после снимка", () => {
    // Скрипт заполнения колоды пишет, пока вкладка закрыта; без защиты
    // первый же push стирал бы всё — ровно как пропало расписание.
    const incoming = { customActions: [], todos: [], updatedAt: SNAPSHOT_AT };
    const existing = { customActions: [action("custom-flutter", SNAPSHOT_AT + 10)] };

    const r = mergeServerTodos(incoming, existing, SNAPSHOT_AT);
    expect(r.restored).toBe(1);
    expect((r.data as { customActions: { id: string }[] }).customActions.map((a) => a.id)).toEqual([
      "custom-flutter",
    ]);
  });

  it("действие БЕЗ createdAt не защищается — таким его создаёт сам клиент", () => {
    // Из формы в приложении Action приходит без createdAt: клиент его
    // видел по определению, и его отсутствие в снимке — удаление.
    const incoming = { customActions: [], updatedAt: SNAPSHOT_AT };
    const existing = { customActions: [action("custom-manual")] };

    expect(mergeServerTodos(incoming, existing, SNAPSHOT_AT).restored).toBe(0);
  });

  it("todos и customActions защищаются независимо, restored суммируется", () => {
    const incoming = { todos: [], customActions: [], updatedAt: SNAPSHOT_AT };
    const existing = {
      todos: [todo("дедлайн", SNAPSHOT_AT + 5)],
      customActions: [action("custom-a", SNAPSHOT_AT + 5), action("custom-b", SNAPSHOT_AT + 6)],
    };

    const r = mergeServerTodos(incoming, existing, SNAPSHOT_AT);
    expect(r.restored).toBe(3);
    const d = r.data as { todos: unknown[]; customActions: unknown[] };
    expect(d.todos).toHaveLength(1);
    expect(d.customActions).toHaveLength(2);
  });

  it("клиент, уже знающий действие, не получает дубль", () => {
    const incoming = { customActions: [action("custom-a", SNAPSHOT_AT + 5)], updatedAt: SNAPSHOT_AT };
    const existing = { customActions: [action("custom-a", SNAPSHOT_AT + 5)] };

    const r = mergeServerTodos(incoming, existing, SNAPSHOT_AT);
    expect(r.restored).toBe(0);
    expect((r.data as { customActions: unknown[] }).customActions).toHaveLength(1);
  });
});
