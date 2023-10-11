import mongoose from 'mongoose'
import vehicleModel from './vehicle.model';
import clientModel from './client.model';

const orderSchema = new mongoose.Schema({
	vehicle_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Vehicle",
        required: true,
        unique: true
    },
    client_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Client",
        required: true,
        unique: true
    },
    pick_up_date: {
        type: Date,
        required: true,
    },
    drop_off_date: {
        type: Date,
        required: true,
    },

},{timestamps: true,
    toJSON: { virtuals: true }, toObject: { virtuals: true },
})

orderSchema.post("validate", async function (doc, next) {

  });

export default mongoose.models.Order || mongoose.model('Order', orderSchema)

