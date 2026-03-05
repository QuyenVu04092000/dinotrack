"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { useCreateBudget } from "app/hooks/useCreateBudget";
import { SubCategory } from "app/types/category";
import { imagePath } from "app/utilities/constants/common/assets";
import { useFooter } from "app/context/FooterContext";
import type { CreateBudgetProps } from "app/types/budgets";

export default function CreateBudget({ category, setCategory }: CreateBudgetProps) {
  const { setFooterVisible } = useFooter();
  const {
    amountValue,
    isFormValid,
    isSubmitting,
    submitError,
    submitSuccess,
    handleBack,
    handleAmountChange,
    handleSubmit,
  } = useCreateBudget({ category, setCategory });

  // Hide footer on this page
  useEffect(() => {
    setFooterVisible(false);
    return () => {
      // Show footer again when leaving this page
      setFooterVisible(true);
    };
  }, [setFooterVisible]);
  return (
    <section aria-label="Tạo ngân sách" className="relative flex min-h-screen flex-col bg-[#F8FAFC]">
      {/* Top Bar */}
      <div className="relative h-[95px] w-full overflow-hidden rounded-b-[20px] bg-[#0046B0]">
        {/* Pattern background */}
        <div className="absolute h-full w-full mix-blend-soft-light">
          <Image src={imagePath("/images/header.png")} alt="" fill className="object-cover" />
        </div>

        {/* Status Bar Placeholder */}
        <div className="absolute right-0 top-0 h-[47px] w-full overflow-hidden">
          <div className="absolute left-1/2 top-[-2px] h-[32px] w-[164px] -translate-x-1/2" />
        </div>

        {/* Header */}
        <div className="absolute left-1/2 bottom-2 flex w-full -translate-x-1/2 items-center justify-between gap-[7px] px-4">
          <button
            type="button"
            onClick={handleBack}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10"
            aria-label="Quay lại"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M15 18L9 12L15 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <h1 className="flex-1 text-center text-lg font-semibold leading-[1.5] text-white">Tạo ngân sách</h1>

          <div className="h-9 w-9" aria-hidden="true" />
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-1 flex-col gap-4 pb-24">
        {" "}
        {/* Form */}
        <form
          id="budget-form"
          onSubmit={handleSubmit}
          className="flex flex-1 flex-col gap-4 rounded-2xl bg-white px-4 py-4 shadow-sm"
        >
          {/* Category row */}
          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium text-[#111827]">Đặt hạn mức chi tiêu</p>
            <button
              type="button"
              className="flex items-center justify-between rounded-3xl bg-[#FCE7F1] px-3 py-2"
              aria-label="Chọn danh mục ngân sách (chưa khả dụng)"
              disabled
            >
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-sm">
                  <span className="text-lg" aria-hidden="true">
                    {category.icon}
                  </span>
                </div>
                <div>
                  <p className="text-xs text-[#3B4D69] font-normal">Danh mục:</p>
                  <span className="text-sm font-semibold text-[#111827]">{category.name}</span>
                </div>
              </div>
            </button>
          </div>

          {/* Amount row */}
          <div className="mt-2 flex flex-col gap-2">
            <div className="flex items-center rounded-3xl bg-[#F8FAFC] px-3 py-2">
              <input
                type="text"
                inputMode="numeric"
                name="amount"
                value={amountValue}
                onChange={handleAmountChange}
                placeholder="Nhập số tiền chi tiêu tối đa"
                className="w-full bg-transparent text-base font-semibold text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none"
                aria-label="Số tiền ngân sách"
                disabled={isSubmitting}
              />
            </div>
          </div>

          {/* Error Message */}
          {submitError && (
            <div className="w-full rounded-2xl bg-red-50 px-3 py-2">
              <p className="text-sm text-red-600">{submitError}</p>
            </div>
          )}

          {/* Success Message */}
          {submitSuccess && (
            <div className="w-full rounded-2xl bg-green-50 px-3 py-2">
              <p className="text-sm text-green-600">Đã tạo ngân sách thành công!</p>
            </div>
          )}
        </form>
      </div>

      {/* Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-white via-white/95 to-white/60 px-4 pb-5 pt-2">
        <button
          type="submit"
          form="budget-form"
          disabled={!isFormValid || isSubmitting}
          className={`w-full rounded-3xl px-4 py-3 text-base font-semibold ${
            isFormValid && !isSubmitting
              ? "bg-[#9CF526] text-[#1F2532]"
              : "cursor-not-allowed bg-[#D8DBDF] text-[#8E95A2]"
          }`}
          aria-label="Tạo ngân sách"
        >
          {isSubmitting ? "Đang tạo..." : "Tạo ngân sách"}
        </button>
      </div>
    </section>
  );
}
