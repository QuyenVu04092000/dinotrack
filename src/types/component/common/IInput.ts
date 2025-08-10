import type { ITable } from "@/types/component/common/ITable";
import type { INode } from "@/types/component/common/ITreeData";
import type { FieldAttributes } from "formik";
import type { ComponentPropsWithoutRef } from "react";
import type { NumericFormatProps } from "react-number-format/types/types";

export interface ITextInput
  extends Omit<React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>, "handleChange"> {
  title?: string;
  name?: string;
  handleChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  touchedPlaceholder?: string;
  isError?: boolean;
  isViewMode?: boolean;
}

export interface ITextFormInputField extends FieldAttributes<any> {
  // id?: string;
  isViewMode?: boolean;
  placeholder?: string;
  required?: boolean;
  title?: string;
  error?: string;
}

export interface ITextAreaInput
  extends Omit<
    React.DetailedHTMLProps<React.TextareaHTMLAttributes<HTMLTextAreaElement>, HTMLTextAreaElement>,
    "handleChange" | "value" | "onChange" | "defaultValue"
  > {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  className?: string;
  defaultValue?: string;
  rows?: number;
  cols?: number;
  delay?: number;
}

export interface ITextAreaFormInput
  extends Omit<
    React.DetailedHTMLProps<React.TextareaHTMLAttributes<HTMLTextAreaElement>, HTMLTextAreaElement>,
    "handleChange" | "value" | "onChange" | "defaultValue"
  > {
  name: string;
  title?: string;
  isViewMode?: boolean;
  required?: boolean;
  placeholder?: string;
  className?: string;
  rows?: number;
  cols?: number;
  delay?: number;
  handleChange?: (value: string) => void;
  defaultValue?: string;
}

export interface ITextSearchInput extends Omit<ComponentPropsWithoutRef<"input">, "onChange" | "autoFocus" | "size"> {
  placeholder: string;
  delay?: number;
  value?: string;
  onTextChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  autoFocus?: boolean;
  size?: "small" | "medium";
}

export interface ICheckboxProps extends Omit<ComponentPropsWithoutRef<"div">, "content"> {
  content?: React.ReactNode;
  value?: any;
  size?: "xs" | "sm" | "md" | "lg";
  intermediate?: boolean;
  checked?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  error?: boolean;
}

export interface IOptionDropdownTreeItemProps {
  checkIntermediate?: (value: IOptionDropdownTreeInput) => boolean;
  active?: boolean;
  content: IOptionDropdownTreeInput;
  selectedOption: IOptionDropdownTreeInput[];
  activeParentList: IOptionDropdownTreeInput[];
  setActiveParentList: React.Dispatch<React.SetStateAction<IOptionDropdownTreeInput[]>>;
  onChange?: (value: IOptionDropdownTreeInput, check?: boolean) => void;
  onOpen?: () => void;
  isChecked?: boolean;
}

export interface ISingleChoiceDropdownTreeItemProps {
  active?: boolean;
  content: INode;
  selectedOption: INode;
  activeParentList: INode[];
  setActiveParentList: React.Dispatch<React.SetStateAction<INode[]>>;
  onChange: (value: INode) => void;
  onOpen?: () => void;
}

export interface IDropdownInputProps
  extends Omit<ComponentPropsWithoutRef<"button">, "onChange" | "value" | "placeholder" | "defaultValue"> {
  placeholder: string;
  dataOption: IOptionDropdownTreeInput[];
  onChange?: (value: IOptionDropdownTreeInput[], title?: string) => void;
  onChangeSearch?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onClean?: boolean;
  value?: IOptionDropdownTreeInput[];
  isSelectAll?: boolean;
  isClean?: boolean;
  onSort?: (isSorted: boolean) => void;
  typeShowOptionSelectedTitle?: "summary" | "listed";
  defaultValue?: IOptionDropdownTreeInput[];
  zIndex?: number;
}

export interface IDropdownTreeFormInputProps
  extends Omit<ComponentPropsWithoutRef<"button">, "onChange" | "value" | "placeholder"> {
  placeholder: string;
  name: string;
  dataOption: IOptionDropdownTreeInput[];
  onChange?: (value: IOptionDropdownTreeInput[], title?: string) => void;
  onChangeSearch?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onClean?: boolean;
  value?: IOptionDropdownTreeItemProps;
  isSelectAll?: boolean;
  isClean?: boolean;
  onSort?: (isSorted: boolean) => void;
}

export interface ISingleChoiceDropdownTreeFormInputProps
  extends Omit<ComponentPropsWithoutRef<"button">, "onChange" | "value" | "placeholder" | "defaultValue"> {
  placeholder: string;
  name: string;
  dataOption: INode[];
  onChange?: (value: INode, title?: string) => void;
  onChangeSearch?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onClean?: boolean;
  isClean?: boolean;
  defaultValue?: INode;
  onSort?: (isSorted: boolean) => void;
  zIndex?: number;
  isViewMode?: boolean;
}

