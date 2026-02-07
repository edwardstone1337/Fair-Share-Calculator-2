# API Reference

Server Actions for configurations and user preferences live in `lib/actions/`. This document covers the public programmatic API used by the app.

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

### Navigation Events

Event names live in `lib/analytics/events.ts`. Use `TrackedLink` (internal) or `TrackedAnchor` (external) for click tracking in server components; in client components (e.g. NavBar) use `trackEvent` from `lib/analytics/gtag` directly.

| Event | Params |
|-------|--------|
| `nav_link_clicked` | `link`: `"calculator"` \| `"faq"` \| `"home"`; optional `source`: `"desktop"` \| `"mobile_menu"` \| `"logo"` |
| `nav_menu_opened` | (none); fired on menu open only |
| `footer_link_clicked` | `link`: `"calculator"` \| `"faq"` \| `"privacy"` \| `"terms"` (from label lowercased, spaces → `_`) |
| `faq_cta_clicked` | `cta`: `"try_calculator"` \| `"buy_me_a_coffee"`. For `try_calculator`, optional `source`: `"faq_how_to_use"` \| `"faq_how_calculated"` \| `"faq_household_bills"` \| `"faq_rent"` \| `"faq_mortgage"` \| `"faq_60_40"` \| `"faq_closing"` (per-CTA attribution). |

### Calculator events

Fired from `components/calculator/calculator-client.tsx`. GA4 custom params are string or number; arrays sent as comma-separated strings.

| Event | When | Params |
|-------|------|--------|
| `validation_error` | Once per Calculate click when `validateForm(state)` returns errors (before `calculate_attempt` with status error). Not fired on blur. | `error_count`: number; `error_fields`: string (comma-separated field IDs, e.g. `person1Salary,person2Salary`); `error_types`: string (comma-separated unique types: `missing_expense`, `missing`, `invalid_format`, `name_too_long`); `returning_user`: boolean. |
| `calculate_attempt` | On every Calculate click. | On error: `status: "error"`, `error_type`: `"missing_expense"` \| `"missing_salary"` \| `"validation_error"`, `returning_user`. On success: `status: "success"`, `expense_count`, `has_names`, `has_labels`, `total_expense_bucket`, `time_to_calculate_ms`, `returning_user`. |

---

## Currency (`lib/constants/currencies.ts` + `lib/contexts/currency-context.tsx`)

### Constants

- **CURRENCIES**: `CurrencyConfig[]` — supported codes (USD, CAD, AUD, NZD, GBP, INR, PHP, SGD) with `code`, `symbol`, `label`.
- **DEFAULT_CURRENCY**: USD.
- **detectCurrencyFromLocale()**: uses `navigator.languages` / locale; returns matching `CurrencyConfig` or DEFAULT_CURRENCY. Client-only.
- **getCurrencyByCode(code: string)**: returns `CurrencyConfig` for code, or DEFAULT_CURRENCY.

### Context

- **CurrencyProvider**: wraps app; on mount loads from `localStorage.getItem('fairshare_currency')` or `fairshare_form.currency`, else `detectCurrencyFromLocale()`. For **logged-in users**, after that init it also calls `getCurrencyPreference()`; if the DB returns a valid currency code and it differs from the localStorage/detection value, the DB value is used (DB is source of truth when authenticated). On currency change: always writes to `fairshare_currency`; if the user is logged in, also calls `setCurrencyPreference(code)` (fire-and-forget). Fires `trackEvent('currency_changed', { currency_code })` on user change.
- **useCurrency()**: returns `{ currency: CurrencyConfig; setCurrency: (code: string) => void }`.

### Auth feature flag (client)

- **NEXT_PUBLIC_AUTH_ENABLED**: When set to the string `'true'` (e.g. in .env.local), auth-dependent UI is shown: Save Configuration button on results. (NavBar sign-in/avatar is currently commented out in `nav-bar.tsx`, preserved for re-enablement.) When unset or not `'true'` (e.g. production), the Save button is not rendered and anonymous users are not sent to `/login`. `CalculatorClient` reads this once; `ResultsView`/`ResultsFooter` receive optional `onSave`/`saveState` and only show Save when provided.

### localStorage keys (calculator / auth)

- **fairshare_form**: Calculator form data (names, salaries, expenses); see ARCHITECTURE and `useCalculator`. Written by the hook on state change; read on mount and when restoring share/config.
- **fairshare_pending_save**: Set to `'true'` when an anonymous user taps **Save Configuration** on the results screen (only when auth is enabled); client then redirects to `/login`. Form data remains in `fairshare_form` so the user can save after signing in (e.g. from dashboard or after returning to calculator).

