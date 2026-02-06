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

**Returns** `CalculatorResult`: `person1Name`, `person2Name`, `person1TotalShare`, `person2TotalShare`, `person1Percentage`, `person2Percentage`, `totalExpenses`, `expenseBreakdown` (per-expense shares), `person1Salary`, `person2Salary`, `combinedSalary`.

Formula: `person1Share = (person1Salary / (person1Salary + person2Salary)) * expense` (same for person 2). Percentages are `Math.round((totalShare / totalExpenses) * 100)`.

#### `formatCurrency(num: number): string`

Display format: 2 decimals, comma grouping. Example: `1234.5` → `"1,234.50"`. Matches V1 regex.

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
- **CalculatorFormState**: form state (person names, salary strings, visibility toggles, expenses, step, validationErrors).
- **FieldError**: `{ field: string; message: string }`.
- **ValidationResult**: `{ valid: boolean; errors: FieldError[] }`.
- **ExpenseResult**: `{ label; amount; person1Share; person2Share }`.
- **CalculatorResult**: see `calculateShares` return shape.
- **SavedFormData**: shape used for localStorage (`name1`, `name2`, `salary1`, `salary2`, `expenses`).

---

## Share Module (`lib/calculator/share.ts`)

Cloudflare Worker backend. Base URL: `process.env.NEXT_PUBLIC_SHARE_API_URL` or fallback `https://tight-firefly-c0dd.edwardstone1337.workers.dev`.

### `ShareState`

```ts
{ name1, name2, salary1, salary2, expenses: { amount: string; label: string }[] }
```

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

## Environment (`lib/env.ts`)

#### `getServerEnv(): { SUPABASE_URL, SUPABASE_ANON_KEY, SITE_URL, NEXT_PUBLIC_SHARE_API_URL? }`

Reads `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_SHARE_API_URL`. Logs warnings (via `logger`) if Supabase vars missing; returns empty string for URL/key and `http://localhost:3000` for SITE_URL if unset. Share API URL is optional; client uses it in `share.ts` when set.

---

## Route Handlers / Server Actions

None yet. When added, document here: method, path, auth, request/response shape, and any RLS requirements.
