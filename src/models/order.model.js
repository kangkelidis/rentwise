import mongoose from 'mongoose'
import vehicleModel from './vehicle.model'
import clientModel from './client.model'
import { autoIncrement } from 'mongoose-plugin-autoinc'
import { dateDiffInDays } from '@/lib/utils'

const orderSchema = new mongoose.Schema(
	{
		vehicle_id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Vehicle',
			required: true,
		},
		client_id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Client',
			required: true,
		},
		pick_up_date: {
			type: Date,
			required: true,
		},
		drop_off_date: {
			type: Date,
			required: true,
		},
		pick_up_location: {
			type: String,
			required: true
		},
		drop_off_location: {
			type: String,
			required: true
		},
		number: {
			type: Number,
		},
		// saves only price per day and use num_days * this to calculate car_price
		price_per_day: {
			type: Number,
		},
		extras: {
			drivers: [
				{
					first_name: {
						type: String,
					},
					last_name: {
						type: String,
					},
					license: {
						type: String,
					},
				},
			],
			other: {},
		},
		insurance: {},
		deposit: {},
	},
	{
		timestamps: true,
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
		virtuals: {
			num_days: { get() {
                return dateDiffInDays(this.pick_up_date, this.drop_off_date)
            }},
		},
	}
)

orderSchema.post('validate', async function (doc, next) {})

orderSchema.plugin(autoIncrement, { model: 'Order', field: 'number' })

export default mongoose.models.Order || mongoose.model('Order', orderSchema)
