import type { ITextFormInputField, ITextInput } from "@/types/component/common/IInput";
import { useField } from "formik";
import { useState } from "react";

export function TextInput(props: ITextInput): JSX.Element {
  const { isViewMode, title, name, type, inputMode, touchedPlaceholder, placeholder, value, defaultValue, required } =
    props;
  const { handleChange, isError } = props;
  const [touched, setTouched] = useState(false);
  const handleFocus = (e: React.FocusEvent<HTMLInputElement>): void => {
    setTouched(true);
    if (e.target.value === "0") {
      e.target.value = "";
    }
  };
  const handleBlur = (): void => {
    setTouched(false);
  };

  return (
    <>
      {isViewMode ? (
        <>
          {title && (
            <p className="text-regular14 text-coolGray-1000">
              {title} {required && <span className="text-red-800">*</span>}
            </p>
          )}
          <p className="text-medium14 text-coolGray-1200">{defaultValue}</p>
        </>
      ) : (
        <>
          {title && (
            <label htmlFor={name} className="font-medium text-neutral text-medium14">
              {title}
            </label>
          )}
          <input
            {...props}
            type={type}
            inputMode={inputMode}
            className={`py-2 mt-[5px] mb-2 w-full h-full px-3 flex bg-blueGray-50 placeholder:text-coolGray-700 text-coolGray-1200 transition-all duration-300 ${isError ? "error" : ""} rounded-full focus:outline focus:outline-1 focus:outline-primary-1000`}
            name={name}
            placeholder={touched && touchedPlaceholder ? touchedPlaceholder : placeholder}
            id={name}
            value={value}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
          ></input>
          {isError && <p className="text-regular12 error-message">Thông tin này là bắt buộc</p>}
        </>
      )}
      {isError && <p className="text-regular12 error-message">Thông tin này là bắt buộc</p>}
    </>
  );
}

export function TextFormInput(props: ITextFormInputField): JSX.Element {
  const { placeholder, error, isViewMode, required, title, ...rest } = props;
  const [field, meta, helpers] = useField(props.name);
  const { value } = field;
  const { setValue } = helpers;

  return (
    <>
      {isViewMode ? (
        <>
          {title && (
            <p className="text-bodyMMedium text-gray-950">
              {title} {required && <span className="text-red-800">*</span>}
            </p>
          )}
          <p className="text-bodyMMedium text-black">{value}</p>
        </>
      ) : (
        <>
          {title && (
            <label htmlFor={rest.name} className="font-medium text-neutral text-medium14 text-coolGray-1200">
              {title} {required && <span className="text-red-800">*</span>}
            </label>
          )}
          <input
            {...rest}
            type={rest.type}
            name={rest.name}
            id={rest.name}
            placeholder={placeholder}
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              props.handleChange?.(e.target.value);
            }}
            onFocus={() => {
              if (rest.type === "password") {
                setValue("");
              }
            }}
            className={`p-[12px] ${meta.touched && meta.error ? "error" : ""} flex bg-blueGray-50 placeholder:text-gray-300 placeholder:text-inputTextL text-inputTextBoldL text-blueGray-950 transition-all duration-300 rounded-3xl focus:outline focus:outline-1 focus:outline-primary-1000 w-full`}
          />
          {error ? (
            <div className="pl-3 text-bodySMedium text-red-500">{error}</div>
          ) : meta.touched && meta.error ? (
            <div className="pl-3 text-bodySMedium text-red-500">{meta.error}</div>
          ) : null}
        </>
      )}
      {value?.lenght > props.length ?? (meta.touched && meta.error) ? (
        <div className="pl-3 text-bodySMedium text-red-500">{meta.error}</div>
      ) : null}
    </>
  );
}
