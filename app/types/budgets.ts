import type { SubCategory, Category } from "./category";
import type { BudgetBySubCategoryResponse } from "./budget";

export type CategoryBudgets = {
  category: Category;
  budgets: BudgetBySubCategoryResponse[];
  background: string;
};

export interface UseBudgetsListResult {
  loading: boolean;
  error: string | null;
  periodLabel: string;
  /** Selected financial month as `YYYY-MM` */
  monthParam: string;
  budgetsByCategory: CategoryBudgets[];
  isCurrentMonth: boolean;
  isFutureMonth: boolean;
  /** True for the current and upcoming months; past months are read-only */
  canCreateBudget: boolean;
  isNextDisabled: boolean;
  hasStartDayMonth: boolean;
  goToPrevMonth: () => void;
  goToNextMonth: () => void;
}

export interface UseCreateBudgetProps {
  category: SubCategory;
  setCategory: (category: SubCategory) => void;
  /** Target financial month as `YYYY-MM`; defaults to the current period when absent */
  month?: string | null;
}

export interface UseCreateBudgetResult {
  amountValue: string;
  isFormValid: boolean;
  isSubmitting: boolean;
  submitError: string | null;
  submitSuccess: boolean;
  /** Label of the period the budget will apply to, e.g. "Tháng 8 (01/8-31/8)" */
  targetPeriodLabel: string;
  handleBack: () => void;
  handleAmountChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

export interface UseBudgetsResult {
  categoriesLoading: boolean;
  categoriesError: string | null;
  categories: Category[];
}

export interface ListCategoriesProps {
  setCategory: (category: SubCategory) => void;
}

export interface CreateBudgetProps {
  category: SubCategory;
  setCategory: (category: SubCategory) => void;
  month?: string | null;
}
