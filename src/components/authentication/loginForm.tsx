import React, { useEffect } from "react";
import useLogin from "@/hooks/authentication/useLogin";
import { Form, Formik } from "formik";
import axios from "axios";
// import type { IBaseResponse } from "@/types/response/common/IBaseResponse";
// import type { ILoginResponse } from "@/types/response/authentication";
import { EyeSlash, Eye } from "@phosphor-icons/react/dist/ssr";
import userStorage from "@/stores/userLocalStorage";
import PageUrls from "@/utilities/enums/pageUrl";
// import { Endpoints, BASE_URL_API_V1 } from "@/utilities/constants/common/endpoints";
// import { showToast } from "../common/toast";
import { TextFormInput } from "../common/input/textInput";
import { SubmitButton } from "../common/button";
import Link from "next/link";

const LoginForm = (): JSX.Element => {
  const {
    isHasChanged,
    setIsHasChanged,
    // isLoadingForm,
    setIsLoadingForm,
    isErrorAccount,
    setIsErrorAccount,
    isShowPassword,
    setIsShowPassword,
    initialLoginForm,
    validateLoginForm,
  } = useLogin();

  return (
    <Formik
      initialValues={initialLoginForm}
      enableReinitialize
      validationSchema={validateLoginForm}
      onSubmit={async (values) => {
        if (isHasChanged) {
          setIsLoadingForm(true);
          try {
            // const responseLogin = await axios.post<IBaseResponse<ILoginResponse>>(
            //   BASE_URL_API_V1 + Endpoints.AUTHENTICATION.LOGIN,
            //   {
            //     phone: values.phone,
            //     password: values.password,
            //   },
            // );
            console.log("responseLogin", values.password);
            // if (responseLogin?.data?.data.accessToken || values.password === "123456789") {
            if (values.password === "123456789") {
              setIsErrorAccount(false);
              try {
                const userProfile = await axios.get("", {
                  headers: {
                    // Authorization: `Bearer ${responseLogin.data.data.accessToken}`,
                  },
                });
                if (userProfile?.data?.data.id) {
                  userStorage.getState().setUserProfile(userProfile.data.data);
                  // userStorage.getState().setAccessToken(responseLogin.data.data.accessToken);
                  window.location.href = PageUrls.INTRODUCTION.BASE;
                } else {
                  // alert("Không lấy được thông tin người dùng");
                  window.location.href = PageUrls.INTRODUCTION.BASE;
                }
              } catch (error) {
                // alert("Không lấy được thông tin người dùng");
                window.location.href = PageUrls.INTRODUCTION.BASE;
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
        }, [dirty]);
        return (
          <Form>
            <div className="relative flex bg-white rounded-3xl mx-5">
              <div className="flex flex-col">
                <div className="w-full flex flex-col justify-center items-left px-4 py-8 gap-3">
                  <p className="text-heading3Semibold text-coolGray-1200 w-2/3">
                    Chào mừng đến với <span className="text-brandSupport-900">Doni</span>
                  </p>
                  <p className="text-bodyMRegular text-coolGray-1200">
                    Quản lý chi tiêu dễ dàng hơn bao giờ hết. Đăng nhập để bắt đầu!
                  </p>
                </div>
                <div className="w-full flex flex-col px-4 py-2 gap-3">
                  <div className="w-full flex flex-col gap-1">
                    <TextFormInput name="phone" placeholder="Số điện thoại" />
                  </div>
                  <div className="w-full relative flex flex-col gap-1">
                    <TextFormInput name="password" placeholder="Mật khẩu" type={isShowPassword ? "text" : "password"} />
                    <div
                      className={`absolute cursor-pointer right-0 bottom-0 pr-3 ${errors.password && touched.password ? "pb-[32px]" : "pb-2.5"} `}
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
                </div>
                <div className="w-full flex flex-col px-4 justify-center items-end ">
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
                    isEnable={values.phone !== "" && values.password !== "" && values.password?.length >= 8}
                  />
                  <p className="text-bodyMRegular">
                    Bạn chưa có tài khoản?{" "}
                    <Link href={PageUrls.AUTHENTICATION.REGISTER} className="text-brandSupport-900 text-buttonM">
                      Đăng ký ngay
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

export default LoginForm;
