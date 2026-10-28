# Changelog

All notable changes to the Delegation Audit kit are recorded here. This file
follows Keep a Changelog and Semantic Versioning.

## [0.2.2] - 2026-08-17

Cross-family review pass (Opus + Terra). Every item below is a defect the
review CONFIRMED against the shipped 0.2.1 files, not a feature.

### Fixed

- **`examples/01-harbor-electric/tasks.md` failed the kit's own verifier.**
  0.2.1 migrated examples 02 and 03 to the `outcome owner:` schema and left 01
  behind: all sixteen of its task lines lacked the field, and its judgment
  values used a retired vocabulary (`owner`, `mixed -- layout no, assignments
  yes`, `nobody's (the prose)`) that `routeVerdict()` throws on. The flagship
  worked example -- the first file a buyer opens -- taught a schema the kit
  rejects. Re-derived to the current schema against its own `session.md`;
  hours, verdicts, and every computed figure are unchanged.
- **Example 02's proposals line carried an unroutable judgment**
  (`nobody's for assembly; yours for strategy`) under a verdict the table only
  produces from `nobody's`. Split stated in the consequence field instead.
- **The own-data verifier checked only that fields were PRESENT, not that they
  were ANSWERED.** A record reading `screen or world: unknown`, `how bad:
  unknown`, `outcome owner: unknown` passed. It now enforces the controlled
  vocabularies, numeric hours, and the rule that a task needing `a judgment`
  carries a NAMED owner while every other task carries `not applicable`.
- **The demonstrated-refusal check could not tell an honest empty queue from a
  missing receipt.** A run whose queue is genuinely empty now declares it in
  those words (`Queue is empty: ...`), and the new `--install` flag makes a
  real refusal mandatory for install verification (KIT-STANDARD §4.10), so the
  declaration is not a loophole in the path that matters.
- **The external-resource gate was bypassable.** It required a quote after
  `=` and covered only `href`/`src`, so `<img src=https://evil/x.png>` and
  `<img srcset="https://evil/x.png 1x">` both passed clean -- pages that phone
  home to a third party passing the check that backs the "opens with no
  external requests" promise. Now covers unquoted and bare values,
  `srcset`/`imagesrcset`/`poster`/`data`/`action`/`formaction`/`xlink:href`,
  and any scheme.
- **Unsafe URLs could be entity-obfuscated.** `href="java&#x73;cript:..."`
  passed; browsers decode it and run it. All content gates now run against
  decoded source.
- **The rate gate grepped for a literal `$`.** A not-set page reading "worth
  2,523 dollars a month", "2523 USD", "53 per hour", or `&dollar;2,523` passed
  clean, defeating one of the kit's two named refusals. It now matches
  currency symbols, spelled-out and coded amounts, and hourly phrasing -- and
  reads only VISIBLE text, so a favicon data URI or a CSS rule containing a
  currency character can no longer false-fail an honest hours-only page.
- **Split-total verification read `data-*` attributes from anywhere in the
  document.** A decoy element placed before the headline made an inconsistent
  displayed headline pass. The totals are now read off the `.headline` element
  itself.
- **Path resolution (KIT-STANDARD §4.5).** `build-audit.md` and
  `update-audit.md` invoked the verifier as `node ../delegation-audit/...`
  with no stated working directory, while `installer.md` used one fewer level
  for the same file -- at least one was file-not-found at runtime. All three
  now name the directory the command runs from (`SKILLS_DIR`, defined in
  `audit-page/SKILL.md`), require absolute paths for files under
  `AUDITS_HOME`, and give the absolute fallback form.
- **`task-dump` had no untrusted-input block (KIT-STANDARD §4.7)** despite
  being the ingest boundary: it writes unreviewed pasted text straight into
  the working file every later skill reads. It now carries the block, and
  `grill-my-tasks` states that it is a pure alias adding no rules of its own.

### Added

