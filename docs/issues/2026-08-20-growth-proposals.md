# Growth Proposals — SEO & Survey Findings (2026-08-20)

Source data: 90-day GSC organic query export (2026-05-22 → 2026-08-19; 1,001 queries,
3,116 clicks, 25,493 impressions) and two Hotjar surveys (51 responses total; 49 rated,
8 left free text).

**Measuring the shipped change:** see `MEASUREMENT-CHECKPOINT-seo-2026-08.md`.

**Status:** Discussion documents. Nothing here is agreed or scheduled. The "safe wins"
(commit `ccf7252`) shipped separately; everything below was deliberately deferred pending
discussion.

---

## Context: what the data actually says

The head of our search footprint is healthy and must not be disturbed:

| Query | Clicks | Impressions | CTR | Position |
|---|---|---|---|---|
| fair share calculator | 334 | 447 | 74.7% | 1.00 |
| rent split calculator based on income | 358 | 1,175 | 30.5% | 2.34 |
| bill split calculator | 273 | 2,555 | 10.7% | 5.47 |

86.6% of clicks come from non-branded terms — a genuinely healthy organic profile, not
brand-dependent. The growth surface is the tail: **859 of 1,001 queries (86%) receive zero
clicks**, carrying 7,627 impressions (30% of all impressions).

The survey says the product itself is not the problem: **mean 4.67 / 5**, median 5, with
39 of 49 raters giving 5 stars. Only 8 of 51 respondents wrote anything at all. Every
qualitative finding below therefore rests on single-digit counts and is treated as
directional, never as a mandate.

---

## Proposal 1 — "Split Money Calculator" page

This is the one that needs the most discussion, because the obvious version of it is a
mistake.

### The opportunity

| Query | Impressions | Clicks | Position |
|---|---|---|---|
| split money calculator | 328 | 0 | 10.9 |
| money split calculator | 163 | 0 | 18.2 |
| sharing ratio calculator | 151 | 0 | 22.0 |
| split calculator | 138 | 2 | 28.3 |
| split payment calculator | 40 | 0 | — |
| 60 40 split calculator | 37 | 0 | — |
| pay split calculator | 34 | 3 | — |
| split pay calculator | 33 | 0 | — |
| check split calculator | 31 | 0 | — |
| money splitter calculator | 30 | 0 | — |

Cluster total: **181 queries, 1,977 impressions, 9 clicks (0.46% CTR), average position 22.5.**

The cause is a clean vocabulary gap. The word "money" appears **zero times** on the
homepage and twice on `/faq`, both incidental ("money-related stress"). We are not
competing for this language at all.

### The trap I want to flag before we build anything

The tempting version is "same calculator, new page, swap 'bills' for 'money' in the copy."
**That is a doorway page**, and Google's guidelines name it explicitly. A near-duplicate
page whose only differentiator is keyword substitution risks not just failing, but
devaluing the pages we already rank well with. Given we just spent a commit recovering from
the FAQ-removal incident, I don't think we should take a *site-wide* risk to chase 1,977
impressions.

So the page is only worth building if it does something genuinely different.

### What I'm actually imagining

The interesting observation is that the money cluster wants the **inverse input** of our
current tool.

- **Today:** "Here are our two incomes" → we derive a ratio → we apply it to expenses.
- **The money cluster wants:** "Here is an amount, and here is a ratio" → split it.

Same underlying maths, opposite entry point. That's a real functional difference, not a
copy difference — which is what makes a separate page defensible rather than a doorway.

Concretely:

