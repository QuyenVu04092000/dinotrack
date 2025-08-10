import images from "@/styles/images";
import type { IImageResponse } from "@/types/response/common/IBaseResponse";
import { addMinutes, format, set } from "date-fns";

export const handleFormatDateTime = (
  date: Date,
  hours: string,
  minutes: string,
  seconds?: string,
  milliseconds?: string,
): string => {
  const dateTime = set(date, {
    hours: parseInt(hours, 10),
    minutes: parseInt(minutes, 10),
    seconds: seconds ? parseInt(seconds, 10) : 0,
    milliseconds: milliseconds ? parseInt(milliseconds, 10) : 0,
  });

  // Lấy độ chênh lệch múi giờ local (đơn vị phút)
  const timeZoneOffset = dateTime.getTimezoneOffset();

  // Cộng hoặc trừ độ chênh lệch để chuyển về giờ UTC
  const utcDateTime = addMinutes(dateTime, timeZoneOffset);

  // Format kết quả theo chuẩn ISO với 'Z' chỉ giờ UTC
  return format(utcDateTime, "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");
};

export function formatDateToString(date: Date): string {
  const pad = (num: number): string => num.toString().padStart(2, "0");
  const padMilliseconds = (num: number): string => num.toString().padStart(3, "0");

  const year = date.getUTCFullYear();
  const month = pad(date.getUTCMonth() + 1); // Months are zero-based
  const day = pad(date.getUTCDate());
  const hours = pad(date.getUTCHours());
  const minutes = pad(date.getUTCMinutes());
  const seconds = pad(date.getUTCSeconds());
  const milliseconds = padMilliseconds(date.getUTCMilliseconds());

  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}Z`;
}

export function formatDateForUI(dateInput: Date | string): string {
  if (dateInput) {
    const padZero = (num: number): string => num.toString().padStart(2, "0");

    let date: Date;

    if (typeof dateInput === "string") {
      date = new Date(dateInput);
      const timezoneOffset = date.getTimezoneOffset();
      date.setMinutes(date.getMinutes() - timezoneOffset);
    } else {
      date = dateInput;
    }

    const hours = date.getHours();
    const minutes = padZero(date.getMinutes());
    const ampm = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12;
    const day = padZero(date.getDate());
    const month = padZero(date.getMonth() + 1);
    const year = date.getFullYear();

    return `${day}/${month}/${year} ${padZero(formattedHours)}:${minutes} ${ampm}`;
  } else {
    return "";
  }
}

export function formatDateFromAPI(dateInput: Date | string): string {
  if (dateInput) {
    const padZero = (num: number): string => num.toString().padStart(2, "0");

    let date: Date;

    if (typeof dateInput === "string") {
      date = new Date(dateInput);
    } else {
      date = dateInput;
    }

    // Lấy múi giờ hiện tại
    const localTimeOffset = date.getTimezoneOffset() - new Date().getTimezoneOffset() * 60 * 1000;
    date = new Date(date.getTime() - localTimeOffset);

    const hours = date.getHours();
    const minutes = padZero(date.getMinutes());
    const ampm = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12;
    const day = padZero(date.getDate());
    const month = padZero(date.getMonth() + 1);
    const year = date.getFullYear();

    return `${day}/${month}/${year} ${padZero(formattedHours)}:${minutes} ${ampm}`;
  } else {
    return "";
  }
}

type RoundingMode = "round" | "ceil" | "floor";

export function formatNumber(props: {
  value: number;
  decimalPlaces?: number;
  currency?: string;
  roundingMode?: RoundingMode;
  useKForThousand?: boolean;
}): string {
  const { value, decimalPlaces, currency, roundingMode, useKForThousand } = props;
  const multiplier = Math.pow(10, decimalPlaces ?? 2);
  let roundedValue: number;

  switch (roundingMode) {
    case "ceil":
      roundedValue = Math.ceil(value * multiplier) / multiplier;
      break;
    case "floor":
      roundedValue = Math.floor(value * multiplier) / multiplier;
      break;
    case "round":
    default:
      roundedValue = Math.round(value * multiplier) / multiplier;
      break;
  }

  let formattedNumber: string;

  if (useKForThousand && Math.abs(roundedValue) >= 1000) {
    roundedValue = Math.round(roundedValue / 1000); // Làm tròn và chia cho 1000
    formattedNumber = new Intl.NumberFormat("de-DE").format(roundedValue) + "K";
  } else {
    formattedNumber = new Intl.NumberFormat("de-DE", {
      minimumFractionDigits: decimalPlaces,
      maximumFractionDigits: decimalPlaces,
    }).format(roundedValue);

    // Loại bỏ các số 0 không cần thiết ở phần thập phân
    if (formattedNumber.includes(",")) {
      formattedNumber = formattedNumber.replace(/,?0+$/, "");
    }
  }

  return currency ? `${formattedNumber} ${currency}` : formattedNumber;
}

export function formatPhoneNumber(phoneNumber: string): string {
  if (phoneNumber.length === 10) {
    return phoneNumber.replace(/(\d{4})(\d{3})(\d{3})/, "$1 $2 $3");
  }

  return phoneNumber;
}

export function formatDateToDDMM(isoDateString: string): string {
  const date = new Date(isoDateString);

  // Lấy ngày và tháng
  const day = date.getUTCDate();
  const month = date.getUTCMonth() + 1; // Tháng trong JavaScript bắt đầu từ 0

  // Định dạng ngày và tháng thành chuỗi có dạng "dd/MM"
  const formattedDay = day < 10 ? "0" + day : day;
  const formattedMonth = month < 10 ? "0" + month : month;

  return `${formattedDay}/${formattedMonth}`;
}
type RoundMethod = "round" | "floor" | "ceil";

interface FormatNumberOptions {
  unit?: string;
  decimalPlaces?: number;
  roundMethod?: RoundMethod;
}

export const formatNumberProduct = (
  value: number,
  { unit = "", decimalPlaces = 2, roundMethod = "round" }: FormatNumberOptions = {},
): string => {
  const factor = Math.pow(10, decimalPlaces);

  let roundedValue;
  switch (roundMethod) {
    case "floor":
      roundedValue = Math.floor(value * factor) / factor;
      break;
    case "ceil":
      roundedValue = Math.ceil(value * factor) / factor;
      break;
    case "round":
    default:
      roundedValue = Math.round(value * factor) / factor;
  }

  const parts = roundedValue.toString().split(".");
  const integerPart = parts[0];
  const decimalPart = parts[1] ? parts[1].padEnd(decimalPlaces, "0") : "0".repeat(decimalPlaces);

  const formattedIntegerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  const formattedDecimalPart = decimalPart.length > 0 ? `,${decimalPart}` : "";

  return `${formattedIntegerPart}${formattedDecimalPart} ${unit}`.trim();
};

export async function convertImageResponseToFile(props: {
  data?: IImageResponse | null; // Cho phép data là undefined hoặc null
  fallbackSrc?: string;
  typeFallbackSrc?: string;
}): Promise<File> {
  const { data, fallbackSrc, typeFallbackSrc } = props;
  if (!data) {
    return await loadFallbackImage(fallbackSrc, typeFallbackSrc);
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL_API;
  const fullUrl = data.pathOffline ? `${baseUrl}${data.pathOffline}` : data.urlOnline ? `${data.urlOnline}` : null;

  try {
    // Thử fetch file từ URL đầy đủ
    const response = fullUrl ? await fetch(fullUrl) : null;
    if (response?.ok) {
      const fileContent = await response.blob();
      return new File([fileContent], data.title, {
        type: data.type,
        lastModified: new Date(data.createdAt).getTime(),
      });
    } else {
      throw new Error("File not found or fetch failed");
    }
  } catch (error) {
    return await loadFallbackImage(fallbackSrc, typeFallbackSrc);
  }
}

async function loadFallbackImage(fallbackSrc?: string, typeFallbackSrc?: string): Promise<File> {
  // Load ảnh fallback từ public folder
  const fallbackPath = fallbackSrc
    ? fallbackSrc.startsWith("/")
      ? fallbackSrc
      : `/${fallbackSrc}`
    : images.emptyImage; // Đảm bảo có fallback mặc định
  const fallbackUrl = `${window.location.origin}${fallbackPath}`;

  try {
    const fallbackResponse = await fetch(fallbackUrl);
    const fallbackContent = await fallbackResponse.blob();

    return new File([fallbackContent], "fallback_image", {
      type: typeFallbackSrc ?? "image/png", // Điều chỉnh MIME type của ảnh fallback
      lastModified: Date.now(),
    });
  } catch (error) {
    console.error("Error loading fallback image:", error);
    throw new Error("Unable to load fallback image");
  }
}
