"use client";

import { useEffect, useMemo, useState } from "react";
import { useAuthContext } from "app/context/AuthContext";
import { useCategories } from "app/hooks/useCategories";
import { budgetApi } from "app/services/budgetApi";
import type { Category } from "app/types/category";
import { BudgetBySubCategoryResponse } from "app/types/budget";

type CategoryBudgets = {
  category: Category;
  budgets: BudgetBySubCategoryResponse[];
  background: string;
};

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
  const index = Math.abs(hash) % CATEGORY_COLORS.length;
  return CATEGORY_COLORS[index];
};

export const useBudgetsList = () => {
  const { user, reloadProfile } = useAuthContext();
  const { categories } = useCategories();
  const [budgets, setBudgets] = useState<BudgetBySubCategoryResponse[]>([]);
  const [loading, setLoading] = useState(true);

  const { monthParam, periodLabel } = useMemo(() => {
    const today = new Date();
    const startDay = user?.startDayMonth ?? 1;
    let periodYear = today.getFullYear();
    let periodMonth = today.getMonth();
    if (today.getDate() < startDay) {
      periodMonth -= 1;
      if (periodMonth < 0) {
        periodMonth = 11;
        periodYear -= 1;
      }
    }
    const month = periodMonth + 1;
    const startDate = new Date(periodYear, periodMonth, startDay);
    const endDate = new Date(periodYear, periodMonth + 1, startDay - 1);
    const d1 = String(startDate.getDate()).padStart(2, "0");
    const m1 = month;
    const d2 = String(endDate.getDate()).padStart(2, "0");
    const m2 = endDate.getMonth() + 1;
    return {
      monthParam: `${periodYear}-${String(month).padStart(2, "0")}`,
      periodLabel: `Tháng ${month} (${d1}/${m1}-${d2}/${m2})`,
    };
  }, [user?.startDayMonth]);

  // Ensure latest profile (startDayMonth) when budgets list is used
  useEffect(() => {
    reloadProfile();
  }, [reloadProfile]);

  useEffect(() => {
    const fetchBudgets = async () => {
      setLoading(true);
      try {
        const data = await budgetApi.getBudgetsSubCategories({
          month: monthParam,
        });
        setBudgets(data);
      } catch (err) {
        console.error("Failed to fetch budgets:", err);
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
    periodLabel,
    budgetsByCategory,
  };
};
