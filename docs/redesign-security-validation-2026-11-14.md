# Redesign security and validation · 14 November 2026

Scope: the redesigned public page, study workspace, course readers, translation UI, authentication changes, API mutation boundary and dependency tree. This is a focused engineering review, not a penetration test or a guarantee that the entire historical application has no vulnerabilities.

## Changes

- Reject foreign browser origins for API mutations. Forwarded host/protocol headers are not used as an origin allowlist. OAuth callbacks keep Auth.js state/PKCE handling.
- Stream and bound JSON request bodies in study creation, registration and password changes, including bodies without Content-Length. Tests cover cancellation and UTF-8 byte counts.
- Disable automatic Google account linking by email. Existing linked identities continue to work; linking a new identity requires an authenticated account. Password registration does not verify ownership of an email address.
- Bound new bcrypt passwords to 72 UTF-8 bytes and at least eight characters; rate-limit account password changes. Existing password sign-in remains compatible.
- Deny paid AI requests if the persistent daily quota counter is unavailable. Gemini output is schema-checked; context is treated as data, and XP remains server-controlled.
- Set anti-framing/object/base CSP directives and X-Frame-Options. This is deliberately a limited CSP, not a strict script policy. Private account export and study responses use no-store.
- Update vulnerable runtime and development dependencies. Scoped overrides: Prisma config uses deepmerge-ts 8.0.0; TypeScript ESLint uses minimatch 11.0.8. Prisma generation, lint, type checking and the application build pass with these overrides. `npm ci --ignore-scripts --dry-run` accepts the lockfile.

`npm audit` reports **0 known vulnerabilities**, including development dependencies, at this review. [The minimatch advisory](https://github.com/advisories/GHSA-g3hv-75wg-m249) identifies the affected glob preprocessing path and the patched major version; the application does not expose a glob entry point to users.

## Verified

- Complete check: lint, TypeScript, **945 passing tests**, six skipped tests, production build.
- Local HTTP: unauthenticated study request returns 401/no-store; foreign-origin mutation returns 403; CSP, X-Frame-Options and nosniff are present.
- Production-mode client assets: 108 JS/JSON/CSS/HTML/map files scanned against 13 locally configured private values, including all six Gemini keys; **no value matches**. Secret values were not printed.
- Browser: real Gemini personalized task creation on a disposable local account, start/completion, 10 XP, saved reflection and progress; live phrase translation, English/Russian source selection, course navigation and research case controls.
- Desktop and 390 px mobile views; light and dark themes. A mobile dock offset inherited from old CSS was found and corrected. The inspected notebook page has no horizontal page overflow.
- Sampled notebook text/navigation contrast: light theme 5.41:1–13.86:1, dark theme 6.85:1–15.54:1. These are measured role samples, not a claim of full WCAG certification.
- Structural translation checks preserve IDs, sources, non-language values and scoring across cloud materials and network review cards. Source/output hashes are retained separately.

The phrase translator uses MyMemory only after submission and is limited to 500 UTF-8 bytes. The UI discloses that destination. Gemini receives goal, course, difficulty and minutes after consent, not account identifiers or private reflections. External AI/translation services can be unavailable and their wording can be imperfect.

The five frontend skills were reviewed independently; see `skill-security-review-2026-11-14.md` for pinned revisions and excluded installer/MCP behavior. No new external skill service was enabled.

## Recovery

Original pre-final code and private file/database backups remain intact. The additional Git tag `backup/yeahgrind-before-design-v2-2026-11-14` records the version immediately before this design pass. No database schema or migration changed in this pass.
