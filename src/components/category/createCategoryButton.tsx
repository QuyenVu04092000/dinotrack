"use client";
import Image from "next/image";
import images from "@/styles/images/index";
import characters from "@/styles/images/characters";
import { Plus } from "@phosphor-icons/react/dist/ssr";

export function CreateCategoryButton(): JSX.Element {
  return (
    <div
      className="flex flex-row gap-4 items-center justify-start my-2 rounded-xl"
      style={{
        backgroundImage: `url(${images.blueBlurBackground})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
      onClick={() => {
        alert("Thêm mới danh mục");
      }}
    >
      <div className="ml-3">
        <Image className="" src={characters.blueThink} alt="Character waving" width={52} height={52} />
      </div>
      <div className="flex flex-col my-2 gap-1">
        <p className="text-bodyMMedium text-blueGray-700">Chưa có danh mục bạn cần?</p>
        <div className="flex flex-row gap-0.5">
          <Plus size={20} className="text-brandSupport-900" />
          <p className="text-buttonM text-brandSupport-900">Thêm mới danh mục</p>
        </div>
      </div>
    </div>
  );
}
