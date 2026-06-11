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
  date: string;
  transactions: TransactionResponse[];
  dailyTotal: number;
}

interface DailySpending {
  date: string;
  amount: number;
}

export interface UseTransactionCategoryPageResult {
  searchParams: ReturnType<typeof useSearchParams>;
  categoryId: string | null;
  subCategoryId: string | null;
  userBalance: number;
  suggestedDailyValue: number;
  allTransactions: TransactionResponse[];
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
  isLoadingPeriod: boolean;
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

  const userBalance = user?.balance ?? 0;

  const suggestedDailyValue = useMemo(() => {
    if (!user?.balance || !user?.startDayMonth) return 0;

    const today = new Date();
    const currentDay = today.getUTCDate();
    const currentMonth = today.getUTCMonth();
    const currentYear = today.getUTCFullYear();
    const startDay = user.startDayMonth;

    const nextStartDate =
      currentDay < startDay
        ? new Date(Date.UTC(currentYear, currentMonth, startDay))
        : new Date(Date.UTC(currentYear, currentMonth + 1, startDay));

    const todayStart = new Date(Date.UTC(currentYear, currentMonth, currentDay));
    const remainingDays = Math.ceil((nextStartDate.getTime() - todayStart.getTime()) / (1000 * 60 * 60 * 24));

    return remainingDays > 0 ? user.balance / remainingDays : 0;
  }, [user?.balance, user?.startDayMonth]);

  const [summary, setSummary] = useState<Summary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [subCategory, setSubCategory] = useState<SubCategory | null>(null);
  const [category, setCategory] = useState<Category | null>(null);
  const [viewMode, setViewMode] = useState<"week" | "month">("week");
  const [isViewModeOpen, setIsViewModeOpen] = useState(false);
  const [chartPeriods, setChartPeriods] = useState<TransactionPeriod[]>([]);
  const [selectedBarIndex, setSelectedBarIndex] = useState<number | null>(null);
  const [selectedPeriodTransactions, setSelectedPeriodTransactions] = useState<TransactionResponse[] | null>(null);
  const [isLoadingPeriod, setIsLoadingPeriod] = useState(false);
  const [budget, setBudget] = useState<BudgetBySubCategoryResponse | null>(null);
  const [isLoadingBudget, setIsLoadingBudget] = useState(false);

  useEffect(() => {
    setSelectedBarIndex(null);
  }, [viewMode]);

  useEffect(() => {
    setFooterVisible(false);
    return () => {
      setFooterVisible(true);
    };
  }, [setFooterVisible]);

  useEffect(() => {
    if (!subCategoryId) return;
    categoryApi.getSubCategories().then((subs) => {
      setSubCategory(subs.find((s) => s.id === subCategoryId) ?? null);
    }).catch(() => {});
  }, [subCategoryId]);

  useEffect(() => {
    if (!categoryId) return;
    categoryApi.getCategories().then((cats) => {
      setCategory(cats.find((c) => c.id === categoryId) ?? null);
    }).catch(() => {});
  }, [categoryId]);

  useEffect(() => {
    if (!subCategoryId) {
      setBudget(null);
      return;
    }
    setIsLoadingBudget(true);
    budgetApi.getBudgetBySubCategory(subCategoryId)
      .then(setBudget)
      .catch(() => setBudget(null))
      .finally(() => setIsLoadingBudget(false));
  }, [subCategoryId]);

