"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuthContext } from "app/context/AuthContext";
import { useCategories } from "app/hooks/useCategories";
import { budgetApi } from "app/services/budgetApi";
import { extractErrorMessage } from "app/lib/apiClient";
import { getCurrentFinancialPeriodStart } from "app/utilities/common/functions";
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

  const [selectedMonth, setSelectedMonth] = useState<Date>(currentPeriodStart);
  const [budgets, setBudgets] = useState<Awaited<ReturnType<typeof budgetApi.getBudgetsSubCategories>>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Sync selectedMonth when startDayMonth changes (e.g. after reloadProfile)
  useEffect(() => {
    setSelectedMonth(getCurrentFinancialPeriodStart(startDayMonth));
  }, [startDayMonth]);

  const { monthParam, periodLabel } = useMemo(() => {
    const year = selectedMonth.getFullYear();
    const monthNum = selectedMonth.getMonth() + 1;
    const startDate = new Date(year, selectedMonth.getMonth(), startDayMonth);
    const endDate = new Date(year, selectedMonth.getMonth() + 1, startDayMonth - 1);
    const d1 = String(startDate.getDate()).padStart(2, "0");
    const m1 = startDate.getMonth() + 1;
    const d2 = String(endDate.getDate()).padStart(2, "0");
    const m2 = endDate.getMonth() + 1;
    return {
      monthParam: `${year}-${String(monthNum).padStart(2, "0")}`,
      periodLabel: `Tháng ${monthNum} (${d1}/${m1}-${d2}/${m2})`,
    };
  }, [selectedMonth, startDayMonth]);

  const isCurrentMonth =
    selectedMonth.getFullYear() === currentPeriodStart.getFullYear() &&
    selectedMonth.getMonth() === currentPeriodStart.getMonth();

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
    budgetsByCategory,
    isCurrentMonth,
    hasStartDayMonth,
    goToPrevMonth,
    goToNextMonth,
  };
};
