"use client";
import images from "@/styles/images";
import type { IHeaderProps } from "@/types/component/header";
import { CaretLeft } from "@phosphor-icons/react/dist/ssr";
import { useRouter } from "next/navigation";
import React from "react";

const Header: React.FC<IHeaderProps> = ({ showBackButton, title, rightElement }) => {
  const router = useRouter();

  return (
    <header
      className="flex items-end w-full h-full pt-14 pb-2 bg-white rounded-b-3xl"
      style={{
        backgroundImage: `url(${images.headerBackground})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="flex w-full justify-between items-end px-4">
        <div className="flex flex-row gap-2 items-center">
          {showBackButton && (
            <button
              onClick={() => {
                router.back();
              }}
              className="text-white hover:text-gray-500 focus:outline-none"
            >
              <CaretLeft size={24} weight="bold" />
            </button>
          )}
          {title && <p className="text-bodyXLSemibold text-white">{title}</p>}
        </div>

        {rightElement && <div className="flex w-fit">{rightElement}</div>}
      </div>
    </header>
  );
};

export default Header;
