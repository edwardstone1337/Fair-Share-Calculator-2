# Code Conventions

## File Structure

```
app/
  (calculator)/page.tsx     # Calculator page (SSR shell + client calculator + FAQ)
  layout.tsx                # Root layout, metadata, fonts
  globals.css               # All design tokens (Layer 1–3)

components/
  ui/                       # Atoms: Button, Card, Input, Label, ErrorMessage, SectionHeader, Snackbar
  calculator/               # Calculator organisms: IncomeSection, ExpensesSection, NamesSection, CalculatorClient,
                            # ExpenseRow, ResultsView, SummaryCard, BreakdownCard, ExplanationCard, ResultsFooter
  faq-section.tsx           # FAQ accordion (below calculator)

lib/
  calculator/               # compute.ts, types.ts, validation.ts (pure, no React)
  hooks/                    # use-calculator.ts (reducer + localStorage)
  utils/                    # cn.ts, format.ts (formatWithCommas, sanitizeInput), logger.ts
  env.ts                    # getServerEnv (Supabase env; optional until Phase 5)
  analytics/                # Placeholder
  constants/                # Placeholder
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

## State & Data Flow

- Calculator: single source of truth in `useCalculator` (reducer state). Dispatch actions; no direct localStorage in UI.
- Validation: run at Calculate time; errors stored in state and read via `getError(field)` / `hasError(field)`.

## Error Handling

- Validation: return `ValidationResult` with `errors` array; UI shows per-field messages.
- localStorage: save/load in hook; failures are silent (no user-facing error for full/disabled storage).

## New Features

- New UI token → add to Layer 3 (or Layer 2) in `globals.css`, then use in component.
- New calculator rule → update `validation.ts` and document in API_REFERENCE.md.
- New route → add under `app/` and document in ARCHITECTURE.md (and SYSTEM-ARCHITECTURE.md if part of V2 plan).
