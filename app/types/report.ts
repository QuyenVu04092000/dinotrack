import type { ReportResponse, ReportCategory } from "./transactionApi";
import type { SubCategory } from "./category";

export type ReportType = "expense" | "income";
export type ReportPeriod = "week" | "month";
export type CategoryView = "sub" | "parent";

export interface UseReportResult {
  reportData: ReportResponse["data"] | null;
  isLoading: boolean;
  error: string | null;
  reportType: ReportType;
  setReportType: (type: ReportType) => void;
  period: ReportPeriod;
  setPeriod: (period: ReportPeriod) => void;
  categoryView: CategoryView;
  setCategoryView: (view: CategoryView) => void;
  totalAmount: number;
  formattedTotalAmount: string;
  periodLabel: string;
  categories: ReportCategory[];
  todaySpent: number;
  todaySpentLoading: boolean;
  formattedPeriodRange: string;
  chartData: {
    id: string;
    name: string;
    percentage: number;
    color: string;
    icon?: string;
  }[];
  subCategoriesWithPercentages: Array<{
    subCategoryId: string;
    subCategoryName: string;
    totalExpense: number;
    totalIncome: number;
    percentage: number;
    color: string;
    icon?: string;
  }>;
  refetch: () => Promise<void>;
}
