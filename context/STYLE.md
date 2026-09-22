---
color-primary: "#0095F6"
color-accent: "#ED4956"
color-background: "#FFFFFF"
color-surface: "#FAFAFA"
color-text: "#262626"
color-text-muted: "#737373"
font-body: "system-ui"
font-heading: "system-ui"
font-size-min: 14px
space-unit: 8px
radius: 8px
---

# STYLE.md

Tokens above, rationale below. The frontmatter is what a machine reads; this
body is what a human reads.

Admired interface: **Instagram**. Not for the content, for the restraint. The
chrome gets out of the way and the thing you came for is the largest object on
the screen.

## Rationale

- **color-primary `#0095F6`**: one blue, used only for the thing you can act on, so a parent skimming on a phone can find the button without reading the page.
- **color-accent `#ED4956`**: reserved for the overdue follow-up flag and nothing else, because an accent that appears twice on a screen stops meaning "look here."
- **color-background `#FFFFFF` and color-surface `#FAFAFA`**: two near-whites rather than borders everywhere; separation by tone is quieter than separation by line.
- **color-text `#262626`**: near-black rather than `#000000`, because pure black on pure white is harsher than anything printed and this page gets read at night between practice and homework.
- **color-text-muted `#737373`**: the lightest gray that still passes contrast on white at 14px, used for helper text only, never for anything a user must read to act.
- **font-body / font-heading `system-ui`**: one family for both roles, because two families is a decision I have not earned yet and three is a mess.
- **font-size-min 14px**: the floor, because the parent in `USERS.md` is reading this on a phone and is not the age the designer is.
- **space-unit 8px**: every margin and pad is a multiple of eight, so nothing is eyeballed and two screens built a week apart still line up.
- **radius 8px**: soft enough to read as a modern app, square enough that a form still reads as a form.

## Refusals

Things this interface will never do, drawn from **Hudl**, the interface I resent.
Laws referenced from lawsofux.com.

1. **No video or media that plays on its own.** Breaks the **Peak-End Rule**: one jarring moment at an unpredictable volume is what the whole visit gets remembered by, and an athlete checking her log during class does not need a surprise.
2. **No feature that reveals it is paid only after the user has done the work.** Breaks the **Goal-Gradient Effect**: interrupting someone at the point they are closest to finishing is the most expensive moment to stop them, and it is the moment it feels worst.
3. **No burying the primary action behind a menu.** Breaks **Fitts's Law** and **Hick's Law**: the one thing this page exists for is logging a contact, so it is the first control on the screen and it is never a click away inside navigation.
4. **No notification or badge for anything the user did not ask to be told about.** Attention is the thing my users have least of; `USERS.md` says the athlete's effort already runs in waves tied to school and training load.

## Sources

- **Admired:** Instagram. Screenshot not captured; named here rather than claimed as evidence.
- **Resented:** Hudl. Screenshot not captured; named here rather than claimed as evidence.

> HW4 note: this file is graded on presence this week and becomes rigorous in
> HW5. The refusals above are written from my own use of both products. The two
> screenshots the template asks for are genuinely not in `/docs`, and saying so
> is more useful than a placeholder that implies they are.
