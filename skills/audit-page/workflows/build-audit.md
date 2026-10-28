# Build Audit

1. **Confirm the home and the look.** First resolve `AUDITS_HOME` by reading
   the `audits output folder:` line from `../delegation-audit/USER-CONFIG.md`
   (the one config file the installer writes, in the installed
   `delegation-audit/` skill folder). If that file and key exist, reuse them
   silently. Only if missing (an app or plain-chat install that never ran the
   installer's path step) ask the two setup questions:
   - Where should finished audits live? (recommend
     `~/Documents/delegation-audits/`) -- record the answer to
     `../delegation-audit/USER-CONFIG.md` as `audits output folder: <path>`,
     never a second config file.
   - What should the page look like? Offer: the default light professional
     (recommended -- this page gets printed and handed across a table); a dark
     version; or "describe it and I'll build it". Save `page theme:`,
     `page background color:`, `page surface color:`, and `page text color:` in
     `../delegation-audit/USER-CONFIG.md`. Never create or read a hidden theme
     file under `AUDITS_HOME`. Read `execution tier:` from the same config.

2. **Read the branding.** Read `../delegation-audit/branding/brand.md` and
   `../delegation-audit/branding/image-setup.md`. The brand's primary and
   accent colors override `--accent` and `--accent-2`; the logo is embedded as
   a data URI in the header bar and reused for the favicon. Where a coach or
   partner is delivering this audit to their own client, their branding is
   what goes on the page.

3. **Absorb the graded week.** Read `PAGE_DIR/tasks.md` if it exists, plus any
   grading conversation in context. Every task must carry question zero plus
   all four answers: screen/world, hours per week, what breaks and its
   classification, whose judgment, and the one outcome owner when applicable.
   It must also carry the table-produced verdict.

4. **Grade if ungraded -- hard gate.** If any task lacks a verdict, do NOT
   draft the page. Run `task-grilling` on the ungraded tasks first: one
   question at a time, your recommended answer with each, the decisions are
   the user's. Skip only when the user explicitly waives it, and then mark
   every ungraded line `needs confirmation` on the page and count it in
   nothing.

5. **Check the rate gate.** If `Effective hourly rate:` is `not set`, ask once
   more (see the rate gate in `task-grilling`). If it is still not set, build
   the page with hours only: DELETE the monthly-value stat block, DELETE the
   money line from the arithmetic section, and add one plain line under the
   headline numbers -- "Hours only: no hourly rate was set, so nothing here is
   priced." **Never substitute a market rate or an industry average.**

6. **Do the arithmetic mechanically, then show it.** Use `computeAudit` from
   `../delegation-audit/core.mjs` as the deterministic source of totals. Keep
   every returned intermediate for the "How these numbers were figured"
   section. The function applies this exact order:
   - `total hours reviewed` = sum of `hours per week` over all graded tasks
     (every task's converted weekly figure -- a monthly or quarterly task
     enters here as its converted number, never its raw one)
   - `ai carries hours` = sum over tasks verdicted `AI carries it`
   - `ai drafts hours` = sum over tasks verdicted `AI drafts, you approve`
   - `hand down hours` = sum over tasks verdicted `Hand down, AI assists`
     **plus** tasks verdicted `Hand down, no AI` -- both kinds count, both at
     half credit
   - `reclaimed hours per week` = `ai carries hours + ai drafts hours +
     (hand down hours / 2)`
   - `hours AI carries` = `ai carries hours + ai drafts hours`
   - `hours a person carries` = `hand down hours / 2`
     (these two sum to `reclaimed hours per week`, and BOTH go on the page --
     see step 7)
   - `reclaimed hours per month` = `reclaimed hours per week * 4.33`, to one
     decimal place
   - `monthly value` = `reclaimed hours per month * effective hourly rate`,
     rounded to the nearest dollar -- omitted entirely if the rate is not set
   Queued (un-finished) tasks are counted in NOTHING, including
   `total hours reviewed`. If a figure cannot be traced to answers the user
   gave, it does not go on the page.

   **The denominator is the owner's real week, not the graded sum.** If
   `Total hours worked per week:` is on file, that is what the headline stat
   compares against, with the graded sum named beside it: "16.0 hours back --
   out of the 30.25 hours we put a name to, in a 60-hour week." If it is `not
   given`, the sub-line says "out of {{TOTAL_HOURS_REVIEWED}} hours we put a
   name to" and does NOT imply that is the whole week.

7. **Author the HTML.** Fill the `## Page Template` from SKILL.md, replacing
   every `{{FIELD}}` and repeating `<!-- repeat -->` blocks as needed. **Every
   user-controlled value passes through `escapeHtml` from
   `../delegation-audit/core.mjs` before insertion**, including text nodes,
   attribute values, branding, names, tasks, questions, and consequences. Raw
   user text is never markup. Record the configured tier in metadata and in the
   visible label; for T3 include the exact advisory sentence from SKILL.md.
   Order the task table by hours descending -- the biggest thief goes first.

   **A monthly or quarterly task is not a small task -- do not let the table
   say it is.** Weekly-normalizing is arithmetically correct and rhetorically
   backwards: six hours of quarterly compliance work that can fail a state
   inspection converts to 0.46 hours a week and sorts dead last, next to a
   fifteen-minute weekly errand. Two rules keep it honest:
   - **Show the hours in the unit the owner thinks in, with the weekly figure
     beside it** -- `6 hrs quarterly (0.5/wk)`, never a bare `0.5`. The owner
     recognizes the six; the 0.5 is only there so the totals add up.
   - **Sort by weekly hours, but pull every converted task into its own short
     block below the table**, headed "The ones that don't happen every week" --
     one line each, in their own unit, with their verdict. Two or three lines,
     no new section chrome. A task that only bites once a quarter is exactly
     the task an owner forgets to delegate, and it is worth its own eye-line.
   If nothing was converted, omit that block entirely.

   Re-read
   the language law in SKILL.md before writing the summary and callout copy:
   the work moves, the people stay, the summaries flow back up, and the
   reclaimed hours have a named destination.

8. **Render the un-finished queue.** One callout per queued task, quoting the
   owner's own words and the single question that unblocks it. Omit the whole
   section only when the queue is genuinely empty.

9. **Name and save.** Create `PAGE_DIR` from a descriptive kebab-case name
   (the business name plus the month reads well:
   `harbor-electric-2026-08/`). Save the page as `PAGE_DIR/index.html`.

10. **Self-check before showing it.** From `SKILLS_DIR` (the parent of this
    skill folder -- see the `SKILLS_DIR` variable in `audit-page/SKILL.md`),
    run `node delegation-audit/verify-html.mjs PAGE_FILE` with `PAGE_FILE` as
    an ABSOLUTE path; `PAGE_FILE` lives under `AUDITS_HOME`, not beside the
    skills. Where the harness cannot change directory, use
    `node SKILLS_DIR/delegation-audit/verify-html.mjs PAGE_FILE`. Exit `0` is required;
    exit `1` means the page failed; exit `3` means the verifier was invoked
    incorrectly. The verifier deterministically rejects unresolved
    placeholders, scripts, event handlers, JavaScript URLs, external resources,
    rate-gate breaches, missing tier labels/T3 notice, and inconsistent split
    totals. Then verify the remaining human-language and print checks:
    - no `{{` remains anywhere in the file
    - the page opens with no external requests (no `http://` or `https://`
      stylesheet, script, or image reference)
    - every number in the headline stats appears in the arithmetic section
    - if the rate is not set, no dollar sign appears anywhere in the file
    - the whole audit fits in two printed pages (check the browser's print
      preview)
    - no line describes doing without a person, a smaller team, or a role
      being unnecessary
    - `hours AI carries` + `hours a person carries` equals
      `reclaimed hours per week` exactly, and both appear on the page
    - **no task verdicted `Hand down, no AI` has any AI claim attached to
      it** -- read every one of those rows and its detail paragraph and check
      that no sentence says AI does, carries, drafts, handles, or assists with
      it. This is the single check that keeps a tradesman's audit honest
    - every task whose hours were stated in a non-weekly unit shows the
      converted weekly number, with the original unit named beside it
    - the denominator sub-line does not present the graded sum as the owner's
      whole week

11. **Open and report.** `open PAGE_FILE`, then summarize for the user: the
    page path, the reclaimed hours, the monthly value (or that it was omitted
    and why), how many tasks landed in each verdict, and what sits in the
    un-finished queue.
