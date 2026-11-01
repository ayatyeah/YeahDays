"use client";
import { useCopy } from "@/i18n/useCopy";

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
  const tx = useCopy();
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
      setError(e instanceof Error ? e.message : tx("Не получилось"));
      setBusy(false);
    }
  }

  return (
    <div className="path-page">
      <Link href="/learn" className="path-back"><YgIcon name="chevron" />{tx(" Учёба")}</Link>
      <header className="path-title">
        <span className="path-eyebrow">{tx("Учиться вместе")}</span>
        <h1 data-no-i18n>{preview?.title ?? tx("Приглашение")}</h1>
        {preview && <p><span data-no-i18n>{preview.owner}</span>{tx(" приглашает пройти траекторию вместе.")}</p>}
      </header>
      {error && <p className="path-error" role="alert">{tx(error)}</p>}
      {!preview && !error && <p className="path-muted" role="status">{tx("Загружаем приглашение…")}</p>}
      {preview && (
        <section className="path-card path-stack">
          <div className="path-row">
            <span className="path-chip info">{tx("Участников: ")}{preview.members}</span>
            <span className="path-chip">{tx("Юнитов: ")}{preview.units}</span>
            {preview.subject && <span className="path-chip" data-no-i18n>{preview.subject}</span>}
          </div>
          <div>
            <h2>{tx("Навыки на карте")}</h2>
            <ol className="path-muted" style={{ marginTop: 8, paddingLeft: 18, listStyle: "decimal" }} data-no-i18n>
              {preview.skills.map((s) => <li key={s}>{s}</li>)}
            </ol>
          </div>
          <p className="path-muted">{tx("Содержимое общее, а освоение и ответы — твои. Участники видят, сколько юнитов ты прошёл, но не твои баллы, пока ты сам ими не поделишься.")}</p>
          {canJoin ? (
            <button className="path-btn" onClick={join} disabled={busy}>{busy ? tx("Присоединяемся…") : tx("Присоединиться")}</button>
          ) : (
            <p className="path-notice">{tx("Этим постом поделился участник, а не владелец цели, или ссылка уже сменилась. Чтобы присоединиться, попроси у владельца приглашение.")}</p>
          )}
        </section>
      )}
    </div>
  );
}
