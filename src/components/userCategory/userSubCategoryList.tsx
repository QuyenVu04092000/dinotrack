"use client";
import type { IUserSubCategory } from "@/types/component/category";
import { UserSubCategoryItem } from "@/components/userCategory/userSubCategoryItem";

export function UserSubCategoryList({ subCategories }: { subCategories: IUserSubCategory[] }): JSX.Element {
  return (
    <div className="flex flex-row flex-wrap justify-start items-center w-fit gap-2">
      {subCategories.map((subCategory) => (
        <UserSubCategoryItem key={subCategory.code} subCategory={subCategory} />
      ))}
    </div>
  );
}
