# Addendum — 16-Month GSC + GA4 Findings (2026-08-20)

Companion to `2026-08-20-growth-proposals.md`. Written after receiving the full Search
Console 16-month export (2025-04-18 → 2026-08-17), the Coverage export, and the GA4 events
export (2026-01-01 → 2026-08-20). Several figures in the original doc were based on a
90-day GA4-sourced sample and are **corrected here**.

---

## 1. The February incident, reconstructed from data

Previously we only had the git history. The daily series now gives the full shape.

| Metric | Value |
|---|---|
| Peak month | **2026-01: 4,002 clicks / 47,751 impressions** (all-time best) |
| Deploy of `0bed004` (FAQ deleted from homepage) | 2026-02-07 (Sat) |
| Last normal day | 2026-02-09 — 103 clicks, position 6.6 |
| **Crash onset** | **2026-02-10 — 17 clicks, position 15.2** (−83% in one day) |
| Trough | 2026-02-14 — **8 clicks**, 104 impressions, position 16.7 |
| 7-day rolling drop | **−88.3% clicks, −88.1% impressions** |
| Feb 2026 vs Jan 2026 | −59.9% clicks, −63.9% impressions |
| Recovery began | 2026-02-27, ~4 days after the exact-text restore |

**The decline did not begin before the deploy.** January was the site's best month ever and
was still accelerating; 1–6 February tracked close to the January daily average. The
discontinuity is a single step between 9 and 10 February — a 3-day lag after a Saturday
deploy, consistent with normal recrawl timing. Position independently corroborates it
(6.6 → 15.2 overnight).

### The natural experiment that proves the cause

This is the most important finding in the dataset:

- **2026-02-16** — `06f8eea` restored *paraphrased* FAQ content to the homepage.
  **No recovery.** Clicks that week: 166, the worst of the whole incident.
- **2026-02-23** — `cc66266` restored the *exact original V1 text*.
  **Recovery began 4 days later**, on 2026-02-27, and was sustained.

A generic algorithm update cannot distinguish paraphrased from verbatim content on a
schedule that matches specific commits. Combined with the fact that the homepage never lost
impressions entirely (a relevance re-scoring, not a deindexing or manual action), the
evidence for content removal as the cause is about as strong as observational data gets.

### Recovery is partial — the site is still depressed

Recent windows vs. the equivalent-length pre-incident windows (ending 2026-02-09):

| Window | Clicks now | Clicks before | Change | Position now | Position before |
|---|---:|---:|---:|---:|---:|
| 30 days | 3,151 | 3,722 | **−15.3%** | 7.74 | 7.34 |
| 60 days | 5,841 | 7,095 | **−17.7%** | 7.71 | 7.01 |
| 90 days | 8,171 | 10,367 | **−21.2%** | 7.88 | 6.88 |

Six months on, clicks remain **15–21% below** pre-incident and average position is roughly
**one full rank worse**. No week since has matched the January peak weeks (850–1,018
clicks); the best post-recovery week is 822.

Impressions, by contrast, have fully recovered and are ahead in the 30-day window (+23.3%).
So the site is being *shown* as much as before but *clicked* less — CTR is ~6–7% against
~8–9% pre-incident.

**Interpretation:** most of that CTR gap is mechanically explained by the one-rank position
decline plus a broader, lower-intent impression base, not by a snippet or title defect. This
is the main reason the recommendation against touching the homepage title still stands —
the fix for CTR here is recovering position, not rewriting the tag.

---

## 2. `/faq` earns essentially nothing from search

Over the full 16 months:

| Page | Clicks | Impressions | CTR | Position |
|---|---:|---:|---:|---:|
| `/` | 43,578 | 572,666 | 7.61% | 8.67 |
| `/faq` | **2** | 527 | 0.38% | 9.05 |

The homepage carries **99.995% of clicks**. `/faq` carries 0.005%.

