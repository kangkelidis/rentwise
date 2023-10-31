import mongoose from 'mongoose'
import vehicleModel from './vehicle.model'
import clientModel from './client.model'
import { autoIncrement } from 'mongoose-plugin-autoinc'
import { dateDiffInDays } from '@/lib/utils'

const orderSchema = new mongoose.Schema(
	{
		vehicle: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Vehicle',
			required: true,
		},
		client: {
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
			required: true,
		},
		drop_off_location: {
			type: String,
			required: true,
		},
		number: {
			type: Number,
		},
		// saves only price per day and use num_days * this to calculate car_price
		price_per_day: {
			type: Number,
		},
		extra_drivers: {
			type: [
				{
					full_name: {
						type: String,
					},
					license: {
						type: String,
					},
				},
			],
		},

		extras: [
			{
				item: {
					type: mongoose.Schema.Types.ObjectId,
					ref: 'Extras',
				},
				count: {
					type: Number,
					default: 0,
				},
			},
		],

		insurance: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Extras',
		},
		client_signature: {
			type: String,
		},
	},
	{
		timestamps: true,
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
		virtuals: {
			num_days: {
				get() {
					return dateDiffInDays(this.pick_up_date, this.drop_off_date)
				},
			},
			car_total: {
				get() {
					return this.price_per_day * this.num_days
				},
			},
			car_vat: {
				get() {
					return (this.car_total * 19) / 100
				},
			},
		},
	}
)

orderSchema.post('validate', async function (doc, next) {})

orderSchema.plugin(autoIncrement, { model: 'Order', field: 'number' })

export default mongoose.models.Order || mongoose.model('Order', orderSchema)
