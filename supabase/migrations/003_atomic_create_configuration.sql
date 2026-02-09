-- =============================================================================
-- Phase 6b — Atomic configuration+expenses save
-- Fair Share Calculator V2 — Supabase
-- =============================================================================
-- Run manually in Supabase SQL Editor.
-- Adds a transactional RPC used by saveConfiguration to prevent partial writes.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- UP
-- -----------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.create_configuration_with_expenses(
  p_household_id UUID,
  p_name TEXT,
  p_person_1_name TEXT,
  p_person_2_name TEXT,
  p_person_1_salary NUMERIC,
  p_person_2_salary NUMERIC,
  p_currency TEXT,
  p_expenses JSONB
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
DECLARE
  new_config_id UUID;
  expense_item JSONB;
  expense_label TEXT;
  expense_amount NUMERIC;
  expense_index INTEGER := 0;
BEGIN
  IF p_expenses IS NULL
     OR jsonb_typeof(p_expenses) <> 'array'
     OR jsonb_array_length(p_expenses) = 0 THEN
    RAISE EXCEPTION 'At least one expense is required'
      USING ERRCODE = 'check_violation';
  END IF;

  INSERT INTO public.configurations (
    household_id,
    name,
    person_1_name,
    person_2_name,
    person_1_salary,
    person_2_salary,
    currency
  )
  VALUES (
    p_household_id,
    p_name,
    p_person_1_name,
    p_person_2_name,
    p_person_1_salary,
    p_person_2_salary,
    p_currency
  )
  RETURNING id INTO new_config_id;

  FOR expense_item IN
    SELECT value
    FROM jsonb_array_elements(p_expenses)
  LOOP
    expense_label := COALESCE(NULLIF(BTRIM(expense_item->>'label'), ''), 'Expense');
    expense_amount := (expense_item->>'amount')::NUMERIC;

    IF expense_amount IS NULL OR expense_amount <= 0 THEN
      RAISE EXCEPTION 'Expense amount must be greater than zero'
        USING ERRCODE = 'check_violation';
    END IF;

    INSERT INTO public.expenses (
      configuration_id,
      label,
      amount,
      sort_order
    )
    VALUES (
      new_config_id,
      expense_label,
      expense_amount,
      expense_index
    );

    expense_index := expense_index + 1;
  END LOOP;

  RETURN new_config_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.create_configuration_with_expenses(
  UUID, TEXT, TEXT, TEXT, NUMERIC, NUMERIC, TEXT, JSONB
) TO authenticated;

-- -----------------------------------------------------------------------------
-- DOWN
-- -----------------------------------------------------------------------------

/*
REVOKE EXECUTE ON FUNCTION public.create_configuration_with_expenses(
  UUID, TEXT, TEXT, TEXT, NUMERIC, NUMERIC, TEXT, JSONB
) FROM authenticated;

DROP FUNCTION IF EXISTS public.create_configuration_with_expenses(
  UUID, TEXT, TEXT, TEXT, NUMERIC, NUMERIC, TEXT, JSONB
);
*/
