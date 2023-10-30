import * as z from "zod";

export const vehicleValidationSchema = z.object({
	make: z.string(),
	model: z.string(),
	year: z.coerce.number(),
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
	basic_day_rate: z.coerce.number()
})

export const orderValidationSchema = z.object({
	vehicle: z.string(),
    client: z.string(),
	pick_up_date: z.date(),
	drop_off_date: z.date(),
	pick_up_location: z.string(),
	drop_off_location: z.string(),
	extras: z.array(z.string()),
	insurance: z.string(),
})

export const clientValidationSchema = z.object({
	first_name: z.string(),
    last_name: z.string(),
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
	company_name: z.string(),
	// company_signature: z.string()
})