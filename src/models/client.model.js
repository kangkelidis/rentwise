import mongoose from 'mongoose'
import { autoIncrement } from 'mongoose-plugin-autoinc';

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
    number: {
        type: Number,
    },
    license: {
        type: String,
        required: true
    },
    nationality: {
        type: String
    },
    address: {
        type: String
    },


},{timestamps: true,
    toJSON: { virtuals: true }, toObject: { virtuals: true },
    virtuals: {
        full_name: {get() {
            return this.first_name + ' ' + this.last_name
        }}
    }
})

clientSchema.plugin(autoIncrement, { model: 'Client', field: 'number' });

export default mongoose.models.Client || mongoose.model('Client', clientSchema)

