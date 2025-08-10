import type {
  IOptionSingleChoiceDropdownInput,
  IOptionSingleChoiceDropdownInputProps,
  IDropdownItem,
} from "@/types/component/common/IInput";
import type { ComponentPropsWithoutRef } from "react";

export interface ICommonButtonProps extends Omit<ComponentPropsWithoutRef<"button">, "onClick"> {
  level: "primary" | "secondary" | "tertiary" | "outlined";
  typeButton: "primary" | "neutral" | "danger" | "excel";
  size: "small" | "medium" | "large" | "full-width";
  title?: string;
  startIcon?: React.ReactElement | string;
  endIcon?: React.ReactElement | string;
  isIconOnly?: boolean;
  buttonClass?: string;
  contentClass?: string;
  isEnable?: boolean;
  handleButton?: () => any;
}

export interface IMultipleActionButtonProps extends ICommonButtonProps {
  dropdownProps: {
    options: IOptionSingleChoiceDropdownInput[];
    onChange?: (value: string) => void;
    value?: string;
    subTitle?: string;
    dropdownItemProps?: Omit<IDropdownItem, "title" | "check" | "secondaryText" | "value" | "onClick">;
    onChangeSearch?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    defaultValue?: string;
  };
}

export interface IBackTitleButtonProps {
  title: string;
  onClick?: () => void;
}

export interface IButtonDropdownProps extends ICommonButtonProps {
  dataOption: IOptionSingleChoiceDropdownInputProps[];
}
