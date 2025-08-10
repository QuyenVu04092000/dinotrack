"use client";

import LoginForm from "@/components/authentication/loginForm";
import characters from "@/styles/images/characters";
import Image from "next/image";

const LoginPage = (): JSX.Element => {
  return (
    <div className="relative w-full min-h-screen flex flex-col items-center gap-0 pt-[10%]">
      <div className="relative w-4/5 flex justify-end items-end">
        <Image className="" src={characters.greenHi} alt="Character waving" width={160} height={144} />
      </div>
      <LoginForm />
    </div>
  );
};

export default LoginPage;
