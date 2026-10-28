# Delegation Audit -- Operations Manual

Find out where your week actually goes, then get the parts back that never
needed you. One page at the end, in your colors, with your own numbers on it.

## What this does, in one paragraph

You dump the week you actually worked. The AI grades each task one question at
a time -- what it costs you in hours, what breaks if it's wrong, and whether it
needs YOUR judgment or just A judgment. Then it builds a one-page audit: what
AI can carry, what moves down to the person who owns that outcome (with AI
doing the legwork for them), and what genuinely stays yours. Work moves down,
AI carries the tasks, short summaries come back up for your approval. You keep
every decision. You stop doing the typing.

**This is not a staffing review.** Nobody's job goes away in this audit. It
finds the work that eats your week so your people -- and you -- get that time
back for the work you were all actually hired for.

## The pipeline

| Stage | Say | What happens |
| --- | --- | --- |
| 1. **Dump** | "task dump" / "audit my week" | You list everything you actually did. The AI captures it in your own words and does not sort, grade, or advise. |
| 2. **Grill** | "grill my tasks" / "grade these" | One question at a time on each task until every one has hours, a consequence, and a verdict. |
| 3. **Price** | (happens inside the grill) | Your own effective hourly rate, once. Every reclaimed hour is priced with it -- or the page ships hours-only if you'd rather not say. |
| 4. **Build** | "build the audit" | The graded week becomes a single one-page HTML file -- opens in any browser, prints on two pages, emails as one attachment. |

"delegation audit" runs the whole flow with the AI conducting; every stage
also works standalone.

## The first question: screen, or the world?

Before anything else, every task gets asked one question -- does this happen
on a screen, or out in the world? Software can help with a list, a write-up,
a follow-up, a lookup. It cannot drive to a job site, hold a tape measure,
walk a property, or answer a ringing phone.

**This kit will not tell you AI does something AI cannot do.** If a task is
you in a truck, it says so, and it looks instead for the screen-shaped piece
hanging off it -- the list nobody made the night before, the write-up
afterward, the follow-up call that could have been a text. That piece is
usually where the real hours are.

## The five verdicts

Every task lands in exactly one, and these are the words on the page:

- **AI carries it** -- mechanical, on a screen, and low-risk. It gets done;
  you skim a summary.
- **AI drafts, you approve** -- the work gets done, you make the call before it
  goes out.
- **Hand down, AI assists** -- it needs *a* judgment, just not yours. It moves
  to whoever owns that outcome, and AI carries the mechanical part for them.
  A summary comes back to you. That person's job gets bigger, not smaller.
- **Hand down, no AI** -- real work that happens in the world: a body, a
  truck, a tool, a live voice. Software does none of it. It still moves to the
  person who owns that outcome, and a summary still comes back to you. The kit
  says plainly that no software is involved, because a number built on a lie
  is worth less than no number.
- **Stays yours** -- needs your relationships, your authority, your years of
  pattern-matching. This is what the reclaimed hours are for.

Your page also shows the split: of the hours you get back, how many software
carries and how many move to a person. Those are different promises and you
should be able to see both.

## Things that don't happen every week

Month-end books, quarterly compliance, the annual renewal -- the kit takes
those in the unit you think in ("six hours, four times a year") and does the
weekly math itself. They show up on the page in your own unit, in their own
short block, because a task that only bites once a quarter is exactly the one
that never gets handed off.

## The one thing it will refuse to do

**It will not grade a task you can't describe.** "Handle vendor stuff" gets
sent back -- because that's three different jobs with three different answers,
and pricing it would mean guessing. It tells you exactly what it can't grade,
asks the one question that unblocks it, and puts it in a "still too vague to
price" list on the finished page.

That list is not the kit failing. It's usually the most useful section on the
page: it shows you which parts of your own week you can't yet put into words,
which is exactly the work that never gets delegated.

It will also never invent a number. No estimated hours, no benchmark hourly
rate. If you don't give it your rate, the page comes out with hours only and
says so.

## Your branding, on every page

Your audit comes out in YOUR colors, with YOUR logo. Set it once at install:
the AI asks for your logo, colors, fonts, and tagline, or just your business
name if you don't have branding yet, and makes you a clean placeholder you can
swap later. Change it anytime by telling the AI "update my branding."

**If you're a coach or consultant handing these to your clients**, the page
carries YOUR branding -- you're the one delivering it. The installer asks about
this once and records it.

## Moving between devices

Say **"give me the brief"** in any session -- you get one structured message.
Paste it into any other session (phone, car, another app) and it picks up
exactly where you left off.

Car mode: "task dump" on the drive home is the single best way to do stage 1,
because that's when you actually remember the annoying stuff. Then "give me
the brief" before you get out.

## Run it again in a quarter

Say "re-audit" and point at the old one. The AI walks the previous list first
-- "last quarter this was 3 hours a week, where is it now?" -- then dumps
whatever is new. The second audit is the one that shows what actually moved
and what crept back. Your old audit is never overwritten; each run gets its
own folder and they cross-link.

## Where audits live

- **Coding-agent installs** (Claude Code / Codex): real files, default
  `~/Documents/delegation-audits/<name>/index.html`.
- **App installs**: the page downloads straight from the chat as a single HTML
  file.

## What changes if you're in a chat instead of a terminal

The kit runs everywhere and there is nothing to install beyond handing over
`installer.md`. But a chat-only setup (claude.ai in a browser, ChatGPT
Projects, Gemini Gems) gives up four things, and you should know which:

1. **You save your own pages.** In a terminal install each audit gets its own
   folder automatically. In a chat, the page is a download -- put it somewhere
   you'll find it in three months.
2. **Your settings don't persist by themselves.** Your colors, your logo, and
   your audits folder live in files on a terminal install. In a chat they live
   in the project instructions, and changing them is a manual edit.
3. **Re-audit needs the old page.** "Run it again in a quarter" works by
   reading last quarter's audit. In a chat, upload that file back in at the
   start.
4. **The final self-check is the AI's word.** On a terminal install the AI
   re-reads the finished file to confirm nothing is missing. In a chat it is
   checking from memory -- so print the page and look at it before it goes to
   anyone.

Everything the kit actually decides -- the screen-or-world question, the
refusals, the rate gate, the verdict table, the arithmetic -- works exactly
the same in all of them.

## See it before you do it

The `examples/` folder has complete worked runs -- a real-shaped week dumped,
graded, and turned into the finished page. Open one, see the flow, then do
your own. The examples are for looking at only: the AI will never verify your
install against them, because a page with somebody else's week on it proves
nothing about yours.

## Reinstalling / moving platforms

Hand `installer.md` to the AI on the new platform and say "install delegation
audit." The installer adapts the package to whatever that platform needs -- you
never repackage anything yourself.

## Uninstall

Coding agents: delete the five skill folders from `~/.claude/skills/` and/or
`~/.codex/skills/`. Apps: remove the five skills in Settings -> Skills (or
delete the Project). Your audits are yours and stay put.

## Credits

The one-question-at-a-time interview mechanism is adapted from Matt Pocock's
`grilling` skill (MIT). The rest was forged in Rico's lab at rTech Digital
Consulting.
