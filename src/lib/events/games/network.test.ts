import { describe, expect, it } from "vitest";
import { BROADCAST, HOSTS, binaryPoints, binaryRound, decide, fromBits, learn, samePorts, switchScript, toBinary, toBits, toHex, type MacTable } from "./network";

function seeded(seed: number) {
  return () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };
}

describe("двоичный спринт", () => {
  it("переводит числа так же, как в лекции: 192, 168 и D2", () => {
    expect(toBinary(192)).toBe("11000000");
    expect(toBinary(168)).toBe("10101000");
    expect(toHex(168)).toBe("A8");
    expect(toHex(10)).toBe("0A");
    expect(fromBits(toBits(0xd2))).toBe(210);
    for (let n = 0; n <= 255; n++) expect(fromBits(toBits(n))).toBe(n);
  });

  it("в раунде с выбором четыре разных варианта от 0 до 255, и верный среди них", () => {
    const rng = seeded(7);
    let previous: number | undefined;
    for (let i = 0; i < 400; i++) {
      const round = binaryRound(i % 20, rng, previous);
      expect(round.value).toBeGreaterThanOrEqual(1);
      expect(round.value).toBeLessThanOrEqual(255);
      expect(round.value).not.toBe(previous);
      if (round.kind === "pick") {
        expect(new Set(round.options).size).toBe(4);
        expect(round.options).toContain(round.value);
        expect(round.options.every((o) => o >= 0 && o <= 255)).toBe(true);
      }
      previous = round.value;
    }
  });

  it("сложность растёт: сначала без шестнадцатеричной записи", () => {
    const rng = seeded(3);
    for (let i = 0; i < 200; i++) expect(binaryRound(i % 10, rng).shown).not.toBe("hex");
    const later = Array.from({ length: 200 }, () => binaryRound(15, rng).shown);
    expect(later).toContain("hex");
  });

  it("серия добавляет очки, но не бесконечно", () => {
    expect(binaryPoints(0)).toBe(10);
    expect(binaryPoints(3)).toBe(16);
    expect(binaryPoints(50)).toBe(20);
  });
});

describe("ты — коммутатор", () => {
  const frame = (src: string, dst: string) => ({ src, dst, inPort: HOSTS.find((h) => h.mac === src)!.port });

  it("неизвестный адрес и broadcast — во все порты, кроме входящего", () => {
    expect(decide({}, frame("AA:AA", "BB:BB"))).toEqual({ ports: [2, 3, 4], reason: "unknown" });
    expect(decide({ "BB:BB": 2 }, frame("CC:CC", BROADCAST))).toEqual({ ports: [1, 2, 4], reason: "broadcast" });
  });

  it("известный адрес — только в его порт", () => {
    expect(decide({ "BB:BB": 2 }, frame("AA:AA", "BB:BB"))).toEqual({ ports: [2], reason: "known" });
  });

  it("получатель на том же порту — кадр никуда не пересылается", () => {
    expect(decide({ "EE:EE": 4 }, frame("DD:DD", "EE:EE"))).toEqual({ ports: [], reason: "same-port" });
    // Пока адрес соседа по концентратору неизвестен, кадр всё равно уходит в остальные порты.
    expect(decide({}, frame("DD:DD", "EE:EE")).ports).toEqual([1, 2, 3]);
  });

  it("учится по источнику, а не по получателю", () => {
    const table: MacTable = learn({}, frame("AA:AA", "BB:BB"));
    expect(table).toEqual({ "AA:AA": 1 });
    expect(decide(table, frame("BB:BB", "AA:AA")).ports).toEqual([1]);
  });

  it("порядок выбранных портов не важен", () => {
    expect(samePorts([4, 2, 3], [2, 3, 4])).toBe(true);
    expect(samePorts([2, 3], [2, 3, 4])).toBe(false);
    expect(samePorts([], [])).toBe(true);
  });

  it("в сценарии встречаются все четыре исхода и одна запись устаревает", () => {
    for (let seed = 1; seed <= 40; seed++) {
      const steps = switchScript(12, seeded(seed));
      expect(steps.filter((s) => s.kind === "frame").length).toBe(12);
      expect(steps.filter((s) => s.kind === "age").length).toBe(1);
      let table: MacTable = {};
      const reasons = new Set<string>();
      for (const step of steps) {
        if (step.kind === "age") {
          expect(table[step.mac], "устаревает только выученная запись").toBeDefined();
          delete table[step.mac];
          continue;
        }
        expect(step.frame.src).not.toBe(step.frame.dst);
        reasons.add(decide(table, step.frame).reason);
        table = learn(table, step.frame);
      }
      expect([...reasons].sort()).toEqual(["broadcast", "known", "same-port", "unknown"]);
    }
  });
});
