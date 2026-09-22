# Features and specification

Status: ACTIVE. Copied and revised from my own HW2 `FEATURES.md`.

**Ryan Linde — MGT 3745**
**Kano classification dated 2026-09-08. Revised 2026-09-15 for HW3.**

> **Revision note.** The Kano table, specification, and handoff test are unchanged
> from HW2. Added for HW3: acceptance statements E10 to E13, which scope the
> contact log at the level it is actually implemented; a scope clarification under
> Constraints; and the Verification section. The original nine statements specify
> the Reality Check service and were never written to be testable against a single
> page. Instructor HW2 feedback was pending, so the scope choice was checked
> against peer feedback instead, recorded under Colleague Test in `STANDARDS.md`.

## Kano Hypotheses

Classified **2026-09-08**. Classifications expire; the Attractive item becomes
Must-be once competitors ship it.

| # | Feature | Kano | Reason from research |
|---|---|---|---|
| 1 | Verified coach addresses for her level | Must-be | Finding addresses is what capped my sister at six emails |
| 2 | Honest level assessment | Must-be | Mom asked for exactly this; sister cannot tell if she is aiming too high or low |
| 3 | **Contact log with follow-up status** | Performance | The thing sister named to hand off first; she forgets who to re-email |
| 4 | Coach emails drafted for the athlete | Performance | Personalizing is why she planned more and sent six |
| 5 | Reply activity visible to the parent | Performance | Mom's definition of going well is coaches responding |
| 6 | Signal of program interest before paying for its camp | Attractive | Mom declined a camp for exactly this reason |
| 7 | Follower, view, and like counts | Indifferent | "Just getting views or likes doesn't really mean that much to me" |
| 8 | Emails sent without the athlete seeing who was contacted | **Reverse** | Sister hands off writing but insists on knowing who is contacted |

**HW3 implementation scope: row 3 only, the contact log.** Chosen because it is the
item the athlete named as the first thing she would hand off, and the smallest item
on the list that still carries a real acceptance surface. Rows 1, 2, 4, 5, 6 remain
product scope and are **not** implemented this week; they are classified in the
Verification section rather than left ambiguous.

## Context

A club soccer family cannot get evidence of interest before spending. The mother
already pays for camps, showcases, travel, and film, and declined the last camp
because she could not tell whether the program was interested. The athlete sends
small personalized batches, loses track of follow-ups, and cannot judge her own
level. The Reality Check supplies that evidence free, before money is discussed.

## Users

Profile A (The Parent) and Profile B (The Athlete) in `USERS.md`. The athlete does
the outreach; the parent decides what gets paid for. Both must be present by the
end. The contact log serves Profile B directly.

## Scope and Non-Goals

**Product does:** one intake form; a written Reality Check with a level assessment
and stated confidence, a fit-ranked list of at least 15 verified coach addresses,
and a named next step; delivered in 48 hours; followed by a 15-minute call with a
parent present.

**Product does not:** guarantee placement, offers, or replies. Does not email any
coach during the Reality Check. Does not send a coach email the athlete cannot see.
Does not report views, likes, or follower counts. Does not edit film. Does not
present a price before the call.

**HW3 build does:** record a coach contact (coach, school, date, status), persist it
in this browser, list saved contacts, reject incomplete entries by naming the
missing field, and flag entries awaiting a reply for seven or more days.

**HW3 build does not:** send email, verify addresses, assess level, sync between
devices, or show anything to the parent. Those are product scope, not this week.

## Behavior

1. Intake submitted: grad year, position, club, GPA, film link, parent email, target regions.
2. Receipt confirmed, delivery deadline named.
3. Level assessed against the club's competitive tier and the film; confidence recorded.
4. Coach list built, each address verified against the current staff directory.
5. Reality Check emailed to athlete and parent with a booking link, then up to two follow-ups.
6. The call reviews the document and ends with an explicit next step.

**Contact log behavior (HW3).** The athlete enters a coach name, school, and contact
date, and picks a status. On submit the entry is validated, written to localStorage,
and rendered into the list. On load the stored entries are read and rendered. Any
entry still awaiting a reply seven or more days after its contact date is marked due
for follow-up.

## Constraints

Email only; no app or login. Under-18 athletes require a parent email before
delivery. The athlete must be able to see every coach contacted on her behalf. No
athlete data is published or shared between families. Addresses re-verified within
90 days of use. The 48 hours runs from a **complete** intake.

