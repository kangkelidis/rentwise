import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export function toCurrency(number, withoutCents) {
  if (isNaN(number)) return;
  return number.toLocaleString(undefined, {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: withoutCents ? 0 : 2,
    maximumFractionDigits: withoutCents ? 0 : 2,
  });
}

export function zeroPad(num, places) {
  return String(num).padStart(places, '0')
}