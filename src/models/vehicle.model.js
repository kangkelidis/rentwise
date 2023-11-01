import mongoose from 'mongoose'
import orderModel from './order.model'
import { 
    TRANSMISSION, 
    BODY_TYPES,
    EXTRAS, 
    FUEL_TYPES, } from '@/constants'

import { autoIncrement } from 'mongoose-plugin-autoinc';


const vehicleSchema = new mongoose.Schema({
    make: {
        type: String,
        required: true,
    },
    model: {
        type: String,
        required: true
    },
    year: {
        type: Number,
        min: [1900, 'Must be after 1900'],
        max: [2100, 'Must be before 2100'],
        required: true,
    },
	registration: {
		type: String,
        required: true,
        unique: true
	},
    group: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Group",
        required: true,
    },
    transmission: {
        type: String,
        enum: [...TRANSMISSION, '']
    },
    body_type: {
        type: [String],
        enum: [...BODY_TYPES, '']
    },
    fuel_type: {
        type: String,
        enum: [...FUEL_TYPES, '']
    },
    fuel_amount: {
        type: Number
    },
    vol_engine: {
        type: Number,
    },
    num_seats: {
        type: Number,
    },
    num_doors: {
        type: Number,
    },
    color: {
        type: String,
    },
    extras: {
        type: [String],
        enum: [...EXTRAS, '']
    },
    photos: {
        type: [String]

    },
    thumb: {
        type: Number
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Owner",
        required: true, 
    },
    insurance: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Extras",
    },
    current_location: {
        type: String
    },
    payments: {

    },
    fuel_level: {
        type: Number
    },
    odometer: {
        type: Number
    },
    notes: {

    },
    basic_day_rate: {
        type: Number,
        required: true
    },
    long_term_rate: {
        type: Number,
    },
    number: {
        type: Number,
    }

}, {timestamps: true,
    toJSON: { virtuals: true }, toObject: { virtuals: true },
    virtuals: {

        // orders: { async get() {
        //     return await orderModel.find({vehicle: this._id}).select(["pick_up_date", "drop_off_date"]).exec()
        // }},
        // current_active_order: { async get() {
        //     const today = new Date()
        //     return this.orders.find(order => order.pick_up_date <= today && order.drop_off_date >= today) 
        // }},

        // future_orders: { get() {
        //     const today = new Date()
        //     return this.orders.filter(order => order.pick_up_date >= today)
        //             .sort((a,b) => a.pick_up_date - b.pick_up_date)
        // }},

        // next_pick_up_date: { get() {
        //     return this.future_orders.length > 0 ? this.future_orders[0].pick_up_date : null
        // }},

        // next_drop_of_date: { get() {
        //     if (this.current_active_order) {
        //         return this.current_active_order.drop_off_date
        //     } else {
        //         return this.future_orders.length > 0 ? this.future_orders[0].drop_off_date : null
        //     }
        // }}
    }
})


// TODO refactor / simplify logic
vehicleSchema.methods.isAvailableDuring = async function (from, till) {
    const orders = await orderModel.find({vehicle: this._id}).select(["pick_up_date", "drop_off_date"]).exec()
    
    const today = new Date()
    const current_active_order = orders
    .find(order => order.pick_up_date <= today && order.drop_off_date >= today) 
    const future_orders = orders
    .filter(order => order.pick_up_date >= today)
    .sort((a,b) => a.pick_up_date - b.pick_up_date)
    
    let conflict
    // check if currently on rent
    if (current_active_order) {
        conflict = 
        current_active_order.pick_up_date <= till && 
        current_active_order.drop_off_date >= from
    }
    if (conflict) {
        return false
    } else {
        conflict = future_orders.
            some(order => order.pick_up_date <= till && order.drop_off_date >= from)
        return !conflict
    }
}

vehicleSchema.plugin(autoIncrement, { model: 'Vehicle', field: 'number' });

export default mongoose.models.Vehicle || mongoose.model('Vehicle', vehicleSchema)