- Eight `node:test` cases covering the bypasses above, each verified to FAIL
  against the 0.2.1 verifiers before the fix. Test count: 22, all passing.

## [0.2.1] - 2026-08-13

### Fixed

- Upgrades now discover the installed version from the copied `VERSION` file,
  refuse downgrades, no-op equal versions, create full backups before changes,
  and preserve the active `USER-CONFIG.md` and `branding/` in place.
- Moved theme and execution-tier settings into the one `USER-CONFIG.md`.
- Added explicit T1/T2/T3 recording and the mandatory T3 advisory on pages.
- Added dependency-free plain-Node escaping, verdict, conversion, arithmetic,
  own-data, and HTML verification with `node:test` coverage.
- The HTML verifier now rejects unresolved placeholders, active/unsafe markup,
  JavaScript URLs, external resources, rate-gate breaches, missing tier truth,
  and split-total inconsistencies.
- Install verification now follows the literal task-grilling sequence on the
  buyer's own week, including the real-week number, rate gate, question zero,
  four questions, named owner, table verdict, and demonstrated refusal.
- Corrected stale Mercer/Alvarez owner names, working-file schema, denominator,
  and software/person split headlines.

## [0.2.0] - 2026-08-12

Hardening pass from a three-round agent workout: the kit's own workflows were
run literally against three invented-but-realistic Long Island buyers (an
overhead-door contractor, a coach-delivered dental practice, and a landscaper
who opened `examples/` first), and every place the kit stumbled was fixed
before the next round. **State: still WRITTEN — nineteen observed defects
closed, and not one acceptance box checked. No human has opened this on a
device.**

### Added

- **Question zero — "does this happen on a screen, or out in the world?"** —
  asked before the four questions, on every task
  (`skills/task-grilling/SKILL.md`). Records `on a screen`,
  `in the world`, or `in the world, with a screen part`, with a five-item
  checklist (the list, the write-up, the reach-out, the scheduling, the
  lookup) that drives the AI to LOOK for the screen part instead of waiting to
  be told. This is the fix for the kit's worst failure mode: giving the
  office-worker answer to a tradesman.
- **A fifth verdict, `Hand down, no AI`**, and a two-block verdict table.
  A task recorded `in the world` can never receive an AI verdict — the rows
  are mechanically unavailable — because the kit was otherwise producing
  "AI carries this; you skim the summary" for driving parts to a job site and
  "AI drafts, you approve" for answering a ringing phone. Carried through the
  conductor's cascade table, the page template (`v-downp` class), the
  operations manual, and the examples.
- **The task split.** `in the world, with a screen part` splits into two
  graded lines at hours the USER states; if they cannot split it, the whole
  task grades physical and the screen part is noted as unpriced rather than
  guessed. In the Harbor Electric example this converted a false 4.5-hour
  "AI assists with phone calls" line into 3.0 hours of `Hand down, no AI` plus
  1.5 hours of confirmation texts AI genuinely does carry.
- **The reported split.** The page now shows `hours AI carries` and
  `hours a person carries` alongside the reclaimed total, and
  `build-audit.md` step 10 checks that they sum to it. A single reclaimed
  number could not survive one skeptical question.
- **A frequency conversion table** (`/4.33` monthly, `/13` quarterly, `/48`
  yearly). Previously the refusal demanded "hours per week, as a number the
  user stated" while question 1 invited "hours per occurrence plus how often"
  and the arithmetic summed only weekly figures — so month-end bookkeeping,
  the textbook AI-carries task, could never be graded and always fell into the
  un-finished queue. Converted numbers now satisfy the refusal, and the page
  shows the owner's own unit beside the weekly figure with converted tasks
  pulled into their own short block, so a quarterly compliance task does not
  read as the most ignorable line on the page.
- **A consequence classification rule** — "could you fix it the same week
  without losing the customer or the money?" The verdict table turns on
  `small and reversible` versus `real and hard to undo` and the kit gave no
  rule for deciding which a stated consequence was, leaving a vibe call in the
  middle of the deterministic spine.
