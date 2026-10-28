# task-grilling

Stages 2 and 3 of the pipeline. `SKILL.md` holds the one-question-at-a-time
interview loop that grades a dumped week: question zero (screen or world) plus
four fixed questions per task, until every task carries hours, a consequence,
a judgment owner, and one of the five verdicts.

It also owns the load-bearing rules: THE REFUSAL (a task too vague to price is
not graded, it goes to the un-finished queue), the rate gate (no dollar figure
anywhere unless the user states their rate), the merge rule, the two-block
verdict table, and the arithmetic. Mechanism adapted from the MIT-licensed
`productivity/grilling` skill at github.com/mattpocock/skills.
