# AI planner

Calendar → «ИИ-помощник · расписание со скрина».

Railway service variables:

- `OPENAI_API_KEY`: OpenAI project API key (server only).
- `OPENAI_MODEL`: optional, defaults to `gpt-4o`; the selected model must support image inputs and strict structured outputs in the Responses API.

Apply variables and deploy. A valid key also needs API billing/quota and model access. No database migration is needed. The UI reports when no key is configured; this does not verify its balance or validity.

Modes: timetable extraction from PNG/JPEG/WebP or text, task creation from text, and day-planning advice using the selected day's tasks. Images are limited to 5 MB and 20 million pixels; they are normalized in memory, not saved to the app database. Requests use `store: false`. The screen explicitly says which data is sent to OpenAI.

Imports use the calendar's selected week for weekdays without dates. Weekly repetition is user-controlled and only applies to undated weekday entries. Explicit dates are one-off. Unknown class times are skipped with a warning. New tasks use the existing account synchronization. Existing tasks are preserved, exact duplicates skipped, and the last added batch can be undone. Advice does not mutate tasks.

Authenticated users only. In-memory limits: 5 requests/minute and 40/day per user, 500/day per process; limits reset on process restart and are not shared between replicas. Configure an OpenAI project budget separately as appropriate.

Validation: `npm test -- src/lib/aiPlanner.test.ts src/app/api/ai/planner/route.test.ts`. These use mocked API responses and do not prove OCR accuracy or a live API key's availability.

Official API references:
- https://developers.openai.com/api/docs/guides/images-vision
- https://developers.openai.com/api/docs/guides/structured-outputs
