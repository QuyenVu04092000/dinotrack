"use client";
import { useRouter } from "next/navigation";
import type { IItemNavbarProps } from "@/types/component/navbar";
import blur from "@/styles/images/blur";

interface ItemNavbarProps {
  content: IItemNavbarProps;
  active: boolean;
  onSliding?: boolean;
  onClick?: () => void;
}

export function NavbarItem(props: ItemNavbarProps): JSX.Element {
  const { content, active } = props;
  const router = useRouter();
  let textClassName = "text-[#597397] text-bodySMedium";
  let icon = content.icon;
  let blurStyle = {};
  if (active) {
    textClassName = "text-brandSupport-900 text-bodySSemibold";
    icon = content.iconFill;
    blurStyle = {
      backgroundImage: `url(${blur.blurBrand400})`,
      backgroundRepeat: "no-repeat",
      backgroundSize: "contain",
      backgroundPosition: "center",
    };
  }

  return (
    <div
      className="pb-5 cursor-pointer press-button"
      onClick={() => {
        router.push(content.href);
      }}
    >
      {content.icon && content.title ? (
        <div className={`flex flex-col justify-center items-center gap-1 py-2`} style={blurStyle}>
          <div className={`${textClassName}`}>{icon}</div>
          <p className={`${textClassName}`}>{content.title}</p>
        </div>
      ) : (
        <div className={`${textClassName} py-4`} style={blurStyle}>
          {icon}
        </div>
      )}
    </div>
  );
}
