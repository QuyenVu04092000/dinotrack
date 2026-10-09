"use client";

import React, { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { SubCategory } from "app/types/category";
import {
  formatAmountInput,
  formatFinancialPeriodLabel,
  getCurrentFinancialPeriodStart,
  parseAmountInput,
  parseMonthParam,
  toMonthParam,
} from "app/utilities/common/functions";
import { budgetApi } from "app/services/budgetApi";
import { extractErrorMessage } from "app/lib/apiClient";
import type { UseCreateBudgetProps, UseCreateBudgetResult } from "app/types/budgets";
import { useAuthContext } from "app/context/AuthContext";

export const useCreateBudget = ({ category, setCategory, month }: UseCreateBudgetProps): UseCreateBudgetResult => {
  const router = useRouter();
  const { user } = useAuthContext();
  const startDayMonth = user?.startDayMonth ?? 1;

  const currentPeriodStart = useMemo(() => getCurrentFinancialPeriodStart(startDayMonth), [startDayMonth]);
  // Budgets may target the current or an upcoming period; a missing, malformed
  // or past ?month falls back to the current period
  const targetMonth = useMemo(() => {
    const requested = parseMonthParam(month);
    return requested && requested >= currentPeriodStart ? requested : currentPeriodStart;
  }, [month, currentPeriodStart]);
  const targetMonthParam = toMonthParam(targetMonth);
  const targetPeriodLabel = formatFinancialPeriodLabel(targetMonth, startDayMonth);
  const isCurrentPeriod = targetMonth.getTime() === currentPeriodStart.getTime();

  const [amountValue, setAmountValue] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleBack = useCallback(() => {
    setCategory({} as SubCategory);
  }, [setCategory]);

  const handleAmountChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;
    const formatted = formatAmountInput(inputValue);
    setAmountValue(formatted);
  }, []);

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (!category || !amountValue || !category.id) {
        return;
      }

      // Parse formatted amount back to number
      const budgetAmount = parseAmountInput(amountValue);

      if (budgetAmount <= 0) {
        setSubmitError("Vui lòng nhập số tiền hợp lệ.");
        return;
      }

      setIsSubmitting(true);
      setSubmitError(null);
      setSubmitSuccess(false);

      try {
        await budgetApi.createBudget({
          subCategoryId: category.id,
          budget: budgetAmount,
          month: targetMonthParam,
        });
        const params = new URLSearchParams();
        params.set("subCategoryId", category.id);

        setSubmitSuccess(true);
        // Current period: show the sub-category's spending; upcoming period: return to that month's budgets
        setTimeout(() => {
          router.push(
            isCurrentPeriod
              ? `/transactions/category?${params.toString()}`
              : `/budgets?month=${targetMonthParam}`,
          );
        }, 1000);
      } catch (error) {
        const message = extractErrorMessage(error);
        setSubmitError(message);
      } finally {
        setIsSubmitting(false);
      }
    },
    [category, amountValue, router, targetMonthParam, isCurrentPeriod],
  );

  const isFormValid = Boolean(category && category.id && amountValue.trim().length > 0);

  return {
    amountValue,
    isFormValid,
    isSubmitting,
    submitError,
    submitSuccess,
    targetPeriodLabel,
    handleBack,
    handleAmountChange,
    handleSubmit,
  };
};
