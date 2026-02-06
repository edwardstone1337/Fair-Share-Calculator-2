# API Reference

No HTTP API or Server Actions yet. This document covers the public programmatic API used by the app.

---

## Calculator Module (`lib/calculator/`)

### `compute.ts`

#### `parseSalary(raw: string): number`

Strips commas and trims; parses as float. Returns `NaN` if invalid or empty.

#### `parseExpenseAmount(raw: string): number`

Same behavior as `parseSalary` (used for expense amount fields).

#### `calculateShares(person1Salary, person2Salary, expenses, person1Name?, person2Name?): CalculatorResult`

- **person1Salary, person2Salary**: numbers (must be > 0; caller validates).
- **expenses**: `{ amount: number; label: string }[]`.
- **person1Name, person2Name**: optional; default `"Person 1"` / `"Person 2"`.

**Returns** `CalculatorResult`: `person1Name`, `person2Name`, `person1TotalShare`, `person2TotalShare`, `person1Percentage`, `person2Percentage`, `totalExpenses`, `expenseBreakdown` (per-expense shares), `person1Salary`, `person2Salary`, `combinedSalary`. (Note: `currencySymbol` is added by the hook/UI from context when storing in state.)

Formula: `person1Share = (person1Salary / (person1Salary + person2Salary)) * expense` (same for person 2). Percentages are `Math.round((totalShare / totalExpenses) * 100)`.

#### `formatCurrency(num: number, symbol?: string): string`

Display format: symbol + 2 decimals, comma grouping. Example: `formatCurrency(1234.5, '$')` → `"$1,234.50"`. `symbol` defaults to `'$'`.

---

### `validation.ts`

#### `validateForm(state: CalculatorFormState): ValidationResult`

- **state**: Full form state (names, salaries as strings, expenses array, etc.).
- **Returns** `{ valid: boolean; errors: FieldError[] }`.

Rules:

- Names: max 50 chars.
- Salaries: required, positive, ≤ 999_999_999; parsed via `parseSalary`.
- Expenses: empty amount + empty label = skip; label without amount = error; amount must be valid and > 0; at least one valid expense required.
- Field identifiers: `person1Name`, `person2Name`, `person1Salary`, `person2Salary`, `expense-{id}`, `expenses-global`.

---

### `types.ts`

- **ExpenseInput**: `{ id: string; amount: string; label: string }`.
- **CalculatorFormState**: form state (person names, salary strings, visibility toggles, expenses, step, validationErrors, result).
- **FieldError**: `{ field: string; message: string }`.
- **ValidationResult**: `{ valid: boolean; errors: FieldError[] }`.
- **ExpenseResult**: `{ label; amount; person1Share; person2Share }`.
- **CalculatorResult**: see `calculateShares` return shape; includes `currencySymbol: string` (hook/UI add from context).
- **CalculateSharesResult**: `Omit<CalculatorResult, 'currencySymbol'>` — pure compute return; no symbol.
- **SavedFormData**: shape used for localStorage (`name1`, `name2`, `salary1`, `salary2`, `expenses`, optional `currency`).

---

## Share Module (`lib/calculator/share.ts`)

Cloudflare Worker backend. Base URL: `process.env.NEXT_PUBLIC_SHARE_API_URL` or fallback `https://tight-firefly-c0dd.edwardstone1337.workers.dev`.

### `ShareState`

```ts
{ name1, name2, salary1, salary2, expenses: { amount: string; label: string }[], currency?: string }
```

`currency`: optional ISO 4217 code (e.g. `'USD'`). Included in POST body and legacy URL params; restored when loading share link.

### `shareViaBackend(state: ShareState): Promise<string>`

POST `/share` with JSON body. Returns share URL: `{origin}{path}?id={id}`. Throws on non-2xx.

### `buildLegacyShareUrl(state: ShareState): string`

Builds query-param URL: `?name1=...&salary1=...&expenses=...`. Fallback when backend fails.

### `loadFromShareId(id: string): Promise<ShareState>`

GET `/share/:id`. Validates id (alphanumeric, underscore, hyphen; max 100 chars). Returns ShareState. Throws on invalid id or non-2xx.

---

## Utils (`lib/utils/`)

### `format.ts`

#### `formatWithCommas(value: string): string`

Restricts to digits, commas, period; removes commas then re-inserts thousands separators. Used for live salary/expense input formatting.

