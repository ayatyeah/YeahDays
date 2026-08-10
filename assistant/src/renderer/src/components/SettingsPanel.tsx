import { useEffect, useState } from "react";
import type { ConfigSummary } from "../didi";

export default function SettingsPanel() {
  const [summary, setSummary] = useState<ConfigSummary | null>(null);
  const [raw, setRaw] = useState<Record<string, string>>({});
  const [autostart, setAutostart] = useState(false);
  const [saved, setSaved] = useState(false);

  const load = async () => {
    const [s, r, a] = await Promise.all([
      window.didi.getConfigSummary(),
      window.didi.getRawSettings(),
      window.didi.getAutostart(),
    ]);
    setSummary(s);
    setRaw(r);
    setAutostart(a);
  };

  useEffect(() => {
    void load();
  }, []);

  const set = (key: string, value: string) => setRaw((prev) => ({ ...prev, [key]: value }));

  const save = async () => {
    await window.didi.saveSettings(raw);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const toggleAutostart = async (value: boolean) => {
    await window.didi.setAutostart(value);
    setAutostart(value);
  };

  if (!summary) return <div className="card muted">Загрузка…</div>;

  return (
    <div>
      {!summary.isConfigured && (
        <div className="card" style={{ borderColor: "var(--warn)" }}>
          Не хватает обязательных полей ниже — без них голосовой цикл и связь с YeahGrind не запустятся.
        </div>
      )}

      <div className="card">
        <div className="field">
          <label>OPENAI_API_KEY</label>
          <input
            type="password"
            value={raw.OPENAI_API_KEY ?? ""}
            onChange={(e) => set("OPENAI_API_KEY", e.target.value)}
            placeholder="sk-..."
          />
        </div>
        <div className="field">
          <label>YEAHGRIND_BASE_URL (адрес YeahGrind — прод или localhost)</label>
          <input
            type="text"
            value={raw.YEAHGRIND_BASE_URL ?? ""}
            onChange={(e) => set("YEAHGRIND_BASE_URL", e.target.value)}
            placeholder="https://yeahdays-production.up.railway.app"
          />
        </div>
        <div className="field">
          <label>YEAHGRIND_USER_ID (localStorage["yd-uid"] в браузере YeahGrind)</label>
          <input
            type="text"
            value={raw.YEAHGRIND_USER_ID ?? ""}
            onChange={(e) => set("YEAHGRIND_USER_ID", e.target.value)}
          />
        </div>
        <div className="field">
          <label>ASSISTANT_SECRET (должен совпадать с тем же в .env YeahGrind / Railway Variables)</label>
          <input
            type="password"
            value={raw.ASSISTANT_SECRET ?? ""}
            onChange={(e) => set("ASSISTANT_SECRET", e.target.value)}
          />
        </div>
        <div className="field">
          <label>AUDIO_DEVICE_INDEX (-1 — микрофон по умолчанию)</label>
          <input
            type="number"
            value={raw.AUDIO_DEVICE_INDEX ?? "-1"}
            onChange={(e) => set("AUDIO_DEVICE_INDEX", e.target.value)}
          />
        </div>
        <div className="row">
          <button className="btn primary" onClick={() => void save()}>
            Сохранить
          </button>
          <button className="btn" onClick={() => void window.didi.relaunch()}>
            Сохранить и перезапустить
          </button>
          {saved && <span className="muted">Сохранено — изменения применятся после перезапуска.</span>}
        </div>
      </div>

      <div className="card row" style={{ justifyContent: "space-between" }}>
        <div>
          <div>Запускать при входе в Windows</div>
          <div className="muted">Заменяет прежний способ через Task Scheduler/VBS.</div>
        </div>
        <button className="btn" onClick={() => void toggleAutostart(!autostart)}>
          {autostart ? "Включено — выключить" : "Выключено — включить"}
        </button>
      </div>

      <div className="card muted">
        Модель диалога: {summary.chatModel} · userId: {summary.userId || "—"} · сервер: {summary.baseUrl}
      </div>

      <div className="card">
        <button className="btn danger" onClick={() => void window.didi.quit()}>
          Выйти из ДиДи полностью
        </button>
      </div>
    </div>
  );
}
