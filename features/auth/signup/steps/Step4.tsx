"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuthContext } from "app/context/AuthContext";
import { imagePath } from "app/utilities/constants/common/assets";
import { authApi } from "app/services/authApi";
import { extractErrorMessage } from "app/lib/apiClient";

interface StepProps {
  goNext: () => void;
  goBack: () => void;
  isFirst: boolean;
  isLast: boolean;
}

const DAYS = Array.from({ length: 31 }, (_, i) => i + 1);

export default function Step4({ goBack }: StepProps) {
  const router = useRouter();
  const { user, reloadProfile } = useAuthContext();

  const [selectedDay, setSelectedDay] = useState<number>(1);
  const [tempDay, setTempDay] = useState<number>(1);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleOpenSheet = () => {
    setTempDay(selectedDay);
    setIsSheetOpen(true);
  };

  const handleConfirmSheet = () => {
    setSelectedDay(tempDay);
    setIsSheetOpen(false);
  };

  const handleSubmit = async () => {
    if (!user?.id) {
      setError("Không tìm thấy thông tin người dùng.");
      return;
    }

    setIsSubmitting(true);
    setError(null);
    try {
      await authApi.updateUser(user.id, undefined, selectedDay);
      await reloadProfile();
      router.replace("/home");
    } catch (err) {
      const message = extractErrorMessage(err);
      setError(message || "Có lỗi xảy ra khi cập nhật ngày bắt đầu tháng.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      aria-label="Màn hình chọn ngày bắt đầu tháng"
      className="relative flex min-h-[100vh] w-full flex-col bg-[#0046B0]"
    >
      {/* Background pattern */}
      <div className="pointer-events-none absolute inset-0 opacity-40">
        <Image src={imagePath("/images/background.png")} alt="" fill priority className="object-contain" />
      </div>

      <div className="relative z-10 flex w-full flex-col">
        {/* Header */}
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
            <p className="text-sm font-semibold text-white">Bước 2/2</p>
            <div className="flex gap-1">
              <div className="h-1 w-12 rounded-full bg-[#9CF526]" />
              <div className="h-1 w-12 rounded-full bg-[#9CF526]" />
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex flex-1 flex-col items-center px-4 pt-8">
          {/* Mascot + speech bubble */}
          <div className="relative mb-8 h-36 w-full">
            <div className="absolute left-5 top-12">
              <Image
                src={imagePath("/images/select_day.png")}
                alt="Nhân vật Doni"
                width={110}
                height={103}
                className="object-contain"
              />
            </div>
            {/* Speech bubble */}
            <div
              className="absolute right-24 -top-11 px-4 py-2 w-48 h-28 "
              style={{
                backgroundImage: `url('${imagePath("/images/create_tip.png")}')`,
                backgroundSize: "contain",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
              }}
            >
              <p className="text-left text-white text-base font-semibold">
                Rất tốt! Bạn muốn bắt đầu tháng vào ngày nào?
              </p>
            </div>
          </div>

          {/* Question + selector */}
          <div className="w-full max-w-sm">
            <h2 className="mb-4 text-lg font-semibold text-white">Chọn ngày bạn muốn bắt đầu tháng</h2>

            <button
              type="button"
              onClick={handleOpenSheet}
              className="mb-3 flex w-full items-center justify-between rounded-3xl bg-[#F8FAFC] px-4 py-3 text-left text-base font-semibold text-slate-800"
            >
              <span>{`Ngày ${selectedDay}`}</span>
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-transparent text-slate-800">
                ▾
              </span>
            </button>

            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path
                  d="M13.75 18.125C13.75 18.2908 13.6841 18.4498 13.5669 18.567C13.4497 18.6842 13.2907 18.75 13.125 18.75H6.87498C6.70922 18.75 6.55025 18.6842 6.43304 18.567C6.31583 18.4498 6.24998 18.2908 6.24998 18.125C6.24998 17.9593 6.31583 17.8003 6.43304 17.6831C6.55025 17.5659 6.70922 17.5 6.87498 17.5H13.125C13.2907 17.5 13.4497 17.5659 13.5669 17.6831C13.6841 17.8003 13.75 17.9593 13.75 18.125ZM16.875 8.12504C16.8777 9.16695 16.6423 10.1957 16.1868 11.1328C15.7314 12.0699 15.0678 12.8905 14.2469 13.5321C14.0934 13.6497 13.9688 13.8009 13.8827 13.9741C13.7965 14.1473 13.7512 14.3379 13.75 14.5313V15C13.75 15.3316 13.6183 15.6495 13.3839 15.8839C13.1494 16.1183 12.8315 16.25 12.5 16.25H7.49998C7.16846 16.25 6.85052 16.1183 6.6161 15.8839C6.38168 15.6495 6.24998 15.3316 6.24998 15V14.5313C6.24985 14.3402 6.20591 14.1517 6.12154 13.9802C6.03716 13.8088 5.91459 13.6589 5.76326 13.5422C4.94436 12.9045 4.28127 12.0887 3.82418 11.1568C3.3671 10.2249 3.128 9.20128 3.12498 8.16332C3.10467 4.43989 6.11404 1.3391 9.83436 1.25004C10.751 1.22795 11.6629 1.38946 12.5162 1.72506C13.3695 2.06065 14.1471 2.56356 14.8031 3.20418C15.4592 3.84479 15.9805 4.61017 16.3363 5.45527C16.6921 6.30036 16.8752 7.2081 16.875 8.12504ZM15.625 8.12504C15.6252 7.37478 15.4753 6.63205 15.1842 5.94058C14.893 5.24911 14.4665 4.62287 13.9297 4.09872C13.3929 3.57458 12.7566 3.16312 12.0584 2.88856C11.3602 2.61401 10.6141 2.48191 9.86404 2.50004C6.81717 2.57192 4.35857 5.10864 4.37498 8.15551C4.37783 9.00441 4.57373 9.84153 4.94783 10.6036C5.32194 11.3656 5.86446 12.0325 6.53436 12.5539C6.83548 12.788 7.07906 13.0879 7.24643 13.4307C7.4138 13.7734 7.50053 14.1499 7.49998 14.5313V15H12.5V14.5313C12.5008 14.1488 12.5891 13.7715 12.7579 13.4283C12.9267 13.0851 13.1717 12.785 13.4742 12.5508C14.1462 12.0257 14.6892 11.354 15.062 10.5869C15.4347 9.81991 15.6273 8.97785 15.625 8.12504ZM14.3664 7.39536C14.2043 6.49012 13.7688 5.65626 13.1185 5.00606C12.4681 4.35585 11.6342 3.92051 10.7289 3.75864C10.6479 3.74499 10.5651 3.74742 10.4851 3.76579C10.4051 3.78416 10.3295 3.81811 10.2626 3.8657C10.1957 3.91329 10.1388 3.97359 10.0953 4.04316C10.0517 4.11272 10.0222 4.19019 10.0086 4.27114C9.99493 4.35208 9.99736 4.43493 10.0157 4.51493C10.0341 4.59494 10.0681 4.67055 10.1156 4.73743C10.1632 4.80432 10.2235 4.86118 10.2931 4.90476C10.3627 4.94835 10.4401 4.9778 10.5211 4.99145C11.8156 5.20942 12.914 6.30785 13.1336 7.60473C13.1583 7.75029 13.2338 7.8824 13.3466 7.97764C13.4594 8.07288 13.6023 8.1251 13.75 8.12504C13.7853 8.12483 13.8206 8.12196 13.8554 8.11645C14.0188 8.08856 14.1644 7.99693 14.2602 7.8617C14.356 7.72647 14.3942 7.55873 14.3664 7.39536Z"
                  fill="white"
                  fill-opacity="0.8"
                />
              </svg>

              <p className="text-sm font-medium text-white/80">
                Bạn có thể thay đổi ngày bắt đầu bất cứ lúc nào ở phần Cài đặt
              </p>
            </div>

            {error && (
              <div className="mt-4 rounded-2xl bg-red-50 px-3 py-2">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Primary button */}
      <div className="px-4 pb-8 absolute bottom-0 left-0 right-0 z-20">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isSubmitting}
          className={`h-12 w-full rounded-3xl text-base font-semibold ${
            !isSubmitting ? "bg-[#9CF526] text-slate-900" : "bg-slate-300 text-slate-500 cursor-not-allowed"
          }`}
        >
          {isSubmitting ? "Đang cập nhật..." : "Bắt đầu ngay"}
        </button>
      </div>
      {/* Bottom sheet picker */}
      {isSheetOpen && (
        <div
          className="fixed inset-0 z-40 flex items-end justify-center bg-black/40"
          onClick={() => setIsSheetOpen(false)}
        >
          <div className="w-full max-w-md rounded-t-3xl bg-white pb-4 pt-2" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
              <span className="text-lg font-semibold text-slate-900">Chọn ngày bắt đầu</span>
              <button
                type="button"
                onClick={() => setIsSheetOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full"
                aria-label="Đóng"
              >
                ✕
              </button>
            </div>

            {/* Wheel-like list */}
            <div className="relative max-h-56 overflow-y-auto px-4 py-4">
              <div className="pointer-events-none absolute left-4 right-4 top-1/2 h-9 -translate-y-1/2 rounded-lg " />
              <ul className="relative space-y-2">
                {DAYS.map((day) => {
                  const isActive = day === tempDay;
                  return (
                    <li key={day} className="flex justify-center">
                      <button
                        type="button"
                        onClick={() => setTempDay(day)}
                        className={`w-full rounded-2xl py-1 text-center text-base ${
                          isActive ? "bg-slate-100 font-semibold text-slate-900" : "text-slate-500"
                        }`}
                      >
                        {`Ngày ${day}`}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Confirm button */}
            <div className="px-4 pt-1">
              <button
                type="button"
                onClick={handleConfirmSheet}
                className="mt-1 h-12 w-full rounded-3xl bg-[#9CF526] text-base font-semibold text-slate-900"
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
