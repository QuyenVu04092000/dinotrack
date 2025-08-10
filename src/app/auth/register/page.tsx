"use client";

import RegisterForm from "@/components/authentication/registerForm";
import characters from "@/styles/images/characters";
import Image from "next/image";

const LoginPage = (): JSX.Element => {
  return (
    <div className="relative w-full min-h-screen flex flex-col items-center gap-0 py-[10%]">
      <div className="relative w-3/5 flex justify-start items-start">
        <Image className="" src={characters.purpleHi} alt="Character waving" width={160} height={144} />
      </div>
      <RegisterForm />
    </div>
  );
};

export default LoginPage;
