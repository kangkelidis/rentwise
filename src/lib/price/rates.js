import { LONG_TERM_DAYS } from '@/constants'
import { dateDiffInDays, hasCustomPrice } from '../utils'

function calculatePrice(standard_rate, num_days) {
	let total = 0
	const adj = 0.7 * (1 - Math.exp(-0.045 * Math.sqrt(num_days)))

	if (num_days == 1) {
		total = (standard_rate * 150) / 100
		return Math.round(total / 5) * 5
	}
	if (num_days == 2) {
		total = (2 * standard_rate * 130) / 100
		return Math.round(total / 5) * 5
	}

	for (let i = 0; i < num_days; i++) {
		if (i < 2) {
			total += (standard_rate + (standard_rate * 5) / 100) * (1 - adj)
			continue
		}
		if (i < 4) {
			total += (standard_rate + (standard_rate * 10) / 100) * (1 - adj)
			continue
		}
		if (i < 6) {
			total += (standard_rate + (standard_rate * 2) / 100) * (1 - adj)
			continue
		}
		if (i < 10) {
			total += (standard_rate - (standard_rate * 25) / 100) * (1 - adj)
			continue
		}
		if (i < 15) {
			total += (standard_rate - (standard_rate * 30) / 100) * (1 - adj)
			continue
		}
		if (i < 20) {
			total += (standard_rate - (standard_rate * 35) / 100) * (1 - adj)
			continue
		}
		if (i < 30) {
			total += (standard_rate - (standard_rate * 40) / 100) * (1 - adj)
			continue
		}
		total += standard_rate - (standard_rate * 60) / 100
	}

	return Math.round(total / 5) * 5
}

function adjustForSeason(price, from, till) {}

function adjustForAvailability(standard_rate, from, till) {}

export function getVehiclePrice(vehicle, num_days) {
	if (vehicle && num_days) {
		// TODO: use settings long_term_cut_off
		// smooth price drop
		if (num_days <= LONG_TERM_DAYS) {
			return calculatePrice(vehicle.basic_day_rate, num_days)
		} else {
			return vehicle.long_term_rate * num_days
		}
	}
}

function getDriverPrice(drivers, num_days, settings) {
	if (drivers.length && num_days) {
		const priceType = settings.extra_driver_price_type
		const numOfDrivers = drivers.length
		const rate = settings.extra_driver_price_per_day
		const numDays = priceType === 'day' ? num_days : 1

		return numOfDrivers * rate * numDays
	}
}

function getInsurance(insurance, num_days) {
	if (!insurance) return
	if (insurance.price_per_day === 0) return 0
	if (insurance.price_type === 'fix') {
		return insurance.price_per_day
	} else {
		if (num_days) {
			return insurance.price_per_day * num_days
		}
	}
}

function getEquipPrice(equip, num_days) {
	if (equip.item.price_per_day === 0) return 0
	if (equip.item.price_type === 'fix') {
		return equip.item.price_per_day * equip.count
	} else {
		if (num_days && equip.count) {
			return equip.item.price_per_day * num_days * equip.count
		}
	}
}

export function getNormalPrices(params, settings, prev) {
	return {
		vehicle: {
			total: getVehiclePrice(params.vehicle, params.num_days),
			type: 'day',
			custom: prev.vehicle?.custom,
		},
		// [{}, ...]
		drivers: {
			total: getDriverPrice(params.drivers, params.num_days, settings),
			type: settings.extra_driver_price_type,
			custom: prev.drivers?.custom,
		},
		insurance: {
			total: getInsurance(params.insurance, params.num_days),
			type: params.insurance?.price_type,
			custom: prev.insurance?.custom,
		},
		deposit: { total: params.insurance?.deposit_amount, custom: prev.deposit?.custom },
		excess: { total: params.insurance?.deposit_excess, custom: prev.excess?.custom },
		// [{count: 1, item: {name: 'baby seat'}}, ...]
		equipment: {
			...params.equipment.reduce((res, obj) => {
				res[obj.item.name] = {
					total: getEquipPrice(obj, params.num_days),
					type: obj.item.price_type,
					custom: prev.equipment?.[obj.item.name].custom,
				}
				return res
			}, {}),
		},
	}
}

export function getTotalPrice(prices) {
	let total = 0
	Object.keys(prices).forEach((key) => {
		if (key !== 'deposit' && key !== 'excess' && key !== 'equipment') {
			total += hasCustomPrice(key, prices)
				? prices[key].custom
				: typeof prices[key]?.total === 'number'
				? prices[key].total
				: 0
		}
		if (key === 'equipment') {
			Object.keys(prices.equipment).forEach((k) => {
				total += hasCustomPrice(k, prices, true)
					? prices.equipment[k].custom
					: typeof prices.equipment?.[k].total === 'number'
					? prices.equipment[k].total
					: 0
			})
		}
	})
	return total
}
