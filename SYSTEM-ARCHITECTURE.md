# Fair Share Calculator V2 — System Architecture

## Overview

Fair Share Calculator is an income-based bill split calculator for couples and roommates. V2 is a ground-up rebuild from vanilla HTML/CSS/JS (GitHub Pages) to Next.js + Supabase (Vercel), adding authentication, saved configurations, and a foundation for premium features — while preserving the existing SEO traffic and user experience exactly.

---

## Tech Stack

### Frontend
| Layer | Technology |
|-------|------------|
| **Framework** | Next.js (App Router) |
| **Language** | TypeScript (strict) |
| **Styling** | Tailwind CSS v4 + CSS Variables (design tokens) |
| **Components** | Custom component library |
| **State** | React state (calculator form) — no external state library |

### Backend
| Layer | Technology |
|-------|------------|
| **Database** | Supabase (PostgreSQL) |
| **Auth** | Supabase Auth (Google OAuth + magic link) |
| **API** | Next.js Server Actions + Route Handlers |
| **RLS** | Row Level Security on all user tables |

### Infrastructure
| Layer | Technology |
|-------|------------|
| **Hosting** | Vercel (auto-deploy from `main`) |
| **Analytics** | GA4 (G-TQZ0HGB3MT), Hotjar (4934822), Microsoft Clarity (kyx62gpbw4) |
| **Ads** | Google AdSense (pub-4075743460011014) |
| **Legacy share links** | Cloudflare Worker (tight-firefly-c0dd.edwardstone1337.workers.dev) — read-only, kept alive indefinitely |
| **Payments** | Stripe (future — not V2 launch scope) |

---

## Design System

### Philosophy

This project uses an atomic design system with a three-layer token hierarchy and five composition layers:

**Token Layers (values):**
1. **Primitives (Layer 1)** — Raw, objective values with no UI meaning. Palette scales, font sizes, spacing scale, radius values, shadows. Extremely stable over time. Defined in `@theme {}` in `globals.css`.
2. **Semantic tokens (Layer 2)** — Intent-based tokens that reference primitives. `text-primary`, `surface-card`, `border-error`, `status-error`. Accessibility, contrast, and theming decisions live here. Defined in `:root {}` in `globals.css`.
3. **Component tokens (Layer 3)** — Scoped to individual components, referencing semantic tokens. `button-bg-default`, `input-border-focus`, `card-padding`. Defined in `:root {}` in `globals.css`.

**Composition Layers (UI):**
4. **Atoms** — Smallest functional UI elements (Button, Input, Card, Label, ErrorMessage). Consume component tokens. Must be usable in isolation, must not assume layout context.
5. **Molecules** — Simple groupings of atoms (SectionHeader, FormField, ExpenseRow). May introduce internal spacing/layout.
6. **Organisms** — Complex reusable sections (IncomeSection, ExpensesSection, ResultsView, SummaryCard, BreakdownCard). Product patterns live here.
7. **Templates** — Layout structure without real content (calculator page layout, dashboard layout).
8. **Pages** — Real data applied to templates. Validation of the system with real content and edge cases.

### Direction of Dependency

- Tokens flow upward: primitives → semantic → component
- Components never define tokens (all tokens live in `globals.css`)
- Atoms never depend on pages
- Pages can change without forcing redesigns of atoms or tokens

### Token Integrity Rules

1. **No magic numbers.** Every colour, spacing, font size, radius, and shadow in a component file must reference a CSS variable.
2. **Layer discipline.** Components reference Layer 3. Layer 3 references Layer 2. Layer 2 references Layer 1.
3. **New component = new component tokens.** Add to Layer 3 in `globals.css` first, then reference in the component.
4. **Tailwind for layout, tokens for design.** Tailwind utilities for flexbox, grid, positioning, display. CSS variables for colours, spacing, typography, borders, shadows.

### 8px Grid

All spacing uses the 8px grid: 0, 2, 4, 8, 12, 16, 20, 24, 28, 32, 40, 48, 64. No spacing value falls off this grid unless there is a documented exception.

