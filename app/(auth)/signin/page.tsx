"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSignIn } from "app/hooks/useSignIn";
import { imagePath } from "app/utilities/constants/common/assets";

export default function HomePage() {
  const router = useRouter();
  const { handleSubmit, isLoading, isSuccess, error } = useSignIn();
  return (
    <section aria-label="Màn hình đăng nhập Doni" className="flex min-h-[100vh] items-start justify-center">
      <div
        style={{
          position: "fixed",
          inset: 0,
          backgroundImage: `url('${imagePath("/images/background.png")}')`,
          backgroundSize: "contain",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          zIndex: -1,
          opacity: 0.3,
        }}
      />

      <div className="mt-10 w-full  px-4 pt-24 sm:px-6">
        {/* Mascot / illustration placeholder */}

        <div className="mt-6 rounded-3xl bg-white px-6 py-8 text-left shadow-sm relative">
          <div className="absolute top-[-128px] right-9">
            <Image src={imagePath("/images/icon.png")} alt="Doni" width={160} height={144} />
          </div>
          <header className="space-y-3">
            <h1 className="text-2xl font-semibold text-slate-800">
              Chào mừng đến với <span className="font-bold text-[#0046B0]">Doni</span>
            </h1>
            <p className="text-sm text-slate-500">Quản lý chi tiêu dễ dàng hơn bao giờ hết. Đăng nhập để bắt đầu!</p>
          </header>

          <form action={handleSubmit} className="mt-8 space-y-4">
            <div className="space-y-3">
              <div>
                <label htmlFor="login-phone" className="sr-only">
                  Số điện thoại
                </label>
                <input
                  id="login-phone"
                  type="tel"
                  name="phone"
                  aria-label="Số điện thoại"
                  placeholder="Số điện thoại"
                  className="h-12 w-full rounded-3xl border-0 bg-slate-100 px-4 text-base text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0046B0]"
                  required
                />
              </div>
              <div>
                <label htmlFor="login-password" className="sr-only">
                  Mật khẩu
                </label>
                <input
                  id="login-password"
                  type="password"
                  name="password"
                  aria-label="Mật khẩu"
                  placeholder="Mật khẩu"
                  className="h-12 w-full rounded-3xl border-0 bg-slate-100 px-4 text-base text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0046B0]"
                  required
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  className="text-sm font-semibold text-[#0046B0]"
                  aria-label="Quên mật khẩu (chưa hoạt động)"
                  disabled
                >
                  Quên mật khẩu?
                </button>
              </div>
            </div>
            {error && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-md px-3 py-2">{error}</p>
            )}

            {isSuccess && (
              <p className="text-sm text-green-600 bg-green-50 border border-green-100 rounded-md px-3 py-2">
                Logged in successfully.
              </p>
            )}
            <div className="space-y-4">
              <button
                type="submit"
                disabled={isLoading}
                className={`h-12 w-full rounded-3xl text-base font-semibold 
                  ${isLoading ? "bg-slate-200" : "bg-[#9CF526]"}
                  ${isLoading ? "text-slate-400" : "text-slate-900"}
                  `}
                aria-label="Đăng nhập (chưa khả dụng)"
              >
                {isLoading ? "Logging in..." : "Đăng nhập"}
              </button>
              <p className="flex items-center justify-center gap-1 text-sm text-slate-600">
                <span>Bạn chưa có tài khoản?</span>
                <button
                  type="button"
                  className="text-sm font-semibold text-[#0046B0]"
                  aria-label="Đăng ký ngay (chưa hoạt động)"
                  onClick={() => router.push("/signup")}
                >
                  Đăng ký ngay
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
