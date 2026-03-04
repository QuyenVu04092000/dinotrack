import { TransactionType } from "@features/transactions/transaction.types";
import { useAuthContext } from "app/context/AuthContext";
import { extractErrorMessage } from "app/lib/apiClient";
import { transactionApi } from "app/services/transactionApi";
import React from "react";
import { useCategories } from "./useCategories";
import { Category } from "app/types/category";
import {
  formatVietnameseCurrency,
  formatAmountInput,
  parseAmountInput,
  getDaysInMonth,
} from "app/utilities/common/functions";
import { AuthUser } from "app/types/auth";
import type { UseBudgetsResult } from "app/types/budgets";

export const useBudgets = (): UseBudgetsResult => {
  const { categories, isLoading: categoriesLoading, error: categoriesError } = useCategories();

  return {
    categoriesLoading,
    categoriesError,
    categories,
  };
};
