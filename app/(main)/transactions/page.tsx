"use client";

import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useFooter } from "app/context/FooterContext";
import { useAuthContext } from "app/context/AuthContext";
import { transactionApi } from "app/services/transactionApi";
import { TransactionResponse } from "app/types/transaction";
import { categoryApi } from "app/services/categoryApi";
import { Category, SubCategory } from "app/types/category";
import { useCategories } from "app/hooks/useCategories";
import { formatVietnameseCurrency, formatDateDDMMYYYY, formatTimeHHMM } from "app/utilities/common/functions";
import Image from "next/image";
import { useTransactionsPage } from "app/hooks/useTransactionsPage";
import { imagePath } from "app/utilities/constants/common/assets";
import type { GroupedTransaction } from "app/types/transactionsPage";

export default function TransactionsPage() {
  const router = useRouter();
  const { setFooterVisible } = useFooter();

  const {
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
    setIsFilterOpen,
    categories,
    categoriesLoading,
    draftSelectedSubCategoryIds,
    toggleDraftCategory,
    toggleDraftSubCategory,
    applyFilterAndClose,
  } = useTransactionsPage();

  // Show footer on mount
  useEffect(() => {
    setFooterVisible(true);
  }, [setFooterVisible]);

  // monthPeriod and monthPeriodRange are provided by useTransactionsPage

  // summary and dailyTransactions are provided by useTransactionsPage

  // groupedTransactions, getSubCategoryIcon and formatCalendarAmount are provided by useTransactionsPage

  return (
    <div className="relative flex min-h-screen flex-col bg-white rounded-[32px] overflow-hidden">
      {/* Header */}
      <div className="relative bg-[#0046B0] h-[95px] rounded-bl-[20px] rounded-br-[20px]">
        <div className="absolute left-[-49px] top-0 h-[794.752px] w-[473px] mix-blend-lighten">
          <Image src={imagePath("/images/background.png")} alt="" fill className="object-cover" />
        </div>

        <div className="relative z-10 w-full flex items-center justify-between gap-3 px-4 pt-[55px]">
          <h1 className="text-lg font-semibold leading-[1.5] text-white">Sổ giao dịch</h1>
          <button
            type="button"
            onClick={openFilter}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 p-1"
            aria-label="Lọc"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M3 6H21M7 12H17M11 18H13"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 px-4 pt-4 pb-24 space-y-4 flex-1 overflow-y-auto">
        {/* Month Selector */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={handlePreviousMonth}
            className="bg-[#EDEEF1] rounded-full p-1 flex items-center justify-center"
            aria-label="Tháng trước"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M12.5 15L7.5 10L12.5 5"
                stroke="#090A0B"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <div className="px-2 py-0 rounded-[24px]">
            {authLoading ? (
              <div className="h-4 w-32 bg-[#E5E7EB] rounded-full animate-pulse" />
            ) : (
              <p className="text-sm font-medium text-[#090A0B]">{monthPeriod.monthLabel}</p>
            )}
          </div>
          <button
            type="button"
            onClick={handleNextMonth}
            className="bg-[#EBEEF3] rounded-full p-1 flex items-center justify-center"
            aria-label="Tháng sau"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M7.5 15L12.5 10L7.5 5"
                stroke="#B6BAC3"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        {/* Summary Cards */}
        <div className="bg-white rounded-xl px-1 py-2 flex items-center justify-between overflow-hidden">
          {/* Chi tiêu */}
          <div className="flex-1 flex flex-col gap-1 items-start justify-center px-3 py-2 rounded-lg">
            <div className="flex gap-1 items-start">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 2V14M2 8H14" stroke="#597397" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <p className="text-xs font-medium text-[#597397]">Chi tiêu</p>
            </div>
            <p className="text-sm font-semibold text-[#3B4D69]">
              {formatVietnameseCurrency(summary.totalExpense).replace("₫", "đ")}
            </p>
          </div>

          {/* Divider */}
          <div className="h-6 w-px bg-[#EBEEF3]" />

          {/* Thu nhập */}
          <div className="flex-1 flex flex-col gap-1 items-center justify-center px-3 py-2 rounded-lg">
            <div className="flex gap-1 items-start">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 2V14M2 8H14" stroke="#597397" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <p className="text-xs font-medium text-[#597397]">Thu nhập</p>
            </div>
            <p className="text-sm font-semibold text-[#2570EB]">
              {formatVietnameseCurrency(summary.totalIncome).replace("₫", "đ")}
            </p>
          </div>

          {/* Divider */}
          <div className="h-6 w-px bg-[#EBEEF3]" />

          {/* Chênh lệch */}
          <div className="flex-1 flex flex-col gap-1 items-center justify-center px-3 py-2 rounded-lg">
            <p className="text-xs font-medium text-[#597397]">Chênh lệch</p>
            <p className={`text-sm font-semibold ${summary.difference >= 0 ? "text-[#22C55E]" : "text-[#EF4444]"}`}>
              {summary.difference >= 0 ? "+" : ""}
              {formatVietnameseCurrency(summary.difference).replace("₫", "đ")}
            </p>
          </div>
        </div>

        {/* Calendar */}
        <div className="bg-white rounded-xl overflow-hidden">
          {/* Week Days Header */}
          <div className="bg-[#E0F5FE] flex">
            {weekDays.map((day, index) => (
              <div key={index} className="flex-1 flex items-center justify-center p-2">
                <p className="text-xs font-normal text-[#597397]">{day}</p>
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="flex flex-col">
            {Array.from({ length: Math.ceil(calendarDays.length / 7) }).map((_, weekIndex) => (
              <div key={weekIndex} className="flex">
                {Array.from({ length: 7 }).map((_, dayIndex) => {
                  const dayIndexInMonth = weekIndex * 7 + dayIndex;
                  const day = calendarDays[dayIndexInMonth];
                  const dateObj = day;
                  const dateKey =
                    dateObj !== null
                      ? `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, "0")}-${String(
                          dateObj.getDate(),
                        ).padStart(2, "0")}`
                      : null;
                  const dailyData = dateKey !== null ? dailyTransactions[dateKey] : null;

                  const isDisabled = dateObj === null;
                  const isSelected =
                    !isDisabled && selectedDate !== null && selectedDate.getTime() === dateObj.getTime();

                  return (
                    <div
                      key={`${weekIndex}-${dayIndex}`}
                      onClick={() => !isDisabled && dateObj && handleDateClick(dateObj)}
                      className={`flex-1 border-r border-b border-[#EBEEF3] h-[54px] relative ${
                        isDisabled
                          ? "bg-[#F8FAFC] cursor-default"
                          : isSelected
                            ? "bg-[#E0F5FE] cursor-pointer"
                            : "bg-white cursor-pointer "
                      }`}
                    >
                      {dateObj && (
                        <>
                          <p
                            className={`absolute top-[5.93%] left-[10.2%] text-[11px] font-normal ${
                              isSelected ? "text-[#0046B0] font-semibold" : "text-[#597397]"
                            }`}
                          >
                            {dateObj.getDate()}
                          </p>
                          {dailyData && (
                            <>
                              {dailyData.income > 0 && (
                                <p className="absolute top-[25.5px] left-[44px] text-[11px] font-semibold text-[#22C55E] text-right w-[30px] translate-x-[-100%] translate-y-[-50%]">
                                  {formatCalendarAmount(dailyData.income)}
                                </p>
                              )}
                              {dailyData.expense > 0 && (
                                <p className="absolute top-[42.5px] left-[44px] text-[11px] font-semibold text-[#EF4444] text-right w-[30px] translate-x-[-100%] translate-y-[-50%]">
                                  {formatCalendarAmount(dailyData.expense)}
                                </p>
                              )}
                            </>
                          )}
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Transaction List Header */}
        <div className="bg-white flex items-center justify-between px-4 py-2">
          <p className="text-sm font-semibold text-[#597397]">
            {selectedDate !== null
              ? `${String(selectedDate.getDate()).padStart(2, "0")}/${String(selectedDate.getMonth() + 1).padStart(
                  2,
                  "0",
                )}/${selectedDate.getFullYear()}`
              : monthPeriod.monthLabel}
          </p>
          <div className="flex items-center gap-1 px-2 py-1 rounded-[24px]">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M3 6H17M7 10H17M11 14H17"
                stroke="#1F2532"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <p className="text-sm font-semibold text-[#1F2532]">Mới nhất</p>
          </div>
        </div>

        <div className="h-px bg-[#EDEEF1]" />

        {/* Transaction List */}
        {authLoading || isLoadingList ? (
          <div className="bg-white rounded-2xl overflow-hidden">
            <div className="relative">
              <div className="divide-y divide-[#EBEEF3]">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex gap-2 h-[60px] items-center px-4 py-2 animate-pulse">
                    {/* Icon skeleton */}
                    <div className="bg-[#EDEEF1] rounded-full p-2 flex-shrink-0">
                      <div className="h-5 w-5 rounded-full bg-[#D4D7DF]" />
                    </div>

                    {/* Text skeleton */}
                    <div className="flex-1 flex flex-col gap-1 min-w-0">
                      <div className="h-3 w-24 bg-[#E5E7EB] rounded" />
                      <div className="h-3 w-32 bg-[#E5E7EB] rounded" />
                    </div>

                    {/* Amount & time skeleton */}
                    <div className="flex flex-col gap-1 items-end">
                      <div className="h-3 w-16 bg-[#E5E7EB] rounded" />
                      <div className="h-3 w-20 bg-[#E5E7EB] rounded" />
                    </div>

                    {/* Edit button skeleton */}
                    <div className="flex h-6 w-6 items-center justify-center rounded-full">
                      <div className="h-3 w-3 bg-[#E5E7EB] rounded" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-sm text-red-500">{error}</p>
          </div>
        ) : groupedTransactions.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-sm text-[#597397]">Chưa có giao dịch</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl overflow-hidden">
            {/* Banded rows background */}
            <div className="absolute flex flex-col gap-[60px] left-0 top-[60px]">
              {Array.from({
                length: Math.ceil(groupedTransactions.length / 2),
              }).map((_, i) => (
                <div key={i} className="bg-[#F8FAFC] h-[60px] w-full" />
              ))}
            </div>

            {/* Transaction items */}
            <div className="relative">
              {groupedTransactions.flatMap((group, groupIndex) =>
                group.transactions.map((tx, txIndex) => {
                  const globalIndex =
                    groupedTransactions.slice(0, groupIndex).reduce((sum, g) => sum + g.transactions.length, 0) +
                    txIndex;
                  const isEvenRow = globalIndex % 2 === 1;

                  return (
                    <div
                      key={tx.id}
                      className={`flex gap-2 h-[60px] items-center px-4 py-2 ${
                        isEvenRow ? "bg-[#F8FAFC]" : "bg-white"
                      }`}
                    >
                      {/* Icon */}
                      <div className="bg-[#EDEEF1] rounded-full p-2 flex-shrink-0">
                        <span className="text-base">{getSubCategoryIcon(tx.subCategoryId)}</span>
                      </div>

                      {/* Transaction Info */}
                      <div className="flex-1 flex flex-col gap-0.5 min-w-0">
                        <p className="text-sm font-semibold text-[#1F2532] truncate">
                          {(tx as any).subCategoryName || (tx as any).categoryName || "Khác"}
                        </p>
                        <p className="text-sm font-medium text-[#597397] truncate">{tx.note || ""}</p>
                      </div>

                      {/* Amount */}
                      <div className="flex flex-col gap-1 items-end">
                        <p
                          className={`text-sm font-semibold ${tx.type === "out" ? "text-[#3B4D69]" : "text-[#2570EB]"}`}
                        >
                          {tx.type === "out" ? "-" : "+"}
                          {formatVietnameseCurrency(tx.amount).replace("₫", "đ")}
                        </p>
                        <p className="text-xs font-medium text-[#597397]">
                          {formatTimeHHMM(tx.createdAt)}, {group.date}
                        </p>
                      </div>

                      {/* Edit Button */}
                      <button
                        type="button"
                        className="flex h-6 w-6 items-center justify-center rounded-full p-1"
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
                  );
                }),
              )}
            </div>
          </div>
        )}
      </div>
      {/* Filter Bottom Sheet */}
      {isFilterOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/30 backdrop-blur-[1px]">
          <div className="w-full max-w-[480px] mx-auto rounded-t-[24px] bg-white px-4 pt-3 pb-6">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#EBEEF3] pb-3">
              <button
                type="button"
                className="h-8 w-8 flex items-center justify-center rounded-2xl"
                onClick={() => setIsFilterOpen(false)}
                aria-label="Đóng bộ lọc"
              >
                <span className="text-white text-sm" />
              </button>
              <p className="text-[18px] font-semibold text-[#1F2532]">Bộ lọc</p>
              <button
                type="button"
                className="h-8 w-8 flex items-center justify-center rounded-2xl"
                onClick={() => setIsFilterOpen(false)}
                aria-label="Đóng bộ lọc"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M12 4L4 12M4 4L12 12" stroke="#1F2532" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            <div className="pt-3 space-y-4 max-h-[60vh] overflow-y-auto">
              {/* Categories from API (like budget page) */}
              <div className="space-y-4 text-sm text-[#3B4D69]">
                {categoriesLoading ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="space-y-2 animate-pulse">
                        <div className="h-4 w-32 bg-[#E5E7EB] rounded" />
                        <div className="flex flex-wrap gap-2">
                          {[1, 2, 3, 4].map((j) => (
                            <div key={j} className="h-9 w-24 bg-[#E5E7EB] rounded-full" />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  categories.map((category) => {
                    const subIds = category.subCategories.map((s) => s.id);
                    const selectedCount = subIds.filter((id) => draftSelectedSubCategoryIds.has(id)).length;
                    const allSelected =
                      category.subCategories.length > 0 && selectedCount === category.subCategories.length;
                    const someSelected = selectedCount > 0;
                    return (
                      <div key={category.id} className="space-y-2">
                        <button
                          type="button"
                          onClick={() => toggleDraftCategory(category)}
                          className="flex w-full items-center gap-2 rounded-lg py-1 text-left hover:bg-[#F8FAFC]"
                        >
                          <span
                            className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded border-2 ${
                              allSelected
                                ? "border-[#0046B0] bg-[#0046B0]"
                                : someSelected
                                  ? "border-[#0046B0] bg-[#E0F5FE]"
                                  : "border-[#B6BAC3]"
                            }`}
                            aria-hidden
                          >
                            {allSelected ? (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="12"
                                height="12"
                                viewBox="0 0 16 16"
                                fill="none"
                              >
                                <path
                                  d="M13 4L6 11L3 8"
                                  stroke="white"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            ) : someSelected ? (
                              <span className="h-0.5 w-2.5 rounded-sm bg-[#0046B0]" />
                            ) : null}
                          </span>
                          <p className="font-semibold text-[#597397]">{category.name}</p>
                        </button>
                        <div className="flex flex-wrap gap-2">
                          {category.subCategories.map((sub) => {
                            const isSelected = draftSelectedSubCategoryIds.has(sub.id);
                            return (
                              <button
                                key={sub.id}
                                type="button"
                                onClick={() => toggleDraftSubCategory(sub.id)}
                                className={`flex items-center gap-2 rounded-full px-3 py-2 text-[14px] font-medium transition-colors ${
                                  isSelected ? "bg-[#E0F5FE] text-[#1F2532]" : "bg-[#EDEEF1] text-[#3B4D69]"
                                }`}
                              >
                                <span aria-hidden="true">{sub.icon}</span>
                                <span>{sub.name}</span>
                                {isSelected ? (
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    viewBox="0 0 16 16"
                                    fill="none"
                                  >
                                    <path
                                      d="M8 1.5C6.71442 1.5 5.45772 1.88122 4.3888 2.59545C3.31988 3.30968 2.48676 4.32484 1.99479 5.51256C1.50282 6.70028 1.37409 8.00721 1.6249 9.26809C1.8757 10.529 2.49477 11.6872 3.40381 12.5962C4.31285 13.5052 5.47104 14.1243 6.73192 14.3751C7.99279 14.6259 9.29973 14.4972 10.4874 14.0052C11.6752 13.5132 12.6903 12.6801 13.4046 11.6112C14.1188 10.5423 14.5 9.28558 14.5 8C14.4982 6.27665 13.8128 4.62441 12.5942 3.40582C11.3756 2.18722 9.72335 1.50182 8 1.5ZM10.8538 6.85375L7.35375 10.3538C7.30732 10.4002 7.25217 10.4371 7.19147 10.4623C7.13077 10.4874 7.06571 10.5004 7 10.5004C6.9343 10.5004 6.86923 10.4874 6.80853 10.4623C6.74783 10.4371 6.69269 10.4002 6.64625 10.3538L5.14625 8.85375C5.05243 8.75993 4.99972 8.63268 4.99972 8.5C4.99972 8.36732 5.05243 8.24007 5.14625 8.14625C5.24007 8.05243 5.36732 7.99972 5.5 7.99972C5.63268 7.99972 5.75993 8.05243 5.85375 8.14625L7 9.29313L10.1463 6.14625C10.1927 6.09979 10.2479 6.06294 10.3086 6.0378C10.3693 6.01266 10.4343 5.99972 10.5 5.99972C10.5657 5.99972 10.6308 6.01266 10.6915 6.0378C10.7521 6.06294 10.8073 6.09979 10.8538 6.14625C10.9002 6.1927 10.9371 6.24786 10.9622 6.30855C10.9873 6.36925 11.0003 6.4343 11.0003 6.5C11.0003 6.5657 10.9873 6.63075 10.9622 6.69145C10.9371 6.75214 10.9002 6.8073 10.8538 6.85375Z"
                                      fill="#0EA5E9"
                                    />
                                  </svg>
                                ) : (
                                  <div className="w-4 h-4 rounded-full" />
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Confirm button - apply filter and call API */}
              <button
                type="button"
                onClick={applyFilterAndClose}
                className="w-full rounded-[24px] bg-[#9CF526] py-2 text-center text-[14px] font-semibold text-[#1F2532]"
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
