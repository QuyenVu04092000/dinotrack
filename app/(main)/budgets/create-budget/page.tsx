"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import { SubCategory } from "app/types/category";
import { useFooter } from "app/context/FooterContext";
import ListCategories from "app/components/budgets/ListCategories";
import CreateBudget from "app/components/budgets/CreateBudget";

function CreateBudgetsContent() {
  const month = useSearchParams().get("month");
  const [category, setCategory] = useState<SubCategory>({} as SubCategory);
  const { setFooterVisible } = useFooter();

  useEffect(() => {
    setFooterVisible(false);
    return () => {
      // Show footer again when leaving this page
      setFooterVisible(true);
    };
  }, [setFooterVisible]);
  return (
    <>
      {!category.id && <ListCategories setCategory={setCategory} />}
      {category.id && <CreateBudget category={category} setCategory={setCategory} month={month} />}
    </>
  );
}

export default function CreateBudgetsPage() {
  return (
    <Suspense fallback={null}>
      <CreateBudgetsContent />
    </Suspense>
  );
}
