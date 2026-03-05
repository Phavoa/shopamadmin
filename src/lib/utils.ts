import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatNaira = (amount: string | number | undefined): string => {
  if (amount === undefined || amount === null) return "₦0";
  const naira = typeof amount === "string" ? Number(amount) : amount;
  return `₦${naira.toLocaleString("en-NG")}`;
};

export const koboToNaira = (kobo: string | number | undefined): number => {
  if (!kobo) return 0;
  return Number(kobo) / 100;
};

export const nairaToKobo = (naira: string | number | undefined): number => {
  if (naira === undefined || naira === null || naira === "") return 0;
  if (typeof naira === "number") return Math.round(naira * 100);
  
  // Strip everything except numbers and decimal point
  const cleanStr = naira.toString().replace(/[^\d.]/g, "");
  const val = parseFloat(cleanStr);
  return isNaN(val) ? 0 : Math.round(val * 100);
};
