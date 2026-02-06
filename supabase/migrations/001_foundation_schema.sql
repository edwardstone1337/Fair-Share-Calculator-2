-- =============================================================================
-- Phase 5b — Foundation Schema
-- Fair Share Calculator V2 — Supabase
-- =============================================================================
-- Run manually in Supabase SQL Editor.
-- No app code changes. Schema only.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- UP
-- -----------------------------------------------------------------------------

-- -----------------------------------------------------------------------------
-- 1. Tables
-- -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.households (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL DEFAULT 'My Household',
  currency TEXT NOT NULL DEFAULT 'USD',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.household_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  household_id UUID NOT NULL REFERENCES public.households(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('owner', 'partner')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (household_id, user_id)
);

CREATE TABLE IF NOT EXISTS public.configurations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  household_id UUID NOT NULL REFERENCES public.households(id) ON DELETE CASCADE,
  name TEXT NOT NULL DEFAULT 'Default',
  person_1_name TEXT NOT NULL DEFAULT 'Person 1',
  person_2_name TEXT NOT NULL DEFAULT 'Person 2',
  person_1_salary NUMERIC(12,2) NOT NULL DEFAULT 0,
  person_2_salary NUMERIC(12,2) NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'USD',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  configuration_id UUID NOT NULL REFERENCES public.configurations(id) ON DELETE CASCADE,
  label TEXT NOT NULL DEFAULT '',
  amount NUMERIC(12,2) NOT NULL DEFAULT 0,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- -----------------------------------------------------------------------------
-- 1b. Indexes (FK columns used in RLS lookups)
-- -----------------------------------------------------------------------------

CREATE INDEX IF NOT EXISTS idx_household_members_user_id
  ON public.household_members(user_id);

CREATE INDEX IF NOT EXISTS idx_configurations_household_id
  ON public.configurations(household_id);

CREATE INDEX IF NOT EXISTS idx_expenses_configuration_id
  ON public.expenses(configuration_id);

-- -----------------------------------------------------------------------------
-- 2. Helper Function (for RLS policies)
-- -----------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.user_household_ids(user_uuid UUID)
RETURNS SETOF UUID
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT household_id FROM public.household_members WHERE user_id = user_uuid;
$$;

-- -----------------------------------------------------------------------------
-- 3. RLS Policies
-- -----------------------------------------------------------------------------

ALTER TABLE public.households ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.household_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.configurations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;

-- households: SELECT, UPDATE, DELETE — members only; INSERT — any authenticated
CREATE POLICY households_select ON public.households
  FOR SELECT USING (id IN (SELECT public.user_household_ids(auth.uid())));

CREATE POLICY households_update ON public.households
  FOR UPDATE USING (id IN (SELECT public.user_household_ids(auth.uid())));

CREATE POLICY households_delete ON public.households
  FOR DELETE USING (id IN (SELECT public.user_household_ids(auth.uid())));

CREATE POLICY households_insert ON public.households
  FOR INSERT TO authenticated WITH CHECK (true);

-- household_members: SELECT — members; INSERT, UPDATE, DELETE — owners only
CREATE POLICY household_members_select ON public.household_members
  FOR SELECT USING (household_id IN (SELECT public.user_household_ids(auth.uid())));

CREATE POLICY household_members_insert ON public.household_members
  FOR INSERT TO authenticated
  WITH CHECK (
    household_id IN (
      SELECT household_id FROM public.household_members
      WHERE user_id = auth.uid() AND role = 'owner'
    )
  );

CREATE POLICY household_members_update ON public.household_members
  FOR UPDATE USING (
    household_id IN (
      SELECT household_id FROM public.household_members
      WHERE user_id = auth.uid() AND role = 'owner'
    )
  );

CREATE POLICY household_members_delete ON public.household_members
  FOR DELETE USING (
    household_id IN (
      SELECT household_id FROM public.household_members
      WHERE user_id = auth.uid() AND role = 'owner'
    )
  );

-- configurations: full CRUD for household members
CREATE POLICY configurations_select ON public.configurations
  FOR SELECT USING (household_id IN (SELECT public.user_household_ids(auth.uid())));

CREATE POLICY configurations_insert ON public.configurations
  FOR INSERT TO authenticated WITH CHECK (household_id IN (SELECT public.user_household_ids(auth.uid())));

CREATE POLICY configurations_update ON public.configurations
  FOR UPDATE TO authenticated USING (household_id IN (SELECT public.user_household_ids(auth.uid())));

CREATE POLICY configurations_delete ON public.configurations
  FOR DELETE TO authenticated USING (household_id IN (SELECT public.user_household_ids(auth.uid())));

-- expenses: full CRUD via configuration ownership
CREATE POLICY expenses_select ON public.expenses
  FOR SELECT USING (
    configuration_id IN (
      SELECT id FROM public.configurations
      WHERE household_id IN (SELECT public.user_household_ids(auth.uid()))
    )
  );

CREATE POLICY expenses_insert ON public.expenses
  FOR INSERT TO authenticated WITH CHECK (
    configuration_id IN (
      SELECT id FROM public.configurations
      WHERE household_id IN (SELECT public.user_household_ids(auth.uid()))
    )
  );

CREATE POLICY expenses_update ON public.expenses
  FOR UPDATE TO authenticated USING (
    configuration_id IN (
      SELECT id FROM public.configurations
      WHERE household_id IN (SELECT public.user_household_ids(auth.uid()))
    )
  );

CREATE POLICY expenses_delete ON public.expenses
  FOR DELETE TO authenticated USING (
    configuration_id IN (
      SELECT id FROM public.configurations
      WHERE household_id IN (SELECT public.user_household_ids(auth.uid()))
    )
  );

-- -----------------------------------------------------------------------------
-- 4. Auto-Create Trigger (new user → household + membership)
-- -----------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_household_id UUID;
BEGIN
  INSERT INTO public.households (name, currency)
  VALUES ('My Household', 'USD')
  RETURNING id INTO new_household_id;

  INSERT INTO public.household_members (household_id, user_id, role)
  VALUES (new_household_id, NEW.id, 'owner');

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- -----------------------------------------------------------------------------
-- 5. updated_at Trigger (reusable)
-- -----------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS households_updated_at ON public.households;
CREATE TRIGGER households_updated_at
  BEFORE UPDATE ON public.households
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

DROP TRIGGER IF EXISTS configurations_updated_at ON public.configurations;
CREATE TRIGGER configurations_updated_at
  BEFORE UPDATE ON public.configurations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

DROP TRIGGER IF EXISTS expenses_updated_at ON public.expenses;
CREATE TRIGGER expenses_updated_at
  BEFORE UPDATE ON public.expenses
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

-- -----------------------------------------------------------------------------
-- DOWN
-- -----------------------------------------------------------------------------
-- Run this section manually to roll back. Order: triggers, tables, functions.
-- -----------------------------------------------------------------------------

/*
-- Drop triggers (auth schema)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Drop triggers (public schema)
DROP TRIGGER IF EXISTS households_updated_at ON public.households;
DROP TRIGGER IF EXISTS configurations_updated_at ON public.configurations;
DROP TRIGGER IF EXISTS expenses_updated_at ON public.expenses;

-- Drop tables (reverse dependency order)
DROP TABLE IF EXISTS public.expenses;
DROP TABLE IF EXISTS public.configurations;
DROP TABLE IF EXISTS public.household_members;
DROP TABLE IF EXISTS public.households;

-- Drop functions
DROP FUNCTION IF EXISTS public.update_updated_at();
DROP FUNCTION IF EXISTS public.handle_new_user();
DROP FUNCTION IF EXISTS public.user_household_ids(UUID);
*/
