# Bridge page edits, 2026-09-03 - applied to index.html

*Applied to the live file on Rich's instruction. `index-b.html` was the preview and has been
deleted: its rendered content was verified byte-identical to `index.html` first (only the noindex
meta and an internal comment differed), so nothing unique was lost.*

**Not pushed.** The page takes money; Escalation rule 3 leaves the push with Rich.

```bash
cd "/Users/rt/CC/cie insider/CIEInsider.com" && git add -A && git commit -m "Bridge: parent section, outcome-led headline, corpus claim to 2026"
```

## What changed (six edits, everything else byte-identical)

| # | Change | Why |
|---|---|---|
| 1 | Hero lead: the already-in-AS student gets their own sentence; the "go at your own pace" line cut | It was a trailing clause on a sentence about someone else. That segment is the one who feels this in Oct-Nov. The cut line was the fourth restatement of "self paced" on one screen. |
| 2 | "What you get" h2: `Eight modules and over 5,000 practice questions.` -> `Practise until the method is automatic, not remembered.` | Volume is the axis PMT, ZNotes and SME win on; leading with it argues their case. The replacement is the page's own phrase, moved up from the generator description. **The 5,000 figure is unchanged in the hero meta and body** - it is a good supporting spec, just a bad headline. |
| 3 | Pricing lead gains "The work is a few weeks now, or two terms of catching up later." | That argument was the strongest thing on the page and it sat below the FAQ. Now it is at the decision point. |
| 4 | **NEW visible "For parents" section**, four cards, above the About section | Rich confirmed 2026-09-03 that the parent is the payer in most cases. Before this, every word aimed at the payer was collapsed inside a `<details>`. Answers the payer's four questions (is it needed / what arrives / what it costs / what if wrong); deliberately does not reuse the FAQ answer's wording. |
| 5 | Corpus claim `2021 to 2025` -> `every examiner report Cambridge published for both from 2021 to 2026` | Matches the live Skool about copy. The bridge page and the Skool rooms currently state two different numbers for the same claim. Verified true and scoped to what Cambridge published. |
| 6 | `noindex,nofollow` added | A second sales page on the same offer must not be indexed. Not in sitemap, linked from nowhere. |

## Checks run

- Funnel punctuation gate: **0** em dashes, **0** en dashes, **0** curly quotes, **0** arrows,
  **0** occurrences of `' - '`. British English throughout.
- Only non-ASCII in rendered text is `£` in the meta description; only `color` match is the CSS
  property in an inline style. **Both identical on the live page** - pre-existing, benign.
- JSON-LD parses; every FAQPage question still appears verbatim in a visible `<summary>`. Schema
  untouched.
- All internal hrefs resolve over the preview server: `#pricing`, `/`, `/9702/readiness/`,
  `/terms/`, `mailto:`.
- Mobile 375px: no horizontal overflow, no element exceeding the viewport, cards stack.
- Desktop 1440px + mobile screenshotted. Only console error is Cloudflare RUM blocked by CORS on
  localhost, which is expected off-domain and not a page defect.
- **Stripe link, waitlist markup, all five `wl-*` ids and the Kit JS: byte-identical to live.**

## One critique point that did not survive contact

I said the page's only `<button>` being "Join the waitlist" was a structural oddity. It is a form
submit inside the Kit capture, so it has to be a `<button>` - the observation was right about the
visual weight and wrong about the mechanism. **Not changed in B.** If the waitlist's prominence
still bothers you, the fix is the card's placement or the button's style, not its element. Worth a
look: on mobile it renders as a full-width bordered button immediately above the parent section,
which is more weight than a notification signup needs.

## Decisions for Rich

- ~~Whether any of this ships~~ - decided 2026-09-03, applied.
- The 2021-2025 -> 2026 corpus fix went well beyond this page. See the sweep record in `TASKS.md`
  (entry dated 2026-09-03) for what was changed, what was deliberately left at 2025, and why.
- Still open from the critique, not changed: the waitlist card's visual weight on mobile. It
  renders as a full-width bordered button directly above the new parent section, which is more
  prominence than a notification signup needs. Placement or styling, not a copy fix.
