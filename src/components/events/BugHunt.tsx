"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { BUGS, type BugSnippet } from "@/lib/events/computerVision/bugs";
import { openTutor, useTutorDetail } from "@/lib/tutorFocus";

/**
 * Игра «Найди баг»: сниппеты OpenCV с одной ошибкой, как в Q1c мидтерма.
 * Нажми строку с багом, выбери исправление, прочитай почему. Раунд — 10
 * сниппетов и 2 минуты; серия правильных ответов даёт бонус. Рекорд и
 * слабые темы — на устройстве, в готовность ивента не идут.
 */

const ROUND = 10;
const SECONDS = 120;

const TOPIC: Record<BugSnippet["topic"], string> = {
  bgr: "BGR и RGB",
  kernel: "ядро размытия",
  sigma: "sigmaX",
  "threshold-type": "тип порога",
  "otsu-color": "Otsu на цветной",
  "equalize-color": "equalizeHist на цветной",
  "gray-twice": "серое дважды",
  "median-kernel": "ядро medianBlur",
  "resize-order": "(ширина, высота) в resize",
  index: "img[y, x]",
  "imwrite-float": "imwrite дробной картинки",
  "imshow-bgr": "plt.imshow и BGR",
  "none-path": "imread вернул None",
  "crop-order": "срез строк и столбцов",
  "hsv-bgr": "HSV из BGR",
  "canny-color": "Canny и цвет",
  dtype: "переполнение uint8",
};

