"use client";

import React from "react";
import EmptyBudget from "@/components/budget/emptyBudget";
import Header from "@/components/common/header";

const BudgetPage = (): React.ReactElement => {
  return (
    <div>
      <div className="fixed top-0 w-full rounded-2xl">
        <Header showBackButton={false} title="Ngân sách" />
      </div>
      <div className="p-4">
        <EmptyBudget />
      </div>
    </div>
  );
};

export default BudgetPage;
