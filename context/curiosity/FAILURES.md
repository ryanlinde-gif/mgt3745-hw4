# FAILURES

Optional curiosity file. No rubric points. Things that were wrong at some point
today, kept because the pattern is more useful than the fix.

## 1. Copilot did not take the bait, and that is still a finding

HW4 predicted Copilot would offer string-concatenated SQL for the insert. It did
not. Asked to write the insert into `worker.js`, it produced
`VALUES (?, ?, ?, ?)` with the values in a separate `.bind()`, which is correct.

My guess at why: every other query already in that file used `prepare().bind()`,
so it had four correct examples in front of it. The safety came from the context
it happened to be sitting in, not from the model being careful. Had I asked in an
empty file, I do not assume the answer would have been the same, and I have not
tested that.

**The thing I could not verify by reading it:** whether the four bound values
line up with the four columns in the right order. `coach_name, school,
contact_date, status` against `body.coachName, body.school, body.contactDate,
body.status`. A swapped pair would run, return 201, and store the school in the
coach field forever. Reading the code harder would not have told me. Posting four
deliberately different values and reading them back did.

**Pattern:** the dangerous part of generated code was not the part I was warned
about. It was the boring part next to it.

## 2. The server said 201 and stored nothing

For about twenty minutes the deployed Worker returned `201 Created` on every
POST while the insert was still a TODO comment. `GET /entries` kept returning
`[]`. Nothing errored. Nothing logged.

This is the same failure I wrote about in HW3, where clearing the form before
confirming the save would have shown an entry that was never stored. There it was
hypothetical. Here it was live on the internet, and the only reason I caught it
was that I checked the list after posting instead of trusting the status code.

**Pattern:** a success code is a claim, not evidence.

## 3. The page kept telling users something that had stopped being true

`index.html` said "Entries are saved in this browser only." That sentence was
accurate in HW3 and became false the moment ADR-002 shipped, and nothing about
moving the data touched the paragraph describing where the data was. It was
caught by reading the rendered page, not the diff.

**Pattern:** prose about behaviour rots silently. The tests moved, the code moved,
the sentence did not.

## 4. An error message promised something it could not know

The first version of the network-failure handler said "Could not reach the
server. Your entry is still here." That is true when a save fails. It is
meaningless when the *load* fails, because nothing was typed. One message was
serving two paths that needed different promises.

**Pattern:** a shared error string will eventually be wrong on one of its paths.

## 5. Two standards expired on schedule, and the expiry is what caught them

`STANDARDS.md` rules 2 and 7 both carried expiry conditions written in HW3: rule 2
assumed a browser-only page and rule 7 banned dependencies "until TOOLS.md
activates in Module 4." Both conditions came true this week.

The HW3 Split Test had predicted this exact failure mode for rule 2, called it
clash on a delay, and the mitigation was to put the expiry in the rule's *name*
rather than in its body, after a classmate read the body and missed it entirely.
That mitigation is the reason both rules were caught rather than followed into
being wrong.

**Pattern:** a rule that knows when it dies is worth more than a rule that is
merely correct today.
