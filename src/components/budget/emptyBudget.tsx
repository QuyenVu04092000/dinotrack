"use client";
import { Plus } from "@phosphor-icons/react/dist/ssr";
import characters from "@/styles/images/characters";
import Image from "next/image";
import { CommonButton } from "@/components/common/button";
import PageUrls from "@/utilities/enums/pageUrl";

const EmptyBudget = (): JSX.Element => {
  const thisMonth = new Date().getMonth();
  const startOfMonth = new Date(new Date().getFullYear(), thisMonth, 1).getDate();
  const endOfMonth = new Date(new Date().getFullYear(), thisMonth + 1, 0).getDate();
  // const monthDuration =

  return (
    <div className="flex flex-col gap-3">
      <div className="text-bodyMSemibold text-[#597397]">
        Tháng {thisMonth} ({startOfMonth}/{thisMonth} - {endOfMonth}/{thisMonth})
      </div>
      <div className="flex flex-col gap-4 justify-center items-center">
        <div className="flex flex-col gap-2 justify-center items-center">
          <div>
            <Image className="" src={characters.whiteFind} alt="Character waving" width={80} height={77} />
          </div>
          <div className="text-bodyMSemibold text-black">Bạn chưa tạo ngân sách</div>
          <div className="text-bodySRegular text-[#597397] text-center">
            Hãy bắt đầu quản lý chi tiêu bằng cách tạo ngân sách cho các loại chi tiêu của mình
          </div>
        </div>
        <div className="">
          <CommonButton
            content={"Thêm mới ngân sách"}
            contentClass="text-buttonM"
            level={"primary"}
            typeButton={"primary"}
            size="medium"
            isEnable={true}
            startIcon={<Plus size={20} weight="thin" />}
            handleButton={() => {
              window.location.href = PageUrls.BUDGET.SELECT_USER_CATEGORY;
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default EmptyBudget;
