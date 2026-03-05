"use client";

import React, { Suspense } from "react";
import { useRouter } from "next/navigation";
import { formatVietnameseCurrency, formatTimeHHMM, formatDateDDMMYYYY } from "app/utilities/common/functions";
import Image from "next/image";
import { MomoBarChart } from "app/components/MomoBarChart";
import { imagePath } from "app/utilities/constants/common/assets";
import { useTransactionCategoryPage } from "app/hooks/useTransactionCategoryPage";

function TransactionCategoryPageInner() {
  const router = useRouter();

  const {
    searchParams,
    categoryId,
    subCategoryId,
    userBalance,
    suggestedDailyValue,
    transactions,
    summary,
    isLoading,
    error,
    subCategory,
    category,
    viewMode,
    setViewMode,
    isViewModeOpen,
    setIsViewModeOpen,
    selectedBarIndex,
    budget,
    isLoadingBudget,
    chartData,
    handleChartBarClick,
    dailyMetrics,
    groupedTransactions,
    timeRangeSubtitle,
    subCategoryName,
    subCategoryIcon,
    maxChartValue,
    chartHeight,
    maxSpendingDay,
    // expose totals for summary card
    // (computed inside hook but used only for display here)
  } = useTransactionCategoryPage();

  return (
    <div className="relative flex min-h-screen max-h-screen flex-col bg-white rounded-[32px] overflow-y-auto">
      {/* Header */}
      <div className="relative bg-[#0046B0] h-[60px] rounded-bl-[20px] rounded-br-[20px]">
        <div className="absolute left-[-49px] top-0 h-[794.752px] w-full mix-blend-lighten">
          <Image src={imagePath("/images/background.png")} alt="" fill className="object-cover" />
        </div>

        <div className="relative z-10 w-full flex items-center justify-between gap-3 px-4 pt-4 overflow-visible">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex h-9 w-9 items-center justify-center rounded-full p-1"
              aria-label="Quay lại"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M15.796 18.7041C16.0073 18.9154 16.1261 19.2021 16.1261 19.501C16.1261 19.7999 16.0073 20.0865 15.796 20.2978C15.5846 20.5092 15.298 20.6279 14.9991 20.6279C14.7002 20.6279 14.4136 20.5092 14.2022 20.2978L6.70222 12.7978C6.59734 12.6933 6.51413 12.5691 6.45735 12.4324C6.40057 12.2956 6.37134 12.149 6.37134 12.001C6.37134 11.8529 6.40057 11.7063 6.45735 11.5696C6.51413 11.4328 6.59734 11.3086 6.70222 11.2041L14.2022 3.7041C14.4136 3.49276 14.7002 3.37402 14.9991 3.37402C15.298 3.37402 15.5846 3.49276 15.796 3.7041C16.0073 3.91544 16.1261 4.20209 16.1261 4.50097C16.1261 4.79986 16.0073 5.08651 15.796 5.29785L9.09379 12L15.796 18.7041Z"
                  fill="white"
                />
              </svg>
            </button>

            <div className="flex-1 text-center">
              <h1 className="text-lg font-semibold leading-[1.5] text-white">{subCategoryName}</h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {subCategoryId && (
              <>
                <button
                  type="button"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 p-1"
                  aria-label="Xóa"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M3 6H5H21M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
                <button
                  type="button"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 p-1"
                  aria-label="Chỉnh sửa"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M18.5 2.5C18.8978 2.10217 19.4374 1.87868 20 1.87868C20.5626 1.87868 21.1022 2.10217 21.5 2.5C21.8978 2.89782 22.1213 3.43739 22.1213 4C22.1213 4.56261 21.8978 5.10217 21.5 5.5L12 15L8 16L9 12L18.5 2.5Z"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 px-4 pt-4 pb-24 space-y-4">
        {/* Budget Summary Card */}
        {!isLoading && (
          <div className="bg-white rounded-2xl p-2 flex gap-2 items-start">
            <div className="bg-[#EBEEF3] rounded-full p-2 flex-shrink-0">
              <span className="text-xl">{subCategoryIcon}</span>
            </div>
            <div className="flex-1 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-[#1F2532]">{subCategoryName}</h2>
                {/* Total amount is sum of all transactions in current selection */}
                <p className="text-sm font-semibold text-[#1F2532]">
                  {formatVietnameseCurrency(transactions.reduce((sum, tx) => sum + tx.amount, 0)).replace("₫", "đ")}
                </p>
              </div>
              {/* Progress Bar - simplified, showing spent vs total */}
              <div className="bg-[#D8DBDF] h-2 rounded-full overflow-hidden">
                <div
                  className="bg-[#22C55E] h-full rounded-full transition-all"
                  style={{
                    width: `${
                      transactions.length > 0
                        ? (transactions.filter((tx) => tx.type === "out").reduce((sum, tx) => sum + tx.amount, 0) /
                            transactions.reduce((sum, tx) => sum + tx.amount, 0)) *
                          100
                        : 0
                    }%`,
                  }}
                />
              </div>
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1 text-[#3B4D69]">
                  <span className="font-normal">Đã chi:</span>
                  <span className="font-semibold">
                    {formatVietnameseCurrency(
                      transactions.filter((tx) => tx.type === "out").reduce((sum, tx) => sum + tx.amount, 0),
                    ).replace("₫", "đ")}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="font-normal text-[#3B4D69]">Còn lại:</span>
                  <span className="font-semibold text-[#22C55E]">
                    {formatVietnameseCurrency(
                      Math.max(
                        0,
                        transactions.reduce((sum, tx) => sum + tx.amount, 0) -
                          transactions.filter((tx) => tx.type === "out").reduce((sum, tx) => sum + tx.amount, 0),
                      ),
                    ).replace("₫", "đ")}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* View Mode Selector */}
        {!isLoading && (
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsViewModeOpen(!isViewModeOpen)}
              className="flex items-center gap-2 bg-[#EDEEF1] px-3 py-2 rounded-full text-sm text-black w-full justify-between"
            >
              <span>{viewMode === "week" ? "Theo tuần" : "Theo tháng"}</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                className={`transition-transform ${isViewModeOpen ? "rotate-180" : ""}`}
              >
                <path
                  d="M6 9L12 15L18 9"
                  stroke="#474B55"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            {/* Dropdown Menu */}
            {isViewModeOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsViewModeOpen(false)} />
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-lg z-50 overflow-hidden">
                  <button
                    type="button"
                    onClick={() => {
                      setViewMode("week");
                      setIsViewModeOpen(false);
                    }}
                    className={`w-full px-4 py-3 text-left text-sm ${
                      viewMode === "week" ? "bg-[#EDEEF1] font-semibold text-[#0046B0]" : "text-[#1F2532]"
                    }`}
                  >
                    Theo tuần
                  </button>
                  <div className="h-px bg-[#EDEEF1]" />
                  <button
                    type="button"
                    onClick={() => {
                      setViewMode("month");
                      setIsViewModeOpen(false);
                    }}
                    className={`w-full px-4 py-3 text-left text-sm ${
                      viewMode === "month" ? "bg-[#EDEEF1] font-semibold text-[#0046B0]" : "text-[#1F2532]"
                    }`}
                  >
                    Theo tháng
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {/* Spending Chart */}
        {!isLoading && chartData.length > 0 && (
          <MomoBarChart
            data={chartData}
            height={192}
            onBarClick={handleChartBarClick}
            suggestedValue={suggestedDailyValue}
            activeIndex={selectedBarIndex}
            param={searchParams}
          />
        )}

        {/* Daily Spending Breakdown Card */}
        {!isLoading && subCategoryId && (
          <div className="bg-[#F0FAFF] rounded-2xl p-3 space-y-2 relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none shadow-[inset_1px_1px_40px_0px_rgba(159,226,255,0.5)]" />
            <div className="relative z-10 space-y-2">
              <div className="flex items-center gap-2 py-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path opacity="0.2" d="M16.25 6.875H11.875V2.5L16.25 6.875Z" fill="#474B55" />
                  <path
                    d="M16.6922 6.43281L12.3172 2.05781C12.2591 1.99979 12.1902 1.95378 12.1143 1.92241C12.0384 1.89105 11.9571 1.87494 11.875 1.875H4.375C4.04348 1.875 3.72554 2.0067 3.49112 2.24112C3.2567 2.47554 3.125 2.79348 3.125 3.125V16.875C3.125 17.2065 3.2567 17.5245 3.49112 17.7589C3.72554 17.9933 4.04348 18.125 4.375 18.125H15.625C15.9565 18.125 16.2745 17.9933 16.5089 17.7589C16.7433 17.5245 16.875 17.2065 16.875 16.875V6.875C16.8751 6.7929 16.859 6.71159 16.8276 6.63572C16.7962 6.55985 16.7502 6.4909 16.6922 6.43281ZM12.5 4.00859L14.7414 6.25H12.5V4.00859ZM15.625 16.875H4.375V3.125H11.25V6.875C11.25 7.04076 11.3158 7.19973 11.4331 7.31694C11.5503 7.43415 11.7092 7.5 11.875 7.5H15.625V16.875ZM13.125 10.625C13.125 10.7908 13.0592 10.9497 12.9419 11.0669C12.8247 11.1842 12.6658 11.25 12.5 11.25H7.5C7.33424 11.25 7.17527 11.1842 7.05806 11.0669C6.94085 10.9497 6.875 10.7908 6.875 10.625C6.875 10.4592 6.94085 10.3003 7.05806 10.1831C7.17527 10.0658 7.33424 10 7.5 10H12.5C12.6658 10 12.8247 10.0658 12.9419 10.1831C13.0592 10.3003 13.125 10.4592 13.125 10.625ZM13.125 13.125C13.125 13.2908 13.0592 13.4497 12.9419 13.5669C12.8247 13.6842 12.6658 13.75 12.5 13.75H7.5C7.33424 13.75 7.17527 13.6842 7.05806 13.5669C6.94085 13.4497 6.875 13.2908 6.875 13.125C6.875 12.9592 6.94085 12.8003 7.05806 12.6831C7.17527 12.5658 7.33424 12.5 7.5 12.5H12.5C12.6658 12.5 12.8247 12.5658 12.9419 12.6831C13.0592 12.8003 13.125 12.9592 13.125 13.125Z"
                    fill="#474B55"
                  />
                </svg>
                <p className="flex-1 text-sm font-medium text-[#3B4D69]">Kế hoạch chi mỗi ngày:</p>
                <p className="text-sm font-semibold text-black">
                  {formatVietnameseCurrency(dailyMetrics.plannedDaily).replace("₫", "đ")}
                </p>
              </div>
              <div className="flex items-center gap-2 py-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path
                    opacity="0.2"
                    d="M16.875 10C16.875 11.3597 16.4718 12.689 15.7164 13.8195C14.9609 14.9501 13.8872 15.8313 12.631 16.3517C11.3747 16.872 9.99238 17.0082 8.65876 16.7429C7.32514 16.4776 6.10013 15.8228 5.13864 14.8614C4.17716 13.8999 3.52238 12.6749 3.2571 11.3412C2.99183 10.0076 3.12798 8.62529 3.64833 7.36905C4.16868 6.11281 5.04987 5.03908 6.18046 4.28365C7.31105 3.52821 8.64026 3.125 10 3.125C11.8234 3.125 13.5721 3.84933 14.8614 5.13864C16.1507 6.42795 16.875 8.17664 16.875 10Z"
                    fill="#474B55"
                  />
                  <path
                    d="M10.625 6.25012V9.64621L13.4469 11.3392C13.589 11.4245 13.6914 11.5629 13.7315 11.7238C13.7717 11.8846 13.7463 12.0549 13.6609 12.197C13.5756 12.3391 13.4372 12.4415 13.2763 12.4817C13.1155 12.5218 12.9452 12.4964 12.8031 12.4111L9.6781 10.5361C9.58561 10.4805 9.50909 10.4019 9.45597 10.308C9.40285 10.2141 9.37495 10.108 9.37498 10.0001V6.25012C9.37498 6.08436 9.44083 5.92539 9.55804 5.80818C9.67525 5.69097 9.83422 5.62512 9.99998 5.62512C10.1657 5.62512 10.3247 5.69097 10.4419 5.80818C10.5591 5.92539 10.625 6.08436 10.625 6.25012ZM17.5 4.37512C17.3342 4.37512 17.1752 4.44097 17.058 4.55818C16.9408 4.67539 16.875 4.83436 16.875 5.00012V6.40637C16.3789 5.83137 15.8726 5.27746 15.3031 4.7009C14.2608 3.65848 12.9344 2.94634 11.4897 2.65344C10.045 2.36055 8.54595 2.4999 7.17997 3.05408C5.81398 3.60826 4.6416 4.55269 3.8093 5.76937C2.97701 6.98605 2.52171 8.42102 2.5003 9.89499C2.47889 11.369 2.89232 12.8165 3.68893 14.0569C4.48554 15.2972 5.63 16.2753 6.97932 16.8689C8.32863 17.4625 9.82296 17.6454 11.2756 17.3946C12.7282 17.1437 14.0747 16.4704 15.1469 15.4587C15.2066 15.4023 15.2546 15.3346 15.2881 15.2597C15.3217 15.1847 15.3402 15.1038 15.3425 15.0217C15.3448 14.9396 15.331 14.8578 15.3017 14.781C15.2724 14.7043 15.2283 14.634 15.1719 14.5743C15.1154 14.5146 15.0478 14.4666 14.9728 14.433C14.8978 14.3995 14.817 14.381 14.7348 14.3787C14.6527 14.3764 14.5709 14.3902 14.4942 14.4195C14.4174 14.4488 14.3472 14.4929 14.2875 14.5493C13.3938 15.3916 12.2717 15.9519 11.0615 16.1603C9.85124 16.3686 8.60642 16.2159 7.48249 15.721C6.35855 15.2261 5.40531 14.4111 4.74179 13.3778C4.07827 12.3444 3.73388 11.1385 3.75163 9.91055C3.76938 8.68262 4.14848 7.48714 4.8416 6.47338C5.53471 5.45962 6.51112 4.67252 7.64889 4.21036C8.78666 3.7482 10.0354 3.63147 11.2391 3.87475C12.4428 4.11802 13.5482 4.71051 14.4172 5.57824C15.0531 6.22199 15.6101 6.84231 16.1719 7.50012H14.375C14.2092 7.50012 14.0502 7.56597 13.933 7.68318C13.8158 7.80039 13.75 7.95936 13.75 8.12512C13.75 8.29088 13.8158 8.44985 13.933 8.56706C14.0502 8.68427 14.2092 8.75012 14.375 8.75012H17.5C17.6657 8.75012 17.8247 8.68427 17.9419 8.56706C18.0591 8.44985 18.125 8.29088 18.125 8.12512V5.00012C18.125 4.83436 18.0591 4.67539 17.9419 4.55818C17.8247 4.44097 17.6657 4.37512 17.5 4.37512Z"
                    fill="#474B55"
                  />
                </svg>
                <p className="flex-1 text-sm font-medium text-[#3B4D69]">Thực tế chi mỗi ngày:</p>
                <p className="text-sm font-semibold text-black">
                  {formatVietnameseCurrency(dailyMetrics.actualDaily).replace("₫", "đ")}
                </p>
              </div>
              <div className="h-px bg-[#DCDCDC]" />
              <div className="flex items-center gap-2 py-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <g clip-path="url(#clip0_1012_26223)">
                    <path
                      d="M10 2.88083C9.655 2.88083 9.375 2.60083 9.375 2.25583V0.625C9.375 0.28 9.655 0 10 0C10.345 0 10.625 0.28 10.625 0.625V2.25583C10.625 2.60083 10.345 2.88083 10 2.88083Z"
                      fill="#FFC107"
                    />
                    <path
                      d="M15.4758 5.14908C15.3158 5.14908 15.1558 5.08824 15.0341 4.96574C14.79 4.72158 14.79 4.32574 15.0341 4.08158L16.1875 2.92824C16.4316 2.68408 16.8275 2.68408 17.0716 2.92824C17.3158 3.17241 17.3158 3.56824 17.0716 3.81241L15.9183 4.96574C15.7958 5.08741 15.6358 5.14908 15.4758 5.14908Z"
                      fill="#FFC107"
                    />
                    <path
                      d="M19.375 10.625H17.7442C17.3992 10.625 17.1192 10.345 17.1192 10C17.1192 9.655 17.3992 9.375 17.7442 9.375H19.375C19.72 9.375 20 9.655 20 10C20 10.345 19.72 10.625 19.375 10.625Z"
                      fill="#FFC107"
                    />
                    <path
                      d="M16.6291 17.2545C16.4691 17.2545 16.3091 17.1937 16.1875 17.0712L15.0341 15.9179C14.79 15.6737 14.79 15.2779 15.0341 15.0337C15.2783 14.7895 15.6741 14.7895 15.9183 15.0337L17.0716 16.187C17.3158 16.4312 17.3158 16.827 17.0716 17.0712C16.9491 17.1937 16.7891 17.2545 16.6291 17.2545Z"
                      fill="#FFC107"
                    />
                    <path
                      d="M3.37082 17.2545C3.21082 17.2545 3.05082 17.1937 2.92916 17.0712C2.68499 16.827 2.68499 16.4312 2.92916 16.187L4.08249 15.0337C4.32666 14.7895 4.72249 14.7895 4.96666 15.0337C5.21082 15.2779 5.21082 15.6737 4.96666 15.9179L3.81332 17.0712C3.69082 17.1937 3.53082 17.2545 3.37082 17.2545Z"
                      fill="#FFC107"
                    />
                    <path
                      d="M2.25583 10.625H0.625C0.28 10.625 0 10.345 0 10C0 9.655 0.28 9.375 0.625 9.375H2.25583C2.60083 9.375 2.88083 9.655 2.88083 10C2.88083 10.345 2.60083 10.625 2.25583 10.625Z"
                      fill="#FFC107"
                    />
                    <path
                      d="M4.52416 5.14908C4.36416 5.14908 4.20416 5.08824 4.08249 4.96574L2.92916 3.81241C2.68499 3.56824 2.68499 3.17241 2.92916 2.92824C3.17332 2.68408 3.56916 2.68408 3.81332 2.92824L4.96666 4.08158C5.21082 4.32574 5.21082 4.72158 4.96666 4.96574C4.84332 5.08741 4.68416 5.14908 4.52416 5.14908Z"
                      fill="#FFC107"
                    />
                    <path
                      d="M15.8333 10.0002C15.8333 11.8002 15.0167 13.4668 13.6083 14.5835C13.0333 15.0335 12.6583 15.6252 12.5417 16.2585C12.525 16.2502 12.5167 16.2502 12.5 16.2502H7.49999C7.48333 16.2502 7.45833 16.2502 7.44166 16.2585C7.32499 15.6002 6.98333 15.0252 6.49166 14.6585C4.67499 13.2835 3.82499 11.0335 4.29166 8.76683C4.74999 6.55849 6.54166 4.75849 8.74999 4.30016C10.5083 3.92516 12.3083 4.35849 13.675 5.46683C15.05 6.58349 15.8333 8.23349 15.8333 10.0002Z"
                      fill="#FFC107"
                    />
                    <path
                      d="M12.5417 16.2583C12.5167 16.4 12.5 16.5417 12.5 16.6917V18.5417C12.5 19.3417 11.8417 20 11.0417 20H8.95832C8.25832 20 7.49998 19.4667 7.49998 18.3V16.825C7.49998 16.6333 7.48332 16.4417 7.44165 16.2583C7.45832 16.25 7.48332 16.25 7.49998 16.25H12.5C12.5167 16.25 12.525 16.25 12.5417 16.2583Z"
                      fill="#607D8B"
                    />
                    <path
                      d="M13.125 10.4167C12.78 10.4167 12.5 10.1367 12.5 9.79167C12.5 8.5275 11.4725 7.5 10.2083 7.5C9.86331 7.5 9.58331 7.22 9.58331 6.875C9.58331 6.53 9.86331 6.25 10.2083 6.25C12.1608 6.25 13.75 7.83917 13.75 9.79167C13.75 10.1367 13.47 10.4167 13.125 10.4167Z"
                      fill="#FFD54F"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_1012_26223">
                      <rect width="20" height="20" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
                <p className="flex-1 text-sm font-medium text-[#3B4D69]">Đề xuất chi mỗi ngày:</p>
                <p className="bg-clip-text bg-gradient-to-b from-[#0180DC] to-[#4AC6FF] text-sm font-semibold text-transparent">
                  {formatVietnameseCurrency(dailyMetrics.suggestedDaily).replace("₫", "đ")}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Loading State - Skeleton */}
        {isLoading && (
          <div className="space-y-4">
            {/* Summary skeleton */}
            <div className="bg-white rounded-2xl p-4 animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-1/2" />
            </div>
            {/* Chart skeleton */}
            <div className="bg-white rounded-2xl p-4 animate-pulse">
              <div className="h-[192px] bg-gray-200 rounded" />
            </div>
            {/* Suggestion skeleton */}
            <div className="bg-[#F0FAFF] rounded-2xl p-4 animate-pulse">
              <div className="h-20 bg-gray-200 rounded" />
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && transactions.length === 0 && subCategoryId && (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="64"
                height="64"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#9CA3AF"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" />
                <path d="M14 2V8H20" />
                <path d="M16 13H8" />
                <path d="M16 17H8" />
                <path d="M10 9H8" />
              </svg>
            </div>
            <p className="text-base font-medium text-[#3B4D69]">Chưa có giao dịch</p>
          </div>
        )}

        {/* Transaction List */}
        {!isLoading && !error && subCategoryId && transactions.length > 0 && (
          <div className="space-y-1">
            {/* Section Header */}
            <div className="flex items-center justify-between px-3 py-2">
              <p className="text-base font-semibold text-black">Danh sách chi tiêu</p>
            </div>

            {groupedTransactions.map((group) => (
              <div key={group.date} className="bg-white rounded-2xl overflow-hidden">
                {/* Date Header */}
                <div className="bg-white px-4 py-3 border-b border-[#EDEEF1]">
                  <p className="text-sm font-semibold text-[#597397]">{group.date}</p>
                </div>

                {/* Transactions */}
                <div className="divide-y divide-[#F8FAFC]">
                  {group.transactions.map((tx, index) => (
                    <div
                      key={tx.id}
                      className={`flex items-center gap-2 px-4 py-2 h-[60px] ${
                        index % 2 === 1 ? "bg-[#F8FAFC]" : "bg-white"
                      }`}
                    >
                      {/* Icon */}
                      <div className="bg-[#EDEEF1] rounded-full p-2 flex-shrink-0 w-10 h-10 flex items-center justify-center">
                        {subCategoryIcon ? (
                          <span className="text-base">{subCategoryIcon}</span>
                        ) : (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#597397"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" />
                            <path d="M14 2V8H20" />
                          </svg>
                        )}
                      </div>

                      {/* Transaction Info */}
                      <div className="flex-1 flex flex-col gap-0.5 min-w-0">
                        <p className="text-sm font-semibold text-[#1F2532] truncate">{tx.subCategoryName}</p>
                        <p className="text-sm font-medium text-[#597397]">{tx.note}</p>
                      </div>

                      {/* Amount */}
                      <div className="flex flex-col items-end gap-1 flex-shrink-0">
                        <p
                          className={`text-sm font-semibold ${tx.type === "out" ? "text-[#3B4D69]" : "text-[#22C55E]"}`}
                        >
                          {tx.type === "out" ? "-" : "+"}
                          {formatVietnameseCurrency(tx.amount).replace("₫", "đ")}
                        </p>
                        <p className="text-xs font-medium text-[#597397]">
                          {formatTimeHHMM(tx.createdAt)}, {formatDateDDMMYYYY(tx.createdAt)}
                        </p>
                      </div>

                      {/* Edit Button */}
                      <button
                        type="button"
                        className="flex items-center justify-center p-1 rounded-3xl flex-shrink-0"
                        aria-label="Chỉnh sửa"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <path
                            d="M14.2075 4.58547L11.4144 1.79297C11.3215 1.70009 11.2113 1.62641 11.0899 1.57614C10.9686 1.52587 10.8385 1.5 10.7072 1.5C10.5759 1.5 10.4458 1.52587 10.3245 1.57614C10.2031 1.62641 10.0929 1.70009 10 1.79297L2.29313 9.49985C2.19987 9.59237 2.12593 9.70251 2.0756 9.82386C2.02528 9.94521 1.99959 10.0754 2.00001 10.2067V12.9998C2.00001 13.2651 2.10536 13.5194 2.2929 13.707C2.48043 13.8945 2.73479 13.9998 3.00001 13.9998H13.5C13.6326 13.9998 13.7598 13.9472 13.8536 13.8534C13.9473 13.7596 14 13.6325 14 13.4998C14 13.3672 13.9473 13.2401 13.8536 13.1463C13.7598 13.0525 13.6326 12.9998 13.5 12.9998H7.20751L14.2075 5.99985C14.3004 5.90699 14.3741 5.79674 14.4243 5.6754C14.4746 5.55406 14.5005 5.424 14.5005 5.29266C14.5005 5.16132 14.4746 5.03127 14.4243 4.90992C14.3741 4.78858 14.3004 4.67834 14.2075 4.58547ZM5.79313 12.9998H3.00001V10.2067L8.50001 4.70672L11.2931 7.49985L5.79313 12.9998ZM12 6.79297L9.20751 3.99985L10.7075 2.49985L13.5 5.29297L12 6.79297Z"
                            fill="#1F2532"
                          />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Summary sub category */}
        {!isLoading && !error && categoryId && summary.length > 0 && (
          <div className="space-y-1">
            <div>
              <p className="text-base font-semibold text-[#1F2532]">Danh mục đã chi</p>
            </div>
            {summary.map((item) => (
              <div key={item.subCategoryId}>
                <div className="flex items-center justify-between border-b border-[#EDEEF1] py-2 ">
                  <div className="flex gap-1 justify-center items-center h-4">
                    <p className="w-6 h-6">{item.icon}</p>
                    <p className="text-sm font-normal text-[#3B4D69] text-center">{item.name}</p>
                  </div>
                  <p className="text-sm font-semibold text-[#3B4D69] flex items-center gap-1">
                    - {formatVietnameseCurrency(item.totalExpense).replace("₫", "đ")}
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path
                        d="M11.354 8.35354L6.35403 13.3535C6.30757 13.4 6.25242 13.4368 6.19173 13.462C6.13103 13.4871 6.06598 13.5001 6.00028 13.5001C5.93458 13.5001 5.86953 13.4871 5.80883 13.462C5.74813 13.4368 5.69298 13.4 5.64653 13.3535C5.60007 13.3071 5.56322 13.2519 5.53808 13.1912C5.51294 13.1305 5.5 13.0655 5.5 12.9998C5.5 12.9341 5.51294 12.869 5.53808 12.8083C5.56322 12.7476 5.60007 12.6925 5.64653 12.646L10.2934 7.99979L5.64653 3.35354C5.55271 3.25972 5.5 3.13247 5.5 2.99979C5.5 2.86711 5.55271 2.73986 5.64653 2.64604C5.74035 2.55222 5.8676 2.49951 6.00028 2.49951C6.13296 2.49951 6.26021 2.55222 6.35403 2.64604L11.354 7.64604C11.4005 7.69248 11.4374 7.74762 11.4626 7.80832C11.4877 7.86902 11.5007 7.93408 11.5007 7.99979C11.5007 8.0655 11.4877 8.13056 11.4626 8.19126C11.4374 8.25196 11.4005 8.3071 11.354 8.35354Z"
                        fill="#3B4D69"
                      />
                    </svg>
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white pt-1 px-4 pb-4 z-20">
        <div
          onClick={() => router.back()}
          className="w-full border-2 border-[#0046B0] rounded-3xl px-4 py-3 text-base font-semibold text-[#0046B0] text-center mb-2"
        >
          Trở về
        </div>
      </div>
    </div>
  );
}

export default function TransactionCategoryPage() {
  return (
    <Suspense
      fallback={
        <div className="relative flex min-h-screen max-h-screen flex-col bg-white rounded-[32px] overflow-y-auto">
          <div className="flex-1 flex items-center justify-center text-sm text-[#597397]">Đang tải...</div>
        </div>
      }
    >
      <TransactionCategoryPageInner />
    </Suspense>
  );
}