GA4 gives the other half of the picture: at least **59 distinct users** reached `/faq` via
internal navigation in 7.6 months (a hard lower bound, from `faq_cta_clicked`). So `/faq` is
a resource for people already on the site — not an acquisition channel.

**Conclusions:**

- The load-bearing SEO asset is the homepage, and only the homepage. Content that needs to
  rank belongs there.
- **Do not delete `/faq`.** It costs nothing, serves internal users, and any content shuffle
  is precisely the class of change that caused the incident. The lesson from February is
  "don't remove ranking content from the page that ranks" — not "don't have a FAQ route."
- Conversely, because `/faq` earns nothing from search, edits to it carry near-zero SEO risk.
  It is the safe place to experiment; `/` is not.

### No rich results, ever

`Search appearance.csv` contains **zero data rows across all 16 months**. The site has never
recorded a rich result of any type. Our `FAQPage` JSON-LD has never produced one — consistent
with Google's 2023 restriction of FAQ rich results to authoritative government and health
sites.

Keep the markup (harmless, and removal is risk), but do not expect anything from it, and do
not justify future work on the promise of rich results. This also further weakens the case
for `AggregateRating` markup discussed in the main doc.

---

## 3. Corrected opportunity figures

The original doc's numbers came from a 90-day sample. The 16-month figures are substantially
larger:

| Query | 90-day impressions | **16-month impressions** | 16-month clicks | Position |
|---|---:|---:|---:|---:|
| how to split household bills fairly | 411 | **4,002** | **0** | 9.75 |
| split bill calculator | 1,851 | **11,184** | 361 | 7.11 |
| bill splitter | 844 | **3,407** | 136 | 8.76 |
| split calculator | 138 | **3,106** | 20 | 14.56 |
| split money calculator | 328 | **2,220** | 18 | 10.81 |
| money split calculator | 163 | **1,781** | 31 | 10.45 |
| split bill online calculator | 217 | **1,901** | 33 | 11.48 |
| split expenses calculator | — | **1,591** | 33 | 9.83 |
| 60/40 split calculator | 87 | **1,100** | 16 | 7.08 |

**`how to split household bills fairly` is the single best target on the site**: 4,002
impressions — the 7th-highest impression query overall — and **zero clicks in 16 months** at
position 9.75. The shipped copy change (`8a53481`) added that exact phrase to the homepage.
If any single change in this work pays off, it should be this one.

**The money cluster is roughly 6× larger than the 90-day sample suggested.** The generic
split/money terms above total **~12,000 impressions for ~136 clicks**. That materially
strengthens the case for Proposal 1, though the doorway-page caution in the main doc stands
unchanged — the page still has to earn its existence through the ratio-first input, not
keyword substitution.

---

## 4. Audience shape

**Devices** — mobile dominates, and ranks far better:

| Device | Clicks | Impressions | CTR | Position |
|---|---:|---:|---:|---:|
| Mobile | 29,529 | 303,335 | 9.73% | **6.24** |
| Desktop | 13,854 | 265,683 | 5.21% | **11.48** |
| Tablet | 197 | 4,150 | 4.75% | 6.27 |

Mobile is 67.8% of clicks and ranks **five positions better** than desktop with nearly double
the CTR. Any future work should be judged mobile-first. The desktop gap is unexplained and
worth its own investigation.

