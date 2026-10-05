/**
 * Правила двух мини-игр ивента по компьютерным сетям. Только логика: экран
 * лежит в components/events/NetworkGame.tsx.
 *
 * Обе игры тренируют то, что на мидтерме спрашивают «на автомате»:
 * перевод между двоичной, десятичной и шестнадцатеричной записью и решение
 * коммутатора — куда отправить кадр.
 */

export type Rng = () => number;

/* ────────────────────────  Двоичный спринт  ──────────────────────── */

/** Веса позиций октета — тот самый ряд, которым решается любой перевод. */
export const WEIGHTS = [128, 64, 32, 16, 8, 4, 2, 1] as const;

export const toBits = (value: number): number[] => WEIGHTS.map((w) => (value & w ? 1 : 0));
export const fromBits = (bits: readonly number[]): number => bits.reduce((sum, bit, i) => sum + (bit ? WEIGHTS[i] : 0), 0);
export const toBinary = (value: number): string => toBits(value).join("");
export const toHex = (value: number): string => value.toString(16).toUpperCase().padStart(2, "0");

/**
 * Раунд спринта.
 * build — дано число (десятичное или hex), нужно набрать его битами;
 * pick  — дана двоичная или hex-запись, нужно выбрать десятичное значение.
 */
export type BinaryRound =
  | { kind: "build"; value: number; shown: "dec" | "hex" }
  | { kind: "pick"; value: number; shown: "bin" | "hex"; options: number[] };

/** Числа, которые встречаются в адресах и масках, — с них спринт начинается. */
const FAMILIAR = [192, 168, 128, 224, 240, 248, 252, 254, 255, 172, 127, 10, 16, 64, 32, 100, 200, 250];

const pickFrom = <T,>(list: readonly T[], rng: Rng): T => list[Math.floor(rng() * list.length)];

/**
 * Следующий раунд. Сложность растёт с числом решённых: сначала знакомые
 * числа и только десятичная запись, после пятого ответа — любые числа,
 * после десятого добавляется шестнадцатеричная. `previous` не повторяется
 * дважды подряд — иначе раунд решался бы, не глядя.
 */
export function binaryRound(solved: number, rng: Rng = Math.random, previous?: number): BinaryRound {
  let value = previous ?? 0;
  for (let guard = 0; guard < 20 && (guard === 0 || value === previous); guard++) {
    value = solved < 5 ? pickFrom(FAMILIAR, rng) : 1 + Math.floor(rng() * 255);
  }
  const hex = solved >= 10 && rng() < 0.4;
  if (rng() < 0.55) return { kind: "build", value, shown: hex ? "hex" : "dec" };

  // Неверные варианты отличаются от верного одним-двумя битами: так ошибаются
  // на самом деле — перепутав соседние веса, а не назвав случайное число.
  const options = new Set<number>([value]);
  for (let guard = 0; options.size < 4 && guard < 100; guard++) {
    let wrong = value ^ pickFrom(WEIGHTS, rng);
    if (rng() < 0.4) wrong ^= pickFrom(WEIGHTS, rng);
    if (wrong >= 0 && wrong <= 255) options.add(wrong);
  }
  for (let n = 0; options.size < 4; n++) options.add(n); // на случай совсем невезучего генератора
  const list = [...options];
  for (let i = list.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [list[i], list[j]] = [list[j], list[i]];
  }
  return { kind: "pick", value, shown: hex ? "hex" : "bin", options: list };
}

/** Очки за верный ответ: база плюс надбавка за серию без ошибок (не больше +10). */
export const binaryPoints = (streak: number) => 10 + Math.min(10, streak * 2);

/* ────────────────────────  Ты — коммутатор  ──────────────────────── */

export const PORTS = [1, 2, 3, 4] as const;
export const BROADCAST = "FF:FF";

export interface Host {
  name: string;
  mac: string;
  port: number;
}

/**
 * Сеть игры. На четвёртом порту — концентратор с двумя компьютерами: без
 * него не показать случай, когда получатель сидит на том же порту, откуда
 * пришёл кадр, и коммутатор его просто не пересылает.
 */
