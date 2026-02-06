"use client";

import { useReducer, useCallback, useEffect, useRef } from "react";
import {
  CalculatorFormState,
  ExpenseInput,
  FieldError,
  CalculatorResult,
} from "@/lib/calculator/types";
import { validateForm } from "@/lib/calculator/validation";
import {
  calculateShares,
  parseSalary,
  parseExpenseAmount,
} from "@/lib/calculator/compute";
import { formatWithCommas } from "@/lib/utils/format";
import { sanitizeInput } from "@/lib/utils/format";
import { trackEvent } from "@/lib/analytics/gtag";

// --- Initial state ---
function createInitialExpense(): ExpenseInput {
  return { id: crypto.randomUUID(), amount: "", label: "" };
}

const initialState: CalculatorFormState = {
  person1Name: "",
  person2Name: "",
  person1Salary: "",
  person2Salary: "",
  person1SalaryVisible: false,
  person2SalaryVisible: false,
  expenses: [createInitialExpense()],
  step: "input",
  validationErrors: [],
  result: null,
};

// --- Action types ---
type Action =
  | { type: "SET_PERSON1_NAME"; value: string }
  | { type: "SET_PERSON2_NAME"; value: string }
  | { type: "SET_PERSON1_SALARY"; value: string }
  | { type: "SET_PERSON2_SALARY"; value: string }
  | { type: "TOGGLE_PERSON1_SALARY_VISIBILITY" }
  | { type: "TOGGLE_PERSON2_SALARY_VISIBILITY" }
  | { type: "SET_EXPENSE_AMOUNT"; id: string; value: string }
  | { type: "SET_EXPENSE_LABEL"; id: string; value: string }
  | { type: "ADD_EXPENSE" }
  | { type: "DELETE_EXPENSE"; id: string }
  | { type: "SET_STEP"; step: "input" | "results" }
  | { type: "SET_RESULT"; result: CalculatorResult | null }
  | { type: "SET_VALIDATION_ERRORS"; errors: FieldError[] }
  | { type: "RESTORE_STATE"; state: Partial<CalculatorFormState> };

// --- Reducer ---
function calculatorReducer(
  state: CalculatorFormState,
  action: Action
): CalculatorFormState {
  switch (action.type) {
    case "SET_PERSON1_NAME":
      return {
        ...state,
        person1Name: sanitizeInput(action.value, 50),
        validationErrors: [],
      };
    case "SET_PERSON2_NAME":
      return {
        ...state,
        person2Name: sanitizeInput(action.value, 50),
        validationErrors: [],
      };
    case "SET_PERSON1_SALARY":
      return {
        ...state,
        person1Salary: formatWithCommas(action.value),
        validationErrors: [],
      };
    case "SET_PERSON2_SALARY":
      return {
        ...state,
        person2Salary: formatWithCommas(action.value),
        validationErrors: [],
      };
    case "TOGGLE_PERSON1_SALARY_VISIBILITY":
      return { ...state, person1SalaryVisible: !state.person1SalaryVisible };
    case "TOGGLE_PERSON2_SALARY_VISIBILITY":
      return { ...state, person2SalaryVisible: !state.person2SalaryVisible };
    case "SET_EXPENSE_AMOUNT":
      return {
        ...state,
        expenses: state.expenses.map((e) =>
          e.id === action.id
            ? { ...e, amount: formatWithCommas(action.value) }
            : e
        ),
        validationErrors: [],
      };
    case "SET_EXPENSE_LABEL":
      return {
        ...state,
        expenses: state.expenses.map((e) =>
          e.id === action.id
            ? { ...e, label: sanitizeInput(action.value, 1000) }
            : e
        ),
        validationErrors: [],
      };
    case "ADD_EXPENSE":
      return { ...state, expenses: [...state.expenses, createInitialExpense()] };
    case "DELETE_EXPENSE":
      if (state.expenses.length <= 1) return state;
      if (state.expenses[0].id === action.id) return state;
      return {
        ...state,
        expenses: state.expenses.filter((e) => e.id !== action.id),
        validationErrors: [],
      };
    case "SET_STEP":
      return { ...state, step: action.step };
    case "SET_RESULT":
      return { ...state, result: action.result };
    case "SET_VALIDATION_ERRORS":
      return { ...state, validationErrors: action.errors };
    case "RESTORE_STATE": {
      const next = { ...state, ...action.state };
      if (next.validationErrors === undefined) next.validationErrors = [];
      if (next.result === undefined) next.result = null;
      return next;
    }
    default:
      return state;
  }
}

// --- localStorage keys ---
const LS_KEY = "fairshare_form";

function saveToLocalStorage(state: CalculatorFormState) {
  try {
    const data = {
      name1: state.person1Name,
      name2: state.person2Name,
      salary1: state.person1Salary,
      salary2: state.person2Salary,
      expenses: state.expenses
        .filter((e) => e.amount.replace(/,/g, "").trim() !== "")
        .map((e) => ({ amount: e.amount, label: e.label || "Expense" })),
    };
    localStorage.setItem(LS_KEY, JSON.stringify(data));
  } catch {
    // Silently fail — localStorage might be full or disabled
  }
}

