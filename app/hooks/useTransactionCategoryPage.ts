"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useFooter } from "app/context/FooterContext";
import { useAuthContext } from "app/context/AuthContext";
import { transactionApi } from "app/services/transactionApi";
import { TransactionResponse } from "app/types/transaction";
import { categoryApi } from "app/services/categoryApi";
import { Category, SubCategory } from "app/types/category";
import { budgetApi } from "app/services/budgetApi";
import { formatDateDDMMYYYY } from "app/utilities/common/functions";
import { Summary, TransactionPeriod } from "app/types/transactionApi";
import { BudgetBySubCategoryResponse } from "app/types/budget";

interface GroupedTransaction {
  date: string; // DD/MM/YYYY
  transactions: TransactionResponse[];
  dailyTotal: number;
}

interface DailySpending {
  date: string; // DD/MM/YYYY
  amount: number;
}

export interface UseTransactionCategoryPageResult {
  searchParams: ReturnType<typeof useSearchParams>;
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

export const useTransactionCategoryPage = (): UseTransactionCategoryPageResult => {
  const searchParams = useSearchParams();
  const { setFooterVisible } = useFooter();
  const { user } = useAuthContext();

  const categoryId = searchParams.get("categoryId");
  const subCategoryId = searchParams.get("subCategoryId");

  // Get user balance
  const userBalance = user?.balance ?? 0;

  // Calculate suggested daily value: balance divided by remaining days until startDayMonth
  const suggestedDailyValue = useMemo(() => {
    if (!user?.balance || !user?.startDayMonth) {
      return 0;
    }

    const today = new Date();
    // Use UTC methods to get current date components
    const currentDay = today.getUTCDate();
    const currentMonth = today.getUTCMonth();
    const currentYear = today.getUTCFullYear();

    const startDay = user.startDayMonth;

    // Calculate next start date
    let nextStartDate: Date;
    if (currentDay < startDay) {
      // Start day is later this month
      nextStartDate = new Date(Date.UTC(currentYear, currentMonth, startDay));
    } else {
      // Start day is next month
      nextStartDate = new Date(Date.UTC(currentYear, currentMonth + 1, startDay));
    }

    // Set today to start of day (UTC) for accurate day calculation
    const todayStart = new Date(Date.UTC(currentYear, currentMonth, currentDay));

    // Calculate remaining days (difference in milliseconds converted to days)
    const timeDiff = nextStartDate.getTime() - todayStart.getTime();
    const remainingDays = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

    if (remainingDays <= 0) {
      return 0;
    }

    // Suggested value = balance / remaining days
    const suggested = user.balance / remainingDays;

    return suggested;
  }, [user?.balance, user?.startDayMonth]);

  const [transactions, setTransactions] = useState<TransactionResponse[]>([]);
  const [summary, setSummary] = useState<Summary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [subCategory, setSubCategory] = useState<SubCategory | null>(null);
  const [category, setCategory] = useState<Category | null>(null);
  const [viewMode, setViewMode] = useState<"week" | "month">("week");
  const [isViewModeOpen, setIsViewModeOpen] = useState(false);
  const [chartPeriods, setChartPeriods] = useState<TransactionPeriod[]>([]);
  const [selectedBarIndex, setSelectedBarIndex] = useState<number | null>(null);
  const [selectedWeek, setSelectedWeek] = useState<string | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const [budget, setBudget] = useState<BudgetBySubCategoryResponse | null>(null);
  const [isLoadingBudget, setIsLoadingBudget] = useState(false);

  // Clear selected week/month and bar index when view mode changes
  useEffect(() => {
    setSelectedWeek(null);
    setSelectedMonth(null);
    setSelectedBarIndex(null);
  }, [viewMode]);

  // Hide footer on mount (preserve existing behavior)
  useEffect(() => {
    setFooterVisible(false);
    return () => {
      setFooterVisible(true);
    };
  }, [setFooterVisible]);

  // Fetch sub-category info
  useEffect(() => {
    const fetchSubCategory = async () => {
      if (!subCategoryId) return;
      try {
        const subs = await categoryApi.getSubCategories();
        const found = subs.find((sub) => sub.id === subCategoryId);
        setSubCategory(found || null);
      } catch (err) {
        console.error("Failed to fetch sub-category:", err);
      }
    };
    fetchSubCategory();
  }, [subCategoryId]);

  // Fetch category info
  useEffect(() => {
    const fetchCategory = async () => {
      if (!categoryId) return;
      const categories = await categoryApi.getCategories();
      const found = categories.find((c) => c.id === categoryId);
      setCategory(found || null);
    };
    fetchCategory();
  }, [categoryId]);

  // Fetch budget by sub-category
  useEffect(() => {
    const fetchBudget = async () => {
      if (!subCategoryId) {
        setBudget(null);
        return;
      }

      try {
        setIsLoadingBudget(true);
        const budgetData = await budgetApi.getBudgetBySubCategory(subCategoryId);
        setBudget(budgetData);
      } catch (err) {
        console.error("Failed to fetch budget:", err);
        setBudget(null);
      } finally {
        setIsLoadingBudget(false);
      }
    };

    fetchBudget();
  }, [subCategoryId]);

  // Fetch transactions - only when specific week/month is selected via chart click
  useEffect(() => {
    const fetchTransactions = async () => {
      if (!categoryId && !subCategoryId) {
        setIsLoading(false);
        return;
      }

      // If no specific week/month is selected, transactions will come from chartPeriods
      if (!selectedWeek && !selectedMonth) {
        setTransactions([]);
        setSummary([]);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        const response = await transactionApi.getTransactionsByCategory({
          categoryId: categoryId || undefined,
          subCategoryId: subCategoryId || undefined,
          week: selectedWeek || undefined,
          month: selectedMonth || undefined,
        });
        const periods = response.data?.periods || [];
        const summaryData = response.data?.summary || [];
        const allTransactions: TransactionResponse[] = [];
        periods.forEach((period) => {
          if (period.transactions && period.transactions.length > 0) {
            allTransactions.push(...period.transactions);
          }
        });
        // Sort by createdAt DESC
        const sorted = [...allTransactions].sort((a, b) => {
          const dateA = new Date(a.createdAt).getTime();
          const dateB = new Date(b.createdAt).getTime();
          return dateB - dateA;
        });
        setTransactions(sorted);
        setSummary(summaryData);
      } catch (err: any) {
        setError(err?.message || "Không thể tải dữ liệu");
        console.error("Failed to fetch transactions:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactions();
  }, [categoryId, subCategoryId, selectedWeek, selectedMonth]);

  // Fetch chart periods data - always use allWeeks/allMonths based on viewMode
  useEffect(() => {
    const fetchChartPeriods = async () => {
      if (!categoryId && !subCategoryId) {
        setChartPeriods([]);
        return;
      }

      try {
        const params: {
          categoryId?: string;
          subCategoryId?: string;
          allMonths?: boolean;
          allWeeks?: boolean;
        } = {
          categoryId: categoryId || undefined,
          subCategoryId: subCategoryId || undefined,
        };

        // Always use allWeeks/allMonths based on view mode (no week/month params passed)
        if (viewMode === "month") {
          params.allMonths = true;
        } else {
          // Default to allWeeks: true
          params.allWeeks = true;
        }

        const response = await transactionApi.getTransactionsByCategoryGrouped(params);

        setChartPeriods(response.data?.periods || []);
        categoryId ? setSummary(response.data?.summary || []) : setSummary([]);
      } catch (err) {
        console.error("Failed to fetch chart periods:", err);
        setChartPeriods([]);
      }
    };

    fetchChartPeriods();
    // Note: selectedWeek and selectedMonth are intentionally NOT in dependencies
    // to preserve chartPeriods when clicking on chart bars
  }, [categoryId, subCategoryId, viewMode]);

  // Map transactions from chartPeriods when no specific week/month is selected
  useEffect(() => {
    if (!selectedWeek && !selectedMonth && chartPeriods.length > 0) {
      // Aggregate all transactions from all periods
      const allTransactions: TransactionResponse[] = [];
      chartPeriods.forEach((period) => {
        allTransactions.push(...period.transactions);
      });

      // Sort by createdAt DESC
      const sorted = [...allTransactions].sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return dateB - dateA;
      });

      setTransactions(sorted);
    }
  }, [chartPeriods, selectedWeek, selectedMonth]);

  // Calculate total amount (sum of all transactions)
  const totalAmount = useMemo(() => {
    return transactions.reduce((sum, tx) => sum + tx.amount, 0);
  }, [transactions]);

  // Calculate spent amount (only "out" type transactions)
  const spentAmount = useMemo(() => {
    return transactions.filter((tx) => tx.type === "out").reduce((sum, tx) => sum + tx.amount, 0);
  }, [transactions]);

  // Determine transaction type (use first transaction or default to "out")
  const transactionType = useMemo(() => {
    if (transactions.length === 0) return "out";
    return transactions[0].type;
  }, [transactions]);

  // Helper function to format week label
  const formatWeekLabel = (periodString: string): string => {
    // For month view, period is just the month number (e.g., "1", "12")
    // Check if it's a single number (month)
    if (/^\d{1,2}$/.test(periodString.trim())) {
      return periodString;
    }

    // For week view, parse the format "DD/MM - DD/MM" or "DD/M - DD/M"
    const weekMatch = periodString.match(/^(\d{1,2})\/(\d{1,2})\s*-\s*(\d{1,2})\/(\d{1,2})$/);

    if (weekMatch) {
      const startDay = parseInt(weekMatch[1], 10);
      const startMonth = parseInt(weekMatch[2], 10);
      const endDay = parseInt(weekMatch[3], 10);
      const endMonth = parseInt(weekMatch[4], 10);

      // If months are the same, show only dates: "DD - DD"
      if (startMonth === endMonth) {
        return `${startDay} - ${endDay}`;
      } else {
        // If months are different, show full format: "DD/MM - DD/MM"
        const startMonthStr = String(startMonth).padStart(2, "0");
        const endMonthStr = String(endMonth).padStart(2, "0");
        return `${startDay}/${startMonthStr} - ${endDay}/${endMonthStr}`;
      }
    }

    // Return original if parsing fails
    return periodString;
  };

  // Calculate chart data from API periods
  const chartData = useMemo(() => {
    if (chartPeriods.length === 0) {
      // No data from API: show a single zero bar so X/Y axes still render
      return [
        {
          label: viewMode === "month" ? "0" : "0",
          value: 0,
          type: transactionType,
        },
      ];
    }

    return chartPeriods.map((period) => ({
      label: formatWeekLabel(period.period), // Format week labels
      value: period.amount,
      type: transactionType, // Use the determined transaction type
    }));
  }, [chartPeriods, transactionType, viewMode]);

  // Handle chart bar click for both week and month view modes
  const handleChartBarClick = useCallback(
    (label: string, index: number) => {
      // Highlight the selected bar
      setSelectedBarIndex(index);

      // Use original period string from API (not the formatted label)
      const period = chartPeriods[index];
      if (!period) return;

      const originalPeriodString = period.period;

      if (viewMode === "month") {
        // For months, period is just the month number (e.g., "12")
        const monthNumber = parseInt(originalPeriodString.trim(), 10);
        if (!isNaN(monthNumber) && monthNumber >= 1 && monthNumber <= 12) {
          // Determine year from period transactions if available
          let year = new Date().getFullYear();
          if (period.transactions && period.transactions.length > 0) {
            const firstTxDate = new Date(period.transactions[0].createdAt);
            year = firstTxDate.getFullYear();
          }
          const monthStr = String(monthNumber).padStart(2, "0");
          const monthValue = `${monthStr}/${year}`;

          // Set selected month state (no URL update to prevent chart reload)
          setSelectedMonth(monthValue);
        }
      } else {
        // For weeks, parse the original period format "DD/MM - DD/MM" or "DD/M - DD/M"
        // We need to convert to "DD/MM/YYYY-DD/MM/YYYY"
        const weekMatch = originalPeriodString.match(/^(\d{1,2})\/(\d{1,2})\s*-\s*(\d{1,2})\/(\d{1,2})$/);
        if (weekMatch) {
          const startDay = parseInt(weekMatch[1], 10);
          const startMonth = parseInt(weekMatch[2], 10);
          const endDay = parseInt(weekMatch[3], 10);
          const endMonth = parseInt(weekMatch[4], 10);

          const currentDate = new Date();
          const currentYear = currentDate.getFullYear();
          const currentMonth = currentDate.getMonth() + 1; // 1-12

          let startYear: number;
          let endYear: number;

          // Special rule for December–January weeks:
          if (startMonth === 12 && endMonth === 1) {
            if (currentMonth < 3) {
              startYear = currentYear - 1;
              endYear = currentYear;
            } else {
              startYear = currentYear;
              endYear = currentYear + 1;
            }
          } else {
            // For all other weeks, keep the existing heuristic based on position
            const totalWeeks = chartPeriods.length;
            const weeksFromCurrent = totalWeeks - 1 - index; // 0 = current week

            const estimatedDate = new Date(currentDate);
            estimatedDate.setDate(estimatedDate.getDate() - weeksFromCurrent * 7);
            const estimatedYear = estimatedDate.getFullYear();

            startYear = estimatedYear;
            endYear = startYear;

            if (endMonth < startMonth) {
              endYear = startYear + 1;
            }
          }

          const startDayStr = String(startDay).padStart(2, "0");
          const startMonthStr = String(startMonth).padStart(2, "0");
          const endDayStr = String(endDay).padStart(2, "0");
          const endMonthStr = String(endMonth).padStart(2, "0");

          const weekValue = `${startDayStr}/${startMonthStr}/${startYear}-${endDayStr}/${endMonthStr}/${endYear}`;

          // Set selected week state (no URL update to prevent chart reload)
          setSelectedWeek(weekValue);
        }
      }
    },
    [chartPeriods, viewMode],
  );

  // Calculate daily spending for chart (last 7 days)
  const dailySpending = useMemo(() => {
    const spendingMap: Record<string, number> = {};
    const today = new Date();

    // Initialize last 7 days with 0
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateKey = formatDateDDMMYYYY(date);
      spendingMap[dateKey] = 0;
    }

    // Sum up spending by date
    transactions
      .filter((tx) => tx.type === "out")
      .forEach((tx) => {
        const date = new Date(tx.createdAt);
        const dateKey = formatDateDDMMYYYY(date);
        if (spendingMap.hasOwnProperty(dateKey)) {
          spendingMap[dateKey] += tx.amount;
        }
      });

    return Object.entries(spendingMap).map(([date, amount]) => ({
      date,
      amount,
    }));
  }, [transactions]);

  // Calculate daily metrics
  const dailyMetrics = useMemo(() => {
    const daysWithSpending = dailySpending.filter((d) => d.amount > 0).length;
    const totalDays = dailySpending.length;
    const actualDaily = daysWithSpending > 0 ? spentAmount / daysWithSpending : 0;
    const suggestedDaily = suggestedDailyValue;

    // Calculate planned daily from budget period
    let plannedDaily = 0;
    if (budget?.period?.startDate && budget?.period?.endDate && budget?.budget) {
      const startDate = new Date(budget.period.startDate);
      const endDate = new Date(budget.period.endDate);
      const timeDiff = endDate.getTime() - startDate.getTime();
      const daysInPeriod = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

      if (daysInPeriod > 0) {
        plannedDaily = budget.budget / daysInPeriod;
      }
    }

    return {
      plannedDaily,
      actualDaily,
      suggestedDaily,
    };
  }, [dailySpending, spentAmount, budget, suggestedDailyValue]);

  // Group transactions by date
  const groupedTransactions = useMemo(() => {
    const groups: Record<string, TransactionResponse[]> = {};

    transactions.forEach((tx) => {
      const date = new Date(tx.createdAt);
      const dateKey = formatDateDDMMYYYY(date);

      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(tx);
    });

    const result: GroupedTransaction[] = Object.entries(groups).map(([date, txs]) => {
      const dailyTotal = txs.reduce((sum, tx) => {
        if (tx.type === "in") {
          return sum + tx.amount;
        } else {
          return sum - tx.amount;
        }
      }, 0);
      return { date, transactions: txs, dailyTotal };
    });

    // Sort by date DESC
    return result.sort((a, b) => {
      const [dayA, monthA, yearA] = a.date.split("/").map(Number);
      const [dayB, monthB, yearB] = b.date.split("/").map(Number);
      const dateA = new Date(yearA, monthA - 1, dayA).getTime();
      const dateB = new Date(yearB, monthB - 1, dayB).getTime();
      return dateB - dateA;
    });
  }, [transactions]);

  // Format time range subtitle
  const timeRangeSubtitle = useMemo(() => {
    if (selectedWeek) {
      return selectedWeek;
    }
    if (selectedMonth) {
      const [m, y] = selectedMonth.split("/");
      const monthNames = [
        "Tháng 1",
        "Tháng 2",
        "Tháng 3",
        "Tháng 4",
        "Tháng 5",
        "Tháng 6",
        "Tháng 7",
        "Tháng 8",
        "Tháng 9",
        "Tháng 10",
        "Tháng 11",
        "Tháng 12",
      ];
      return `${monthNames[parseInt(m) - 1]} ${y}`;
    }
    return "";
  }, [selectedWeek, selectedMonth]);

  const subCategoryName = subCategory?.name || category?.name || "Chi tiêu";
  const subCategoryIcon = subCategory?.icon || category?.icon || "📂";

  // Chart configuration (preserved from original)
  const maxChartValue = 125000;
  const chartHeight = 187;

  // Find max spending day for highlighting
  const maxSpendingDay = useMemo(() => {
    return dailySpending.reduce(
      (max, day) => (day.amount > max.amount ? day : max),
      dailySpending[0] || { date: "", amount: 0 },
    );
  }, [dailySpending]);

  return {
    searchParams,
    categoryId,
    subCategoryId,
    userBalance,
    suggestedDailyValue,
    transactions,
    summary,
    isLoading,
    error,
    subCategory,
    category,
    viewMode,
    setViewMode,
    isViewModeOpen,
    setIsViewModeOpen,
    chartPeriods,
    selectedBarIndex,
    selectedWeek,
    selectedMonth,
    budget,
    isLoadingBudget,
    chartData,
    handleChartBarClick,
    dailySpending,
    dailyMetrics,
    groupedTransactions,
    timeRangeSubtitle,
    subCategoryName,
    subCategoryIcon,
    maxChartValue,
    chartHeight,
    maxSpendingDay,
  };
};
