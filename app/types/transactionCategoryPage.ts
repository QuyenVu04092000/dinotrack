import type { TransactionResponse } from "app/types/transaction";
import type { Category, SubCategory } from "app/types/category";
import type { Summary, TransactionPeriod } from "app/types/transactionApi";
import type { BudgetBySubCategoryResponse } from "app/types/budget";
import type { ReadonlyURLSearchParams } from "next/navigation";

export interface GroupedTransaction {
  date: string; // DD/MM/YYYY
  transactions: TransactionResponse[];
  dailyTotal: number;
}

export interface DailySpending {
  date: string; // DD/MM/YYYY
  amount: number;
}

export interface UseTransactionCategoryPageResult {
  searchParams: ReadonlyURLSearchParams;
  categoryId: string | null;
  subCategoryId: string | null;
  userBalance: number;
  suggestedDailyValue: number;
  transactions: TransactionResponse[];
  summary: Summary[];
  isLoading: boolean;
  error: string | null;
  subCategory: SubCategory | null;
  category: Category | null;
  viewMode: "week" | "month";
  setViewMode: (mode: "week" | "month") => void;
  isViewModeOpen: boolean;
  setIsViewModeOpen: (open: boolean) => void;
  chartPeriods: TransactionPeriod[];
  selectedBarIndex: number | null;
  selectedWeek: string | null;
  selectedMonth: string | null;
  budget: BudgetBySubCategoryResponse | null;
  isLoadingBudget: boolean;
  chartData: {
    label: string;
    value: number;
    type: "in" | "out";
  }[];
  handleChartBarClick: (label: string, index: number) => void;
  dailySpending: DailySpending[];
  dailyMetrics: {
    plannedDaily: number;
    actualDaily: number;
    suggestedDaily: number;
  };
  groupedTransactions: GroupedTransaction[];
  timeRangeSubtitle: string;
  subCategoryName: string;
  subCategoryIcon: string;
  maxChartValue: number;
  chartHeight: number;
  maxSpendingDay: DailySpending;
}
