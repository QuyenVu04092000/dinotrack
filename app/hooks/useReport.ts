"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { transactionApi } from "app/services/transactionApi";
import type { GetReportParams, ReportResponse, ReportCategory, ReportSubCategory } from "app/types/transactionApi";
import { extractErrorMessage } from "app/lib/apiClient";
import { useAuthContext } from "app/context/AuthContext";
import { formatVietnameseCurrency } from "app/utilities/common/functions";
import { categoryApi } from "app/services/categoryApi";
import type { SubCategory } from "app/types/category";
import type { ReportType, ReportPeriod, CategoryView, UseReportResult } from "app/types/report";

const CHART_COLORS = [
  "#7dd5fc", // chart-1
  "#f9a8d0", // chart-2
  "#fee28a", // chart-7
  "#86efad", // chart-4
  "#dab4fe", // chart-5
  "#aab9cf", // chart-8
];

export const useReport = (): UseReportResult => {
  const { user, reloadProfile } = useAuthContext();
  const [reportData, setReportData] = useState<ReportResponse["data"] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reportType, setReportType] = useState<ReportType>("expense");
  const [period, setPeriod] = useState<ReportPeriod>("week");
  const [categoryView, setCategoryView] = useState<CategoryView>("sub");

  const [todaySpent, setTodaySpent] = useState<number>(0);
  const [todaySpentLoading, setTodaySpentLoading] = useState(true);
  const [subCategoriesWithIcons, setSubCategoriesWithIcons] = useState<SubCategory[]>([]);

  // Always ensure we have the latest profile when using reports
  useEffect(() => {
    reloadProfile();
  }, [reloadProfile]);

  const fetchReport = useCallback(async () => {
    if (!user?.id) return;

    setIsLoading(true);
    setError(null);

    try {
      const params: GetReportParams = {
        period,
        type: reportType === "expense" ? "out" : "in",
      };

      const response = await transactionApi.getReport(params);
      setReportData(response.data);
    } catch (err) {
      const message = extractErrorMessage(err);
      setError(message);
      setReportData(null);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, period, reportType]);

  useEffect(() => {
    fetchReport();
  }, [fetchReport]);

  // Fetch today's spent amount
  useEffect(() => {
    const fetchTodaySpent = async () => {
      try {
        setTodaySpentLoading(true);
        const amount = await transactionApi.getTodaySpent();
        setTodaySpent(amount);
      } catch (error) {
        console.error("Failed to fetch today's spent:", error);
      } finally {
        setTodaySpentLoading(false);
      }
    };

    fetchTodaySpent();
  }, []);

  // Fetch sub-categories to get icons
  useEffect(() => {
    const fetchSubCategories = async () => {
      try {
        const subs = await categoryApi.getSubCategories();
        setSubCategoriesWithIcons(subs);
      } catch (error) {
        console.error("Failed to fetch sub-categories:", error);
      }
    };

    fetchSubCategories();
  }, []);

  const totalAmount = useMemo(() => {
    if (!reportData) return 0;
    return reportType === "expense" ? reportData.totalExpense : reportData.totalIncome;
  }, [reportData, reportType]);

  const formattedTotalAmount = useMemo(() => {
    return formatVietnameseCurrency(totalAmount);
  }, [totalAmount]);

  const periodLabel = useMemo(() => {
    if (!reportData) return "";
    return reportData.period;
  }, [reportData]);

  const categories = useMemo(() => {
    if (!reportData) return [];
    return reportData.categories || [];
  }, [reportData]);

  // Calculate percentages for sub-categories (with icons and colors)
  const subCategoriesWithPercentages = useMemo(() => {
    if (!reportData || categoryView !== "sub") return [];

    const allSubCategories: Array<{
      subCategoryId: string;
      subCategoryName: string;
      totalExpense: number;
      totalIncome: number;
      percentage: number;
      color: string;
      icon?: string;
    }> = [];

    const iconMap = new Map<string, string>();
    subCategoriesWithIcons.forEach((sub) => {
      iconMap.set(sub.id, sub.icon);
    });

    categories.forEach((category) => {
      category.subCategories.forEach((subCategory: ReportSubCategory) => {
        const amount = reportType === "expense" ? subCategory.totalExpense : subCategory.totalIncome;
        const percentage = totalAmount > 0 ? (amount / totalAmount) * 100 : 0;
        const icon = iconMap.get(subCategory.subCategoryId);

        allSubCategories.push({
          ...subCategory,
          percentage: Math.round(percentage),
          color: CHART_COLORS[allSubCategories.length % CHART_COLORS.length],
          icon,
        });
      });
    });

    return allSubCategories.sort((a, b) => {
      const amountA = reportType === "expense" ? a.totalExpense : a.totalIncome;
      const amountB = reportType === "expense" ? b.totalExpense : b.totalIncome;
      return amountB - amountA;
    });
  }, [reportData, categories, categoryView, reportType, totalAmount, subCategoriesWithIcons]);

  // Prepare chart data
  const chartData = useMemo(() => {
    if (categoryView === "sub") {
      return subCategoriesWithPercentages.map((sub) => ({
        id: sub.subCategoryId,
        name: sub.subCategoryName,
        percentage: sub.percentage,
        color: sub.color,
        icon: sub.icon,
      }));
    } else {
      return categories.map((cat, index) => {
        const amount = reportType === "expense" ? cat.totalExpense : cat.totalIncome;
        const percentage = totalAmount > 0 ? (amount / totalAmount) * 100 : 0;
        return {
          id: cat.categoryId,
          name: cat.categoryName,
          percentage: Math.round(percentage),
          color: CHART_COLORS[index % CHART_COLORS.length],
        };
      });
    }
  }, [categoryView, subCategoriesWithPercentages, categories, reportType, totalAmount]);

  // Format period date range
  const formattedPeriodRange = useMemo(() => {
    if (!reportData) return "";

    try {
      const start = new Date(reportData.startDate);
      const end = new Date(reportData.endDate);
      const startDay = String(start.getDate()).padStart(2, "0");
      const startMonth = String(start.getMonth() + 1).padStart(2, "0");
      const endDay = String(end.getDate()).padStart(2, "0");
      const endMonth = String(end.getMonth() + 1).padStart(2, "0");

      return `${startDay}/${startMonth}-${endDay}/${endMonth}`;
    } catch {
      return "";
    }
  }, [reportData]);

  return {
    reportData,
    isLoading,
    error,
    reportType,
    setReportType,
    period,
    setPeriod,
    categoryView,
    setCategoryView,
    totalAmount,
    formattedTotalAmount,
    periodLabel,
    categories,
    todaySpent,
    todaySpentLoading,
    formattedPeriodRange,
    chartData,
    subCategoriesWithPercentages,
    refetch: fetchReport,
  };
};
