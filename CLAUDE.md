# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Fair Share Calculator — income-based bill split calculator for couples. Next.js 15.5.x (App Router) + TypeScript (strict) + Tailwind CSS v4 + Supabase (PostgreSQL + Google OAuth). Anonymous users use localStorage; authenticated users save configurations.

## Essential Commands

```bash
npm run dev              # Start dev server
npm run dev:clean        # Clear .next cache (use after modifying globals.css, deleting files, or renaming exports)
npm run test:critical    # Run critical regression tests (Node.js test runner, not Jest/Vitest)
npm run lint             # ESLint
npm run build            # Production build
```

**Pre-deployment gate:** Run `test:critical && lint && build` before any merge/deploy.

## Critical Rules

### Build Verification (Vercel Cost)

**CRITICAL**: After any routing or layout change, run `npm run build` and verify the route table.

- All public pages (`/`, `/faq`, `/privacy`, `/terms`, `/login`) **MUST** show **○ Static**
- If any show **ƒ Dynamic**, STOP and investigate before committing — this causes expensive serverless invocations on every page view

### What Makes Pages Dynamic (and Expensive)

These 4 things in a page or layout's server render path force dynamic rendering:

1. `export const dynamic = 'force-dynamic'`
2. Calling `cookies()` or `headers()` from `next/headers`
3. Using Supabase's `createServerClient` (calls `cookies()` internally)
4. A parent layout doing any of the above (cascades to all children)

**NEVER** add `cookies()`, `headers()`, or Supabase server client to `app/layout.tsx` — this makes every page dynamic.

### Styling & Design System

- **Tokens only** — Use CSS variables from `app/globals.css`. NO raw hex, rgb, or px values in components.
- **Touch targets** — All interactive elements (buttons, inputs, icon buttons, links) must be exactly 48px via `height: var(--touch-target-min-height)`.
- **Media queries** — CSS custom properties don't work in `@media`; use raw px values with a comment referencing the token (e.g., `/* 640px = --breakpoint-md */`).

### Database & Migrations

- **Migrations** — Located in `supabase/migrations/`. Run manually in Supabase SQL Editor. Apply migrations **before** deploying code that depends on them.
- **Supabase client selection:**
  - Browser: `lib/supabase/client.ts` (Client Components)
  - Server: `lib/supabase/server.ts` (Server Components, Server Actions, Route Handlers)
  - Middleware: `lib/supabase/middleware.ts` (only in `middleware.ts`)
- **CRUD** — All database operations via Server Actions in `lib/actions/`. Use anon key + RLS; **NEVER** use service role in app code.
- **Soft delete** — UPDATE to set `deleted_at = now()` (not DELETE).

### Auth Feature Flag

- `NEXT_PUBLIC_AUTH_ENABLED === 'true'` (set in `.env.local` for dev) enables Save button and auth UI.
- When unset (production), Save button is hidden and anonymous users are never redirected to `/login`.

### TypeScript

- Strict mode, no `any` (use `unknown` if needed).
- Prefer interfaces for object shapes.
- Shared types in `lib/calculator/types.ts`.

### Form Inputs (Security)

- Salary and expense amount inputs: `type="text"` with `inputMode="numeric"` (NOT `type="number"`).
- Use `autoComplete="off"` to reduce inappropriate autofill.

### Development Workflow

1. Use `npm run dev:clean` after modifying `globals.css`, deleting files, or renaming exports.
2. Do NOT run `npm run build` while dev server is running.
3. When uncertain about a change's impact, ask before proceeding.

## Deep Context

For architecture details, conventions, API reference, and decision history:

- **Architecture & data flow:** @ARCHITECTURE.md
- **Conventions & patterns:** @CONVENTIONS.md
- **API, schema & analytics:** @API_REFERENCE.md
- **Decision history:** @DECISION_LOG.md