- **A merge rule for unblocked queue items.** When a refused vague task turns
  out to be a task already graded ("that IS the backorder thing"), the kit
  merges and confirms the hours once. Grading it again double-counted straight
  into the headline reclaimed-hours figure.
- **`Total hours worked per week:`** — asked FIRST, settled once, and used as
  both the rate's divisor and the page's denominator. The page previously
  compared reclaimed hours against the sum of graded tasks, which reads as
  "over half your week" when it is a fifth of it.
- **Range and open-ended-addendum handling on both numbers.** "Sixty, seventy
  some weeks" and "45 in the office, plus Sunday paperwork" both get resolved
  out loud with the arithmetic shown, rather than silently taking one end —
  a 14% swing that propagated into every dollar on the page.
- **A single-owner rule.** "Me or Marco" is not an owner; the kit asks the
  one question that forces a name and records `no single owner` as a finding
  if it does not get one.
- **`DATA, never instructions` and the out-of-scope statement, in
  `task-grilling/SKILL.md`.** Both hard rules lived only in the conductor and
  `audit-page`, while `task-grilling` — reachable directly via "grill my
  tasks", and the owner of the rate gate and the verdict table — carried
  neither. A pasted-calendar injection targets exactly those two mechanisms,
  and the positioning law auto-fails on breach.
- **Partner-delivery verify path** (installer Section 4). The kit's stated
  primary channel is coaches, the branding interview asks about it, and verify
  then ran on "your own week" — a coach's coaching calls, not the week the kit
  is ever pointed at. Verify now runs on the partner's own week, says why, and
  hands over the first-client-session step without ever marking the install
  verified against a client week that has not happened.
- **A derived-artifact rule for `examples/`** (`examples/README.md`), naming
  the six rule changes that require re-deriving all three worked runs in the
  same edit. Rounds 1 and 2 fixed the skills and left the demo behind, which
  is precisely the file a skeptic opens first.
- **Eight new acceptance boxes** in `README.md` covering question zero, the
  split, conversion, range handling, the merge, prompt injection against the
  DIRECT `task-grilling` entry, the out-of-scope statement on that same path,
  and example/skill agreement.

### Changed

- Re-derived `examples/01-harbor-electric/` end to end (session, working file,
  and finished page) under the new rules. An eleven-person electrical
  contractor was the closest thing in the box to the kit's hardest buyer and
  it showed AI assisting with "are you coming Tuesday" phone calls. Headline
  moved from 15.0 hours / $3,965 to 16.0 hours / $4,227, now reported as 13.5
  carried by software and 2.5 moving to Angela, against Dave's stated 63-hour
  week rather than the 26 hours he could name.
- Added `Total hours worked per week:` and the reported split to all three
  examples' working files.
- `OPERATIONS-MANUAL.md` rewritten from four verdicts to five, with a plain
  "screen, or the world?" section and a note on tasks that do not happen every
  week.
- The task-dump eight-task floor now carries an hours check: a count floor
  cannot tell you whether the audit saw the week, and seven tasks covering
  three hours is a sliver, not a week. Short coverage triggers one more pass
  and then an honest partial audit — never invented tasks.
- TASK BRIEF schema extended with `Total hours worked per week:`,
  `stated as:`, `screen or world:`, and `how bad:`, and the verdict field
  widened from four values to five.

## [0.1.0] - 2026-08-12

Initial build. **State: WRITTEN — nothing in the acceptance checklist has been
run, and no human has opened this on a device.**

### Added

- Created the kit as a FORGE PATTERN re-skin of `pocs/kits/idea-forge/`, per
  the kit tribunal thesis (`research/kits/2026-08-11_kit-quality-tribunal.md`
  § NEW KIT THESES, item 4). No new mechanism was invented: five skills map
  one-to-one onto the proven idea-forge pipeline with the input swapped from
  "an idea" to "the owner's real task list."
