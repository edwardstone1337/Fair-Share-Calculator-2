"use server";

import { createClient } from "@/lib/supabase/server";
import { logger } from "@/lib/utils/logger";

export type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string };

const AUTH_ERROR = "Not authenticated.";
const HOUSEHOLD_ERROR = "Household not found.";
const DB_ERROR = "Something went wrong. Please try again.";
const INVALID_CURRENCY = "Currency must be a 3-letter uppercase code (e.g. USD).";

async function getHouseholdId(): Promise<ActionResult<string>> {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError) {
    logger.error("user-preferences: auth getUser failed", authError);
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
    logger.error("user-preferences: household_members select failed", memberError);
    return { success: false, error: DB_ERROR };
  }
  if (!member?.household_id) return { success: false, error: HOUSEHOLD_ERROR };
  return { success: true, data: member.household_id };
}

export async function getCurrencyPreference(): Promise<ActionResult<string>> {
  const householdResult = await getHouseholdId();
  if (!householdResult.success) return householdResult;
  const householdId = householdResult.data;

  const supabase = await createClient();
  try {
    const { data, error } = await supabase
      .from("households")
      .select("currency")
      .eq("id", householdId)
      .maybeSingle();

    if (error) {
      logger.error("user-preferences: getCurrencyPreference failed", error);
      return { success: false, error: DB_ERROR };
    }
    if (!data) return { success: false, error: HOUSEHOLD_ERROR };
    return { success: true, data: data.currency ?? "USD" };
  } catch (err) {
    logger.error("user-preferences: getCurrencyPreference threw", err);
    return { success: false, error: DB_ERROR };
  }
}

function isValidCurrencyCode(code: string): boolean {
  return (
    typeof code === "string" &&
    code.length === 3 &&
    /^[A-Z]{3}$/.test(code)
  );
}

export async function setCurrencyPreference(
  currencyCode: string
): Promise<ActionResult> {
  if (!isValidCurrencyCode(currencyCode)) {
    return { success: false, error: INVALID_CURRENCY };
  }

  const householdResult = await getHouseholdId();
  if (!householdResult.success) return householdResult;
  const householdId = householdResult.data;

  const supabase = await createClient();
  try {
    const { error } = await supabase
      .from("households")
      .update({ currency: currencyCode })
      .eq("id", householdId);

    if (error) {
      logger.error("user-preferences: setCurrencyPreference failed", error);
      return { success: false, error: DB_ERROR };
    }
    return { success: true, data: undefined };
  } catch (err) {
    logger.error("user-preferences: setCurrencyPreference threw", err);
    return { success: false, error: DB_ERROR };
  }
}