  useEffect(() => {
    if (!categoryId && !subCategoryId) {
      setChartPeriods([]);
      setIsLoading(false);
      return;
    }

    const fetchChartPeriods = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await transactionApi.getTransactionsByCategoryGrouped({
          categoryId: categoryId || undefined,
          subCategoryId: subCategoryId || undefined,
          ...(viewMode === "month" ? { allMonths: true } : { allWeeks: true }),
        });

        setChartPeriods(response.data?.periods || []);
        setSummary(categoryId ? response.data?.summary || [] : []);
      } catch {
        setError("Không thể tải dữ liệu");
        setChartPeriods([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchChartPeriods();
  }, [categoryId, subCategoryId, viewMode]);

  // All transactions flattened from chartPeriods — used for metrics
  const allTransactions = useMemo(
    () => chartPeriods.flatMap((p) => p.transactions),
    [chartPeriods],
  );

  const spentAmount = useMemo(
    () => allTransactions.filter((tx) => tx.type === "out").reduce((sum, tx) => sum + tx.amount, 0),
    [allTransactions],
  );

  const transactionType = useMemo(
    () => (allTransactions.length > 0 ? allTransactions[0].type : "out") as "in" | "out",
    [allTransactions],
  );

  const formatWeekLabel = (periodString: string): string => {
    if (/^\d{1,2}$/.test(periodString.trim())) return periodString;

    const m = periodString.match(/^(\d{1,2})\/(\d{1,2})\s*-\s*(\d{1,2})\/(\d{1,2})$/);
    if (m) {
      const [, sd, sm, ed, em] = m.map(Number);
      return sm === em
        ? `${sd} - ${ed}`
        : `${sd}/${String(sm).padStart(2, "0")} - ${ed}/${String(em).padStart(2, "0")}`;
    }
    return periodString;
  };

  const chartData = useMemo(() => {
    if (chartPeriods.length === 0) return [{ label: "0", value: 0, type: transactionType }];
    return chartPeriods.map((p) => ({
      label: formatWeekLabel(p.period),
      value: p.amount,
      type: transactionType,
    }));
  }, [chartPeriods, transactionType]);

  // Click bar → highlight + fetch transactions for that period if not already in chartPeriods
  const handleChartBarClick = useCallback(
    (_label: string, index: number) => {
      // Toggle off
      if (selectedBarIndex === index) {
        setSelectedBarIndex(null);
        setSelectedPeriodTransactions(null);
        return;
      }

      setSelectedBarIndex(index);

      const period = chartPeriods[index];
      if (!period) return;

      // If API already returned transactions for this period, use them directly
      if (period.transactions.length > 0) {
        setSelectedPeriodTransactions(period.transactions);
        return;
      }

      // Otherwise fetch for this specific period
      const fetchPeriodTransactions = async () => {
        setIsLoadingPeriod(true);
        try {
          const periodStr = period.period;
          const isMonth = /^\d{1,2}$/.test(periodStr.trim());

          let weekParam: string | undefined;
          let monthParam: string | undefined;

          if (isMonth) {
            const monthNum = parseInt(periodStr.trim(), 10);
            let year = new Date().getFullYear();
            if (period.transactions.length > 0) {
              year = new Date(period.transactions[0].createdAt).getFullYear();
            } else {
              // Estimate year from position in chartPeriods
              const monthsFromNow = chartPeriods.length - 1 - index;
              const d = new Date();
              d.setMonth(d.getMonth() - monthsFromNow);
              year = d.getFullYear();
            }
            monthParam = `${String(monthNum).padStart(2, "0")}/${year}`;
          } else {
            // Week format "DD/MM - DD/MM" → convert to "DD/MM/YYYY-DD/MM/YYYY"
            const m = periodStr.match(/^(\d{1,2})\/(\d{1,2})\s*-\s*(\d{1,2})\/(\d{1,2})$/);
            if (m) {
              const [, sd, sm, ed, em] = m.map(Number);
              const totalWeeks = chartPeriods.length;
              const weeksFromNow = totalWeeks - 1 - index;
              const ref = new Date();
              ref.setDate(ref.getDate() - weeksFromNow * 7);
              const startYear = ref.getFullYear();
              const endYear = em < sm ? startYear + 1 : startYear;
              weekParam = `${String(sd).padStart(2, "0")}/${String(sm).padStart(2, "0")}/${startYear}-${String(ed).padStart(2, "0")}/${String(em).padStart(2, "0")}/${endYear}`;
            }
          }

          const response = await transactionApi.getTransactionsByCategory({
            categoryId: categoryId || undefined,
            subCategoryId: subCategoryId || undefined,
            week: weekParam,
            month: monthParam,
          });

          // API returns { data: { period, transactions } } (single period object, not periods[])
          const raw = response.data as unknown as { period?: string; transactions?: TransactionResponse[]; periods?: { transactions: TransactionResponse[] }[] };
          const txs: TransactionResponse[] = raw?.transactions ?? raw?.periods?.flatMap((p) => p.transactions) ?? [];
          const sorted = [...txs].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          setSelectedPeriodTransactions(sorted);
        } catch {
          setSelectedPeriodTransactions([]);
        } finally {
          setIsLoadingPeriod(false);
        }
      };

      fetchPeriodTransactions();
    },
    [selectedBarIndex, chartPeriods, categoryId, subCategoryId],
  );

  const dailySpending = useMemo(() => {
    const spendingMap: Record<string, number> = {};
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      spendingMap[formatDateDDMMYYYY(d)] = 0;
    }
    allTransactions
      .filter((tx) => tx.type === "out")
      .forEach((tx) => {
        const key = formatDateDDMMYYYY(new Date(tx.createdAt));
        if (key in spendingMap) spendingMap[key] += tx.amount;
      });
    return Object.entries(spendingMap).map(([date, amount]) => ({ date, amount }));
  }, [allTransactions]);

  const dailyMetrics = useMemo(() => {
    const daysWithSpending = dailySpending.filter((d) => d.amount > 0).length;
    const actualDaily = daysWithSpending > 0 ? spentAmount / daysWithSpending : 0;

    let plannedDaily = 0;
    if (budget?.period?.startDate && budget?.period?.endDate && budget?.budget) {
      const days = Math.ceil(
        (new Date(budget.period.endDate).getTime() - new Date(budget.period.startDate).getTime()) /
          (1000 * 60 * 60 * 24),
      );
      if (days > 0) plannedDaily = budget.budget / days;
    }

    return { plannedDaily, actualDaily, suggestedDaily: suggestedDailyValue };
  }, [dailySpending, spentAmount, budget, suggestedDailyValue]);

  const groupedTransactions = useMemo((): GroupedTransaction[] => {
    if (chartPeriods.length === 0) return [];

    const formatPeriodLabel = (period: string): string => {
      if (/^\d{1,2}$/.test(period.trim())) {
        return `Tháng ${parseInt(period.trim(), 10)}/${new Date().getFullYear()}`;
      }
      return period;
    };

    // Bar selected: show fetched transactions grouped by date under that period's label
    if (selectedBarIndex !== null) {
      const period = chartPeriods[selectedBarIndex];
      if (!period || selectedPeriodTransactions === null) return [];

      // Group by date
      const byDate: Record<string, TransactionResponse[]> = {};
      for (const tx of selectedPeriodTransactions) {
        const key = formatDateDDMMYYYY(new Date(tx.createdAt));
        if (!byDate[key]) byDate[key] = [];
        byDate[key].push(tx);
      }

      return Object.entries(byDate)
        .map(([date, txs]) => ({
          date,
          transactions: txs,
          dailyTotal: txs.reduce((sum, tx) => (tx.type === "in" ? sum + tx.amount : sum - tx.amount), 0),
        }))
        .sort((a, b) => {
          const [da, ma, ya] = a.date.split("/").map(Number);
          const [db, mb, yb] = b.date.split("/").map(Number);
          return new Date(yb, mb - 1, db).getTime() - new Date(ya, ma - 1, da).getTime();
        });
    }

    // No bar selected: show all periods grouped by period label
    return [...chartPeriods]
      .reverse()
      .map((p) => ({
        date: formatPeriodLabel(p.period),
        transactions: [...p.transactions].sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        ),
        dailyTotal: p.transactions.reduce((sum, tx) => (tx.type === "in" ? sum + tx.amount : sum - tx.amount), 0),
      }))
      .filter((g) => g.transactions.length > 0);
  }, [chartPeriods, selectedBarIndex, selectedPeriodTransactions]);

  const subCategoryName = subCategory?.name || category?.name || "Chi tiêu";
  const subCategoryIcon = subCategory?.icon || category?.icon || "📂";

  const maxChartValue = 125000;
  const chartHeight = 187;

  const maxSpendingDay = useMemo(
    () => dailySpending.reduce((max, d) => (d.amount > max.amount ? d : max), dailySpending[0] || { date: "", amount: 0 }),
    [dailySpending],
  );

  return {
    searchParams,
    categoryId,
    subCategoryId,
    userBalance,
    suggestedDailyValue,
    allTransactions,
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
    isLoadingPeriod,
    budget,
    isLoadingBudget,
    chartData,
    handleChartBarClick,
    dailySpending,
    dailyMetrics,
    groupedTransactions,
    subCategoryName,
    subCategoryIcon,
    maxChartValue,
    chartHeight,
    maxSpendingDay,
  };
};
