"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { useCreateCategory } from "app/hooks/useCreateCategory";
import { useFooter } from "app/context/FooterContext";

export default function CreateCategoryPage() {
  const { setFooterVisible } = useFooter();
  const {
    categoryName,
    setCategoryName,
    selectedCategoryId,
    setSelectedCategoryId,
    selectedIcon,
    setSelectedIcon,
    isIconPickerOpen,
    setIsIconPickerOpen,
    isFormValid,
    handleConfirm,
    isSubmitting,
    submitError,
    submitSuccess,
    categories,
    iconOptions,
    handleBack,
  } = useCreateCategory();

  // Hide footer on this page
  useEffect(() => {
    setFooterVisible(false);
    return () => {
      // Show footer again when leaving this page
      setFooterVisible(true);
    };
  }, [setFooterVisible]);

  return (
    <section aria-label="Tạo danh mục" className="relative flex min-h-screen flex-col bg-[#F8FAFC]">
      {/* Top Bar */}
      <div className="relative h-[95px] w-full overflow-hidden rounded-b-[20px] bg-[#0046B0]">
        {/* Pattern background */}
        <div className="absolute left-[11.61px] top-[-394.84px] h-[509.668px] w-[347.389px] mix-blend-soft-light opacity-50">
          <Image src="/images/background.png" alt="" fill className="object-cover" />
        </div>

        {/* Status Bar Placeholder */}
        <div className="absolute right-0 top-0 h-[47px] w-full overflow-hidden">
          {/* Notch placeholder */}
          <div className="absolute left-1/2 top-[-2px] h-[32px] w-[164px] -translate-x-1/2">
            {/* Status bar content would go here */}
          </div>
        </div>

        {/* Header */}
        <div className="absolute left-1/2 top-[55px] flex w-full -translate-x-1/2 items-center gap-[7px] px-4">
          {/* Back Button */}
          <button
            type="button"
            onClick={handleBack}
            className="flex shrink-0 items-center justify-center rounded-3xl p-1"
            aria-label="Quay lại"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M15 18L9 12L15 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {/* Title */}
          <h1 className="flex-1 shrink-0 text-lg font-semibold leading-[1.5] text-white">Tạo danh mục</h1>
        </div>
      </div>

      {/* Main Content Card */}
      <div className="relative z-10 mt-[16px] flex mx-3 flex-col gap-6 rounded-2xl bg-white px-3 py-4">
        {/* Icon Section */}
        <div className="relative flex w-full flex-col items-center gap-3">
          <div className="relative flex w-[116px] flex-col items-center">
            {/* Icon Container */}
            <div className="flex items-center rounded-full bg-[#F0FAFF] p-3">
              <div className="flex h-8 w-8 items-center justify-center text-2xl">
                <input
                  type="text"
                  maxLength={2}
                  value={selectedIcon}
                  onChange={(e) => setSelectedIcon(e.target.value)}
                  className="rounded-full text-center text-lg h-8 w-8 bg-white"
                  placeholder=""
                />
              </div>
            </div>

            {/* Edit Icon Button */}
            <button
              type="button"
              onClick={() => setIsIconPickerOpen(!isIconPickerOpen)}
              className="absolute left-[65px] top-[35px] flex items-center justify-center rounded-3xl bg-white p-1 shadow-sm"
              aria-label="Chọn biểu tượng"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M11.3333 2.00001C11.5084 1.82491 11.7163 1.68605 11.9447 1.59128C12.1731 1.49652 12.4173 1.44775 12.6667 1.44775C12.9161 1.44775 13.1603 1.49652 13.3887 1.59128C13.6171 1.68605 13.825 1.82491 14 2.00001C14.1751 2.1751 14.314 2.38305 14.4092 2.61143C14.5045 2.83981 14.5533 3.08401 14.5533 3.33334C14.5533 3.58268 14.5045 3.82688 14.4092 4.05526C14.314 4.28364 14.1751 4.49159 14 4.66668L5.00001 13.6667L1.33334 14.6667L2.33334 11L11.3333 2.00001Z"
                  stroke="#1F2532"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Form Fields */}
        <div className="flex w-full flex-col gap-3">
          {/* Category Name Input */}
          <div className="flex w-full items-center gap-2">
            <label
              htmlFor="categoryName"
              className="shrink-0 whitespace-nowrap text-sm font-medium leading-[1.5] text-black"
            >
              Tên danh mục:
            </label>
            <div className="flex-1 shrink-0">
              <input
                id="categoryName"
                type="text"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                placeholder="Nhập tên danh mục"
                className="w-full rounded-3xl bg-[#F8FAFC] px-3 py-2 text-sm font-semibold leading-6 text-black placeholder:text-[#B6BAC3] focus:outline-none focus:ring-2 focus:ring-[#0046B0]"
              />
            </div>
          </div>

          {/* Parent Category Selection */}
          <div className="flex w-full flex-col gap-2">
            <label className="w-full text-sm font-medium leading-[1.5] text-black">Thuộc danh mục:</label>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => {
                    setSelectedCategoryId(selectedCategoryId === category.id ? null : category.id);
                  }}
                  className={`flex items-center gap-2 rounded-3xl px-3 py-2 text-sm font-medium leading-[1.5] ${
                    selectedCategoryId === category.id ? "bg-[#E0F5FE] text-black" : "bg-[#F0FAFF] text-[#3B4D69]"
                  }`}
                >
                  {category.name}
                  {selectedCategoryId === category.id && (
                    <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 17 17" fill="none">
                      <path
                        d="M8.125 0C6.51803 0 4.94714 0.476523 3.611 1.36931C2.27485 2.2621 1.23344 3.53105 0.618482 5.0157C0.00352044 6.50035 -0.157382 8.13401 0.156123 9.71011C0.469628 11.2862 1.24346 12.7339 2.37976 13.8702C3.51606 15.0065 4.9638 15.7804 6.5399 16.0939C8.11599 16.4074 9.74966 16.2465 11.2343 15.6315C12.719 15.0166 13.9879 13.9752 14.8807 12.639C15.7735 11.3029 16.25 9.73197 16.25 8.125C16.2477 5.97081 15.391 3.90551 13.8677 2.38227C12.3445 0.85903 10.2792 0.00227486 8.125 0ZM11.6922 6.69219L7.31719 11.0672C7.25915 11.1253 7.19022 11.1714 7.11434 11.2029C7.03847 11.2343 6.95714 11.2505 6.875 11.2505C6.79287 11.2505 6.71154 11.2343 6.63567 11.2029C6.55979 11.1714 6.49086 11.1253 6.43282 11.0672L4.55782 9.19219C4.44054 9.07491 4.37466 8.91585 4.37466 8.75C4.37466 8.58415 4.44054 8.42509 4.55782 8.30781C4.67509 8.19054 4.83415 8.12465 5 8.12465C5.16586 8.12465 5.32492 8.19054 5.44219 8.30781L6.875 9.74141L10.8078 5.80781C10.8659 5.74974 10.9348 5.70368 11.0107 5.67225C11.0866 5.64083 11.1679 5.62465 11.25 5.62465C11.3321 5.62465 11.4134 5.64083 11.4893 5.67225C11.5652 5.70368 11.6341 5.74974 11.6922 5.80781C11.7503 5.86588 11.7963 5.93482 11.8277 6.01069C11.8592 6.08656 11.8754 6.16788 11.8754 6.25C11.8754 6.33212 11.8592 6.41344 11.8277 6.48931C11.7963 6.56518 11.7503 6.63412 11.6922 6.69219Z"
                        fill="#0EA5E9"
                      />
                    </svg>
                  )}
                </button>
              ))}
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
              <p className="text-sm text-green-600">Đã tạo danh mục thành công!</p>
            </div>
          )}
        </div>

        {/* Bottom Button */}
        <div className="fixed bottom-0 left-0 right-0 z-20 px-4 pb-[21px] pt-0">
          <button
            type="button"
            onClick={handleConfirm}
            disabled={!isFormValid || isSubmitting}
            className={`w-full rounded-3xl px-4 py-3 text-base font-semibold leading-6 ${
              isFormValid && !isSubmitting
                ? "bg-[#0046B0] text-white"
                : "bg-[#D8DBDF] text-[#8E95A2] cursor-not-allowed"
            }`}
          >
            {isSubmitting ? "Đang tạo..." : "Xác nhận"}
          </button>
        </div>
      </div>

      {/* Icon Picker Modal (Bottom Sheet) */}
      {isIconPickerOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/40"
          onClick={() => setIsIconPickerOpen(false)}
        >
          <div
            className="w-full max-w-sm rounded-t-3xl bg-white px-4 pt-2 pb-6 shadow-[0_-8px_24px_rgba(15,23,42,0.35)] flex flex-col max-h-[85vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-200 py-3">
              <div className="w-6" />
              <p className="text-lg font-semibold text-slate-900">Chọn biểu tượng</p>
              <button
                type="button"
                onClick={() => setIsIconPickerOpen(false)}
                aria-label="Đóng"
                className="flex h-6 w-6 items-center justify-center rounded-full text-slate-700 hover:bg-slate-100"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M18 6L6 18M6 6L18 18"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>

            {/* Icon Grid */}
            <div className="pt-3 flex-1 overflow-y-auto pb-4">
              <div className="flex flex-wrap items-center justify-center gap-3 px-2">
                {iconOptions.map((icon) => (
                  <button
                    key={icon}
                    type="button"
                    onClick={() => {
                      setSelectedIcon(icon);
                      setIsIconPickerOpen(false);
                    }}
                    className={`flex h-7 w-7 items-center justify-center text-2xl transition-colors ${
                      selectedIcon === icon
                        ? "rounded-full bg-[#0046B0]/10 ring-2 ring-[#0046B0]"
                        : "hover:bg-slate-100 rounded-full"
                    }`}
                    aria-label={`Chọn biểu tượng ${icon}`}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
