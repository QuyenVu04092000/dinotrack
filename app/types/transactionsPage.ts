import type { TransactionResponse } from "app/types/transaction";
import type { Category } from "app/types/category";

export interface DailyTransaction {
  date: string; // YYYY-MM-DD
  income: number;
  expense: number;
}

export interface GroupedTransaction {
  date: string; // DD/MM/YYYY
  transactions: TransactionResponse[];
}

export interface UseTransactionsPageResult {
  authLoading: boolean;
  monthPeriod: {
    startDate: string;
    endDate: string;
    monthLabel: string;
  };
  monthPeriodRange: {
    start: Date;
    end: Date;
  };
  calendarDays: (Date | null)[];
  weekDays: string[];
  selectedDate: Date | null;
  handlePreviousMonth: () => void;
  handleNextMonth: () => void;
  handleDateClick: (date: Date) => void;
  isLoadingList: boolean;
  error: string | null;
  groupedTransactions: GroupedTransaction[];
  dailyTransactions: Record<string, DailyTransaction>;
  summary: {
    totalExpense: number;
    totalIncome: number;
    difference: number;
  };
  formatCalendarAmount: (amount: number) => string;
  getSubCategoryIcon: (subCategoryId: string | null | undefined) => string;
  isFilterOpen: boolean;
  openFilter: () => void;
  setIsFilterOpen: (open: boolean) => void;
  categories: Category[];
  categoriesLoading: boolean;
  draftSelectedSubCategoryIds: Set<string>;
  toggleDraftCategory: (category: Category) => void;
  toggleDraftSubCategory: (subCategoryId: string) => void;
  applyFilterAndClose: () => void;
}
