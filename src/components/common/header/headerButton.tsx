"use client";
import type { IHeaderButtonProps } from "@/types/component/header";

export function HeaderButton(props: IHeaderButtonProps): JSX.Element {
  const { icon, title } = props.content;

  return (
    <div className="flex flex-row justify-center items-center pl-2 pr-3 py-1 bg-white rounded-l-full rounded-r-full">
      {icon && <div className="pr-2 text-[#3B4D69]">{icon}</div>}
      {title && <p className="text-buttonM text-[#3B4D69]">{title}</p>}
    </div>
  );
}
