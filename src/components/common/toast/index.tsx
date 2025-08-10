// ToastComponent.tsx
import { CommonButton } from "@/components/common/button";
import { Dot, Info, X } from "@phosphor-icons/react/dist/ssr";
import React from "react";
import { toast } from "react-toastify";

export interface IToast {
  title: string;
  description?: string;
  bgColor: "neutral" | "success" | "info" | "warning" | "error";
  focus: "medium" | "high";
  size: "medium" | "large";
  isButton?: boolean;
  btnPrimaryTitle?: string;
  btnSecondaryTitle?: string;
  handlePrimaryBtn?: () => void;
}

const ToastComponent = ({
  title,
  description,
  bgColor,
  focus,
  size,
  btnPrimaryTitle,
  btnSecondaryTitle,
  isButton,
  handlePrimaryBtn,
}: IToast): JSX.Element => {
  const colorClass = {
    neutral:
      focus === "medium"
        ? "bg-shades-0 text-coolGray-1000 border border-coolGray-300"
        : "bg-shades-0 text-coolGray-1000",
    success: focus === "medium" ? "bg-green-100 text-green-1000 border border-green-300" : "bg-green-800 text-shades-0",
    info:
      focus === "medium" ? "bg-shades-0 text-primary-800 border border-primary-300" : "bg-primary-900 text-shades-0",
    warning:
      focus === "medium" ? "bg-yellow-100 text-yellow-1000 border border-yellow-400" : "bg-yellow-800 text-shades-0",
    error: focus === "medium" ? "bg-red-100 text-red-1000 border border-red-300" : "bg-red-800 text-shades-0",
  };

  const iconColor = {
    neutral: "fill-coolGray-1000",
    success: focus === "medium" ? "fill-green-800" : "fill-shades-0",
    info: focus === "medium" ? "fill-primary-800" : "fill-shades-0",
    warning: focus === "medium" ? "fill-yellow-800" : "fill-shades-0",
    error: focus === "medium" ? "fill-red-800" : "fill-shades-0",
  };

  return (
    <div className={`flex w-[500px] justify-between ${colorClass[bgColor]} p-3.5`}>
      <div className="flex w-full gap-[6px]">
        <div className="w-5 h-full">
          <Info
            weight={`${bgColor === "neutral" ? "duotone" : "fill"}`}
            size={20}
            className={` ${iconColor[bgColor]} mr-2`}
          />
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex">
            <p className="text-medium14">{title}</p>
          </div>
          {size === "large" && (
            <>
              <p className="text-regular14">{description}</p>

              {isButton && (
                <div className="flex">
                  <CommonButton
                    title={`${btnPrimaryTitle}`}
                    level={"primary"}
                    typeButton={"neutral"}
                    size={"medium"}
                    handleButton={() => handlePrimaryBtn}
                  />
                  <CommonButton
                    title={`${btnSecondaryTitle}`}
                    level={"tertiary"}
                    typeButton={"neutral"}
                    size={"medium"}
                    handleButton={() => {
                      toast.dismiss();
                    }}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>
      <div className="flex items-start">
        {size === "medium" && isButton && (
          <>
            <p
              className="underline text-regular14 cursor-pointer"
              onClick={() => handlePrimaryBtn}
            >{`${btnPrimaryTitle}`}</p>
            <Dot size={20} />
            <p
              className="underline text-regular14 cursor-pointer pr-2"
              onClick={() => {
                toast.dismiss();
              }}
            >{`${btnSecondaryTitle}`}</p>
          </>
        )}
        <X
          size={100}
          className="m-0 p-0 mt-0.5 mr-2.5 h-5 max-w-5 cursor-pointer"
          onClick={() => {
            toast.dismiss();
          }}
        />
      </div>
    </div>
  );
};

export function showToast(props: IToast): void {
  toast(
    <ToastComponent
      title={props.title}
      description={props.description}
      bgColor={props.bgColor}
      focus={props.focus}
      size={props.size}
      btnPrimaryTitle={props.btnPrimaryTitle}
      btnSecondaryTitle={props.btnSecondaryTitle}
      handlePrimaryBtn={props.handlePrimaryBtn}
    />,
  );
}
