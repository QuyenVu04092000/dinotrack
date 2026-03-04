import { TransactionType } from "@features/transactions/transaction.types";
import { useAuthContext } from "app/context/AuthContext";
import { extractErrorMessage } from "app/lib/apiClient";
import { transactionApi } from "app/services/transactionApi";
import React from "react";
import { useCategories } from "./useCategories";
import { Category, SubCategory } from "app/types/category";
import {
  formatVietnameseCurrency,
  formatAmountInput,
  parseAmountInput,
  getDaysInMonth,
} from "app/utilities/common/functions";
import { AuthUser } from "app/types/auth";
import { categoryApi } from "app/services/categoryApi";
import type { UseHomeResult } from "app/types/home";

export const useHome = (): UseHomeResult => {
  const [activeType, setActiveType] = React.useState<TransactionType>("expense");
  const [selectedDate, setSelectedDate] = React.useState<string>(() => {
    const today = new Date();
    // Format as YYYY-MM-DD in local time (avoid timezone shifting)
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  });
  const [selectedCategory, setSelectedCategory] = React.useState<SubCategory>({} as SubCategory);
  const [isDateModalOpen, setIsDateModalOpen] = React.useState(false);
  const [currentMonth, setCurrentMonth] = React.useState<Date>(() => {
    const today = new Date();
    return today;
  });
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submitError, setSubmitError] = React.useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = React.useState<string | null>(null);
  const [amountValue, setAmountValue] = React.useState<string>("");
  const [todaySpent, setTodaySpent] = React.useState<number>(0);
  const [todaySpentLoading, setTodaySpentLoading] = React.useState<boolean>(true);
  const [todaySpentError, setTodaySpentError] = React.useState<string | null>(null);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = React.useState(false);
  const [quickSubCategories, setQuickSubCategories] = React.useState<SubCategory[]>([]);
  const [quickSubsLoading, setQuickSubsLoading] = React.useState<boolean>(true);
  const [quickSubsError, setQuickSubsError] = React.useState<string | null>(null);
  const { user, isAuthenticated, isTokenValid, reloadProfile } = useAuthContext();
  const { categories, isLoading: categoriesLoading, error: categoriesError } = useCategories();

  // Ensure we have the latest profile when token is valid but user not loaded
  React.useEffect(() => {
    reloadProfile();
  }, []);

  const displayName = user?.name;

  const formattedDateLabel = React.useMemo(() => {
    if (!selectedDate) return "Chọn ngày";
    const [year, month, day] = selectedDate.split("-");
    const base = `${day}/${month}/${year}`;
    const todayIso = new Date().toISOString().split("T")[0];
    return selectedDate === todayIso ? `${base} (Hôm nay)` : base;
  }, [selectedDate]);

  const handleCategorySelectChange = (category: SubCategory) => {
    setSelectedCategory(category);
  };

  const handleQuickCategoryClick = (category: SubCategory) => {
    setSelectedCategory(category);
  };

  const handleOpenDateModal = () => {
    setIsDateModalOpen(true);
    // Sync calendar month with selected date
    const base = selectedDate ? new Date(selectedDate) : new Date();
    setCurrentMonth(base);
  };

  const handleCloseDateModal = () => {
    setIsDateModalOpen(false);
  };

  const handleSelectedDateFromCalendar = (day: number) => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth(); // 0-based
    // Build YYYY-MM-DD string manually to avoid timezone issues
    const iso = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    setSelectedDate(iso);
    setIsDateModalOpen(false);
  };

  const goToPreviousMonth = () => {
    setCurrentMonth((prev) => {
      const year = prev.getFullYear();
      const month = prev.getMonth();
      return new Date(year, month - 1, 1);
    });
  };

  const goToNextMonth = () => {
    setCurrentMonth((prev) => {
      const year = prev.getFullYear();
      const month = prev.getMonth();
      return new Date(year, month + 1, 1);
    });
  };

  const calendarYear = currentMonth.getFullYear();
  const calendarMonth = currentMonth.getMonth(); // 0-11
  const daysInMonth = getDaysInMonth(calendarYear, calendarMonth);
  const firstDayOfWeek = new Date(calendarYear, calendarMonth, 1).getDay(); // 0-6, Sun-Sat
  // Vietnamese weekday headers: CN, T2, T3, T4, T5, T6, T7
  const weekDayHeaders = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
  // Today's date in local YYYY-MM-DD for disabling future days
  const todayLocalIso = React.useMemo(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }, []);

  const fetchTodaySpent = React.useCallback(async () => {
    try {
      setTodaySpentLoading(true);
      setTodaySpentError(null);
      const amount = await transactionApi.getTodaySpent();
      setTodaySpent(amount);
    } catch (error) {
      setTodaySpentError(extractErrorMessage(error));
    } finally {
      setTodaySpentLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchTodaySpent();
  }, [fetchTodaySpent]);

  // Fetch quick sub-categories for suggestion pills
  React.useEffect(() => {
    const fetchQuickSubs = async () => {
      try {
        setQuickSubsLoading(true);
        setQuickSubsError(null);
        const data = await categoryApi.getSubCategories();
        setQuickSubCategories(data);
      } catch (error) {
        setQuickSubsError(extractErrorMessage(error));
      } finally {
        setQuickSubsLoading(false);
      }
    };

    fetchQuickSubs();
  }, []);

  // Prevent background scrolling when category modal is open
  React.useEffect(() => {
    if (isCategoryModalOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
    return;
  }, [isCategoryModalOpen]);

  const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;
    const formatted = formatAmountInput(inputValue);
    setAmountValue(formatted);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitError(null);
    setSubmitSuccess(null);

    const form = event.currentTarget;
    const noteInput = form.elements.namedItem("note") as HTMLInputElement | null;

    const note = noteInput?.value ?? "";

    // Parse formatted amount back to number
    const amount = parseAmountInput(amountValue);

    if (!amountValue || amount <= 0) {
      setSubmitError("Vui lòng nhập số tiền hợp lệ.");
      return;
    }

    if (!selectedCategory) {
      setSubmitError("Vui lòng chọn danh mục.");
      return;
    }

    const apiType = activeType === "expense" ? "out" : "in";

    try {
      setIsSubmitting(true);
      await transactionApi.createTransaction({
        type: apiType,
        amount,
        categoryId: selectedCategory.categoryId,
        subCategoryId: selectedCategory.id,
        status: "ACTIVE",
        createdAt: selectedDate,
        note: note || undefined,
      });
      setSubmitSuccess("Đã lưu giao dịch thành công.");
      // Refresh today's spent amount
      fetchTodaySpent();
      // Refresh user profile to get updated balance
      reloadProfile();
      // Reset amount/note after success
      setAmountValue("");
      if (noteInput) noteInput.value = "";
    } catch (error) {
      const message = extractErrorMessage(error);
      setSubmitError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isExpense = activeType === "expense";
  const formattedTodaySpent = formatVietnameseCurrency(todaySpent);

  return {
    displayName,
    formattedTodaySpent,
    activeType,
    setActiveType,
    handleSubmit,
    handleOpenDateModal,
    formattedDateLabel,
    isExpense,
    selectedCategory,
    handleCategorySelectChange,
    categoriesLoading,
    categoriesError,
    categories,
    handleQuickCategoryClick,
    submitError,
    submitSuccess,
    isSubmitting,
    isDateModalOpen,
    goToPreviousMonth,
    currentMonth,
    goToNextMonth,
    weekDayHeaders,
    firstDayOfWeek,
    daysInMonth,
    calendarYear,
    calendarMonth,
    selectedDate,
    todayLocalIso,
    handleSelectedDateFromCalendar,
    handleCloseDateModal,
    setSelectedDate,
    setCurrentMonth,
    setIsDateModalOpen,
    amountValue,
    handleAmountChange,
    user,
    isCategoryModalOpen,
    setIsCategoryModalOpen,
    quickSubCategories,
    quickSubsLoading,
    quickSubsError,
  };
};
