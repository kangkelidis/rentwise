import mongoose from 'mongoose'

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
    orders: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
    }],
    payments: {

    },
    fuel_level: {

    },
    odometer: {

    },
    notes: {

    },

},{timestamps: true})

export default mongoose.models.Vehicle || mongoose.model('Vehicle', vehicleSchema)