export const HOSTS: Host[] = [
  { name: "PC-A", mac: "AA:AA", port: 1 },
  { name: "PC-B", mac: "BB:BB", port: 2 },
  { name: "PC-C", mac: "CC:CC", port: 3 },
  { name: "PC-D", mac: "DD:DD", port: 4 },
  { name: "PC-E", mac: "EE:EE", port: 4 },
];

export interface Frame {
  src: string;
  dst: string;
  inPort: number;
}

/** Таблица MAC-адресов: адрес → порт. */
export type MacTable = Record<string, number>;

export type Reason = "broadcast" | "unknown" | "known" | "same-port";

/**
 * Решение коммутатора по кадру — то, что должен повторить игрок.
 *
 * Порядок как в лекции: широковещательный и неизвестный адрес — во все
 * порты, кроме входящего; известный — в один порт; а если этот порт и есть
 * входящий, пересылать некуда: получатель кадр уже получил.
 */
export function decide(table: MacTable, frame: Frame): { ports: number[]; reason: Reason } {
  const flood = PORTS.filter((p) => p !== frame.inPort);
  if (frame.dst === BROADCAST) return { ports: flood, reason: "broadcast" };
  const known = table[frame.dst];
  if (known === undefined) return { ports: flood, reason: "unknown" };
  if (known === frame.inPort) return { ports: [], reason: "same-port" };
  return { ports: [known], reason: "known" };
}

/** Коммутатор учится по адресу ИСТОЧНИКА: запоминает, на каком порту тот живёт. */
export function learn(table: MacTable, frame: Frame): MacTable {
  return { ...table, [frame.src]: frame.inPort };
}

export const samePorts = (a: readonly number[], b: readonly number[]) => a.length === b.length && [...a].sort().join() === [...b].sort().join();

/** Шаг игры: пришёл кадр или у записи таблицы истёк срок (по умолчанию 5 минут). */
export type SwitchStep = { kind: "frame"; frame: Frame } | { kind: "age"; mac: string };

/**
 * Сценарий на `count` кадров. Случайный, но не как попало: в нём обязательно
 * встречаются все четыре исхода — иначе можно было бы пройти игру, ни разу
 * не увидев широковещательный кадр или получателя на том же порту, — и один
 * раз запись в таблице устаревает, чтобы известный адрес снова стал неизвестным.
 */
export function switchScript(count = 12, rng: Rng = Math.random): SwitchStep[] {
  for (let attempt = 0; attempt < 200; attempt++) {
    const steps: SwitchStep[] = [];
    let table: MacTable = {};
    const seen = new Set<Reason>();
    let aged = false;
    for (let i = 0; i < count; i++) {
      // Во второй половине одна из выученных записей «стареет».
      const learned = Object.keys(table);
      if (!aged && i >= Math.floor(count / 2) && learned.length >= 3) {
        const mac = pickFrom(learned, rng);
        steps.push({ kind: "age", mac });
        table = Object.fromEntries(Object.entries(table).filter(([m]) => m !== mac));
        aged = true;
      }
      const src = pickFrom(HOSTS, rng);
      const others = HOSTS.filter((h) => h.mac !== src.mac);
      const dst = rng() < 0.15 ? BROADCAST : pickFrom(others, rng).mac;
      const frame = { src: src.mac, dst, inPort: src.port };
      seen.add(decide(table, frame).reason);
      steps.push({ kind: "frame", frame });
      table = learn(table, frame);
    }
    if (seen.size === 4 && aged) return steps;
  }
  // Запасной сценарий — если генератор двести раз подряд не выдал все исходы.
  const f = (src: string, dst: string): SwitchStep => ({ kind: "frame", frame: { src, dst, inPort: HOSTS.find((h) => h.mac === src)!.port } });
  const fallback: SwitchStep[] = [f("AA:AA", "BB:BB"), f("BB:BB", "AA:AA"), f("CC:CC", BROADCAST), f("DD:DD", "EE:EE"), f("EE:EE", "DD:DD"), f("AA:AA", "CC:CC"), { kind: "age", mac: "BB:BB" }, f("CC:CC", "BB:BB"), f("BB:BB", "DD:DD"), f("DD:DD", "AA:AA"), f("EE:EE", BROADCAST), f("AA:AA", "EE:EE"), f("CC:CC", "DD:DD")];
  return fallback.slice(0, count + 1);
}
