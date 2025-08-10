"use client";

import { CreateBudgetForm } from "@/components/budget/createBudgetForm";
import Header from "@/components/common/header";

const CreateBudgetPage = (): JSX.Element => {
  return (
    <>
      <div className="fixed top-0 w-full rounded-2xl">
        <Header showBackButton={true} title="Thêm ngân sách" />
      </div>

      <div className="flex flex-col mx-4 mt-3 gap-3">
        <p className="text-bodyLSemibold text-black">Đặt hạn mức chi tiêu</p>
        <CreateBudgetForm />
      </div>
    </>
  );
};

export default CreateBudgetPage;