> **Scope clarification added 2026-09-15.** "Email only; no app or login" governs
> **delivery of the Reality Check**, which remains email. The contact log is the
> athlete's own working tool on her own device, not a portal a family logs into to
> receive a deliverable. See ADR-001 in `ARCHITECTURE.md`.

## Acceptance

**Service-level statements, carried from HW2. Product scope.**

- **E1.** WHEN a complete intake is submitted, THE SYSTEM SHALL confirm by email within 15 minutes, stating the 48-hour deadline.
- **E2.** WHEN 48 hours have elapsed since a complete intake, THE SYSTEM SHALL have delivered the Reality Check or sent a delay notice naming a new date.
- **E3.** THE SYSTEM SHALL include at least 15 coach addresses, each verified against the program's staff page within 90 days.
- **E4.** THE SYSTEM SHALL state one level assessment and one confidence value from {high, medium, low}.
- **E5.** WHERE a coach has been contacted for an athlete, THE SYSTEM SHALL show her the coach, the date, and the follow-up status.
- **E6.** IF the athlete is under 18 and no parent email is on file, THEN THE SYSTEM SHALL withhold delivery and request one.
- **E7.** IF a listed address bounces, THEN THE SYSTEM SHALL replace it within 5 business days.
- **E8.** WHILE a delivered Reality Check has no booked call, THE SYSTEM SHALL send at most two follow-ups, on day 3 and day 7.
- **E9.** IF no parent is present at the scheduled call, THEN THE SYSTEM SHALL reschedule rather than present pricing.

**Feature-level statements for the contact log. HW3 implementation scope.**

- **E10.** WHEN the athlete submits a contact entry containing a coach name, a school, and a contact date, THE SYSTEM SHALL save the entry and display it in the contact log.
- **E11.** WHEN the page is reloaded, THE SYSTEM SHALL display every entry saved in previous sessions.
- **E12.** IF a required field is empty when the entry is submitted, THEN THE SYSTEM SHALL reject the entry and name the field that is missing.
- **E13.** WHILE an entry's status is "awaiting reply" and 7 or more days have passed since its contact date, THE SYSTEM SHALL mark that entry as due for follow-up.
- **E14.** IF the write to storage fails, THEN THE SYSTEM SHALL report the failure and leave the athlete's typed input in the form.

E5 is the one service-level statement the contact log implements directly, so it is
tested below. E14 was added because `STANDARDS.md` rule 6 requires it and the
starter application already supports testing it through the `?failSave` switch.

## Handoff Test

Four questions block a stranger. **What makes an assessment "high confidence"?** I
never defined the evidence threshold, so two people would grade the same athlete
differently. Largest gap here. **What does this cost, and would a parent pay?** My
mother said she does not mind spending when there is a reason, but I never asked
what she would pay, so Kano row 6 is a hypothesis about willingness, not a
measurement. **Who re-verifies the coach data?** The databases exist; the refresh
process is only in my head. And **both interviews were one household** — a mother
and daughter agree with each other more than two unrelated families would.

---

## Verification

**Environment:** GitHub Codespace (devcontainer `MGT 3745 HW3 v6.17`), Live Server
on forwarded port 5500, Chrome on macOS.
**Tested on:** 2026-09-15
**Commit under test:** `015a50f`

Steps and expected results were written before the run. Observed results were
recorded while exercising the page, one statement at a time.

### Selected scope (HW3 implementation)