---

## Route Architecture

| Route | Purpose | Auth | Rendering |
|-------|---------|------|-----------|
| `/` | Calculator — main landing page, SEO target | Public | SSR shell + client calculator |
| `/login` | Login (Google OAuth + magic link) | Public (redirects if logged in) | Client |
| `/auth/callback` | OAuth/magic-link code exchange | Internal | Route Handler |
| `/auth/error` | Auth error display | Public | Client |
| `/dashboard` | Saved configurations, account settings | **Protected** | SSR + Client |
| `/share/[id]` | Read-only shared results view (V2 share links) | Public | SSR |
| **404** | Not found page | Public | Static |

### SEO-Critical Route: `/`

The root route IS the product. 91% of traffic lands here from organic search. This page must preserve:
- Identical `<title>`, `<meta description>`, `<meta keywords>` to V1
- Same canonical URL: `https://www.fairsharecalculator.com`
- Same structured data (JSON-LD WebApplication schema)
- Same Open Graph / Twitter Card meta
- Same FAQ content (rendered server-side, not hydration-dependent)
- Same H1, H2, H3 hierarchy for crawlers

The calculator form itself is a client component (needs interactivity), but the page shell — header, FAQ section, structured data — is server-rendered HTML.

---

## Database Schema

### Design Principles

- **Household-centric:** Configurations belong to households, not users. Even single users have a household. This future-proofs for linked partner accounts without schema migration.
- **RLS everywhere:** No table is accessible without a policy. Public-read tables (like share_links) have explicit public SELECT policies.
- **UUIDs as primary keys:** Standard Supabase pattern. All FKs cascade on delete.
- **Timestamps on everything:** `created_at` and `updated_at` with triggers.

### Helper Function

```sql
-- Returns all household IDs a user belongs to (used in RLS policies)
CREATE FUNCTION user_household_ids(user_uuid UUID)
RETURNS SETOF UUID
LANGUAGE sql SECURITY DEFINER STABLE
AS $$
  SELECT household_id FROM household_members WHERE user_id = user_uuid;
$$;
```

### Tables

#### `households`

| Column | Type | Notes |
|--------|------|-------|
| `id` | UUID | PK, default `gen_random_uuid()` |
| `name` | TEXT | Nullable (e.g. "Alex & Jordan") |
| `currency` | TEXT | NOT NULL, default `'USD'` |
| `created_at` | TIMESTAMPTZ | default NOW() |
| `updated_at` | TIMESTAMPTZ | default NOW(), trigger-updated |

**RLS:**
- SELECT: `id IN (SELECT user_household_ids(auth.uid()))`
- UPDATE: same (owner check can be added later)
- INSERT: authenticated users only
- DELETE: same as SELECT (owner check later)

---

#### `household_members`

| Column | Type | Notes |
|--------|------|-------|
| `id` | UUID | PK, default `gen_random_uuid()` |
| `household_id` | UUID | FK → `households(id)` ON DELETE CASCADE |
| `user_id` | UUID | FK → `auth.users(id)` ON DELETE CASCADE |
| `role` | TEXT | NOT NULL, CHECK (`role IN ('owner', 'partner')`) |
| `created_at` | TIMESTAMPTZ | default NOW() |
| UNIQUE | (`household_id`, `user_id`) | |

**RLS:**
- SELECT: `household_id IN (SELECT user_household_ids(auth.uid()))`
- INSERT: authenticated (owner-only check added later for invites)
- DELETE: own rows only (`user_id = auth.uid()`)

---

#### `configurations`

| Column | Type | Notes |
|--------|------|-------|
| `id` | UUID | PK, default `gen_random_uuid()` |
| `household_id` | UUID | FK → `households(id)` ON DELETE CASCADE |
| `name` | TEXT | NOT NULL, default `'My Split'` |
| `person_1_name` | TEXT | default `'Person 1'` |
| `person_2_name` | TEXT | default `'Person 2'` |
| `person_1_salary` | NUMERIC | NOT NULL |
| `person_2_salary` | NUMERIC | NOT NULL |
| `currency` | TEXT | NOT NULL, default `'USD'` |
| `created_at` | TIMESTAMPTZ | default NOW() |
| `updated_at` | TIMESTAMPTZ | default NOW(), trigger-updated |

