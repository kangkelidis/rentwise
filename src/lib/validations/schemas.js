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
	notes: z.string()
})

export const orderValidationSchema = z.object({
	vehicle_id: z.string(),
    client_id: z.string(),
	pick_up_date: z.date(),
	drop_off_date: z.date(),
})

export const clientValidationSchema = z.object({
	first_name: z.string(),
    last_name: z.string(),
})

export const settingsValidationSchema = z.object({
	group: z.string(),
})

export const ownerValidationSchema = z.object({
	name: z.string(),
})