"use client";

import React from "react";
import Image from "next/image";
import { useBudgets } from "app/hooks/useBudgets";
import { useRouter } from "next/navigation";
import { SubCategory } from "app/types/category";
import type { ListCategoriesProps } from "app/types/budgets";

export default function ListCategories({ setCategory }: ListCategoriesProps) {
  // Get current month and date range
  const { categories, categoriesLoading, categoriesError } = useBudgets();
  const router = useRouter();
  return (
    <section aria-label="Trang ngân sách" className="relative flex min-h-screen flex-col bg-white">
      {/* Top Bar */}
      <div className="relative h-[95px] w-full overflow-hidden rounded-b-[20px] bg-[#0046B0]">
        {/* Pattern background */}
        <div className="absolute mix-blend-soft-light w-full h-full">
          <Image src="/images/header.png" alt="" fill className="object-cover" />
        </div>

        {/* Status Bar Placeholder */}
        <div className="absolute right-0 top-0 h-[47px] w-full overflow-hidden">
          {/* Notch placeholder */}
          <div className="absolute left-1/2 top-[-2px] h-[32px] w-[164px] -translate-x-1/2">
            {/* Status bar content would go here */}
          </div>
        </div>

        {/* Header */}
        <div
          className="absolute left-1/2 bottom-2 px-4 flex w-full -translate-x-1/2 items-center justify-between gap-[7px]"
          onClick={() => router.back()}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M15.7959 18.7041C16.0073 18.9154 16.126 19.2021 16.126 19.501C16.126 19.7999 16.0073 20.0865 15.7959 20.2978C15.5846 20.5092 15.2979 20.6279 14.9991 20.6279C14.7002 20.6279 14.4135 20.5092 14.2022 20.2978L6.70219 12.7978C6.59731 12.6933 6.51409 12.5691 6.45731 12.4324C6.40053 12.2956 6.3713 12.149 6.3713 12.001C6.3713 11.8529 6.40053 11.7063 6.45731 11.5696C6.51409 11.4328 6.59731 11.3086 6.70219 11.2041L14.2022 3.7041C14.4135 3.49276 14.7002 3.37402 14.9991 3.37402C15.2979 3.37402 15.5846 3.49276 15.7959 3.7041C16.0073 3.91544 16.126 4.20209 16.126 4.50097C16.126 4.79986 16.0073 5.08651 15.7959 5.29785L9.09375 12L15.7959 18.7041Z"
              fill="white"
            />
          </svg>
          <h1 className="flex-1 shrink-0 text-lg font-semibold leading-[1.5] text-white">Thêm ngân sách</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex w-full flex-col items-start gap-3 px-4 pt-4 h-full bg-[#F8FAFC]">
        <p className="text-base text-[#1F2532] font-semibold">Chọn danh mục muốn tạo ngân sách</p>
        {categories.map((category) => (
          <div key={category.id} className="flex flex-col gap-2 p-3 bg-white w-full rounded-2xl">
            <p className="text-sm text-[#597397] font-semibold">{category.name}</p>
            <div className="flex flex-col gap-2">
              {category.subCategories.map((subCategory) => (
                <div
                  key={subCategory.id}
                  onClick={() => setCategory(subCategory)}
                  className={`flex items-center gap-1  bg-[#F8FAFC] rounded-xl w-full p-2`}
                  aria-label={`${subCategory.name} (chưa chọn được)`}
                >
                  <span aria-hidden="true">{subCategory.icon}</span>
                  <span className="text-sm text-[#3B4D69] font-medium text-center">{subCategory.name}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