| Criterion | Steps and input | Expected result | Observed result | Status | Evidence / commit |
|---|---|---|---|---|---|
| E10 — normal action | Enter coach `A. Rivera`, school `Elon University`, date `2026-09-15`, status `awaiting reply`. Submit. | Entry appears in the list showing all four values. Form clears. Success message announced. | Entry rendered as "A. Rivera — Elon University — contacted 2026-09-15 — awaiting reply". All four fields cleared. Status region read "Contact saved in this browser." Focus returned to the coach name field. No overdue badge, correct for a same-day contact. | PASS | `015a50f`, `docs/contact-log.png` |
| E12 — invalid input, empty required field | Leave coach name blank, fill school `Test College` and date `2026-09-15`. Submit. | Entry is rejected, nothing added to the list, and the error names the coach name field specifically. | Red bold text read "Coach name is required." List stayed at three entries. The coach name field took an invalid outline and focus. School and date retained the typed values rather than being cleared. | PASS | `015a50f` |
| E12 — invalid input, length boundary | Enter a coach name of 201 characters, fill school and date. Submit. | Entry is rejected with a length error naming the 200-character limit. | NOT RUN IN THE CODESPACE — see note below. | CANNOT TEST | — |
| E11 — persistence | With three entries saved, reload the page. | All entries render from storage, same order, same values. | All three entries returned in the original order with identical values. The overdue badge recomputed on M. Chen, and the follow-up count re-rendered, confirming the overdue calculation runs on load and not only at save time. | PASS | `015a50f` |
| E14 — write failure | Append `?failSave` to the URL. Enter coach `K. Alvarez`, school `Wofford College`, date `2026-09-14`. Submit. | Save fails, an error is shown, the list is unchanged, and the typed text remains in the form fields. | Red bold text read "Could not save. Your entry is still here. Try again when storage is available." List stayed at three entries with no K. Alvarez. All three fields still held the typed values. | PASS | `015a50f` |
| E13 — overdue flag | Save an entry with status `awaiting reply` and contact date `2026-09-07`, eight days before the test date. | Entry is marked due for follow-up. | Entry rendered with an orange badge reading "Due for follow-up (8 days)". | PASS | `015a50f`, `docs/contact-log.png` |
| E13 — boundary, not yet due | Save an entry with status `awaiting reply` and contact date `2026-09-09`, six days before the test date. | Entry is **not** marked due for follow-up. | No badge on the six-day entry, and the follow-up count stayed at one rather than incrementing. The threshold fires at seven days and not before. | PASS | `015a50f`, `docs/contact-log.png` |
| E5 — service statement met by this build | Inspect any saved entry in the list. | Coach, contact date, and follow-up status are all visible without further interaction. | Every row displayed coach name, school, contact date, and status in a single line, with the follow-up state shown either as the status text or as the overdue badge. No click or hover required. | PASS | `015a50f`, `docs/contact-log.png` |

**Note on the one CANNOT TEST row.** The 201-character boundary was exercised
against the same commit on a local server before the Codespace run and behaved as
expected, rejecting the entry with "Coach name must be 200 characters or fewer."
It is recorded as CANNOT TEST rather than PASS because it was not re-run in the
Codespace environment this table names, and reporting a result from a different
environment as though it came from this one would misstate the evidence. Next
step: paste a 201-character name into the Codespace page and record the observed
result.

### Unselected product requirements

These are **outside HW3 implementation scope** by the scope decision recorded above
and in ADR-001. They are not failures, and they are not self-authored deferrals of
required HW3 functionality; they are product-level requirements for a service this
week's build does not attempt.

| Criterion | Why it is outside HW3 scope | Status |
|---|---|---|
| E1, E2 | Require sending email and a server-side clock. The build has neither. | CANNOT TEST |
| E3 | Requires the coach address databases and a verification process, not a page. | CANNOT TEST |
| E4 | Requires human assessment of film and competitive tier. | CANNOT TEST |
| E6 | Requires an intake flow and a delivery gate; the contact log has no intake. | CANNOT TEST |
| E7 | Requires bounce detection from a mail system. | CANNOT TEST |
| E8 | Requires scheduled outbound email. Note the day 3 / day 7 cadence is the source of E13's seven-day threshold, which **is** tested. | CANNOT TEST |
| E9 | Describes conduct on a human sales call. | CANNOT TEST |

Each row names the missing evidence and what would be needed to obtain it, per the
CANNOT TEST definition in `SCAFFOLD_MANIFEST.md`.

---

# HW4: Data Leaves the Browser

**Added 2026-09-22.** ADR-002 moved entries out of localStorage into a Cloudflare
Worker backed by D1. The statements below are new; the verification section
following them re-walks every statement against the deployed page.

## Acceptance, added for the server

- **E15.** IF a request body sent to `POST /entries` is not valid JSON, THEN THE SYSTEM SHALL reject it with status 400 and a message naming the problem.
- **E16.** IF a submitted field contains database syntax, THEN THE SYSTEM SHALL store it as literal text and leave the schema unchanged.
- **E17.** WHERE an entry has been saved, THE SYSTEM SHALL return it to any browser that requests it, not only to the browser that saved it.
- **E18.** IF the server cannot be reached, THEN THE SYSTEM SHALL tell the user on the page and SHALL NOT raise an uncaught exception.

**E12 is the statement the server-side validation rule traces to.** It was written
in HW2 as a statement about the system, not about the form, and that distinction
now earns its keep: the page can be bypassed entirely and `POST /entries` still
refuses an entry with a missing field, naming the field.

