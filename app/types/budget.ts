export interface CreateBudgetRequest {
  subCategoryId: string;
  budget: number;
  month: string;
}

export interface CreateBudgetResponse {
  id: string;
  subCategoryId: string;
  budget: number;
  month: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface BudgetPeriod {
  startDate: string;
  endDate: string;
  label: string;
}

export interface BudgetBySubCategoryResponse {
  id: string;
  subCategoryId: string;
  budget: number;
  month: string;
  userId: string;
  totalExpense: number;
  remainingBudget: number;
  period: BudgetPeriod;
}

export interface GetBudgetsParams {
  month?: string;
}

export type BudgetListResponse = BudgetBySubCategoryResponse[];
