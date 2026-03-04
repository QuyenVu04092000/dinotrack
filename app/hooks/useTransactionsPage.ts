"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuthContext } from "app/context/AuthContext";
import { useCategories } from "app/hooks/useCategories";
import { transactionApi } from "app/services/transactionApi";
import { categoryApi } from "app/services/categoryApi";
import type { TransactionResponse } from "app/types/transaction";
import type { Category, SubCategory } from "app/types/category";
import type { DailyTransaction, GroupedTransaction, UseTransactionsPageResult } from "app/types/transactionsPage";

export const useTransactionsPage = (): UseTransactionsPageResult => {
  const { user, isLoading: authLoading, reloadProfile } = useAuthContext();

  // Separate state for calendar (all month transactions) and transaction list (filtered)
  const [calendarTransactions, setCalendarTransactions] = useState<TransactionResponse[]>([]);
  const [listTransactions, setListTransactions] = useState<TransactionResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingList, setIsLoadingList] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [currentMonth, setCurrentMonth] = useState<Date>(() => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), 1);
  });
  const [selectedDate, setSelectedDate] = useState<Date | null>(() => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), today.getDate());
  });
  const [hasAlignedInitialMonth, setHasAlignedInitialMonth] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterType, setFilterType] = useState<"all" | "out" | "in">("all");
  const [selectedSubCategoryIds, setSelectedSubCategoryIds] = useState<Set<string>>(new Set());
  // Draft filter state (only applied on "Xác nhận")
  const [draftFilterType, setDraftFilterType] = useState<"all" | "out" | "in">("all");
  const [draftSelectedSubCategoryIds, setDraftSelectedSubCategoryIds] = useState<Set<string>>(new Set());

  const { categories, isLoading: categoriesLoading } = useCategories();
  const [refreshToken, setRefreshToken] = useState(0);

  // Always ensure we have the latest profile (startDayMonth, etc.) on this page
  useEffect(() => {
    reloadProfile();
  }, [reloadProfile]);

  const openFilter = useCallback(() => {
    setDraftFilterType(filterType);
    setDraftSelectedSubCategoryIds(new Set(selectedSubCategoryIds));
    setIsFilterOpen(true);
  }, [filterType, selectedSubCategoryIds]);

  const toggleDraftSubCategory = useCallback((subCategoryId: string) => {
    setDraftSelectedSubCategoryIds((prev) => {
      const next = new Set(prev);
      if (next.has(subCategoryId)) next.delete(subCategoryId);
      else next.add(subCategoryId);
      return next;
    });
  }, []);

  const toggleDraftCategory = useCallback(
    (category: Category) => {
      const subIds = category.subCategories.map((s) => s.id);
      const allSelected = subIds.every((id) => draftSelectedSubCategoryIds.has(id));
      setDraftSelectedSubCategoryIds((prev) => {
        const next = new Set(prev);
        if (allSelected) {
          subIds.forEach((id) => next.delete(id));
        } else {
          subIds.forEach((id) => next.add(id));
        }
        return next;
      });
    },
    [draftSelectedSubCategoryIds],
  );

  const applyFilterAndClose = useCallback(() => {
    setFilterType(draftFilterType);
    setSelectedSubCategoryIds(new Set(draftSelectedSubCategoryIds));
    setIsFilterOpen(false);
  }, [draftFilterType, draftSelectedSubCategoryIds]);

  // Fetch sub-categories for icons
  useEffect(() => {
    const fetchSubCategories = async () => {
      try {
        const subs = await categoryApi.getSubCategories();
        setSubCategories(subs);
      } catch (err) {
        console.error("Failed to fetch sub-categories:", err);
      }
    };
    fetchSubCategories();
  }, []);

  // Calculate month period based on user's startDayMonth
  const monthPeriod = useMemo(() => {
    if (!user?.startDayMonth) {
      // Default to current month if no startDayMonth
      const year = currentMonth.getFullYear();
      const month = currentMonth.getMonth() + 1;
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0);
      return {
        startDate: `${startDate.getFullYear()}-${String(startDate.getMonth() + 1).padStart(
          2,
          "0",
        )}-${String(startDate.getDate()).padStart(2, "0")}`,
        endDate: `${endDate.getFullYear()}-${String(endDate.getMonth() + 1).padStart(
          2,
          "0",
        )}-${String(endDate.getDate()).padStart(2, "0")}`,
        monthLabel: `Tháng ${month} (${String(startDate.getDate()).padStart(
          2,
          "0",
        )}/${month}-${String(endDate.getDate()).padStart(2, "0")}/${month})`,
      };
    }

    const startDay = user.startDayMonth;
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth() + 1;

    // Calculate start date (startDay of current month)
    const startDate = new Date(year, month - 1, startDay);
    // Calculate end date (startDay - 1 of next month)
    const endDate = new Date(year, month, startDay - 1);

    return {
      startDate: `${startDate.getFullYear()}-${String(startDate.getMonth() + 1).padStart(
        2,
        "0",
      )}-${String(startDate.getDate()).padStart(2, "0")}`,
      endDate: `${endDate.getFullYear()}-${String(endDate.getMonth() + 1).padStart(
        2,
        "0",
      )}-${String(endDate.getDate()).padStart(2, "0")}`,
      monthLabel: `Tháng ${month} (${String(startDate.getDate()).padStart(
        2,
        "0",
      )}/${month}-${String(endDate.getDate()).padStart(2, "0")}/${month === 12 ? 1 : month + 1})`,
    };
  }, [currentMonth, user?.startDayMonth]);

  // Parsed date objects for current financial month period range
  const monthPeriodRange = useMemo(() => {
    const [startYear, startMonth, startDay] = monthPeriod.startDate.split("-").map(Number);
    const [endYear, endMonth, endDay] = monthPeriod.endDate.split("-").map(Number);

    return {
      start: new Date(startYear, startMonth - 1, startDay),
      end: new Date(endYear, endMonth - 1, endDay),
    };
  }, [monthPeriod.startDate, monthPeriod.endDate]);

  // Fetch calendar transactions (all month data) - for calendar display
  useEffect(() => {
    const fetchCalendarTransactions = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await transactionApi.getAllTransactions({
          startDate: monthPeriod.startDate,
          endDate: monthPeriod.endDate,
        });

        const transactionsData = response.data || [];
        // Sort by createdAt DESC
        const sorted = [...transactionsData].sort((a, b) => {
          const dateA = new Date(a.createdAt).getTime();
          const dateB = new Date(b.createdAt).getTime();
          return dateB - dateA;
        });

        setCalendarTransactions(sorted);
      } catch (err: any) {
        setError(err?.message || "Không thể tải dữ liệu");
        console.error("Failed to fetch calendar transactions:", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (authLoading) {
      return;
    }

    fetchCalendarTransactions();
  }, [monthPeriod.startDate, monthPeriod.endDate, authLoading]);

  // Fetch transaction list (filtered by selected date or all month)
  useEffect(() => {
    const fetchListTransactions = async () => {
      try {
        setIsLoadingList(true);
        setError(null);

        let apiParams: {
          startDate?: string;
          endDate?: string;
          categoryIds?: string[];
        };

        if (selectedDate !== null) {
          // Format selected date as YYYY-MM-DD
          const year = selectedDate.getFullYear();
          const month = selectedDate.getMonth() + 1;
          const day = selectedDate.getDate();
          const formattedDate = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

          // Use the same date for both startDate and endDate
          apiParams = {
            startDate: formattedDate,
            endDate: formattedDate,
          };
        } else {
          // Use month period (show all transactions)
          apiParams = {
            startDate: monthPeriod.startDate,
            endDate: monthPeriod.endDate,
          };
        }

        if (selectedSubCategoryIds.size > 0) {
          apiParams.categoryIds = Array.from(selectedSubCategoryIds);
        }

        const response = await transactionApi.getAllTransactions(apiParams);

        const transactionsData = response.data || [];
        // Sort by createdAt DESC
        const sorted = [...transactionsData].sort((a, b) => {
          const dateA = new Date(a.createdAt).getTime();
          const dateB = new Date(b.createdAt).getTime();
          return dateB - dateA;
        });

        setListTransactions(sorted);
      } catch (err: any) {
        setError(err?.message || "Không thể tải dữ liệu");
        console.error("Failed to fetch list transactions:", err);
      } finally {
        setIsLoadingList(false);
      }
    };

    if (authLoading) {
      return;
    }

    // Debounce to prevent flash when clicking dates
    const timeoutId = setTimeout(() => {
      fetchListTransactions();
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [monthPeriod.startDate, monthPeriod.endDate, selectedDate, currentMonth, authLoading, selectedSubCategoryIds]);

  // Calculate summary totals (use calendar transactions for month summary)
  const summary = useMemo(() => {
    const totalExpense = calendarTransactions.filter((tx) => tx.type === "out").reduce((sum, tx) => sum + tx.amount, 0);
    const totalIncome = calendarTransactions.filter((tx) => tx.type === "in").reduce((sum, tx) => sum + tx.amount, 0);
    const difference = totalIncome - totalExpense;

    return {
      totalExpense,
      totalIncome,
      difference,
    };
  }, [calendarTransactions]);

  // Group transactions by day for calendar (use calendarTransactions), keyed by full date
  const dailyTransactions = useMemo(() => {
    const dailyMap: Record<string, DailyTransaction> = {};

    const startTime = monthPeriodRange.start.getTime();
    const endTime = monthPeriodRange.end.getTime();

    calendarTransactions.forEach((tx) => {
      const date = new Date(tx.createdAt);
      const time = date.getTime();

      // Only include transactions within the current financial month period
      if (time < startTime || time > endTime) return;

      const day = date.getUTCDate();
      const month = date.getUTCMonth() + 1; // 1-12
      const year = date.getUTCFullYear();
      const key = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

      if (!dailyMap[key]) {
        dailyMap[key] = { date: key, income: 0, expense: 0 };
      }
      if (tx.type === "in") {
        dailyMap[key].income += tx.amount;
      } else {
        dailyMap[key].expense += tx.amount;
      }
    });

    return dailyMap;
  }, [calendarTransactions, monthPeriodRange]);

  // Apply type filter only (category filter is done by API via categoryIds[])
  const filteredListTransactions = useMemo(() => {
    return listTransactions.filter((tx) => {
      if (filterType === "out" && tx.type !== "out") return false;
      if (filterType === "in" && tx.type !== "in") return false;
      return true;
    });
  }, [listTransactions, filterType]);

  // Group transactions by date for list (use filtered list)
  const groupedTransactions = useMemo(() => {
    const groups: Record<string, TransactionResponse[]> = {};

    filteredListTransactions.forEach((tx) => {
      const date = new Date(tx.createdAt);
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      const dateKey = `${day}/${month}/${year}`;

      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(tx);
    });

    const result: GroupedTransaction[] = Object.entries(groups).map(([date, txs]) => ({
      date,
      transactions: txs.sort((a, b) => {
        const timeA = new Date(a.createdAt).getTime();
        const timeB = new Date(b.createdAt).getTime();
        return timeB - timeA;
      }),
    }));

    // Sort groups by date descending
    return result.sort((a, b) => {
      const [dayA, monthA, yearA] = a.date.split("/").map(Number);
      const [dayB, monthB, yearB] = b.date.split("/").map(Number);
      const dateA = new Date(yearA, monthA - 1, dayA).getTime();
      const dateB = new Date(yearB, monthB - 1, dayB).getTime();
      return dateB - dateA;
    });
  }, [filteredListTransactions]);

  // Get sub-category icon
  const getSubCategoryIcon = useCallback(
    (subCategoryId: string | null | undefined): string => {
      if (!subCategoryId) return "📂";
      const subCategory = subCategories.find((sub) => sub.id === subCategoryId);
      return subCategory?.icon || "📂";
    },
    [subCategories],
  );

  // Format amount for calendar (e.g., "145k", "5tr")
  const formatCalendarAmount = (amount: number): string => {
    if (amount >= 1000000) {
      return `${(amount / 1000000).toFixed(1)}tr`;
    } else if (amount >= 1000) {
      return `${Math.round(amount / 1000)}k`;
    }
    return amount.toString();
  };

  // Ensure currentMonth initially reflects the "financial month" that contains today,
  // based on user's custom startDayMonth (e.g. 10th of month).
  useEffect(() => {
    if (!user?.startDayMonth || hasAlignedInitialMonth) return;

    const today = new Date();
    const startDay = user.startDayMonth;

    let periodYear = today.getFullYear();
    let periodMonth = today.getMonth(); // 0-11

    // If today is before the configured start day, we are still in the previous period
    if (today.getDate() < startDay) {
      periodMonth -= 1;
      if (periodMonth < 0) {
        periodMonth = 11;
        periodYear -= 1;
      }
    }

    const alignedMonth = new Date(periodYear, periodMonth, 1);
    setCurrentMonth(alignedMonth);
    setHasAlignedInitialMonth(true);
  }, [user?.startDayMonth, hasAlignedInitialMonth]);

  // Reset selectedDate if it goes outside the current financial month period
  useEffect(() => {
    if (selectedDate === null) return;

    if (
      selectedDate.getTime() < monthPeriodRange.start.getTime() ||
      selectedDate.getTime() > monthPeriodRange.end.getTime()
    ) {
      setSelectedDate(null);
    }
  }, [monthPeriodRange, selectedDate]);

  // Navigate to previous month (financial month)
  const handlePreviousMonth = () => {
    const newMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1);
    setCurrentMonth(newMonth);
    setSelectedDate(null);
  };

  // Navigate to next month (financial month)
  const handleNextMonth = () => {
    const newMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1);
    setCurrentMonth(newMonth);
    setSelectedDate(null);
  };

  // Handle date selection - use useCallback to prevent unnecessary re-renders
  const handleDateClick = useCallback((date: Date) => {
    setSelectedDate((prevSelected) => {
      // Deselect if clicking the same date
      if (prevSelected && prevSelected.getTime() === date.getTime()) {
        return null;
      }
      return date;
    });
  }, []);

  // Get calendar days for the current financial month period
  const calendarDays = useMemo(() => {
    const days: (Date | null)[] = [];
    const start = monthPeriodRange.start;
    const end = monthPeriodRange.end;

    const startDayOfWeek = start.getDay(); // 0 = Sunday, 1 = Monday, etc.
    // Adjust for Vietnamese week (Monday = 0)
    const adjustedStartingDay = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1;

    // Add empty cells before the period start date, so the start date
    // appears in the first row at its correct weekday column
    for (let i = 0; i < adjustedStartingDay; i++) {
      days.push(null);
    }

    const current = new Date(start.getFullYear(), start.getMonth(), start.getDate());

    while (current.getTime() <= end.getTime()) {
      days.push(new Date(current.getFullYear(), current.getMonth(), current.getDate()));
      current.setDate(current.getDate() + 1);
    }

    // Pad trailing cells so the grid is complete weeks
    while (days.length % 7 !== 0) {
      days.push(null);
    }

    return days;
  }, [monthPeriodRange]);

  const weekDays = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];

  return {
    authLoading,
    monthPeriod,
    monthPeriodRange,
    calendarDays,
    weekDays,
    selectedDate,
    handlePreviousMonth,
    handleNextMonth,
    handleDateClick,
    isLoadingList,
    error,
    groupedTransactions,
    dailyTransactions,
    summary,
    formatCalendarAmount,
    getSubCategoryIcon,
    isFilterOpen,
    openFilter,
    setIsFilterOpen: (open: boolean) => setIsFilterOpen(open),
    categories,
    categoriesLoading,
    draftSelectedSubCategoryIds,
    toggleDraftCategory,
    toggleDraftSubCategory,
    applyFilterAndClose,
  };
};
