"use client";

import React, { useMemo } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useReport } from "app/hooks/useReport";
import { useAuthContext } from "app/context/AuthContext";
import { formatVietnameseCurrency, formatDateDDMMYYYY } from "app/utilities/common/functions";
import { DonutChart } from "app/components/DonutChart";

export default function ReportPage() {
  const router = useRouter();
  const { user } = useAuthContext();
  const {
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
  } = useReport();

  const userBalance = user?.balance ?? 0;
  const formattedBalance = formatVietnameseCurrency(userBalance);
  const formattedTodaySpent = formatVietnameseCurrency(todaySpent);

  return (
    <section
      aria-label="Trang báo cáo"
      className="relative flex min-h-screen flex-col overflow-visible"
      style={{
        backgroundImage:
          "linear-gradient(180.022deg, rgb(0, 70, 176) 16.185%, rgb(150, 211, 249) 81.491%, rgb(150, 211, 249) 81.491%)",
      }}
    >
      {/* Pattern Background */}
      <div className="absolute left-[-49px] top-0 h-[794.752px] w-full mix-blend-lighten">
        <Image src="/images/background.png" alt="" fill className="object-cover" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex w-full flex-col items-center gap-3 px-4 pt-2 pb-24 overflow-visible">
        {/* Summary Cards */}
        <div className="w-full pt-3 grid grid-cols-2 gap-3 text-white">
          <div className="rounded-2xl bg-gradient-to-r from-[#BAE8FD] to-[#46C7FF] px-3 py-2 text-xs shadow relative">
            <div
              className="absolute top-0 right-0 w-1/2 h-full rounded-2xl"
              style={{
                backgroundImage: "url('/images/balance_background.png')",
                backgroundSize: "contain",
                backgroundPosition: "right",
                backgroundRepeat: "no-repeat",
              }}
            />
            <p className="text-[14px] text-sm text-black font-medium">Tổng số dư</p>
            <p className="mt-1 text-base font-semibold text-black">{formatVietnameseCurrency(user?.balance ?? 0)}</p>
          </div>
          <div className="rounded-2xl bg-gradient-to-r from-[#BFEFE3] to-[#56D6E4] px-3 py-2 text-xs shadow relative">
            <div
              className="absolute top-0 right-0 w-1/2 h-full rounded-2xl"
              style={{
                backgroundImage: "url('/images/spent_background.png')",
                backgroundSize: "contain",
                backgroundPosition: "right",
                backgroundRepeat: "no-repeat",
              }}
            />
            <p className="text-[14px] text-sm text-black font-medium">Chi hôm nay</p>
            <p className="mt-1 text-base font-semibold text-black">
              {todaySpent > 0 ? `-${formattedTodaySpent}` : formattedTodaySpent}
            </p>
          </div>
        </div>
        {/* Report Card */}
        <div className="w-full max-w-full rounded-[20px] bg-white p-3 shadow-sm" style={{ overflow: "visible" }}>
          {/* Header */}
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path
                  opacity="0.2"
                  d="M7.50001 2.92969V8.55469L2.62501 11.3672C2.29958 9.61066 2.61182 7.79565 3.50552 6.24885C4.39923 4.70205 5.81571 3.52504 7.50001 2.92969Z"
                  fill="#1F2532"
                />
                <path
                  d="M7.81249 9.09609C7.90753 9.04123 7.98644 8.96231 8.04129 8.86727C8.09615 8.77223 8.12502 8.66442 8.12499 8.55469V2.92969C8.12443 2.83004 8.10006 2.73198 8.0539 2.64367C8.00774 2.55536 7.94113 2.47936 7.85964 2.42202C7.77814 2.36469 7.68412 2.32766 7.5854 2.31405C7.48669 2.30043 7.38616 2.31062 7.29218 2.34375C5.46794 2.98939 3.93383 4.26457 2.96563 5.94005C1.99743 7.61554 1.65863 9.58145 2.01015 11.4844C2.02837 11.5828 2.06995 11.6754 2.1314 11.7544C2.19285 11.8333 2.27237 11.8964 2.36327 11.9383C2.44519 11.9766 2.53456 11.9963 2.62499 11.9961C2.73469 11.9961 2.84247 11.9673 2.93749 11.9125L7.81249 9.09609ZM6.87499 3.87656V8.19375L3.13437 10.3523C3.12499 10.2344 3.12499 10.1156 3.12499 10C3.1261 8.73309 3.47678 7.49106 4.13843 6.41066C4.80007 5.33025 5.74701 4.45337 6.87499 3.87656ZM17.0578 5.97812C17.0508 5.96406 17.0437 5.94922 17.0351 5.93516C17.0266 5.92109 17.0195 5.90938 17.0109 5.89688C16.2946 4.67328 15.2706 3.65834 14.0408 2.95282C12.8109 2.24729 11.4179 1.87572 9.99999 1.875C9.83423 1.875 9.67526 1.94085 9.55805 2.05806C9.44084 2.17527 9.37499 2.33424 9.37499 2.5V9.67422L3.21796 13.2602C3.14651 13.3016 3.08398 13.3567 3.03398 13.4225C2.98398 13.4882 2.9475 13.5632 2.92665 13.6431C2.9058 13.723 2.901 13.8062 2.91251 13.888C2.92403 13.9698 2.95164 14.0485 2.99374 14.1195C3.89708 15.6578 5.28156 16.856 6.93353 17.5293C8.58549 18.2025 10.4131 18.3134 12.1344 17.8448C13.8556 17.3762 15.3748 16.3541 16.4575 14.9364C17.5401 13.5186 18.1261 11.7839 18.125 10C18.1268 8.58916 17.7588 7.20247 17.0578 5.97812ZM10.625 3.15313C11.6162 3.24437 12.5759 3.54965 13.4376 4.04791C14.2994 4.54617 15.0428 5.22552 15.6164 6.03906L10.625 8.94609V3.15313ZM9.99999 16.875C8.90891 16.8722 7.834 16.6111 6.86323 16.113C5.89247 15.6149 5.05345 14.894 4.41484 14.0094L10.3055 10.5789L10.3226 10.568L16.2422 7.12031C16.7253 8.16777 16.9372 9.31996 16.8582 10.4708C16.7792 11.6216 16.4119 12.734 15.7902 13.7057C15.1684 14.6773 14.3122 15.4768 13.3003 16.0307C12.2885 16.5845 11.1535 16.8749 9.99999 16.875Z"
                  fill="#1F2532"
                />
              </svg>
              <p className="text-sm font-semibold text-black">Báo cáo tổng quan</p>
            </div>

            {/* Type Tabs */}
            <div className="flex items-center gap-0 ">
              <button
                type="button"
                onClick={() => setReportType("expense")}
                className={`relative px-2 py-1 text-sm font-semibold ${
                  reportType === "expense" ? "text-[#0046B0]" : "text-[#597397]"
                }`}
                style={{
                  backgroundImage: reportType === "expense" ? "url('/images/bg_select.png')" : "",
                  backgroundSize: "cover",
                  backgroundPosition: "right",
                  backgroundRepeat: "no-repeat",
                }}
              >
                Chi tiêu
                {reportType === "expense" && <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-[#0046B0]" />}
              </button>
              <button
                type="button"
                onClick={() => setReportType("income")}
                className={`relative px-2 py-1 text-sm font-medium ${
                  reportType === "income" ? "text-[#0046B0]" : "text-[#597397]"
                }`}
                style={{
                  backgroundImage: reportType === "income" ? "url('/images/bg_select.png')" : "",
                  backgroundSize: "cover",
                  backgroundPosition: "right",
                  backgroundRepeat: "no-repeat",
                }}
              >
                Thu nhập
                {reportType === "income" && <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-[#0046B0]" />}
              </button>
            </div>
          </div>

          {/* Period Filters */}
          <div className="mb-3 flex flex-col gap-3">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setPeriod("week")}
                className={`rounded-3xl px-2 py-1 text-sm ${
                  period === "week"
                    ? "bg-[#E0F5FE] font-semibold text-[#1F2532]"
                    : "bg-[#EDEEF1] font-normal text-[#3B4D69]"
                }`}
              >
                Tuần này
              </button>
              <button
                type="button"
                onClick={() => setPeriod("month")}
                className={`rounded-3xl px-2 py-1 text-sm ${
                  period === "month"
                    ? "bg-[#E0F5FE] font-semibold text-[#1F2532]"
                    : "bg-[#EDEEF1] font-normal text-[#3B4D69]"
                }`}
              >
                Tháng này
              </button>
              {/* <button
                type="button"
                onClick={() => setPeriod("custom")}
                className={`flex items-center gap-1 rounded-3xl px-2 py-1 text-sm ${
                  period === "custom"
                    ? "bg-[#E0F5FE] font-semibold text-[#1F2532]"
                    : "bg-[#EDEEF1] font-normal text-[#3B4D69]"
                }`}
              >
                Tùy chỉnh
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                >
                  <path
                    d="M5 7.5L10 12.5L15 7.5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button> */}
            </div>

            {/* Period Summary */}
            <div className="relative overflow-hidden rounded-xl bg-white px-3 py-2">
              <div className="absolute inset-0 opacity-40 bg-gradient-to-r from-[#BBEFE7] to-[#F6FFDF] "></div>
              <p className="relative text-sm font-medium text-[#3B4D69]">
                {reportType === "expense" ? "Chi tiêu" : "Thu nhập"}{" "}
                {period === "week" ? "tuần này" : period === "month" ? "tháng này" : ""}{" "}
                {formattedPeriodRange && `(${formattedPeriodRange})`}
              </p>
              <div className="relative mt-1 flex flex-col gap-1">
                <p className="text-lg font-semibold text-[#1F2532]">{isLoading ? "..." : formattedTotalAmount}</p>
                {/* Comparison indicator - placeholder for now */}
                {reportType === "expense" ? (
                  <div className="flex items-center gap-1">
                    <div
                      className={`flex items-center rounded-3xl p-0.5
                    ${
                      reportData?.previousPeriod?.expenseChange && reportData?.previousPeriod?.expenseChange > 0
                        ? "bg-[#EF4444]"
                        : "bg-[#22C55E]"
                    }
                    `}
                    >
                      {reportData?.previousPeriod?.expenseChange && reportData?.previousPeriod?.expenseChange > 0 ? (
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
                          <path d="M6 2.5L9.5 6H6.5V9.5H5.5V6H2.5L6 2.5Z" fill="white" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
                          <path
                            d="M9.77295 7.14797L6.39795 10.523C6.34569 10.5754 6.28359 10.617 6.21522 10.6454C6.14685 10.6738 6.07354 10.6884 5.99951 10.6884C5.92548 10.6884 5.85217 10.6738 5.7838 10.6454C5.71543 10.617 5.65333 10.5754 5.60107 10.523L2.22607 7.14797C2.1204 7.0423 2.06104 6.89897 2.06104 6.74953C2.06104 6.60009 2.1204 6.45677 2.22607 6.35109C2.33175 6.24542 2.47507 6.18606 2.62451 6.18606C2.77395 6.18606 2.91728 6.24542 3.02295 6.35109L5.43748 8.76562V1.875C5.43748 1.72582 5.49674 1.58274 5.60223 1.47725C5.70772 1.37176 5.8508 1.3125 5.99998 1.3125C6.14916 1.3125 6.29224 1.37176 6.39773 1.47725C6.50322 1.58274 6.56248 1.72582 6.56248 1.875V8.76562L8.97701 6.35063C9.08268 6.24495 9.226 6.18559 9.37545 6.18559C9.52489 6.18559 9.66821 6.24495 9.77388 6.35063C9.87956 6.4563 9.93892 6.59962 9.93892 6.74906C9.93892 6.89851 9.87956 7.04183 9.77388 7.1475L9.77295 7.14797Z"
                            fill="white"
                          />
                        </svg>
                      )}
                    </div>
                    <p
                      className={`text-sm font-semibold ${
                        reportData?.previousPeriod?.expenseChange && reportData?.previousPeriod?.expenseChange < 0
                          ? "text-[#22C55E]"
                          : "text-[#EF4444]"
                      }`}
                    >
                      {formatVietnameseCurrency(reportData?.previousPeriod?.expenseChange ?? 0)} (
                      {reportData?.previousPeriod?.expenseChangePercent}%)
                    </p>
                    <p className="text-sm font-medium text-[#3B4D69]">
                      so vs {period === "week" ? "tuần" : "tháng"} trước
                    </p>
                  </div>
                ) : (
                  <div className="flex items-center gap-1">
                    <div
                      className={`flex items-center rounded-3xl p-0.5
                  ${
                    reportData?.previousPeriod?.incomeChange && reportData?.previousPeriod?.incomeChange > 0
                      ? "bg-[#EF4444]"
                      : "bg-[#22C55E]"
                  }
                  `}
                    >
                      {reportData?.previousPeriod?.incomeChange && reportData?.previousPeriod?.incomeChange > 0 ? (
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
                          <path d="M6 2.5L9.5 6H6.5V9.5H5.5V6H2.5L6 2.5Z" fill="white" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
                          <path
                            d="M9.77295 7.14797L6.39795 10.523C6.34569 10.5754 6.28359 10.617 6.21522 10.6454C6.14685 10.6738 6.07354 10.6884 5.99951 10.6884C5.92548 10.6884 5.85217 10.6738 5.7838 10.6454C5.71543 10.617 5.65333 10.5754 5.60107 10.523L2.22607 7.14797C2.1204 7.0423 2.06104 6.89897 2.06104 6.74953C2.06104 6.60009 2.1204 6.45677 2.22607 6.35109C2.33175 6.24542 2.47507 6.18606 2.62451 6.18606C2.77395 6.18606 2.91728 6.24542 3.02295 6.35109L5.43748 8.76562V1.875C5.43748 1.72582 5.49674 1.58274 5.60223 1.47725C5.70772 1.37176 5.8508 1.3125 5.99998 1.3125C6.14916 1.3125 6.29224 1.37176 6.39773 1.47725C6.50322 1.58274 6.56248 1.72582 6.56248 1.875V8.76562L8.97701 6.35063C9.08268 6.24495 9.226 6.18559 9.37545 6.18559C9.52489 6.18559 9.66821 6.24495 9.77388 6.35063C9.87956 6.4563 9.93892 6.59962 9.93892 6.74906C9.93892 6.89851 9.87956 7.04183 9.77388 7.1475L9.77295 7.14797Z"
                            fill="white"
                          />
                        </svg>
                      )}
                    </div>
                    <p
                      className={`text-sm font-semibold ${
                        reportData?.previousPeriod?.incomeChange && reportData?.previousPeriod?.incomeChange > 0
                          ? "text-[#EF4444]"
                          : "text-[#22C55E]"
                      }`}
                    >
                      {formatVietnameseCurrency(reportData?.previousPeriod?.incomeChange ?? 0)} (
                      {reportData?.previousPeriod?.incomeChangePercent}%)
                    </p>
                    <p className="text-sm font-medium text-[#3B4D69]">
                      so với {period === "week" ? "tuần" : "tháng"} trước
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Category View Tabs */}
          <div className="mb-3 flex items-center justify-center">
            <div>
              <button
                type="button"
                onClick={() => setCategoryView("sub")}
                className={`border-b-2 px-3 py-1 text-sm ${
                  categoryView === "sub"
                    ? "border-[#0046B0] font-semibold text-[#0046B0]"
                    : "border-transparent font-medium text-[#597397]"
                }`}
              >
                Danh mục con
              </button>
              {categoryView === "sub" && <div className="w-full h-[2px] bg-[#0046B0]"></div>}
            </div>
            <div>
              <button
                type="button"
                onClick={() => setCategoryView("parent")}
                className={`border-b-2 px-3 py-1 text-sm ${
                  categoryView === "parent"
                    ? "border-[#0046B0] font-semibold text-[#0046B0]"
                    : "border-transparent font-medium text-[#597397]"
                }`}
              >
                Danh mục cha
              </button>
              {categoryView === "parent" && <div className="w-full h-[2px] bg-[#0046B0]"></div>}
            </div>
          </div>

          {/* Chart */}
          <div className="mb-3 relative w-full">
            {/* Background with rounded corners - positioned to not clip content */}
            <div className="absolute inset-0 bg-white" style={{ borderRadius: "12px" }} />
            {/* Content area with extra padding for labels */}
            <div
              className="relative flex items-center justify-center"
              style={{
                width: "100%",
                padding: "12px 20px",
              }}
            >
              {isLoading || todaySpentLoading ? (
                <p className="text-sm text-slate-500">Đang tải...</p>
              ) : error ? (
                <p className="text-sm text-red-500">{error}</p>
              ) : chartData.length === 0 ? (
                <div className="flex flex-col items-center gap-3">
                  <p className="text-sm font-semibold text-[#1F2532]">Chưa có dữ liệu</p>
                  <p className="text-xs text-[#597397]">Bắt đầu ghi chép để xem báo cáo</p>
                  <button
                    type="button"
                    className="flex items-center gap-1 rounded-3xl bg-[#0046B0] px-2 py-1 text-sm font-semibold text-white"
                    onClick={() => (window.location.href = "/home")}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M10 4V16M4 10H16" stroke="white" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                    Thêm chi tiêu
                  </button>
                </div>
              ) : (
                <div
                  className="flex items-center justify-center"
                  style={{
                    width: "100%",
                    height: "100%",
                    overflow: "visible",
                    position: "relative",
                  }}
                >
                  <DonutChart
                    data={chartData
                      .map((item) => {
                        // Find the actual amount from subCategoriesWithPercentages or categories
                        let actualValue = 0;
                        let icon: string | undefined = undefined;

                        if (categoryView === "sub") {
                          const subCat = subCategoriesWithPercentages.find((sub) => sub.subCategoryId === item.id);
                          actualValue =
                            reportType === "expense" ? (subCat?.totalExpense ?? 0) : (subCat?.totalIncome ?? 0);
                          icon = subCat?.icon;
                        } else {
                          const cat = categories.find((cat) => cat.categoryId === item.id);
                          actualValue = reportType === "expense" ? (cat?.totalExpense ?? 0) : (cat?.totalIncome ?? 0);
                        }
                        return {
                          label: item.name,
                          value: actualValue,
                          color: item.color,
                          id: item.id,
                          icon,
                        };
                      })
                      .filter((item) => item.value > 0)} // Only include items with value > 0
                    width={166}
                    height={277}
                    innerRadiusRatio={0.6}
                    labelDistance={35}
                    minLabelPercentage={0}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Category List */}
          <div className="flex flex-col gap-0.5 rounded-2xl bg-[#F8FAFC] p-3">
            {isLoading ? (
              <div className="py-4 text-center text-sm text-slate-500">Đang tải...</div>
            ) : error ? (
              <div className="py-4 text-center text-sm text-red-500">{error}</div>
            ) : categoryView === "sub" && subCategoriesWithPercentages.length > 0 ? (
              subCategoriesWithPercentages.map((subCategory, index) => {
                const amount = reportType === "expense" ? subCategory.totalExpense : subCategory.totalIncome;
                const formattedAmount = formatVietnameseCurrency(amount);

                // Handle click to navigate to transaction detail page
                const handleSubCategoryClick = () => {
                  const params = new URLSearchParams();
                  params.set("subCategoryId", subCategory.subCategoryId);

                  // Add time range based on current period
                  if (reportData) {
                    if (period === "month") {
                      // Format month as MM/YYYY
                      const startDate = new Date(reportData.startDate);
                      const month = String(startDate.getMonth() + 1).padStart(2, "0");
                      const year = startDate.getFullYear();
                      params.set("month", `${month}/${year}`);
                    } else if (period === "week") {
                      // Format week as DD/MM/YYYY-DD/MM/YYYY
                      const startDate = new Date(reportData.startDate);
                      const endDate = new Date(reportData.endDate);
                      const weekRange = `${formatDateDDMMYYYY(startDate)}-${formatDateDDMMYYYY(endDate)}`;
                    }
                  }

                  router.push(`/transactions/category?${params.toString()}`);
                };

                return (
                  <React.Fragment key={subCategory.subCategoryId}>
                    <div
                      className="flex items-center gap-2 px-0 py-2 cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={handleSubCategoryClick}
                    >
                      <div
                        className="flex h-5 w-11 items-center justify-center rounded-2xl px-2 text-xs font-semibold text-[#1F2532]"
                        style={{ backgroundColor: subCategory.color }}
                      >
                        {subCategory.percentage}%
                      </div>
                      <div className="flex h-4 w-4 items-center justify-center text-base">
                        {subCategory.icon || "📂"}
                      </div>
                      <p className="flex-1 text-sm font-medium text-[#3B4D69]">{subCategory.subCategoryName}</p>
                      <p className="text-sm font-semibold text-[#1F2532]">{formattedAmount}</p>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path
                          d="M6 4L10 8L6 12"
                          stroke="#3B4D69"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    {index < subCategoriesWithPercentages.length - 1 && <div className="h-px bg-[#EDEEF1]" />}
                  </React.Fragment>
                );
              })
            ) : categoryView === "parent" && categories.length > 0 ? (
              categories.map((category, index) => {
                const amount = reportType === "expense" ? category.totalExpense : category.totalIncome;
                const percentage = totalAmount > 0 ? (amount / totalAmount) * 100 : 0;
                const formattedAmount = formatVietnameseCurrency(amount);
                const color = chartData[index]?.color;

                return (
                  <React.Fragment key={category.categoryId}>
                    <div className="flex items-center gap-2 px-0 py-2">
                      <div
                        className="flex h-5 w-11 items-center justify-center rounded-2xl px-2 text-xs font-semibold text-[#1F2532]"
                        style={{ backgroundColor: color }}
                      >
                        {Math.round(percentage)}%
                      </div>
                      <p className="flex-1 text-sm font-medium text-[#3B4D69]">{category.categoryName}</p>
                      <p className="text-sm font-semibold text-[#1F2532]">{formattedAmount}</p>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path
                          d="M6 4L10 8L6 12"
                          stroke="#3B4D69"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    {index < categories.length - 1 && <div className="h-px bg-[#EDEEF1]" />}
                  </React.Fragment>
                );
              })
            ) : (
              <div className="py-4 text-center text-sm text-slate-500">Chưa có dữ liệu</div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
