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
import { IncomeSection } from "./income-section";
import { ExpensesSection } from "./expenses-section";
import { NamesSection } from "./names-section";
import { ResultsView } from "./results-view";
import { Snackbar } from "@/components/ui/snackbar";
import { logger } from "@/lib/utils/logger";

const SNACKBAR_MESSAGE = "Calculation link copied to clipboard!";

export function CalculatorClient() {
  const {
    state,
    dispatch,
    calculate,
    backToEdit,
    result,
    getError,
  } = useCalculator();

  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
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

  // URL param loading (?id= or legacy params) — runs after mount, overrides localStorage
  useEffect(() => {
    const params = new URLSearchParams(
      typeof window !== "undefined" ? window.location.search : ""
    );
    const id = params.get("id");

    if (id) {
      loadFromShareId(id)
        .then((data) => {
          dispatch({
            type: "RESTORE_STATE",
            state: {
              person1Name: data.name1 || "",
              person2Name: data.name2 || "",
              person1Salary: data.salary1 || "",
              person2Salary: data.salary2 || "",
              expenses: Array.isArray(data.expenses)
                ? data.expenses.map((e) => ({
                    id: crypto.randomUUID(),
                    amount: e.amount || "",
                    label: e.label || "",
                  }))
                : [{ id: crypto.randomUUID(), amount: "", label: "" }],
            },
          });
        })
        .catch((err) => {
          logger.error("Failed to load shared configuration", err);
          setErrorMessage(
            "Could not load shared link. Please check the URL and try again."
          );
        });
      return;
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

      dispatch({
        type: "RESTORE_STATE",
        state: {
          person1Name: params.get("name1") || "",
          person2Name: params.get("name2") || "",
          person1Salary: params.get("salary1") || "",
          person2Salary: params.get("salary2") || "",
          expenses,
        },
      });
    }
  }, [dispatch]);

  const handleCalculate = () => {
    const calcResult = calculate();
    if (calcResult) {
      if (typeof history !== "undefined") {
        history.pushState({ step: "results" }, "", "#results");
      }
      window.scrollTo({ top: 0, behavior: "smooth" });
      requestAnimationFrame(() => {
        resultsHeadingRef.current?.focus();
      });
    }
  };

  const handleBackToEdit = () => {
    if (typeof history !== "undefined") {
      history.pushState({ step: "input" }, "", "#input");
    }
    dispatch({ type: "SET_STEP", step: "input" });
    window.scrollTo({ top: 0, behavior: "smooth" });
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
    };

    try {
      const shareUrl = await shareViaBackend(shareState);
      await navigator.clipboard.writeText(shareUrl);
      setSnackbarVisible(true);
    } catch {
      try {
        const legacyUrl = buildLegacyShareUrl(shareState);
        await navigator.clipboard.writeText(legacyUrl);
        setSnackbarVisible(true);
      } catch (err) {
        logger.error("Failed to copy share link", err);
        setErrorMessage("Could not copy link. Please try again.");
      }
    }
  };

  // Show results only when we have a result (avoid showing empty results on #results bookmark)
  if (state.step === "results" && result) {
    return (
      <>
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
          <ResultsView
            result={result}
            onBackToEdit={handleBackToEdit}
            onShare={handleShare}
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
          onAmountChange={(id, v) =>
            dispatch({ type: "SET_EXPENSE_AMOUNT", id, value: v })
          }
          onLabelChange={(id, v) =>
            dispatch({ type: "SET_EXPENSE_LABEL", id, value: v })
          }
          onAddExpense={() => dispatch({ type: "ADD_EXPENSE" })}
          onDeleteExpense={(id) => dispatch({ type: "DELETE_EXPENSE", id })}
          onCalculate={handleCalculate}
        />

        <NamesSection
          person1Name={state.person1Name}
          person2Name={state.person2Name}
          person1Error={getError("person1Name")}
          person2Error={getError("person2Name")}
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
