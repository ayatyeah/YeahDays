import { useEffect, useState } from "react";
import type { ConfigSummary } from "../didi";

export default function SettingsPanel() {
  const [summary, setSummary] = useState<ConfigSummary | null>(null);
  const [raw, setRaw] = useState<Record<string, string>>({});
  const [autostart, setAutostart] = useState(false);
  const [saved, setSaved] = useState(false);

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loginBusy, setLoginBusy] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loggedInAs, setLoggedInAs] = useState<string | null>(null);

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

  const doLogin = async () => {
    setLoginBusy(true);
    setLoginError(null);
    try {
      const res = await window.didi.login(identifier, password);
      set("YEAHGRIND_USER_ID", res.userId);
      setLoggedInAs(res.name ?? res.email ?? res.userId);
      setPassword("");
    } catch (e) {
      setLoginError(e instanceof Error ? e.message : "Не получилось войти");
    } finally {
      setLoginBusy(false);
    }
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
        <div className="muted" style={{ marginBottom: 10 }}>Вход в аккаунт YeahGrind</div>
        {loggedInAs ? (
          <div>
            <div>Вошли как {loggedInAs}</div>
            <div className="muted" style={{ marginTop: 4 }}>
              Нажми «Сохранить и перезапустить» ниже, чтобы применилось.
            </div>
          </div>
        ) : (
          <>
            <div className="field">
              <label>Email или логин</label>
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && void doLogin()}
              />
            </div>
            <div className="field">
              <label>Пароль</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && void doLogin()}
              />
            </div>
            {loginError && (
              <div className="muted" style={{ color: "var(--err)", marginBottom: 10 }}>
                {loginError}
              </div>
            )}
            <button
              className="btn primary"
              onClick={() => void doLogin()}
              disabled={loginBusy || !identifier.trim() || !password}
            >
              {loginBusy ? "Входим…" : "Войти"}
            </button>
          </>
        )}
      </div>

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
          <label>YEAHGRIND_USER_ID (заполняется входом выше; вручную — если аккаунта нет или анонимно)</label>
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
          Выйти из СалемАй полностью
        </button>
      </div>
    </div>
  );
}
