"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import {
  BROADCAST, HOSTS, PORTS, WEIGHTS,
  binaryPoints, binaryRound, decide, fromBits, learn, samePorts, switchScript, toBinary, toHex,
  type BinaryRound, type MacTable, type Reason, type SwitchStep,
} from "@/lib/events/games/network";
import { loadPref, savePref } from "@/lib/events/storage";

/**
 * Мини-игры ивента по компьютерным сетям.
 *
 * Квиз проверяет, помнишь ли ты правило; игра заставляет применить его
 * двадцать раз за минуту. Режимов два, и оба — про то, что на мидтерме
 * решают руками: перевод чисел и решение коммутатора по кадру.
 *
 * Лучший результат хранится на устройстве, отдельно для каждого аккаунта:
 * это разминка, а не оценка, и в готовность ивента он не входит.
 */

const panel = "rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5";
type Mode = "menu" | "binary" | "switch";

const best = (userId: string, game: string) => Number(loadPref(`game-${game}:${userId}`, "0")) || 0;
/** Записать результат, если он лучше прежнего; true — это новый рекорд. */
function submit(userId: string, game: string, score: number) {
  if (score <= best(userId, game)) return false;
  savePref(`game-${game}:${userId}`, String(score));
  return true;
}

export default function NetworkGame({ userId }: { userId: string }) {
  const [mode, setMode] = useState<Mode>("menu");
  const [records, setRecords] = useState({ binary: 0, switch: 0 });
  const refresh = useCallback(() => setRecords({ binary: best(userId, "binary"), switch: best(userId, "switch") }), [userId]);
  useEffect(refresh, [refresh]);
  const back = () => { refresh(); setMode("menu"); };

  if (mode === "binary") return <BinarySprint userId={userId} onExit={back} />;
  if (mode === "switch") return <SwitchIt userId={userId} onExit={back} />;

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <button className={cn(panel, "bg-gradient-to-br from-emerald-500/15 via-[var(--color-surface)] to-sky-500/10 text-left")} onClick={() => setMode("binary")}>
        <p data-no-i18n aria-hidden className="font-mono text-2xl font-bold tracking-widest text-emerald-400">1100 0000</p>
        <h2 className="mt-3 text-xl font-bold">Двоичный спринт</h2>
        <p className="mt-2 text-sm leading-relaxed text-[var(--color-fg-dim)]">60 секунд. Собирай числа из битов и читай двоичную и шестнадцатеричную запись. Серия без ошибок даёт больше очков.</p>
        <p className="mt-4 text-sm">Рекорд: <strong className="tabular-nums">{records.binary}</strong></p>
        <p className="mt-2 font-semibold">Играть →</p>
      </button>
      <button className={cn(panel, "bg-gradient-to-br from-violet-500/15 via-[var(--color-surface)] to-amber-500/10 text-left")} onClick={() => setMode("switch")}>
        <p data-no-i18n aria-hidden className="font-mono text-2xl font-bold tracking-widest text-violet-400">▣ ▣ ▣ ▣</p>
        <h2 className="mt-3 text-xl font-bold">Ты — коммутатор</h2>
        <p className="mt-2 text-sm leading-relaxed text-[var(--color-fg-dim)]">В порт приходит кадр. Реши, в какие порты его отправить, и следи за таблицей MAC-адресов: она заполняется на твоих глазах.</p>
        <p className="mt-4 text-sm">Рекорд: <strong className="tabular-nums">{records.switch}</strong> из 12</p>
        <p className="mt-2 font-semibold">Играть →</p>
      </button>
    </div>
  );
}

/* ────────────────────────  Двоичный спринт  ──────────────────────── */

const SPRINT_SECONDS = 60;
const PENALTY_SECONDS = 4;

