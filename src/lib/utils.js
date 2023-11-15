import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs) {
	return twMerge(clsx(inputs))
}

export function toCurrency(number, withoutCents, noSign) {
	if (isNaN(number)) return
	return number.toLocaleString(undefined, {
		style: `${noSign ? 'decimal' : 'currency'}`,
		currency: 'EUR',
		minimumFractionDigits: withoutCents ? 0 : 2,
		maximumFractionDigits: withoutCents ? 0 : 2,
	})
}

export function zeroPad(num, places) {
	return String(num).padStart(places, '0')
}

export function dateDiffInDays(a, b) {
	if (typeof a !== 'object' || typeof b !== 'object') return
	const _MS_PER_DAY = 1000 * 60 * 60 * 24
	// // Discard the time and time-zone information.
	// const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate())
	// const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate())
	return Math.ceil((b - a) / _MS_PER_DAY)
}

export function changeSingleStateValue(setter, name, value) {
	setter((prev) => {
		return {
			...prev,
			[name]: value,
		}
	})
}

export async function delay(ms) {
	await new Promise((res) => setTimeout(res, ms))
}

export function hasCustomPrice(name, prices, equip) {
	return equip
		? typeof prices.equipment?.[name]?.custom === 'number'
		: typeof prices[name]?.custom === 'number'
}
