# Update Audit

Two different jobs live here. Read the prompt and pick one.

## A. Surgical edit (a task was wrong, a name changed, a rate was corrected)

1. **Identify the page.** From the `USER_PROMPT`, locate the target
   `index.html` under `AUDITS_HOME` (list the folder and confirm if
   ambiguous).
2. **Scope the change.** Change only what was asked. Keep the edit surgical
   and touch only the affected rows and sections.
3. **Apply it.** Edit the relevant rows in place, preserving the existing
   structure and theme. Escape every changed user-controlled value with
   `escapeHtml` from `../delegation-audit/core.mjs`; never insert raw user text.
4. **Recompute everything downstream.** Any change to hours, a verdict, or the
   rate invalidates the headline numbers. Re-run the whole arithmetic block
   from `build-audit.md` step 6 and rewrite the "How these numbers were
   figured" section to match. A page whose stats and working disagree is worse
   than no page.
5. **Update `tasks.md`** in the same folder so the working file and the page
   never disagree.
6. **Verify and report.** From `SKILLS_DIR` (the parent of this skill folder --
   see the `SKILLS_DIR` variable in `audit-page/SKILL.md`), run
   `node delegation-audit/verify-html.mjs PAGE_FILE` with `PAGE_FILE` as an
   ABSOLUTE path, or the absolute form
   `node SKILLS_DIR/delegation-audit/verify-html.mjs PAGE_FILE`. Do not re-open
   or report success unless it exits 0. Then report what changed and the new
   totals.

## B. Re-audit (the same week, a quarter later -- the repeat-use pull)

This is the version worth selling: the second audit shows what actually moved
and what crept back.

1. **Read the previous audit's `tasks.md`** for the prior task list, hours,
   and verdicts. Do NOT overwrite it -- the previous run is the baseline and
   must survive.
2. **Create a NEW folder** for this run (`<business>-<new-month>/`). The old
   audit stays exactly where it is.
3. **Walk the prior list first**, one task at a time: "Last quarter this was
   3 hours a week and we said AI drafts it. Where is it now?" Record the new
   hours and the new verdict. A task that moved is a win; a task that came
   back is a finding, and it goes on the page as one.
4. **Then dump what is new.** Run `task-dump` for anything that appeared since
   -- new work accumulates, and an audit that only revisits the old list will
   read as better than the week actually is.
5. **Grade the new tasks** with `task-grilling`, including the refusal gate.
   The rate carries over from the prior run unless the user changes it; ask
   once whether it still holds.
6. **Build the page** per `build-audit.md`, with two additions:
   - a "What moved since {{PRIOR_DATE}}" section: hours reclaimed for real,
     task by task, against the prior audit's numbers;
   - a "What came back" section for anything that returned to the owner's
     plate, with the one honest sentence about why.
7. **Cross-link** the two audits: a relative link from each to the other, so
   the folder becomes a record over time.
8. **Report** the delta in plain terms -- hours actually reclaimed since the
   last audit, and what is still sitting on the owner.
