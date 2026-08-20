# Measurement Checkpoint — August 2026 SEO change

**Read this first if you are coming back to check whether the SEO work paid off.**
Self-contained: you should not need to read anything else to run the check.

Related background (optional): `2026-08-20-growth-proposals.md`,
`2026-08-20-addendum-16-month-data.md`.

---

## 1. What changed, and when

**Change:** PR #2, branch `worktree-seo-survey-safe-wins`. Commits `8a53481`, `6a6029c`
(code) plus doc commits.

Three phrases were added to homepage body copy in `components/homepage-faq-section.tsx`,
and one false claim about a removed share feature was reworded. Nothing was deleted; no
heading, title, meta description, canonical, sitemap or route was touched. `/faq` gained an
OG image.

**T=0 (deploy date):** the date PR #2 merged to `main`. Vercel auto-deploys from `main`, so
merge date ≈ deploy date. Recover it with:

```bash
git log --format="%h %ad %s" --date=short --merges main | grep -i "seo-survey-safe-wins"
# or, if squash-merged:
git log --format="%h %ad %s" --date=short main | grep 8a53481
```

**Do not use the commit date (2026-08-20) as T=0** — the work sat on a branch first.

**When to check:** ~6 weeks after T=0 for a first read, ~12 weeks for a confirmed read.
Google needs several weeks to recrawl and let rankings settle; a check at 2 weeks will be
noise.

---

## 2. How to re-pull the data

Google Search Console → [search.google.com/search-console](https://search.google.com/search-console)
→ select the property.

1. **Performance → Search results**
2. Turn on all four metric toggles at the top: Total clicks, Total impressions, Average CTR,
   Average position. (Some default to off, and off means absent from the export.)
3. Date → **Compare** → *Custom* → set the 6 weeks **after** T=0 against the 6 weeks
   **before** T=0. Like-for-like length matters.
4. **Export → Download CSV** — you want the `Queries` and `Dates` files.

If you want the full history again instead, use Date → **Last 16 months** and export
everything (that is how the baselines below were produced).

Optional, GA4 → Reports → Engagement → Landing page / Events → share icon → Download CSV.
(GA4 MCP access was attempted 2026-08-20 and failed with `ACCESS_TOKEN_SCOPE_INSUFFICIENT`
on both the Admin and Data APIs — if that has been re-authorised since, you can pull this
directly instead of exporting.)

---

## 3. Pre-registered criteria — agreed BEFORE seeing results

Written 2026-08-20, deliberately in advance, so the outcome can't be rationalised after the
fact. Judge against these, not against whatever the data happens to show.

### Primary test — the clean one

**`how to split household bills fairly`**

| Baseline (16 months to 2026-08-17) | Value |
|---|---|
| Impressions | 4,002 |
| **Clicks** | **0** |
| Position | 9.75 |

This is the cleanest measurement available on the site: **exactly zero clicks across sixteen
months**, despite being the 7th-largest impression query. The shipped change added that exact
phrase to the homepage.

- **Success:** any sustained non-zero clicks, and/or average position improving to < 9.0.
- **Null:** still ~0 clicks and position unchanged (9.5–10).
- Because the baseline is literally zero, this needs no statistical argument. Clicks appear,
  or they don't.

### Secondary tests

| Query | Impressions | Clicks | CTR | Position | Success looks like |
|---|---:|---:|---:|---:|---|
| `split bill calculator` | 11,184 | 361 | 3.23% | 7.11 | CTR moving toward the 9.79% that `bill split calculator` earns from a similar position |
| `bill splitter` | 3,407 | 136 | 3.99% | 8.76 | Position < 8, or CTR > 5% |
| `60/40 split calculator` | 1,100 | 16 | 1.45% | 7.08 | Any meaningful click increase |

### Canaries — the revert signal

If **any** of these degrade materially (position worsening by more than ~1 rank, or clicks
dropping >15% against the pre-deploy window with no other explanation), revert first and
investigate afterwards. These are the terms that pay for the site.

| Query | Clicks (16mo) | Position |
|---|---:|---:|
| `fair share calculator` | 1,881 | 1.10 |
| `bill split calculator` | 986 | 5.50 |
| `rent split calculator based on income` | 970 | 3.54 |
| `how to split bills with spouse calculator` | 799 | 1.86 |

Revert is straightforward: the change is additive, so removing the added sentence and bullet
restores the previous state exactly. The reworded share sentence should **not** be reverted —
it was factually false.

---

## 4. The confound you must control for

**The site was still recovering from the February 2026 incident when this shipped.** As of
2026-08-17, clicks were **15–21% below** equivalent pre-incident windows and average position
was ~1 rank worse (7.88 vs 6.88 at 90 days), six months after the trough.

**Therefore: do not read sitewide traffic growth as evidence this change worked.** Continued
recovery would produce a rise regardless. Any sitewide improvement is ambiguous by
construction.

The only clean reads are:

1. **The primary test above** — a query with a literal zero baseline.
2. **Per-query movement on the four targets**, compared against sitewide movement over the
   same window. If targets rise while the site is flat, that is signal. If targets rise by
   roughly the same proportion as everything else, that is recovery, not this change.

Also note the 16-month `Queries.csv` is capped at 1,000 rows (~37% of clicks), so long-tail
movement will be invisible. And check for a Google core update in the window before
attributing anything.

---

## 5. What to do with each outcome

| Outcome | Interpretation | Next step |
|---|---|---|
| Primary test converts, canaries stable | Additive homepage copy works for this site | Apply the same additive pattern to the next cluster. Strengthens the case that `/faq` content should migrate to `/` |
| Targets move but primary stays at 0 | Partial — phrasing helps ranking but not this query's intent | Look at what actually ranks for that query; it may need a genuine answer section, not a phrase |
| No movement anywhere, canaries stable | The cheap lever doesn't work for these terms | **This is informative, not a failure.** It is the evidence needed to justify Proposal 1 (the ratio-first `/split-money-calculator` page) as necessary rather than optional |
| Canaries degrade | Regression | Revert the additive copy immediately, keep the share reword, investigate |

A null result here is genuinely useful — it converts an open question into a decided one.
Record whichever outcome occurs in `DECISION_LOG.md` either way.

---

## 6. Also worth re-checking at the same time

Independent of this change, these were open as of 2026-08-20:

- **The 40.4% who never start.** 9,608 of 23,783 visitors touched no input field. Largest
  measurable opportunity on the site; no shipped or proposed feature addresses it. Hotjar
  recordings are already wired in.
- **The residual 15–21% post-February gap.** If it hasn't closed by year end, treat it as a
  separate investigation rather than assuming recovery is still in progress.
- **`validation_error`** — re-pull with a date filter starting 2026-02-07. The 9.8% figure
  spans the blur→submit instrumentation change and is contaminated.
- **Desktop ranks 5 positions worse than mobile** (11.48 vs 6.24). Unexplained.
- **Only 2 pages indexed** per the Coverage report. Check the page-level report for which.