**RLS:**
- ALL: `household_id IN (SELECT user_household_ids(auth.uid()))`

**Constraints:**
- Free tier: max 1 configuration per household (enforced by server action, not DB — keeps schema clean for tier changes)

---

#### `expenses`

| Column | Type | Notes |
|--------|------|-------|
| `id` | UUID | PK, default `gen_random_uuid()` |
| `configuration_id` | UUID | FK → `configurations(id)` ON DELETE CASCADE |
| `amount` | NUMERIC | NOT NULL, CHECK (`amount > 0`) |
| `label` | TEXT | default `'Expense'` |
| `sort_order` | INT | default `0` |
| `created_at` | TIMESTAMPTZ | default NOW() |
| `updated_at` | TIMESTAMPTZ | default NOW(), trigger-updated |

**RLS:**
- ALL: `configuration_id IN (SELECT c.id FROM configurations c WHERE c.household_id IN (SELECT user_household_ids(auth.uid())))`

---

#### `share_links`

| Column | Type | Notes |
|--------|------|-------|
| `id` | TEXT | PK (nanoid short code, e.g. `a1b2c3d4`) |
| `configuration_snapshot` | JSONB | NOT NULL — frozen state at share time |
| `created_by` | UUID | FK → `auth.users(id)` ON DELETE SET NULL, nullable |
| `created_at` | TIMESTAMPTZ | default NOW() |

**RLS:**
- SELECT: public (anyone with the link can view)
- INSERT: authenticated users only

**Snapshot JSONB structure:**
```json
{
  "person_1_name": "Alex",
  "person_2_name": "Jordan",
  "person_1_salary": 60000,
  "person_2_salary": 40000,
  "currency": "USD",
  "expenses": [
    { "amount": 2000, "label": "Rent" },
    { "amount": 150, "label": "Utilities" }
  ]
}
```

---

#### `user_profiles`

| Column | Type | Notes |
|--------|------|-------|
| `id` | UUID | PK, FK → `auth.users(id)` ON DELETE CASCADE |
| `display_name` | TEXT | Nullable |
| `preferred_currency` | TEXT | default `'USD'` |
| `created_at` | TIMESTAMPTZ | default NOW() |
| `updated_at` | TIMESTAMPTZ | default NOW(), trigger-updated |

**RLS:**
- SELECT/UPDATE: `id = auth.uid()`
- INSERT: `id = auth.uid()`

**Trigger:** On `auth.users` INSERT → auto-create `user_profiles` row + `households` row + `household_members` row (role: 'owner').

### RLS Summary

| Table | Select | Insert | Update | Delete |
|-------|--------|--------|--------|--------|
| `households` | Members | Auth | Members | Members |
| `household_members` | Members | Auth | — | Own row |
| `configurations` | Members | Members | Members | Members |
| `expenses` | Members | Members | Members | Members |
| `share_links` | Public | Auth | — | — |
| `user_profiles` | Own | Own | Own | — |

---

## Authentication Flow

### Sign Up / Login

1. User clicks "Sign in" → navigated to `/login`
2. **Google OAuth:** Click "Continue with Google" → `supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: SITE_URL/auth/callback } })`
3. **Magic link:** Enter email → `supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: SITE_URL/auth/callback } })`
4. Callback at `/auth/callback`: Route handler calls `exchangeCodeForSession(code)`, redirects to `/dashboard` (or wherever they came from)
5. On first login: DB trigger auto-creates `user_profiles` + `households` + `household_members`

### Session Management

- Supabase middleware in `middleware.ts` refreshes session on every request
- Protected routes (`/dashboard`) check session server-side; redirect to `/login` if missing
- The calculator page (`/`) never checks auth — it works for everyone

### Post-Login Calculator Flow

