"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";
import { WEIGHTS, fromBits, toHex } from "@/lib/events/games/network";

/**
 * Интерактивные демонстрации внутри конспекта («@demo имя»).
 *
 * Не игра и не квиз: нет очков и таймера, можно трогать сколько угодно.
 * Смысл — увидеть правило в действии там же, где оно объяснено.
 */
export default function NotesDemo({ name, lang }: { name: string; lang: string }) {
  const ru = lang === "ru";
  if (name === "binary") return <BinaryDemo ru={ru} />;
  if (name === "encapsulation") return <EncapsulationDemo ru={ru} />;
  if (name === "cable") return <CableDemo ru={ru} />;
  return null;
}

const shell = "rounded-2xl border border-dashed border-[var(--color-border-strong)] bg-[var(--color-surface-2)]/60 p-4";
const title = "text-xs font-semibold uppercase tracking-widest text-[var(--color-muted)]";

/** Переключай биты — десятичное и hex-значение пересчитываются сразу. */
function BinaryDemo({ ru }: { ru: boolean }) {
  const [bits, setBits] = useState<number[]>([1, 1, 0, 0, 0, 0, 0, 0]);
  const value = fromBits(bits);
  return (
    <div className={shell} data-no-i18n>
      <p className={title}>{ru ? "Попробуй: переключай биты" : "Try it: toggle the bits"}</p>
      <div className="mt-3 grid grid-cols-8 gap-1.5" role="group" aria-label={ru ? "Биты для пробы" : "Bits to try"}>
        {WEIGHTS.map((w, i) => (
          <button key={w} aria-pressed={bits[i] === 1} aria-label={`${w}`} className={cn("flex flex-col items-center rounded-xl border py-1.5", bits[i] ? "border-emerald-400 bg-emerald-500/20" : "border-[var(--color-border-strong)] bg-[var(--color-bg)]")} onClick={() => setBits(bits.map((b, k) => (k === i ? 1 - b : b)))}>
            <span className="text-[10px] text-[var(--color-muted)]">{w}</span>
            <span className="font-mono text-xl font-bold">{bits[i]}</span>
          </button>
        ))}
      </div>
      <p className="mt-3 text-center font-mono text-sm">
        {bits.join("")} = {WEIGHTS.filter((_, i) => bits[i]).join(" + ") || "0"} = <strong className="text-lg">{value}</strong> = 0x{toHex(value)}
      </p>
    </div>
  );
}

/** Шаг за шагом вниз по стеку: к данным добавляются заголовки. */
function EncapsulationDemo({ ru }: { ru: boolean }) {
  const steps = [
    { layer: ru ? "Прикладной" : "Application", pdu: ru ? "Данные" : "Data", add: "HTTP", color: "bg-emerald-500/40" },
    { layer: ru ? "Транспортный" : "Transport", pdu: ru ? "Сегмент" : "Segment", add: "TCP", color: "bg-sky-500/40" },
    { layer: ru ? "Сетевой" : "Network", pdu: ru ? "Пакет" : "Packet", add: "IP", color: "bg-violet-500/40" },
    { layer: ru ? "Канальный" : "Data Link", pdu: ru ? "Кадр" : "Frame", add: "Ethernet", color: "bg-amber-500/40" },
    { layer: ru ? "Физический" : "Physical", pdu: ru ? "Биты" : "Bits", add: "", color: "" },
  ];
  const [step, setStep] = useState(0);
  const current = steps[step];
  return (
    <div className={shell}>
      <p className={title}>{ru ? "Попробуй: спустись по стеку" : "Try it: go down the stack"}</p>
      <p className="mt-2 text-sm"><strong>{current.layer}</strong> → PDU: <strong>{current.pdu}</strong></p>
      <div className="mt-3 flex items-stretch overflow-hidden rounded-xl border border-[var(--color-border-strong)] font-mono text-xs" data-no-i18n>
        {step === 4 ? (
          <div className="flex-1 px-3 py-3 text-center tracking-widest">0110 1001 0110 0101 1010 0010 …</div>
        ) : (
          <>
            {steps.slice(1, step + 1).reverse().map((s) => <div key={s.add} className={cn("px-2 py-3 font-semibold", s.color)}>{s.add}</div>)}
            <div className="flex-1 bg-emerald-500/20 px-3 py-3 text-center">{ru ? "данные" : "data"}</div>
            {step >= 3 && <div className="bg-amber-500/40 px-2 py-3 font-semibold">FCS</div>}
          </>
        )}
      </div>
      <div className="mt-3 flex gap-2">
        <button className="rounded-xl bg-[var(--color-bg)] px-3 py-1.5 text-sm font-semibold disabled:opacity-40" disabled={step === 0} onClick={() => setStep(step - 1)}>{ru ? "↑ Вверх (снять заголовок)" : "↑ Up (strip a header)"}</button>
        <button className="rounded-xl bg-[var(--color-bg)] px-3 py-1.5 text-sm font-semibold disabled:opacity-40" disabled={step === 4} onClick={() => setStep(step + 1)}>{ru ? "↓ Вниз (добавить заголовок)" : "↓ Down (add a header)"}</button>
      </div>
    </div>
  );
}

