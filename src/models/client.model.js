import mongoose from 'mongoose'
import { autoIncrement } from 'mongoose-plugin-autoinc';

const clientSchema = new mongoose.Schema({
	full_name: { 
        type: String,
        // required: true
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
    number: {
        type: Number,
    },
    license: {
        type: String,
        // required: true
    },
    nationality: {
        // country code
        type: String
    },
    address: {
        type: String
    },
    documents: {
        // images
        type: [String]
    }



},{timestamps: true,
    toJSON: { virtuals: true }, toObject: { virtuals: true },
    virtuals: {

    }
})

clientSchema.plugin(autoIncrement, { model: 'Client', field: 'number' });

export default mongoose.models.Client || mongoose.model('Client', clientSchema)

