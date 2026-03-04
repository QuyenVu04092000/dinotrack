"use client";

import { useState, useMemo } from "react";
import { useAuthContext } from "app/context/AuthContext";
import { authApi } from "app/services/authApi";
import { formatAmountInput, parseAmountInput } from "app/utilities/common/functions";
import { extractErrorMessage } from "app/lib/apiClient";

export const useSettings = () => {
  const { user, reloadProfile } = useAuthContext();

  const [balanceInput, setBalanceInput] = useState(() => {
    if (!user?.balance) return "";
    return formatAmountInput(String(user.balance));
  });

  const [startDayInput, setStartDayInput] = useState<string>(() => {
    return user?.startDayMonth ? String(user.startDayMonth) : "1";
  });

  const [isSavingBalance, setIsSavingBalance] = useState(false);
  const [isSavingStartDay, setIsSavingStartDay] = useState(false);
  const [errorBalance, setErrorBalance] = useState<string | null>(null);
  const [errorStartDay, setErrorStartDay] = useState<string | null>(null);

  const handleBalanceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const digitsOnly = value.replace(/\D/g, "");
    if (digitsOnly === "") {
      setBalanceInput("");
      return;
    }
    const formatted = formatAmountInput(digitsOnly);
    setBalanceInput(formatted);
  };

  const handleSaveBalance = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorBalance(null);
    if (!user?.id) {
      setErrorBalance("Không tìm thấy thông tin người dùng.");
      return;
    }
    const value = parseAmountInput(balanceInput);
    if (value <= 0) {
      setErrorBalance("Vui lòng nhập số tiền hợp lệ.");
      return;
    }

    setIsSavingBalance(true);
    try {
      await authApi.updateUser(user.id, value);
      await reloadProfile();
    } catch (err) {
      const message = extractErrorMessage(err);
      setErrorBalance(message || "Có lỗi xảy ra khi cập nhật số dư.");
    } finally {
      setIsSavingBalance(false);
    }
  };

  const handleSaveStartDay = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorStartDay(null);
    if (!user?.id) {
      setErrorStartDay("Không tìm thấy thông tin người dùng.");
      return;
    }
    const dayNumber = Number(startDayInput);
    if (!Number.isInteger(dayNumber) || dayNumber < 1 || dayNumber > 28) {
      setErrorStartDay("Ngày bắt đầu tháng phải từ 1 đến 28.");
      return;
    }

    setIsSavingStartDay(true);
    try {
      await authApi.updateUser(user.id, undefined, dayNumber);
      await reloadProfile();
    } catch (err) {
      const message = extractErrorMessage(err);
      setErrorStartDay(message || "Có lỗi xảy ra khi cập nhật ngày bắt đầu tháng.");
    } finally {
      setIsSavingStartDay(false);
    }
  };

  const isBalanceValid = useMemo(() => parseAmountInput(balanceInput) > 0, [balanceInput]);

  const isStartDayValid = useMemo(() => {
    const dayNumber = Number(startDayInput);
    return Number.isInteger(dayNumber) && dayNumber >= 1 && dayNumber <= 28;
  }, [startDayInput]);

  return {
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
  };
};
