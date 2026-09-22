# TOOLS.md

The ledger of Trust Boundary crossings. One row per external service this
repository actually depends on. Read by the agent on every task, so it stays
short: a service not in use does not belong here.

No credential appears in this file or anywhere in this repository. The
`database_id` in `wrangler.toml` is an address, not a key.

| Service | Trusted with | Credentials live | Crossing statement | Switching cost |
|---|---|---|---|---|
| **Cloudflare Workers + D1** | Every contact a user types: coach name, school, date, status. Plus request metadata Cloudflare logs whether I asked for it or not: IP address, timestamp, user agent | Cloudflare account login; an OAuth token wrangler wrote to `~/Library/Preferences/.wrangler` on my laptop | "Entries my sister types leave her browser and are stored in Cloudflare's D1 in region ENAM, which Cloudflare chose and I did not, under free-tier terms I accepted by signing up and have not read in full. If that data is exposed, the person answering for it is me, not Cloudflare." | **Medium.** `wrangler d1 export` gets the rows out; the Worker would have to be rewritten for another host |
| **GitHub + Codespaces** | Source, full commit history, and the contents of `USERS.md`, which quotes interviews with my mother and my sister and names her graduating class. The repository is public | GitHub account login (browser session and GitHub Desktop) | "I put research about two real people, one of them a minor, into a public repository so a grader could read it. GitHub hosts it, anyone can read it, search engines can index it, and I am the one who chose to publish it. I reviewed this on 2026-09-22 and chose to leave it, because both people are my immediate family, they consented to the recorded interviews, and the repository has been public since HW2. It is a decision, not an oversight, which is the only part of it I control." | **Low.** Push the same history to another host |
| **GitHub Copilot** | Whatever is open in the editor and enough of the repository to answer. When I asked it for the SQL insert, `worker.js` was open and its reply cited `schema.sql`, so it had read at least both | GitHub account; no separate credential | "The contents of my repository cross to GitHub's model as prompt material every time I ask Copilot a question, and since the repository is already public that adds no new exposure, but it would if this repository ever went private and I forgot this row existed." | **Low.** Stop asking it |
| **wrangler (npm)** | No user data. It holds the Cloudflare OAuth token described above, and it ran install scripts on my laptop with my own permissions when I ran `npm install` | The token it wrote to `~/Library/Preferences/.wrangler` | "I installed a package I have never read, it ran code on my laptop during install, and I then handed it a token that can deploy Workers and write to my database. I trusted the maintainers on the strength of the name on the package, and if that package changed hands tomorrow I would not notice." | **High in practice.** It is the only supported way to deploy a Cloudflare Worker; leaving means leaving Cloudflare |

## Revisit triggers

- A new service is added to the repository.
- A vendor changes pricing, terms, or region.
- A credential moves.
- This repository stops being public, which changes the Copilot row.