#### `sanitizeInput(input: string, maxLength?: number): string`

Trims to `maxLength` (default 1000), strips `<>"'&`. Used for names and labels.

---

### `logger.ts`

#### `logger.info(message: string, data?: unknown): void`

Logs in development only. Prefix: `[FairShare]`.

#### `logger.warn(message: string, data?: unknown): void`

Warns in development only. Prefix: `[FairShare]`.

#### `logger.error(message: string, data?: unknown): void`

Logs in all environments. Prefix: `[FairShare]`. Use for real failures.

---

## Analytics (`lib/analytics/gtag.ts`)

GA4 measurement ID: `G-TQZ0HGB3MT`. All calls no-op if `window.gtag` is undefined (e.g. SSR, ad blocker).

### `trackEvent(eventName: string, params?: Record<string, unknown>): void`

Sends custom event to GA4. Safe to call from client only; never throws.

### `bucketExpenseAmount(total: number): string`

Returns privacy bucket: `"0-100"` | `"100-250"` | `"250-500"` | `"500-1000"` | `"1000+"`. Use for analytics only, not display.

### `bucketSplitRatio(salary1: number, salary2: number): string`

Returns ratio bucket: `"50-50"` | `"60-40"` | `"70-30"` | `"80-20"` | `"other"`. Based on person1 share of combined salary.

---

## Currency (`lib/constants/currencies.ts` + `lib/contexts/currency-context.tsx`)

### Constants

- **CURRENCIES**: `CurrencyConfig[]` — supported codes (USD, CAD, AUD, NZD, GBP, INR, PHP, SGD) with `code`, `symbol`, `label`.
- **DEFAULT_CURRENCY**: USD.
- **detectCurrencyFromLocale()**: uses `navigator.languages` / locale; returns matching `CurrencyConfig` or DEFAULT_CURRENCY. Client-only.
- **getCurrencyByCode(code: string)**: returns `CurrencyConfig` for code, or DEFAULT_CURRENCY.

### Context

- **CurrencyProvider**: wraps app; on mount loads from `localStorage.getItem('fairshare_currency')` or `fairshare_form.currency`, else `detectCurrencyFromLocale()`. Persists on change. Fires `trackEvent('currency_changed', { currency_code })` on user change.
- **useCurrency()**: returns `{ currency: CurrencyConfig; setCurrency: (code: string) => void }`.

---

## UI Components (`components/ui/`)

### Input

- **prefix?: string** — Non-editable text shown inside the input on the left (e.g. `"$"`, `"£"`). When set, input is wrapped in a focusable container; use for currency-prefixed fields.
- **autoComplete**: Calculator salary and expense amount inputs use `autoComplete="off"` to avoid inappropriate browser autofill suggestions.

### FormField

- **Props**: `id`, `label`, `required?`, `error?`, `prefix?`, `labelSuffix?`, plus Input props (`value`, `onChange`, `onFocus`, `onBlur`, etc.). Composes Label + Input + ErrorMessage.
- **labelSuffix**: React node after the label (e.g. toggle button). Use for "label row" layout.

### Icon

- **Props**: `name` (Material Symbols icon name), `size?`, `color?`, `style?`, `className?`, `aria-hidden?` (default true). Renders `material-symbols-outlined` span.

### IconButton

- **Props**: `icon` (Material Symbols name), `variant: "ghost" | "danger"`, `onClick`, `aria-label` (required), `size?: "sm" | "md"`, `className?`, `style?`. Uses tokens `--icon-button-size-*`, `--icon-button-bg-*`, `--icon-button-color-*`, etc.

### Card

- **Props**: `children`, `className?`, `style?` (optional; merged with base styles for layout).

---

## Hooks (`lib/hooks/`)

### `useCalculator(options?: UseCalculatorOptions)`

**Options**: `onDataRestored?: () => void` — called once when state is restored from localStorage (not on share-link restore; client fires `data_restored` for both).

**Returns**: `state`, `dispatch`, `calculate`, `backToEdit`, `result`, `errors`, `getError`, `hasError`. On first load with saved data, restores then calls `onDataRestored` and fires `data_restored` via gtag.

### `useInputTracking(options: UseInputTrackingOptions)`

**Options**: `fieldId: string`, `fieldType: "name" | "salary" | "expense_label" | "expense_amount"`, `prefilled?: boolean`. When `prefilled` is true, `input_started` is not fired.

