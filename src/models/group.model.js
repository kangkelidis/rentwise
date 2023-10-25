import mongoose from 'mongoose'

const groupSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },

    notes: {

    },

}, {timestamps: true,
    toJSON: { virtuals: true }, toObject: { virtuals: true },

})

export default mongoose.models.Group || mongoose.model('Group', groupSchema)