function loadFromLocalStorage(): Partial<CalculatorFormState> | null {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) {
      return loadV1LocalStorage();
    }
    const data = JSON.parse(raw);
    if (!data || typeof data !== "object") return null;

    const expenses: ExpenseInput[] = Array.isArray(data.expenses)
      ? data.expenses
          .filter((e: unknown) => e && typeof e === "object")
          .slice(0, 50)
          .map((e: { amount?: string; label?: string }) => ({
            id: crypto.randomUUID(),
            amount: typeof e.amount === "string" ? e.amount : "",
            label: typeof e.label === "string" ? e.label : "",
          }))
      : [createInitialExpense()];

    return {
      person1Name: typeof data.name1 === "string" ? data.name1 : "",
      person2Name: typeof data.name2 === "string" ? data.name2 : "",
      person1Salary: typeof data.salary1 === "string" ? data.salary1 : "",
      person2Salary: typeof data.salary2 === "string" ? data.salary2 : "",
      expenses: expenses.length > 0 ? expenses : [createInitialExpense()],
    };
  } catch {
    return null;
  }
}

/**
 * Backward compatibility: V1 stored individual keys (name1, name2, salary1, salary2, expenses).
 */
function loadV1LocalStorage(): Partial<CalculatorFormState> | null {
  try {
    const name1 = localStorage.getItem("name1");
    const name2 = localStorage.getItem("name2");
    const salary1 = localStorage.getItem("salary1");
    const salary2 = localStorage.getItem("salary2");
    const expensesRaw = localStorage.getItem("expenses");

    if (!name1 && !name2 && !salary1 && !salary2 && !expensesRaw) return null;

    let expenses: ExpenseInput[] = [createInitialExpense()];
    if (expensesRaw) {
      const parsed = JSON.parse(expensesRaw);
      if (Array.isArray(parsed)) {
        expenses = parsed
          .slice(0, 50)
          .map((e: { amount?: string; label?: string }) => ({
            id: crypto.randomUUID(),
            amount: typeof e.amount === "string" ? e.amount : "",
            label: typeof e.label === "string" ? e.label : "",
          }));
      }
    }

    return {
      person1Name: name1 || "",
      person2Name: name2 || "",
      person1Salary: salary1 || "",
      person2Salary: salary2 || "",
      expenses:
        expenses.length > 0 ? expenses : [createInitialExpense()],
    };
  } catch {
    return null;
  }
}

// --- Hook ---
export interface UseCalculatorOptions {
  /** Called when data is restored from localStorage (for returning user flag). */
  onDataRestored?: () => void;
}

export function useCalculator(options?: UseCalculatorOptions) {
  const [state, dispatch] = useReducer(calculatorReducer, initialState);
  const restoredRef = useRef(false);
  const onDataRestored = options?.onDataRestored;

  useEffect(() => {
    if (restoredRef.current) return;
    restoredRef.current = true;

    const saved = loadFromLocalStorage();
    if (saved) {
      dispatch({ type: "RESTORE_STATE", state: saved });

      const hasNames = !!(
        (saved.person1Name?.trim() ?? "") || (saved.person2Name?.trim() ?? "")
      );
      const hasSalaries = !!(
        (saved.person1Salary?.replace(/,/g, "").trim() ?? "") ||
        (saved.person2Salary?.replace(/,/g, "").trim() ?? "")
      );
      const expensesWithAmount = (saved.expenses ?? []).filter(
        (e) => (e.amount?.replace(/,/g, "").trim() ?? "") !== ""
      );
      const hasExpenses = expensesWithAmount.length > 0;
      const expenseCount = expensesWithAmount.length;

      trackEvent("data_restored", {
        has_names: hasNames,
        has_salaries: hasSalaries,
        has_expenses: hasExpenses,
        expense_count: expenseCount,
      });
      onDataRestored?.();
    }
  }, [onDataRestored]);

  useEffect(() => {
    if (!restoredRef.current) return;
    const timer = setTimeout(() => saveToLocalStorage(state), 100);
    return () => clearTimeout(timer);
  }, [state]);

  const calculate = useCallback((): CalculatorResult | null => {
    const validation = validateForm(state);

    if (!validation.valid) {
      dispatch({ type: "SET_VALIDATION_ERRORS", errors: validation.errors });
      dispatch({ type: "SET_RESULT", result: null });
      return null;
    }

    const salary1 = parseSalary(state.person1Salary);
    const salary2 = parseSalary(state.person2Salary);

    const validExpenses = state.expenses
      .filter((e) => {
        const raw = e.amount.replace(/,/g, "").trim();
        if (raw === "") return false;
        const amount = parseFloat(raw);
        return !isNaN(amount) && amount > 0;
      })
      .map((e) => ({
        amount: parseFloat(e.amount.replace(/,/g, "")),
        label: e.label.trim() || "Expense",
      }));

    const rawResult = calculateShares(
      salary1,
      salary2,
      validExpenses,
      state.person1Name.trim(),
      state.person2Name.trim()
    );

    const resultWithPlaceholder = {
      ...rawResult,
      currencySymbol: "", // Component adds from context
    };
    dispatch({ type: "SET_VALIDATION_ERRORS", errors: [] });
    dispatch({ type: "SET_RESULT", result: resultWithPlaceholder });
    dispatch({ type: "SET_STEP", step: "results" });
    return resultWithPlaceholder;
  }, [state]);

  const backToEdit = useCallback(() => {
    dispatch({ type: "SET_STEP", step: "input" });
  }, []);

  const getError = useCallback(
    (field: string): string | undefined => {
      return state.validationErrors.find((e) => e.field === field)?.message;
    },
    [state.validationErrors]
  );

  const hasError = useCallback(
    (field: string): boolean => {
      return state.validationErrors.some((e) => e.field === field);
    },
    [state.validationErrors]
  );

  return {
    state,
    dispatch,
    calculate,
    backToEdit,
    result: state.result,
    errors: state.validationErrors,
    getError,
    hasError,
  };
}
