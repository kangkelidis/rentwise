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

export function dateDiffInDays(a, b) {
  if (typeof a !== 'object' || typeof b !== 'object') return
  const _MS_PER_DAY = 1000 * 60 * 60 * 24;
  // Discard the time and time-zone information.
  const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
  const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

  return Math.floor((utc2 - utc1) / _MS_PER_DAY);
}