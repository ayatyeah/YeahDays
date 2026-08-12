import { useEffect, useRef, useState } from "react";
import type { ChatMessage } from "../didi";

export default function ChatPanel() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState("");
  const feedRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    const tick = async () => {
      try {
        const msgs = await window.didi.getChatHistory();
        if (!cancelled) setMessages(msgs);
      } catch {
        // попробуем на следующем тике
      }
    };
    void tick();
    const id = setInterval(tick, 2000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  useEffect(() => {
    feedRef.current?.scrollIntoView({ block: "end" });
  }, [messages.length]);

  const send = async () => {
    const text = draft.trim();
    if (!text) return;
    setDraft("");
    await window.didi.sendChatMessage(text);
  };

  return (
    <div className="card">
      <div className="chat-feed">
        {messages.length === 0 && <div className="muted">Переписки пока нет — скажи «Салем» или напиши сюда.</div>}
        {messages.map((m) => (
          <div key={m.id} className={`bubble ${m.role}`}>
            {m.content}
          </div>
        ))}
        <div ref={feedRef} />
      </div>
      <div className="row" style={{ marginTop: 10 }}>
        <input
          type="text"
          value={draft}
          placeholder="Написать СалемАй…"
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && void send()}
        />
        <button className="btn primary" onClick={() => void send()}>
          Отправить
        </button>
      </div>
    </div>
  );
}
