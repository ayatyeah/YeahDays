"use client";

import Link from "next/link";
import { cn } from "@/lib/cn";

export interface LeaderRow {
  name: string;
  percent: number;
  me: boolean;
}

/**
 * Рейтинг готовности среди друзей.
 *
 * Участие — только по желанию и выключено по умолчанию: результат квиза
 * личный, и показывать его другим без спроса нельзя. В списке — друзья,
 * которые включили участие сами.
 */
export default function EventLeaderboard({
  board, share, friends, online, onShare,
}: {
  board: LeaderRow[];
  share: boolean;
  friends: number;
  online: boolean;
  onShare: (share: boolean) => void;
}) {
  const others = board.filter((r) => !r.me).length;
  return (
    <section className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
      <h2 className="text-lg font-bold">Рейтинг друзей</h2>
      <label className="mt-3 flex items-start gap-3 text-sm">
        <input type="checkbox" className="mt-1" checked={share} disabled={!online} onChange={(e) => onShare(e.target.checked)} />
        <span>
          Показывать мою готовность друзьям
          <span className="block text-xs text-[var(--color-muted)]">Друзья увидят только имя и процент. Выключить можно в любой момент.</span>
        </span>
      </label>

      {board.length > 0 && (
        <ol className="mt-4 space-y-2">
          {board.map((row, i) => (
            <li key={`${row.name}:${i}`} className={cn("flex items-center gap-3 rounded-2xl border p-3 text-sm", row.me ? "border-violet-400 bg-violet-500/10" : "border-[var(--color-border)]")}>
              <span className="w-5 shrink-0 text-center tabular-nums text-[var(--color-muted)]">{i + 1}</span>
              <span className="min-w-0 flex-1 truncate font-medium">{row.name}{row.me && !share && " · видишь только ты"}</span>
              <span className="shrink-0 font-bold tabular-nums">{row.percent}%</span>
            </li>
          ))}
        </ol>
      )}

      <p className="mt-3 text-xs text-[var(--color-muted)]">
        {!online
          ? "Нет сети — рейтинг обновится, когда появится интернет."
          : friends === 0
            ? <>У тебя пока нет друзей в приложении. <Link href="/account" className="underline">Пригласи одногруппников</Link> — и готовьтесь наперегонки.</>
            : others === 0
              ? "Никто из друзей ещё не включил участие в рейтинге этого ивента."
              : `Друзей в рейтинге: ${others}.`}
      </p>
    </section>
  );
}
