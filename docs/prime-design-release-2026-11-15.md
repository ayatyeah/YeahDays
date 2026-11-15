# Prime design implementation — 15 November 2026

Implements the approved app, reader and landing concepts from `.out/yeahgrind-prime-concepts-2026-11-15/`. The landing describes the product and its benefits instead of naming academic courses. The authenticated library still contains the original five courses and revision events.

## Design and behavior

- Original YeahGrind logo; cool paper surfaces, cobalt controls and consistent light/dark colors.
- Live HTML/CSS notebook illustration with Read / Practise / Reflect controls, textured covers, page edges and bookmarks. No raster screenshot is used as a substitute for an interface.
- Five overlapping landing books: Notes, Practice, Your plan, AI assistant and Progress. Sticky behavior yields to reduced motion, short viewports, keyboard focus and printing.
- A study desk with one next action, actual saved task state, a five-course folder shelf and an events destination. Mobile navigation has My study, Courses and Events; account access remains in the header and progress in the workspace footer.
- Source Serif reading text, a highlighted current notebook section, inline clean mode, translation and language controls. Clean mode keeps the assistant and return control available. The assistant remains above mobile navigation.
- Existing AI consent, provider keys, quizzes, original learning content, account storage and study APIs remain in use. No database schema or production configuration changes are introduced.
- Fixed an existing save-error bug found by browser verification: a failed plan creation must retain the entered goal and permit retry. Initial load failures are now distinguished from mutation failures.

## Recovery

Baseline commit: `951ba66353c35472772f6e1653cb52ddd1d21691`.

Local backup branch: `codex/backup-before-prime-2026-11-15`.

Backup directory: `/home/yeahayat/Загрузки/YeahGrind_Backups/before-prime-2026-11-15/`.

The directory contains an archive of all tracked source, a separate archive of existing untracked application assets, and restore metadata. The tracked archive was read back successfully (2,599 entries). This is a source backup, not a new database snapshot. The release changes no existing learner records.

## Verification

- ESLint, TypeScript and optimized Next.js build.
- Unit/API suite: 947 passed, 6 skipped; separate database integration and restore checks remain required in CI.
- Dependency audit at preparation time: 0 reported vulnerabilities.
- `scripts/check-prime.mjs`: actual local test accounts, plan creation, failed-save recovery, task completion/reflection persistence, account isolation, unauthenticated access, rejected cross-origin mutation, restricted owner diagnostics, events, mobile clean mode, language switch, translator access, assistant position and visible multi-answer selection.
- `scripts/check-landing.mjs`: both themes at 320, 390, 768, 1280 and 1440 px, notebook controls, sticky books, reduced motion, keyboard access, FAQ and registration navigation.
- Existing diagnostic privacy checks and complete 50-question PM quiz persistence/submission/timer checks remain in CI. The PM entry button selector now uses the existing English label.
- Browser results and screenshots: `artifacts/prime-workspace/`, `artifacts/landing-prime/`, `artifacts/pm-quiz2/`. CI uploads these as `prime-browser-verification`.

The previous Quality run (43600663702, baseline commit) failed on legacy Today task selectors. CI now exercises the current study workspace instead of obsolete Today, calendar and onboarding layouts. Legacy specifications are retained in `e2e/specs/`; database synchronization tests and restore verification remain enabled. This is a change in UI coverage, not evidence that the archived legacy screens were retested.

The browser suite opens the translator without sending test text to its external provider; it uses standard study plans and does not spend live Gemini quota. These checks are a release regression pass, not a comprehensive security penetration test. Production success is recorded separately only after the exact commit is live and the public URL has been checked.
