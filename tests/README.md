# Tests

Plain `node --test` tests, no package install and no dependencies. Run them
from the kit root with Node 22.6.0 or newer:

```text
node --test tests/*.test.mjs
```

- `core.test.mjs` -- exercises `skills/delegation-audit/core.mjs`
  (`VERDICTS`, `compareVersions`, `computeAudit`, `escapeHtml`,
  `routeVerdict`, `toWeeklyHours`).
- `verifier.test.mjs` -- exercises `verifyHtml` and `verifyOwnDataRecord`
  against constructed pages and records.
