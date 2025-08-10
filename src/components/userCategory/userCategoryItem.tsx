"use client";
import type { IUserCategory } from "@/types/component/category";
import { UserSubCategoryList } from "./userSubCategoryList";

export function UserCategoryItem({ category }: { category: IUserCategory }): JSX.Element {
  return (
    <div className="flex flex-col gap-2 items-start justify-center w-full">
      <p className="text-bodyMSemibold text-blueGray-700">{category.name}</p>
      <UserSubCategoryList subCategories={category.subCategories} />
    </div>
  );
}
