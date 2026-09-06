/**
 * Защита серверных записей от затирания клиентским снимком.
 *
 * Проблема. /api/state PUT заменяет UserState.data ЦЕЛИКОМ, конфликты
 * решаются last-write-wins по updatedAt. Пока пишет только браузер, это
 * работает. Но часть данных умеет появляться и на сервере: задачи пишет
 * /api/cron/lms-sync (дедлайны из Moodle) и скрипты импорта, действия
 * колоды — скрипт заполнения. Такая запись существует, а в снимке
 * браузера её нет: он был снят раньше и про неё не знает. Следующий push
 * — и запись молча исчезает.
 *
 * Воспроизвелось вживую: 26 задач расписания, записанных скриптом,
 * пропали после того, как приложение открыли в браузере со снимком,
 * снятым до импорта.
 *
 * Правило. Клиент прислал снимок, снятый в момент clientAt. Всё, что
 * создано на сервере ПОЗЖЕ этого момента, клиент физически не мог видеть —
 * значит отсутствие такой записи в снимке не является её удалением.
 * Возвращаем такие записи обратно в блоб.
 *
 * Чего правило намеренно НЕ делает: не воскрешает записи, созданные до
 * снимка. Их клиент видел, и если он их не прислал — это осознанное
 * удаление, его надо уважать. Полноценное разрешение конфликтов
 * потребовало бы отметок об удалении на каждую запись; здесь достаточно
 * закрыть ровно ту дыру, через которую утекают серверные записи.
 *
 * Покрытые списки: todos и customActions. У Action в типе нет createdAt —
 * серверный скрипт проставляет его сам как лишнее поле в JSON; без него
 * действие считается виденным клиентом и не защищается.
 */

interface Stamped {
  id?: unknown;
  createdAt?: unknown;
}

type StateLike = Record<string, unknown>;

/** Списки, которые сервер умеет пополнять сам и которые надо беречь. */
const PROTECTED_LISTS = ["todos", "customActions"] as const;

function listOf(state: unknown, key: string): Stamped[] {
  if (!state || typeof state !== "object") return [];
  const v = (state as StateLike)[key];
  return Array.isArray(v) ? (v as Stamped[]) : [];
}

/** Записи сервера, которых у клиента нет и которые он не мог видеть. */
function missedAfter(server: Stamped[], client: Stamped[], clientAt: number): Stamped[] {
  const known = new Set(
    client.map((t) => (typeof t.id === "string" ? t.id : "")).filter(Boolean),
  );
  return server.filter((t) => {
    if (typeof t.id !== "string" || known.has(t.id)) return false;
    // Без createdAt судить не о чем — считаем, что клиент запись видел.
    return typeof t.createdAt === "number" && t.createdAt > clientAt;
  });
}

export interface MergeResult {
  /** Блоб клиента с возвращёнными серверными записями. */
  data: unknown;
  /** Сколько записей спасено — для лога, чтобы такое не проходило незаметно. */
  restored: number;
}

/**
 * Вернуть в клиентский блоб серверные записи, созданные после clientAt.
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

  let data: StateLike = incoming as StateLike;
  let restored = 0;

  for (const key of PROTECTED_LISTS) {
    const server = listOf(existing, key);
    if (server.length === 0) continue;
    const client = listOf(incoming, key);
    const missed = missedAfter(server, client, clientAt);
    if (missed.length === 0) continue;
    data = { ...data, [key]: [...missed, ...client] };
    restored += missed.length;
  }

  return { data, restored };
}
