import type { IRegisterRequest } from "@/types/request/authentication";
import { ListSchema } from "@/utilities/enums/schema";
import { useEffect, useState } from "react";
import * as Yup from "yup";

const useRegister = (): {
  isHasChanged: boolean;
  setIsHasChanged: React.Dispatch<React.SetStateAction<boolean>>;
  isLoadingForm: boolean;
  setIsLoadingForm: React.Dispatch<React.SetStateAction<boolean>>;
  isErrorAccount: boolean;
  setIsErrorAccount: React.Dispatch<React.SetStateAction<boolean>>;
  isShowPassword: boolean;
  setIsShowPassword: React.Dispatch<React.SetStateAction<boolean>>;
  isShowConfirmPassword: boolean;
  setIsShowConfirmPassword: React.Dispatch<React.SetStateAction<boolean>>;
  isMatchPassword: boolean;
  setIsMatchPassword: React.Dispatch<React.SetStateAction<boolean>>;
  initialRegisterForm: IRegisterRequest;
  validateRegisterForm: Yup.ObjectSchema<IRegisterRequest>;
} => {
  const [isHasChanged, setIsHasChanged] = useState<boolean>(false);
  const [isLoadingForm, setIsLoadingForm] = useState<boolean>(false);
  const [isErrorAccount, setIsErrorAccount] = useState<boolean>(false);
  const [isShowPassword, setIsShowPassword] = useState<boolean>(false);
  const [isShowConfirmPassword, setIsShowConfirmPassword] = useState<boolean>(false);
  const [isMatchPassword, setIsMatchPassword] = useState<boolean>(true);
  const [initialRegisterForm, setInitialRegisterForm] = useState<IRegisterRequest>({} as IRegisterRequest);

  const validateRegisterForm = Yup.object().shape({
    phone: Yup.string().required("Số điện thoại không được bỏ trống"),
    password: ListSchema.password.required("Mật khẩu không được bỏ trống"),
    confirmPassword: ListSchema.confirmPassword.required("Nhập lại mật khẩu"),
  });

  useEffect(() => {
    setInitialRegisterForm({
      phone: "",
      password: "",
      confirmPassword: "",
    });
  }, []);

  return {
    isHasChanged,
    setIsHasChanged,
    isLoadingForm,
    setIsLoadingForm,
    isErrorAccount,
    setIsErrorAccount,
    isShowPassword,
    setIsShowPassword,
    isShowConfirmPassword,
    setIsShowConfirmPassword,
    isMatchPassword,
    setIsMatchPassword,
    initialRegisterForm,
    validateRegisterForm,
  };
};

export default useRegister;
