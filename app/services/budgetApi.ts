// File: app/services/budgetApi.ts
import { apiClient } from "../lib/apiClient";
import type {
  CreateBudgetRequest,
  CreateBudgetResponse,
  BudgetBySubCategoryResponse,
  GetBudgetsParams,
  BudgetListResponse,
} from "../types/budget";

export const budgetApi = {
  createBudget: async (payload: CreateBudgetRequest): Promise<CreateBudgetResponse> => {
    const response = await apiClient.post<CreateBudgetResponse>("/budgets/sub-categories", payload);
    // Handle nested data structure
    const raw: any = response.data;
    return raw?.data ?? raw;
  },

  getBudgetBySubCategory: async (subCategoryId: string): Promise<BudgetBySubCategoryResponse> => {
    const response = await apiClient.get<{
      data: BudgetBySubCategoryResponse;
    }>(`/budgets/sub-categories/${subCategoryId}`);
    // Handle nested data structure
    const raw: any = response.data;
    return raw?.data ?? raw;
  },

  getBudgetsSubCategories: async (params: GetBudgetsParams = {}): Promise<BudgetBySubCategoryResponse[]> => {
    const queryParams = new URLSearchParams();
    if (params.month) queryParams.append("month", params.month);
    const query = queryParams.toString();
    const url = `/budgets/sub-categories${query ? `?${query}` : ""}`;
    const response = await apiClient.get<{ data: BudgetListResponse } | BudgetListResponse>(url);
    const raw: any = response.data;
    const data = raw?.data ?? raw;
    return Array.isArray(data) ? data : [];
  },
};
