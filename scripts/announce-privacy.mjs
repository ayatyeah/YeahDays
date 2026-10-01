// Run after deployment: node --env-file=.env scripts/announce-privacy.mjs --send
// Default is a read-only preview. Persistent per-user ledger prevents repeat campaigns.
import { PrismaClient } from '@prisma/client';
const db = new PrismaClient();
const version = '2026-09-29';
const send = process.argv.includes('--send');
const quiet = (hour, from, to) => from === to ? false : from < to ? hour >= from && hour < to : hour >= from || hour < to;
try {
  const users = await db.user.findMany({ where: { banned: false, OR: [{ username: { not: null } }, { email: { not: null } }, { accounts: { some: {} } }] }, select: { id: true, state: { select: { data: true } }, personalization: { select: { data: true } }, pushSubs: { where: { enabled: true }, select: { tzOffset: true } } } });
  const eligible = users.filter(u => u.personalization?.data?.notice?.version !== version);
  if (send) {
    const response = await fetch('https://yeahgrind.site/privacy');
    if (!response.ok || !(await response.text()).includes(version)) throw new Error('New policy is not deployed; no messages queued');
  }
  let queued = 0, inAppOnly = 0;
  for (const user of eligible) {
    if (!send) continue;
    let fireAt = new Date();
    const prefs = user.state?.data?.notify ?? {};
    const from = prefs.quietFrom ?? 23, to = prefs.quietTo ?? 7;
    // Prefer a time outside quiet hours for every enabled device. If timezones
    // have no shared window, dispatch still respects each device's quiet hours.
    for (let minute = 0; minute < 24 * 60; minute += 5) {
      const candidate = new Date(Date.now() + minute * 60000);
      if (user.pushSubs.every(s => !quiet(new Date(candidate.getTime() - s.tzOffset * 60000).getUTCHours(), from, to))) { fireAt = candidate; break; }
    }
    await db.$transaction(async tx => {
      await tx.personalizationProfile.upsert({ where: { userId: user.id }, create: { userId: user.id, data: { revision: 0, version: '', acceptedAt: null, enabled: false, since: null, receipts: [], timezone: 'Asia/Almaty', days: {}, seen: [], lastTick: 0 } }, update: {} });
      await tx.$queryRaw`SELECT "userId" FROM "PersonalizationProfile" WHERE "userId" = ${user.id} FOR UPDATE`;
      const row = await tx.personalizationProfile.findUniqueOrThrow({ where: { userId: user.id } });
      if (row.data.notice?.version === version) return;
      if (user.pushSubs.length) {
        await tx.scheduledNotification.upsert({ where: { userId_key: { userId: user.id, key: `privacy:${version}` } }, create: { userId: user.id, key: `privacy:${version}`, kind: 'policy', title: 'Обновлена политика YeahGrind', body: 'Прочитай и прими новую политику. Учёт активности для персонализации включается отдельно, по твоему выбору.', url: '/personalization', fireAt }, update: {} });
        queued++;
      } else inAppOnly++;
      await tx.personalizationProfile.update({ where: { userId: user.id }, data: { data: { ...row.data, notice: { version, queuedAt: new Date().toISOString(), pushQueued: user.pushSubs.length > 0 } } } });
    }, { timeout: 15000 });
  }
  console.log(JSON.stringify({ mode: send ? 'queued' : 'preview', accounts: users.length, notPreviouslyNotified: eligible.length, pushAvailable: eligible.filter(u => u.pushSubs.length).length, queued, inAppOnly }));
} catch (error) { console.error('Privacy announcement failed:', error.code || error.name); process.exitCode = 1; } finally { await db.$disconnect(); }