export interface IOptionDropdownTreeInput {
  id: string;
  parentId?: string;
  level: number;
  title: string;
  value: any;
  children?: IOptionDropdownTreeInput[];
  type?: string;
}

export interface IOptionDropdownSelectDataProps extends IOptionDropdownTreeInput {
  subTitle?: string;
  handleAction?: () => void;
}

export interface IOptionDropdownSelect extends IOptionDropdownTreeInput {
  subTitle?: string;
}

export interface ISelectOptionProps extends Omit<IDropdownInputProps, "dataOption" | "defaultValue"> {
  width?: string;
  readonly?: boolean;
  handleOnClick?: () => void;
  dataOption: IOptionDropdownSelectDataProps[];
  isFullHeight?: boolean;
}

export interface IPositionStyleSelect {
  top?: string | number;
  left?: string | number;
  right?: string | number;
  bottom?: string | number;
}

export interface IRadioBoxProps {
  content?: React.ReactNode;
  size?: "xs" | "md" | "lg" | "default";
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  checked?: boolean;
  disabled?: boolean;
  error?: boolean;
  [key: string]: any; // Allows for additional props
}
export interface IDropdownItem {
  navLevel?: "parent" | "child";
  size: "default" | "small";
  title: string;
  secondaryText?: string;
  check?: boolean;
  leadIcon?: React.ReactNode;
  tailIcon?: React.ReactNode;
  checkbox?: boolean;
  value: any;
  onClick?: (value: any) => void;
}

export interface IOptionSingleChoiceDropdownInput {
  value: string;
  title: string;
  subTitle?: string;
  dropdownItemProps?: Omit<IDropdownItem, "title" | "check" | "secondaryText" | "value">;
  renderDropdownItem?: (isSelected: boolean, optionSelected: string | undefined) => React.ReactNode;
  subContent?: any;
}

export interface IOptionSingleChoiceDropdownInputProps extends IOptionSingleChoiceDropdownInput {
  handleOnClickItem: () => void;
}

export interface IExtendDropdownFrame {
  renderExtendFrame?: (props: { optionSelected?: string; textSearch?: string | null }) => React.ReactNode;
  position: "top" | "bottom";
}

export interface ISingleChoiceDropdownInputProps
  extends Omit<ComponentPropsWithoutRef<"button">, "onChange" | "value" | "defaultValue"> {
  title?: string;
  options: IOptionSingleChoiceDropdownInput[];
  onChange?: (value: string, fullValue?: IOptionSingleChoiceDropdownInput) => void;
  size?: "default" | "small" | "xSmall";
  value?: string;
  subTitle?: string;
  dropdownItemProps?: Omit<IDropdownItem, "title" | "check" | "secondaryText" | "value" | "onClick">;
  placeholder?: string;
  onChangeSearch?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  defaultValue?: string;
  extendFrame?: IExtendDropdownFrame[];
  renderGeneralDropdownItem?: (params: {
    option: IOptionSingleChoiceDropdownInput;
    handleClickOption: (value: string) => void;
  }) => React.ReactNode;
  referenceChildren?: Array<React.RefObject<HTMLDivElement>>;
  isViewMode?: boolean;
  zIndex?: number;
  required?: boolean;
  renderTitleSelected?: (fullValue?: IOptionSingleChoiceDropdownInput) => React.ReactNode;
}

export interface ISingleChoiceDropdownFormInputProps extends ISingleChoiceDropdownInputProps {
  name: string;
}

export interface IBulkActionDropdownInputProps extends Omit<ISingleChoiceDropdownInputProps, "placeholder"> {
  renderTitleValueDropdown?: () => React.ReactNode;
}

export interface IDropdownTableInputProps<IRecordType = any>
  extends Omit<ComponentPropsWithoutRef<"button">, "onChange" | "value" | "placeholder"> {
  placeholder: string;
  tableProps: Omit<ITable<IRecordType>, "onRowClick">;
  onChange: (value: any) => void;
  onChangeSearch?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  renderSelectedValue: (value: IRecordType) => React.ReactNode;
  onTextChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  size: "small" | "medium";
  placeholderTextSearch?: string;
}

export interface IMarkdownInputProps {
  name: string;
  initialValue?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  title?: string;
  isViewMode?: boolean;
}

export interface INumberInputProps extends Omit<NumericFormatProps, "onValueChange" | "value"> {
  value: number;
  onValueChange?: (value: number) => void;
  isViewMode?: boolean;
  title?: string;
  required?: boolean;
  isError?: boolean;
  isTouched?: boolean;
}

export interface INumberFormInputProps extends Omit<INumberInputProps, "value"> {
  name: string;
}
