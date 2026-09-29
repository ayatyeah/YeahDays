# Activity personalization and policy 2026-09-29

The new activity profile is separate from UserState and the learning economy. Collection is off until authenticated explicit opt-in to the current policy version. Acceptance without opt-in remains possible. The public account banner requests review from everyone whose version is missing/outdated. The profile page records acceptance and lets users withdraw/delete activity statistics. Existing task/learning progress is not erased by withdrawing.

Tracked: foreground/focused time in approximate 15-second intervals, idle pause after 60 seconds without interaction, allowlisted section totals, visits separated by 30 minutes, observed completions of tasks (repeat occurrences keyed by day), actions and learning quests. Existing completions are baselined at opt-in. Only identifiers and aggregate counts are added; task titles, notes, raw keyboard input, query strings and screen recordings are not copied to analytics. Completion day is the day it is observed after state synchronization, not a guaranteed exact completion timestamp.

Row locks serialize writes, per-account time slots deduplicate concurrent tabs/retries, and completion keys prevent duplicate awards. Metrics are educational/self-reported activity, not anti-cheat proof. Achievements are cosmetic; no coins/XP are awarded for activity time. Daily target is 3 or 5 completions based on the last seven recorded days. No machine-learning model is trained and no activity history is sent to OpenAI. Legacy external PostHog product tracking is disabled.

Storage: PersonalizationProfile JSON includes current policy/choice, receipt history, timezone, daily aggregates, deduplication keys, monotonic response revision and notification campaign ledger. It persists until activity withdrawal/deletion; consent receipts and campaign ledger persist until account deletion. FK cascade and account export include the new profile. No IP or browser fingerprint is added to consent receipts.

Deploy:
1. Apply `docs/sql/2026-09-29-personalization.sql` (additive, no existing data changed).
2. Generate Prisma client, run tests/typecheck/build and deploy.
3. `node --env-file=.env scripts/announce-privacy.mjs` previews eligible accounts.
4. `node --env-file=.env scripts/announce-privacy.mjs --send` checks the live policy version, queues one service push per registered non-banned account with enabled subscriptions, and records a persistent campaign ledger. The existing dispatcher observes quiet hours. Users without push subscriptions receive the in-app version notice; no email or forced browser permission is used. Queueing is not proof of device delivery or acceptance.

Tests cover opt-in/current-version enforcement, account ownership, withdrawal, baseline, repeated completions, duplicate heartbeat slots and section sanitization. Browser and live DB checks should use disposable QA users and remove them afterwards.

Policy is based on the actual implementation, with consent controls informed by:
- https://old.adilet.zan.kz/rus/docs/Z1300000094
- https://www.edpb.europa.eu/sme/be-compliant/process-personal-data-lawfully_en
It does not certify legal compliance or assert unverified infrastructure region/backup retention guarantees.

If the normal dispatcher has not processed the queue, `node --env-file=.env scripts/deliver-privacy.mjs --send` drains only the current policy campaign with VAPID, respects device quiet hours and records push-service acceptance/expired/failure counts in the profile's campaign ledger. Atomic claiming prevents duplicate sends with a concurrently running dispatcher. A push-service acceptance is not proof that the person opened or read it. The local delivery client limits database connections and allows extra connection setup time for Railway's public proxy.

Release verification: 367 release tests passed (one paid live-AI test intentionally skipped), typecheck and production build passed. `e2e/privacy-personalization.cjs` verified the real database consent/withdrawal/export lifecycle, owner scoping, mobile UI, baseline and deduplication with a disposable account; deletion cascade was checked. Campaign on 2026-09-29 covered 5 registered non-banned accounts: 3 push services accepted notifications, 2 accounts rely on the in-app policy notice. No delivery failures or expired subscriptions were reported.