### fairshare_pending_save migration flow (dashboard)

When the user lands on `/dashboard` after OAuth (e.g. following the Save → login redirect), `DashboardClient` runs a one-time migration on mount:

1. **Check** `localStorage.getItem('fairshare_pending_save') === 'true'`.
2. **Read** `localStorage.getItem('fairshare_form')` and parse as JSON. If the result is invalid or does not have at least one of `name1`, `name2`, `salary1`, `salary2`, clear `fairshare_pending_save` and exit.
3. **Map** the parsed `SavedFormData` to `SaveConfigInput` (names, salaries parsed to numbers, expenses mapped, currency from form or `'USD'`).
4. **Call** `saveConfiguration(input)`. On success: re-fetch configs via `listConfigurations()` and update local state, show snackbar "Configuration saved from your calculator session." On failure: show error snackbar with the action’s error message (e.g. config limit).
5. **Clear** `fairshare_pending_save` from localStorage in both success and failure cases.

---

## UI Components (`components/ui/`)

### Input

- **prefix?: string** — Non-editable text shown inside the input on the left (e.g. `"$"`, `"£"`). When set, input is wrapped in a focusable container; use for currency-prefixed fields.
- **type / inputMode**: Calculator salary and expense amount inputs use `type="text"` with `inputMode="numeric"` (not `type="number"`) for security and consistent visibility when toggling show/hide.
- **autoComplete**: Calculator salary and expense amount inputs use `autoComplete="off"` to avoid inappropriate browser autofill suggestions.

### FormField

- **Props**: `id`, `label`, `required?`, `error?`, `prefix?`, `labelSuffix?`, plus Input props (`value`, `onChange`, `onFocus`, `onBlur`, etc.). Composes Label + Input + ErrorMessage.
- **labelSuffix**: React node after the label (e.g. toggle button). Use for "label row" layout.

### Icon

- **Props**: `name` (Material Symbols icon name), `size?`, `color?`, `style?`, `className?`, `aria-hidden?` (default true). Renders `material-symbols-outlined` span.

### IconButton

- **Props**: `icon` (Material Symbols name), `variant: "ghost" | "danger"`, `onClick`, `aria-label` (required), `className?`, `style?`. Single size 48px via `--icon-button-size` (references `--touch-target-min-height`); icon 20px via `--icon-button-icon-size`. Uses tokens `--icon-button-bg-*`, `--icon-button-color-*`, etc.

### CurrencySelector

- **Props**: `value`, `onChange`. Renders at 48px height (`--touch-target-min-height`). Styling: pill radius (`--currency-selector-radius: var(--radius-pill)`), custom dropdown arrow via CSS background (token `--currency-selector-arrow-size`), padding via `--currency-selector-padding-inline-start` / `-inline-end`.

### Card

- **Props**: `children`, `className?`, `style?` (optional; merged with base styles for layout).

---

## Hooks (`lib/hooks/`)

### `useCalculator(options?: UseCalculatorOptions)`

**Options**: `onDataRestored?: () => void` — called once when state is restored from localStorage (not on share-link restore; client fires `data_restored` for both).

**Returns**: `state`, `dispatch`, `calculate`, `backToEdit`, `result`, `errors`, `getError`, `hasError`. On first load with saved data, restores then calls `onDataRestored` and fires `data_restored` via gtag.

### `useInputTracking(options: UseInputTrackingOptions)`

**Options**: `fieldId: string`, `fieldType: "name" | "salary" | "expense_label" | "expense_amount"`, `prefilled?: boolean`. When `prefilled` is true, `input_started` is not fired.

**Returns**: `{ onFocus, onInput, onBlur }` — wire to input. Fires: `input_started` (first non-empty input), `input_completed` (blur + value changed). Does **not** fire `validation_error` (moved to submit-time in calculator-client; see Calculator events below).

---

## Environment (`lib/env.ts`)

Required and optional variables are listed in `.env.example` (Supabase).

#### `getServerEnv(): { SUPABASE_URL, SUPABASE_ANON_KEY, SITE_URL }`

Reads `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_SITE_URL`. Logs warnings (via `logger`) if Supabase vars missing; returns empty string for URL/key and `http://localhost:3000` for SITE_URL if unset. `SUPABASE_SERVICE_ROLE_KEY` (in `.env.example`) is for future server-side use only; not read by `getServerEnv`.

