"use client";
import { useT } from "@/i18n/useT";
import { useLocaleStore } from "@/i18n/locale";
import { useEffect, useState } from "react";
type Job = { name: string; lastRunAt: string; lastSuccessAt: string | null; consecutiveFailures: number };
const expected = [{ name: "lms-sync", hours: 12 }, { name: "push-dispatch", hours: 2 }, { name: "push-digest", hours: 3 }];
export default function BackgroundJobStatus() {
  const t = useT();
  const locale = useLocaleStore(s => s.locale);
  const [jobs, setJobs] = useState<Job[] | null>(null);
  const [error, setError] = useState(false);
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const controller = new AbortController();
    const load = async () => {
      try {
        const res = await fetch("/api/owner/jobs", { signal: controller.signal, cache: "no-store" });
        if (!res.ok) throw new Error();
        setJobs((await res.json()).jobs); setError(false); setNow(Date.now());
      } catch { if (!controller.signal.aborted) setError(true); }
    };
    void load(); const timer = setInterval(() => void load(), 60_000);
    return () => { controller.abort(); clearInterval(timer); };
  }, []);
  return <section data-no-i18n className="rounded-2xl border border-[var(--color-border)] p-5" aria-label={t("jobs.title")}>
    <h2 className="font-semibold">{t("jobs.title")}</h2>
    {error && <p role="alert">{t("jobs.error")}</p>}
    {!jobs && !error && <p role="status">{t("jobs.loading")}</p>}
    {jobs && expected.map(({ name, hours }) => {
      const job = jobs.find(j => j.name === name);
      const stale = !job || now - Date.parse(job.lastRunAt) > hours * 3600_000;
      return <div key={name} className="mt-3">
        <b>{name}</b>: {!job ? t("jobs.never") : job.consecutiveFailures >= 3 ? t("jobs.repeated") : job.consecutiveFailures ? t("jobs.failed") : stale ? t("jobs.stale") : t("jobs.ok")}
        <p className="text-sm">{t("jobs.success", { time: job?.lastSuccessAt ? new Date(job.lastSuccessAt).toLocaleString(locale) : t("jobs.empty") })}</p>
      </div>;
    })}
  </section>;
}
