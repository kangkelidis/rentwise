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
    dob: {
        type: Date,

    },
    tel: {
        type: String
    },
    email: {
        type: String
    },
    passport: {
        type: String
    },
    id: {
        type: String,
    },
    license: {
        type: String,
    },
    nationality: {
        type: String
    },
    address: {
        type: String
    },


},{timestamps: true,
    toJSON: { virtuals: true }, toObject: { virtuals: true },
})

export default mongoose.models.Client || mongoose.model('Client', clientSchema)

