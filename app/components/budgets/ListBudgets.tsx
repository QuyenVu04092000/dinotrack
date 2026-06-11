"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { formatVietnameseCurrency } from "app/utilities/common/functions";
import { useBudgetsList } from "app/hooks/useBudgetsList";
import { imagePath } from "app/utilities/constants/common/assets";
import MonthNavigator from "app/components/budgets/MonthNavigator";

export default function ListBudgets() {
  const router = useRouter();
  const { loading, error, periodLabel, budgetsByCategory, isCurrentMonth, hasStartDayMonth, goToPrevMonth, goToNextMonth } = useBudgetsList();
  const params = new URLSearchParams();

  return (
    <section aria-label="Ngân sách" className="relative flex min-h-screen flex-col bg-white">
      {/* Header - extends into top safe area (notch) on PWA and browser */}
      <div
        className="relative w-full overflow-hidden bg-[#0046B0] h-[55px]"
        style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}
      >
        <div className="absolute h-full w-full mix-blend-soft-light inset-0">
          <Image src={imagePath("/images/header.png")} alt="" fill className="object-cover" />
        </div>
        <div className="absolute left-1/2 bottom-2 flex w-full -translate-x-1/2 items-center justify-between gap-2 px-4">
          <h1 className="flex-1 text-lg font-semibold leading-[1.5] text-white">Ngân sách</h1>
          {isCurrentMonth && (
            <button
              type="button"
              onClick={() => router.push("/budgets/create-budget")}
              className="flex items-center gap-2 rounded-full bg-white/20 px-3 py-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path
                  d="M10 4.16669V15.8334M4.16669 10H15.8334"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="text-sm font-semibold text-white">Thêm ngân sách</span>
            </button>
          )}
        </div>
      </div>

      <MonthNavigator
        periodLabel={periodLabel}
        onPrev={goToPrevMonth}
        onNext={goToNextMonth}
        isNextDisabled={isCurrentMonth}
      />

      {!hasStartDayMonth && (
        <div className="mx-3 mt-2 rounded-xl bg-yellow-50 px-3 py-2">
          <p className="text-xs text-yellow-700">Vào Cài đặt để tuỳ chỉnh ngày bắt đầu tháng</p>
        </div>
      )}

      {error && (
        <p className="px-3 pt-2 text-center text-sm text-red-500">{error}</p>
      )}

      {/* Budget list */}
      <div className="relative z-10 flex flex-1 flex-col gap-4 px-3 py-3">
        {loading ? (
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div key={i} className="rounded-2xl bg-[#E0F5FE] p-4 animate-pulse">
                <div className="h-5 w-48 bg-[#B6BAC3] rounded mb-3" />
                <div className="h-16 bg-[#D4D7DF] rounded-xl" />
              </div>
            ))}
          </div>
        ) : budgetsByCategory.length === 0 ? (
          <div className="py-8 text-center">
            <p className="text-sm text-[#597397]">Tháng này chưa có ngân sách nào</p>
            {isCurrentMonth && (
              <p className="mt-1 text-xs text-[#8E95A2]">Nhấn + Thêm ngân sách để tạo</p>
            )}
          </div>
        ) : (
          budgetsByCategory.map(({ category, budgets: catBudgets, background }) => {
            const totalRemaining = catBudgets.reduce((sum, b) => sum + (b.remainingBudget ?? 0), 0);
            const subCategoryMap = new Map(category.subCategories.map((s) => [s.id, s]));
            return (
              <div
                key={category.id}
                className="rounded-2xl overflow-hidden p-3"
                style={{
                  background,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                }}
              >
                {/* Category row */}
                <div
                  className="flex items-center justify-between px-2 py-1"
                  onClick={() => {
                    params.set("categoryId", category.id);
                    router.push(`/transactions/category?${params.toString()}`);
                  }}
                >
                  <p className="text-sm font-semibold text-[#1F2532]">{category.name}</p>
                  <div className="flex items-center gap-1">
                    <span className="text-sm font-medium text-[#597397]">
                      Còn lại:{" "}
                      <span className="text-sm font-semibold text-[#0046B0]">
                        {formatVietnameseCurrency(totalRemaining).replace("₫", "đ")}
                      </span>
                    </span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path
                        d="M7.5 15L12.5 10L7.5 5"
                        stroke="#597397"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </div>
                {/* Subcategory rows */}
                <div className="flex flex-col gap-0 ">
                  {catBudgets.map((b, index) => {
                    const sub = subCategoryMap.get(b.subCategoryId);
                    const spent = b.totalExpense ?? 0;
                    const budget = b.budget ?? 0;
                    const remaining = b.remainingBudget ?? budget - spent;
                    const percent = budget > 0 ? Math.min(100, (spent / budget) * 100) : 0;
                    return (
                      <div
                        key={b.id}
                        className={`bg-white/60 px-4 py-3 bg-[#fff] rounded-2xl mt-3 flex justify-center items-center gap-2`}
                        onClick={() => {
                          params.set("subCategoryId", b.subCategoryId);
                          router.push(`/transactions/category?${params.toString()}`);
                        }}
                      >
                        <span
                          className="flex h-9 w-9 items-center justify-center rounded-full bg-[#EDEEF1] text-base"
                          aria-hidden
                        >
                          {sub?.icon ?? "📂"}
                        </span>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <div className="flex justify-between items-center w-full">
                              <p className="text-sm font-semibold text-[#1F2532]">{sub?.name ?? "—"}</p>
                              <p className="text-sm font-semibold text-[#3B4D69]">
                                {formatVietnameseCurrency(budget).replace("₫", "đ")}
                              </p>
                            </div>
                          </div>
                          <div
                            className="mt-2 h-2 w-full rounded-full bg-[#EDEEF1] overflow-hidden"
                            role="progressbar"
                            aria-valuenow={percent}
                            aria-valuemin={0}
                            aria-valuemax={100}
                          >
                            <div
                              className={`h-full rounded-full transition-all ${percent >= 100 ? "bg-[#EF4444]" : percent > 50 ? "bg-[#FFA500]" : percent <= 50 ? "bg-[#22C55E]" : "bg-[#D8DBDF]"}`}
                              style={{ width: `${percent}%` }}
                            />
                          </div>
                          <div className="mt-1 flex justify-between text-xs text-[#597397]">
                            <span className="text-xs">
                              Đã chi:{" "}
                              <span
                                className={`text-xs font-semibold text-[#0046B0] 
                                ${percent >= 100 ? "text-[#EF4444]" : percent > 50 ? "text-[#FFA500]" : percent <= 50 && percent > 0 ? "text-[#22C55E]" : "text-[#3B4D69]"}
                                `}
                              >
                                {formatVietnameseCurrency(spent).replace("₫", "đ")}
                              </span>
                            </span>
                            <span className="text-xs">
                              Còn lại:{" "}
                              <span
                                className={`text-xs font-semibold text-[#0046B0] 
                                ${percent >= 100 ? "text-[#EF4444]" : percent > 50 ? "text-[#FFA500]" : percent <= 50 && percent > 0 ? "text-[#22C55E]" : "text-[#3B4D69]"}
                                `}
                              >
                                {remaining > 0 ? formatVietnameseCurrency(remaining).replace("₫", "đ") : "0đ"}
                              </span>
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}
