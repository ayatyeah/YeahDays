# Assignment 3: AI personalization comparison

The implementation adds an isolated `/research` workflow to the existing Next.js/React/TypeScript and PostgreSQL application. It does not retroactively turn ordinary app analytics into study data. The original DOCX is preserved. Its claim that the study is already deployed must be verified after deployment; local implementation is not evidence of a deployed study.

## Implemented flow

Authenticated account → neutral information and explicit consent → immutable server assignment A/B → open benchmark → server start timestamp → completion → persisted event → identical 10-point reward → owner export. Group A gets fixed feedback without calling OpenAI. B uses `gpt-4o-mini`, with only study event types, UTC timestamps and benchmark IDs. Interview text, account identifiers and ordinary app content are excluded from the model request. AI failures are visible; they are never silently relabeled as successful personalization.

`ResearchParticipant.condition` is the account flag. Random permuted blocks of two are allocated under a PostgreSQL advisory transaction lock, up to 30 non-pilot accounts (15 each). Allocation cannot be selected in the browser. Withdrawal does not free a recruitment slot. A unique random participant ID is exported without the account mapping. Mapping and research data remain in the access-controlled application database; this is pseudonymization, not irreversible anonymization.

The study page has its own shell, without ordinary app recommendations, mascot prompts or navigation. Ordinary app features remain available outside this page. Recruitment instructions therefore restrict study activity to `/research`. This is not a site-wide A/B experiment: external feature use is a possible contamination source and should be documented in interviews. To study the entire app instead, its other AI surfaces and personalized notifications would need separate gating. Study sessions measure interaction with this module only.

## Measurement rules, frozen before recruitment

- Protocol `assignment3-v1`, four consecutive 7-day intervals from each account's server enrollment time, UTC. Tasks stop at 28 days; interviews remain available afterwards.
- Three predefined, identical tasks per week; no task content is collected. Completion is self-reported. Timing starts when the server processes “Open and start” and stops when it processes “Complete”. It measures wall-clock time, including breaks and network latency, not active work time.
- Session starts on visible focused entry or interaction after at least 30 minutes without recorded interaction. Browser interaction updates are throttled to at most once per minute; boundary precision is therefore approximately one minute. Idle tabs do not generate periodic activity.
- Row locks serialize actions across devices. A task can start and complete once, so retries cannot reset timing or duplicate points. Points are calculated from persisted completion events, not trusted from the browser.
- Tasks unlock in their assigned week and stay available until day 28. Completion rates are grouped by assignment week, including later completion; session counts are grouped by event week. There are 12 total assigned tasks over a completed trial. Future/unobserved weeks have null metrics, not zero. In-progress weeks are flagged.
- Six identical neutral interview questions and three optional 1–5 perceived ratings open in week four. These are not a validated psychological scale.
- Developer/pilot accounts are excluded. Withdrawals remain visible as counts, with erased events and interviews. They are not converted into zero engagement. Account deletion cascades all study data, including the withdrawal marker.
- Technical failures, missing starts, invalid durations and missing interviews must be reported. Duplicate writes are prevented by the task state machine. AI errors are logged. No significance claims are computed.

## Local checks and deployment

1. Apply additive `docs/sql/2026-10-19-research.sql` to the intended database and run `npx prisma generate`. Apply the migration before deploying code, including the updated account export.
2. Run `npm run typecheck`, `npm test`, `npm run build` and `node e2e/research.mjs` against an isolated test database (see script variables).
3. For a technical pilot, use dedicated developer accounts: `node --env-file=.env scripts/research-admin.mjs pilot USER_ID A` (and B). Pilot accounts bypass recruitment but never enter study exports. Do not relabel real participant records as pilots.
4. Approve the study materials and benchmark scripts with the team, set the actual `RESEARCH_CONTACT`, `RESEARCH_DELETE_AT` and `OPENAI_API_KEY`, then set `RESEARCH_ENABLED=true`. No participants are recruited by this code change. Consent requires adult status, non-developer status, voluntary study consent, and conditional AI-transfer consent before randomized assignment.
5. Keep prompts and instructions identical across groups. This implementation does not send recruitment messages or scheduled reminders. If reminders are used, send the same schedule to both groups.
6. Set `RESEARCH_RETENTION_ENABLED=true` on the persistent Railway web server. It checks deadlines at startup and hourly, independently of push settings. The manual alternative is `node --env-file=.env scripts/research-admin.mjs purge --apply`; without `--apply` it previews the count. Retention uses the date captured at consent, not a later edited environment value. Exported copies and backups require the team's separate retention procedure; the script cannot delete them. Withdrawal immediately erases behavioral and interview data while retaining only a participation marker until retention expiry.

## Export and analysis

An authorized owner/admin downloads `/api/owner/research` (behavior) and `/api/owner/research?dataset=interviews` (separate restricted interview file). Both responses prohibit caching. Ordinary users cannot export other participants. Personal account export also includes the user's research record.

Run `python scripts/analyze-research.py research-behavior.json /path/to/results`. This produces participant-week CSV, group means/medians/sample standard deviations and missingness counts, and a weekly-session SVG. Only fully observed weeks enter group trends. Repeated weeks are not pooled as independent participants. No real results or illustrative participant data are fabricated.

Qualitative coding guide: engagement = interest/continued involvement; motivation = reasons to start, return or finish; usefulness = whether feedback helps; add frustration/confusion and unexpected themes as supported. Preserve negative cases. De-identify quotations manually before using them. Integrate each group's behavioral patterns with interview themes and discuss contradictions. At n=15 per condition, report exploratory patterns rather than broad causal conclusions.

## Evidence still required for submission

Capture consent, task start/completion, fixed A feedback, actual B model feedback, and an authorized export after deployment. Record the deployed commit, software versions, final protocol dates, approved recruitment text and technical pilot results. The implementation cannot establish ethics approval, model availability, real participation or a four-week outcome by itself.

## Verification recorded during implementation

Production build and TypeScript checks passed. The existing suite passed 661 tests with one paid live-AI test skipped; the final focused research suite passed 13 tests after adding the total-median check. A Chromium browser run against an isolated local PostgreSQL database passed consent, assignment, task timing/completion, duplicate submission, interview, account/owner export, access control and withdrawal checks. Mobile and desktop screenshots are in `artifacts/research/`. The external OpenAI call was tested with a mocked response; a paid live B-model invocation was not performed. These are technical pilot checks, not research findings.