- After login, if user has a saved configuration, offer to load it
- If user was using the calculator anonymously (localStorage data exists), offer to save it to their account on first login — "localStorage migration" prompt

---

## Calculator Logic

### Core Computation (Pure TypeScript)

The calculation logic lives in `lib/calculator/compute.ts` as pure functions with no DOM or React dependencies. This is critical — the same logic is used by:
- The client-side calculator form
- Server-side share link rendering
- Future API endpoints

```typescript
interface CalculatorInput {
  person1Salary: number;
  person2Salary: number;
  expenses: { amount: number; label: string }[];
}

interface CalculatorResult {
  person1Share: number;
  person2Share: number;
  person1Percentage: number;
  person2Percentage: number;
  totalExpenses: number;
  expenseBreakdown: {
    label: string;
    amount: number;
    person1Share: number;
    person2Share: number;
  }[];
}

function calculateShares(input: CalculatorInput): CalculatorResult;
```

### Client-Side State

The calculator form uses React state (useState/useReducer). No external state library needed.

**State shape:**
```typescript
interface CalculatorState {
  person1Name: string;
  person2Name: string;
  person1Salary: string; // String for input control
  person2Salary: string;
  expenses: { id: string; amount: string; label: string }[];
  currency: string;
  step: 'input' | 'results';
  errors: Record<string, string>;
}
```

### Persistence

- **Anonymous users:** State saves to localStorage on every input change (same as V1)
- **Logged-in users:** State saves to Supabase via server action on explicit "Save" action. localStorage is still used for instant persistence between page loads; Supabase is the source of truth.

---

## Share Link Compatibility

### Legacy Links (must keep working)

1. **Backend short links:** `fairsharecalculator.com?id=xxx` → V2 detects `?id=` param → fetches from Cloudflare Worker API → pre-fills calculator and auto-calculates
2. **Query param links:** `fairsharecalculator.com?name1=...&salary1=...&expenses=[...]` → V2 parses query params → pre-fills calculator

### V2 Share Links (new)

1. User clicks "Share" → server action creates `share_links` row with snapshot → returns `/share/[id]` URL
2. Recipient opens `/share/[id]` → server-rendered read-only results page
3. "Try with your own numbers" CTA → navigates to `/` (calculator)

For anonymous users who click Share: fall back to the Cloudflare Worker (same as V1) since they can't create share_links rows without auth.

---

## Analytics Migration

All V1 tracking events must fire identically in V2. The tracking helper:

```typescript
// lib/analytics/track.ts
export function trackEvent(eventName: string, params?: Record<string, unknown>) {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('event', eventName, params);
  }
}
```

### Events to preserve (complete list from V1)

| Event | Trigger |
|-------|---------|
| `input_started` | First non-empty input per field per page load |
| `input_completed` | Blur with non-empty changed value |
| `validation_error` | Blur with invalid field |
| `expense_added` | Add expense button clicked |
| `expense_deleted` | Expense row deleted |
| `delete_expense_clicked` | Delete button clicked |
| `add_expense_clicked` | Add expense button clicked |
| `calculate_clicked` | Calculate button clicked |
| `calculate_attempt` | Calculation completes (success/error) |
| `results_viewed` | Results panel shown |
| `share_results` | Share and copy succeeds |
| `salary_toggle` | Show/hide salary |
| `back_to_edit_clicked` | Back to edit from results |
| `data_restored` | Data loaded from localStorage |

### New V2 Events (add after port is verified)

| Event | Trigger |
|-------|---------|
| `sign_up_started` | User clicks Sign In |
| `sign_up_completed` | First successful login |
| `config_saved` | Configuration saved to account |
| `config_loaded` | Saved configuration loaded |
| `currency_changed` | Currency preference changed |
| `localstorage_migrated` | Anonymous data saved to account |

---

## SEO Preservation Checklist

These must be byte-for-byte identical (or improved) in V2:

- [ ] `<title>` tag: "Income-Based Bill Split Calculator - Fair Share Calculator for Bills, Rent & Expenses"
- [ ] `<meta name="description">` content
- [ ] `<meta name="keywords">` content
- [ ] `<link rel="canonical" href="https://www.fairsharecalculator.com">`
- [ ] Open Graph tags (og:title, og:description, og:image, og:url)
- [ ] Twitter Card meta
- [ ] JSON-LD structured data (WebApplication schema)
- [ ] H1: "Income-Based Bill Split Calculator"
- [ ] All FAQ content (H2s, H3s, paragraphs, lists) — server-rendered
- [ ] `/robots.txt` — same content
- [ ] `/sitemap.xml` — same content
- [ ] `/ads.txt` — same content
- [ ] `/google81ca022cf87256b3.html` — Google Search Console verification
- [ ] `<link rel="icon" href="lotus.png">`
- [ ] Same fonts loaded (Josefin Sans, Assistant, Material Symbols)

---

## Currency Support

### Supported Currencies (V2 Launch)

| Code | Symbol | Name |
|------|--------|------|
| USD | $ | US Dollar |
| GBP | £ | British Pound |
| EUR | € | Euro |
| CAD | C$ | Canadian Dollar |
| AUD | A$ | Australian Dollar |

### Behaviour