/** Выбери два устройства — узнай, какой кабель нужен. */
function CableDemo({ ru }: { ru: boolean }) {
  const devices = [
    { id: "pc", name: ru ? "Компьютер" : "PC", group: "host" },
    { id: "server", name: ru ? "Сервер" : "Server", group: "host" },
    { id: "switch", name: ru ? "Коммутатор" : "Switch", group: "switch" },
    { id: "router", name: ru ? "Маршрутизатор" : "Router", group: "router" },
    { id: "console", name: ru ? "Консольный порт" : "Console port", group: "console" },
  ];
  const [a, setA] = useState("pc");
  const [b, setB] = useState("switch");
  const da = devices.find((d) => d.id === a)!, db = devices.find((d) => d.id === b)!;
  let cable: string, why: string;
  if (da.group === "console" || db.group === "console") {
    cable = ru ? "Консольный (rollover)" : "Rollover (console)";
    why = ru ? "Последовательный порт компьютера — консольный порт устройства. Фирменный кабель Cisco." : "PC serial port to the device's console port. Cisco proprietary cable.";
  } else if (da.group === db.group || (da.group === "host" && db.group === "router") || (da.group === "router" && db.group === "host")) {
    // Маршрутизатор и хост — оба «конечные» по разводке пар, поэтому между ними тоже перекрёстный.
    cable = ru ? "Перекрёстный (crossover)" : "Crossover";
    why = ru ? "Одинаковые по разводке устройства: T568A на одном конце, T568B на другом. С Auto-MDIX подойдёт и прямой." : "Devices with the same pinout: T568A on one end, T568B on the other. With Auto-MDIX a straight-through also works.";
  } else {
    cable = ru ? "Прямой (straight-through)" : "Straight-through";
    why = ru ? "Хост или маршрутизатор к коммутатору: оба конца по одному стандарту." : "Host or router to a switch: the same standard on both ends.";
  }
  const Pick = ({ value, onChange, label }: { value: string; onChange: (v: string) => void; label: string }) => (
    <label className="grid gap-1 text-xs text-[var(--color-muted)]">{label}
      <select className="h-9 rounded-xl border border-[var(--color-border-strong)] bg-[var(--color-bg)] px-2 text-sm text-[var(--color-fg)]" value={value} onChange={(e) => onChange(e.target.value)}>
        {devices.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
      </select>
    </label>
  );
  return (
    <div className={shell}>
      <p className={title}>{ru ? "Попробуй: какой кабель нужен" : "Try it: which cable is needed"}</p>
      <div className="mt-3 grid grid-cols-2 gap-3">
        <Pick value={a} onChange={setA} label={ru ? "Первое устройство" : "First device"} />
        <Pick value={b} onChange={setB} label={ru ? "Второе устройство" : "Second device"} />
      </div>
      <p className="mt-3 text-sm"><strong>{cable}</strong></p>
      <p className="text-sm text-[var(--color-fg-dim)]">{why}</p>
    </div>
  );
}
