// File: app/services/transactionApi.ts
import { apiClient } from "../lib/apiClient";
import { CreateTransactionRequest, TransactionResponse } from "../types/transaction";
import type {
  TodaySpentResponse,
  ReportResponse,
  GetReportParams,
  GetTransactionsByCategoryParams,
  TransactionPeriod,
  Summary,
  TransactionsByCategoryGroupedResponse,
  GetAllTransactionsParams,
  GetAllTransactionsResponse,
} from "app/types/transactionApi";

export const transactionApi = {
  createTransaction: async (payload: CreateTransactionRequest): Promise<TransactionResponse> => {
    const response = await apiClient.post<TransactionResponse>("/transactions", payload);
    return response.data;
  },

  getTodaySpent: async (): Promise<number> => {
    const response = await apiClient.get<TodaySpentResponse>("/transactions/today/spent");
    const amount = response.data?.data?.amount ?? 0;
    return typeof amount === "number" ? amount : 0;
  },

  getReport: async (params: GetReportParams = {}): Promise<ReportResponse> => {
    const queryParams = new URLSearchParams();

    if (params.period) {
      queryParams.append("period", params.period);
    }
    if (params.type) {
      queryParams.append("type", params.type);
    }
    if (params.startDate) {
      queryParams.append("startDate", params.startDate);
    }
    if (params.endDate) {
      queryParams.append("endDate", params.endDate);
    }
    if (params.categoryId) {
      queryParams.append("categoryId", params.categoryId);
    }
    if (params.subCategoryId) {
      queryParams.append("subCategoryId", params.subCategoryId);
    }

    const queryString = queryParams.toString();
    const url = `/transactions/report${queryString ? `?${queryString}` : ""}`;

    const response = await apiClient.get<ReportResponse>(url);
    // Handle nested data structure
    const raw: any = response.data;
    return raw?.data ? { data: raw.data } : raw;
  },

  getTransactionsByCategory: async (
    params: GetTransactionsByCategoryParams,
  ): Promise<TransactionsByCategoryGroupedResponse> => {
    const queryParams = new URLSearchParams();

    if (params.categoryId) {
      queryParams.append("categoryId", params.categoryId);
    }
    if (params.subCategoryId) {
      queryParams.append("subCategoryId", params.subCategoryId);
    }
    // month and week are mutually exclusive
    if (params.week) {
      queryParams.append("week", params.week);
    } else if (params.month) {
      queryParams.append("month", params.month);
    }

    const queryString = queryParams.toString();
    const url = `/transactions/category${queryString ? `?${queryString}` : ""}`;

    const response = await apiClient.get<TransactionsByCategoryGroupedResponse>(url);
    // Handle nested data structure
    const raw: any = response.data;
    return raw?.data ? { data: raw.data } : raw;
  },

  getTransactionsByCategoryGrouped: async (
    params: GetTransactionsByCategoryParams,
  ): Promise<TransactionsByCategoryGroupedResponse> => {
    const queryParams = new URLSearchParams();

    if (params.categoryId) {
      queryParams.append("categoryId", params.categoryId);
    }
    if (params.subCategoryId) {
      queryParams.append("subCategoryId", params.subCategoryId);
    }
    if (params.allMonths !== undefined) {
      queryParams.append("allMonths", String(params.allMonths));
    }
    if (params.allWeeks !== undefined) {
      queryParams.append("allWeeks", String(params.allWeeks));
    }

    const queryString = queryParams.toString();
    const url = `/transactions/category${queryString ? `?${queryString}` : ""}`;

    const response = await apiClient.get<TransactionsByCategoryGroupedResponse>(url);
    // Handle nested data structure
    const raw: any = response.data;
    return raw?.data ? { data: raw.data } : raw;
  },

  getAllTransactions: async (params: GetAllTransactionsParams): Promise<GetAllTransactionsResponse> => {
    const queryParams = new URLSearchParams();

    if (params.month) {
      queryParams.append("month", params.month);
    }
    if (params.startDate) {
      queryParams.append("startDate", params.startDate);
    }
    if (params.endDate) {
      queryParams.append("endDate", params.endDate);
    }
    if (params.categoryIds?.length) {
      queryParams.append("categoryIds", params.categoryIds.join(","));
    }

    const queryString = queryParams.toString();
    const url = `/transactions${queryString ? `?${queryString}` : ""}`;

    const response = await apiClient.get<any>(url);
    // Handle nested data structure
    const raw: any = response.data;

    // If response.data is an array, return it directly
    if (Array.isArray(raw)) {
      return { data: raw };
    }

    // If response.data has a data property with array
    if (raw?.data && Array.isArray(raw.data)) {
      return { data: raw.data };
    }

    // Fallback: return empty array
    return { data: [] };
  },
};
