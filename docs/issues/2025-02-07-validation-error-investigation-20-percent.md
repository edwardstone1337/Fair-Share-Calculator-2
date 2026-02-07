# 20% Validation Error Rate — Investigation & Mitigation

**Type:** Improvement / Exploration  
**Priority:** High  
**Effort:** Medium  
**Created:** 2025-02-07

---

## TL;DR

18.4% of users (761 of 4,134) hit at least one validation error. GA data shows **missing** (salary/field left empty) drives ~82% of events. We should dig into which validations cause the most friction, test whether input order is a factor, and run a future exploration to reduce the error rate.

---

## Resolution (2025-02-07)

- **validation_error** GA events now fire only on Calculate attempt, not on blur. Historical data before 2025-02-07 is blur-time noise and not comparable.
- **empty_expense_with_label** confirmed dead — no code path exists. The 228 historical events are legacy; this error type will not appear in future data.
- New **validation_error** parameters: `error_count`, `error_fields` (comma-separated field IDs), `error_types` (comma-separated unique types), `returning_user`.
- Real blocker rate estimated at **~1.3%** (27 of 2,093 calculate attempts failed), down from the misleading 18.4% blur-noise figure.
- **Next step:** review one week of post-deploy data to confirm real error rate and identify top failing fields.

---

## Current State vs Expected

| Aspect | Current | Expected |
|--------|---------|----------|
| **Error rate** | 18.4% of users get validation_error | Lower friction; fewer users blocked before calculating |
| **Visibility** | We know error_type breakdown in GA | Clear action plan: which validations to fix first, UX changes (order, copy, guidance) |
| **Input order** | Income → Expenses → Names → Calculate | Possibly suboptimal; users may enter expenses before salaries, or leave salaries for last |

---

## GA Data Summary

### validation_error event

| Metric | Value |
|--------|-------|
| Events | 1,467 |
| Unique users | 761 (18.41% of 4,134) |
| Events per user | ~1.93 |

### error_type breakdown (custom parameter)

| error_type | Event count | Users | % of events |
|------------|-------------|-------|-------------|
| **missing** | 1,200 | 661 | **82%** |
| empty_expense_with_label | 228 | 121 | 16% |
| invalid_format | 77 | 58 | 5% |
| too_large | 2 | 2 | <1% |

*Note: This data reflects blur-time tracking (pre 2025-02-07). See Resolution section above.*

---

## Mapping error_type → Code

- **missing** — `use-input-tracking.ts` onBlur: salary field left empty. Dominant driver.
- **empty_expense_with_label** — Likely legacy; label-only expense rows no longer show per-row errors (CHANGELOG). If still firing, needs audit.
- **invalid_format** — salary or expense_amount with non-numeric or ≤0 value on blur.
- **too_large** — value > 999,999,999 (negligible).

### Where validation_error is fired

- `lib/hooks/use-input-tracking.ts`: `validation_error` on blur for `salary` and `expense_amount` fields only.
- `components/calculator/calculator-client.tsx`: `calculate_attempt` (status `error`) with `error_type`: `missing_expense`, `missing_salary`, or generic — separate from `validation_error`.

---

## Hypotheses to Test

1. **Input order** — Users may fill Expenses first (e.g. rent) and leave Salaries for last, then hit Calculate. Order might cause "missing" salary errors.
2. **Salaries-first friction** — Income section appears first; users may not realise both salaries are required, or may intend to return and forget.
3. **Blur vs Submit** — Most validation_error comes from blur (use-input-tracking). Users might fix errors before clicking Calculate, but the 18.4% figure suggests many don't reach Calculate successfully.
4. **Copy / guidance** — Current copy may not make required fields clear enough; see related issue `2025-02-07-calculator-error-truncation-and-copy.md`.

---

## Relevant Files

| File | Role |
|------|------|
| `lib/hooks/use-input-tracking.ts` | Fires validation_error on blur; error_type logic |
| `lib/calculator/validation.ts` | Form validation rules; no analytics here |
| `components/calculator/calculator-client.tsx` | calculate_attempt (error_type: missing_expense, missing_salary) |
| `components/calculator/income-section.tsx` | Salary inputs; ordering and labels |
| `components/calculator/expenses-section.tsx` | Expense inputs; ordering |
| `docs/issues/2025-02-07-calculator-error-truncation-and-copy.md` | Error display + copy refresh |

---

## Proposed Next Steps

1. **Data** — Cross-tab GA: validation_error by `field_id` (person1Salary vs person2Salary) to see if one salary is missed more often. → **Superseded** — new submit-time tracking provides field-level detail directly (`error_fields`, `error_types`).
2. **Exploration** — A/B test: reorder sections (e.g. Expenses before Income) or add inline hints ("Both salaries required") to see impact on validation_error rate. → **Deferred** — reassess after reviewing post-deploy data.
3. **Copy** — Align error messages with FAQ tone and clarity (see error truncation issue). → **Unchanged** — still relevant.
4. **Audit** — Confirm whether `empty_expense_with_label` is still emitted; remove or update if legacy. → **Done** — confirmed dead, no code path exists.

---

## Risks & Notes

- Changing input order could affect SEO / content flow; keep semantics consistent.
- Reducing validation_error is good, but avoid hiding real validation needs — focus on guidance and order rather than loosening rules.
- 20% is a significant blocker; worth a focused exploration sprint once error truncation and copy are addressed.
