"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import type { IUserSubCategory, IUserCategory } from "@/types/component/category";

interface IBudgetContext {
  selectedUserCategory: IUserCategory | null;
  setSelectedUserCategory: React.Dispatch<React.SetStateAction<IUserCategory | null>>;
  selectedUserSubCategory: IUserSubCategory | null;
  setSelectedUserSubCategory: React.Dispatch<React.SetStateAction<IUserSubCategory | null>>;
  budgetAmount: number | null;
  setBudgetAmount: React.Dispatch<React.SetStateAction<number | null>>;
}

const BudgetContext = createContext<IBudgetContext | undefined>(undefined);

export function BudgetProvider({ children }: { children: React.ReactNode }): JSX.Element {
  const [selectedUserCategory, setSelectedUserCategory] = useState<IUserCategory | null>(null);
  const [selectedUserSubCategory, setSelectedUserSubCategory] = useState<IUserSubCategory | null>(null);
  const [budgetAmount, setBudgetAmount] = useState<number | null>(null);

  useEffect(() => {
    console.log("select r ne", selectedUserSubCategory);
  }, [selectedUserSubCategory]);
  return (
    <BudgetContext.Provider
      value={{
        selectedUserCategory,
        setSelectedUserCategory,
        selectedUserSubCategory,
        setSelectedUserSubCategory,
        budgetAmount,
        setBudgetAmount,
      }}
    >
      {children}
    </BudgetContext.Provider>
  );
}

export function useBudgetContext(): IBudgetContext {
  const context = useContext(BudgetContext);
  if (!context) {
    throw new Error("useBudgetContext must be used within a BudgetProvider");
  }
  return context;
}
