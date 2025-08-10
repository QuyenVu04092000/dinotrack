import type { ILoginRequest } from "@/types/request/authentication";
import { ListSchema } from "@/utilities/enums/schema";
import { useEffect, useState } from "react";
import * as Yup from "yup";

const useLogin = (): {
  isHasChanged: boolean;
  setIsHasChanged: React.Dispatch<React.SetStateAction<boolean>>;
  isLoadingForm: boolean;
  setIsLoadingForm: React.Dispatch<React.SetStateAction<boolean>>;
  isErrorAccount: boolean;
  setIsErrorAccount: React.Dispatch<React.SetStateAction<boolean>>;
  isShowPassword: boolean;
  setIsShowPassword: React.Dispatch<React.SetStateAction<boolean>>;
  initialLoginForm: ILoginRequest;
  validateLoginForm: Yup.ObjectSchema<ILoginRequest>;
} => {
  const [isHasChanged, setIsHasChanged] = useState<boolean>(false);
  const [isLoadingForm, setIsLoadingForm] = useState<boolean>(false);
  const [isErrorAccount, setIsErrorAccount] = useState<boolean>(false);
  const [isShowPassword, setIsShowPassword] = useState<boolean>(false);
  const [initialLoginForm, setInitialLoginForm] = useState<ILoginRequest>({} as ILoginRequest);

  const validateLoginForm = Yup.object().shape({
    phone: Yup.string().required("Số điện thoại không được bỏ trống"),
    password: ListSchema.password.required("Mật khẩu không được bỏ trống"),
  });

  useEffect(() => {
    setInitialLoginForm({
      phone: "",
      password: "",
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
    initialLoginForm,
    validateLoginForm,
  };
};

export default useLogin;
