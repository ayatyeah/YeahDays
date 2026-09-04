/**
 * POST /api/cron/lms-sync — подтянуть дедлайны из календаря Moodle (AITU
 * LMS) в задачи пользователя. Дёргается кроном из GitHub Actions, как и
 * /api/push/dispatch (см. .github/workflows/lms-sync.yml).
 *
 * Почему файл, а не API Moodle: веб-сервисы в AITU закрыты на nginx —
 * /login/token.php и /webservice/rest/server.php отдают 403, тогда как
 * /login/index.php с того же адреса отвечает 200. Значит закрыты
 * намеренно. Живым остался штатный ical-экспорт календаря, его и тянем.
 *
 * Авторизация — CRON_SECRET, тот же Bearer, что у /api/push/*. Ключ
 * ApiKey/пейринг-код здесь не нужны: это не внешний сервис, а собственный
 * крон, он пишет через externalState напрямую.
 *
 * ?dry=1 — разобрать и показать, что было бы создано, ничего не записывая.
 */

import { NextResponse } from "next/server";
import { parseEvents } from "@/lib/ical";
import { planSync, newDeadlineNotice, DEFAULT_ZONE } from "@/lib/lmsCalendar";
import { loadState, saveState, makeId, type Todo } from "@/lib/externalState";
import { sendPushToUser, pushConfigured } from "@/lib/push";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Календарь семестра — это килобайты; всё, что сильно больше, это не он. */
const MAX_ICS_BYTES = 5 * 1024 * 1024;
/** LMS может задуматься, но крон не должен висеть вечно. */
const FETCH_TIMEOUT_MS = 20_000;

function authorized(req: Request): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  return req.headers.get("authorization") === `Bearer ${secret}`;
}

export async function POST(req: Request) {
  if (!authorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const icalUrl = process.env.LMS_ICAL_URL;
  const userId = process.env.LMS_SYNC_USER_ID;
  if (!icalUrl || !userId) {
    return NextResponse.json(
      { error: "LMS_ICAL_URL and LMS_SYNC_USER_ID must be set" },
      { status: 500 },
    );
  }

  const dry = new URL(req.url).searchParams.get("dry") === "1";
  const zone = process.env.LMS_TIMEZONE || DEFAULT_ZONE;

  // Тянем выгрузку. Сеть до чужого сервера — самое вероятное место отказа,
  // поэтому таймаут явный: без него зависший запрос держал бы прогон крона
  // до таймаута платформы.
  let ics: string;
  try {
    const res = await fetch(icalUrl, {
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
      headers: { accept: "text/calendar" },
      cache: "no-store",
    });
    if (!res.ok) {
      return NextResponse.json({ error: `LMS responded ${res.status}` }, { status: 502 });
    }
    ics = await res.text();
  } catch (e) {
    console.error("lms-sync: fetch failed:", e);
    return NextResponse.json({ error: "LMS fetch failed" }, { status: 502 });
  }

  if (ics.length > MAX_ICS_BYTES) {
    return NextResponse.json({ error: "Calendar too large" }, { status: 502 });
  }

  // Протухший или отозванный токен Moodle отдаёт СТРАНИЦЕЙ с кодом 200, а
  // не 4xx — без этой проверки синк молча считал бы, что дедлайнов нет.
  if (!ics.includes("BEGIN:VCALENDAR")) {
    console.error("lms-sync: ответ не похож на календарь (токен протух?)");
    return NextResponse.json({ error: "Response is not a calendar" }, { status: 502 });
  }

  const events = parseEvents(ics, zone);
  const state = await loadState(userId);
  const plan = planSync(events, state.todos ?? [], { zone });

  if (dry || plan.create.length === 0) {
    return NextResponse.json({
      ok: true,
      dry,
      events: events.length,
      created: 0,
      wouldCreate: plan.create.length,
      alreadyPresent: plan.alreadyPresent,
      unusable: plan.unusable,
      preview: plan.create.slice(0, 20),
    });
  }

  const now = Date.now();
  const todos: Todo[] = plan.create.map((draft) => ({
    id: makeId(),
    title: draft.title,
    note: draft.note,
    date: draft.date,
    hour: draft.hour,
    minute: draft.minute,
    duration: draft.duration,
    priority: draft.priority,
    subtasks: [],
    done: false,
    doneDays: [],
    createdAt: now,
    completedAt: null,
  }));

  state.todos = [...todos, ...(state.todos ?? [])];
  await saveState(userId, state);

  // Пуш строго ПОСЛЕ успешной записи: уведомление про дедлайн, которого
  // не оказалось в задачах, хуже, чем отсутствие уведомления.
  //
  // Тихие часы уважает сам sendPushToUser — по локальному времени каждого
  // устройства отдельно. Если в этот момент тихо на всех, уведомление
  // теряется: повторно оно не придёт, потому что следующий прогон уже
  // ничего не создаст. Задачи при этом на месте, человек увидит их в
  // приложении. Крон ходит в 08/16/22 по Алматы, а тихие часы по
  // умолчанию 23–7, так что попасть в них можно только вручную сдвинув
  // настройки.
  const todayKey = new Date().toISOString().slice(0, 10);
  const notice = newDeadlineNotice(plan.create, todayKey);
  let push = { sent: 0, skipped: 0, expired: 0 };
  if (notice && pushConfigured) {
    try {
      push = await sendPushToUser(userId, notice);
    } catch (e) {
      // Задачи уже записаны — падать из-за недоставленного пуша нельзя,
      // иначе крон отчитается ошибкой о прогоне, который на деле удался.
      console.error("lms-sync: push failed:", e);
    }
  }

  return NextResponse.json({
    ok: true,
    dry: false,
    events: events.length,
    created: todos.length,
    alreadyPresent: plan.alreadyPresent,
    unusable: plan.unusable,
    push,
  });
}
