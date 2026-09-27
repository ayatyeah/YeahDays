# Learning quests and skins

Entry: Profile / Progress → «Прокачать навык» (`/learn`) or «Магазин скинов» (`/shop`).

A goal produces six quests: four fundamentals, transfer/review practice, and an independent final boss. Each contains a lesson, a text/code exercise and a hidden grading rubric. User answers are checked by OpenAI; code is never executed. Passing score: 80/100. A regular quest awards 50 learning XP + 20 coins once; the boss awards 150 XP + 60 coins once. Learning XP/levels are shown separately from existing habit XP. Skipping a day has no penalty. Completed lessons remain available for review, without repeat rewards.

Users can add the current quest to today's existing planner, with a free time slot if one is available before 22:00. Checking off that planner item does not award learning rewards; the answer must be submitted in the learning page.

Skins: default (free), scholar (60), explorer (120), astronaut (200). Coins are earned in the app, with no real-money payments. Buying and equipping are separate. Avatar rendering uses the equipped skin across the app; choosing default restores the original level-based body stages.

## Storage and deployment

Apply `docs/sql/2026-09-27-learning-profile.sql` before deploying. It only adds the `LearningProfile` table and does not alter existing user state. Prisma schema includes the matching model.

LearningProfile stores server-authored JSON + a revision. Compare-and-swap writes retry concurrent changes, protecting rewards from replay and preventing double spending. `/api/learning` scopes all reads/writes to the authenticated session; clients cannot submit balances or prices. Rubrics are removed from public responses. The client store is an in-memory view, reset on account changes; regular UserState synchronization cannot overwrite learning balances.

AI configuration uses existing server-only `OPENAI_API_KEY` and optional `OPENAI_MODEL` (default gpt-4o). Responses API structured outputs with `store: false`. Model grading is educational feedback, not an exam proctor or proof of mastery, and can make mistakes. Prompt injection is discouraged in grading instructions; financial rewards are not involved.

Limits: 15 learning requests/minute per user; 3 route generations/day, 30 grading calls/day; per-process global limits 100 generations and 1000 grading requests/day. Limits are in memory, reset on restart, and are not shared between replicas. Up to 3 incomplete routes and 12 total routes per account in this version.

## Generated art

Built-in `image_gen` was used with `public/characters/fit.png` as the identity/pose reference. Originals and alpha-preserving WebP versions are in `public/characters/skins/` (scholar, explorer, astronaut). Original generated files were preserved.

Shared final prompt:

> Use case: identity-preserve. Asset type: full-body character skin sprite for the YeahGrind learning game. Reference/edit target: the attached local gray faceless mannequin. Preserve its faceless oval head, centered straight front-facing standing pose, arms relaxed beside torso, two hands and feet fully visible, restrained black line art and muted cel-shaded illustration style. Dress the same character in the following outfit. Transparent background with real alpha; no backdrop, no text, no logo, no pedestal, no contact shadow. Full body with consistent modest margins, single character only, suitable as an app avatar at small size.

Individual prompt suffixes:

- Scholar: Scholar skin: an oversized plum purple hoodie with hood down, a small gold circular pin, dark tapered trousers, clean ivory sneakers, round dark glasses on the faceless head. Friendly student aesthetic, fully clothed.
- Explorer: Explorer skin: a teal utility jacket with orange piping, a small slim crossbody satchel, dark cargo trousers, sturdy tan boots. Thoughtful adventurer aesthetic, fully clothed, no weapons.
- Orbit: Orbit skin: a white and deep navy futuristic astronaut suit with turquoise luminous seams, orange trim, rounded transparent helmet showing the same faceless gray head, padded gloves and boots. Clean premium game costume, no weapons.

## Checks

`npm test -- src/lib/learning.test.ts src/lib/learningDb.test.ts src/app/api/learning/route.test.ts`

Paid live smoke test (opt-in, uses the local .env):

`RUN_LIVE_LEARNING=1 node --env-file=.env node_modules/vitest/vitest.mjs run src/lib/learningAi.live.test.ts`

Sources: https://developers.openai.com/api/docs/guides/structured-outputs and https://developers.openai.com/api/docs/guides/images-vision

Browser integration: `node --env-file=.env e2e/learning-shop.cjs` against a local production build on port 3120 with `AUTH_SECRET=local-learning-test-secret`, the database and OpenAI key. It creates and removes a synthetic QA account, exercises live grading, one-time reward, buying, equipping, reload persistence and avatar rendering. It makes one paid grading request.

## University subjects

`/learn` supports a university-subject route alongside generic goals. `/api/learning/subjects` reads only the authenticated user's saved calendar URL (including the existing owner-scoped legacy fallback), parses iCalendar CATEGORIES and returns deduplicated course names. No calendar credentials or assignment descriptions reach the browser. Explicitly disconnected calendars do not use the legacy fallback. Endpoint limit: 5 requests/minute per account.

This is a partial list of courses with events in the exported time window, not Moodle enrolments. Microsoft sign-in alone does not grant course/material access. Full enrolments require a separately authorized Moodle API integration (`core_enrol_get_users_courses`). Lectures are not fetched. Students can enter any missing subject and paste up to 4,000 characters of notes/syllabus. Subject name, goal and provided materials are sent to the tutor; the prompt distinguishes supplied material from general subject knowledge and treats pasted instructions as untrusted data.

Subject context is optional and stored inside the existing LearningProfile JSON. Old routes, rewards and purchases remain compatible; no migration required. Automated tests cover extraction, validation, account scoping, disconnected/error states and subject context forwarding.