- **Route:** `/split-money-calculator`
- **H1:** "Split Money Calculator" (must *not* reuse the homepage's H1 or title pattern)
- **Primary input:** one amount to split
- **Ratio input, two modes:**
  - *Direct ratio* — pick or type 60/40, 70/30, 80/20, or any custom pair. This directly
    serves `60 40 split calculator`, `sharing ratio calculator`, and the ~434-impression
    numeric-ratio sub-cluster that currently converts below 1%.
  - *From incomes* — derive the ratio the way we do today, with a link across to the main
    calculator for full multi-expense splitting.
- **Reuse:** `calculateShares` in `lib/calculator/compute.ts` already does the proportional
  maths. Direct-ratio mode is a thin wrapper over it; no new calculation logic and no
  change to the existing engine.
- **Cross-linking:** the new page should link to `/` for the richer use case, giving us a
  genuine internal-linking rationale rather than an isolated satellite page.

### What I would deliberately *not* do

**Equal n-way splitting** ("split $100 between 8 people"). Part of the money cluster wants
this, and part of the long-tail question cluster is outright arithmetic homework
("if $98 is shared between eight people..." — ~731 impressions, 0.82% CTR). Chasing it
means competing with Splitwise and every generic calculator site on a query we have no
advantage in, and attracting visitors our product cannot serve. High bounce, no conversion,
and a diluted position on the couples/income-splitting niche we actually own.

### Risks, stated plainly

| Risk | Severity | Notes |
|---|---|---|
| Doorway-page penalty | **High if done lazily**, low if the ratio-first input is real | The entire justification for the page is functional differentiation |
| Cannibalising `bill split calculator` | Low | Vocabulary is genuinely disjoint; "money" appears nowhere on `/` today |
| Intent mismatch → bounce | Medium | Mitigated by excluding equal-split; unavoidable for some share of the cluster |
| Ongoing maintenance | Medium | A second calculator UI is a permanent cost on a small site |

### Effort

Medium–large. New route + client component + inputs, reusing `compute.ts` unchanged. Needs
a `app/sitemap.ts` entry (suggest priority 0.5) and must stay **○ Static** in the route
table.

### My recommendation

Consistent with "measure first": hold this until the shipped additive copy changes have had
4–6 weeks in GSC. If phrasing additions alone move `split bill calculator` (1,851
impressions at 3.1%) and `split household bills fairly` (411 impressions, 0 clicks), that
is strong evidence the cheap lever works and we may not need the page. If they don't move,
we'll have learned the gap is structural and the page is better justified.

---

## Proposal 2 — Lightweight export / share

Agreed direction: reword now (**shipped**, `ccf7252`), build export later. This is the scope
for "later".

### Evidence

2 of 51 respondents, both unprompted, both after the Feb 2026 removal:

> "I would love an 'export' feature so I could save this and send to my husband. I had to
> take a picture of it but would rather have it in a document." — 21 Jul 2026

> "A share button that allows me to share the page w/ the current cost breakdown."
> — 26 Jun 2026

Note the first respondent **photographed their screen** as a workaround. That is a real
friction signal worth more than the raw count of 2.

### Proposed scope

Two small additions to `components/calculator/results-footer.tsx`, no auth and no backend:

1. **Copy summary** — plain-text breakdown to clipboard, so it can be pasted into any
   message. Directly serves "send to my husband". Reuse the existing `Snackbar` for
   confirmation, as the save flow already does.
2. **Print / Save as PDF** — `window.print()` plus a print stylesheet in `app/globals.css`.
   Serves "would rather have it in a document" via the browser's native Save-as-PDF.

Track both with `trackEvent` so we get usage data — which is exactly what the original
share feature was removed for lacking.

### Why not the alternatives

- **Rebuilding the share-link feature + Cloudflare Worker** contradicts a documented
  decision backed by far harder data (60 shares vs 6,028 results views; 44 of 2,067 unique
  users) than 2 survey comments. If we want that back, it should follow evidence from the
  cheap version above, not precede it.
- **Enabling `NEXT_PUBLIC_AUTH_ENABLED`** would gate "send this to my husband" behind Google
  OAuth. The Save feature is fully built (Supabase, atomic RPC) but invisible in production,
  so this looks like a free win — it isn't. It contradicts the two unprompted praise
  comments calling the tool "simple", "easy" and "quick", and adds sign-in friction to a
  one-off anonymous task.

### Effort

Small–medium. `results-footer.tsx`, a print stylesheet block in `globals.css`, one analytics
event. No changes to calculation, state, or persistence.

---

## Proposal 3 — Pay-period breakdown

Agreed: scope, don't build.

### Evidence

2 of 51 respondents, both 5-star, both unprompted:

> "Maybe a breakdown of how much one would need to save back from each check. For example,
> one person is paid twice a month and another gets paid weekly. For the weekly person, it
> would be really nice to see a quick calculation of what they should hold off each week."

> "I wish it had a date field and could help you kind of see how much per paycheck you would
> have to enter, but I went through and did that myself so not a big deal!"

Both describe doing the arithmetic manually — the workaround exists, so the demand is real
but the pain is mild ("not a big deal").

### Status

Not implemented, and no partial foundation exists. Verified: no pay-frequency, pay-date or
period concept anywhere in `lib/calculator/types.ts`, `compute.ts`, or any component. Grep
for `paycheck|pay period|biweekly|weekly` across `lib/`, `components/`, `app/` returns
nothing.

### Sketch

Per-person pay frequency (weekly / fortnightly / twice-monthly / monthly), then show each
person's share divided into per-paycheck amounts alongside the existing total. Note the two
respondents had **different** frequencies from their partners, so this must be per-person,
not a single global setting.

Would touch: `lib/calculator/types.ts` (new field on `CalculatorFormState`), a pure
conversion helper in `compute.ts`, `income-section.tsx` (new input), and
`summary-card.tsx` / `breakdown-card.tsx` (new display line). No auth or backend.

### The tension to resolve first

This adds a field to a form whose most-praised quality is that it is fast and simple. The
same survey that requests it also contains the strongest praise for its simplicity. If we
build it, it should be **progressive** — invisible until asked for (e.g. revealed on the
results screen rather than added to the input form), so the default path stays exactly as
quick as it is today.

Effort: medium. Worth a proper design pass before any code, per the "ask before proceeding"
rule in CLAUDE.md, since it changes core calculator scope.

---

## Deliberately rejected

| Item | Why |
|---|---|
| Changing the homepage `<title>` (85 chars, truncates) | We rank #1 for brand at 74.7% CTR. Google rewrites titles routinely. Unquantifiable gain, real risk on our best asset. |
| De-duplicating headings shared by `/` and `/faq` | Genuine verbatim overlap exists, but this content was just restored to recover rankings (`cc66266`). Any dedup must be an isolated, monitored experiment — never bundled into a general pass. |
| Generic arithmetic long-tail ("how to split 60 dollars") | ~78 queries, 731 impressions, 0.82% CTR. Homework/solver intent, not our product. |
| Splitwise-branded queries | 11 queries, 65 impressions, 0 clicks. Too little volume to justify competing on a competitor's brand. |
| Landlord / tenant framing | Negligible volume; would dilute couples positioning. |
| Expanding `keywords` meta as a tactic | Terms already sitting in the JSON-LD `keywords` array (e.g. "splitter", "equitable") still underperform. The field carries negligible modern weight — visible copy is what moved. |

---

## Known data limitation

The GSC export has **no page-URL dimension**, only query-level aggregates. We cannot confirm
whether `/` or `/faq` is the ranking URL for any given query, so every "which page ranks for
this" statement is inference from content matching. Re-pulling the export with the Page
dimension would sharpen every recommendation here — worth doing before committing to
Proposal 1.

## Suggested measurement checkpoint

> **Superseded — see `2026-08-20-addendum-16-month-data.md`.** The baselines below come from
> a 90-day GA4-sourced sample. Full 16-month Search Console data arrived the same day and is
> substantially larger (e.g. `how to split household bills fairly` is 4,002 impressions over
> 16 months, not 411). Use the addendum's baselines. The addendum also establishes that the
> February incident recovery is only **partial** — clicks are still 15–21% below pre-incident
> — and that `/faq` earns 2 organic clicks in 16 months, which changes where content should
> live. The proposals above stand; their supporting figures are conservative.

Re-pull the GSC query export around **2026-10-01** (~6 weeks after `ccf7252`) and check
movement on the four terms the shipped copy targets:

| Query | Baseline impressions | Baseline CTR | Baseline position |
|---|---|---|---|
| split bill calculator | 1,851 | 3.08% | 7.58 |
| split household bills fairly | 411 | 0.00% | 10.95 |
| bill splitter | 844 | 6.99% | 7.89 |
| 60/40 split money calculator | 231 | 1.30% | 6.26 |

Also confirm the head terms are unmoved — `fair share calculator` (pos 1.00),
`rent split calculator based on income` (pos 2.34), `bill split calculator` (pos 5.47).
Those are the canaries; any adverse movement there is the signal to revert.
