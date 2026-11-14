# Reading mode, quiz selection and learning-lab landing

Validated on 2026-11-14 using the local development database and a disposable QA account.

- `npm run check`: lint, typecheck, 947 passing tests (6 skipped), and production build passed.
- `npm audit`: 0 reported vulnerabilities. No dependencies added.
- Browser: quiz selections remain visible in light/dark themes, support keyboard toggling, and show a selection count. Graded wrong/correct colors remain distinct.
- Browser: mobile assistant sits above the navigation with a 16px gap. Clean mode hides the shell and reading navigation; exit, reading language, translator and assistant remain available. Switching language and returning to normal mode work.
- Browser: Cloud notebook assistant receives chapter context; RMT receives the selected case/design context. Automated tests cover both context paths. No paid AI request was needed for these follow-up checks.
- Browser: landing course selection, explanation disclosure and standard/context task toggle work. Desktop and mobile views were inspected; 320px viewport has no horizontal overflow. Dark theme was inspected. No browser errors were reported on the tested fresh local pages.
- New animation is a short state change with a reduced-motion fallback. The landing clearly labels its examples and does not claim to generate a live AI plan.
- Skill review scope, pinned sources and automation exclusions: `additional-skills-review-2026-11-14.md`.

This change has no database migration and does not alter authentication or AI consent/quota policy. Original logo, course/event links and existing backups are retained.
