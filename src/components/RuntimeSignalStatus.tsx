"use client";
import { useEffect, useState } from "react";
type Row = { hour: string; build: string; route: string; kind: string; code: string; status: number; duration: string; count: number };
export default function RuntimeSignalStatus() {
  const [rows, setRows] = useState<Row[] | null>(null); const [failed, setFailed] = useState(false);
  useEffect(() => { void fetch("/api/owner/diagnostics").then(async r => { if (!r.ok) throw Error(); setRows((await r.json()).rows); }).catch(() => setFailed(true)); }, []);
  return <section className="my-6 overflow-x-auto rounded-xl border p-4"><h2>Ошибки и медленные запросы · 24 часа</h2><p className="text-sm">Только счётчики по версии и маршруту. Без текста задач, идентификаторов, IP и сообщений ошибок.</p>{failed ? <p role="alert">Не удалось прочитать диагностику</p> : rows === null ? <p>Загрузка…</p> : !rows.length ? <p>Событий пока нет</p> : <table className="mt-3 text-sm"><thead><tr><th>Версия</th><th>Маршрут</th><th>Тип</th><th>Статус / время</th><th>Количество</th></tr></thead><tbody>{rows.map((r, i) => <tr key={i}><td>{r.build}</td><td>{r.route}</td><td>{r.kind}</td><td>{r.status || "—"} / {r.duration}</td><td>{r.count}</td></tr>)}</tbody></table>}</section>;
}