**Returns**: `{ onFocus, onInput, onBlur }` — wire to input. Fires: `input_started` (first non-empty input), `input_completed` (blur + value changed), `validation_error` (blur, salary/expense_amount only, when value invalid/missing/too large).

---

## Environment (`lib/env.ts`)

Required and optional variables are listed in `.env.example` (Supabase, Share API).

#### `getServerEnv(): { SUPABASE_URL, SUPABASE_ANON_KEY, SITE_URL, NEXT_PUBLIC_SHARE_API_URL? }`

Reads `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_SHARE_API_URL`. Logs warnings (via `logger`) if Supabase vars missing; returns empty string for URL/key and `http://localhost:3000` for SITE_URL if unset. Share API URL is optional; client uses it in `share.ts` when set. `SUPABASE_SERVICE_ROLE_KEY` (in `.env.example`) is for future server-side use only; not read by `getServerEnv`.

---

## Route Handlers

### `GET /auth/callback`

**Auth**: None (OAuth redirect target).  
**Query**: `code` — OAuth authorization code from Supabase/Google.

**Behavior**: Entire handler body wrapped in try/catch. Uses server Supabase client (`createClient()` from `lib/supabase/server.ts`). If `code` missing → redirect to `/auth/error`. Calls `supabase.auth.exchangeCodeForSession(code)`. On success → redirect to `/dashboard`; on Supabase error or no code → redirect to `/auth/error`. On any thrown exception (e.g. `createClient` or network) → redirect to `/auth/error`; no unhandled exception.

**Response**: 302 redirect. No JSON.

---

## Database Schema (`supabase/migrations/001_foundation_schema.sql`)

Run manually in Supabase SQL Editor. No app CRUD on these tables yet (auth-only Phase 5c).

### Tables

**households**
- `id` UUID PK, `name` TEXT DEFAULT 'My Household', `currency` TEXT DEFAULT 'USD', `created_at`, `updated_at`.
- RLS: SELECT/UPDATE/DELETE for members only; INSERT for any authenticated.

**household_members**
- `id` UUID PK, `household_id` FK → households, `user_id` FK → auth.users, `role` TEXT CHECK (owner | partner), `created_at`. UNIQUE(household_id, user_id).
- RLS: SELECT for members; INSERT/UPDATE/DELETE for owners only (same household).

**configurations**
- `id` UUID PK, `household_id` FK → households, `name`, `person_1_name`, `person_2_name`, `person_1_salary`, `person_2_salary` NUMERIC(12,2), `currency`, `created_at`, `updated_at`.
- RLS: full CRUD for users who are members of the household.

**expenses**
- `id` UUID PK, `configuration_id` FK → configurations, `label`, `amount` NUMERIC(12,2), `sort_order`, `created_at`, `updated_at`.
- RLS: full CRUD for users whose household owns the configuration.

### Helper

- **`public.user_household_ids(user_uuid UUID)`** — SECURITY DEFINER, STABLE. Returns SETOF household IDs for which the user is a member. Used by RLS policies.

### Triggers

- **on_auth_user_created** (AFTER INSERT ON auth.users): calls `public.handle_new_user()` — inserts one household and one household_members row (role owner).
- **households_updated_at**, **configurations_updated_at**, **expenses_updated_at**: BEFORE UPDATE set `updated_at = now()`.

### Indexes

- `idx_household_members_user_id`, `idx_configurations_household_id`, `idx_expenses_configuration_id`.

---

## Supabase clients (`lib/supabase/`)

Use the correct client for the runtime. Do not use the service role key in app code.

### `client.ts` — Browser

- **`createClient(): SupabaseClient`**  
  Use in Client Components only. Reads `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`. `@supabase/ssr` handles dedup.

### `server.ts` — Server (Server Components, Server Actions, Route Handlers)

- **`createClient(): Promise<SupabaseClient>`**  
  Async; awaits `cookies()` from `next/headers`. Cookie methods: `getAll()`, `setAll()` (wrapped in try/catch for read-only contexts). Use for `getUser()`, `exchangeCodeForSession()`, etc.

### `middleware.ts` — Middleware

- **`createClient(request: NextRequest): { supabase: SupabaseClient; response: NextResponse }`**  
  Sync. Cookies: read from `request.cookies.getAll()`, write to both `request.cookies` and `response.cookies` in `setAll`. Caller must call `supabase.auth.getUser()` to refresh session, then return `response` (or a redirect).