---

## Route Handlers

### `GET /auth/callback`

**Auth**: None (OAuth redirect target).  
**Query**: `code` — OAuth authorization code from Supabase/Google.

**Behavior**: Entire handler body wrapped in try/catch. Uses server Supabase client (`createClient()` from `lib/supabase/server.ts`). If `code` missing → redirect to `/auth/error`. Calls `supabase.auth.exchangeCodeForSession(code)`. On success → redirect to `/dashboard`; on Supabase error or no code → redirect to `/auth/error`. On any thrown exception (e.g. `createClient` or network) → redirect to `/auth/error`; no unhandled exception.

**Response**: 302 redirect. No JSON.

### App route: `/dashboard-preview` (temporary)

**Auth**: None. Design-only; no Supabase, no redirect.  
**Query**: `empty=true` → empty state (0 configs); `full=true` → 10 configs, "10 of 10 saved"; default → 5 configs, "5 of 10 saved".  
**Behavior**: Client page; renders same layout as `/dashboard` with hardcoded `ConfigSummary[]`; `DashboardClient` receives `initialConfigs`. Load/Rename/Delete from cards call real actions and fail (expected). Not in sitemap or nav. Metadata: noindex, nofollow.

### App route: `/faq`

**Auth**: None. Public static page.  
**Behavior**: Server-rendered FAQ page; metadata (title/description targeting couples, bill splitting); FAQPage JSON-LD (`mainEntity`: 10 Question/Answer pairs); content uses `--faq-*` tokens; "Try the calculator" CTAs after selected FAQs are `TrackedLink` (GA `faq_cta_clicked`, cta `try_calculator`, optional `source` for attribution) styled as secondary buttons (48px touch target, href `/`); Buy Me a Coffee is `TrackedAnchor` (GA `faq_cta_clicked`, cta `buy_me_a_coffee`); floating `BackToTopButton` (fixed bottom-right, icon-only, appears after 400px scroll; optional `threshold` prop). In sitemap: priority 0.7, changeFrequency monthly.

---

## Server Actions (`lib/actions/`)

All actions use `createClient()` from `@/lib/supabase/server`. Return type is `ActionResult<T>`: either `{ success: true; data: T }` or `{ success: false; error: string }`. On Supabase errors, the client receives a user-friendly message; raw DB errors are logged and never exposed.

### Configurations (`lib/actions/configurations.ts`)

**Types**: `ConfigSummary`, `ConfigDetail`, `SaveConfigInput`, `ActionResult<T>`.

#### `saveConfiguration(input: SaveConfigInput): Promise<ActionResult<{ id: string }>>`

- **input**: `name?`, `person1Name`, `person2Name`, `person1Salary`, `person2Salary`, `expenses: { label, amount }[]`, `currency`. If `name` is omitted, defaults to current date formatted (e.g. "February 6, 2026").
- **Returns**: On success, `data: { id: string }` (new configuration id). On failure, `error: string`.
- **Error cases**: Not authenticated; household not found; configuration limit reached (max 10) — "Configuration limit reached (max 10). Delete a saved configuration to make room."; other DB errors → generic message.

#### `listConfigurations(): Promise<ActionResult<ConfigSummary[]>>`

- **Returns**: Array of config summaries (id, name, person1Name, person2Name, totalExpenses, expenseCount, currency, createdAt, updatedAt) for the user's household, non-deleted, ordered by `updated_at` DESC.
- **Error cases**: Not authenticated; household not found; DB error → generic message.

#### `getConfiguration(configId: string): Promise<ActionResult<ConfigDetail>>`

- **configId**: UUID of the configuration.
- **Returns**: Full detail (ConfigSummary fields plus person1Salary, person2Salary, expenses array with id, label, amount, sortOrder). Expenses ordered by sort_order.
- **Error cases**: Not authenticated; household not found; configuration not found or not in household; DB error → generic message.

#### `renameConfiguration(configId: string, newName: string): Promise<ActionResult>`

- **newName**: Trimmed; must be non-empty and ≤ 100 characters.
- **Returns**: `ActionResult` with no data on success.
- **Error cases**: Validation (empty or > 100 chars); not authenticated; household not found; configuration not found; DB error → generic message.

#### `deleteConfiguration(configId: string): Promise<ActionResult>`

