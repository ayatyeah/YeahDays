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

  const toggleEnabled = async () => {
    if (!panel) return;
    await window.didi.setEnabled(!panel.enabled);
    setPanel({ ...panel, enabled: !panel.enabled });
  };

  const toggleLoop = async () => {
    if (loopRunning) await window.didi.stopVoiceLoop();
    else await window.didi.startVoiceLoop();
    setLoopRunning(await window.didi.isVoiceLoopRunning());
  };

  return (
    <div>
      <div className="card row" style={{ justifyContent: "space-between", alignItems: "center" }}>
        <div className="row" style={{ gap: 14 }}>
          <Orb state={loopRunning ? voiceState : "idle"} />
          <div>
            <div style={{ fontWeight: 600 }}>{loopRunning ? STATE_LABEL[voiceState] : "Голос выключен"}</div>
            <div className="row" style={{ gap: 6, marginTop: 2 }}>
              <span className={`status-dot ${panel?.online ? "on" : "off"}`} />
              <span className="muted">{panel?.online ? "Онлайн" : "Офлайн"} · {panel?.enabled ? "слушает" : "на паузе"}</span>
            </div>
            <div className="muted">Голосовой цикл: {loopRunning === null ? "…" : loopRunning ? "запущен" : "остановлен"}</div>
          </div>
        </div>
        <div className="row">
          <button className="btn" onClick={toggleEnabled} disabled={!panel}>
            {panel?.enabled ? "Поставить на паузу" : "Включить"}
          </button>
          <button className="btn" onClick={toggleLoop}>
            {loopRunning ? "Остановить голос" : "Запустить голос"}
          </button>
        </div>
      </div>

      <div className="card">
        <div className="muted" style={{ marginBottom: 8 }}>Живой журнал</div>
        <div style={{ maxHeight: 320, overflowY: "auto" }}>
          {logs.length === 0 && <div className="muted">Пока пусто — жди события.</div>}
          {logs.map((l, i) => (
            <div key={i} className={`log-line ${l.level}`}>
              {new Date(l.at).toLocaleTimeString("ru-RU")} {l.message}
            </div>
          ))}
          <div ref={logEndRef} />
        </div>
      </div>
    </div>
  );
}
