import { useState } from "react";
import StatusPanel from "./components/StatusPanel";
import ChatPanel from "./components/ChatPanel";
import FactsPanel from "./components/FactsPanel";
import SettingsPanel from "./components/SettingsPanel";
import YeahGrindPanel from "./components/YeahGrindPanel";

type Tab = "status" | "chat" | "facts" | "grind" | "settings";

export default function App() {
  const [tab, setTab] = useState<Tab>("status");

  return (
    <>
      <div className="topbar">
        <span className="brand">ДиДи</span>
        <div className="tabs">
          <button className={`tab ${tab === "status" ? "active" : ""}`} onClick={() => setTab("status")}>
            Статус
          </button>
          <button className={`tab ${tab === "chat" ? "active" : ""}`} onClick={() => setTab("chat")}>
            Чат
          </button>
          <button className={`tab ${tab === "facts" ? "active" : ""}`} onClick={() => setTab("facts")}>
            Факты
          </button>
          <button className={`tab ${tab === "grind" ? "active" : ""}`} onClick={() => setTab("grind")}>
            YeahGrind
          </button>
          <button className={`tab ${tab === "settings" ? "active" : ""}`} onClick={() => setTab("settings")}>
            Настройки
          </button>
        </div>
      </div>
      <div className="content">
        {tab === "status" && <StatusPanel />}
        {tab === "chat" && <ChatPanel />}
        {tab === "facts" && <FactsPanel />}
        {tab === "grind" && <YeahGrindPanel />}
        {tab === "settings" && <SettingsPanel />}
      </div>
    </>
  );
}
