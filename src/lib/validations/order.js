import * as z from "zod";

export const orderValidationSchema = z.object({
	vehicle_id: z.string(),
	pick_up_date: z.date(),
	drop_off_date: z.date(),
})