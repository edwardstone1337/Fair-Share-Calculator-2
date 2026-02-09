"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useCalculator } from "@/lib/hooks/use-calculator";
import type { ExpenseInput } from "@/lib/calculator/types";
import { validateForm } from "@/lib/calculator/validation";
import { scrollToFirstError } from "@/lib/calculator/scroll-to-error";
import {
  trackEvent,
  bucketExpenseAmount,
  bucketSplitRatio,
} from "@/lib/analytics/gtag";
import { useCurrency } from "@/lib/contexts/currency-context";
import { createClient } from "@/lib/supabase/client";
import {
  saveConfiguration,
  getConfiguration,
} from "@/lib/actions/configurations";
import { formatWithCommas } from "@/lib/utils/format";
import { buildExpensesPayload } from "@/lib/calculator/save-payload";
import { IncomeSection } from "./income-section";
import { ExpensesSection } from "./expenses-section";
import { ResultsView } from "./results-view";
import { ValidationSummary } from "./validation-summary";
import { Button } from "@/components/ui/button";
import { Snackbar } from "@/components/ui/snackbar";
import { logger } from "@/lib/utils/logger";

const authEnabled = process.env.NEXT_PUBLIC_AUTH_ENABLED === "true";

export function CalculatorClient() {
  const pageLoadTime = useRef(Date.now());
  const returningUserRef = useRef(false);
  const [dataRestored, setDataRestored] = useState(false);

  const { currency, setCurrency } = useCurrency();
  const {
    state,
    dispatch,
    calculate,
    result,
    getError,
  } = useCalculator({
    onDataRestored: useCallback(() => {
      returningUserRef.current = true;
      setDataRestored(true);
    }, []),
  });

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [saveState, setSaveState] = useState<
    "idle" | "saving" | "saved" | "error"
  >("idle");
  const resultsHeadingRef = useRef<HTMLHeadingElement>(null);
  const scrollToErrorTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Clean up scroll-to-error timeout on unmount
  useEffect(() => {
    return () => {
      if (scrollToErrorTimeoutRef.current !== null) {
        clearTimeout(scrollToErrorTimeoutRef.current);
        scrollToErrorTimeoutRef.current = null;
      }
    };
  }, []);

  const scheduleScrollToError = (errors: { field: string; message: string }[]) => {
    if (scrollToErrorTimeoutRef.current !== null) {
      clearTimeout(scrollToErrorTimeoutRef.current);
    }
    scrollToErrorTimeoutRef.current = scrollToFirstError(errors);
  };

  // Sync step with URL hash on mount
  useEffect(() => {
    const stepFromHash =
      typeof window !== "undefined" && window.location.hash === "#results"
        ? "results"
        : "input";
    dispatch({ type: "SET_STEP", step: stepFromHash });
  }, [dispatch]);

  // Browser back/forward: update step from hash
  useEffect(() => {
    const handlePopState = () => {
      const step =
        window.location.hash === "#results" ? "results" : "input";
      dispatch({ type: "SET_STEP", step });
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [dispatch]);

  // If step is results but we have no result (e.g. landed on #results), sync back to input
  useEffect(() => {
    if (state.step === "results" && !result && typeof window !== "undefined") {
      if (window.location.hash === "#results") {
        window.history.replaceState({ step: "input" }, "", "#input");
      }
      dispatch({ type: "SET_STEP", step: "input" });
    }
  }, [state.step, result, dispatch]);

  // URL param loading (?config=) — runs after mount, overrides localStorage
  useEffect(() => {
    let cancelled = false;

    const params = new URLSearchParams(
      typeof window !== "undefined" ? window.location.search : ""
    );
    const configId = params.get("config");

    const fireDataRestored = (payload: {
      has_names: boolean;
      has_salaries: boolean;
      has_expenses: boolean;
      expense_count: number;
    }) => {
      trackEvent("data_restored", payload);
      returningUserRef.current = true;
      setDataRestored(true);
    };

    const cleanConfigParam = () => {
      if (typeof window === "undefined") return;
      const url = new URL(window.location.href);
      url.searchParams.delete("config");
      const newUrl =
        url.pathname + (url.search ? url.search : "") + url.hash;
      window.history.replaceState(null, "", newUrl);
    };

    if (configId) {
      getConfiguration(configId)
        .then((result) => {
          if (cancelled) return;
          if (result.success && result.data) {
            const detail = result.data;
            const expenses: ExpenseInput[] =
              detail.expenses.length > 0
                ? detail.expenses.map((e) => ({
                    id: e.id,
                    label: e.label,
                    amount: formatWithCommas(String(e.amount)),
                  }))
                : [{ id: crypto.randomUUID(), amount: "", label: "" }];
            dispatch({
              type: "RESTORE_STATE",
              state: {
                person1Name: detail.person1Name,
                person2Name: detail.person2Name,
                person1Salary: formatWithCommas(String(detail.person1Salary)),
                person2Salary: formatWithCommas(String(detail.person2Salary)),
                expenses,
              },
            });
            dispatch({ type: "SET_STEP", step: "input" });
            if (detail.currency) setCurrency(detail.currency);
            const expensesWithAmount = expenses.filter(
              (e) => e.amount.replace(/,/g, "").trim() !== ""
            );
            fireDataRestored({
              has_names: !!(detail.person1Name?.trim() || detail.person2Name?.trim()),
              has_salaries: true,
              has_expenses: expensesWithAmount.length > 0,
              expense_count: expensesWithAmount.length,
            });
          } else {
            setErrorMessage(
              !result.success ? (result.error ?? "Could not load configuration.") : null
            );
          }
          cleanConfigParam();
        })
        .catch((err) => {
          if (cancelled) return;
          logger.error("Failed to load configuration", err);
          setErrorMessage("Could not load configuration. Please try again.");
          cleanConfigParam();
        });
      return () => {
        cancelled = true;
      };
    }
  }, [dispatch, setCurrency]);

  const handleCalculate = () => {
    trackEvent("calculate_clicked");

    const calcResult = calculate();

    if (!calcResult) {
      const validation = validateForm(state);
      const errs = validation.errors;

      // Submit-time validation_error (field-level detail); GA4 params are string or number
      const errorFields = errs.map((e) => e.field).join(",");
      const errorTypeSet = new Set<string>();
      for (const e of errs) {
        if (e.field === "expenses-global") errorTypeSet.add("missing_expense");
        else if (e.field === "person1Salary" || e.field === "person2Salary")
          errorTypeSet.add("missing");
        else if (e.field.startsWith("expense-")) errorTypeSet.add("invalid_format");
        else if (e.field === "person1Name" || e.field === "person2Name")
          errorTypeSet.add("name_too_long");
      }
      const errorTypes = [...errorTypeSet].join(",");

      trackEvent("validation_error", {
        error_count: errs.length,
        error_fields: errorFields,
        error_types: errorTypes,
        returning_user: returningUserRef.current,
      });

      const hasExpenseError = errs.some((e) => e.field.startsWith("expense"));
      const hasSalaryError = errs.some(
        (e) => e.field.startsWith("person") && e.field.includes("Salary")
      );
      const noExpenses = errs.some((e) => e.field === "expenses-global");

      let errorType = "validation_error";
      if (noExpenses) errorType = "missing_expense";
      else if (hasSalaryError) errorType = "missing_salary";

      trackEvent("calculate_attempt", {
        status: "error",
        error_type: errorType,
        returning_user: returningUserRef.current,
      });
      scheduleScrollToError(errs);
      return;
    }

    trackEvent("calculate_attempt", {
      status: "success",
      expense_count: calcResult.expenseBreakdown.length,
      has_names:
        calcResult.person1Name !== "Person 1" ||
        calcResult.person2Name !== "Person 2",
      has_labels: calcResult.expenseBreakdown.some((e) => e.label !== "Expense"),
      total_expense_bucket: bucketExpenseAmount(calcResult.totalExpenses),
      time_to_calculate_ms: Date.now() - pageLoadTime.current,
      returning_user: returningUserRef.current,
    });

    trackEvent("results_viewed", {
      expense_count: calcResult.expenseBreakdown.length,
      has_names:
        calcResult.person1Name !== "Person 1" ||
        calcResult.person2Name !== "Person 2",
      has_labels: calcResult.expenseBreakdown.some((e) => e.label !== "Expense"),
      total_expense_bucket: bucketExpenseAmount(calcResult.totalExpenses),
      split_ratio_bucket: bucketSplitRatio(
        calcResult.person1Salary,
        calcResult.person2Salary
      ),
      returning_user: returningUserRef.current,
    });

    if (typeof history !== "undefined") {
      history.pushState({ step: "results" }, "", "#results");
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
    requestAnimationFrame(() => {
      resultsHeadingRef.current?.focus();
    });
  };

  const handleBackToEdit = () => {
    setSaveState("idle");
    if (typeof history !== "undefined") {
      history.pushState({ step: "input" }, "", "#input");
    }
    dispatch({ type: "SET_STEP", step: "input" });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSave = async () => {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      try {
        localStorage.setItem("fairshare_pending_save", "true");
      } catch {
        // Ignore localStorage errors
      }
      window.location.href = "/login";
      return;
    }

    setSaveState("saving");
    const expensesPayload = buildExpensesPayload(state.expenses);

    const result = await saveConfiguration({
      person1Name: state.person1Name,
      person2Name: state.person2Name,
      person1Salary: parseFloat(state.person1Salary.replace(/,/g, "")) || 0,
      person2Salary: parseFloat(state.person2Salary.replace(/,/g, "")) || 0,
      expenses: expensesPayload,
      currency: currency.code,
    });

    if (result.success) {
      setSaveState("saved");
    } else {
      setSaveState("error");
      setErrorMessage(result.error ?? "Could not save configuration.");
    }
  };

  const resultWithCurrency = result
    ? { ...result, currencySymbol: currency.symbol }
    : null;

  // Show results only when we have a result (avoid showing empty results on #results bookmark)
  if (state.step === "results" && resultWithCurrency) {
    return (
      <>
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
          <ResultsView
            result={resultWithCurrency}
            onBackToEdit={handleBackToEdit}
            onSave={authEnabled ? handleSave : undefined}
            saveState={authEnabled ? saveState : "idle"}
            resultsHeadingRef={resultsHeadingRef}
          />
        </div>
        <Snackbar
          message={errorMessage ?? ""}
          visible={!!errorMessage}
          onHide={() => setErrorMessage(null)}
          duration={4000}
          variant="error"
        />
      </>
    );
  }

  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "var(--space-4)",
        }}
      >
        <IncomeSection
          person1Name={state.person1Name}
          person2Name={state.person2Name}
          person1NameError={getError("person1Name")}
          person2NameError={getError("person2Name")}
          person1Salary={state.person1Salary}
          person2Salary={state.person2Salary}
          person1SalaryVisible={state.person1SalaryVisible}
          person2SalaryVisible={state.person2SalaryVisible}
          person1Error={getError("person1Salary")}
          person2Error={getError("person2Salary")}
          prefilledSalaries={dataRestored}
          prefilledNames={dataRestored}
          onPerson1NameChange={(v) =>
            dispatch({ type: "SET_PERSON1_NAME", value: v })
          }
          onPerson2NameChange={(v) =>
            dispatch({ type: "SET_PERSON2_NAME", value: v })
          }
          onPerson1SalaryChange={(v) =>
            dispatch({ type: "SET_PERSON1_SALARY", value: v })
          }
          onPerson2SalaryChange={(v) =>
            dispatch({ type: "SET_PERSON2_SALARY", value: v })
          }
          onTogglePerson1Visibility={() =>
            dispatch({ type: "TOGGLE_PERSON1_SALARY_VISIBILITY" })
          }
          onTogglePerson2Visibility={() =>
            dispatch({ type: "TOGGLE_PERSON2_SALARY_VISIBILITY" })
          }
          onCalculate={handleCalculate}
        />

        <ExpensesSection
          expenses={state.expenses}
          errors={state.validationErrors}
          globalError={getError("expenses-global")}
          prefilledExpenses={dataRestored}
          onAmountChange={(id, v) =>
            dispatch({ type: "SET_EXPENSE_AMOUNT", id, value: v })
          }
          onLabelChange={(id, v) =>
            dispatch({ type: "SET_EXPENSE_LABEL", id, value: v })
          }
          onAddExpense={() => {
            trackEvent("add_expense_clicked");
            dispatch({ type: "ADD_EXPENSE" });
            trackEvent("expense_added", {
              expense_count_after: state.expenses.length + 1,
              expense_row_index: state.expenses.length,
            });
          }}
          onDeleteExpense={(id) => {
            trackEvent("delete_expense_clicked");
            const index = state.expenses.findIndex((e) => e.id === id);
            dispatch({ type: "DELETE_EXPENSE", id });
            trackEvent("expense_deleted", {
              expense_count_after: state.expenses.length - 1,
              expense_row_index: index,
            });
          }}
          onCalculate={handleCalculate}
        />

        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
          <Button type="button" variant="primary" fullWidth onClick={handleCalculate}>
            Calculate
          </Button>
          <ValidationSummary
            errors={state.validationErrors}
            onTap={() => scheduleScrollToError(state.validationErrors)}
          />
        </div>
      </div>
      <Snackbar
        message={errorMessage ?? ""}
        visible={!!errorMessage}
        onHide={() => setErrorMessage(null)}
        duration={4000}
        variant="error"
      />
    </>
  );
}
