# basic

The only tier of the Delegation Audit kit. The whole kit is this tier.

## What ships

The coach-channel kit that turns a week of real work into a one-page
delegation audit. `START-HERE.md` (per-device steps to get `installer.md` in
front of an AI), `installer.md` (the file handed to any AI, which detects its
runtime, adapts the package to that host, installs, and verifies),
`OPERATIONS-MANUAL.md`, `kit.json`, `VERSION`, `CHANGELOG.md`, and:

- `skills/` -- the one canonical source, five skill folders:
  `delegation-audit` (conductor for the four-stage pipeline),
  `task-dump` (stage 1, capture-only), `task-grilling` (stages 2 and 3, four
  questions per task, the rate gate, the refusal, the arithmetic),
  `grill-my-tasks` (stage 2 shortcut trigger), and `audit-page` (stage 4, the
  one-page HTML build, with its `workflows/`).
- `examples/` -- three complete worked runs, each with `session.md`,
  `tasks.md`, and the finished `audit.html`.
- `tests/` -- plain `node --test` tests over `core.mjs` and the two verifiers.

The pipeline is: dump the week you actually worked, grill each task one
question at a time on hours, consequence, and whose judgment it needs, price
the reclaimed hours at the owner's own stated rate, then build a single
self-contained HTML page that opens in any browser, prints on two pages, and
emails as one attachment.

## Who it is for

The coach and partner referral channel: CEO and business coaches whose
clients' number one stuck point is "can't stop doing everything themselves."
The coach hands this over inside a paid session, and the finished page carries
the COACH's branding -- the installer asks about that explicitly. The
underlying reader is a small-business owner whose week is full of work that
was never worth their judgment.

This is not a staffing review. Nobody's job goes away in it. It finds the work
that eats the week so the owner and their people get that time back for the
work they were all actually hired for. Of the five verdicts, `Hand down, AI
assists` moves a task to whoever owns that outcome with AI carrying the
mechanical part for them, and a summary comes back up for approval -- that
person's job gets bigger, not smaller.

## What it refuses to do

- **It will not grade a task the owner cannot describe.** A task is gradable
  only with all four of a concrete action (verb and object), hours per week
  the user stated, a stated consequence if done wrong, and an answer on whose
  judgment it needs. Missing any one after asking once means stop and ask: no
  verdict, no estimated hours, and it does not go on the page. It lands in the
  un-finished queue, which renders as its own section on the finished page
  with the one unblocking question.
- **It will never invent a number.** No estimated hours, no benchmark hourly
  rate. If the owner declines to state a rate, the page comes out with hours
  only and says so.
- **It will not claim software does physical work.** Question zero asks
  whether a task happens on a screen or out in the world. Work in the world
  gets the honest verdict, and the kit looks instead for the screen-shaped
  piece hanging off it, which is usually where the real hours are.
- The installer never declares the package incompatible with a host. If a host
  needs a different shape, the AI produces that shape from the canonical
  files.

## Install

Full steps are in `installer.md`; `START-HERE.md` covers getting that file to
an AI on iPhone/iPad, Windows, and Mac. Condensed:

1. Unzip the kit, open `installer.md` in an AI (Claude, ChatGPT, Gemini,
   Codex, or any LLM), and say **install delegation audit**.
2. The AI detects its own runtime and takes one of four paths: coding agent
   with filesystem access (3A), chat app that accepts skill zip uploads (3B,
   where the AI builds the five zips itself), chat app with projects or custom
   instructions (3C), or a plain chat session (3D).
3. On the filesystem path it collision-checks the five skill names first,
   comparing `delegation-audit/VERSION` with `compareVersions` from
   `skills/delegation-audit/core.mjs`. Equal versions are left unchanged, a
   newer install refuses the downgrade, and an upgrade copies each skill
   folder to a backup in full before any installed file changes.
   `USER-CONFIG.md`, the `branding/` folder, and existing audits are never
   overwritten.
4. It copies the five skill folders recursively (including
   `audit-page/workflows/`), then copies `OPERATIONS-MANUAL.md`, `VERSION`,
   and `examples/` into the installed `delegation-audit/` skill folder.
5. It records the execution tier (`T1` coding agent with orchestration, `T2`
   filesystem or shell without orchestration, `T3` chat-only), asks where
   finished audits should live (default `~/Documents/delegation-audits/`) and
   which page theme to use (default light professional), and writes every
   choice, defaults included, into the one config file every skill reads:
   `delegation-audit/USER-CONFIG.md`.
6. It asserts the install (five folders, each with a `SKILL.md` whose
   frontmatter `name:` matches the folder), handles images and branding, then
   verifies by running the pipeline on one real thing off the buyer's OWN
   week. A worked example is never accepted as proof the install works.

Runtime floor is Node 22.6.0 or newer for the deterministic commands; no
package install is required. From the kit root:

```text
node --test tests/*.test.mjs
node skills/delegation-audit/verify-html.mjs examples/01-harbor-electric/audit.html examples/02-mercer-agency/audit.html examples/03-no-rate-given/audit.html
node skills/delegation-audit/verify-own-data.mjs examples/01-harbor-electric/tasks.md examples/02-mercer-agency/tasks.md examples/03-no-rate-given/tasks.md
node skills/delegation-audit/verify-own-data.mjs --install <audit-folder>/tasks.md
```

After install the verifiers run from the directory that holds the skill
folders, so the path is `delegation-audit/verify-html.mjs` with one fewer
level, and audit files are given as absolute paths. Verifier exit grammar is
`0` pass, `1` content failed, `3` invocation error.

## Current version

`VERSION` reads:

```text
0.2.2
```

State per the kit `README.md`: WRITTEN 2026-08-12, deterministic hardening
verified 2026-08-17. The 22 plain-Node tests pass and both verifiers pass over
all three worked examples. No clean-room acceptance test in that README's
checklist has been run and no human has opened it on a device, so the
deterministic mechanics are checked and the product experience is not yet
human-proven.
