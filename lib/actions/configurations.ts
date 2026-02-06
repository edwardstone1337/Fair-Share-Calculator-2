"use server";

import { createClient } from "@/lib/supabase/server";
import { logger } from "@/lib/utils/logger";

export interface ConfigSummary {
  id: string;
  name: string;
  person1Name: string;
  person2Name: string;
  totalExpenses: number;
  expenseCount: number;
  currency: string;
  createdAt: string;
  updatedAt: string;
}

export interface ConfigDetail extends ConfigSummary {
  person1Salary: number;
  person2Salary: number;
  expenses: {
    id: string;
    label: string;
    amount: number;
    sortOrder: number;
  }[];
}

export interface SaveConfigInput {
  name?: string;
  person1Name: string;
  person2Name: string;
  person1Salary: number;
  person2Salary: number;
  expenses: { label: string; amount: number }[];
  currency: string;
}

export type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string };

const AUTH_ERROR = "Not authenticated.";
const HOUSEHOLD_ERROR = "Household not found.";
const CONFIG_NOT_FOUND = "Configuration not found.";
const CONFIG_LIMIT_ERROR =
  "Configuration limit reached (max 10). Delete a saved configuration to make room.";
const DB_ERROR = "Something went wrong. Please try again.";

async function getHouseholdId(): Promise<ActionResult<string>> {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError) {
    logger.error("configurations: auth getUser failed", authError);
    return { success: false, error: AUTH_ERROR };
  }
  if (!user) return { success: false, error: AUTH_ERROR };

  const { data: member, error: memberError } = await supabase
    .from("household_members")
    .select("household_id")
    .eq("user_id", user.id)
    .limit(1)
    .maybeSingle();

  if (memberError) {
    logger.error("configurations: household_members select failed", memberError);
    return { success: false, error: DB_ERROR };
  }
  if (!member?.household_id) return { success: false, error: HOUSEHOLD_ERROR };
  return { success: true, data: member.household_id };
}

export async function saveConfiguration(
  input: SaveConfigInput
): Promise<ActionResult<{ id: string }>> {
  const householdResult = await getHouseholdId();
  if (!householdResult.success) return householdResult;
  const householdId = householdResult.data;

  const name =
    input.name?.trim() ||
    new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const supabase = await createClient();
  try {
    const { data: config, error: configError } = await supabase
      .from("configurations")
      .insert({
        household_id: householdId,
        name,
        person_1_name: input.person1Name,
        person_2_name: input.person2Name,
        person_1_salary: input.person1Salary,
        person_2_salary: input.person2Salary,
        currency: input.currency,
      })
      .select("id")
      .single();

    if (configError) {
      if (configError.code === "23514") {
        return { success: false, error: CONFIG_LIMIT_ERROR };
      }
      logger.error("configurations: saveConfiguration insert failed", configError);
      return { success: false, error: DB_ERROR };
    }
    if (!config?.id) {
      logger.error("configurations: saveConfiguration no id returned");
      return { success: false, error: DB_ERROR };
    }

    if (input.expenses.length > 0) {
      const expenseRows = input.expenses.map((e, i) => ({
        configuration_id: config.id,
        label: e.label,
        amount: e.amount,
        sort_order: i,
      }));
      const { error: expensesError } = await supabase
        .from("expenses")
        .insert(expenseRows);
      if (expensesError) {
        logger.error("configurations: saveConfiguration expenses insert failed", expensesError);
        return { success: false, error: DB_ERROR };
      }
    }

    return { success: true, data: { id: config.id } };
  } catch (err) {
    logger.error("configurations: saveConfiguration threw", err);
    return { success: false, error: DB_ERROR };
  }
}

export async function listConfigurations(): Promise<
  ActionResult<ConfigSummary[]>
> {
  const householdResult = await getHouseholdId();
  if (!householdResult.success) return householdResult;

  const supabase = await createClient();
  try {
    const { data: configs, error: configsError } = await supabase
      .from("configurations")
      .select("id, name, person_1_name, person_2_name, currency, created_at, updated_at")
      .order("updated_at", { ascending: false });

    if (configsError) {
      logger.error("configurations: listConfigurations failed", configsError);
      return { success: false, error: DB_ERROR };
    }
    if (!configs?.length) return { success: true, data: [] };

    const configIds = configs.map((c) => c.id);
    const { data: expenseRows, error: expensesError } = await supabase
      .from("expenses")
      .select("configuration_id, amount")
      .in("configuration_id", configIds);

    if (expensesError) {
      logger.error("configurations: listConfigurations expenses failed", expensesError);
      return { success: false, error: DB_ERROR };
    }

    const byConfig: Record<
      string,
      { total: number; count: number }
    > = {};
    for (const c of configIds) {
      byConfig[c] = { total: 0, count: 0 };
    }
    for (const row of expenseRows ?? []) {
      const k = row.configuration_id;
      if (byConfig[k] !== undefined) {
        byConfig[k].total += Number(row.amount);
        byConfig[k].count += 1;
      }
    }

    const list: ConfigSummary[] = configs.map((c) => ({
      id: c.id,
      name: c.name,
      person1Name: c.person_1_name,
      person2Name: c.person_2_name,
      totalExpenses: byConfig[c.id]?.total ?? 0,
      expenseCount: byConfig[c.id]?.count ?? 0,
      currency: c.currency,
      createdAt: c.created_at,
      updatedAt: c.updated_at,
    }));

    return { success: true, data: list };
  } catch (err) {
    logger.error("configurations: listConfigurations threw", err);
    return { success: false, error: DB_ERROR };
  }
}

