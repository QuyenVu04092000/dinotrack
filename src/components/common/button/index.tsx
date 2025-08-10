import type { ICommonButtonProps } from "@/types/component/common/IButton";

export function SubmitButton({
  disabled,
  content,
  size,
  buttonClass,
  contentClass,
  handleButton,
  isEnable,
  type,
  ...rest
}: ICommonButtonProps): JSX.Element {
  if (!isEnable) {
    buttonClass += " cursor-not-allowed bg-gray-200";
  } else {
    buttonClass += " cursor-pointer bg-brand-400";
  }
  return (
    <>
      <button
        {...rest}
        type={type ?? "button"}
        disabled={!isEnable}
        className={`${buttonClass} ${disabled ? "" : "press-button"}`}
        onClick={handleButton}
      >
        <p className={`${contentClass}`}>{content}</p>
      </button>
    </>
  );
}

export function CommonButton({
  disabled,
  content,
  size,
  buttonClass,
  contentClass,
  handleButton,
  isEnable,
  type,
  startIcon,
  ...rest
}: ICommonButtonProps): JSX.Element {
  if (!isEnable) {
    buttonClass += " cursor-not-allowed bg-gray-200";
  } else {
    buttonClass += " cursor-pointer";
  }
  return (
    <>
      <button
        {...rest}
        type={type ?? "button"}
        disabled={!isEnable}
        className={`${buttonClass} ${disabled ? "" : "press-button"} flex flex-row justify-center items-center rounded-full`}
        onClick={handleButton}
      >
        {startIcon && <div className="pl-3 pr-2">{startIcon}</div>}
        <p className={`${contentClass} pr-3`}>{content}</p>
      </button>
    </>
  );
}
