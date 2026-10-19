# Assignment 3: main-app AI personalization comparison

The main YeahGrind website now implements the controlled comparison. `/app` is the participant home; `/today` holds benchmark tasks, `/calendar` the four-week schedule, `/progress` metrics/achievements/interview, and `/account` consent/data controls/withdrawal. `/research` redirects to `/app`. The public landing page neutrally explains participation; existing authenticated users enter the main application. The stack remains Next.js, React, TypeScript and PostgreSQL. The source DOCX is preserved.

## Equivalent conditions across the website

The same five screens, task definitions, unlock rules, 10 points per completion and milestones (1, 3, 6, 12 tasks) apply to both groups. Condition A receives predetermined feedback; B receives `gpt-4o-mini` feedback based on pseudonymous task/session events. Completion triggers feedback in both groups; both have the same manual feedback button. Neither model output nor client input can alter tasks, rewards or deadlines.

Legacy chat, planner, learning generators, personalized recommendation APIs, old analytics/sync, external task-writing integrations and push endpoints are blocked at the Next.js request boundary. Old feature pages redirect to `/app`; navigation no longer exposes them. The legacy push scheduler is not started, the push cron now serves as a daily retention backup, and LMS cron is paused. Old account data are retained for personal export/deletion, not used for study feedback. No old activity beacons, client state synchronization or automatic language translation run in the new app. Core study instructions are uniformly Russian.

The request boundary is in `src/lib/studyAccess.ts` and `src/proxy.ts`. Allowed endpoints retain their own authentication/authorization checks. API payloads cannot select condition or target another account. Deployment must include the updated proxy, not merely the client UI.

## Accounts, consent and transition

`ResearchParticipant.condition` fixes the account's group. Random permuted blocks of two allocate up to 30 non-pilot accounts, balanced 15/15, under a PostgreSQL advisory lock. Withdrawal does not free a slot. Research exports use random pseudonyms without account IDs/names/emails; the account mapping remains access-controlled in the database. This is pseudonymization, not irreversible anonymization.

Consent is explicit before enrollment: adult status, no development/testing involvement, voluntary participation/event collection and conditional OpenAI event transfer. Users can decline and sign out, or access their account export/deletion without consenting. No existing account is enrolled automatically.

The original standalone version already had one non-pilot participant at the time this change was prepared. Its assignment, enrollment time, events and answers are retained. A `main-app-v1` confirmation is required before further events/tasks/feedback. Accepting it records an `app_consent` transition event once; it does not restart the clock or clear progress. The export includes interface version, consent timestamp and `mixed_interface`. The analysis script excludes mixed-interface accounts from pooled summaries and writes an explicit exclusion file; keep their raw records and discuss the transition separately. Withdrawal retains the interface/consent marker, so attrition is counted under the correct version even after events are erased.

## Frozen measurement rules

- Core task protocol `assignment3-v1`, main interface consent `main-app-v1`. Four consecutive 7-day UTC intervals from server enrollment. Tasks close at day 28; interviews remain available afterwards.
- Three identical tasks per week, 12 total. Completion is self-reported; personal task content is not collected. Timing is server wall-clock time between “Open and start” and “Complete”, including breaks and network latency, not active work time.
- All five main sections record focused, visible interaction after consent. A new session starts after at least 30 minutes without a recorded interaction. Interaction writes are throttled to once per minute; boundary precision is approximately one minute. Idle tabs do not produce periodic heartbeats.
- Row locks serialize task actions across devices. Repeated start/completion requests neither reset timers nor duplicate points. Gamification is derived from persisted completions.
- Tasks unlock by assignment week and remain available through day 28. Completion rates group by assignment week, including later completions; session counts group by actual event week. Future weeks use null metrics, not zeros; in-progress weeks are flagged.
- Identical six neutral questions and three optional 1–5 ratings open in week four. Ratings are perceived judgments, not a validated psychological scale.
- Pilot accounts are excluded. Withdrawn accounts contribute attrition counts but no erased behavioral data. Account deletion cascades all study records, so fully deleted accounts cannot remain in attrition counts.
- AI failures are visible and recorded, without substituting fixed feedback and labeling it as AI. Only event types, UTC timestamps, benchmark IDs and week are sent to OpenAI with `store: false`; no names, account IDs, private plans or interview text.

## Operations and retention

1. Apply additive `docs/sql/2026-10-19-research.sql` and generate Prisma. The main-app transition uses existing JSON fields and needs no further schema migration.
2. Configure `RESEARCH_CONTACT`, `RESEARCH_DELETE_AT`, `OPENAI_API_KEY` and `RESEARCH_ENABLED=true`. The deletion deadline must be more than 28 days ahead for new enrollment. The deployed consent uses the published contact and 17 January 2027 at 23:59:59 Asia/Almaty; the enrollment gate closes automatically when fewer than 28 days remain. Review the final materials with the research team before recruiting.
3. Set `RESEARCH_RETENTION_ENABLED=true`. The persistent server checks deadlines at startup and hourly. `.github/workflows/push-cron.yml` independently calls authenticated `/api/research/retention` daily using the existing `CRON_SECRET`. Manual preview/deletion: `node --env-file=.env scripts/research-admin.mjs purge [--apply]`.
4. Retention uses the deadline captured at enrollment, not later environment edits. Withdrawal immediately erases events/interviews, retaining only participation/consent markers until the deadline. Export copies and backups require the team's separate retention procedure.
5. Technical pilots: `node --env-file=.env scripts/research-admin.mjs pilot USER_ID A` (or B), dedicated developer accounts only. Never relabel real participant accounts as pilot records.
6. UI submission requires a successful server response. Offline edits are not queued. The offline page explains that an internet connection is required for task timing/completion.

## Exports, analysis and qualitative coding

Owner console links to `/admin/research`: group enrollment, withdrawals, interviews, pseudonymous participant metrics and downloads. `/api/owner/research` returns behavior; `?dataset=interviews` returns a separate restricted interview dataset. Normal users cannot access these. Personal `/api/account` export includes the user's research data.

`python scripts/analyze-research.py research-behavior.json /path/to/results` produces participant-week CSV, group means/medians/sample standard deviations, missingness counts, a weekly-session SVG and `analysis-scope.json` with excluded interface exposures. Fully observed weeks only enter weekly group summaries; completed trials only enter final totals. Repeated weeks are not independent participants; no significance claims are generated.

Coding guide: engagement = interest/continued involvement; motivation = reasons to start, return or finish; usefulness = whether feedback helps. Add frustration/confusion and unexpected themes as supported. Keep negative cases, manually de-identify quotes and compare themes alongside behavioral patterns, including contradictions. At 15 per group, results are exploratory. Technical tests are not research findings.

## Validation and submission evidence

Run `npm run typecheck`, `npm test`, `npm run build` and `node e2e/research.mjs` against an isolated local test database. The browser test exercises all five main sections, 320/390/1440-pixel widths, dark theme, consent, concurrent completion retries, A/B allocation, direct legacy API blocks, absence of old analytics, interview, admin export, existing-account transition preservation and withdrawal. Screenshots are under `artifacts/research/main-*`.

Record deployed commit, screenshots, runtime configuration and a live B response separately. A live A/B pilot call was verified before the main-app transition and temporary pilot accounts were deleted. The final submission must distinguish technical evidence from actual four-week findings and report mixed-interface exposure, missing data and attrition.
