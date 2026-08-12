import { useEffect, useState } from "react";

export default function YeahGrindPanel() {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    void window.didi.getConfigSummary().then((cfg) => {
      if (!cancelled) setUrl(`${cfg.baseUrl}/today`);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  if (!url) {
    return <div className="muted">Загрузка…</div>;
  }

  return (
    <webview
      src={url}
      style={{
        width: "100%",
        // topbar (~52px) + паддинги .content (16px сверху и снизу) — вебвью
        // должен занимать ровно то, что осталось, а не скроллить страницу.
        height: "calc(100vh - 84px)",
        border: "1px solid var(--border)",
        borderRadius: 10,
      }}
    />
  );
}
