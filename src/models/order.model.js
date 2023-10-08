import mongoose from 'mongoose'

const orderSchema = new mongoose.Schema({
	vehicle: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Vehicle",
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

},{timestamps: true})

export default mongoose.models.Order || mongoose.model('Order', orderSchema)

