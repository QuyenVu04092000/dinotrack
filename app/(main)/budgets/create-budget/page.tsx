"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useBudgets } from "app/hooks/useBudgets";
import { useRouter } from "next/navigation";

import { SubCategory } from "app/types/category";
import { useFooter } from "app/context/FooterContext";
import ListCategories from "app/components/budgets/ListCategories";
import CreateBudget from "app/components/budgets/CreateBudget";

export default function CreateBudgetsPage() {
  // Get current month and date range
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
      {category.id && <CreateBudget category={category} setCategory={setCategory} />}
    </>
  );
}
