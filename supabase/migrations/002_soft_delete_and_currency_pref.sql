-- =============================================================================
-- Phase 6a — Soft Delete + Currency Preference
-- Fair Share Calculator V2 — Supabase
-- =============================================================================
-- Run manually in Supabase SQL Editor.
-- Adds soft delete columns, updates SELECT policies, enforces max 10 configs per household.
-- Currency preference: households.currency already exists (no new column).
-- =============================================================================

-- -----------------------------------------------------------------------------
-- UP
-- -----------------------------------------------------------------------------

-- -----------------------------------------------------------------------------
-- 1. Soft delete columns
-- -----------------------------------------------------------------------------

ALTER TABLE public.configurations
  ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ DEFAULT NULL;

ALTER TABLE public.expenses
  ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ DEFAULT NULL;

-- Partial index: most queries filter on non-deleted configs
CREATE INDEX IF NOT EXISTS idx_configurations_deleted_at_null
  ON public.configurations(deleted_at)
  WHERE deleted_at IS NULL;

-- -----------------------------------------------------------------------------
-- 2. RLS: drop and recreate SELECT policies (soft delete filter)
-- -----------------------------------------------------------------------------

DROP POLICY IF EXISTS configurations_select ON public.configurations;
CREATE POLICY configurations_select ON public.configurations
  FOR SELECT
  USING (
    household_id IN (SELECT public.user_household_ids(auth.uid()))
    AND deleted_at IS NULL
  );

DROP POLICY IF EXISTS expenses_select ON public.expenses;
CREATE POLICY expenses_select ON public.expenses
  FOR SELECT
  USING (
    configuration_id IN (
      SELECT id FROM public.configurations
      WHERE household_id IN (SELECT public.user_household_ids(auth.uid()))
    )
    AND deleted_at IS NULL
  );

-- -----------------------------------------------------------------------------
-- 3. Max configs per household (10) — BEFORE INSERT trigger
-- -----------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.check_config_limit()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  config_count INTEGER;
BEGIN
  SELECT COUNT(*)
  INTO config_count
  FROM public.configurations
  WHERE household_id = NEW.household_id
    AND deleted_at IS NULL;

  IF config_count >= 10 THEN
    RAISE EXCEPTION 'Household configuration limit reached (max 10)'
      USING ERRCODE = 'check_violation';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trigger_check_config_limit ON public.configurations;
CREATE TRIGGER trigger_check_config_limit
  BEFORE INSERT ON public.configurations
  FOR EACH ROW
  EXECUTE FUNCTION public.check_config_limit();

-- -----------------------------------------------------------------------------
-- DOWN
-- -----------------------------------------------------------------------------
-- Run this section manually to roll back. Order: trigger, function, policies, index, columns.
-- -----------------------------------------------------------------------------

/*
-- Drop trigger and function
DROP TRIGGER IF EXISTS trigger_check_config_limit ON public.configurations;
DROP FUNCTION IF EXISTS public.check_config_limit();

-- Restore original SELECT policies (no deleted_at filter)
DROP POLICY IF EXISTS configurations_select ON public.configurations;
CREATE POLICY configurations_select ON public.configurations
  FOR SELECT USING (household_id IN (SELECT public.user_household_ids(auth.uid())));

DROP POLICY IF EXISTS expenses_select ON public.expenses;
CREATE POLICY expenses_select ON public.expenses
  FOR SELECT USING (
    configuration_id IN (
      SELECT id FROM public.configurations
      WHERE household_id IN (SELECT public.user_household_ids(auth.uid()))
    )
  );

-- Drop index and columns
DROP INDEX IF EXISTS public.idx_configurations_deleted_at_null;
ALTER TABLE public.configurations DROP COLUMN IF EXISTS deleted_at;
ALTER TABLE public.expenses DROP COLUMN IF EXISTS deleted_at;
*/
