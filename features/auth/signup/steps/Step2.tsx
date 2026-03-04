"use client";

import { useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuthContext } from "app/context/AuthContext";
import { AuthResponse } from "app/types/auth";

interface StepProps {
  goNext: () => void;
  goBack: () => void;
  isFirst: boolean;
  isLast: boolean;
}

export default function Step2({ goNext, goBack }: StepProps) {
  const router = useRouter();
  const { login } = useAuthContext();

  useEffect(() => {
    // Check if there's a pending registration from Step1
    const pendingRegistration = localStorage.getItem("pendingRegistration");
    if (pendingRegistration) {
      try {
        const authResponse: AuthResponse = JSON.parse(pendingRegistration);
        // Login the user automatically after successful registration
        login(authResponse);
        // Clear the pending registration
        localStorage.removeItem("pendingRegistration");
      } catch (error) {
        console.error("Error parsing registration response:", error);
      }
    }
  }, [login]);

  return (
    <section
      aria-label="Màn hình đăng ký thành công"
      className="relative flex min-h-[100vh] w-full items-stretch justify-center bg-[#0046B0]"
    >
      {/* Background pattern (reusing app background image) */}
      <div className="pointer-events-none absolute inset-0 opacity-40">
        <Image src="/images/background.png" alt="" fill priority className="object-contain" />
      </div>

      <div className="relative z-10 flex w-full max-w-sm flex-col items-center pt-24 pb-10 px-4">
        {/* Fake status bar spacing */}
        <div className="h-10 w-full" aria-hidden="true" />

        {/* Card */}
        <div className="w-full rounded-3xl bg-white px-6 py-8 shadow-lg relative mt-28">
          {/* Check icon */}
          {/* Fireworks / mascot illustration */}
          <div
            className="mb-6 h-64 w-64 absolute left-1/2 -top-10 -translate-x-1/2 -translate-y-1/2 -z-10"
            style={{
              backgroundImage: "url('/images/fireworks.png')",
              backgroundSize: "contain",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          >
            <Image
              width={150}
              height={117}
              src="/images/success_bg.png"
              alt="Chúc mừng đăng ký thành công"
              className="object-contain absolute left-1/2 top-28 -translate-x-1/2 -translate-y-1/2"
            />
          </div>
          <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-[#22C55E]">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path
                d="M9.00039 16.2004L4.80039 12.0004L3.40039 13.4004L9.00039 19.0004L21.0004 7.00039L19.6004 5.60039L9.00039 16.2004Z"
                fill="white"
              />
            </svg>
          </div>

          {/* Title */}
          <h1 className="mb-3 text-center text-2xl font-semibold leading-snug text-slate-800">Đăng ký thành công</h1>

          {/* Description */}
          <p className="mb-6 text-center text-sm text-slate-600">
            Giờ đây, bạn đã sẵn sàng quản lý chi tiêu một cách thông minh và hiệu quả!
          </p>

          {/* Primary button */}
          <button
            type="button"
            onClick={goNext}
            className="mt-2 h-12 w-full rounded-3xl bg-[#9CF526] text-base font-semibold text-slate-900 shadow-sm"
          >
            Bắt đầu thiết lập sử dụng ngay
          </button>
        </div>
      </div>
    </section>
  );
}
