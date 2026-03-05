"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRegister } from "app/hooks/useRegister";
import { imagePath } from "app/utilities/constants/common/assets";

interface StepProps {
  goNext: () => void;
  goBack: () => void;
  isFirst: boolean;
  isLast: boolean;
}

export default function Step1({ goNext }: StepProps) {
  const router = useRouter();
  const {
    isLoading,
    error,
    setName,
    setPhone,
    setEmail,
    setPassword,
    setPasswordConfirm,
    validationError,
    formValid,
    handleSubmit,
    name,
    phone,
    email,
    password,
    passwordConfirm,
  } = useRegister({ goNext });

  return (
    <section
      aria-label="Màn hình đăng ký tài khoản bước 1"
      className="flex min-h-[100vh] flex-col justify-start w-full px-4 sm:px-6"
    >
      <div className="relative mt-40 rounded-3xl bg-white px-6 pb-8 pt-12 shadow-sm">
        <div className="absolute -top-32 right-8">
          <Image src={imagePath("/images/icon_register.png")} alt="Nhân vật Doni chào mừng" width={152} height={152} />
        </div>

        <header className="space-y-3">
          <h1 className="text-2xl font-semibold leading-snug text-slate-800">
            Chào mừng đến với <span className="font-bold text-[#0046B0]">Doni</span>
          </h1>
          <p className="text-sm text-slate-500">
            Quản lý chi tiêu dễ dàng hơn bao giờ hết. Đăng ký tài khoản để bắt đầu.
          </p>
        </header>

        <form onSubmit={handleSubmit} className="mt-8 space-y-3">
          <div>
            <label htmlFor="signup-name" className="sr-only">
              Tên
            </label>
            <input
              id="signup-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              aria-label="Tên"
              placeholder="Tên"
              required
              className="h-12 w-full rounded-3xl border-0 bg-slate-100 px-4 text-base text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0046B0]"
            />
          </div>
          <div>
            <label htmlFor="signup-phone" className="sr-only">
              Số điện thoại
            </label>
            <input
              id="signup-phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              aria-label="Số điện thoại"
              placeholder="Số điện thoại"
              required
              className="h-12 w-full rounded-3xl border-0 bg-slate-100 px-4 text-base text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0046B0]"
            />
          </div>
          <div>
            <label htmlFor="signup-email" className="sr-only">
              Email
            </label>
            <input
              id="signup-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-label="Email"
              placeholder="Email"
              required
              className="h-12 w-full rounded-3xl border-0 bg-slate-100 px-4 text-base text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0046B0]"
            />
          </div>
          <div>
            <label htmlFor="signup-password" className="sr-only">
              Mật khẩu
            </label>
            <input
              id="signup-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              aria-label="Mật khẩu"
              placeholder="Mật khẩu"
              required
              minLength={6}
              className="h-12 w-full rounded-3xl border-0 bg-slate-100 px-4 text-base text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0046B0]"
            />
          </div>
          <div>
            <label htmlFor="signup-password-confirm" className="sr-only">
              Nhập lại mật khẩu
            </label>
            <input
              id="signup-password-confirm"
              type="password"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              aria-label="Nhập lại mật khẩu"
              placeholder="Nhập lại mật khẩu"
              required
              className="h-12 w-full rounded-3xl border-0 bg-slate-100 px-4 text-base text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0046B0]"
            />
          </div>

          {/* Error messages */}
          {(validationError || error) && (
            <div className="rounded-2xl bg-red-50 px-3 py-2">
              <p className="text-sm text-red-600">{validationError || error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={!formValid || isLoading}
            className={`mt-4 h-12 w-full rounded-3xl text-base font-semibold ${
              formValid && !isLoading ? "bg-[#0046B0] text-white" : "bg-slate-200 text-slate-400 cursor-not-allowed"
            }`}
          >
            {isLoading ? "Đang đăng ký..." : "Đăng ký"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          <span>Bạn đã có tài khoản? </span>
          <button
            type="button"
            onClick={() => router.push("/signin")}
            className="font-semibold text-[#0046B0]"
            aria-label="Đăng nhập ngay"
          >
            Đăng nhập ngay
          </button>
        </p>
      </div>
    </section>
  );
}
