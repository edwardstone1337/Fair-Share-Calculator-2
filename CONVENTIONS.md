# Code Conventions

## File Structure

```
app/
  (calculator)/page.tsx     # Calculator page (SSR shell + client calculator + FAQ)
  layout.tsx                # Root layout, metadata, fonts, analytics scripts
  sitemap.ts                # Dynamic sitemap (MetadataRoute.Sitemap)
  globals.css               # All design tokens (Layer 1–3)

components/
  nav/                      # NavBar (sticky nav, logo, CurrencySelector)
  ui/                       # Atoms: Button, Card, Input, Label, ErrorMessage, SectionHeader, Snackbar, CurrencySelector, Icon, IconButton. Molecules: FormField (label + Input + ErrorMessage; prefix, labelSuffix)
  calculator/               # Calculator organisms: IncomeSection, ExpensesSection, NamesSection, CalculatorClient,
                            # ExpenseRow, ResultsView, SummaryCard, BreakdownCard, ExplanationCard, ResultsFooter
  faq-section.tsx           # FAQ accordion (below calculator)

lib/
  calculator/               # compute.ts, types.ts, validation.ts (pure, no React)
  constants/                # currencies.ts (CURRENCIES, detectCurrencyFromLocale, getCurrencyByCode)
  contexts/                 # currency-context.tsx (CurrencyProvider, useCurrency)
  hooks/                    # use-calculator.ts, use-input-tracking.ts
  utils/                    # cn.ts, format.ts (formatWithCommas, sanitizeInput), logger.ts
  env.ts                    # getServerEnv (Supabase env; optional until Phase 5)
  analytics/                # gtag.ts (trackEvent, bucketExpenseAmount, bucketSplitRatio)
  supabase/                 # Placeholder
```

## Naming

- **Components**: PascalCase (`CalculatorClient`, `IncomeSection`).
- **Hooks**: `use` prefix, camelCase (`useCalculator`).
- **Utilities**: camelCase (`formatWithCommas`, `sanitizeInput`).
- **Reducer actions**: UPPER_SNAKE (`SET_PERSON1_SALARY`, `ADD_EXPENSE`).
- **CSS variables**: kebab-case in `globals.css` (`--text-primary`, `--card-gap`).
- **Files**: kebab-case for multi-word components (`calculator-client.tsx`, `section-header.tsx`).

## TypeScript

- Strict mode. No `any`; use `unknown` if needed.
- Prefer interfaces for object shapes. Export types from `lib/calculator/types.ts` for shared use.
- Server-only code (e.g. env) can use `getServerEnv()`; do not expose secrets to client.

## Styling

- **Tokens only**: Use CSS variables for color, spacing, typography, radius, shadow. No magic numbers in components.
- **Tailwind**: Use for layout (flex, grid, gap, display). Do not use Tailwind for colors/fonts that have tokens.
- **Inline styles**: Acceptable for one-off token references (e.g. `style={{ gap: "var(--space-4)" }}`) when Tailwind doesn’t map to a token.

## Components

- **Default**: Server Components. Use `"use client"` only when needed (state, hooks, event handlers).
- **Calculator**: Client boundary at `CalculatorClient`; sections are client components that receive props and callbacks.
- **Props**: Explicit interfaces (e.g. `IncomeSectionProps`); no inline only types for public components.
- **Form fields**: Use `FormField` for label + input + error when layout is standard; use `Input` with `prefix` for currency-prefixed fields. Icon-only actions: use `IconButton` with required `aria-label`.

## State & Data Flow

- Calculator: single source of truth in `useCalculator` (reducer state). Dispatch actions; no direct localStorage in UI.
- Currency: global UI preference in React context (`useCurrency`), not in calculator reducer. Persisted in `fairshare_currency` (and optionally in `fairshare_form.currency`). Share links and URL params carry currency; restore via `setCurrency(code)` when loading share.
- Validation: run at Calculate time; errors stored in state and read via `getError(field)` / `hasError(field)`.
- Prefilled: when state is restored (localStorage or share link), parent sets `dataRestored` and passes `prefilledSalaries` / `prefilledNames` / `prefilledExpenses` to sections so `useInputTracking` does not fire `input_started` for pre-filled fields.

## Error Handling

- Validation: return `ValidationResult` with `errors` array; UI shows per-field messages.
- localStorage: save/load in hook; failures are silent (no user-facing error for full/disabled storage).

## Analytics

- All GA4 events via `trackEvent(eventName, params)` from `lib/analytics/gtag.ts`. Never throw; no-op if gtag missing.
- New form sections with inputs: use `useInputTracking` and accept a `prefilled*` prop when data can be restored; pass to hook so restored data doesn’t fire `input_started`.

## New Features

- New UI token → add to Layer 3 (or Layer 2) in `globals.css`, then use in component.
- New calculator rule → update `validation.ts` and document in API_REFERENCE.md.
- New route → add under `app/` and document in ARCHITECTURE.md (and SYSTEM-ARCHITECTURE.md if part of V2 plan).
- New analytics event → use `trackEvent()`; document event name and params in API_REFERENCE or ARCHITECTURE if significant.
