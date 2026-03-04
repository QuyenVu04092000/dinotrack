import type { TransactionResponse } from "./transaction";

export interface TodaySpentResponse {
  data: {
    amount: number;
  };
}

export interface ReportSubCategory {
  subCategoryId: string;
  subCategoryName: string;
  totalIncome: number;
  totalExpense: number;
}

export interface ReportCategory {
  categoryId: string;
  categoryName: string;
  totalIncome: number;
  totalExpense: number;
  subCategories: ReportSubCategory[];
}

export interface PreviousPeriod {
  totalIncome: number;
  totalExpense: number;
  incomeChange: number;
  expenseChange: number;
  incomeChangePercent: number;
  expenseChangePercent: number;
}

export interface ReportResponse {
  data: {
    period: string;
    startDate: string;
    endDate: string;
    totalIncome: number;
    totalExpense: number;
    categories: ReportCategory[];
    previousPeriod?: PreviousPeriod;
    incomeChange?: number;
    expenseChange?: number;
    incomeChangePercent?: number;
    expenseChangePercent?: number;
  };
}

export interface GetReportParams {
  period?: "week" | "month" | "custom";
  type?: "in" | "out";
  startDate?: string;
  endDate?: string;
  categoryId?: string;
  subCategoryId?: string;
}

export interface GetTransactionsByCategoryParams {
  categoryId?: string;
  subCategoryId?: string;
  month?: string;
  week?: string;
  allMonths?: boolean;
  allWeeks?: boolean;
}

export interface TransactionPeriod {
  period: string;
  amount: number;
  transactions: TransactionResponse[];
}

export interface Summary {
  icon: string;
  name: string;
  subCategoryId: string;
  totalExpense: number;
  totalIncome: number;
}

export interface TransactionsByCategoryGroupedResponse {
  data: {
    periods: TransactionPeriod[];
    summary: Summary[];
  };
}

export interface GetAllTransactionsParams {
  month?: string;
  startDate?: string;
  endDate?: string;
  categoryIds?: string[];
}

export interface GetAllTransactionsResponse {
  data: TransactionResponse[];
}
