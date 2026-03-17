// Helper to get days in a month (as numbers)
export const getDaysInMonth = (year: number, month: number) => {
  const date = new Date(year, month, 1);
  const days: number[] = [];
  while (date.getMonth() === month) {
    days.push(date.getDate());
    date.setDate(date.getDate() + 1);
  }
  return days;
};

//format vietnamese currency
export const formatVietnameseCurrency = (amount: number) => {
  return amount.toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
  });
};

// Format number with dots as thousand separators and add "đ"
export const formatAmountInput = (value: string): string => {
  // Remove all non-digit characters
  const digitsOnly = value.replace(/\D/g, "");

  if (!digitsOnly) return "";

  // Add thousand separators (dots)
  const formatted = digitsOnly.replace(/\B(?=(\d{3})+(?!\d))/g, ".");

  return `${formatted}đ`;
};

// Parse formatted amount string back to number
export const parseAmountInput = (value: string): number => {
  // Remove all non-digit characters
  const digitsOnly = value.replace(/\D/g, "");
  return digitsOnly ? parseFloat(digitsOnly) : 0;
};

// Format date as DD/MM/YYYY (using local time)
export const formatDateDDMMYYYY = (date: Date | string): string => {
  const d = typeof date === "string" ? new Date(date) : date;
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
};

// Format time as HH:mm (using local time)
export const formatTimeHHMM = (date: Date | string): string => {
  const d = typeof date === "string" ? new Date(date) : date;
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
};
