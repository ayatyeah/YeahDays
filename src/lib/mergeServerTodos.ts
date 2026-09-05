/**
 * Защита серверных задач от затирания клиентским снимком.
 *
 * Проблема. /api/state PUT заменяет UserState.data ЦЕЛИКОМ, конфликты
 * решаются last-write-wins по updatedAt. Пока пишет только браузер, это
 * работает. Но задачи умеют появляться и на сервере — их пишет
 * /api/cron/lms-sync (дедлайны из Moodle) и разовые скрипты импорта. Такая
 * задача существует, а в снимке браузера её нет: он был снят раньше и про
 * неё не знает. Следующий push — и задача молча исчезает.
 *
 * Воспроизвелось вживую: 26 задач расписания, записанных скриптом, пропали
 * после того, как приложение открыли в браузере со снимком, снятым до
 * импорта.
 *
 * Правило. Клиент прислал снимок, снятый в момент clientAt. Всё, что
 * создано на сервере ПОЗЖЕ этого момента, клиент физически не мог видеть —
 * значит отсутствие такой задачи в снимке не является её удалением.
 * Возвращаем такие задачи обратно в блоб.
 *
 * Чего правило намеренно НЕ делает: не воскрешает задачи, созданные до
 * снимка. Их клиент видел, и если он их не прислал — это осознанное
 * удаление, его надо уважать. Полноценное разрешение конфликтов
 * потребовало бы отметок об удалении на каждую задачу; здесь достаточно
 * закрыть ровно ту дыру, через которую утекают серверные записи.
 */

interface TodoLike {
  id?: unknown;
  createdAt?: unknown;
}

interface StateLike {
  todos?: unknown;
  [key: string]: unknown;
}

/** Задачи из снимка, пригодные для сравнения. */
function todosOf(state: unknown): TodoLike[] {
  if (!state || typeof state !== "object") return [];
  const todos = (state as StateLike).todos;
  return Array.isArray(todos) ? (todos as TodoLike[]) : [];
}

export interface MergeResult {
  /** Блоб клиента с возвращёнными серверными задачами. */
  data: unknown;
  /** Сколько задач спасено — для лога, чтобы такое не проходило незаметно. */
  restored: number;
}

/**
 * Вернуть в клиентский блоб серверные задачи, созданные после clientAt.
 *
 * incoming — то, что прислал браузер; existing — то, что сейчас в БД.
 */
export function mergeServerTodos(
  incoming: unknown,
  existing: unknown,
  clientAt: number,
): MergeResult {
  if (!incoming || typeof incoming !== "object") {
    return { data: incoming, restored: 0 };
  }

  const serverTodos = todosOf(existing);
  if (serverTodos.length === 0) return { data: incoming, restored: 0 };

  const clientTodos = todosOf(incoming);
  const known = new Set(
    clientTodos.map((t) => (typeof t.id === "string" ? t.id : "")).filter(Boolean),
  );

  const missed = serverTodos.filter((t) => {
    if (typeof t.id !== "string" || known.has(t.id)) return false;
    // Без createdAt судить не о чем — считаем, что клиент её видел.
    return typeof t.createdAt === "number" && t.createdAt > clientAt;
  });

  if (missed.length === 0) return { data: incoming, restored: 0 };

  return {
    data: { ...(incoming as StateLike), todos: [...missed, ...clientTodos] },
    restored: missed.length,
  };
}
