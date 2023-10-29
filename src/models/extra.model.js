import mongoose from 'mongoose'

// 
const extraSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    category: {
        type: String,
        required: true,
        enum: ['insurance', 'equipment']
    },
    price_per_day: {
        type: Number
    },
    price_type: {
        type: String,
        enum: ['fix', 'day']
    },
    // for deposit
    deposit_amount: {
        type: Number
    },
    deposit_excess: {
        type: Number
    },
    
    notes: {

    },

}, {timestamps: true,
    toJSON: { virtuals: true }, toObject: { virtuals: true },
    virtuals: {

    }

})

export default mongoose.models.Extras || mongoose.model('Extras', extraSchema)