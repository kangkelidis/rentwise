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

export function discardTime(date) {
	if (typeof date !== 'object') return
	return new Date(date.toDateString())
}

export function dateDiffInDays(a, b) {
	if (typeof a !== 'object' || typeof b !== 'object') return
	const _MS_PER_DAY = 1000 * 60 * 60 * 24
	return Math.ceil((b - a) / _MS_PER_DAY)
}

export function formatDateDifference(a, b) {
	if (typeof a !== 'object' || typeof b !== 'object') return

	const milliseconds = b - a
	let seconds = milliseconds / 1000
	let minutes = seconds / 60
	let hours = minutes / 60
	let days = hours / 24
	let weeks = days / 7

	const formattedTimeParts = []

	if (weeks >= 1) {
		const weeksPart =
			Math.floor(weeks) + ' week' + (Math.floor(weeks) > 1 ? 's' : '')
		formattedTimeParts.push(weeksPart)
		days -= Math.floor(weeks) * 7
	}

	if (days >= 1) {
		const daysPart =
			Math.floor(days) + ' day' + (Math.floor(days) > 1 ? 's' : '')
		formattedTimeParts.push(daysPart)
		hours -= Math.floor(days) * 24
	}

	if (hours >= 1) {
		const hoursPart =
			Math.floor(hours) + ' hour' + (Math.floor(hours) > 1 ? 's' : '')
		formattedTimeParts.push(hoursPart)
		minutes -= Math.floor(hours) * 60
	}

	if (minutes >= 1) {
		const minutesPart =
			Math.floor(minutes) + ' minute' + (Math.floor(minutes) > 1 ? 's' : '')
		formattedTimeParts.push(minutesPart)
	}

	if (formattedTimeParts.length === 0) {
		return null
	}

	return 'In ' + formattedTimeParts.join(', ')
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
