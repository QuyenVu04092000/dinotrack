import React from "react";
import NavbarCommon from "@/components/common/navbar";

export default function TransactionLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): JSX.Element {
  return (
    <div className="w-full h-[100vh] overflow-auto">
      <div
        className="w-full h-fit bg-local pb-20 bg-yellow-200"
        style={{
          minHeight: "calc(100vh - 65px)",
          backgroundColor: "color-gray-50",
        }}
      >
        {children}
      </div>
      <div className="fixed bottom-0 w-full h-fit rounded-2xl">
        <NavbarCommon />
      </div>
    </div>
  );
}
