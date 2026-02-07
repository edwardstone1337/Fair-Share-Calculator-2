# Calculator Error Truncation & Copy Refresh

**Type:** Bug + Improvement  
**Priority:** Normal  
**Effort:** Medium  
**Created:** 2025-02-07

---

## TL;DR

Validation errors on the calculator are cut off (e.g. "Please enter a valid salary amount" shows half the "n" and no "t") because `ErrorMessage` uses fixed height, `overflow: hidden`, and `whiteSpace: nowrap`. Separately, error copy should be refreshed to match the FAQ’s warm, conversational tone.

---

## Current State vs Expected

| Aspect | Current | Expected |
|--------|---------|----------|
| **Display** | Fixed 16px height, `overflow: hidden`, `whiteSpace: nowrap` — text truncated on one line | Errors wrap onto multiple lines and remain fully readable |
| **Copy** | "Please enter a valid salary amount", "Please enter at least one expense amount to calculate", etc. — neutral, generic | Warm, conversational copy that aligns with FAQ tone (second person, helpful, couples-focused) |

---

## Root Cause

`components/ui/error-message.tsx`:

```tsx
style={{
  height: "var(--space-4)",        // 16px — too short for full message
  overflow: "hidden",              // clips overflowing text
  whiteSpace: "nowrap",            // prevents wrapping
  // ...
}}
```

This was likely intentional to reserve a fixed error slot (avoid layout shift), but it trims messages that exceed the box.

---

## Relevant Files

| File | Role |
|------|------|
| `components/ui/error-message.tsx` | Fix truncation: allow wrapping, remove/min height, or use `min-height` with `overflow: visible` |
| `lib/calculator/validation.ts` | Update error messages to match brand tone |
| `components/calculator/income-section.tsx` | Uses ErrorMessage for salary errors |
| `components/calculator/expenses-section.tsx` | Uses ErrorMessage for global expense error |
| `components/calculator/expense-row.tsx` | Uses ErrorMessage for per-row expense errors |
| `components/calculator/names-section.tsx` | Uses ErrorMessage for name length errors |

---

## Copy Direction (FAQ Tone Reference)

FAQ copy is:
- Second person ("you", "your")
- Conversational, not stiff
- Concrete (e.g. "£3,500/month", "£1,200 rent")
- Couples-focused
- Helpful rather than punitive

**Example rewrites (for discussion):**

| Current | Possible alternative |
|---------|----------------------|
| "Please enter a valid salary amount" | "Enter a valid amount (e.g. 45000 or 4,500)" |
| "Please enter a valid expense amount" | "Enter a valid amount for this expense" |
| "Please enter at least one expense amount to calculate" | "Add at least one expense to see your split" |
| "Name must be 50 characters or less" | "Keep the name to 50 characters or fewer" |

---

## Risks & Notes

- **Layout shift**: Allowing wrapping may change form height when errors appear. Consider `min-height` instead of fixed `height` to keep a stable baseline while allowing growth.
- **Accessibility**: Ensure error text remains readable and doesn’t cause awkward line breaks (e.g. very long single words).
- **Testing**: Check Income (salary), Expenses (global + per-row), and Names (length) on narrow viewports and desktop.

---

## Acceptance Criteria

- [ ] All validation errors display in full (no truncation)
- [ ] Errors wrap when necessary on narrow screens
- [ ] Error copy updated to align with FAQ tone
- [ ] No regressions to layout or keyboard/screen-reader behaviour
