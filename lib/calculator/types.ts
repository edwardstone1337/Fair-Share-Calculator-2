// === Input types (form state) ===

export interface ExpenseInput {
  id: string; // Unique ID for React key (use crypto.randomUUID() or nanoid)
  amount: string; // String for controlled input (raw user input, may contain commas)
  label: string; // Optional label (e.g. "Rent", "Groceries")
}

export interface CalculatorFormState {
  person1Name: string;
  person2Name: string;
  person1Salary: string; // String for controlled input
  person2Salary: string;
  person1SalaryVisible: boolean; // Show/hide toggle (password field)
  person2SalaryVisible: boolean;
  expenses: ExpenseInput[];
  step: "input" | "results";
  validationErrors: FieldError[];
}

// === Validation types ===

export interface FieldError {
  field: string; // Field identifier (e.g. "person1Salary", "expense-abc123")
  message: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: FieldError[];
}

// === Computation types (pure calculation output) ===

export interface ExpenseResult {
  label: string;
  amount: number;
  person1Share: number;
  person2Share: number;
}

export interface CalculatorResult {
  person1Name: string;
  person2Name: string;
  person1TotalShare: number;
  person2TotalShare: number;
  person1Percentage: number; // Integer 0-100
  person2Percentage: number;
  totalExpenses: number;
  expenseBreakdown: ExpenseResult[];
  person1Salary: number; // For the explanation card
  person2Salary: number;
  combinedSalary: number;
  currencySymbol: string; // e.g. '$', '£', 'A$'
}

// === localStorage persistence ===

export interface SavedFormData {
  name1: string;
  name2: string;
  salary1: string;
  salary2: string;
  expenses: { amount: string; label: string }[];
  currency?: string;
}
