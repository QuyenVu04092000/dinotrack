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
/**
 * Formats a month anchor as the `YYYY-MM` value the budget API expects.
 *
 * @param monthAnchor - Any date in the target month (normally day 1)
 */
export function toMonthParam(monthAnchor: Date): string {
  return `${monthAnchor.getFullYear()}-${String(monthAnchor.getMonth() + 1).padStart(2, "0")}`;
}

/**
 * Parses a `YYYY-MM` string into a month anchor (day 1), or returns null when malformed.
 *
 * @param value - Month string such as "2026-08"
 */
export function parseMonthParam(value: string | null | undefined): Date | null {
  const match = value?.match(/^(\d{4})-(0[1-9]|1[0-2])$/);
  if (!match) return null;
  return new Date(Number(match[1]), Number(match[2]) - 1, 1);
}

/**
 * Builds the financial period label for a month, e.g. "Tháng 8 (10/8-09/9)".
 * Periods outside the current calendar year include the year: "Tháng 1/2027 (01/1-31/1)".
 *
 * @param monthAnchor - Any date in the period's month (normally day 1)
 * @param startDayMonth - The day of month the financial period starts
 */
export function formatFinancialPeriodLabel(monthAnchor: Date, startDayMonth: number): string {
  const year = monthAnchor.getFullYear();
  const monthIndex = monthAnchor.getMonth();
  const startDate = new Date(year, monthIndex, startDayMonth);
  const endDate = new Date(year, monthIndex + 1, startDayMonth - 1);
  const d1 = String(startDate.getDate()).padStart(2, "0");
  const d2 = String(endDate.getDate()).padStart(2, "0");
  const yearSuffix = year === new Date().getFullYear() ? "" : `/${year}`;
  return `Tháng ${monthIndex + 1}${yearSuffix} (${d1}/${startDate.getMonth() + 1}-${d2}/${endDate.getMonth() + 1})`;
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
