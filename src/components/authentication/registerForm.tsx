import React, { useEffect } from "react";
import useRegister from "@/hooks/authentication/useRegister";
import { Form, Formik } from "formik";
import axios from "axios";
// import type { IBaseResponse } from "@/types/response/common/IBaseResponse";
// import type { IRegisterResponse } from "@/types/response/authentication";
import { EyeSlash, Eye } from "@phosphor-icons/react/dist/ssr";
import userStorage from "@/stores/userLocalStorage";
import PageUrls from "@/utilities/enums/pageUrl";
// import { Endpoints, BASE_URL_API_V1 } from "@/utilities/constants/common/endpoints";
// import { showToast } from "../common/toast";
import { TextFormInput } from "../common/input/textInput";
import { SubmitButton } from "../common/button";
import Link from "next/link";

const RegisterForm = (): JSX.Element => {
  const {
    isHasChanged,
    setIsHasChanged,
    // isLoadingForm,
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
  } = useRegister();

  return (
    <Formik
      initialValues={initialRegisterForm}
      enableReinitialize
      validationSchema={validateRegisterForm}
      onSubmit={async (values) => {
        if (isHasChanged) {
          setIsLoadingForm(true);
          try {
            // const responseRegister = await axios.post<IBaseResponse<IRegisterResponse>>(
            //   BASE_URL_API_V1 + Endpoints.AUTHENTICATION.REGISTER,
            //   {
            //     phone: values.phone,
            //     password: values.password,
            //     confirmPassword: values.confirmPassword,
            //   },
            // );
            console.log("responseRegister", values.password);
            // if (responseRegister?.data?.data.accessToken || values.password === "123456789") {
            if (values.password === "123456789") {
              setIsErrorAccount(false);
              try {
                const userProfile = await axios.get("", {
                  headers: {
                    // Authorization: `Bearer ${responseRegister.data.data.accessToken}`,
                  },
                });
                if (userProfile?.data?.data.id) {
                  userStorage.getState().setUserProfile(userProfile.data.data);
                  // userStorage.getState().setAccessToken(responseRegister.data.data.accessToken);
                  window.location.href = PageUrls.AUTHENTICATION.LOGIN;
                } else {
                  // alert("Không lấy được thông tin người dùng");
                  window.location.href = PageUrls.AUTHENTICATION.LOGIN;
                }
              } catch (error) {
                // alert("Không lấy được thông tin người dùng");
                window.location.href = PageUrls.AUTHENTICATION.LOGIN;
              }
            }
          } catch (error) {
            setIsErrorAccount(true);
          }
          setIsLoadingForm(false);
        }
      }}
    >
      {({ errors, touched, dirty, values }) => {
        // eslint-disable-next-line  react-hooks/rules-of-hooks
        useEffect(() => {
          setIsHasChanged(dirty);
          if (touched.confirmPassword && touched.password) {
            if (values.confirmPassword !== values.password) {
              setIsMatchPassword(false);
            } else {
              setIsMatchPassword(true);
            }
          }
        }, [dirty, touched, values]);

        return (
          <Form>
            <div className="relative flex bg-white rounded-3xl mx-5">
              <div className="flex flex-col">
                <div className="w-full flex flex-col justify-center items-left px-4 py-8 gap-3">
                  <p className="text-heading3Semibold text-coolGray-1200 w-2/3">
                    Chào mừng đến với <span className="text-brandSupport-900">Doni</span>
                  </p>
                  <p className="text-bodyMRegular text-coolGray-1200">
                    Quản lý chi tiêu dễ dàng hơn bao giờ hết. Đăng ký tài khoản để bắt đầu!
                  </p>
                </div>
                <div className="w-full flex flex-col px-4 py-2 gap-3">
                  <div className="w-full flex flex-col gap-1">
                    <TextFormInput name="phone" placeholder="Số điện thoại" />
                  </div>
                  <div className="w-full relative flex flex-col gap-1">
                    <TextFormInput name="password" placeholder="Mật khẩu" type={isShowPassword ? "text" : "password"} />
                    <div
                      className={"absolute cursor-pointer right-0 pr-3 pt-3"}
                      onClick={() => {
                        setIsShowPassword(!isShowPassword);
                      }}
                    >
                      {isShowPassword ? (
                        <Eye size={24} className="text-coolGray-700 press-button" />
                      ) : (
                        <EyeSlash size={24} className="text-coolGray-700 press-button" />
                      )}
                    </div>
                  </div>
                  <div className="w-full relative flex flex-col gap-1">
                    <TextFormInput
                      name="confirmPassword"
                      placeholder="Nhập lại mật khẩu"
                      type={isShowConfirmPassword ? "text" : "password"}
                      error={!isMatchPassword ? "Mật khẩu nhập lại không khớp" : undefined}
                    />
                    <div
                      className={"absolute cursor-pointer right-0 pr-3 pt-3"}
                      onClick={() => {
                        setIsShowConfirmPassword(!isShowConfirmPassword);
                      }}
                    >
                      {isShowConfirmPassword ? (
                        <Eye size={24} className="text-coolGray-700 press-button" />
                      ) : (
                        <EyeSlash size={24} className="text-coolGray-700 press-button" />
                      )}
                    </div>
                  </div>
                </div>
                <div className="w-full flex flex-col px-4 justify-center items-end ">
                  <p></p>
                  <p className="text-brandSupport-900 text-buttonM"> Quên mật khẩu?</p>
                </div>
                <div className="w-full flex flex-col gap-2 justify-center items-center px-4 py-8">
                  {isErrorAccount && <p className="error-message">Sai thông tin đăng nhập. Vui lòng thử lại.</p>}
                  <SubmitButton
                    size="small"
                    level="primary"
                    typeButton="primary"
                    content="Đăng nhập"
                    type="submit"
                    buttonClass="w-full h-12 rounded-3xl"
                    contentClass="flex justify-center items-center text-buttonL text-[#2F394B]"
                    isEnable={
                      values.phone !== "" &&
                      values.password !== "" &&
                      values.password?.length >= 8 &&
                      values.confirmPassword?.length >= 8
                    }
                  />
                  <p className="text-bodyMRegular">
                    Bạn đã có tài khoản?{" "}
                    <Link href={PageUrls.AUTHENTICATION.LOGIN} className="text-brandSupport-900 text-buttonM">
                      Đăng nhập ngay
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </Form>
        );
      }}
    </Formik>
  );
};

export default RegisterForm;
