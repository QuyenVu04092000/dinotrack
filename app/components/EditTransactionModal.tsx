"use client";

import React from "react";
import type { TransactionResponse, UpdateTransactionRequest } from "app/types/transaction";
import type { Category, SubCategory } from "app/types/category";
import { formatAmountInput, parseAmountInput, getDaysInMonth } from "app/utilities/common/functions";

interface EditTransactionModalProps {
  transaction: TransactionResponse;
  categories: Category[];
  onSave: (id: string, payload: UpdateTransactionRequest) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onClose: () => void;
}

type ModalView = "form" | "category" | "calendar";
type ActiveType = "expense" | "income";

export function EditTransactionModal({ transaction, categories, onSave, onDelete, onClose }: EditTransactionModalProps) {
  const initDate = transaction.createdAt.split("T")[0];

  const initSubCategory = React.useMemo(() => {
    for (const cat of categories) {
      const sub = cat.subCategories.find((s) => s.id === transaction.subCategoryId);
      if (sub) return sub;
    }
    return null;
  }, [categories, transaction.subCategoryId]);

  const [view, setView] = React.useState<ModalView>("form");
  const [activeType, setActiveType] = React.useState<ActiveType>(transaction.type === "out" ? "expense" : "income");
  const [amountValue, setAmountValue] = React.useState<string>(() => formatAmountInput(String(transaction.amount)));
  const [selectedDate, setSelectedDate] = React.useState<string>(initDate);
  const [selectedCategory, setSelectedCategory] = React.useState<SubCategory | null>(initSubCategory);
  const [note, setNote] = React.useState<string>(transaction.note || "");
  const [isSaving, setIsSaving] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [confirmDelete, setConfirmDelete] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [expandedCategoryId, setExpandedCategoryId] = React.useState<string | null>(null);

  // Sync selectedCategory once categories load (in case categories weren't ready on mount)
  React.useEffect(() => {
    if (initSubCategory && !selectedCategory) {
      setSelectedCategory(initSubCategory);
    }
  }, [initSubCategory, selectedCategory]);

  // Calendar state
  const [currentMonth, setCurrentMonth] = React.useState<Date>(() => {
    const [y, m] = initDate.split("-").map(Number);
    return new Date(y, m - 1, 1);
  });
  const calendarYear = currentMonth.getFullYear();
  const calendarMonth = currentMonth.getMonth();
  const daysInMonth = getDaysInMonth(calendarYear, calendarMonth);
  const firstDayOfWeek = new Date(calendarYear, calendarMonth, 1).getDay();
  const todayIso = React.useMemo(() => new Date().toISOString().split("T")[0], []);
  const weekHeaders = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];

  const formattedDateLabel = React.useMemo(() => {
    if (!selectedDate) return "Chọn ngày";
    const [year, month, day] = selectedDate.split("-");
    return `${day}/${month}/${year}`;
  }, [selectedDate]);

  const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;
    const prevDigits = amountValue.replace(/\D/g, "");
    const newDigits = inputValue.replace(/\D/g, "");

    let effectiveDigits = newDigits;
    if (newDigits === prevDigits && inputValue !== amountValue && inputValue.length <= amountValue.length) {
      effectiveDigits = prevDigits.slice(0, -1);
    }
    setAmountValue(formatAmountInput(effectiveDigits));
  };

  const handleSave = async () => {
    setError(null);
    const amount = parseAmountInput(amountValue);
    if (!amountValue || amount <= 0) {
      setError("Vui lòng nhập số tiền hợp lệ.");
      return;
    }
    if (!selectedCategory) {
      setError("Vui lòng chọn danh mục.");
      return;
    }
    try {
      setIsSaving(true);
      await onSave(transaction.id, {
        type: activeType === "expense" ? "out" : "in",
        amount,
        categoryId: selectedCategory.categoryId,
        subCategoryId: selectedCategory.id,
        createdAt: selectedDate,
        note: note || undefined,
      });
      onClose();
    } catch (err: any) {
      setError(err?.message || "Không thể cập nhật giao dịch.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await onDelete(transaction.id);
      onClose();
    } catch (err: any) {
      setError(err?.message || "Không thể xoá giao dịch.");
      setIsDeleting(false);
      setConfirmDelete(false);
    }
  };

  const handleDayClick = (day: number) => {
    const iso = `${calendarYear}-${String(calendarMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    setSelectedDate(iso);
    setView("form");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/30 backdrop-blur-[1px]">
      <div
        className="w-full max-w-[480px] mx-auto rounded-t-[24px] bg-white"
        style={{ maxHeight: "90vh", overflow: "hidden", display: "flex", flexDirection: "column" }}
      >
        {/* FORM VIEW */}
        {view === "form" && (
          <>
            {/* Header */}
            <div className="flex items-center justify-between px-4 pt-4 pb-3 border-b border-[#EBEEF3] flex-shrink-0">
              <button type="button" onClick={onClose} aria-label="Đóng" className="p-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M15 5L5 15M5 5L15 15" stroke="#1F2532" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>
              <p className="text-[16px] font-semibold text-[#1F2532]">Chỉnh sửa giao dịch</p>
              {confirmDelete ? (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setConfirmDelete(false)}
                    className="text-xs text-[#597397] font-medium px-2 py-1 rounded-lg"
                  >
                    Huỷ
                  </button>
                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="text-xs text-white font-medium px-3 py-1 rounded-lg bg-red-500 disabled:opacity-60"
                  >
                    {isDeleting ? "..." : "Xoá"}
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setConfirmDelete(true)}
                  aria-label="Xoá giao dịch"
                  className="p-1 text-red-400"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M3 6H21M8 6V4H16V6M19 6L18.088 19.12C18.037 19.853 17.426 20.4 16.692 20.4H7.308C6.574 20.4 5.963 19.853 5.912 19.12L5 6"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path d="M10 11V17M14 11V17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </button>
              )}
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-4 pt-4 pb-6 space-y-4">
              {error && <p className="text-sm text-red-500 text-center">{error}</p>}

              {/* Type toggle */}
              <div className="flex rounded-2xl bg-slate-100 p-1">
                <button
                  type="button"
                  onClick={() => setActiveType("expense")}
                  className={`flex-1 rounded-xl py-2 text-sm font-semibold transition-colors ${
                    activeType === "expense" ? "bg-white text-[#1F2532] shadow-sm" : "text-[#597397]"
                  }`}
                >
                  Chi tiêu
                </button>
                <button
                  type="button"
                  onClick={() => setActiveType("income")}
                  className={`flex-1 rounded-xl py-2 text-sm font-semibold transition-colors ${
                    activeType === "income" ? "bg-white text-[#1F2532] shadow-sm" : "text-[#597397]"
                  }`}
                >
                  Thu nhập
                </button>
              </div>

              {/* Amount */}
              <div className="flex items-center gap-3">
                <label className="text-sm font-medium text-black w-20 flex-shrink-0">
                  {activeType === "expense" ? "Số tiền chi:" : "Số tiền:"}
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={amountValue}
                  onChange={handleAmountChange}
                  placeholder="0đ"
                  className="h-11 w-full rounded-3xl border-0 bg-slate-100 px-4 text-base text-black font-medium placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0046B0]"
                />
              </div>

              {/* Date */}
              <div className="flex items-center gap-3">
                <label className="text-sm font-medium text-black w-20 flex-shrink-0">Ngày:</label>
                <button
                  type="button"
                  onClick={() => setView("calendar")}
                  className="flex h-11 w-full items-center rounded-3xl bg-slate-100 px-4 text-sm font-medium text-black text-left"
                >
                  {formattedDateLabel}
                </button>
              </div>

              {/* Category */}
              <div className="flex items-center gap-3">
                <label className="text-sm font-medium text-black w-20 flex-shrink-0">Danh mục:</label>
                <button
                  type="button"
                  onClick={() => setView("category")}
                  className="flex h-11 w-full items-center rounded-3xl bg-slate-100 px-4 text-sm font-medium text-left"
                >
                  {selectedCategory ? (
                    <span className="text-black">
                      {selectedCategory.icon} {selectedCategory.name}
                    </span>
                  ) : (
                    <span className="text-slate-400">Chọn danh mục</span>
                  )}
                </button>
              </div>

              {/* Note */}
              <div className="flex items-center gap-3">
                <label className="text-sm font-medium text-black w-20 flex-shrink-0">Ghi chú:</label>
                <input
                  type="text"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Nhập ghi chú"
                  className="h-11 w-full rounded-3xl border-0 bg-slate-100 px-4 text-base text-black font-medium placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0046B0]"
                />
              </div>

              {/* Save button */}
              <button
                type="button"
                onClick={handleSave}
                disabled={isSaving}
                className="w-full rounded-[24px] bg-[#9CF526] py-3 text-center text-[15px] font-semibold text-[#1F2532] disabled:opacity-60"
              >
                {isSaving ? "Đang lưu..." : "Lưu thay đổi"}
              </button>
            </div>
          </>
        )}

        {/* CALENDAR VIEW */}
        {view === "calendar" && (
          <>
            <div className="flex items-center justify-between px-4 pt-4 pb-3 border-b border-[#EBEEF3] flex-shrink-0">
              <button type="button" onClick={() => setView("form")} aria-label="Quay lại" className="p-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M12.5 15L7.5 10L12.5 5" stroke="#1F2532" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <p className="text-[16px] font-semibold text-[#1F2532]">Chọn ngày</p>
              <div className="w-8" />
            </div>

            <div className="flex-1 overflow-y-auto px-4 pt-4 pb-6">
              {/* Month nav */}
              <div className="flex items-center justify-between mb-4">
                <button
                  type="button"
                  onClick={() => setCurrentMonth((m) => new Date(m.getFullYear(), m.getMonth() - 1, 1))}
                  className="bg-[#EDEEF1] rounded-full p-1"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M12.5 15L7.5 10L12.5 5" stroke="#090A0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                <p className="text-sm font-semibold text-[#1F2532]">
                  {String(calendarMonth + 1).padStart(2, "0")}/{calendarYear}
                </p>
                <button
                  type="button"
                  onClick={() => setCurrentMonth((m) => new Date(m.getFullYear(), m.getMonth() + 1, 1))}
                  className="bg-[#EDEEF1] rounded-full p-1"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M7.5 15L12.5 10L7.5 5" stroke="#090A0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>

              {/* Weekday headers */}
              <div className="grid grid-cols-7 mb-2">
                {weekHeaders.map((d) => (
                  <div key={d} className="text-center text-xs font-medium text-[#597397] py-1">
                    {d}
                  </div>
                ))}
              </div>

              {/* Days */}
              <div className="grid grid-cols-7 gap-y-1">
                {Array.from({ length: firstDayOfWeek }).map((_, i) => (
                  <div key={`empty-${i}`} />
                ))}
                {daysInMonth.map((day) => {
                  const dayIso = `${calendarYear}-${String(calendarMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                  const isSelected = dayIso === selectedDate;
                  const isToday = dayIso === todayIso;
                  const isFuture = dayIso > todayIso;
                  return (
                    <button
                      key={day}
                      type="button"
                      onClick={() => !isFuture && handleDayClick(day)}
                      disabled={isFuture}
                      className={`mx-auto flex h-9 w-9 items-center justify-center rounded-full text-sm font-medium transition-colors ${
                        isSelected
                          ? "bg-[#0046B0] text-white"
                          : isToday
                            ? "border border-[#0046B0] text-[#0046B0]"
                            : isFuture
                              ? "text-[#B6BAC3]"
                              : "text-[#1F2532] hover:bg-[#F0F4FF]"
                      }`}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {/* CATEGORY VIEW */}
        {view === "category" && (
          <>
            <div className="flex items-center justify-between px-4 pt-4 pb-3 border-b border-[#EBEEF3] flex-shrink-0">
              <button type="button" onClick={() => setView("form")} aria-label="Quay lại" className="p-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M12.5 15L7.5 10L12.5 5" stroke="#1F2532" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <p className="text-[16px] font-semibold text-[#1F2532]">Chọn danh mục</p>
              <div className="w-8" />
            </div>

            <div className="flex-1 overflow-y-auto px-4 pt-3 pb-6 space-y-2">
              {categories.map((cat) => (
                <div key={cat.id} className="space-y-1">
                  <button
                    type="button"
                    onClick={() => setExpandedCategoryId(expandedCategoryId === cat.id ? null : cat.id)}
                    className="flex w-full items-center justify-between rounded-xl bg-[#F8FAFC] px-3 py-2.5"
                  >
                    <span className="text-sm font-semibold text-[#3B4D69]">
                      {cat.icon} {cat.name}
                    </span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 20 20"
                      fill="none"
                      className={`transition-transform flex-shrink-0 ${expandedCategoryId === cat.id ? "rotate-180" : ""}`}
                    >
                      <path d="M5 7.5L10 12.5L15 7.5" stroke="#B6BAC3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                  {expandedCategoryId === cat.id && (
                    <div className="flex flex-wrap gap-2 px-2 pb-2">
                      {cat.subCategories.map((sub) => {
                        const isSelected = selectedCategory?.id === sub.id;
                        return (
                          <button
                            key={sub.id}
                            type="button"
                            onClick={() => {
                              setSelectedCategory(sub);
                              setView("form");
                            }}
                            className={`flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium transition-colors ${
                              isSelected ? "bg-[#E0F5FE] text-[#1F2532]" : "bg-[#EDEEF1] text-[#3B4D69]"
                            }`}
                          >
                            <span>{sub.icon}</span>
                            <span>{sub.name}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
