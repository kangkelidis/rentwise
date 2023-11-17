import mongoose from 'mongoose'


const settingSchema = new mongoose.Schema({
    company : {
        type: {
            name: {
                type: String
            },
            slogan: {
                type: String
            },
            address: {
                type: {
                    line1: String,
                    line2: String
                }
            },
            vat: {
                type: String
            },
            tel: {
                type: String
            },
            email: {
                type: String
            },
            website: {
                type: String
            },
            terms: {
                type: String
            },
            signature: {
                type: String
            },
            logo: {
                type: String
            },
            
        }
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