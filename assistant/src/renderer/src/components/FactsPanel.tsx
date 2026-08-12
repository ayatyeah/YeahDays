import { useEffect, useState } from "react";
import type { Fact } from "../didi";

export default function FactsPanel() {
  const [facts, setFacts] = useState<Fact[]>([]);
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const list = await window.didi.getFacts();
    setFacts(list);
    setLoading(false);
  };

  useEffect(() => {
    void load();
  }, []);

  const add = async () => {
    const text = draft.trim();
    if (!text) return;
    setDraft("");
    await window.didi.rememberFact(text);
    await load();
  };

  const remove = async (id: string) => {
    await window.didi.forgetFact(id);
    await load();
  };

  return (
    <div className="card">
      <div className="muted" style={{ marginBottom: 10 }}>
        То, что СалемАй попросили запомнить о тебе («Салем, запомни ...») — читается заново в начале каждого нового разговора.
      </div>
      <div className="row" style={{ marginBottom: 12 }}>
        <input
          type="text"
          value={draft}
          placeholder="Добавить факт вручную…"
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && void add()}
        />
        <button className="btn primary" onClick={() => void add()}>
          Добавить
        </button>
      </div>
      {loading && <div className="muted">Загрузка…</div>}
      {!loading && facts.length === 0 && <div className="muted">Пока ничего не запомнила.</div>}
      {facts.map((f) => (
        <div key={f.id} className="fact-item">
          <span>{f.content}</span>
          <span className="row">
            <span className="muted">{new Date(f.at).toLocaleDateString("ru-RU")}</span>
            <button className="btn danger" onClick={() => void remove(f.id)}>
              Удалить
            </button>
          </span>
        </div>
      ))}
    </div>
  );
}
