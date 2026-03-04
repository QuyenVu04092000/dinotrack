"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useSettings } from "app/hooks/useSettings";
import { useAuthContext } from "app/context/AuthContext";

export default function SettingsPage() {
  const router = useRouter();
  const { logout } = useAuthContext();
  const {
    balanceInput,
    startDayInput,
    isSavingBalance,
    isSavingStartDay,
    errorBalance,
    errorStartDay,
    isBalanceValid,
    isStartDayValid,
    setStartDayInput,
    handleBalanceChange,
    handleSaveBalance,
    handleSaveStartDay,
  } = useSettings();

  const handleLogout = () => {
    logout();
    router.replace("/signin");
  };

  return (
    <div className="relative flex min-h-screen flex-col bg-white rounded-[32px] overflow-hidden">
      {/* Header */}
      <div className="relative bg-[#0046B0] h-[95px] rounded-bl-[20px] rounded-br-[20px]">
        <div className="absolute left-[-49px] top-0 h-[794.752px] w-full mix-blend-lighten">
          <div className="h-full w-full bg-[url('/images/background.png')] bg-cover bg-center" />
        </div>
        <div className="relative z-10 w-full flex items-center justify-between gap-3 px-4 pt-[55px]">
          <h1 className="text-lg font-semibold leading-[1.5] text-white">Cài đặt</h1>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 px-4 pt-4 pb-24 space-y-4 flex-1 overflow-y-auto bg-[#F8FAFC]">
        {/* Balance setting */}
        <form onSubmit={handleSaveBalance} className="bg-white rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-[#1F2532]">Số dư hiện tại</p>
            <p className="text-xs text-[#8E95A2]">Giá trị đang dùng cho báo cáo</p>
          </div>
          <div className="rounded-3xl border border-[#EDEEF1] bg-white px-3 py-2">
            <input
              type="text"
              inputMode="numeric"
              value={balanceInput}
              onChange={handleBalanceChange}
              placeholder="0đ"
              className="w-full bg-transparent text-left text-base font-semibold text-[#1F2532] placeholder:text-slate-400 focus:outline-none"
            />
          </div>
          {errorBalance && <p className="text-xs text-red-500">{errorBalance}</p>}
          <button
            type="submit"
            disabled={!isBalanceValid || isSavingBalance}
            className={`w-full h-11 rounded-3xl text-sm font-semibold ${
              isBalanceValid && !isSavingBalance
                ? "bg-[#0046B0] text-white"
                : "bg-[#E5E7EB] text-[#8E95A2] cursor-not-allowed"
            }`}
          >
            {isSavingBalance ? "Đang lưu..." : "Lưu số dư"}
          </button>
        </form>

        {/* Start day of month setting */}
        <form onSubmit={handleSaveStartDay} className="bg-white rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-[#1F2532]">Ngày bắt đầu tháng</p>
            <p className="text-xs text-[#8E95A2]">Áp dụng cho báo cáo, sổ giao dịch, ngân sách</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="rounded-3xl border border-[#EDEEF1] bg-white px-3 py-2 w-24">
              <input
                type="number"
                min={1}
                max={28}
                value={startDayInput}
                onChange={(e) => setStartDayInput(e.target.value)}
                className="w-full bg-transparent text-center text-base font-semibold text-[#1F2532] placeholder:text-slate-400 focus:outline-none"
              />
            </div>
            <span className="text-sm text-[#3B4D69]">hàng tháng</span>
          </div>
          {errorStartDay && <p className="text-xs text-red-500">{errorStartDay}</p>}
          <button
            type="submit"
            disabled={!isStartDayValid || isSavingStartDay}
            className={`w-full h-11 rounded-3xl text-sm font-semibold ${
              isStartDayValid && !isSavingStartDay
                ? "bg-[#0046B0] text-white"
                : "bg-[#E5E7EB] text-[#8E95A2] cursor-not-allowed"
            }`}
          >
            {isSavingStartDay ? "Đang lưu..." : "Lưu ngày bắt đầu"}
          </button>
        </form>

        {/* Logout */}
        <div className="bg-white rounded-2xl p-4 space-y-3">
          <p className="text-sm font-semibold text-[#1F2532]">Đăng xuất</p>
          <p className="text-xs text-[#8E95A2]">
            Thoát khỏi tài khoản trên thiết bị này. Bạn có thể đăng nhập lại bất cứ lúc nào.
          </p>
          <button
            type="button"
            onClick={handleLogout}
            className="w-full h-11 rounded-3xl bg-red-50 text-sm font-semibold text-red-600 hover:bg-red-100"
          >
            Đăng xuất
          </button>
        </div>
      </div>
    </div>
  );
}
