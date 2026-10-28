# How Delegation Audit was built

Sources for this page: the kit's `CHANGELOG.md`, its tests, the history of the
private business repository it was developed in (under `pocs/kits/` and later
`kits/`), the pull request for its 2026-08-13 hardening round, and the internal
audit and workout reports from August 2026. This public repository starts from
a single snapshot commit on 2026-10-27.

## The problem and the first version (2026-08-12)

The kit came out of a quality audit of the whole kit line on 2026-08-11. That
audit proposed new kits built on mechanisms that had already proved
themselves, and one of them was a delegation audit for business coaches to run
with their clients: take the owner's real week and show what could move off
their plate.

Version 0.1.0 was built on 2026-08-12 as a re-skin of the Idea Forge pipeline,
with no new mechanism invented. Its five skills map one to one onto Idea
Forge's: capture-first listening became `task-dump`, the
one-question-at-a-time interview became `task-grilling` with four fixed
questions per task, and the page builder became `audit-page`, with a light,
print-first template because the page is meant to be handed across a table.
It shipped with its first named refusal (a task without a concrete action,
stated hours, a stated consequence and an owner of the judgment is not
graded) and a rate refusal (no dollar figure unless the owner states their own
rate). The changelog marked it "written, nothing in the acceptance checklist
has been run".

## Timeline

| Date | Version | What happened |
| --- | --- | --- |
| 2026-08-11 | - | Kit-line audit proposes the kit and its deterministic design. |
| 2026-08-12 | 0.1.0 | Built as an Idea Forge re-skin: five skills, verdict table, two refusals. |
| 2026-08-12 | 0.2.0 | Workout: three simulated-buyer rounds, nineteen observed defects fixed. |
| 2026-08-13 | 0.2.1 | Hardening pass: plain-Node core, two verifiers, first tests (14). |
| 2026-08-17 | 0.2.2 | Cross-model review: verifier bypasses closed, 22 tests. |
| 2026-08-24 | 0.2.2 | Kit moved from `pocs/kits/` to `kits/`. |
| 2026-10-27 | 0.2.2 | Public portfolio snapshot. |

## Key design decisions

- **A lookup table decides, not the model.** The verdict is
  `whose judgment x what breaks if wrong`, the refusal trigger is a
  four-field completeness check, and the arithmetic is fixed (half credit on
  hand-downs, 4.33 weeks a month) and printed on the page with its working.
  The AI runs the conversation; the outcome is reproducible.
- **Hours first, money only on the owner's word.** No benchmark rate is ever
  substituted. Worked example 3 is a page with no dollar figures at all.
- **Extend, never replace.** Every hand-off names a person who takes ownership
  of an outcome. The kit does not produce an audit framed as removing a job.

## Simulated buyers (2026-08-12)

The same afternoon, the kit went through a "workout": a Claude Opus agent ran
the kit's own workflows literally as three invented buyers (an overhead-door
contractor, a dental practice reached through a coach, and a landscaper who
opened the examples first), fixed what broke, and ran again. Nineteen defects
were observed and fixed. The ones that changed the design:

- **Question zero.** The kit gave office-worker answers to tradespeople: "AI
  carries this" for driving parts to a job site, "AI drafts, you approve" for
  answering a ringing phone. Every task now starts with "does this happen on a
  screen, or out in the world?", and a task in the world can only receive the
  new fifth verdict, `Hand down, no AI`. A task with a screen part is split at
  hours the owner states.
- **The flagship example argued against the kit.** Worked example 1 showed AI
  helping with phone calls. It was re-derived end to end; a false 4.5-hour
  "AI assists" line became 3.0 hours handed to a person plus 1.5 hours of
  confirmation texts that software genuinely carries.
- **Monthly tasks could never be graded.** The refusal demanded weekly hours
  while the interview invited "how often", so month-end bookkeeping always
  fell into the un-finished queue. A fixed conversion table fixed it.
- **The denominator was wrong.** Reclaimed hours were compared with the sum of
  graded tasks, which read as "over half your week" when it was a fifth. The
  owner's total weekly hours are now asked first and used throughout.
- **Partner delivery.** Verification ran on "your own week", which for a coach
  is coaching calls. It now runs on the partner's week and never marks the
  install verified against a client session that has not happened.

## Hardening (2026-08-13)

An OpenAI Codex model (GPT-5.6) authored the 2026-08-13 hardening pull
request. Its findings were ranked P0 to P2:

- Two P0s: an upgrade that disconnected the owner's config and branding from
  the live install, and no HTML-escaping contract for task text the owner
  types.
- Mechanically decidable verdicts, conversions, arithmetic and refusals were
  still the AI's self-report. They moved into a dependency-free Node core
  (`core.mjs`), an own-data verifier and an HTML verifier, with 14 `node:test`
  cases.
- Two worked examples contradicted the current schema and were corrected.

The PR's receipts included deliberate failures to prove each verifier's exit
codes (`1` for a content failure, `3` for an invocation error).

## Cross-model review (2026-08-17)

Claude Opus and a second model family (Terra) reviewed the kit independently,
and every confirmed finding was fixed in 0.2.2. Most were holes in the
verifiers, which is the part a reader trusts most:

- The external-resource check required a quoted `href` or `src`, so
  `<img src=https://...>` and `srcset` passed. It now covers unquoted values,
  every URL-carrying attribute and any scheme.
- `java&#x73;cript:` links passed. All checks now run on decoded source.
- The rate refusal looked for a literal `$`, so "2,523 dollars a month"
  passed on a page that must show no money. It now matches symbols, words,
  codes and hourly phrasing, in visible text only.
- A decoy element could make inconsistent totals pass. Totals are now read
  off the headline element itself.
- The own-data verifier checked that fields were present, not answered, so
  `unknown` everywhere passed. It now enforces the controlled vocabularies.
- Worked example 1 failed the kit's own verifier after a schema change in
  0.2.1. It was re-derived with every figure unchanged.

Eight tests were added, each first shown to fail against the 0.2.1 verifiers.

## How AI was used

- Claude (Fable 5) co-authored the initial build and the workout commits.
- A Claude Opus agent ran the three simulated-buyer rounds and fixed defects
  between them.
- An OpenAI Codex model wrote the 2026-08-13 hardening pass.
- The 2026-08-17 review paired Claude Opus with a second model family so each
  could catch what the other missed; the fixes were proven red-first.

## How it is tested

- `tests/core.test.mjs` and `tests/verifier.test.mjs`: 22 `node:test` cases
  covering version comparison, escaping, the verdict table, frequency
  conversion, half-credit arithmetic, the rate refusal and each verifier
  bypass above.
- Both verifiers pass on all three worked examples.

## What did not work

- Grading every task as if it happened at a desk. Question zero and the
  physical-work verdict replaced it.
- Verifiers that pattern-matched the obvious case. Each bypass the review
  found became a test.
- Worked examples maintained by hand. A derived-artifact rule in
  `examples/README.md` now lists the rule changes that require re-deriving all
  three runs in the same edit.

## Current state

Version 0.2.2, experimental. Tests and verifiers pass. Still open, and stated
in the README: a clean-room install, a real owner's week, and the assistant
install paths.