function BinarySprint({ userId, onExit }: { userId: string; onExit: () => void }) {
  const [phase, setPhase] = useState<"ready" | "play" | "over">("ready");
  const [round, setRound] = useState<BinaryRound | null>(null);
  const [bits, setBits] = useState<number[]>(() => Array(8).fill(0));
  const [left, setLeft] = useState(SPRINT_SECONDS);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [solved, setSolved] = useState(0);
  const [flash, setFlash] = useState<"good" | "bad" | null>(null);
  const [record, setRecord] = useState(false);
  // Момент окончания, а не счётчик «минус секунда»: так таймер не отстаёт,
  // когда вкладку свернули или телефон притормозил.
  const deadline = useRef(0);

  const next = useCallback((done: number, previous?: number) => {
    setRound(binaryRound(done, Math.random, previous));
    setBits(Array(8).fill(0));
  }, []);

  function start() {
    deadline.current = Date.now() + SPRINT_SECONDS * 1000;
    setLeft(SPRINT_SECONDS);
    setScore(0);
    setStreak(0);
    setSolved(0);
    setRecord(false);
    setPhase("play");
    next(0);
  }

  useEffect(() => {
    if (phase !== "play") return;
    const timer = setInterval(() => {
      const remaining = Math.max(0, Math.ceil((deadline.current - Date.now()) / 1000));
      setLeft(remaining);
      if (remaining === 0) setPhase("over");
    }, 200);
    return () => clearInterval(timer);
  }, [phase]);

  useEffect(() => {
    if (phase === "over") setRecord(submit(userId, "binary", score));
    // Рекорд записывается один раз — в момент окончания, а не при каждом изменении счёта.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  function blink(kind: "good" | "bad") {
    setFlash(kind);
    setTimeout(() => setFlash(null), 260);
  }

  function correct() {
    if (!round) return;
    setScore((s) => s + binaryPoints(streak));
    setStreak((s) => s + 1);
    setSolved((n) => n + 1);
    blink("good");
    next(solved + 1, round.value);
  }

  function wrong() {
    setStreak(0);
    deadline.current -= PENALTY_SECONDS * 1000;
    blink("bad");
  }

  function toggle(index: number) {
    if (phase !== "play" || round?.kind !== "build") return;
    const updated = bits.map((b, i) => (i === index ? 1 - b : b));
    setBits(updated);
    if (fromBits(updated) === round.value) correct();
  }

  if (phase === "ready") {
    return (
      <section className={cn(panel, "space-y-4")}>
        <h2 className="text-xl font-bold">Двоичный спринт</h2>
        <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed">
          <li>Дано число — нажимай на биты, пока сумма весов не совпадёт. Ряд весов всегда перед глазами: 128, 64, 32, 16, 8, 4, 2, 1.</li>
          <li>Дана двоичная или шестнадцатеричная запись — выбери десятичное значение из четырёх.</li>
          <li>Верный ответ: 10 очков и +2 за каждый ответ в серии. Ошибка в выборе: серия сгорает и минус {PENALTY_SECONDS} секунды.</li>
          <li>Сначала идут числа из адресов и масок, потом любые, после десятого ответа — шестнадцатеричные.</li>
        </ul>
        <div className="flex flex-wrap gap-2">
          <Button variant="primary" onClick={start}>Старт · {SPRINT_SECONDS} секунд</Button>
          <Button onClick={onExit}>К играм</Button>
        </div>
      </section>
    );
  }

  if (phase === "over") {
    return (
      <section className={cn(panel, "space-y-3 text-center")}>
        <p className="text-sm uppercase tracking-widest text-[var(--color-muted)]">Время вышло</p>
        <p className="text-6xl font-bold tabular-nums">{score}</p>
        <p className="text-sm text-[var(--color-fg-dim)]">Верных ответов: <span className="tabular-nums">{solved}</span></p>
        {record ? <p className="font-semibold text-emerald-400">Новый рекорд!</p> : <p className="text-sm">Рекорд: <span className="tabular-nums">{best(userId, "binary")}</span></p>}
        <div className="flex flex-wrap justify-center gap-2 pt-2">
          <Button variant="primary" onClick={start}>Ещё раз</Button>
          <Button onClick={onExit}>К играм</Button>
        </div>
      </section>
    );
  }

  if (!round) return null;
  const sum = fromBits(bits);

  return (
    <section className={cn(panel, "space-y-5 transition-colors", flash === "good" && "border-emerald-400", flash === "bad" && "border-[var(--color-strength)]")}>
      <div className="flex items-center justify-between gap-3 text-sm">
        <span>Очки: <strong className="tabular-nums">{score}</strong></span>
        <span>Серия: <strong className="tabular-nums">{streak}</strong></span>
        <span className={cn("rounded-full px-3 py-1 font-semibold tabular-nums", left <= 10 ? "bg-[var(--color-strength)]/20 text-[var(--color-strength)]" : "bg-[var(--color-surface-2)]")} role="timer" aria-label="Осталось секунд">{left}</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-[var(--color-surface-2)]" aria-hidden>
        <div className="h-full rounded-full bg-emerald-400 transition-[width] duration-200" style={{ width: `${(left / SPRINT_SECONDS) * 100}%` }} />
      </div>

      {round.kind === "build" ? (
        <>
          <div className="text-center">
            <p className="text-sm text-[var(--color-muted)]">{round.shown === "hex" ? "Набери битами шестнадцатеричное число" : "Набери битами десятичное число"}</p>
            <p data-no-i18n className="mt-1 font-mono text-6xl font-bold tabular-nums">{round.shown === "hex" ? `0x${toHex(round.value)}` : round.value}</p>
          </div>
          <div className="grid grid-cols-8 gap-1.5" role="group" aria-label="Биты октета">
            {WEIGHTS.map((weight, i) => (
              <button
                key={weight}
                data-no-i18n
                aria-pressed={bits[i] === 1}
                aria-label={`${weight}`}
                className={cn("flex flex-col items-center rounded-xl border py-2 transition-transform active:scale-95", bits[i] ? "border-emerald-400 bg-emerald-500/20" : "border-[var(--color-border-strong)] bg-[var(--color-surface-2)]")}
                onClick={() => toggle(i)}
              >
                <span className="text-[10px] text-[var(--color-muted)] tabular-nums">{weight}</span>
                <span className="font-mono text-2xl font-bold">{bits[i]}</span>
              </button>
            ))}
          </div>
          <p className="text-center text-sm text-[var(--color-fg-dim)]">Сейчас набрано: <strong data-no-i18n className="tabular-nums">{sum}</strong></p>
        </>
      ) : (
        <>
          <div className="text-center">
            <p className="text-sm text-[var(--color-muted)]">Чему это равно в десятичной системе?</p>
            <p data-no-i18n className="mt-1 font-mono text-4xl font-bold tracking-wider">{round.shown === "hex" ? `0x${toHex(round.value)}` : toBinary(round.value).replace(/(.{4})/, "$1 ")}</p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {round.options.map((option) => (
              <button key={option} data-no-i18n className="min-h-14 rounded-2xl border border-[var(--color-border-strong)] bg-[var(--color-surface-2)] font-mono text-2xl font-bold tabular-nums transition-transform active:scale-95" onClick={() => (option === round.value ? correct() : wrong())}>
                {option}
              </button>
            ))}
          </div>
        </>
      )}
      <button className="mx-auto block text-sm underline" onClick={onExit}>Выйти из игры</button>
    </section>
  );
}

/* ────────────────────────  Ты — коммутатор  ──────────────────────── */

const FRAMES = 12;
const hostName = (mac: string) => (mac === BROADCAST ? "все" : HOSTS.find((h) => h.mac === mac)?.name ?? mac);

/** Почему верно именно так — словами лекции. */
function explain(reason: Reason, dst: string, ports: number[]): string {
  if (reason === "broadcast") return "Широковещательный кадр рассылается во все порты, кроме входящего.";
  if (reason === "unknown") return `Адреса ${dst} нет в таблице — это неизвестный unicast: во все порты, кроме входящего.`;
  if (reason === "same-port") return `Адрес ${dst} находится на том же порту, откуда пришёл кадр. Получатель его уже получил — пересылать некуда.`;
  return `Адрес ${dst} есть в таблице: только в порт ${ports[0]}.`;
}

function SwitchIt({ userId, onExit }: { userId: string; onExit: () => void }) {
  const [script, setScript] = useState<SwitchStep[]>(() => switchScript(FRAMES));
  const [index, setIndex] = useState(0);
  const [table, setTable] = useState<MacTable>({});
  const [picked, setPicked] = useState<number[]>([]);
  const [verdict, setVerdict] = useState<{ ok: boolean; text: string; ports: number[]; learned: string | null } | null>(null);
  const [score, setScore] = useState(0);
  const [number, setNumber] = useState(1);
  const [notice, setNotice] = useState("");
  const [record, setRecord] = useState(false);

  // Шаг «запись устарела» игрок не решает: убираем запись и идём к следующему кадру.
  useEffect(() => {
    const step = script[index];
    if (step?.kind !== "age") return;
    setTable((t) => Object.fromEntries(Object.entries(t).filter(([mac]) => mac !== step.mac)));
    setNotice(`Прошло 5 минут без кадров от ${step.mac}: запись удалена из таблицы.`);
    setIndex((i) => i + 1);
  }, [script, index]);

  const step = script[index];
  const over = index >= script.length;
  const answer = useMemo(() => (step?.kind === "frame" ? decide(table, step.frame) : null), [step, table]);

  useEffect(() => {
    if (over) setRecord(submit(userId, "switch", score));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [over]);

  function restart() {
    setScript(switchScript(FRAMES));
    setIndex(0);
    setTable({});
    setPicked([]);
    setVerdict(null);
    setScore(0);
    setNumber(1);
    setNotice("");
    setRecord(false);
  }

  function send(ports: number[]) {
    if (step?.kind !== "frame" || !answer || verdict) return;
    const ok = samePorts(ports, answer.ports);
    if (ok) setScore((s) => s + 1);
    const known = table[step.frame.src] === step.frame.inPort;
    setVerdict({ ok, text: explain(answer.reason, step.frame.dst, answer.ports), ports: answer.ports, learned: known ? null : step.frame.src });
    setTable(learn(table, step.frame));
    setNotice("");
  }

  function proceed() {
    setVerdict(null);
    setPicked([]);
    setNumber((n) => n + 1);
    setIndex((i) => i + 1);
  }

  if (over) {
    return (
      <section className={cn(panel, "space-y-3 text-center")}>
        <p className="text-sm uppercase tracking-widest text-[var(--color-muted)]">Смена окончена</p>
        <p className="text-6xl font-bold tabular-nums">{score}<span className="text-2xl text-[var(--color-muted)]"> / {FRAMES}</span></p>
        <p className="text-sm text-[var(--color-fg-dim)]">{score === FRAMES ? "Ни одного кадра не туда. Так и работает настоящий коммутатор." : score >= 9 ? "Почти без потерь. Перечитай правило про неизвестный адрес и тот же порт." : "Главное правило: учимся по источнику, пересылаем по назначению; не знаем — всем, кроме входящего."}</p>
        {record ? <p className="font-semibold text-emerald-400">Новый рекорд!</p> : <p className="text-sm">Рекорд: <span className="tabular-nums">{best(userId, "switch")}</span> из {FRAMES}</p>}
        <div className="flex flex-wrap justify-center gap-2 pt-2">
          <Button variant="primary" onClick={restart}>Ещё раз</Button>
          <Button onClick={onExit}>К играм</Button>
        </div>
      </section>
    );
  }

  if (step?.kind !== "frame") return null;
  const frame = step.frame;

  return (
    <section className={cn(panel, "space-y-4")}>
      <div className="flex items-center justify-between text-sm">
        <span>Кадр <strong className="tabular-nums">{Math.min(number, FRAMES)}</strong> из {FRAMES}</span>
        <span>Верно: <strong className="tabular-nums">{score}</strong></span>
      </div>

      {notice && <p role="status" className="rounded-2xl bg-amber-500/15 px-4 py-3 text-sm">{notice}</p>}

      <div className="rounded-2xl border border-violet-400/40 bg-violet-500/10 p-4">
        <p className="text-xs uppercase tracking-widest text-[var(--color-muted)]">Пришёл кадр в порт <span data-no-i18n className="tabular-nums">{frame.inPort}</span></p>
        <dl className="mt-2 grid grid-cols-2 gap-3">
          <div>
            <dt className="text-xs text-[var(--color-muted)]">MAC источника</dt>
            <dd data-no-i18n className="font-mono text-xl font-bold">{frame.src}</dd>
            <dd data-no-i18n className="text-xs text-[var(--color-fg-dim)]">{hostName(frame.src)}</dd>
          </div>
          <div>
            <dt className="text-xs text-[var(--color-muted)]">MAC назначения</dt>
            <dd data-no-i18n className="font-mono text-xl font-bold">{frame.dst}</dd>
            <dd className="text-xs text-[var(--color-fg-dim)]">{frame.dst === BROADCAST ? "broadcast — всем" : <span data-no-i18n>{hostName(frame.dst)}</span>}</dd>
          </div>
        </dl>
      </div>

      <div>
        <p className="text-sm font-semibold">В какие порты отправить?</p>
        <div className="mt-2 grid grid-cols-4 gap-2" role="group" aria-label="Порты коммутатора">
          {PORTS.map((port) => {
            const on = verdict ? verdict.ports.includes(port) : picked.includes(port);
            const mistaken = !!verdict && picked.includes(port) !== verdict.ports.includes(port);
            return (
              <button
                key={port}
                aria-pressed={picked.includes(port)}
                aria-label={`Порт ${port}`}
                disabled={!!verdict}
                className={cn(
                  "flex min-h-20 flex-col items-center justify-center rounded-2xl border text-center transition-transform active:scale-95",
                  on ? "border-violet-400 bg-violet-500/25" : "border-[var(--color-border-strong)] bg-[var(--color-surface-2)]",
                  verdict && on && "border-emerald-400 bg-emerald-500/20",
                  mistaken && "ring-2 ring-[var(--color-strength)]",
                )}
                onClick={() => setPicked((list) => (list.includes(port) ? list.filter((p) => p !== port) : [...list, port]))}
              >
                <span data-no-i18n className="text-xl font-bold tabular-nums">{port}</span>
                <span data-no-i18n className="text-[10px] leading-tight text-[var(--color-fg-dim)]">{HOSTS.filter((h) => h.port === port).map((h) => h.name).join(" + ")}</span>
                {port === frame.inPort && <span className="text-[10px] font-semibold text-amber-400">вход</span>}
              </button>
            );
          })}
        </div>
        <p className="mt-2 text-xs text-[var(--color-muted)]">На порту 4 — концентратор с двумя компьютерами.</p>
      </div>

      {verdict ? (
        <div className={cn("rounded-2xl px-4 py-3 text-sm", verdict.ok ? "bg-emerald-500/15" : "bg-[var(--color-strength)]/15")} role="status">
          <p className="font-semibold">{verdict.ok ? "Верно" : "Не так"}</p>
          <p className="mt-1">{verdict.text}</p>
          {verdict.learned && <p className="mt-1 text-[var(--color-fg-dim)]">Коммутатор запомнил: <span data-no-i18n className="font-mono">{verdict.learned}</span> → порт <span data-no-i18n>{frame.inPort}</span>.</p>}
          <Button variant="primary" className="mt-3 w-full" onClick={proceed}>{index + 1 >= script.length ? "Итог" : "Следующий кадр"}</Button>
        </div>
      ) : (
        <div className="grid gap-2 sm:grid-cols-2">
          <Button variant="primary" className="h-auto min-h-11 whitespace-normal" disabled={picked.length === 0} onClick={() => send(picked)}>Отправить в выбранные порты</Button>
          <Button className="h-auto min-h-11 whitespace-normal" onClick={() => send([])}>Никуда не отправлять</Button>
        </div>
      )}

      <div>
        <p className="text-sm font-semibold">Таблица MAC-адресов</p>
        {Object.keys(table).length === 0 ? (
          <p className="mt-1 text-sm text-[var(--color-muted)]">Пока пусто — коммутатор только что включили.</p>
        ) : (
          <ul data-no-i18n className="mt-2 grid grid-cols-2 gap-1.5 font-mono text-sm sm:grid-cols-3">
            {Object.entries(table).sort(([a], [b]) => a.localeCompare(b)).map(([mac, port]) => (
              <li key={mac} className="flex justify-between rounded-xl bg-[var(--color-surface-2)] px-3 py-1.5"><span>{mac}</span><span className="text-[var(--color-fg-dim)]">Fa0/{port}</span></li>
            ))}
          </ul>
        )}
      </div>
      <button className="mx-auto block text-sm underline" onClick={onExit}>Выйти из игры</button>
    </section>
  );
}