- **Anonymous users:** Currency selection stored in localStorage. Defaults to USD.
- **Logged-in users:** Currency saved to `user_profiles.preferred_currency`. Overrides localStorage.
- Currency affects display formatting only — the calculation is currency-agnostic (it's just ratios).
- Currency symbol appears in salary inputs, expense inputs, and results display.

---

## File Structure

```
app/
├── (calculator)/
│   ├── page.tsx                  # Main calculator page (SSR shell + client form)
│   └── calculator-client.tsx     # Client component: full calculator experience
├── (auth)/
│   ├── login/
│   │   ├── page.tsx              # Login page
│   │   └── login-form.tsx        # Client form (Google + magic link)
│   └── auth/
│       ├── callback/route.ts     # Code exchange
│       └── error/page.tsx        # Auth errors
├── dashboard/
│   ├── page.tsx                  # Saved configs list
│   ├── layout.tsx                # Protected layout (redirect if no session)
│   └── settings/page.tsx         # Currency, display name
├── share/
│   └── [id]/page.tsx             # Read-only shared results (SSR)
├── layout.tsx                    # Root layout: fonts, analytics scripts, providers
├── globals.css                   # @theme tokens, base styles, FAQ styles
├── not-found.tsx                 # 404
└── manifest.ts                   # Web app manifest

components/
├── ui/                           # ATOMS — smallest functional elements
│   ├── button.tsx
│   ├── input.tsx
│   ├── currency-input.tsx        # Formatted number input with currency symbol
│   ├── card.tsx
│   ├── label.tsx
│   ├── error-message.tsx
│   ├── section-header.tsx        # MOLECULE — title + description
│   ├── snackbar.tsx
│   └── currency-selector.tsx
├── calculator/                   # ORGANISMS — complex reusable sections
│   ├── income-section.tsx
│   ├── expenses-section.tsx
│   ├── expense-row.tsx           # MOLECULE — label + amount + delete
│   ├── names-section.tsx
│   ├── results-view.tsx          # ORGANISM — full results display
│   ├── summary-card.tsx
│   ├── breakdown-card.tsx
│   ├── explanation-card.tsx
│   └── share-button.tsx
├── faq-section.tsx               # Server component — SEO content
├── navigation.tsx                # Server wrapper
└── navigation-client.tsx         # Client nav (sign in/out, dashboard link)

lib/
├── supabase/
│   ├── client.ts                 # Browser Supabase client
│   ├── server.ts                 # Server Supabase client (cookies)
│   └── middleware.ts             # Session refresh
├── calculator/
│   ├── compute.ts                # Pure calculation functions
│   ├── types.ts                  # CalculatorInput, CalculatorResult, etc.
│   └── validation.ts             # Input validation rules
├── analytics/
│   ├── track.ts                  # trackEvent() helper
│   └── events.ts                 # Event name constants
├── hooks/
│   ├── use-calculator.ts         # Calculator state + persistence
│   └── use-currency.ts           # Currency preference (localStorage + profile)
├── utils/
│   ├── cn.ts                     # clsx + twMerge
│   ├── format.ts                 # Number and currency formatting
│   └── sanitize.ts               # Input sanitization
├── constants/
│   └── currencies.ts             # Currency definitions
└── env.ts                        # Server env validation

middleware.ts                     # Supabase auth middleware (session refresh)

public/
├── ads.txt
├── robots.txt
├── sitemap.xml
├── google81ca022cf87256b3.html
├── images/
│   ├── logoIcon.png
│   └── Metadata-Image.jpg
├── Show.svg
├── Hide.svg
└── lotus.png

supabase/
└── migrations/
    └── 001_initial_schema.sql    # All tables, RLS, triggers, functions
```

---

## Build Phases

### Phase 1 — Project Foundation
Next.js + TypeScript + Tailwind v4 scaffolding. Design tokens. File structure. Static public files (ads.txt, robots.txt, etc). Basic UI components (Button, Input, Card). Root layout with fonts.

### Phase 2 — Calculator Port
Port calculator UI to React components. Port calculation logic to `lib/calculator/compute.ts`. localStorage persistence. Step navigation (input ↔ results). All V1 functionality working identically. FAQ section (server-rendered).

### Phase 3 — SEO & Analytics
All meta tags, structured data, canonical URL. GA4 + Hotjar + Clarity script integration. All V1 tracking events firing. AdSense integration. Legacy share link compatibility (?id= and query params).

### Phase 4 — Currency Support
Currency selector component. Formatted inputs with currency symbol. localStorage persistence for anonymous users. Currency formatting in results.

### Phase 5 — Supabase & Auth
Database schema (all tables, RLS, triggers). Auth flow (Google OAuth + magic link). Middleware. Login page. Auto-creation trigger (profile + household + membership).

### Phase 6 — Authenticated Features
Save configuration (server action). Dashboard page (list/load/delete configs). localStorage → account migration prompt on first login. Currency preference in profile.

### Phase 7 — V2 Share Links
share_links table. Server action to create snapshot. `/share/[id]` read-only results page. "Try with your own numbers" CTA.

### Phase 8 — Go-Live
SEO audit (V1 vs V2 comparison). Analytics verification. Performance/Lighthouse testing. DNS cutover plan. Rollback procedure.

---

## Environment Variables

| Variable | Purpose | Client? |
|----------|---------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Anon key for browser/server | Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Bypass RLS (admin tasks only) | No |
| `NEXT_PUBLIC_SITE_URL` | Base URL for auth redirects | Yes |
| `NEXT_PUBLIC_GA_ID` | GA4 measurement ID | Yes |
| `NEXT_PUBLIC_HOTJAR_ID` | Hotjar site ID | Yes |
| `NEXT_PUBLIC_CLARITY_ID` | Clarity project ID | Yes |
| `NEXT_PUBLIC_ADSENSE_ID` | AdSense publisher ID | Yes |

---

## Security

- **RLS on all tables** — no data accessible without explicit policy
- **Server Actions** for all mutations — never call Supabase directly from client for writes
- **Input sanitization** — same XSS prevention as V1, applied at component level
- **Service role key** — never in app code, only for admin scripts/migrations
- **Rate limiting** — calculation rate limit preserved from V1 (client-side)
- **CSRF** — handled by Next.js Server Actions natively
- **CSP headers** — configured in `next.config.ts` (migrate V1 CSP policy)

---

## Performance

- **Server-rendered FAQ** — no layout shift, instant content for crawlers
- **Client calculator** — interactive immediately after hydration
- **No external state library** — minimal JS bundle
- **Font preloading** — Josefin Sans + Assistant preconnected
- **Image optimization** — Next.js `<Image>` for logo/metadata images
- **Lighthouse target** — Performance ≥90, SEO 100, Accessibility ≥95

---

*This document is the source of truth for the V2 rebuild. Keep in sync with implementation.*
