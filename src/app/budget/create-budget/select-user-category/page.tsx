"use client";

import Header from "@/components/common/header";
import { UserCategoryList } from "@/components/userCategory/userCategoryList";
import type { IUserCategory } from "@/types/component/category";
import { CreateCategoryButton } from "@/components/category/createCategoryButton";

const categoryItems: IUserCategory[] = [
  {
    id: "1",
    name: "Chi tiêu - Sinh hoạt",
    subCategories: [
      {
        id: "1",
        name: "Ăn uống",
        code: "food",
        icon: "/image/common/icons/categories/food.svg",
      },
      {
        id: "1",
        name: "Di chuyển",
        code: "transportation",
        icon: "/image/common/icons/categories/transportation.svg",
      },
      {
        id: "1",
        name: "Mua sắm",
        code: "shopping",
        icon: "/image/common/icons/categories/shopping.svg",
      },
    ],
  },
  {
    id: "1",
    name: "Chi phí phát sinh",
    subCategories: [
      {
        id: "1",
        name: "Tiệc tùng",
        code: "party",
        icon: "/image/common/icons/categories/party.svg",
      },
      {
        id: "1",
        name: "Quà tặng",
        code: "gift",
        icon: "/image/common/icons/categories/gift.svg",
      },
      {
        id: "1",
        name: "Du lịch",
        code: "travel",
        icon: "/image/common/icons/categories/travel.svg",
      },
    ],
  },
  {
    id: "1",
    name: "Chi phí cố định",
    subCategories: [
      {
        id: "1",
        name: "Tiền nhà",
        code: "housing",
        icon: "/image/common/icons/categories/housing.svg",
      },
      {
        id: "1",
        name: "Hoá đơn",
        code: "invoice",
        icon: "/image/common/icons/categories/invoice.svg",
      },
      {
        id: "1",
        name: "Sức khoẻ",
        code: "hospital",
        icon: "/image/common/icons/categories/hospital.svg",
      },
    ],
  },
  {
    id: "1",
    name: "Đầu tư tiết kiệm",
    subCategories: [
      {
        id: "1",
        name: "Tiết kiệm",
        code: "saving",
        icon: "/image/common/icons/categories/saving.svg",
      },
      {
        id: "1",
        name: "Đầu tư",
        code: "investing",
        icon: "/image/common/icons/categories/investing.svg",
      },
    ],
  },
];

const SelectCategoryPage = (): JSX.Element => {
  return (
    <>
      <div className="fixed top-0 w-full rounded-2xl">
        <Header showBackButton={true} title="Thêm ngân sách" />
      </div>
      <div className="flex flex-col gap-5 mx-4">
        <div className="flex flex-col justify-center items-start">
          <p className="my-4 text-bodyLSemibold text-black">Chọn danh mục muốn tạo ngân sách</p>
          <UserCategoryList categories={categoryItems} />
        </div>
        <CreateCategoryButton />
      </div>
    </>
  );
};

export default SelectCategoryPage;