**Countries** — US + UK + Canada + Australia = 88% of clicks. The UK converts far above its
impression share (15.68% CTR vs the US's 6.04%) despite similar average position.

---

## 5. Indexing

Coverage shows **2 pages indexed, 12–15 not indexed**. Issue breakdown: page with redirect
(6), alternate page with proper canonical (5), discovered–not indexed (2), crawled–not
indexed (1). No non-critical issues.

Two caveats: the Coverage export only spans 2026-05-22 → 2026-08-17, so it **cannot** be used
to check correlation with the February incident; and it has no per-URL breakdown, so we
can't confirm which pages sit in each bucket. `/privacy` and `/terms` are plausible
candidates for the not-indexed set — worth checking directly in GSC's page-level report,
though neither matters commercially.

Importantly: no evidence of manual action or deindexing at any point. The homepage kept
appearing in impressions throughout the crash.

---

## 6. Funnel (GA4, 2026-01-01 → 2026-08-20)

| Step | Users | % of visitors |
|---|---:|---:|
| Visit | 23,783 | 100% |
| Starts entering data | 14,175 | 59.6% |
| Attempts calculation | 13,432 | 56.5% |
| **Sees a result** | **13,177** | **55.4%** |

**55.4% of arrivals complete a calculation**, and 93% of those who start typing reach a
result. The product converts well; the single largest leak is that **40.4% of visitors
(9,608 people) never touch an input field**.

That reframes priorities: every survey-driven feature in the main doc serves the 55% who
already succeed. None of them address the 40% who never start. If the goal is measurable
growth, that first-touch drop-off is the largest single opportunity on the site — and Hotjar
recordings are already wired in to diagnose it.

Other notable figures:

- `salary_toggle` is used by **78.6% of everyone who completes a calculation** (10,352 users).
  Near-universal; protect it in any redesign. It is undocumented in `API_REFERENCE.md`.
- `feedback_clicked`: **12 clicks** against 13,177 results-viewers (0.09%). The 51 survey
  responses come from the auto-triggered Hotjar widget, not our in-app button. Don't invest
  further in in-app feedback UI on the assumption it is working.
- `share_results`: exactly **60 events / 44 users**, matching `DECISION_LOG.md` to the digit —
  independent confirmation the removal decision used accurate data.
- `validation_error` (9.8% of attempts) spans the 2026-02-07 blur→submit change and is
  **contaminated**. Re-pull with a date filter starting 2026-02-07 before using it.
- Tracking integrity is sound: paired events firing in the same handler differ by 0.03–0.5%.

---

## 7. Revised measurement checkpoint

> **To actually run the check, use `MEASUREMENT-CHECKPOINT-seo-2026-08.md`.** It is
> self-contained: deploy-date recovery, re-pull instructions, pre-registered success criteria,
> and the recovery confound. The baselines below are reproduced there.

Re-pull the GSC export around **2026-10-01** (~6 weeks after `8a53481`). Use 16-month
baselines, not the 90-day figures:

**Targets of the shipped change:**

| Query | Baseline impressions | Baseline clicks | Baseline position |
|---|---:|---:|---:|
| how to split household bills fairly | 4,002 | **0** | 9.75 |
| split bill calculator | 11,184 | 361 | 7.11 |
| bill splitter | 3,407 | 136 | 8.76 |
| 60/40 split calculator | 1,100 | 16 | 7.08 |

**Canaries — any adverse movement here is the signal to revert:**

| Query | Clicks | Position |
|---|---:|---:|
| fair share calculator | 1,881 | 1.10 |
| bill split calculator | 986 | 5.50 |
| rent split calculator based on income | 970 | 3.54 |
| how to split bills with spouse calculator | 799 | 1.86 |

**Site-level recovery tracking** (the open question): 90-day clicks are currently −21.2% vs
pre-incident with position 7.88 vs 6.88. Track whether that gap closes. If it doesn't
by year end, the residual loss should be treated as a separate investigation rather than
assumed to be still-in-progress recovery.

---

## 8. Data gaps still open

- **No query × page breakdown.** Largely moot now — `/faq` earns 2 clicks, so effectively
  every query in any export belongs to the homepage.
- **16-month `Queries.csv` is capped at 1,000 rows**, covering only 36.7% of clicks and 35.6%
  of impressions. The genuine long tail is invisible; the money-cluster figures above are
  therefore a *floor*, not a ceiling.
- **No date-segmented GA4 export**, so the V1→V2 instrumentation cutover (2026-02-07) can't be
  separated out of `validation_error`.
- **No session-level GA4 join**, so the funnel above is a user-count proxy, not a true
  sequential funnel. A Funnel Exploration or BigQuery export would confirm it.
