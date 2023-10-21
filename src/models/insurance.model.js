import mongoose from 'mongoose'

const insuranceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    group: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Group",
        required: true,
    },
    value: {
        type: Number,
    },
    deposit_price: {
        type: Number,
    },
    damage_price: {
        type: Number,
    },
    notes: {

    },

}, {timestamps: true,
    toJSON: { virtuals: true }, toObject: { virtuals: true },

})


export default mongoose.models.Insurance || mongoose.model('Insurance', groupSchema)

