import * as z from "zod";

export const vehicleValidationSchema = z.object({
	make: z.string(),
	model: z.string(),
	year: z.coerce.number(),
	registration: z.string(),
})