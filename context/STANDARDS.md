# Standards

Status: ACTIVE in Module 3.

**Ryan Linde — MGT 3745 — HW3**

Ten rules I follow on this project, adapted from the course baseline to the
contact log feature. Rules 8 to 10 arrived with HW4, when the data left the browser. `CLAUDE.md` restates them as agent instructions.

**This file is normative.** If an adapter or `context/CLAUDE.md` conflicts with it,
this file wins and the other copy is repaired. One rule below is deliberately
absent from `CLAUDE.md`; that difference is stated in both files rather than left
silent, and the reason is in the Split Test.

## The Rules

**1. Naming.** Use descriptive camelCase identifiers for JavaScript variables and
functions, and kebab-case for CSS classes and file names. Name a thing for what it
holds or does, not for its type: `contactEntries`, not `contactArray`;
`renderContactLog()`, not `doStuff()`. Name booleans as questions: `isOverdue`,
`hasParentEmail`. Short conventional names for events and indexes are fine when
the role is obvious; arbitrary minimum name lengths are not a standard.

**2. File structure.** Keep browser HTML, CSS, and JavaScript in `index.html`,
`styles.css`, and `app.js`. Keep all server code in `worker.js`. No inline `style`
attributes. No JavaScript in the HTML beyond the tag that loads `app.js`. Use
lexical scope and do not create accidental globals; the IIFE wrapper stays in both
files.

> **This rule expired and was rewritten on 2026-09-22.** The HW3 version read
> "File structure, until Module 4" and said it assumed a browser-only page with no
> server. Module 4 arrived and brought `worker.js`, so the old wording became an
> instruction to put server code somewhere it does not belong. The Split Test below
> predicted exactly this failure mode, named it clash on a delay, and the mitigation
> was to put the expiry in the rule's name so it would be caught rather than
> remembered. It worked: the name is what flagged it. The prediction and its outcome
> are left in place rather than tidied away.

**3. Comments.** Explain why the code exists, never what the line does. Delete any
comment that paraphrases the line beneath it. Reserve comments for reasons that
are invisible in the code: a rule that came from the spec, a workaround, or a
choice that looks arbitrary and is not. Remove temporary debug output before
submission.

**4. Commit messages.** Imperative mood, subject under 60 characters, naming the
changed behavior and its purpose. When the reason is not obvious from the diff, a
body line states why. "Add seven-day overdue flag to contact log," not "updates."

**5. Never use `innerHTML` for user-supplied text.** Text that came from a person
goes into the page with `textContent`. A coach name, a school name, or a note is
an input the user controls, and `innerHTML` will execute markup found inside it.
This is a hard constraint, not a preference.

**6. Feedback must be perceivable, and input must survive a failed write.**
Associate every form control with a label. Make success and error states
announceable, not just visible; the starter uses `role="alert"` for errors and
`aria-live` for status, and that stays. When a save fails, the athlete's typed
text remains in the field. She is logging contacts between practice and homework,
and silently discarding her input is the failure mode this feature exists to
prevent.

**7. No dependency without a row in TOOLS.md.** The browser page still ships
plain HTML, CSS, and JavaScript with no framework, no CDN tag, and no build step.
The repository now has one npm dependency, `wrangler`, because deploying a
Cloudflare Worker has no other supported path. Anything added after it needs a
TOOLS.md row naming what it is trusted with before it is installed, not after.

> **Rewritten on 2026-09-22.** The HW3 version banned dependencies outright and
> said it would expire "when TOOLS.md activates in Module 4 and the trust boundary
> is drawn deliberately." That is what happened. The ban is replaced by the
> accounting it was standing in for.

**8. User values reach SQL through `bind()`, never string concatenation.** Write
`prepare("... VALUES (?)").bind(value)`. A value pasted into SQL text stops being
data and becomes part of the instruction, which is the same defect as rule 5 and
the same fix. This was tested, not assumed: a coach name of
`Robert'); DROP TABLE entries;--` was stored as ordinary text and the table
survived.

**9. No credential in the repository.** No key, token, or password in any file,
including comments and commit messages. A database id is an address, not a key, and
may appear in `wrangler.toml`. Credentials live where `TOOLS.md` says they live.

**10. A failed request is shown to the user on the page.** Every network call goes
through one helper that returns a result rather than throwing, so a failure
produces a sentence the user can read instead of an uncaught exception. The
browser's own network log is not the page throwing and cannot be suppressed by
page code; do not claim a silent console.

---

## Split Test

