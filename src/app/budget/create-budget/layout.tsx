import { BudgetProvider } from "@/components/context/createBudgetContext";
import React from "react";

export default function CreateBudgetLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): JSX.Element {
  return (
    <>
      <BudgetProvider>{children}</BudgetProvider>
    </>
  );
}
