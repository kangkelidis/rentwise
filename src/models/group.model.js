import mongoose from 'mongoose'

const groupSchema = new mongoose.Schema({
    group: {
        type: String,
        required: true
    },

    notes: {

    },

}, {timestamps: true,
    toJSON: { virtuals: true }, toObject: { virtuals: true },

})


export default mongoose.models.Group || mongoose.model('Group', groupSchema)

