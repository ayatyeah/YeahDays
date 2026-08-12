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
      try {
        const [p, running] = await Promise.all([window.didi.getPanel(), window.didi.isVoiceLoopRunning()]);
        if (!cancelled) {
          setPanel(p);
          setLoopRunning(running);
        }
      } catch {
        // сеть/сервер недоступны — просто попробуем на следующем тике
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
  // ловить "Джарвис" начинало ровно то самое нажатие, без второго шага.
  const toggle = async () => {
    setToggling(true);
    try {
      if (isOn) {
        await window.didi.stopVoiceLoop();
        if (panel?.enabled) await window.didi.setEnabled(false);
      } else {
        if (panel && !panel.enabled) await window.didi.setEnabled(true);
        await window.didi.startVoiceLoop();
      }
      const [p, running] = await Promise.all([window.didi.getPanel(), window.didi.isVoiceLoopRunning()]);
      setPanel(p);
      setLoopRunning(running);
    } finally {
      setToggling(false);
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
