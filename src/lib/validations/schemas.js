import * as z from 'zod'

export const vehicleValidationSchema = z.object({
    make: z.string(),
    model: z.string(),
    year: z.coerce.number(),
    acquisition_date: z.coerce.date().optional().nullable(),
    registration: z.string(),
    group: z.string(),
    transmission: z.string(),
    body_type: z.string().or(z.array(z.string())),
    fuel_type: z.string(),
    fuel_amount: z.coerce.number(),
    odometer: z.coerce.number(),
    vol_engine: z.coerce.number(),
    num_seats: z.coerce.number(),
    num_doors: z.coerce.number(),
    color: z.string(),
    extras: z.string().or(z.array(z.string())),
    owner: z.string(),
    notes: z.string(),
    basic_day_rate: z.coerce.number(),
    long_term_rate: z.coerce.number(),
    default_insurance: z.string(),
})

export const orderValidationSchema = z.object({
	vehicle: z.string(),
	client: z.string(),
	pick_up_date: z.date(),
	drop_off_date: z.date(),
	pick_up_location: z.string(),
	drop_off_location: z.string(),
	extras: z.array(
		z.object({
			item: z.string(),
			count: z.number(),
			custom_price: z.number().optional(),
			normal_price: z.number().optional(),
		})
	),
	insurance: z.string(),
	client_signature: z.string(),
	extra_drivers: z.array(
		z.object({
			full_name: z.string(),
			license: z.string(),
		})
	),
	status: z.string(),
})

export const clientValidationSchema = z.object({
	full_name: z.string(),
	dob: z.date(),
	tel: z.string(),
	email: z.string().email(),
	passport: z.string(),
	license: z.string(),
	nationality: z.string(),
	address: z.string(),
	documents: z.array(z.string()).optional()
})

export const ownerValidationSchema = z.object({
	name: z.string(),
})

export const groupValidationSchema = z.object({
	name: z.string(),
})

export const equipValidationSchema = z.object({
	name: z.string(),
	category: z.enum(['equipment']),
	price_per_day: z.coerce.number(),
	price_type: z.enum(['fix', 'day']),
})

export const insuranceValidationSchema = z.object({
	name: z.string(),
	category: z.enum(['insurance']),
	price_per_day: z.coerce.number(),
	price_type: z.enum(['fix', 'day']),
	deposit_amount: z.coerce.number(),
	deposit_excess: z.coerce.number(),
})

export const settingsValidationSchema = z.object({
	company: z.object({
		name: z.string(),
		slogan: z.string(),
		address: z.object({
			line1: z.string(),
			line2: z.string()
		}),
		vat: z.string(),
		tel: z.string(),
		email: z.string(),
		website: z.string(),
		terms: z.string(),
		signature: z.string(),
		logo: z.string(),
	})
})

export const rentalsSettingsValidationSchema = z.object({
	extra_driver_price_type: z.enum(['fix', 'day']),
	extra_driver_price_per_day: z.coerce.number(),
})
