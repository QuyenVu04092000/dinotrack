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

/**
 * Returns the first day (day=1) of the current financial period month,
 * based on the user's configured start day of month.
 *
 * @param startDayMonth - The day of month the financial period starts (e.g. 15)
 * @returns Date set to the 1st of the financial period's month (used as a month anchor)
 *
 * Example: today = 10/06, startDayMonth = 15 → period is 15/05–14/06 → returns new Date(year, 4, 1)
 */
export function getCurrentFinancialPeriodStart(startDayMonth: number): Date {
  const today = new Date();
  let year = today.getFullYear();
  let month = today.getMonth(); // 0-indexed
  if (today.getDate() < startDayMonth) {
    month -= 1;
    if (month < 0) {
      month = 11;
      year -= 1;
    }
  }
  return new Date(year, month, 1);
}
// Build an ISO 8601 string with Vietnam +07:00 offset from a YYYY-MM-DD date and
// an optional HH:mm:ss time. Defaults to current local time when time is omitted.
export const toVietnamISO = (date: string, time?: string): string => {
  const t = time ?? (() => {
    const now = new Date();
    return `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`;
  })();
  return `${date}T${t}+07:00`;
};
