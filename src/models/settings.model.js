import mongoose from 'mongoose'


const settingSchema = new mongoose.Schema({
    company_name: {
        type: String
    },
    company_signature: {
        type: String
    },
    company_logo: {
        type: String
    },
    users: {
        // TODO : use array
        type: String
    },
    extra_driver_price_per_day: {
        type: Number
    },
    extra_driver_price_type: {
        type: String,
        enum: ['fix', 'day']
    },
    long_term_cut_off: {
        type: Number,
    }


}, {timestamps: true,
    toJSON: { virtuals: true }, toObject: { virtuals: true },
    virtuals: {

    }

})

export default mongoose.models.Settings || mongoose.model('Settings', settingSchema)