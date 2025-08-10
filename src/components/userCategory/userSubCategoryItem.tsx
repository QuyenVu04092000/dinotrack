"use client";
import { useRouter } from "next/navigation";
import type { IUserSubCategory } from "@/types/component/category";
import Image from "next/image";
import { useBudgetContext } from "../context/createBudgetContext";
import PageUrls from "@/utilities/enums/pageUrl";

export function UserSubCategoryItem({ subCategory }: { subCategory: IUserSubCategory }): JSX.Element {
  const router = useRouter();
  const { setSelectedUserSubCategory } = useBudgetContext();
  const handleSelectUserSubCategory = (): void => {
    setSelectedUserSubCategory(subCategory);
    router.push(PageUrls.BUDGET.CREATE_BUDGET);
  };
  return (
    <div
      className="flex flex-row justify-between items-center bg-blueGray-100 w-fit h-10 rounded-full"
      onClick={handleSelectUserSubCategory}
    >
      <div className="flex flex-row justify-between items-center p-2 gap-1.5" onClick={() => {}}>
        <Image className="" src={subCategory.icon} alt={subCategory.code ?? ""} width={20} height={20} />
        <p className="text-bodyMMedium text-blueGray-700 flex-grow">{subCategory.name}</p>
      </div>
    </div>
  );
}
