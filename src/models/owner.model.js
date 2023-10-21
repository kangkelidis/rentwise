import mongoose from 'mongoose'

const ownerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    notes: {

    },

}, {timestamps: true,
    toJSON: { virtuals: true }, toObject: { virtuals: true },

})


export default mongoose.models.Owner || mongoose.model('Owner', ownerSchema)

