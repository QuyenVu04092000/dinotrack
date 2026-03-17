"use client";

import Image from "next/image";
import React from "react";
import { useHome } from "app/hooks/useHome";
import { formatVietnameseCurrency } from "app/utilities/common/functions";
import { SubCategory } from "app/types/category";
import { useRouter } from "next/navigation";
import { imagePath } from "app/utilities/constants/common/assets";

export default function HomePage() {
  const {
    displayName,
    formattedTodaySpent,
    activeType,
    setActiveType,
    handleSubmit,
    handleOpenDateModal,
    formattedDateLabel,
    isExpense,
    selectedCategory,
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
  } = useHome();
  const router = useRouter();

  return (
    <section
      aria-label="Trang chủ Doni sau khi đăng nhập"
      className="relative flex min-h-[100vh] justify-center bg-background"
    >
      <div className="absolute inset-0 opacity-40">
        <Image src={imagePath("/images/background.png")} alt="" fill priority className="object-cover" />
      </div>

      <div
        className="relative z-10 flex w-full h-screen px-4 flex-col sm:px-6 mb-[55px]"
        style={{ paddingTop: "calc(1.75rem + env(safe-area-inset-top, 0px))" }}
      >
        {/* Header */}
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative h-11 w-11 overflow-hidden rounded-full border-2 border-white/60 bg-white">
              <Image
                src={imagePath("/images/avatar.png")}
                alt={`Ảnh đại diện của ${displayName}`}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex flex-col">
              <p className="text-sm font-semibold text-white">Xin chào, {displayName} 👋</p>
              <p className="text-xs text-white/80">{displayName} đã chi tiêu gì hôm nay?</p>
            </div>
          </div>

          <button
            type="button"
            aria-label="Xem thông báo (chưa hoạt động)"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-slate-700 shadow-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M20.7946 16.4944C20.2743 15.5981 19.5009 13.0622 19.5009 9.75C19.5009 7.76088 18.7107 5.85322 17.3042 4.4467C15.8976 3.04018 13.99 2.25 12.0009 2.25C10.0117 2.25 8.10409 3.04018 6.69757 4.4467C5.29104 5.85322 4.50087 7.76088 4.50087 9.75C4.50087 13.0631 3.72649 15.5981 3.20618 16.4944C3.07331 16.7222 3.00287 16.9811 3.00196 17.2449C3.00106 17.5086 3.06972 17.768 3.20102 17.9967C3.33233 18.2255 3.52163 18.4156 3.74984 18.5478C3.97805 18.6801 4.2371 18.7498 4.50087 18.75H8.3268C8.49984 19.5967 8.96001 20.3577 9.62949 20.9042C10.299 21.4507 11.1367 21.7492 12.0009 21.7492C12.8651 21.7492 13.7028 21.4507 14.3722 20.9042C15.0417 20.3577 15.5019 19.5967 15.6749 18.75H19.5009C19.7645 18.7496 20.0235 18.6798 20.2516 18.5475C20.4796 18.4151 20.6688 18.225 20.8 17.9963C20.9312 17.7676 20.9998 17.5083 20.9988 17.2446C20.9979 16.9809 20.9274 16.7222 20.7946 16.4944ZM12.0009 20.25C11.5357 20.2499 11.082 20.1055 10.7022 19.8369C10.3225 19.5683 10.0353 19.1886 9.88024 18.75H14.1215C13.9664 19.1886 13.6793 19.5683 13.2995 19.8369C12.9197 20.1055 12.466 20.2499 12.0009 20.25ZM4.50087 17.25C5.22274 16.0087 6.00087 13.1325 6.00087 9.75C6.00087 8.1587 6.63301 6.63258 7.75823 5.50736C8.88344 4.38214 10.4096 3.75 12.0009 3.75C13.5922 3.75 15.1183 4.38214 16.2435 5.50736C17.3687 6.63258 18.0009 8.1587 18.0009 9.75C18.0009 13.1297 18.7771 16.0059 19.5009 17.25H4.50087Z"
                fill="#3B4D69"
              />
            </svg>
          </button>
        </header>
        {/* Summary cards */}
        <div className="pt-3 grid grid-cols-2 gap-3 text-white">
          <div className="rounded-2xl bg-gradient-to-r from-[#BAE8FD] to-[#46C7FF] px-3 py-2 text-xs shadow relative">
            <div
              className="absolute top-0 right-0 w-1/2 h-full rounded-2xl"
              style={{
                backgroundImage: `url('${imagePath("/images/balance_background.png")}')`,
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
                backgroundImage: `url('${imagePath("/images/spent_background.png")}')`,
                backgroundSize: "contain",
                backgroundPosition: "right",
                backgroundRepeat: "no-repeat",
              }}
            />
            <p className="text-[14px] text-sm text-black font-medium">Chi hôm nay</p>
            <p className="mt-1 text-base font-semibold text-black">
              {Number(formattedTodaySpent) > 0 ? `-${formattedTodaySpent}` : formattedTodaySpent}
            </p>
          </div>
        </div>
        {/* Main transaction card */}
        <main className="mt-4 rounded-3xl bg-white px-4 pb-5 pt-3 shadow-md backdrop-blur">
          {/* Segmented control */}
          <div className="w-full px-14">
            <div role="tablist" aria-label="Loại giao dịch" className="mb-5 flex w-full rounded-full bg-slate-100 p-1">
              <button
                type="button"
                role="tab"
                aria-selected={activeType === "expense"}
                className={`flex-1 rounded-full px-3 py-2 text-center text-sm font-semibold ${
                  activeType === "expense" ? "bg-white text-[#0046B0] shadow-sm" : "text-slate-400"
                }`}
                onClick={() => setActiveType("expense")}
              >
                Chi tiêu
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={activeType === "income"}
                className={`flex-1 rounded-full px-3 py-2 text-center text-sm font-semibold ${
                  activeType === "income" ? "bg-white text-[#0046B0] shadow-sm" : "text-slate-400"
                }`}
                onClick={() => setActiveType("income")}
              >
                Thu nhập
              </button>
            </div>
          </div>
          {/* Form */}
          <form aria-label="Tạo giao dịch mới" className="space-y-4 text-sm text-slate-700" onSubmit={handleSubmit}>
            {/* Date */}
            <div className="space-y-1 flex items-center justify-between">
              <label className="text-sm font-medium text-black w-28">Ngày:</label>
              <button
                type="button"
                onClick={handleOpenDateModal}
                className="flex h-11 w-full items-center justify-between rounded-3xl bg-slate-100 px-4 text-sm text-black font-semibold"
                aria-label="Chọn ngày giao dịch, mở lịch"
              >
                <span>{formattedDateLabel}</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="17" viewBox="0 0 15 17" fill="none">
                  <path
                    d="M13.75 1.25H11.875V0.625C11.875 0.45924 11.8092 0.300268 11.6919 0.183058C11.5747 0.065848 11.4158 0 11.25 0C11.0842 0 10.9253 0.065848 10.8081 0.183058C10.6908 0.300268 10.625 0.45924 10.625 0.625V1.25H4.375V0.625C4.375 0.45924 4.30915 0.300268 4.19194 0.183058C4.07473 0.065848 3.91576 0 3.75 0C3.58424 0 3.42527 0.065848 3.30806 0.183058C3.19085 0.300268 3.125 0.45924 3.125 0.625V1.25H1.25C0.918479 1.25 0.600537 1.3817 0.366116 1.61612C0.131696 1.85054 0 2.16848 0 2.5V15C0 15.3315 0.131696 15.6495 0.366116 15.8839C0.600537 16.1183 0.918479 16.25 1.25 16.25H13.75C14.0815 16.25 14.3995 16.1183 14.6339 15.8839C14.8683 15.6495 15 15.3315 15 15V2.5C15 2.16848 14.8683 1.85054 14.6339 1.61612C14.3995 1.3817 14.0815 1.25 13.75 1.25ZM3.125 2.5V3.125C3.125 3.29076 3.19085 3.44973 3.30806 3.56694C3.42527 3.68415 3.58424 3.75 3.75 3.75C3.91576 3.75 4.07473 3.68415 4.19194 3.56694C4.30915 3.44973 4.375 3.29076 4.375 3.125V2.5H10.625V3.125C10.625 3.29076 10.6908 3.44973 10.8081 3.56694C10.9253 3.68415 11.0842 3.75 11.25 3.75C11.4158 3.75 11.5747 3.68415 11.6919 3.56694C11.8092 3.44973 11.875 3.29076 11.875 3.125V2.5H13.75V5H1.25V2.5H3.125ZM13.75 15H1.25V6.25H13.75V15Z"
                    fill="#1F2532"
                  />
                </svg>
              </button>
            </div>

            {/* Amount */}
            <div className="space-y-1 flex items-center justify-between">
              <label htmlFor="amount" className="text-sm font-medium text-black w-28">
                {isExpense ? "Số tiền chi:" : "Số tiền:"}
              </label>
              <input
                id="amount"
                name="amount"
                type="text"
                inputMode="numeric"
                value={amountValue}
                onChange={handleAmountChange}
                placeholder="0đ"
                className="h-11 w-full rounded-3xl border-0 bg-slate-100 px-4 text-base text-black font-medium placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0046B0]"
              />
            </div>

            {/* Note */}
            <div className="space-y-1 flex items-center justify-between">
              <label htmlFor="note" className="text-sm font-medium text-black w-28">
                Ghi chú:
              </label>
              <input
                id="note"
                name="note"
                type="text"
                placeholder="Nhập ghi chú"
                className="h-11 w-full rounded-3xl border-0 bg-slate-100 px-4 text-base text-black font-medium placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0046B0]"
              />
            </div>

            {/* Category */}
            <div className="space-y-1 flex items-center justify-between">
              <label htmlFor="category" className="text-sm font-medium text-black w-28">
                Danh mục:
              </label>
              <div className="relative w-full">
                <button
                  type="button"
                  id="category"
                  name="category"
                  onClick={() => !categoriesLoading && !categoriesError && setIsCategoryModalOpen(true)}
                  disabled={categoriesLoading || !!categoriesError}
                  className="flex h-11 w-full items-center justify-between rounded-3xl border-0 bg-slate-100 px-4 pr-10 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0046B0] disabled:cursor-not-allowed disabled:opacity-60"
                  aria-label="Chọn danh mục (mở danh sách)"
                >
                  <span className="truncate text-left">
                    {categoriesLoading
                      ? "Đang tải..."
                      : categoriesError
                        ? "Lỗi tải danh mục"
                        : selectedCategory && selectedCategory.name !== undefined
                          ? `${selectedCategory.icon} ${selectedCategory.name}`
                          : "Chọn danh mục"}
                  </span>
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-xs text-slate-500"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path
                        d="M16.6925 7.94254L10.4425 14.1925C10.3845 14.2506 10.3156 14.2967 10.2397 14.3282C10.1638 14.3597 10.0825 14.3758 10.0003 14.3758C9.91821 14.3758 9.83688 14.3597 9.76101 14.3282C9.68514 14.2967 9.61621 14.2506 9.55816 14.1925L3.30816 7.94254C3.19088 7.82526 3.125 7.6662 3.125 7.50035C3.125 7.3345 3.19088 7.17544 3.30816 7.05816C3.42544 6.94088 3.5845 6.875 3.75035 6.875C3.9162 6.875 4.07526 6.94088 4.19253 7.05816L10.0003 12.8668L15.8082 7.05816C15.8662 7.00009 15.9352 6.95403 16.011 6.9226C16.0869 6.89117 16.1682 6.875 16.2503 6.875C16.3325 6.875 16.4138 6.89117 16.4897 6.9226C16.5655 6.95403 16.6345 7.00009 16.6925 7.05816C16.7506 7.11623 16.7967 7.18517 16.8281 7.26104C16.8595 7.33691 16.8757 7.41823 16.8757 7.50035C16.8757 7.58247 16.8595 7.66379 16.8281 7.73966C16.7967 7.81553 16.7506 7.88447 16.6925 7.94254Z"
                        fill="#B6BAC3"
                      />
                    </svg>
                  </span>
                </button>
              </div>
            </div>

            {/* Quick categories (sub-categories from /sub-categories) */}
            <div className="space-y-2 pt-2">
              <p className="text-xs font-medium text-slate-500">Đề xuất:</p>
              {quickSubsLoading ? (
                <div className="flex items-center justify-center py-4">
                  <p className="text-xs text-slate-400">Đang tải danh mục...</p>
                </div>
              ) : quickSubsError ? (
                <div className="flex items-center justify-center py-4">
                  <p className="text-xs text-red-500">Lỗi tải danh mục: {quickSubsError}</p>
                </div>
              ) : quickSubCategories.length === 0 ? (
                <div className="flex items-center justify-center py-4">
                  <p className="text-xs text-slate-400">Không có danh mục con nào</p>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2 items-center">
                  {quickSubCategories.slice(0, 7).map((sub) => (
                    <button
                      key={sub.id}
                      type="button"
                      onClick={() => handleQuickCategoryClick(sub || "")}
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-1.5 text-xs font-medium transition-colors ${
                        sub.id === selectedCategory.id
                          ? "bg-[#E0F5FE] text-[#1F2532]"
                          : "bg-[#EDEEF1] text-[#3B4D69] hover:bg-slate-200"
                      }`}
                      aria-label={sub.name}
                    >
                      <span aria-hidden="true">{sub.icon}</span>
                      <span>{sub.name}</span>
                      {sub.id === selectedCategory.id && (
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <path
                            d="M8 1.5C6.71442 1.5 5.45772 1.88122 4.3888 2.59545C3.31988 3.30968 2.48676 4.32484 1.99479 5.51256C1.50282 6.70028 1.37409 8.00721 1.6249 9.26809C1.8757 10.529 2.49477 11.6872 3.40381 12.5962C4.31285 13.5052 5.47104 14.1243 6.73192 14.3751C7.99279 14.6259 9.29973 14.4972 10.4874 14.0052C11.6752 13.5132 12.6903 12.6801 13.4046 11.6112C14.1188 10.5423 14.5 9.28558 14.5 8C14.4982 6.27665 13.8128 4.62441 12.5942 3.40582C11.3756 2.18722 9.72335 1.50182 8 1.5ZM10.8538 6.85375L7.35375 10.3538C7.30732 10.4002 7.25217 10.4371 7.19147 10.4623C7.13077 10.4874 7.06571 10.5004 7 10.5004C6.9343 10.5004 6.86923 10.4874 6.80853 10.4623C6.74783 10.4371 6.69269 10.4002 6.64625 10.3538L5.14625 8.85375C5.05243 8.75993 4.99972 8.63268 4.99972 8.5C4.99972 8.36732 5.05243 8.24007 5.14625 8.14625C5.24007 8.05243 5.36732 7.99972 5.5 7.99972C5.63268 7.99972 5.75993 8.05243 5.85375 8.14625L7 9.29313L10.1463 6.14625C10.1927 6.09979 10.2479 6.06294 10.3086 6.0378C10.3693 6.01266 10.4343 5.99972 10.5 5.99972C10.5657 5.99972 10.6308 6.01266 10.6915 6.0378C10.7521 6.06294 10.8073 6.09979 10.8538 6.14625C10.9002 6.1927 10.9371 6.24786 10.9622 6.30855C10.9873 6.36925 11.0003 6.4343 11.0003 6.5C11.0003 6.5657 10.9873 6.63075 10.9622 6.69145C10.9371 6.75214 10.9002 6.8073 10.8538 6.85375Z"
                            fill="#0EA5E9"
                          />
                        </svg>
                      )}
                    </button>
                  ))}
                  <div>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path
                        d="M14.2075 4.5856L11.4144 1.7931C11.3215 1.70021 11.2113 1.62653 11.0899 1.57626C10.9686 1.526 10.8385 1.50012 10.7072 1.50012C10.5759 1.50012 10.4458 1.526 10.3245 1.57626C10.2031 1.62653 10.0929 1.70021 10 1.7931L2.29313 9.49997C2.19987 9.59249 2.12593 9.70263 2.0756 9.82398C2.02528 9.94533 1.99959 10.0755 2.00001 10.2068V13C2.00001 13.2652 2.10536 13.5195 2.2929 13.7071C2.48043 13.8946 2.73479 14 3.00001 14H13.5C13.6326 14 13.7598 13.9473 13.8536 13.8535C13.9473 13.7598 14 13.6326 14 13.5C14 13.3674 13.9473 13.2402 13.8536 13.1464C13.7598 13.0526 13.6326 13 13.5 13H7.20751L14.2075 5.99997C14.3004 5.90711 14.3741 5.79686 14.4243 5.67552C14.4746 5.55418 14.5005 5.42412 14.5005 5.29278C14.5005 5.16144 14.4746 5.03139 14.4243 4.91005C14.3741 4.78871 14.3004 4.67846 14.2075 4.5856ZM5.79313 13H3.00001V10.2068L8.50001 4.70685L11.2931 7.49997L5.79313 13ZM12 6.7931L9.20751 3.99997L10.7075 2.49997L13.5 5.2931L12 6.7931Z"
                        fill="#0046B0"
                      />
                    </svg>
                  </div>
                </div>
              )}
            </div>

            {/* Primary CTA */}
            <div className="pt-4">
              {submitError && <p className="mb-2 text-xs text-red-500">{submitError}</p>}
              {submitSuccess && <p className="mb-2 text-xs text-green-600">{submitSuccess}</p>}
              <button
                type="submit"
                disabled={isSubmitting}
                className="h-12 w-full rounded-3xl bg-[#9CF526] text-sm font-semibold text-slate-900 shadow-sm disabled:cursor-not-allowed disabled:opacity-70"
                aria-label="Nhập giao dịch"
              >
                {isSubmitting ? "Đang lưu..." : isExpense ? "Nhập khoản chi" : "Nhập khoản thu"}
              </button>
            </div>
          </form>
        </main>
      </div>

      {/* Date picker modal (bottom sheet style) */}
      {isDateModalOpen && (
        <div className="fixed inset-0 z-40 flex items-end justify-center bg-black/40">
          <div className="w-full max-w-sm rounded-t-3xl bg-white px-4 pt-2 pb-6 shadow-[0_-8px_24px_rgba(15,23,42,0.35)]">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-200 py-3">
              <div className="w-6" />
              <p className="text-base font-semibold text-slate-900">Chọn thời gian</p>
              <button
                type="button"
                onClick={handleCloseDateModal}
                aria-label="Đóng chọn thời gian"
                className="flex h-6 w-6 items-center justify-center rounded-full text-slate-700 hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            {/* Month navigation */}
            <div className="mt-3 mb-2 flex items-center justify-between">
              <button
                type="button"
                onClick={goToPreviousMonth}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-600"
                aria-label="Tháng trước"
              >
                ‹
              </button>
              <div className="rounded-2xl bg-slate-50 px-3 py-1">
                <span className="text-sm font-medium text-slate-900">
                  {currentMonth.toLocaleString("vi-VN", {
                    month: "long",
                  })}
                </span>
              </div>
              <button
                type="button"
                onClick={goToNextMonth}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-slate-900"
                aria-label="Tháng sau"
              >
                ›
              </button>
            </div>

            {/* Weekday headers */}
            <div className="mb-1 grid grid-cols-7 gap-1 text-center text-[11px] font-medium text-slate-500">
              {weekDayHeaders.map((d) => (
                <div key={d}>{d}</div>
              ))}
            </div>

            {/* Days grid */}
            <div className="grid grid-cols-7 gap-1 text-center text-[13px]">
              {/* Empty cells before first day */}
              {Array.from({ length: firstDayOfWeek }).map((_, index) => (
                <div key={`empty-${index}`} />
              ))}
              {daysInMonth.map((day) => {
                const dateIso = `${calendarYear}-${String(calendarMonth + 1).padStart(
                  2,
                  "0",
                )}-${String(day).padStart(2, "0")}`;
                const isSelected = selectedDate === dateIso;
                const isFuture = dateIso > todayLocalIso;
                return (
                  <button
                    key={day}
                    type="button"
                    disabled={isFuture}
                    onClick={() => !isFuture && handleSelectedDateFromCalendar(day)}
                    className={`mx-auto flex h-9 w-9 items-center justify-center rounded-full ${
                      isSelected ? "bg-[#0046B0] text-white" : "text-slate-900 hover:bg-slate-100"
                    } ${isFuture ? "cursor-not-allowed text-slate-300 hover:bg-transparent" : ""}`}
                  >
                    {String(day).padStart(2, "0")}
                  </button>
                );
              })}
            </div>

            {/* Footer actions */}
            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={handleCloseDateModal}
                className="h-9 rounded-2xl bg-slate-100 px-3 text-xs font-medium text-slate-700"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={() => {
                  const today = new Date();
                  const year = today.getFullYear();
                  const month = String(today.getMonth() + 1).padStart(2, "0");
                  const day = String(today.getDate()).padStart(2, "0");
                  const iso = `${year}-${month}-${day}`;
                  setSelectedDate(iso);
                  setCurrentMonth(today);
                  setIsDateModalOpen(false);
                }}
                className="h-9 rounded-2xl bg-[#0046B0] px-3 text-xs font-semibold text-white"
              >
                Hôm nay
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Category picker modal (bottom sheet style) */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-40 flex items-end justify-center bg-black/40">
          <div className="w-full h-[85%] max-w-sm rounded-t-3xl bg-white px-4 pt-2 pb-6 shadow-[0_-8px_24px_rgba(15,23,42,0.35)] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-200 py-3">
              <div className="w-6" />
              <p className="text-base font-semibold text-slate-900">Chọn danh mục</p>
              <button
                type="button"
                onClick={() => setIsCategoryModalOpen(false)}
                aria-label="Đóng chọn danh mục"
                className="flex h-6 w-6 items-center justify-center rounded-full text-slate-700 hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            {/* Content */}
            <div className="mt-3 flex-1 w-full space-y-4 overflow-y-auto pb-1">
              {categoriesLoading ? (
                <div className="flex items-center justify-center py-6">
                  <p className="text-sm text-slate-400">Đang tải danh mục...</p>
                </div>
              ) : categoriesError ? (
                <div className="flex items-center justify-center py-6">
                  <p className="text-sm text-red-500">Lỗi tải danh mục: {categoriesError}</p>
                </div>
              ) : categories.length === 0 ? (
                <div className="flex items-center justify-center py-6">
                  <p className="text-sm text-slate-400">Không có danh mục nào</p>
                </div>
              ) : (
                <>
                  {/* Header action row */}
                  <div className="flex items-center justify-start rounded-2xl bg-white px-3 py-2">
                    <p className="text-sm font-medium text-slate-500">Chưa có danh mục bạn cần?</p>
                    <button
                      onClick={() => {
                        router.push("/category/create-category");
                      }}
                      type="button"
                      className="inline-flex items-center gap-1 rounded-3xl border border-[#0046B0] px-3 py-1 text-sm font-semibold text-[#0046B0]"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 15 15" fill="none">
                        <path
                          d="M15 7.5C15 7.66576 14.9342 7.82473 14.8169 7.94194C14.6997 8.05915 14.5408 8.125 14.375 8.125H8.125V14.375C8.125 14.5408 8.05915 14.6997 7.94194 14.8169C7.82473 14.9342 7.66576 15 7.5 15C7.33424 15 7.17527 14.9342 7.05806 14.8169C6.94085 14.6997 6.875 14.5408 6.875 14.375V8.125H0.625C0.45924 8.125 0.300269 8.05915 0.183058 7.94194C0.0658481 7.82473 0 7.66576 0 7.5C0 7.33424 0.0658481 7.17527 0.183058 7.05806C0.300269 6.94085 0.45924 6.875 0.625 6.875H6.875V0.625C6.875 0.45924 6.94085 0.300269 7.05806 0.183058C7.17527 0.0658481 7.33424 0 7.5 0C7.66576 0 7.82473 0.0658481 7.94194 0.183058C8.05915 0.300269 8.125 0.45924 8.125 0.625V6.875H14.375C14.5408 6.875 14.6997 6.94085 14.8169 7.05806C14.9342 7.17527 15 7.33424 15 7.5Z"
                          fill="#0046B0"
                        />
                      </svg>
                      <span>Thêm mới</span>
                    </button>
                  </div>

                  {/* Category groups */}
                  <div className="space-y-4">
                    {categories.map((cat) => (
                      <div key={cat.id} className="space-y-2">
                        {/* Category name only */}
                        <p className="text-sm font-semibold text-slate-600">{cat.name}</p>

                        {/* Sub-categories: icon + name pills */}
                        {cat.subCategories && cat.subCategories.length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {cat.subCategories.map((sub) => {
                              const isSelected = sub.id === selectedCategory.id;
                              return (
                                <button
                                  key={sub.id}
                                  type="button"
                                  onClick={() => {
                                    handleQuickCategoryClick(sub);
                                    setIsCategoryModalOpen(false);
                                  }}
                                  className={`inline-flex items-center gap-2 rounded-3xl px-3 py-2 text-sm font-medium ${
                                    isSelected
                                      ? "bg-[#E0F5FE] text-[#1F2532]"
                                      : "bg-[#EDEEF1] text-[#3B4D69] hover:bg-slate-200"
                                  }`}
                                >
                                  <span aria-hidden="true">{sub.icon}</span>
                                  <span className="whitespace-nowrap">{sub.name}</span>
                                  {isSelected && (
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
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        ) : (
                          <p className="text-[11px] text-slate-400">Chưa có danh mục con</p>
                        )}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
