import { parseISO, subHours } from "date-fns";
import type { Key } from "react";

export const checkKey = (data: any, key: Key | symbol): { check: boolean; value: any } => {
  const check = Object.keys(data).includes(String(key));
  return {
    check,
    value: check ? data[String(key)] : undefined,
  };
};

// export const calculateWholeSale=(wholeSaleConversion : number, quantityEven : number, ) : number => {}
export function generateRandomString(length: number): string {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters[randomIndex];
  }
  return result;
}

export function arraysAreEqual(arr1: string[], arr2: string[]): boolean {
  // Nếu độ dài mảng không bằng nhau, chúng không thể giống nhau
  if (arr1.length !== arr2.length) {
    return false;
  }

  // Sắp xếp hai mảng theo thứ tự từ điển
  const sortedArr1 = arr1.slice().sort();
  const sortedArr2 = arr2.slice().sort();

  // So sánh từng phần tử trong hai mảng đã được sắp xếp
  for (let i = 0; i < sortedArr1.length; i++) {
    if (sortedArr1[i] !== sortedArr2[i]) {
      return false;
    }
  }

  // Nếu tất cả các phần tử đều giống nhau, hai mảng giống nhau
  return true;
}

export function parseISOToUTCDate(isoString: string): Date {
  return subHours(parseISO(isoString), 7);
}

export function subtract7Hours(dateString: string): string {
  // Tạo đối tượng Date từ chuỗi thời gian đầu vào
  const date = new Date(dateString);

  // Trừ đi 7 giờ (7 giờ = 7 * 60 * 60 * 1000 milliseconds)
  date.setHours(date.getHours() - 7);

  // Định dạng lại thời gian thành yyyy-MM-dd'T'HH:mm:ss.SSS'Z'
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  const hours = String(date.getUTCHours()).padStart(2, "0");
  const minutes = String(date.getUTCMinutes()).padStart(2, "0");
  const seconds = String(date.getUTCSeconds()).padStart(2, "0");
  const milliseconds = String(date.getUTCMilliseconds()).padStart(3, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}Z`;
}

// function to clean object
// eslint-disable-next-line @typescript-eslint/consistent-indexed-object-style
interface AnyObject {
  [key: string]: any;
}

export function cleanObject<T extends AnyObject>(obj: T): Partial<T> {
  const cleanedObject: Partial<T> = {};

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const value = obj[key];

      // Kiểm tra giá trị không phải là "", null hoặc undefined
      if (value !== "" && value !== null && value !== undefined) {
        // Kiểm tra nếu giá trị là một mảng và không rỗng
        if (Array.isArray(value) && value.length === 0) {
          continue;
        }

        // Kiểm tra nếu giá trị là một đối tượng và không rỗng
        if (typeof value === "object" && !Array.isArray(value) && Object.keys(value).length === 0) {
          continue;
        }

        // Nếu giá trị hợp lệ, thêm vào cleanedObject
        cleanedObject[key] = value;
      }
    }
  }

  return cleanedObject;
}

export const isEmptyObject = (obj: Record<string, any>): boolean => {
  return Object.keys(obj).length === 0 && obj.constructor === Object;
};