- **Behavior**: Soft delete — sets `deleted_at = now()` on the configuration and on all its expenses.
- **Returns**: Success or failure.
- **Error cases**: Not authenticated; household not found; configuration not found; DB error → generic message.

### User preferences (`lib/actions/user-preferences.ts`)

#### `getCurrencyPreference(): Promise<ActionResult<string>>`

- **Returns**: The household's currency code (e.g. `"USD"`). Defaults to `"USD"` if column is null.
- **Error cases**: Not authenticated; household not found; DB error → generic message.

#### `setCurrencyPreference(currencyCode: string): Promise<ActionResult>`

- **currencyCode**: Must be a string, exactly 3 characters, uppercase letters only (e.g. `"USD"`, `"GBP"`).
- **Returns**: Success or failure.
- **Error cases**: Validation ("Currency must be a 3-letter uppercase code (e.g. USD)."); not authenticated; household not found; DB error → generic message.

---

## Database Schema (`supabase/migrations/`)

Run migrations manually in Supabase SQL Editor. Server Actions (Phase 6b) perform CRUD via RLS. Foundation: `001_foundation_schema.sql`; soft delete and config limit: `002_soft_delete_and_currency_pref.sql`.

### Tables

**households**
- `id` UUID PK, `name` TEXT DEFAULT 'My Household', `currency` TEXT NOT NULL DEFAULT 'USD', `created_at`, `updated_at`.
- Currency preference: use `households.currency` (no separate column).
- RLS: SELECT/UPDATE/DELETE for members only; INSERT for any authenticated.

**household_members**
- `id` UUID PK, `household_id` FK → households, `user_id` FK → auth.users, `role` TEXT CHECK (owner | partner), `created_at`. UNIQUE(household_id, user_id).
- RLS: SELECT for members; INSERT/UPDATE/DELETE for owners only (same household).

**configurations**
- `id` UUID PK, `household_id` FK → households, `name`, `person_1_name`, `person_2_name`, `person_1_salary`, `person_2_salary` NUMERIC(12,2), `currency`, `created_at`, `updated_at`, `deleted_at` TIMESTAMPTZ DEFAULT NULL (soft delete).
- RLS: full CRUD for household members. SELECT policy excludes soft-deleted rows (`deleted_at IS NULL`). INSERT/UPDATE/DELETE unchanged — use UPDATE to set `deleted_at = now()` for soft delete; hard DELETE remains for future purge jobs.

**expenses**
- `id` UUID PK, `configuration_id` FK → configurations, `label`, `amount` NUMERIC(12,2), `sort_order`, `created_at`, `updated_at`, `deleted_at` TIMESTAMPTZ DEFAULT NULL (soft delete).
- RLS: full CRUD for users whose household owns the configuration. SELECT policy excludes soft-deleted rows (`expenses.deleted_at IS NULL`). INSERT/UPDATE/DELETE unchanged.

### Helper

- **`public.user_household_ids(user_uuid UUID)`** — SECURITY DEFINER, STABLE. Returns SETOF household IDs for which the user is a member. Used by RLS policies.

### Triggers

- **on_auth_user_created** (AFTER INSERT ON auth.users): calls `public.handle_new_user()` — inserts one household and one household_members row (role owner).
- **households_updated_at**, **configurations_updated_at**, **expenses_updated_at**: BEFORE UPDATE set `updated_at = now()`.

### Indexes

- `idx_household_members_user_id`, `idx_configurations_household_id`, `idx_expenses_configuration_id`.
- `idx_configurations_deleted_at_null` (partial: `WHERE deleted_at IS NULL`) — for efficient listing of non-deleted configs.

### Soft delete (Phase 6a, migration 002)

- **configurations** and **expenses** have `deleted_at TIMESTAMPTZ DEFAULT NULL`. Rows with `deleted_at` set are hidden from SELECT by RLS; INSERT/UPDATE/DELETE policies are unchanged.
- **Soft delete in app**: run UPDATE and set `deleted_at = now()` instead of DELETE. Hard DELETE stays available for future purge jobs (e.g. cron).

### Config limit trigger (Phase 6a, migration 002)

- **`public.check_config_limit()`** — runs BEFORE INSERT on `configurations`. Counts non-deleted configs for the same household (`WHERE household_id = NEW.household_id AND deleted_at IS NULL`). If count ≥ 10, raises exception `Household configuration limit reached (max 10)` with `ERRCODE check_violation`.
- **Trigger**: `trigger_check_config_limit` on `public.configurations`.

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
