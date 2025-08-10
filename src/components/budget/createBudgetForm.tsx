"use client";
import { useBudgetContext } from "@/components/context/createBudgetContext";
import Image from "next/image";
import { TextInput } from "../common/input/textInput";
import { useRouter } from "next/navigation";
import PageUrls from "@/utilities/enums/pageUrl";
import { PencilSimpleLine } from "@phosphor-icons/react/dist/ssr";

export function CreateBudgetForm(): JSX.Element {
  const router = useRouter();
  const { selectedUserSubCategory } = useBudgetContext();
  if (!selectedUserSubCategory) {
    router.push(PageUrls.BUDGET.SELECT_USER_CATEGORY);
    return <></>;
  }
  return (
    <div className="flex flex-col gap-3 w-full h-full">
      <div className=" flex flex-row justify-start items-center gap-3 bg-pink-100 rounded-xl">
        <div className="flex justify-center items-center ml-2 my-2 bg-white rounded-full w-10 h-10">
          <Image
            className=""
            src={selectedUserSubCategory.icon}
            alt={selectedUserSubCategory.code ?? ""}
            width={24}
            height={24}
          />
        </div>
        <div className="gap-0.5">
          <p className="text-bodySRegular text-blueGray-700">Danh mục:</p>
          <div
            className="flex flex-row justify-between items-center gap-1"
            onClick={() => {
              console.log("click");
            }}
          >
            <p className="text-bodyMSemibold text-blueGray-900">{selectedUserSubCategory.name}</p>
            <PencilSimpleLine size={16} />
          </div>
        </div>
      </div>
      <div className="h-12">
        <TextInput
          type="text"
          inputMode="numeric"
          name="budget"
          placeholder="Nhập số tiền chi tiêu tối đa"
          touchedPlaceholder="0 đ"
          required={true}
        />
      </div>
    </div>
  );
}