const shuffle = <T,>(list: T[]) => {
  const a = [...list];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

type Result = { id: string; topic: BugSnippet["topic"]; line: boolean; fix: boolean };

export default function BugHunt({ userId, lang, onExit }: { userId: string; lang: "ru" | "en"; onExit: () => void }) {
  const [phase, setPhase] = useState<"intro" | "play" | "done">("intro");
  const [round, setRound] = useState<BugSnippet[]>([]);
  const [i, setI] = useState(0);
  const [line, setLine] = useState<number | null>(null);
  const [order, setOrder] = useState<number[]>([0, 1, 2]);
  const [fix, setFix] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [left, setLeft] = useState(SECONDS);
  const [results, setResults] = useState<Result[]>([]);
  const [best, setBest] = useState(0);
  const timer = useRef(0);
  const store = `yg-bughunt:${userId}`;

  useEffect(() => {
    try {
      setBest(Number(localStorage.getItem(store)) || 0);
    } catch {
      /* без хранилища рекорд не помним */
    }
  }, [store]);

  useEffect(() => () => window.clearInterval(timer.current), []);

  function start() {
    setRound(shuffle(BUGS).slice(0, ROUND));
    setI(0);
    setLine(null);
    setFix(null);
    setOrder(shuffle([0, 1, 2]));
    setScore(0);
    setStreak(0);
    setResults([]);
    setLeft(SECONDS);
    setPhase("play");
    window.clearInterval(timer.current);
    timer.current = window.setInterval(() => {
      setLeft((s) => {
        if (s <= 1) {
          window.clearInterval(timer.current);
          setPhase("done");
          return 0;
        }
        return s - 1;
      });
    }, 1000);
  }

  // рекорд — когда раунд закончился (по времени или по последнему сниппету)
  useEffect(() => {
    if (phase !== "done") return;
    window.clearInterval(timer.current);
    if (score > best) {
      setBest(score);
      try {
        localStorage.setItem(store, String(score));
      } catch {
        /* не страшно */
      }
    }
  }, [phase, score, best, store]);

  const bug = round[i];
  useTutorDetail(phase === "play" && bug ? { bug: { id: bug.id, line: line ?? undefined, fix: fix === null ? undefined : bug.fixes[fix] } } : null, `${i + 1}/${round.length}`);

  function pickLine(n: number) {
    if (line !== null || !bug) return;
    setLine(n);
    if (n === bug.bug) {
      setScore((s) => s + 10 + Math.min(streak, 5) * 2);
    }
  }

  function pickFix(k: number) {
    if (fix !== null || !bug) return;
    setFix(k);
    const lineOk = line === bug.bug;
    const fixOk = k === 0;
    if (fixOk) setScore((s) => s + 10);
    setStreak((s) => (lineOk && fixOk ? s + 1 : 0));
    setResults((r) => [...r, { id: bug.id, topic: bug.topic, line: lineOk, fix: fixOk }]);
  }

  function next() {
    if (i + 1 >= round.length) {
      setPhase("done");
      return;
    }
    setI(i + 1);
    setLine(null);
    setFix(null);
    setOrder(shuffle([0, 1, 2]));
  }

  const weak = useMemo(() => {
    const miss = new Map<string, number>();
    for (const r of results) if (!r.line || !r.fix) miss.set(r.topic, (miss.get(r.topic) ?? 0) + 1);
    return [...miss.entries()].sort((a, b) => b[1] - a[1]).map(([t]) => TOPIC[t as BugSnippet["topic"]]);
  }, [results]);

  return (
    <div className="space-y-5 pb-10">
      <header className="space-y-2">
        <button className="text-sm underline" onClick={onExit}>← К маршруту</button>
        <h1 className="text-2xl font-bold">Игра «Найди баг»</h1>
        <p className="text-sm text-[var(--color-muted)]">Как задание Q1c на мидтерме: в коде одна ошибка. Нажми строку с багом, потом выбери исправление. {ROUND} сниппетов, {SECONDS / 60} минуты, серия даёт бонус.</p>
      </header>

      {phase === "intro" && (
        <section className="space-y-3 rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
          <p className="text-sm">Баги из настоящих вариантов: RGB вместо BGR, чётное ядро, нет sigmaX, img[x, y] вместо img[y, x], сохранение картинки 0…1 через imwrite и другие. Одни падают с ошибкой, другие тихо портят результат — это тоже надо уметь сказать. Помни: строка, на которой код падает, не всегда та, где ошибка.</p>
          {best > 0 && <p className="text-sm text-[var(--color-muted)]">Твой рекорд: <b className="text-[var(--color-fg)]">{best}</b></p>}
          <Button variant="primary" className="w-full" onClick={start}>Начать раунд</Button>
        </section>
      )}

      {phase === "play" && bug && (
        <section className="space-y-4 rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
          <div className="flex items-center justify-between text-sm">
            <span>Сниппет <b>{i + 1}</b> из {round.length}</span>
            <span className="tabular-nums">⏱ {Math.floor(left / 60)}:{String(left % 60).padStart(2, "0")} · <b>{score}</b> очков{streak > 1 && ` · серия ${streak}`}</span>
          </div>

          <p className="text-sm font-semibold">{line === null ? "Нажми строку с ошибкой" : fix === null ? "Чем заменить эту строку?" : "Разбор"}</p>
          <div lang="en" className="overflow-hidden rounded-2xl border border-[var(--color-border-strong)] bg-[var(--color-bg)] font-mono text-[13px]">
            {bug.lines.map((l, n) => {
              const chosen = line === n;
              const isBug = n === bug.bug;
              return (
                <button
                  key={n}
                  aria-label={`Строка ${n + 1}`}
                  disabled={line !== null}
                  onClick={() => pickLine(n)}
                  className={cn(
                    "flex w-full gap-3 border-b border-[var(--color-border)] px-3 py-2 text-left last:border-b-0 transition",
                    line === null && "hover:bg-[var(--color-surface-2)]",
                    line !== null && isBug && "bg-emerald-500/15",
                    chosen && !isBug && "bg-red-500/15",
                  )}
                >
                  <span className="w-4 shrink-0 select-none text-[var(--color-muted)]">{n + 1}</span>
                  <code className="whitespace-pre-wrap break-all">{l}</code>
                </button>
              );
            })}
          </div>

          {line !== null && line !== bug.bug && fix === null && (
            <p className="text-sm text-amber-300">Не эта строка — баг в строке {bug.bug + 1}. Всё равно выбери исправление для неё.</p>
          )}

          {line !== null && (
            <div className="space-y-2">
              {order.map((k) => {
                const right = k === 0;
                return (
                  <button
                    key={k}
                    lang="en"
                    disabled={fix !== null}
                    onClick={() => pickFix(k)}
                    className={cn(
                      "w-full rounded-2xl border px-3 py-2.5 text-left font-mono text-[13px] transition",
                      fix === null ? "border-[var(--color-border)] hover:border-[var(--color-fg-dim)]" : right ? "border-emerald-400 bg-emerald-500/10" : fix === k ? "border-red-400 bg-red-500/10" : "border-[var(--color-border)] opacity-60",
                    )}
                  >
                    {bug.fixes[k]}
                  </button>
                );
              })}
            </div>
          )}

          {fix !== null && (
            <div role="status" className="space-y-2 rounded-2xl border border-[var(--color-border-strong)] bg-[var(--color-surface-2)] px-4 py-3 text-sm">
              <p className="font-semibold">
                {line === bug.bug && fix === 0 ? "Верно!" : "Почти."}{" "}
                <span className="rounded-full bg-[var(--color-surface)] px-2 py-0.5 text-xs font-normal">
                  {bug.kind === "crash" ? "падает с ошибкой" : "работает, но результат неверный"}
                </span>
              </p>
              <p lang={lang}>{bug.why[lang]}</p>
              {fix !== 0 && <p className="text-[var(--color-muted)]">Твой вариант: <span lang={lang}>{bug.wrongFix[fix - 1][lang]}</span></p>}
              <div className="flex flex-wrap gap-2">
                <Button variant="primary" className="flex-1" onClick={next}>{i + 1 >= round.length ? "Итоги раунда" : "Следующий сниппет →"}</Button>
                <Button variant="ghost" onClick={() => openTutor("Объясни этот баг подробнее и покажи ещё один пример такой же ошибки.")}>✦ Разобрать с ИИ</Button>
              </div>
            </div>
          )}
        </section>
      )}

      {phase === "done" && (
        <section className="space-y-3 rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
          <h2 className="text-xl font-bold">{score} очков</h2>
          <p className="text-sm text-[var(--color-muted)]">
            Строка найдена: {results.filter((r) => r.line).length} из {results.length} · верное исправление: {results.filter((r) => r.fix).length} из {results.length} · рекорд {Math.max(best, score)}
          </p>
          {weak.length > 0 ? (
            <p className="text-sm">Повтори: <b>{weak.join(", ")}</b> — эти правила разобраны в части «OpenCV basics and bug hunting».</p>
          ) : (
            results.length > 0 && <p className="text-sm">Ни одной ошибки — так и на экзамене.</p>
          )}
          <Button variant="primary" className="w-full" onClick={start}>Ещё раунд</Button>
        </section>
      )}
    </div>
  );
}