## Verification, HW4

**Environment:** deployed Worker at `https://mgt3745-hw4.ryanlindebusiness.workers.dev`,
page served over HTTP and loaded in Chrome on macOS.
**Tested on:** 2026-09-22 · **Commit under test:** `92e6f32` and later

### Statements carried from HW3, re-walked

| Statement | HW3 verdict | HW4 verdict | Reason |
|---|---|---|---|
| E10 — save and display an entry | PASS | PASS | Saved through the page; the entry came back from `GET /entries` and rendered |
| E11 — entries survive a reload | PASS | PASS | Now survives more than a reload; see E17 below |
| E12 — empty field rejected, field named | PASS | PASS | Enforced twice: in the page, and again in the Worker where it cannot be bypassed |
| E12 — 201-character boundary | **CANNOT TEST** | **PASS** | The HW3 row that had no evidence. `POST` with a 201-character coach name returned 400 "Coach name must be 200 characters or fewer."; 200 characters exactly returned 201. Both sides of the boundary tested |
| E13 — flagged at 8 days, not at 6 | PASS | PASS | Recomputed on load from server data rather than from localStorage |
| E14 — failed write preserves typed input | PASS | PASS | Now a network failure rather than a storage failure; see E18 |
| E5 — coach, date, status visible | PASS | PASS | Unchanged |
| E1–E4, E6–E9 | CANNOT TEST | CANNOT TEST | Still outside HW3/HW4 implementation scope; they specify the human Reality Check service, not this page |

### New rows: the failure modes a server introduced

| Criterion | Steps and input | Expected | Observed | Status |
|---|---|---|---|---|
| **E17 — survives a cleared cache / second client** | Save entries in one browser. Request `GET /entries` from a separate client that has never loaded the page | The same entries come back | `curl` against the deployed URL, with no browser and no site data at all, returned all three entries. The data is not in any browser | **PASS** |
| **E18 — network unreachable** | Load the page with `?failSave`, which points it at a host that cannot resolve | A message on the page, no uncaught exception | Page showed "Could not load saved contacts. Could not reach the server. The list below may be incomplete." List rendered empty rather than stale. No uncaught exception. The browser logged `ERR_NAME_NOT_RESOLVED` at its own network layer, which page code cannot suppress and which is not the page throwing | **PASS** |
| **E15 — server returns 400, bad JSON** | `POST /entries` with a body that is not JSON | 400 naming the problem | `body must be JSON`, HTTP 400 | **PASS** |
| **E12 — server returns 400, missing field** | `POST /entries` with `coachName` absent, page bypassed entirely | 400 naming the missing field | `Coach name is required.`, HTTP 400 | **PASS** |
| **E16 — submitted SQL is stored as data** | `POST` a coach name of `Robert'); DROP TABLE entries;--` | Stored as literal text, schema unchanged | Row saved with that exact string as the coach name. `GET /entries` still worked, table still present, other rows intact | **PASS** |
| **Column mapping is correct** | `POST` four deliberately distinct values (`AAA-COACH`, `BBB-SCHOOL`, `2026-01-02`, `CCC-STATUS`) and read them back | Each value returns in its own field | Each landed in the right field. This is the check that reading the code could not give me, since a swapped pair would still run, still return 201, and still look fine | **PASS** |
| **Server returns 500** | Attempted to force an internal error by sending a nested object where a string was expected | A readable 500 naming the cause | Could not produce one. The validation rule caught it first and returned 400. I do not currently know how to make the deployed Worker fail internally without editing it to fail on purpose, which would be testing a different program | **CANNOT TEST YET** |
| **Second client writes to the same table** | Two clients submit entries at the same time | Undecided | Not attempted. ADR-002 names conflict behaviour as unresolved and lists a second writer as a revisit trigger. Deciding what should happen is prior to testing what does | **DEFERRED** (ADR-002) |
| **Unauthenticated access** | Any client that knows the URL can read, write, and delete every entry | — | Confirmed while testing: every `curl` above ran with no credential of any kind. This is not a bug in the code, it is the consequence named second in ADR-002, and it is the reason ADR-003 is owed before real data goes in | **FAIL, by design and recorded** |

The last row is a FAIL rather than a DEFERRED because nothing in this build is
waiting on a decision I have not made. I know what is wrong, I know why, and I
shipped it anyway for a course assignment holding three fictional coaches. Calling
that DEFERRED would be using the word to make a known hole sound scheduled.
