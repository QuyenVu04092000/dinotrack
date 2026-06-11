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
  budgetsByCategory: CategoryBudgets[];
  isCurrentMonth: boolean;
  hasStartDayMonth: boolean;
  goToPrevMonth: () => void;
  goToNextMonth: () => void;
}

export interface UseCreateBudgetProps {
  category: SubCategory;
  setCategory: (category: SubCategory) => void;
}

export interface UseCreateBudgetResult {
  amountValue: string;
  isFormValid: boolean;
  isSubmitting: boolean;
  submitError: string | null;
  submitSuccess: boolean;
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
}
