# Skills

The ONE canonical source for the kit. Five skill folders, each with a
`SKILL.md`, that the installer copies into the user's skills directory:
`delegation-audit` (conductor for the four-stage pipeline), `task-dump`
(stage 1), `task-grilling` (stages 2 and 3), `grill-my-tasks` (stage 2
shortcut trigger), and `audit-page` (stage 4).

`delegation-audit/` also holds the deterministic JavaScript the kit runs on
(`core.mjs` and the two verifiers), and at install time it gains the user's
`USER-CONFIG.md` and `branding/` folder.
