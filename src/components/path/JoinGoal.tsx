"use client";
/** Присоединиться к цели по приглашению или из учебной карточки в ленте. */
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { YgIcon } from "@/components/yg-icons";
import { call } from "./client";
import "./path.css";

interface Preview {
  title: string;
  subject: string;
  owner: string;
  skills: string[];
  members: number;
  units: number;
}

export default function JoinGoal({ code, postId, preview: initial, target, canJoin = true }: { code?: string; postId?: string; preview?: Preview; target?: string; canJoin?: boolean }) {
  const router = useRouter();
  const [preview, setPreview] = useState<Preview | null>(initial ?? null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (initial || !code) return;
    call<Preview>(`/api/path/join?code=${encodeURIComponent(code)}`).then(setPreview, (e) => setError(e.message));
  }, [code, initial]);

  async function join() {
    setBusy(true);
    setError("");
    try {
      const { goalId } = await call<{ goalId: string }>("/api/path/join", code ? { code } : { postId });
      router.push(target ?? `/learn/g/${goalId}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Не получилось");
      setBusy(false);
    }
  }

  return (
    <div className="path-page">
      <Link href="/learn" className="path-back"><YgIcon name="chevron" /> Учёба</Link>
      <header className="path-title">
        <span className="path-eyebrow">Учиться вместе</span>
        <h1 data-no-i18n>{preview?.title ?? "Приглашение"}</h1>
        {preview && <p><span data-no-i18n>{preview.owner}</span> приглашает пройти траекторию вместе.</p>}
      </header>
      {error && <p className="path-error" role="alert">{error}</p>}
      {!preview && !error && <p className="path-muted" role="status">Загружаем приглашение…</p>}
      {preview && (
        <section className="path-card path-stack">
          <div className="path-row">
            <span className="path-chip info">Участников: {preview.members}</span>
            <span className="path-chip">Юнитов: {preview.units}</span>
            {preview.subject && <span className="path-chip" data-no-i18n>{preview.subject}</span>}
          </div>
          <div>
            <h2>Навыки на карте</h2>
            <ol className="path-muted" style={{ marginTop: 8, paddingLeft: 18, listStyle: "decimal" }} data-no-i18n>
              {preview.skills.map((s) => <li key={s}>{s}</li>)}
            </ol>
          </div>
          <p className="path-muted">Содержимое общее, а освоение и ответы — твои. Участники видят, сколько юнитов ты прошёл, но не твои баллы, пока ты сам ими не поделишься.</p>
          {canJoin ? (
            <button className="path-btn" onClick={join} disabled={busy}>{busy ? "Присоединяемся…" : "Присоединиться"}</button>
          ) : (
            <p className="path-notice">Этим постом поделился участник, а не владелец цели, или ссылка уже сменилась. Чтобы присоединиться, попроси у владельца приглашение.</p>
          )}
        </section>
      )}
    </div>
  );
}
