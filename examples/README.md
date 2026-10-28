# Worked examples

Three complete runs, end to end: a real-shaped week dumped, graded one task at
a time, and turned into the finished one-page audit. Open one before you do
your own -- you'll know exactly what you're getting into.

| Example | Who | What it shows |
| --- | --- | --- |
| `01-harbor-electric/` | 11-person electrical contractor, Long Island | The trades case, and the one to read if you work with your hands. Sixteen tasks, a clean rate, and two lines that come back **Hand down, no AI** -- the kit refusing to claim software makes phone calls, and finding the typing wrapped around them instead. |
| `02-mercer-agency/` | 6-person marketing agency | The refusal doing its job. Three tasks land in the un-finished queue, and the owner's reaction to that is the most useful part of the session. |
| `03-no-rate-given/` | Solo insurance producer | The hours-only path. The owner declines to state a rate, so the page ships with no dollar figures at all -- and is still worth handing over. |

Each folder holds:

- `session.md` -- the actual back-and-forth: the dump, the four questions per
  task, the refusals, and the arithmetic being shown
- `tasks.md` -- the working file the pipeline saved as it went
- `audit.html` -- the finished page

**These are for looking at, not for verifying an install.** The kit will never
accept an example as proof it works for you; the install isn't finished until
one real thing off YOUR week has been graded end to end. A page with somebody
else's names on it proves nothing about your business.

All names, numbers, and businesses in these examples are invented for
illustration. Nothing here is a claim about what any real business achieved.

---

## For whoever maintains this kit: these are DERIVED artifacts

**An example is the kit's own output, not a document about the kit.** Every
verdict, every number, and every sentence in these three folders was produced
by the rules in `skills/`. That means they go stale the moment a rule changes,
and a stale example is worse than no example: it is the kit arguing against
itself in the exact file a skeptical buyer opens first.

**Any change to any of the following requires re-deriving all three examples
in the same edit, before the version is bumped:**

- the verdict list or the verdict table (`task-grilling/SKILL.md`)
- question zero, the screen/world values, or the split rule
- the arithmetic (`task-grilling/SKILL.md` and `build-audit.md` step 6),
  including the half-credit rule, the 4.33 factor, or the reported splits
- the refusal's four required fields, or the rate gate
- the working-file schema or the TASK BRIEF field list
- the page template's sections, stats, or verdict CSS classes

Re-derive means: walk each example's `session.md` back through the changed
rule, then fix `tasks.md` and `audit.html` to match. All three files in a
folder must agree with each other AND with the current skills. Check the
finished pages the way `build-audit.md` step 10 says to -- no `{{` left, no
external requests, the headline numbers reproduced in the arithmetic block,
the two split figures summing to the reclaimed total, and no `Hand down, no
AI` line carrying an AI claim.

This happened once already: v0.2.0 added question zero and the fifth verdict,
and the Harbor Electric example -- an electrical contractor, the closest thing
in the box to the buyer most likely to open it -- still showed AI assisting
with phone calls until it was re-derived.
