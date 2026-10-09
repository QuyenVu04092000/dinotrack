"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useAuthContext } from "app/context/AuthContext";
import { useCategories } from "app/hooks/useCategories";
import { budgetApi } from "app/services/budgetApi";
import { extractErrorMessage } from "app/lib/apiClient";
import {
  formatFinancialPeriodLabel,
  getCurrentFinancialPeriodStart,
  parseMonthParam,
  toMonthParam,
} from "app/utilities/common/functions";
import type { CategoryBudgets, UseBudgetsListResult } from "app/types/budgets";

const CATEGORY_COLORS = [
  "linear-gradient(180deg, #DCF3FE 0%, rgba(186, 232, 253, 0.15) 100%)",
  "linear-gradient(180deg, #E0F5FE 0%, rgba(224, 245, 254, 0.15) 100%)",
  "linear-gradient(180deg, #E8F5E9 0%, rgba(232, 245, 233, 0.15) 100%)",
  "linear-gradient(180deg, #FFF3E0 0%, rgba(255, 243, 224, 0.15) 100%)",
  "linear-gradient(180deg, #FCE4EC 0%, rgba(248, 187, 208, 0.15) 100%)",
  "linear-gradient(180deg, #E8EAF6 0%, rgba(197, 202, 233, 0.15) 100%)",
  "linear-gradient(180deg, #E0F2F1 0%, rgba(178, 223, 219, 0.15) 100%)",
  "linear-gradient(180deg, #FFF8E1 0%, rgba(255, 236, 179, 0.15) 100%)",
];

/** How many months past the current financial period a budget can be planned for. */
const MAX_FUTURE_MONTHS = 12;

const monthIndexOf = (d: Date) => d.getFullYear() * 12 + d.getMonth();

const getCategoryColor = (id: string) => {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash * 31 + id.charCodeAt(i)) | 0;
  }
  return CATEGORY_COLORS[Math.abs(hash) % CATEGORY_COLORS.length];
};

export const useBudgetsList = (): UseBudgetsListResult => {
  const { user, reloadProfile } = useAuthContext();
  const { categories } = useCategories();
  const startDayMonth = user?.startDayMonth ?? 1;

  const currentPeriodStart = useMemo(
    () => getCurrentFinancialPeriodStart(startDayMonth),
    [startDayMonth],
  );

  const searchParams = useSearchParams();
  const requestedMonth = parseMonthParam(searchParams.get("month"));

  const [selectedMonth, setSelectedMonth] = useState<Date>(requestedMonth ?? currentPeriodStart);
  const [budgets, setBudgets] = useState<Awaited<ReturnType<typeof budgetApi.getBudgetsSubCategories>>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Sync selectedMonth when startDayMonth changes (e.g. after reloadProfile),
  // unless the page was opened on a specific month via ?month=YYYY-MM
  useEffect(() => {
    if (requestedMonth) return;
    setSelectedMonth(getCurrentFinancialPeriodStart(startDayMonth));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startDayMonth]);

  const monthParam = toMonthParam(selectedMonth);
  const periodLabel = formatFinancialPeriodLabel(selectedMonth, startDayMonth);

  const monthOffset = monthIndexOf(selectedMonth) - monthIndexOf(currentPeriodStart);
  const isCurrentMonth = monthOffset === 0;
  const isFutureMonth = monthOffset > 0;
  const canCreateBudget = monthOffset >= 0;
  const isNextDisabled = monthOffset >= MAX_FUTURE_MONTHS;

  const hasStartDayMonth = Boolean(user?.startDayMonth);

  const goToPrevMonth = useCallback(() => {
    setSelectedMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  }, []);

  const goToNextMonth = useCallback(() => {
    setSelectedMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  }, []);

  useEffect(() => {
    reloadProfile();
  }, [reloadProfile]);

  useEffect(() => {
    const fetchBudgets = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await budgetApi.getBudgetsSubCategories({ month: monthParam });
        setBudgets(data);
      } catch (err) {
        setError(extractErrorMessage(err));
        setBudgets([]);
      } finally {
        setLoading(false);
      }
    };
    fetchBudgets();
  }, [monthParam]);

  const budgetsByCategory: CategoryBudgets[] = useMemo(() => {
    const map = new Map<string, CategoryBudgets>();
    for (const b of budgets) {
      for (const cat of categories) {
        const sub = cat.subCategories.find((s) => s.id === b.subCategoryId);
        if (sub) {
          const existing = map.get(cat.id);
          if (existing) {
            existing.budgets.push(b);
          } else {
            map.set(cat.id, {
              category: cat,
              budgets: [b],
              background: getCategoryColor(cat.id),
            });
          }
          break;
        }
      }
    }
    return Array.from(map.values());
  }, [budgets, categories]);

  return {
    loading,
    error,
    periodLabel,
    monthParam,
    budgetsByCategory,
    isCurrentMonth,
    isFutureMonth,
    canCreateBudget,
    isNextDisabled,
    hasStartDayMonth,
    goToPrevMonth,
    goToNextMonth,
  };
};
