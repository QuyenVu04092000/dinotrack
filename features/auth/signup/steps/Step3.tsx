"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuthContext } from "app/context/AuthContext";
import { authApi } from "app/services/authApi";
import { formatAmountInput, parseAmountInput } from "app/utilities/common/functions";
import { extractErrorMessage } from "app/lib/apiClient";

interface StepProps {
  goNext: () => void;
  goBack: () => void;
  isFirst: boolean;
  isLast: boolean;
}

export default function Step3({ goNext, goBack }: StepProps) {
  const router = useRouter();
  const { user, reloadProfile } = useAuthContext();
  const [balance, setBalance] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleBalanceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Remove non-digit characters
    const digitsOnly = value.replace(/\D/g, "");
    if (digitsOnly === "") {
      setBalance("");
      return;
    }
    // Format with dots and đ
    const formatted = formatAmountInput(digitsOnly);
    setBalance(formatted);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!user?.id) {
      setError("Không tìm thấy thông tin người dùng.");
      return;
    }

    const balanceValue = parseAmountInput(balance);
    if (balanceValue <= 0) {
      setError("Vui lòng nhập số tiền hợp lệ.");
      return;
    }

    setIsLoading(true);
    try {
      // Convert to string as API expects string
      await authApi.updateUser(user.id, balanceValue);
      // Reload profile to get updated balance
      await reloadProfile();
      // Go to next onboarding step (start day of month)
      goNext();
    } catch (err) {
      const message = extractErrorMessage(err);
      setError(message || "Có lỗi xảy ra khi cập nhật số dư.");
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = parseAmountInput(balance) > 0;

  return (
    <section
      aria-label="Màn hình thiết lập số dư ban đầu"
      className="relative flex min-h-[100vh] w-full flex-col bg-[#0046B0]"
    >
      {/* Background pattern */}
      <div className="pointer-events-none absolute inset-0 opacity-40">
        <Image src="/images/background.png" alt="" fill priority className="object-contain" />
      </div>

      <div className="relative z-10 flex w-full flex-col">
        {/* Header with back button and progress */}
        <div className="flex items-center justify-between px-4 pt-14 pb-4">
          <button
            type="button"
            onClick={goBack}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm"
            aria-label="Quay lại"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M15 18L9 12L15 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <div className="flex flex-col items-end gap-1">
            <p className="text-sm font-semibold text-white">Bước 1/2</p>
            <div className="flex gap-1">
              <div className="h-1 w-12 rounded-full bg-[#9CF526]" />
              <div className="h-1 w-12 rounded-full bg-[#8E95A2]" />
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex flex-1 flex-col items-center px-4 pt-8">
          {/* Mascot illustration area */}
          <div className="relative mb-8 h-36 w-full">
            <div className="absolute left-0 top-12">
              <Image
                src="/images/create_bg.png"
                alt="Nhân vật Doni"
                width={155}
                height={106}
                className="object-contain"
              />
            </div>
            {/* Speech bubble */}
            <div
              className="absolute right-24 -top-8 px-4 py-2 w-48 h-28 "
              style={{
                backgroundImage: "url('/images/create_tip.png')",
                backgroundSize: "contain",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
              }}
            >
              <p className="text-left text-white text-base font-semibold">
                Đầu tiên, bạn hãy tạo cho mình một chiếc ví nhé
              </p>
            </div>
          </div>

          {/* Question */}
          <h2 className="mb-4 text-center text-lg font-semibold text-white">Bạn đang có bao nhiêu tiền trong ví?</h2>

          {/* Balance input */}
          <form onSubmit={handleSubmit} className="w-full max-w-sm">
            <div className="mb-6 w-full rounded-3xl border border-[#0046B0] bg-white/10 backdrop-blur-sm">
              <div className="rounded-3xl bg-white p-3">
                <input
                  type="text"
                  inputMode="numeric"
                  value={balance}
                  onChange={handleBalanceChange}
                  placeholder="0đ"
                  className="w-full bg-transparent text-left text-base font-semibold text-black placeholder:text-slate-400 focus:outline-none"
                  autoFocus
                />
              </div>
            </div>

            {/* Error message */}
            {error && (
              <div className="mb-4 rounded-2xl bg-red-50 px-3 py-2">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* Submit button */}
            <button
              type="submit"
              disabled={!isFormValid || isLoading}
              className={`h-12 w-full rounded-3xl text-base font-semibold ${
                isFormValid && !isLoading
                  ? "bg-[#9CF526] text-slate-900"
                  : "bg-slate-300 text-slate-500 cursor-not-allowed"
              }`}
            >
              {isLoading ? "Đang tạo ví..." : "Tạo ví ngay"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
