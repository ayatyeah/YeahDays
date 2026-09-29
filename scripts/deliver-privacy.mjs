// Deliver only this policy campaign; does not trigger other scheduled reminders.
// node --env-file=.env scripts/deliver-privacy.mjs --send
import { PrismaClient } from '@prisma/client';
import webpush from 'web-push';
const databaseUrl = new URL(process.env.DATABASE_URL);
databaseUrl.searchParams.set('connection_limit', '1');
databaseUrl.searchParams.set('connect_timeout', '30');
const db = new PrismaClient({ datasources: { db: { url: databaseUrl.toString() } } });
const version = '2026-09-29';
const quiet = (h, from, to) => from === to ? false : from < to ? h >= from && h < to : h >= from || h < to;
try {
  if (!process.argv.includes('--send')) throw new Error('Pass --send for the authorized policy campaign');
  if (!process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || !process.env.VAPID_PRIVATE_KEY) throw new Error('Push is not configured');
  const response = await fetch('https://yeahdays-production.up.railway.app/privacy');
  if (!response.ok || !(await response.text()).includes(version)) throw new Error('Policy not live');
  webpush.setVapidDetails(process.env.VAPID_CONTACT || 'mailto:noreply@yeahgrind.app', process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY, process.env.VAPID_PRIVATE_KEY);
  const pending = await db.scheduledNotification.findMany({ where: { key: `privacy:${version}`, sentAt: null, fireAt: { lte: new Date() } }, include: { user: { select: { state: { select: { data: true } }, pushSubs: { where: { enabled: true } } } } } });
  let sent = 0, expired = 0, failed = 0, deferred = 0;
  for (const item of pending) {
    const prefs = item.user.state?.data?.notify ?? {};
    const subs = item.user.pushSubs.filter(s => !quiet(new Date(Date.now() - s.tzOffset * 60000).getUTCHours(), prefs.quietFrom ?? 23, prefs.quietTo ?? 7));
    if (!subs.length) { deferred++; continue; }
    const claimed = await db.scheduledNotification.updateMany({ where: { id: item.id, sentAt: null }, data: { sentAt: new Date() } });
    if (!claimed.count) continue;
    const result = { sent: 0, expired: 0, failed: 0 };
    for (const sub of subs) {
      try {
        await webpush.sendNotification({ endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } }, JSON.stringify({ title: item.title, body: item.body, url: item.url, kind: 'day', tag: item.key }), { TTL: 6 * 3600 });
        sent++; result.sent++;
      } catch (error) {
        if ([404, 410].includes(error.statusCode)) { expired++; result.expired++; await db.pushSubscription.deleteMany({ where: { id: sub.id } }); }
        else { failed++; result.failed++; }
      }
    }
    await db.$executeRaw`UPDATE "PersonalizationProfile" SET "data" = jsonb_set("data", '{notice,delivery}', ${JSON.stringify(result)}::jsonb, true), "updatedAt" = NOW() WHERE "userId" = ${item.userId}`;
  }
  console.log(JSON.stringify({ campaign: version, accountsProcessed: pending.length - deferred, pushServicesAccepted: sent, expiredSubscriptions: expired, failed, deferred }));
} catch (error) { console.error('Policy delivery failed:', error.code || error.name); process.exitCode = 1; }
finally { await db.$disconnect(); }
