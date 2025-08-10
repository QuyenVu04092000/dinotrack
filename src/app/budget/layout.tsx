import React from "react";
import NavbarCommon from "@/components/common/navbar";

export default function BudgetLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): JSX.Element {
  return (
    <div className="w-full h-[100vh] overflow-auto">
      <div
        className="w-full h-fit pb-20 pt-24"
        style={{
          minHeight: "calc(100vh - 65px)",
          backgroundColor: "color-gray-50",
        }}
      >
        {children}
      </div>
      <div className="fixed bottom-0 w-full h-fit">
        <NavbarCommon />
      </div>
    </div>
  );
}