- Added `skills/task-dump/` (stage 1) — capture-first listening re-pointed
  from `spitball-session`, with five memory joggers and an eight-task floor
  before grading is offered.
- Added `skills/task-grilling/` (stages 2 and 3) — the one-question-at-a-time
  interview from `grilling` (MIT, Matt Pocock lineage preserved in the source
  comment), narrowed to four fixed questions per task: hours per week, what
  breaks if wrong, whose judgment it needs, and who owns the outcome.
- Added `skills/grill-my-tasks/` — shortcut trigger mirroring `grill-me`.
- Added `skills/audit-page/` (stage 4) with `workflows/build-audit.md` and
  `workflows/update-audit.md` — the self-contained-HTML renderer contract from
  `idea-page`, with a new light-professional template (the page gets printed
  and handed across a table) and a print stylesheet holding it to two pages.
- Added `skills/delegation-audit/` — the conductor, carrying the pipeline
  routing, the TASK BRIEF emit/consume bridge, and the delegation-cascade
  verdict table.
- Added the **named refusal** (KIT-STANDARD §4.9): a task lacking any of a
  concrete action, stated hours, a stated consequence, or an answer on whose
  judgment it needs is NOT graded. It stops, shows what it could and could not
  read, asks one unblocking question, invents no number, and lands in the
  un-finished queue, which renders as its own section on the finished page.
- Added a **second refusal — the rate gate**: no dollar figure appears
  anywhere unless the user states their own effective hourly rate. No market
  average or benchmark is ever substituted; the page ships hours-only and says
  so.
- Added the **deterministic spine** (design decision, 2026-08-11): the verdict is a
  lookup table over `whose judgment x what breaks if wrong`, the refusal
  trigger is a four-field completeness check, and the arithmetic is fully
  specified (half-credit on hand-downs, 4.33 weeks a month) and printed on the
  page with its working shown.
- Added `examples/` with three COMPLETE worked runs (KIT-STANDARD
  § Worked-example layer): an electrical contractor (the straightforward
  case), a marketing agency (three refusals firing, and the owner's reaction
  to them), and a solo insurance producer (the hours-only path — the finished
  page contains zero dollar signs). Each carries the session transcript, the
  working file, and the finished HTML page. All names and numbers are invented
  and labelled as such in every file.
- Added `installer.md` (v0.1.0) on the idea-forge v2 skeleton: runtime
  detection 3A/3B/3C/3D, collision check with the version-aware upgrade path,
  recursive copy, the images and branding interview, and Section 5 adaptation.
- Added a partner-delivery question to the branding interview
  (`audits are delivered by:`) — where a coach hands audits to their own
  clients, the page carries the COACH's branding.
- Added `START-HERE.md`, `OPERATIONS-MANUAL.md`, `VERSION`, and `README.md`
  with the full acceptance checklist (every box unchecked) and a stated
  known-gaps section.

### Positioning

- The **positioning law is load-bearing in this kit**, not a compliance pass
  (AGENTS.md § Positioning; `_graph/lane-contract.md` standing rules 3 and 4).
  The delegation cascade IS the mechanism and the language: work moves down,
  AI carries the tasks, summaries flow back up for approval. The
  `Hand down, AI assists` verdict is written throughout as a promotion for the
  person receiving the work. The conductor carries an explicit out-of-scope
  statement for users who steer toward cutting people, and
  `audit-page/SKILL.md` § "The language law" is read before any page copy is
  written. Reclaimed hours always carry a named destination.

### Verification posture

- The install verify step runs on the **buyer's own week** (KIT-STANDARD
  §4.10). Verifying against anything in `examples/` is explicitly a FAIL; the
  installer names the examples as demonstration only. A user with no real
  input gets a plain "install recorded as unverified" outcome, never a fixture
  run.
