import type { SubCategory, Category } from "./category";

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
