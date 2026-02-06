# Update Documentation Task

You are updating documentation after code changes.

## Required Documentation Files

Maintain these files to ensure AI can understand and work with the codebase sustainably:

1. **ARCHITECTURE.md** - System design reference
2. **DECISION_LOG.md** - Record of why choices were made
3. **API_REFERENCE.md** - Server actions, routes, DB schemas
4. **CONVENTIONS.md** - Code patterns and standards
5. **CHANGELOG.md** - User-facing changes

---

## 1. Identify Changes
- Check git diff or recent commits for modified files
- Identify which features/modules were changed
- Note any new files, deleted files, or renamed files

## 2. Verify Current Implementation
**CRITICAL**: DO NOT trust existing documentation. Read the actual code.

For each changed file:
- Read the current implementation
- Understand actual behavior (not documented behavior)
- Note any discrepancies with existing docs
- **Cross-reference with ARCHITECTURE.md** to understand where this fits in the system

## 3. Update Relevant Documentation

### CHANGELOG.md
- Add entry under "Unreleased" section
- Use categories: Added, Changed, Fixed, Security, Removed
- Be concise, user-facing language

### ARCHITECTURE.md (update if applicable)
- **Data model changes** → Update entity relationships diagram/description
- **New integrations** → Add to Dependencies & External Services
- **Auth/permission changes** → Update RLS policies section
- **API changes** → Update request flow diagrams/descriptions
- **New infrastructure** → Update deployment architecture

### DECISION_LOG.md (update if applicable)
- Document **why** a significant architectural choice was made
- Format: `## [Date] - [Short Title]`
  - **Context**: What problem we faced
  - **Decision**: What we chose
  - **Rationale**: Why (constraints, trade-offs, alternatives rejected)
  - **Consequences**: Impact on codebase/product

### API_REFERENCE.md (update if applicable)
- **New server action** → Add signature, params, return type, RLS requirements
- **New route handler** → Add endpoint, method, auth requirements, response schema
- **DB schema change** → Update table definitions, RLS policies, indexes
- **Changed API contract** → Mark old version deprecated, document new version

### CONVENTIONS.md (update if applicable)
- **New code pattern introduced** → Document it (e.g., new error handling pattern)
- **File structure change** → Update directory conventions
- **Naming convention change** → Document new standard
- **New utility/helper pattern** → Add usage example

## 4. Documentation Style Rules

✅ **Concise** - Sacrifice grammar for brevity  
✅ **Practical** - Examples over theory  
✅ **Accurate** - Code verified, not assumed  
✅ **Current** - Matches actual implementation  
✅ **Diagrams where useful** - Mermaid for flows, ASCII for simple structures  

❌ No enterprise fluff  
❌ No outdated information  
❌ No assumptions without verification  
❌ No duplicate information across docs  

## 5. Ask if Uncertain

If you're unsure about intent behind a change or user-facing impact, **ask the user** - don't guess.

---

# Documentation File Templates

## ARCHITECTURE.md Structure

```markdown
# System Architecture

## Overview
[2-3 sentence product summary]

## Tech Stack
[Table from CTO prompt]

## Data Model

### Core Entities
- **users**: [key fields, relationships]
- **households**: [key fields, relationships]
- **configurations**: [key fields, relationships]
- **expenses**: [key fields, relationships]

### Entity Relationships
[Mermaid ERD or ASCII diagram]

## Request Flow

### Anonymous User Flow
[Step-by-step: browser → Next.js → localStorage]

### Authenticated User Flow
[Step-by-step: browser → Next.js → Supabase RLS → DB]

## Authentication & Authorization
- Supabase Auth providers: Google OAuth, magic link
- RLS policies: [brief description of key policies]
- Anonymous vs authenticated access rules

## Key Architectural Decisions
- Why household-centric data model
- Why localStorage for anonymous users
- Why Server Actions over API routes
- Why V1 stays on GitHub Pages during V2 development

## Dependencies & External Services
- Vercel: Hosting, auto-deploy from `main`
- Supabase: PostgreSQL, Auth, RLS
- Cloudflare Worker: Legacy share links (read-only)
- Stripe: Payment processing (future)
- Analytics: GA4, Hotjar, Clarity
- Ads: Google AdSense

## Deployment Architecture
[How V1/V2 coexist, DNS strategy, rollback plan]
```

---

## DECISION_LOG.md Structure

```markdown
# Decision Log

## [2024-01-15] - Household-Centric Data Model
**Context**: Need to support future linked partner accounts  
**Decision**: All configurations belong to `household` entity, not `user`  
**Rationale**: Even single-user V2 launch needs this foundation for multi-user households  
**Consequences**: Extra DB join, but cleaner permission model for shared households

## [2024-01-10] - Keep V1 Live During V2 Development
**Context**: 3K users, 91% from organic search, can't afford downtime  
**Decision**: V1 on GitHub Pages untouched, V2 on separate Vercel deployment  
**Rationale**: Zero-risk migration, instant rollback via DNS  
**Consequences**: Must maintain parity checklist, dual analytics tracking during transition
```

---

## API_REFERENCE.md Structure

```markdown
# API Reference

## Server Actions

### `saveConfiguration(data: ConfigurationInput): Promise<Configuration>`
**Auth**: Required  
**RLS**: User must own the household  
**Params**:
- `person1Income: number`
- `person2Income: number`
- `expenses: Expense[]`

**Returns**: Saved configuration with ID  
**Errors**: `UNAUTHORIZED`, `HOUSEHOLD_LIMIT_REACHED`

## Route Handlers

### `GET /api/households/[id]`
**Auth**: Required  
**RLS**: User must be household member  
**Response**: `{ id, name, members, configurations[] }`

## Database Schema

### Table: `households`
```sql
CREATE TABLE households (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  ...
);
```

**RLS Policies**:
- `household_owner_access`: Owner can CRUD
- `household_member_access`: Members can read

### Table: `configurations`
...
```

---

## CONVENTIONS.md Structure

```markdown
# Code Conventions

## File Structure
```
app/
  (auth)/              # Auth-required routes
  (public)/            # Public routes
  _components/         # Shared components
  _lib/               # Utilities
    actions/          # Server actions
    db/              # Database utilities
```

## Naming Patterns
- Server actions: `verbNoun` (e.g., `saveConfiguration`)
- Components: `PascalCase` (e.g., `ExpenseList`)
- Utilities: `camelCase` (e.g., `calculateSplit`)
- Database tables: `snake_case` plural (e.g., `households`)

## TypeScript Standards
- Strict mode enabled
- No `any` types (use `unknown` if needed)
- Prefer interfaces over types for objects
- Use Zod for runtime validation

## Error Handling Pattern
```typescript
try {
  const result = await action();
  return { success: true, data: result };
} catch (error) {
  return { success: false, error: getErrorMessage(error) };
}
```

## Component Patterns
- Server Components by default
- `"use client"` only when needed (interactivity, hooks)
- Co-locate components with routes when route-specific
- Shared components in `_components/`

## Database Patterns
- Always use RLS, never bypass with service role key in client-facing code
- Use prepared statements via Supabase client
- Transactions for multi-table operations
```

---

**Workflow Note**: After code changes, Cursor should:
1. Run this documentation update task
2. Return a status report listing which docs were updated and why
3. Flag any architectural changes that need Ed's review before merging
