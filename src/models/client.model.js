import mongoose from 'mongoose'

const clientSchema = new mongoose.Schema({
	first_name: { 
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    // orders: [{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "Order",
    //     unique: true
    // }],

},{timestamps: true,
    toJSON: { virtuals: true }, toObject: { virtuals: true },
})

export default mongoose.models.Client || mongoose.model('Client', clientSchema)

