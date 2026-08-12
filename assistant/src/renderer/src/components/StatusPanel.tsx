import { useEffect, useRef, useState } from "react";
import type { DidiState, LogEntry, PanelStatus } from "../didi";
import Orb from "./Orb";

const STATE_LABEL: Record<DidiState, string> = {
  idle: "Ожидание",
  listening: "Слушаю",
  thinking: "Думаю",
  speaking: "Отвечаю",
};

export default function StatusPanel() {
  const [panel, setPanel] = useState<PanelStatus | null>(null);
  const [loopRunning, setLoopRunning] = useState<boolean | null>(null);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [voiceState, setVoiceState] = useState<DidiState>("idle");
  const logEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    const tick = async () => {
      // Раньше оба запроса шли одним Promise.all — если сеть до YeahGrind
      // моргала, падали ОБА разом, и loopRunning (чисто локальный IPC,
      // сети не касается вообще) навсегда застревал в null. А от него
      // зависит disabled кнопки — кнопка залипала намертво без единой
      // строки в логе. Теперь независимо: один упал — второй всё равно
      // применяется.
      try {
        const p = await window.didi.getPanel();
        if (!cancelled) setPanel(p);
      } catch {
        // сеть/сервер недоступны — попробуем на следующем тике
      }
      try {
        const running = await window.didi.isVoiceLoopRunning();
        if (!cancelled) setLoopRunning(running);
      } catch {
        // не должно падать (чистый IPC), но на всякий случай не роняем тик
      }
    };
    void tick();
    const id = setInterval(tick, 5000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  useEffect(() => {
    return window.didi.onLog((entry) => {
      setLogs((prev) => [...prev.slice(-199), entry]);
    });
  }, []);

  useEffect(() => {
    void window.didi.getState().then(setVoiceState);
    return window.didi.onState(setVoiceState);
  }, []);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ block: "end" });
  }, [logs]);

  const [toggling, setToggling] = useState(false);
  const isOn = loopRunning === true;

  // Одна кнопка вместо двух прежних (пауза + старт/стоп цикла) — по
  // нажатию сразу и снимает паузу, и поднимает голосовой цикл, чтобы
  // ловить "СалемАй" начинало ровно то самое нажатие, без второго шага.
  //
  // setEnabled раньше вызывался ТОЛЬКО если panel уже был загружен
  // (`if (panel && !panel.enabled)`) — а panel вполне мог быть ещё null
  // (первый тик не успел отработать, сеть моргнула). Тогда локальный
  // цикл стартовал, кодовое слово исправно ловилось, а КАЖДАЯ команда
  // молча дропалась на "на паузе (выключено из панели)" — с виду
  // "кнопка не работает", хотя технически всё крутилось. Теперь
  // setEnabled(true) вызывается безусловно при включении, без оглядки
  // на то, успел ли panel подгрузиться — лишний вызов дёшево, а
  // пропущенный ломает всю функциональность молча.
  const toggle = async () => {
    setToggling(true);
    try {
      if (isOn) {
        await window.didi.stopVoiceLoop();
        await window.didi.setEnabled(false).catch(() => {});
      } else {
        await window.didi.setEnabled(true).catch(() => {});
        await window.didi.startVoiceLoop();
      }
    } finally {
      try {
        const [p, running] = await Promise.allSettled([
          window.didi.getPanel(),
          window.didi.isVoiceLoopRunning(),
        ]);
        if (p.status === "fulfilled") setPanel(p.value);
        if (running.status === "fulfilled") setLoopRunning(running.value);
      } finally {
        setToggling(false);
      }
    }
  };

  return (
    <div>
      <div className="hero">
        <Orb state={isOn ? voiceState : "idle"} />
        <div className="hero-state">{isOn ? STATE_LABEL[voiceState] : "Выключен"}</div>

        <button
          className={`power-btn ${isOn ? "on" : "off"}`}
          onClick={() => void toggle()}
          disabled={toggling || loopRunning === null}
        >
          {isOn ? "Выключить" : "Включить"}
        </button>

        <div className="hero-meta">
          <span className={`status-dot ${panel?.online ? "on" : "off"}`} />
          <span className="muted">{panel?.online ? "YeahGrind на связи" : "YeahGrind недоступен"}</span>
        </div>
      </div>

      <div className="card log-card">
        <div className="log-title">Живой журнал</div>
        <div className="log-feed">
          {logs.length === 0 && <div className="muted">Пока пусто — жди события.</div>}
          {logs.map((l, i) => (
            <div key={i} className={`log-line ${l.level}`}>
              <span className="log-time">{new Date(l.at).toLocaleTimeString("ru-RU")}</span> {l.message}
            </div>
          ))}
          <div ref={logEndRef} />
        </div>
      </div>
    </div>
  );
}
