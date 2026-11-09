"use client";
import { useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import cards from "@/lib/events/computerNetworksEndterm/express.json";

export default function NetworksExpress({ userId, onReview, onExam }: { userId: string; onReview: (module: number) => void; onExam: () => void }) {
  const key = `yg:cn-express:v1:${userId}`;
  const [known, setKnown] = useState<string[]>([]);
  const [ready, setReady] = useState(false);
  const [saveError, setSaveError] = useState(false);
  const [weakOnly, setWeakOnly] = useState(false);
  const [minutes, setMinutes] = useState(180);
  useEffect(() => {
    try { const value: unknown = JSON.parse(localStorage.getItem(key) ?? "[]"); setKnown(Array.isArray(value) ? value.filter((id): id is string => typeof id === "string" && cards.some(c => c.id === id)) : []); } catch { setKnown([]); }
    setReady(true);
  }, [key]);
  function toggle(id: string) {
    const next = known.includes(id) ? known.filter(v => v !== id) : [...known, id];
    setKnown(next);
    try { localStorage.setItem(key, JSON.stringify(next)); setSaveError(false); } catch { setSaveError(true); }
  }
  return <section className="space-y-5" data-testid="cn-express">
    <div className="space-y-3 rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
      <h2 className="text-2xl font-bold">Экспресс-подготовка к квизу</h2>
      <p>Сначала ответь вслух без конспекта. Затем раскрой разбор и объясни причину своими словами. Если угадал или перепутал понятия — вернись к модулю.</p>
      <div className="flex gap-2" role="group" aria-label="Время подготовки">{[60,180].map(n => <Button key={n} variant={minutes === n ? "primary" : "ghost"} aria-pressed={minutes === n} onClick={() => setMinutes(n)}>{n === 60 ? "Есть 1 час" : "Есть 3 часа"}</Button>)}</div>
      {minutes === 60 ? <ol className="list-decimal space-y-2 pl-5"><li>15 минут: TCP/UDP и приложения — модули 14–15.</li><li>15 минут: IOS, SSH, C/L/remote — модули 10, 16 и 8.</li><li>15 минут: посчитай IPv4-подсеть; повтори IPv6, ARP и ICMP — модули 11–13 и 9.</li><li>15 минут: карточки ниже. Повтори только ошибки; полный пробный экзамен требует ещё 45 минут.</li></ol> : <ol className="list-decimal space-y-2 pl-5"><li>35 минут: TCP/UDP, порты, DNS/DHCP/HTTP/email — модули 14–15.</li><li>25 минут: IOS и SSH — модули 10 и 16.</li><li>30 минут: IPv4/VLSM и IPv6 — модули 11–12. Считай на бумаге.</li><li>20 минут: IP, маршруты, ARP/ND, ICMP — модули 8–9 и 13.</li><li>10 минут: виды атак и AAA — модуль 16.</li><li>45 минут: пробная эндка без подсказок.</li><li>15 минут: разбор ошибок и повторное объяснение причин.</li></ol>}
      <p className="text-sm text-[var(--color-muted)]">Это план повторения, не обещание состава завтрашнего квиза. Приоритеты взяты из объявления преподавателя; даты и формат конкретного квиза уточняй по своему расписанию.</p>
      <div className="flex flex-wrap gap-2"><Button onClick={onExam}>Открыть пробную эндку</Button><a className="rounded-xl border border-[var(--color-border)] px-4 py-3 underline" href="/events/computer-networks-endterm/express-prep.md" download>Скачать экспресс-подготовку</a></div>
    </div>
    <div className="flex flex-wrap items-center justify-between gap-3"><p role="status">{ready ? `Могу объяснить: ${known.length} из ${cards.length}` : "Загружаем отметки…"}</p><label className="flex min-h-11 items-center gap-2"><input type="checkbox" checked={weakOnly} onChange={e => setWeakOnly(e.target.checked)} />Только то, что нужно повторить</label></div>
    <p className="text-sm text-[var(--color-muted)]">Отметки — твоя самопроверка, они сохраняются в этом браузере и не меняют результат квизов.</p>
    {saveError && <p role="alert">Не удалось сохранить отметку. Не закрывай страницу, если хочешь сохранить текущий список.</p>}
    {cards.filter(c => !weakOnly || !known.includes(c.id)).map(c => <article key={c.id} className="space-y-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
      <p className="text-xs text-[var(--color-muted)]">Модуль {c.module}</p><h3 className="font-bold">{c.question}</h3>
      <details><summary className="cursor-pointer py-2 font-semibold">Проверить объяснение</summary><p className="mt-2 leading-relaxed">{c.answer}</p><p className="mt-3 text-sm" lang="en">{c.english}</p><Button className="mt-3" variant="ghost" onClick={() => onReview(c.module)}>Разобрать модуль {c.module}</Button></details>
      <label className="flex min-h-11 items-center gap-2"><input type="checkbox" disabled={!ready} checked={known.includes(c.id)} onChange={() => toggle(c.id)} />Могу объяснить без подсказки</label>
    </article>)}
    {weakOnly && known.length === cards.length && <p>Все карточки отмечены. Проверь себя пробной эндкой: узнавание ответа ещё не гарантирует воспроизведение без подсказки.</p>}
  </section>;
}
