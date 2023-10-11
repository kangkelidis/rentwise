import mongoose from 'mongoose'
import orderModel from './order.model'

const vehicleSchema = new mongoose.Schema({
	registration: {
		type: String,
        required: true,
        unique: true
	},
    year: {
		type: Number,
        min: [1900, 'Must be after 1900'],
        max: [2100, 'Must be before 2100'],
        required: true,
	},
    make: {
        type: String,
        required: true,
    },
    model: {
        type: String,
        required: true
    },
    group: {

    },
    body_type: {
        type: [String],
    },
    fuel: {

    },
    vol_engine: {

    },
    transmission: {

    },
    num_seats: {

    },
    num_doors: {

    },
    color: {

    },
    options: {

    },
    photos: {

    },
    thumb: {

    },
    owner: {

    },
    insurance: {

    },
    current_location: {

    },
    // orders: [{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "Order",
    //     unique: true
    // }],
    payments: {

    },
    fuel_level: {

    },
    odometer: {

    },
    notes: {

    },

}, {timestamps: true,
    toJSON: { virtuals: true }, toObject: { virtuals: true },
    virtuals: {
        // orders: { async get() {
        //     return await orderModel.find({vehicle_id: this._id}).select(["pick_up_date", "drop_off_date"]).exec()
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
    const orders = await orderModel.find({vehicle_id: this._id}).select(["pick_up_date", "drop_off_date"]).exec()
    
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

export default mongoose.models.Vehicle || mongoose.model('Vehicle', vehicleSchema)