export async function getConfiguration(
  configId: string
): Promise<ActionResult<ConfigDetail>> {
  const householdResult = await getHouseholdId();
  if (!householdResult.success) return householdResult;

  const supabase = await createClient();
  try {
    const { data: config, error: configError } = await supabase
      .from("configurations")
      .select("*")
      .eq("id", configId)
      .maybeSingle();

    if (configError) {
      logger.error("configurations: getConfiguration failed", configError);
      return { success: false, error: DB_ERROR };
    }
    if (!config) return { success: false, error: CONFIG_NOT_FOUND };

    const { data: expenseRows, error: expensesError } = await supabase
      .from("expenses")
      .select("id, label, amount, sort_order")
      .eq("configuration_id", configId)
      .order("sort_order", { ascending: true });

    if (expensesError) {
      logger.error("configurations: getConfiguration expenses failed", expensesError);
      return { success: false, error: DB_ERROR };
    }

    const expenses = (expenseRows ?? []).map((e) => ({
      id: e.id,
      label: e.label,
      amount: Number(e.amount),
      sortOrder: e.sort_order,
    }));

    const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);

    const detail: ConfigDetail = {
      id: config.id,
      name: config.name,
      person1Name: config.person_1_name,
      person2Name: config.person_2_name,
      person1Salary: Number(config.person_1_salary),
      person2Salary: Number(config.person_2_salary),
      totalExpenses,
      expenseCount: expenses.length,
      currency: config.currency,
      createdAt: config.created_at,
      updatedAt: config.updated_at,
      expenses,
    };

    return { success: true, data: detail };
  } catch (err) {
    logger.error("configurations: getConfiguration threw", err);
    return { success: false, error: DB_ERROR };
  }
}

export async function renameConfiguration(
  configId: string,
  newName: string
): Promise<ActionResult> {
  const trimmed = newName.trim();
  if (!trimmed) {
    return { success: false, error: "Name cannot be empty." };
  }
  if (trimmed.length > 100) {
    return { success: false, error: "Name must be 100 characters or less." };
  }

  const householdResult = await getHouseholdId();
  if (!householdResult.success) return householdResult;

  const supabase = await createClient();
  try {
    const { data, error } = await supabase
      .from("configurations")
      .update({ name: trimmed })
      .eq("id", configId)
      .select("id")
      .maybeSingle();

    if (error) {
      logger.error("configurations: renameConfiguration failed", error);
      return { success: false, error: DB_ERROR };
    }
    if (!data) return { success: false, error: CONFIG_NOT_FOUND };
    return { success: true, data: undefined };
  } catch (err) {
    logger.error("configurations: renameConfiguration threw", err);
    return { success: false, error: DB_ERROR };
  }
}

export async function deleteConfiguration(
  configId: string
): Promise<ActionResult> {
  const householdResult = await getHouseholdId();
  if (!householdResult.success) return householdResult;

  const supabase = await createClient();
  try {
    const { error: expensesError } = await supabase
      .from("expenses")
      .update({ deleted_at: new Date().toISOString() })
      .eq("configuration_id", configId);

    if (expensesError) {
      logger.error("configurations: deleteConfiguration expenses update failed", expensesError);
      return { success: false, error: DB_ERROR };
    }

    const { data, error } = await supabase
      .from("configurations")
      .update({ deleted_at: new Date().toISOString() })
      .eq("id", configId)
      .select("id")
      .maybeSingle();

    if (error) {
      logger.error("configurations: deleteConfiguration failed", error);
      return { success: false, error: DB_ERROR };
    }
    if (!data) return { success: false, error: CONFIG_NOT_FOUND };
    return { success: true, data: undefined };
  } catch (err) {
    logger.error("configurations: deleteConfiguration threw", err);
    return { success: false, error: DB_ERROR };
  }
}
