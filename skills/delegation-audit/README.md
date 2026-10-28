# delegation-audit

The conductor skill: the full pipeline from "I am doing everything myself" to a
single shareable one-page audit, plus the cascade language.

- `SKILL.md` -- the four-stage pipeline and when it activates.
- `core.mjs` -- shared deterministic logic (`VERDICTS`, `compareVersions`,
  `computeAudit`, `escapeHtml`, `routeVerdict`, `toWeeklyHours`).
- `verify-html.mjs` -- checks a finished `audit.html`.
- `verify-own-data.mjs` -- checks a working `tasks.md`; `--install` mode
  requires a refusal demonstrated on the buyer's own week.

At install this folder is also where `USER-CONFIG.md`, `branding/`, `VERSION`,
`OPERATIONS-MANUAL.md`, and `examples/` land.
