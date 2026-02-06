# System Architecture

## Overview

Fair Share Calculator is an income-based bill split calculator for couples and roommates. This codebase is the V2 rebuild: Next.js (App Router) + TypeScript + Tailwind, with the calculator ported and localStorage persistence. Auth, Supabase, and saved configurations are planned (see `SYSTEM-ARCHITECTURE.md`).

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Framework** | Next.js 15.5.x (App Router); keep on patched line for security |
| **Language** | TypeScript (strict) |
| **Styling** | Tailwind CSS v4 + CSS variables in `app/globals.css` |
| **State** | React (useReducer in `useCalculator`) — no external state library |
| **Persistence** | localStorage only (anonymous; Supabase planned) |

## Data Model (Current)

No database yet. In-memory + localStorage:

- **Calculator form state** — `CalculatorFormState` in `lib/calculator/types.ts`: person names, salaries (strings), expenses array, step (`input` | `results`), validation errors.
- **Saved form data** — `SavedFormData`: names, salary strings, expenses (amount + label), optional `currency` (ISO code). Stored under key `fairshare_form`. V1 backward compat: also reads legacy keys `name1`, `name2`, `salary1`, `salary2`, `expenses`.
- **Currency** — Not in form state. Held in React context (`CurrencyProvider`); persisted in `fairshare_currency` and optionally in `fairshare_form.currency`. Share state and URL params include `currency` for restore.

## Request Flow

- **`/`** — Root layout wraps with `CurrencyProvider` and renders sticky `NavBar` (logo, currency selector). Server-rendered calculator page (H1, `CalculatorClient`, FAQ, JSON-LD). Client: `CalculatorClient` uses `useCalculator()` and `useCurrency()`; reducer + localStorage restore on mount; currency from context, persisted in `fairshare_currency`. URL hash (`#results`, `#input`) syncs step; URL params (`?id=`, `name1`, `salary1`, `currency`, etc.) restore share links.
- **Calculation** — Pure sync flow: `validateForm(state)` → `calculateShares(...)` in `lib/calculator/compute.ts`. No server round-trip.
- **Share** — `shareViaBackend(state)` POSTs to Cloudflare Worker; returns short URL `?id=...`. Fallback: `buildLegacyShareUrl()` query-param URL. Load: `loadFromShareId(id)` GET fetches share by ID.

## Design System

- **Tokens** — Three layers in `app/globals.css`: Layer 1 `@theme` (primitives), Layer 2 `:root` (semantic), Layer 3 component tokens (including `--nav-*`, `--currency-selector-*`). 8px spacing grid.
- **Components** — Layout: `NavBar` in `components/nav/` (sticky nav, logo, `CurrencySelector`). Atoms in `components/ui/` (Button, Card, Input, Label, ErrorMessage, SectionHeader, Snackbar, CurrencySelector). Calculator organisms in `components/calculator/` (IncomeSection, ExpensesSection, NamesSection, CalculatorClient, ResultsView, SummaryCard, BreakdownCard, ExplanationCard, ResultsFooter). FAQ: `FaqSection`.
- **Rule** — No magic numbers in components; use CSS variables. Tailwind for layout (flex, grid); tokens for color, typography, spacing, radius.

## Key Files

| Path | Purpose |
|------|---------|
| `app/(calculator)/page.tsx` | Calculator page: header, H1, `CalculatorClient`, `FaqSection`, JSON-LD |
| `app/layout.tsx` | Root layout: CurrencyProvider, NavBar, fonts, metadata, canonical, OG, GA4/Hotjar/Clarity/AdSense scripts |
| `app/sitemap.ts` | Dynamic sitemap (single URL, monthly, priority 1.0) |
| `app/globals.css` | Design tokens (all 3 layers) |
| `lib/calculator/compute.ts` | Pure calculation + parse + formatCurrency(num, symbol) |
| `lib/calculator/validation.ts` | validateForm (salaries, expenses, names) |
| `lib/calculator/types.ts` | Form state, result, validation types |
| `lib/hooks/use-calculator.ts` | Reducer, localStorage, calculate(), getError/hasError, onDataRestored option |
| `lib/hooks/use-input-tracking.ts` | Per-field analytics: input_started, input_completed, validation_error; prefilled opt-out |
| `lib/analytics/gtag.ts` | trackEvent, bucketExpenseAmount, bucketSplitRatio; GA4 wrapper |
| `components/calculator/calculator-client.tsx` | Orchestrates sections, step (input vs results), URL hash/params, share, snackbar, analytics events |
| `lib/calculator/share.ts` | shareViaBackend, buildLegacyShareUrl, loadFromShareId (Cloudflare Worker); ShareState includes optional currency |
| `lib/contexts/currency-context.tsx` | CurrencyProvider, useCurrency(); persist fairshare_currency; locale detection fallback |
| `lib/constants/currencies.ts` | CURRENCIES list, DEFAULT_CURRENCY, detectCurrencyFromLocale, getCurrencyByCode |
| `components/nav/nav-bar.tsx` | Sticky nav: logo link, CurrencySelector |

## Authentication & Backend

Not implemented yet. No Supabase client in app code; `lib/env.ts` and `lib/supabase/` are placeholders for later phases. See `SYSTEM-ARCHITECTURE.md` for schema, RLS, and auth flow.

## Dependencies & External Services

- **Cloudflare Worker** — Share backend: `POST /share` (store state, return id), `GET /share/:id` (fetch state). Read-only share links; no auth.
- **Vercel** — Hosting (planned; auto-deploy from `main`).
- **Supabase** — Planned (PostgreSQL, Auth, RLS).
- **Analytics / Ads** — GA4 (G-TQZ0HGB3MT), Hotjar (hjid 4934822), Microsoft Clarity (kyx62gpbw4), Google AdSense (ca-pub-4075743460011014). Scripts in root layout via Next.js `Script` (strategy `afterInteractive`). Events via `lib/analytics/gtag.ts`; silent no-op if gtag unavailable.

## Deployment

Current: local dev (`next dev`). Production deployment and DNS strategy described in `SYSTEM-ARCHITECTURE.md`.
