"use client";

import React, { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { SubCategory } from "app/types/category";
import { formatAmountInput, parseAmountInput } from "app/utilities/common/functions";
import { budgetApi } from "app/services/budgetApi";
import { extractErrorMessage } from "app/lib/apiClient";
import type { UseCreateBudgetProps, UseCreateBudgetResult } from "app/types/budgets";

export const useCreateBudget = ({ category, setCategory }: UseCreateBudgetProps): UseCreateBudgetResult => {
  const router = useRouter();

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

      // Get current month in YYYY-MM format
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, "0");
      const monthString = `${year}-${month}`;

      setIsSubmitting(true);
      setSubmitError(null);
      setSubmitSuccess(false);

      try {
        await budgetApi.createBudget({
          subCategoryId: category.id,
          budget: budgetAmount,
          month: monthString,
        });
        const params = new URLSearchParams();
        params.set("subCategoryId", category.id);

        setSubmitSuccess(true);
        // Navigate back after successful creation
        setTimeout(() => {
          router.push(`/transactions/category?${params.toString()}`);
        }, 1000);
      } catch (error) {
        const message = extractErrorMessage(error);
        setSubmitError(message);
      } finally {
        setIsSubmitting(false);
      }
    },
    [category, amountValue, router],
  );

  const isFormValid = Boolean(category && category.id && amountValue.trim().length > 0);

  return {
    amountValue,
    isFormValid,
    isSubmitting,
    submitError,
    submitSuccess,
    handleBack,
    handleAmountChange,
    handleSubmit,
  };
};
