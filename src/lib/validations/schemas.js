import * as z from "zod";

export const vehicleValidationSchema = z.object({
	make: z.string(),
	model: z.string(),
	year: z.coerce.number(),
	registration: z.string(),
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