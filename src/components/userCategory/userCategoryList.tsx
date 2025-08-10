"use client";
import type { IUserCategory } from "@/types/component/category";
import { UserCategoryItem } from "./userCategoryItem";

export function UserCategoryList({ categories }: { categories: IUserCategory[] }): JSX.Element {
  return (
    <div className="flex flex-col items-center justify-center gap-5">
      {categories.map((category) => (
        <UserCategoryItem key={category.code} category={category} />
      ))}
    </div>
  );
}
