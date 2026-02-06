"use client";

import { useEffect, useRef, useState } from "react";
import { useCalculator } from "@/lib/hooks/use-calculator";
import {
  shareViaBackend,
  buildLegacyShareUrl,
  loadFromShareId,
  type ShareState,
} from "@/lib/calculator/share";
import type { ExpenseInput } from "@/lib/calculator/types";
import { validateForm } from "@/lib/calculator/validation";
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
import { IncomeSection } from "./income-section";
import { ExpensesSection } from "./expenses-section";
import { NamesSection } from "./names-section";
import { ResultsView } from "./results-view";
import { Snackbar } from "@/components/ui/snackbar";
import { logger } from "@/lib/utils/logger";

const SNACKBAR_MESSAGE = "Calculation link copied to clipboard!";
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
    onDataRestored: () => {
      returningUserRef.current = true;
      setDataRestored(true);
    },
  });

  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [saveState, setSaveState] = useState<
    "idle" | "saving" | "saved" | "error"
  >("idle");
  const resultsHeadingRef = useRef<HTMLHeadingElement>(null);

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

  // URL param loading (?config=, ?id=, or legacy params) — runs after mount, overrides localStorage
  useEffect(() => {
    let cancelled = false;

    const params = new URLSearchParams(
      typeof window !== "undefined" ? window.location.search : ""
    );
    const configId = params.get("config");
    const id = params.get("id");

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

    // ?config= takes precedence over ?id=
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

    if (id) {
      loadFromShareId(id)
        .then((data) => {
          if (cancelled) return;
          const name1 = data.name1 || "";
          const name2 = data.name2 || "";
          const salary1 = data.salary1 || "";
          const salary2 = data.salary2 || "";
          const expenses = Array.isArray(data.expenses)
            ? data.expenses.map((e) => ({
                id: crypto.randomUUID(),
                amount: e.amount || "",
                label: e.label || "",
              }))
            : [{ id: crypto.randomUUID(), amount: "", label: "" }];

          dispatch({
            type: "RESTORE_STATE",
            state: {
              person1Name: name1,
              person2Name: name2,
              person1Salary: salary1,
              person2Salary: salary2,
              expenses,
            },
          });
          if (data.currency) {
            setCurrency(data.currency);
          }

          const expensesWithAmount = expenses.filter(
            (e) => e.amount.replace(/,/g, "").trim() !== ""
          );
          fireDataRestored({
            has_names: !!(name1.trim() || name2.trim()),
            has_salaries: !!(salary1.replace(/,/g, "").trim() || salary2.replace(/,/g, "").trim()),
            has_expenses: expensesWithAmount.length > 0,
            expense_count: expensesWithAmount.length,
          });
        })
        .catch((err) => {
          if (cancelled) return;
          logger.error("Failed to load shared configuration", err);
          setErrorMessage(
            "Could not load shared link. Please check the URL and try again."
          );
        });
      return () => {
        cancelled = true;
      };
    }

    const name1 = params.get("name1");
    const salary1 = params.get("salary1");
    if (name1 || salary1) {
      const expensesRaw = params.get("expenses");
      let expenses: ExpenseInput[] = [
        { id: crypto.randomUUID(), amount: "", label: "" },
      ];

      if (expensesRaw) {
        try {
          const parsed = JSON.parse(expensesRaw);
          if (Array.isArray(parsed)) {
            expenses = parsed.map(
              (e: { amount?: string; label?: string }) => ({
                id: crypto.randomUUID(),
                amount: e.amount || "",
                label: e.label || "",
              })
            );
          }
        } catch {
          // Ignore parse errors
        }
      }

      const person1Name = params.get("name1") || "";
      const person2Name = params.get("name2") || "";
      const person1Salary = params.get("salary1") || "";
      const person2Salary = params.get("salary2") || "";

      dispatch({
        type: "RESTORE_STATE",
        state: {
          person1Name,
          person2Name,
          person1Salary,
          person2Salary,
          expenses,
        },
      });

      const currencyParam = params.get("currency");
      if (currencyParam) setCurrency(currencyParam);

      const expensesWithAmount = expenses.filter(
        (e) => e.amount.replace(/,/g, "").trim() !== ""
      );
      fireDataRestored({
        has_names: !!(person1Name.trim() || person2Name.trim()),
        has_salaries: !!(person1Salary.replace(/,/g, "").trim() || person2Salary.replace(/,/g, "").trim()),
        has_expenses: expensesWithAmount.length > 0,
        expense_count: expensesWithAmount.length,
      });
    }
  }, [dispatch, setCurrency]);

  const handleCalculate = () => {
    trackEvent("calculate_clicked");

    const calcResult = calculate();

    if (!calcResult) {
      const validation = validateForm(state);
      const errs = validation.errors;
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
    const expensesPayload = state.expenses
      .filter((e) => e.amount.replace(/,/g, "").trim() !== "" && (e.label || "").trim() !== "")
      .map((e) => ({
        label: (e.label || "Expense").trim(),
        amount: parseFloat(e.amount.replace(/,/g, "")) || 0,
      }));

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

  const handleShare = async () => {
    const shareState: ShareState = {
      name1: state.person1Name,
      name2: state.person2Name,
      salary1: state.person1Salary,
      salary2: state.person2Salary,
      expenses: state.expenses
        .filter((e) => e.amount.replace(/,/g, "").trim() !== "")
        .map((e) => ({ amount: e.amount, label: e.label || "Expense" })),
      currency: currency.code,
    };

    try {
      const shareUrl = await shareViaBackend(shareState);
      await navigator.clipboard.writeText(shareUrl);
      trackEvent("share_results", { method: "copy_link" });
      setSnackbarVisible(true);
    } catch {
      try {
        const legacyUrl = buildLegacyShareUrl(shareState);
        await navigator.clipboard.writeText(legacyUrl);
        trackEvent("share_results", { method: "copy_link" });
        setSnackbarVisible(true);
      } catch (err) {
        logger.error("Failed to copy share link", err);
        setErrorMessage("Could not copy link. Please try again.");
      }
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
            onShare={handleShare}
            onSave={authEnabled ? handleSave : undefined}
            saveState={authEnabled ? saveState : "idle"}
            resultsHeadingRef={resultsHeadingRef}
          />
        </div>
        <Snackbar
          message={SNACKBAR_MESSAGE}
          visible={snackbarVisible}
          onHide={() => setSnackbarVisible(false)}
          duration={3000}
        />
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
          person1Salary={state.person1Salary}
          person2Salary={state.person2Salary}
          person1SalaryVisible={state.person1SalaryVisible}
          person2SalaryVisible={state.person2SalaryVisible}
          person1Error={getError("person1Salary")}
          person2Error={getError("person2Salary")}
          prefilledSalaries={dataRestored}
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

        <NamesSection
          person1Name={state.person1Name}
          person2Name={state.person2Name}
          person1Error={getError("person1Name")}
          person2Error={getError("person2Name")}
          prefilledNames={dataRestored}
          onPerson1NameChange={(v) =>
            dispatch({ type: "SET_PERSON1_NAME", value: v })
          }
          onPerson2NameChange={(v) =>
            dispatch({ type: "SET_PERSON2_NAME", value: v })
          }
          onCalculate={handleCalculate}
        />
      </div>
      <Snackbar
        message={SNACKBAR_MESSAGE}
        visible={snackbarVisible}
        onHide={() => setSnackbarVisible(false)}
        duration={3000}
      />
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