`CLAUDE.md` loads on every interaction, so every rule in it spends attention on
every task, including tasks it has nothing to do with. Three rules examined
against the Session A questions.

### Rule 1: Naming conventions

**Every task or some tasks?** Every task that writes or edits code, which here is
nearly all of them. A naming convention applied only when remembered is not a
convention.

**Stable or changing?** Stable. camelCase and kebab-case will not change this
semester, and they do not vary by file or feature.

**Failure mode if misplaced.** Confusion. If this lived only in per-task prompts it
would be dropped on the tasks where I forgot to paste it, and the agent would pick
its own convention for those. The result reads as though two people wrote it and
neither was consulted.

**Verdict: belongs in `CLAUDE.md`.** Universal, stable, cheap to state.

### Rule 4: Commit message format

**Every task or some tasks?** Some, and a small fraction. Most tasks are reading,
drafting, editing, or debugging. Committing happens at the end of a chunk of work,
and a rule about commit grammar is dead weight through everything preceding it.

**Stable or changing?** Stable in content, occasional in relevance. That
combination is the trap. A rule that never changes feels like it belongs in the
persistent file, but stability is the wrong test. Relevance is.

**Failure mode if misplaced.** Distraction, and this is the textbook case. A rule
that applies to one task in ten, sitting in context for all ten, is accumulated
irrelevance, which is what degrades attention on the task actually at hand.

**Verdict: belongs in the prompt for the task that needs it.** Removed from
`CLAUDE.md`, where its absence is noted so the difference is not silent. The
prompt snippet it becomes:

> When you write the commit message for this change, use the imperative mood, keep
> the subject under 60 characters, and name the changed behavior and its purpose
> rather than saying that something changed. If the reason is not obvious from the
> diff, add one body line stating why.

### Rule 2: Three-file separation of concerns

**Every task or some tasks?** Every code task in this module. There are three
files, and the rule governs which one any given line belongs in, so it is
load-bearing on every edit.

**Stable or changing?** Stable now, with a known expiry date, which is what makes
it the hardest of the three. Module 4 introduces a database, so server-side code
arrives and "all behavior lives in `app.js`" stops being true. The rule is
universal and temporary at once.

**Failure mode if misplaced.** Clash, specifically clash on a delay. Today the rule
is correct and belongs in the file. After Module 4 the same sentence contradicts
the task in front of it, telling an agent to put behavior in `app.js` while the
task requires a server route. A rule that is right today and wrong in three weeks
does more damage than one that was always wrong, because nobody thinks to check it.

**Verdict: belongs in `CLAUDE.md`, with the expiry condition in the rule's name.**
Kept, but written so the condition that kills it is visible rather than
remembered. ADR-001's revisit trigger covers the same event.

---

## Colleague Test

**Who read it:** Luke, my roommate. He had not seen this repository or any
part of the project before reading `CLAUDE.md`, so the read was cold.

**The one thing they misunderstood or asked about.** They described the three-file
separation as a permanent rule and did not register that it expires. The File
structure section in `CLAUDE.md` closed with a paragraph stating that the
instruction stops being correct once Module 4 introduces a database and
server-side code, and asking the reader to say so rather than follow it in that
case. None of that appeared in their description. They summarized the rule as HTML
for structure, CSS for appearance, and JavaScript for data and functionality, with
no condition attached.

Everything else survived the read. They named the naming convention, the
why-not-what comment rule, and the prohibition on frameworks and outside packages.
Asked what the file would stop someone from doing, they identified the `innerHTML`
rule unprompted and gave the correct reason: that user-entered content like a coach
name or school has to go in with `textContent` instead.

The omission matters more than it looks. The split test above names clash on a
delay as the failure mode for this exact rule, and the mitigation I wrote was to
state the expiry inside the rule so it would be visible rather than remembered.
This test says the mitigation did not work. The condition was present in the text
and a careful reader still came away believing the rule was unconditional. An agent
skimming a long instruction file has no more reason to catch it than they did.

**The one revision I made.** I moved the expiry condition from the end of the
section into the rule's name, where it cannot be skimmed past. Rule 2 above is now
"File structure, until Module 4," and the corresponding heading in `CLAUDE.md` is
"File structure (browser-only, expires in Module 4)."

The same finding exposed an inconsistency between the two files. My earlier draft
of rule 2 stated the three-file rule with no expiry at all while `CLAUDE.md`
carried the condition, which is precisely the silently-diverging copy this file
forbids. Both now carry it.
