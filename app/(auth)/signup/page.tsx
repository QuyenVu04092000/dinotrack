"use client";

import SignupFlow from "@features/auth/signup/SignupFlow";
import { imagePath } from "app/utilities/constants/common/assets";

export default function SignupPage() {
  return (
    <section
      aria-label="Đăng ký tài khoản Doni"
      className="flex min-h-[100vh] items-stretch justify-center bg-background"
    >
      <div
        style={{
          position: "fixed",
          inset: 0,
          backgroundImage: `url('${imagePath("/images/background.png")}')`,
          backgroundSize: "contain",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          zIndex: 0,
          opacity: 0.3,
        }}
      />
      <SignupFlow />
    </section>
  );
}
